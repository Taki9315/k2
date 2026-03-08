import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

// Simple hash function for password (using Web Crypto)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'k2-deal-room-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Check if current user has deal-room access (kit buyers + certified + admin) */
async function checkAccess(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, preferred, workbook_purchased')
    .eq('id', userId)
    .maybeSingle();

  return (
    profile?.role === 'certified' ||
    profile?.preferred === true ||
    profile?.role === 'admin' ||
    profile?.workbook_purchased === true
  );
}

async function ensureDealsTable(supabase: ReturnType<typeof createServiceRoleClient>) {
  const { error } = await supabase.from('deals').select('id').limit(0);
  if (error && error.message.includes('does not exist')) {
    await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS deals (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          name text NOT NULL,
          password_hash text,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_deals_user ON deals(user_id);
        ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
        CREATE POLICY IF NOT EXISTS "service_role_full_deals"
          ON deals FOR ALL TO service_role USING (true) WITH CHECK (true);
      `,
    }).then(({ error: rpcErr }) => {
      if (rpcErr) console.error('Could not auto-create deals table:', rpcErr.message);
    });
  }
}

/**
 * GET  /api/deal-room/deals           — list all deals for authenticated user
 * POST /api/deal-room/deals           — create a new deal { name }
 * DELETE /api/deal-room/deals?dealId=x — delete a deal (and its files)
 */
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();
  if (!(await checkAccess(supabase, user.id))) {
    return NextResponse.json({ error: 'Certified Borrower access required' }, { status: 403 });
  }

  await ensureDealsTable(supabase);

  const { data: deals, error } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    if (error.message.includes('does not exist')) {
      return NextResponse.json({ deals: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // For each deal, get file count
  const dealsWithCounts = await Promise.all(
    (deals || []).map(async (deal) => {
      const { count } = await supabase
        .from('deal_room_files')
        .select('id', { count: 'exact', head: true })
        .eq('deal_id', deal.id);

      return {
        id: deal.id,
        name: deal.name,
        hasPassword: !!deal.password_hash,
        fileCount: count || 0,
        created_at: deal.created_at,
        updated_at: deal.updated_at,
      };
    })
  );

  return NextResponse.json({ deals: dealsWithCounts });
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();
  if (!(await checkAccess(supabase, user.id))) {
    return NextResponse.json({ error: 'Certified Borrower access required' }, { status: 403 });
  }

  await ensureDealsTable(supabase);

  const body = await request.json();
  const name = body.name?.trim();
  const password = body.password?.trim();
  if (!name) {
    return NextResponse.json({ error: 'Deal name is required' }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: 'Password is required for all deals' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  const { data: deal, error } = await supabase
    .from('deals')
    .insert({ user_id: user.id, name, password_hash: passwordHash })
    .select()
    .single();

  if (error) {
    console.error('Create deal error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deal });
}

export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dealId = request.nextUrl.searchParams.get('dealId');
  if (!dealId) {
    return NextResponse.json({ error: 'Missing dealId' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Verify ownership
  const { data: deal } = await supabase
    .from('deals')
    .select('id, user_id')
    .eq('id', dealId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!deal) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
  }

  // Delete all files from storage for this deal
  const { data: files } = await supabase
    .from('deal_room_files')
    .select('file_path')
    .eq('deal_id', dealId);

  if (files && files.length > 0) {
    await supabase.storage
      .from('documents')
      .remove(files.map((f) => f.file_path));
  }

  // Delete deal (cascades to files and share tokens)
  await supabase.from('deals').delete().eq('id', dealId);

  return NextResponse.json({ success: true });
}
