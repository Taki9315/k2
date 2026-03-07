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

/**
 * POST /api/deal-room/deals/password — set or remove a password for a deal
 * Body: { dealId, password } — password=null to remove
 */
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();
  const body = await request.json();
  const { dealId, password } = body;

  if (!dealId) {
    return NextResponse.json({ error: 'Missing dealId' }, { status: 400 });
  }

  // Verify ownership
  const { data: deal } = await supabase
    .from('deals')
    .select('*')
    .eq('id', dealId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!deal) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
  }

  const passwordHash = password ? await hashPassword(password) : null;

  const { error, data: updateData } = await supabase
    .from('deals')
    .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
    .eq('id', dealId)
    .select();

  if (error) {
    console.error('Password update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Verify the update actually persisted
  if (!updateData || updateData.length === 0) {
    console.error('Password update returned no rows - column may not exist');
    return NextResponse.json({ error: 'Failed to save password' }, { status: 500 });
  }

  return NextResponse.json({ success: true, hasPassword: !!password });
}
