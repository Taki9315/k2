import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

/**
 * GET /api/admin/affiliate — Returns all affiliate-eligible users with referral stats.
 * Restricted to admin users. Only Kit Buyers, Certified Borrowers, and Partners are returned.
 */
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();

  // Verify admin role
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (adminProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  // Fetch all profiles with affiliate-eligible roles
  const ELIGIBLE_ROLES = ['kit_buyer', 'certified_borrower', 'partner', 'lender', 'vendor', 'admin'];
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, referral_code')
    .in('role', ELIGIBLE_ROLES)
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching affiliate profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch affiliates' }, { status: 500 });
  }

  // Gather referral stats for each user
  const affiliates = await Promise.all(
    (profiles ?? []).map(async (profile) => {
      let totalClicks = 0;
      let totalKitSales = 0;
      let totalCertifiedSales = 0;
      let totalCommission = 0;

      try {
        const { count: clicks } = await supabase
          .from('referral_clicks')
          .select('id', { count: 'exact', head: true })
          .eq('partner_id', profile.id);
        totalClicks = clicks || 0;
      } catch {}

      try {
        const { data: sales } = await supabase
          .from('referral_sales')
          .select('product_type, commission_amount')
          .eq('partner_id', profile.id);

        if (sales) {
          totalKitSales = sales.filter((s) => s.product_type === 'kit').length;
          totalCertifiedSales = sales.filter((s) => s.product_type === 'certified').length;
          totalCommission = sales.reduce((sum, s) => sum + (s.commission_amount || 0), 0);
        }
      } catch {}

      return {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        role: profile.role,
        referral_code: profile.referral_code,
        total_clicks: totalClicks,
        total_kit_sales: totalKitSales,
        total_certified_sales: totalCertifiedSales,
        total_commission: totalCommission,
      };
    })
  );

  return NextResponse.json({ affiliates });
}
