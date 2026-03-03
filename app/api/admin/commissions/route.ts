import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

/**
 * GET /api/admin/commissions
 * Returns all referral commissions for admin dashboard.
 *
 * POST /api/admin/commissions  { id, action: 'mark_paid' }
 * Marks a commission as paid.
 */
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();

  // Verify admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: commissions, error } = await supabase
    .from('referral_commissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enrich with partner and buyer names
  const partnerIds = Array.from(new Set((commissions || []).map((c: any) => c.partner_id)));
  const buyerIds = Array.from(new Set((commissions || []).map((c: any) => c.buyer_id)));
  const allIds = Array.from(new Set([...partnerIds, ...buyerIds]));

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, company, email')
    .in('id', allIds);

  const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));

  const enriched = (commissions || []).map((c: any) => ({
    ...c,
    partner_name: profileMap[c.partner_id]?.full_name || profileMap[c.partner_id]?.email || 'Unknown',
    partner_company: profileMap[c.partner_id]?.company || '',
    buyer_name: profileMap[c.buyer_id]?.full_name || profileMap[c.buyer_id]?.email || 'Unknown',
  }));

  // Summary stats
  const totalPending = enriched
    .filter((c: any) => c.status === 'pending')
    .reduce((sum: number, c: any) => sum + c.commission_amount, 0);
  const totalPaid = enriched
    .filter((c: any) => c.status === 'paid')
    .reduce((sum: number, c: any) => sum + c.commission_amount, 0);

  return NextResponse.json({
    commissions: enriched,
    summary: {
      totalPending,
      totalPaid,
      count: enriched.length,
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, action } = body;

  if (action === 'mark_paid' && id) {
    const { error } = await supabase
      .from('referral_commissions')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
