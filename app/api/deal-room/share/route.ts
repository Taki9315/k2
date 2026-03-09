import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

/**
 * POST /api/deal-room/share — Generate a shareable link for a specific deal
 * GET  /api/deal-room/share?token=xxx — Validate token and return file list
 * PUT  /api/deal-room/share — Verify password for password-protected deal
 */

/** Share tokens expire 45 days after creation. Computed from created_at. */
const SHARE_TOKEN_LIFETIME_MS = 45 * 24 * 60 * 60 * 1000;

function getTokenExpiresAt(createdAt: string): Date {
  return new Date(new Date(createdAt).getTime() + SHARE_TOKEN_LIFETIME_MS);
}

function isTokenExpired(createdAt: string): boolean {
  return getTokenExpiresAt(createdAt) < new Date();
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'k2-deal-room-salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
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

  const body = await request.json().catch(() => ({}));
  const dealId = body.dealId;

  if (!dealId) {
    return NextResponse.json({ error: 'dealId is required' }, { status: 400 });
  }

  // Verify deal belongs to user
  const { data: deal } = await supabase
    .from('deals')
    .select('*')
    .eq('id', dealId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!deal) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
  }

  // Delete any existing tokens for this deal (avoids unique constraint issues)
  await supabase
    .from('deal_room_share_tokens')
    .delete()
    .eq('deal_id', dealId);

  // Generate a new token — only insert columns that exist in the table
  const token = generateToken();
  const { data: shareRecord, error: insertError } = await supabase
    .from('deal_room_share_tokens')
    .insert({
      user_id: user.id,
      deal_id: dealId,
      token,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error creating share token:', insertError);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }

  const shareUrl = `${request.nextUrl.origin}/dashboard/deal-room/shared?token=${token}`;
  const expiresAt = getTokenExpiresAt(shareRecord.created_at).toISOString();

  return NextResponse.json({
    shareUrl,
    expiresAt,
    token,
  });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Look up the token
  const { data: shareRecord } = await supabase
    .from('deal_room_share_tokens')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (!shareRecord) {
    return NextResponse.json({ error: 'Invalid or expired share link' }, { status: 404 });
  }

  // Check expiry (computed from created_at + 7 days)
  if (isTokenExpired(shareRecord.created_at)) {
    return NextResponse.json({ error: 'Share link has expired' }, { status: 410 });
  }

  // Get the deal info (including password check from the deals table)
  let dealName = 'Deal Room';
  let isPasswordProtected = false;
  if (shareRecord.deal_id) {
    // Use select('*') to avoid PostgREST schema cache issues with specific column names
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*')
      .eq('id', shareRecord.deal_id)
      .maybeSingle();

    // Fail closed: if we can't verify the deal, deny access
    if (dealError) {
      console.error('Error fetching deal for password check:', dealError);
      return NextResponse.json({ error: 'Unable to verify deal access' }, { status: 500 });
    }

    if (deal) {
      dealName = deal.name || 'Deal Room';
      isPasswordProtected = !!deal.password_hash;
    }
  }

  // If password-protected, require password before showing any data
  if (isPasswordProtected) {
    return NextResponse.json({
      requiresPassword: true,
      dealName: null,
    });
  }

  // Get the user's files for this deal
  let filesQuery = supabase
    .from('deal_room_files')
    .select('*')
    .eq('user_id', shareRecord.user_id)
    .order('created_at', { ascending: false });

  if (shareRecord.deal_id) {
    filesQuery = filesQuery.eq('deal_id', shareRecord.deal_id);
  }

  const { data: files, error } = await filesQuery;

  if (error) {
    return NextResponse.json({ error: 'Failed to load files' }, { status: 500 });
  }

  // Get the owner's name
  const { data: ownerProfile } = await supabase
    .from('profiles')
    .select('full_name, company, role, membership_number')
    .eq('id', shareRecord.user_id)
    .maybeSingle();

  return NextResponse.json({
    files: files || [],
    dealName,
    owner: {
      name: ownerProfile?.full_name || 'K2 Member',
      company: ownerProfile?.company || null,
      isCertified: ownerProfile?.role === 'certified',
      membershipNumber: ownerProfile?.membership_number || null,
    },
    expiresAt: getTokenExpiresAt(shareRecord.created_at).toISOString(),
  });
}

/** PUT — verify password for a password-protected share link */
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { token, password } = body;

  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password required' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Look up the token
  const { data: shareRecord } = await supabase
    .from('deal_room_share_tokens')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (!shareRecord) {
    return NextResponse.json({ error: 'Invalid or expired share link' }, { status: 404 });
  }

  // Check expiry (computed from created_at + 7 days)
  if (isTokenExpired(shareRecord.created_at)) {
    return NextResponse.json({ error: 'Share link has expired' }, { status: 410 });
  }

  // Get the deal and verify password against the deal's current password
  let dealName = 'Deal Room';
  if (shareRecord.deal_id) {
    // Use select('*') to avoid PostgREST schema cache issues with specific column names
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*')
      .eq('id', shareRecord.deal_id)
      .maybeSingle();

    // Fail closed: if we can't verify the deal, deny access
    if (dealError) {
      console.error('Error fetching deal for password verification:', dealError);
      return NextResponse.json({ error: 'Unable to verify deal access' }, { status: 500 });
    }

    if (deal) {
      dealName = deal.name || 'Deal Room';
      // Verify password against the deal's current password_hash
      if (deal.password_hash) {
        const inputHash = await hashPassword(password);
        if (inputHash !== deal.password_hash) {
          return NextResponse.json({ error: 'Incorrect password' }, { status: 403 });
        }
      }
    } else {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
  }

  let filesQuery = supabase
    .from('deal_room_files')
    .select('*')
    .eq('user_id', shareRecord.user_id)
    .order('created_at', { ascending: false });

  if (shareRecord.deal_id) {
    filesQuery = filesQuery.eq('deal_id', shareRecord.deal_id);
  }

  const { data: files } = await filesQuery;

  const { data: ownerProfile } = await supabase
    .from('profiles')
    .select('full_name, company, role, membership_number')
    .eq('id', shareRecord.user_id)
    .maybeSingle();

  return NextResponse.json({
    files: files || [],
    dealName,
    owner: {
      name: ownerProfile?.full_name || 'K2 Member',
      company: ownerProfile?.company || null,
      isCertified: ownerProfile?.role === 'certified',
      membershipNumber: ownerProfile?.membership_number || null,
    },
    expiresAt: getTokenExpiresAt(shareRecord.created_at).toISOString(),
  });
}
