import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

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

// Auto-create deal_lenders table if not exists
async function ensureDealLendersTable(supabase: ReturnType<typeof createServiceRoleClient>) {
  const { error } = await supabase.from('deal_lenders').select('id').limit(0);
  if (error && error.message.includes('does not exist')) {
    await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS deal_lenders (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
          user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          lender_name text NOT NULL DEFAULT '',
          contact_name text NOT NULL DEFAULT '',
          phone text NOT NULL DEFAULT '',
          email text NOT NULL DEFAULT '',
          status text NOT NULL DEFAULT 'submitted',
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_deal_lenders_deal ON deal_lenders(deal_id);
        CREATE INDEX IF NOT EXISTS idx_deal_lenders_user ON deal_lenders(user_id);
        ALTER TABLE deal_lenders ENABLE ROW LEVEL SECURITY;
        CREATE POLICY IF NOT EXISTS "service_role_full_deal_lenders"
          ON deal_lenders FOR ALL TO service_role USING (true) WITH CHECK (true);
      `,
    }).then(({ error: rpcErr }) => {
      if (rpcErr) console.error('Could not auto-create deal_lenders table:', rpcErr.message);
    });
  }
}

// Ensure outreach_status column exists on deals
async function ensureOutreachColumn(supabase: ReturnType<typeof createServiceRoleClient>) {
  // Try selecting the column; if it fails, add it
  const { error } = await supabase.from('deals').select('outreach_status').limit(0);
  if (error && error.message.includes('outreach_status')) {
    await supabase.rpc('exec_sql', {
      query: `ALTER TABLE deals ADD COLUMN IF NOT EXISTS outreach_status text NOT NULL DEFAULT 'preparing_materials';`,
    }).then(({ error: rpcErr }) => {
      if (rpcErr) console.error('Could not add outreach_status column:', rpcErr.message);
    });
  }
}

/**
 * GET  /api/lender-outreach?dealId=x  — get deal outreach data (status + lenders)
 * GET  /api/lender-outreach           — get all deals with outreach status
 * POST /api/lender-outreach           — add a lender row { dealId, lenderName, contactName, phone, email }
 * PUT  /api/lender-outreach           — update deal status or lender row
 * DELETE /api/lender-outreach?id=x    — delete a lender row
 */
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();
  if (!(await checkAccess(supabase, user.id))) {
    return NextResponse.json({ error: 'Access required' }, { status: 403 });
  }

  await ensureOutreachColumn(supabase);
  await ensureDealLendersTable(supabase);

  const dealId = request.nextUrl.searchParams.get('dealId');

  if (dealId) {
    // Get specific deal + its lender rows
    const { data: deal } = await supabase
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const { data: lenders } = await supabase
      .from('deal_lenders')
      .select('*')
      .eq('deal_id', dealId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      deal: {
        id: deal.id,
        name: deal.name,
        outreach_status: deal.outreach_status ?? 'preparing_materials',
        created_at: deal.created_at,
      },
      lenders: lenders ?? [],
    });
  }

  // List all deals with outreach status
  const { data: deals, error } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ deals: [] });
  }

  const dealsList = (deals || []).map((d) => ({
    id: d.id,
    name: d.name,
    outreach_status: d.outreach_status ?? 'preparing_materials',
    created_at: d.created_at,
  }));

  return NextResponse.json({ deals: dealsList });
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();
  if (!(await checkAccess(supabase, user.id))) {
    return NextResponse.json({ error: 'Access required' }, { status: 403 });
  }

  await ensureDealLendersTable(supabase);

  const body = await request.json();
  const { dealId, lenderName, contactName, phone, email } = body;

  if (!dealId) {
    return NextResponse.json({ error: 'dealId is required' }, { status: 400 });
  }

  // Verify deal ownership
  const { data: deal } = await supabase
    .from('deals')
    .select('id')
    .eq('id', dealId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!deal) {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
  }

  const { data: lender, error } = await supabase
    .from('deal_lenders')
    .insert({
      deal_id: dealId,
      user_id: user.id,
      lender_name: lenderName?.trim() || '',
      contact_name: contactName?.trim() || '',
      phone: phone?.trim() || '',
      email: email?.trim() || '',
      status: 'submitted',
    })
    .select('*')
    .single();

  if (error) {
    console.error('Create lender error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lender });
}

export async function PUT(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();

  const body = await request.json();

  // Update deal outreach status
  if (body.dealId && body.outreachStatus) {
    const validStatuses = ['preparing_materials', 'lenders_identified', 'submitted_to_lenders', 'closed'];
    if (!validStatuses.includes(body.outreachStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await ensureOutreachColumn(supabase);

    const { error } = await supabase
      .from('deals')
      .update({ outreach_status: body.outreachStatus, updated_at: new Date().toISOString() })
      .eq('id', body.dealId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Update deal status error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  // Update a lender row
  if (body.lenderId) {
    await ensureDealLendersTable(supabase);

    const updates: Record<string, string> = {};
    if (body.lenderName !== undefined) updates.lender_name = body.lenderName.trim();
    if (body.contactName !== undefined) updates.contact_name = body.contactName.trim();
    if (body.phone !== undefined) updates.phone = body.phone.trim();
    if (body.email !== undefined) updates.email = body.email.trim();
    if (body.status !== undefined) {
      const validLenderStatuses = ['submitted', 'in_review', 'declined', 'closing', 'closed'];
      if (!validLenderStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid lender status' }, { status: 400 });
      }
      updates.status = body.status;
    }
    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('deal_lenders')
      .update(updates)
      .eq('id', body.lenderId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Update lender error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Missing dealId/outreachStatus or lenderId' }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing lender id' }, { status: 400 });
  }

  await ensureDealLendersTable(supabase);

  const { error } = await supabase
    .from('deal_lenders')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete lender error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
