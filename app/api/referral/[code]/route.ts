import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';

/**
 * GET /api/referral/[code]
 * Validates a partner referral code and returns partner info.
 * Used by the storefront to display partner branding.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code) {
    return NextResponse.json({ error: 'Missing referral code' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: partner, error } = await supabase
    .from('profiles')
    .select('id, full_name, company, avatar_url, role')
    .eq('referral_code', code)
    .in('role', ['lender', 'vendor'])
    .maybeSingle();

  if (error || !partner) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    partner: {
      name: partner.full_name,
      company: partner.company,
      avatarUrl: partner.avatar_url,
      role: partner.role,
    },
  });
}
