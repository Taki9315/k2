import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRODUCTS } from '@/lib/stripe';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

/**
 * POST /api/checkout/confirm-payment
 *
 * Called after Stripe Elements confirms a payment client-side.
 * Verifies the PaymentIntent status with Stripe, then fulfills the order
 * (role upgrade, order record, referral commission).
 *
 * Body: { paymentIntentId: string }
 */
export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { paymentIntentId } = body as { paymentIntentId?: string };

    if (!paymentIntentId) {
      return NextResponse.json({ error: 'paymentIntentId required' }, { status: 400 });
    }

    // 1. Verify the PaymentIntent with Stripe
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log(`[confirm-payment] PI ${pi.id}: status=${pi.status}, amount=${pi.amount}, product=${pi.metadata?.product}, userId=${pi.metadata?.userId}`);

    if (pi.status !== 'succeeded') {
      return NextResponse.json(
        { error: `Payment not completed. Status: ${pi.status}` },
        { status: 402 }
      );
    }

    // 2. Resolve product
    let resolvedProduct = pi.metadata?.product as string | undefined;
    if (!resolvedProduct) {
      if (pi.amount === PRODUCTS.kit.priceAmount) resolvedProduct = 'kit';
      else if (pi.amount === PRODUCTS.certified.priceAmount) resolvedProduct = 'certified';
    }

    if (!resolvedProduct || !(resolvedProduct in PRODUCTS)) {
      return NextResponse.json({ error: `Could not determine product (amount=${pi.amount})` }, { status: 400 });
    }

    // 3. Resolve user ID
    let userId = pi.metadata?.userId as string | undefined;

    if (!userId || userId === 'guest') {
      const user = await getUserFromRequest(request);
      if (user) userId = user.id;
    }

    if ((!userId || userId === 'guest') && pi.customer) {
      const supabase = createServiceRoleClient();
      const customerId = typeof pi.customer === 'string' ? pi.customer : String(pi.customer);
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .maybeSingle();
      if (profile) userId = profile.id;
    }

    if (!userId || userId === 'guest') {
      return NextResponse.json({ error: 'Could not identify user' }, { status: 400 });
    }

    console.log(`[confirm-payment] Fulfilling: userId=${userId}, product=${resolvedProduct}, amount=${pi.amount}`);

    const supabase = createServiceRoleClient();

    // ─── CRITICAL: Upgrade the user role FIRST (most important operation) ───

    if (resolvedProduct === 'certified') {
      // Certified Borrower
      // Core update: only columns guaranteed to exist
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'certified',
          workbook_purchased: true, // certified includes kit access
        })
        .eq('id', userId);

      if (updateError) {
        console.error(`[confirm-payment] FAILED to upgrade user ${userId} to certified:`, updateError);
        return NextResponse.json({ error: 'Failed to upgrade membership: ' + updateError.message }, { status: 500 });
      }

      console.log(`[confirm-payment] ✅ User ${userId} upgraded to Certified Borrower`);

      // Optional fields — attempt separately so they don't block the upgrade
      try {
        await supabase
          .from('profiles')
          .update({ preferred: true, certified_at: new Date().toISOString() })
          .eq('id', userId);
      } catch (e) {
        console.warn('[confirm-payment] Optional certified fields failed (non-critical):', e);
      }
    } else if (resolvedProduct === 'kit') {
      // Kit Buyer
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ workbook_purchased: true })
        .eq('id', userId);

      if (updateError) {
        console.error(`[confirm-payment] FAILED to upgrade user ${userId} to kit buyer:`, updateError);
        return NextResponse.json({ error: 'Failed to upgrade membership: ' + updateError.message }, { status: 500 });
      }

      console.log(`[confirm-payment] ✅ User ${userId} upgraded to Kit Buyer`);
    }

    // ─── Secondary: Create order record (non-blocking) ───
    try {
      await supabase.from('orders').insert({
        user_id: userId,
        product_id: resolvedProduct,
        amount: pi.amount,
        status: 'completed',
        stripe_payment_intent_id: paymentIntentId,
      });
    } catch (orderErr) {
      console.warn('[confirm-payment] Order insert failed (non-critical):', orderErr);
    }

    // ─── Secondary: Track referral commission (non-blocking) ───
    const referralCode = pi.metadata?.referralCode;
    if (referralCode) {
      try {
        const { data: partner } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode)
          .maybeSingle();

        if (partner) {
          const commissionAmount =
            resolvedProduct === 'kit' ? 500 : resolvedProduct === 'certified' ? 5000 : 0;

          await supabase.from('referral_commissions').insert({
            partner_id: partner.id,
            buyer_id: userId,
            product: resolvedProduct,
            referral_code: referralCode,
            commission_amount: commissionAmount,
            order_stripe_payment_intent: paymentIntentId,
          });
        }
      } catch (refErr) {
        console.warn('[confirm-payment] Referral commission insert failed (non-critical):', refErr);
      }
    }

    return NextResponse.json({ success: true, product: resolvedProduct });
  } catch (err: any) {
    console.error('confirm-payment error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
