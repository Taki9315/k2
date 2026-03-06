import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

/**
 * POST /api/deal-room/share — Generate a shareable link for the user's deal room
 * GET  /api/deal-room/share?token=xxx — Validate a share token and return file list
 */

async function ensureShareTokensTable(supabase: ReturnType<typeof createServiceRoleClient>) {
  const { error } = await supabase
    .from('deal_room_share_tokens')
    .select('id')
    .limit(0);

  if (error && error.message.includes('does not exist')) {
    await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS deal_room_share_tokens (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid NOT NULL REFERENCES profiles(id),
          token text NOT NULL UNIQUE,
          expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
          revoked boolean NOT NULL DEFAULT false,
          created_at timestamptz DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_share_tokens_token ON deal_room_share_tokens(token);
        CREATE INDEX IF NOT EXISTS idx_share_tokens_user ON deal_room_share_tokens(user_id);
        ALTER TABLE deal_room_share_tokens ENABLE ROW LEVEL SECURITY;
        CREATE POLICY IF NOT EXISTS "service_role_full_share_tokens"
          ON deal_room_share_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);
      `,
    }).then(({ error: rpcErr }) => {
      if (rpcErr) console.error('Could not auto-create deal_room_share_tokens table:', rpcErr.message);
    });
  }
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();

  // Verify user is certified borrower or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, preferred, workbook_purchased')
    .eq('id', user.id)
    .maybeSingle();

  const hasAccess =
    profile?.role === 'certified' ||
    profile?.preferred === true ||
    profile?.role === 'admin';

  if (!hasAccess) {
    return NextResponse.json({ error: 'Certified Borrower access required' }, { status: 403 });
  }

  await ensureShareTokensTable(supabase);

  // Revoke any existing active tokens for this user
  await supabase
    .from('deal_room_share_tokens')
    .update({ revoked: true })
    .eq('user_id', user.id)
    .eq('revoked', false);

  // Generate a new token
  const token = generateToken();
  const { data: shareRecord, error: insertError } = await supabase
    .from('deal_room_share_tokens')
    .insert({
      user_id: user.id,
      token,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error creating share token:', insertError);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }

  const shareUrl = `${request.nextUrl.origin}/dashboard/deal-room/shared?token=${token}`;

  return NextResponse.json({
    shareUrl,
    expiresAt: shareRecord.expires_at,
    token,
  });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  await ensureShareTokensTable(supabase);

  // Look up the token
  const { data: shareRecord } = await supabase
    .from('deal_room_share_tokens')
    .select('*')
    .eq('token', token)
    .eq('revoked', false)
    .maybeSingle();

  if (!shareRecord) {
    return NextResponse.json({ error: 'Invalid or expired share link' }, { status: 404 });
  }

  // Check expiry
  if (new Date(shareRecord.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Share link has expired' }, { status: 410 });
  }

  // Get the user's files
  const { data: files, error } = await supabase
    .from('deal_room_files')
    .select('id, file_name, file_size, mime_type, category, created_at')
    .eq('user_id', shareRecord.user_id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to load files' }, { status: 500 });
  }

  // Get the owner's name
  const { data: ownerProfile } = await supabase
    .from('profiles')
    .select('full_name, company')
    .eq('id', shareRecord.user_id)
    .maybeSingle();

  return NextResponse.json({
    files: files || [],
    owner: {
      name: ownerProfile?.full_name || 'K2 Member',
      company: ownerProfile?.company || null,
    },
    expiresAt: shareRecord.expires_at,
  });
}
