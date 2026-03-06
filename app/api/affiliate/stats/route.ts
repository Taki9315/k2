import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

/**
 * GET /api/affiliate/stats — Returns referral stats for the authenticated partner.
 */
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();

  // Check partner access
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, referral_code')
    .eq('id', user.id)
    .maybeSingle();

  const isPartner =
    profile?.role === 'lender' ||
    profile?.role === 'vendor' ||
    profile?.role === 'admin';

  if (!isPartner) {
    return NextResponse.json({ error: 'Partner access required' }, { status: 403 });
  }

  // Try to get stats from referral tables — gracefully return zeros if tables don't exist
  let totalClicks = 0;
  let totalKitSales = 0;
  let totalCertifiedSales = 0;
  let totalCommission = 0;
  let pendingCommission = 0;

  try {
    // Referral clicks
    const { count: clicks } = await supabase
      .from('referral_clicks')
      .select('id', { count: 'exact', head: true })
      .eq('partner_id', user.id);
    totalClicks = clicks || 0;
  } catch {}

  try {
    // Referral sales
    const { data: sales } = await supabase
      .from('referral_sales')
      .select('product_type, commission_amount, status')
      .eq('partner_id', user.id);

    if (sales) {
      totalKitSales = sales.filter((s) => s.product_type === 'kit').length;
      totalCertifiedSales = sales.filter((s) => s.product_type === 'certified').length;
      totalCommission = sales.reduce((sum, s) => sum + (s.commission_amount || 0), 0);
      pendingCommission = sales
        .filter((s) => s.status === 'pending')
        .reduce((sum, s) => sum + (s.commission_amount || 0), 0);
    }
  } catch {}

  return NextResponse.json({
    totalClicks,
    totalKitSales,
    totalCertifiedSales,
    totalCommission,
    pendingCommission,
  });
}
