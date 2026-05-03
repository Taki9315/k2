import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRODUCTS } from '@/lib/stripe';
import { createServiceRoleClient } from '@/lib/supabase-server';

/**
 * Determine product from the current checkout amounts when metadata is unavailable.
 */
function productFromAmount(amount: number | null): string | null {
  if (amount === PRODUCTS.kit.priceAmount) return 'kit';
  if (amount === PRODUCTS.certified.priceAmount) return 'certified';
  return null;
}

/**
 * Shared order-fulfillment logic used by both checkout.session.completed
 * and payment_intent.succeeded events.
 */
async function fulfillOrder(
  userId: string,
  product: string,
  referralCode: string | undefined,
  paymentIntentId: string | null,
  amountTotal: number | null
) {
  const supabase = createServiceRoleClient();
  const productDef = PRODUCTS[product as keyof typeof PRODUCTS];

  if (!productDef) {
    console.error('[Stripe Webhook] Unknown product:', product);
    return;
  }

  // Guard against duplicate fulfillment
  if (paymentIntentId) {
    const { data: existing } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .maybeSingle();

    if (existing) {
      console.log(`[Stripe Webhook] Already fulfilled PI ${paymentIntentId}, skipping.`);
      return;
    }
  }

  // 1. Create order record
  await supabase.from('orders').insert({
    user_id: userId,
    product_id: product,
    amount: amountTotal || productDef.priceAmount,
    status: 'completed',
    stripe_payment_intent_id: paymentIntentId,
  });

  // 2. Certified Borrower
  if (product === 'certified') {
    await supabase
      .from('profiles')
      .update({
        role: 'certified',
        workbook_purchased: true,
      })
      .eq('id', userId);

    // Optional fields — attempt separately so they don't block the upgrade
    try {
      await supabase
        .from('profiles')
        .update({ preferred: true, certified_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (e) {
      console.warn('[Stripe Webhook] Optional certified fields failed:', e);
    }

    console.log(`[Stripe Webhook] User ${userId} upgraded to Certified Borrower`);
  }

  // 3. Kit Buyer
  if (product === 'kit') {
    await supabase
      .from('profiles')
      .update({ workbook_purchased: true })
      .eq('id', userId);

    console.log(`[Stripe Webhook] User ${userId} upgraded to Kit Buyer`);
  }

  // 4. Track referral commission
  if (referralCode) {
    const { data: partner } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .maybeSingle();

    if (partner) {
      const commissionAmount =
        product === 'kit' ? 500 : product === 'certified' ? 5000 : 0;

      await supabase.from('referral_commissions').insert({
        partner_id: partner.id,
        buyer_id: userId,
        product,
        referral_code: referralCode,
        commission_amount: commissionAmount,
        order_stripe_payment_intent: paymentIntentId,
      });
    }
  }

  console.log(`[Stripe Webhook] Order completed: user=${userId}, product=${product}, amount=${amountTotal}`);
}

/**
 * Resolve the Supabase user ID from a Stripe customer ID.
 */
async function resolveUserIdFromCustomer(customerId: string): Promise<string | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  return data?.id || null;
}

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: import('stripe').Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  // ── Handle PaymentIntent succeeded (Stripe Elements flow — primary) ──
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as import('stripe').Stripe.PaymentIntent;
    let { userId, product, referralCode } = (pi.metadata || {}) as Record<string, string | undefined>;

    // Fallback: determine product from amount if metadata is missing
    if (!product) {
      product = productFromAmount(pi.amount) ?? undefined;
    }

    // Fallback: resolve userId from the Stripe customer
    if (!userId && pi.customer) {
      const customerId = typeof pi.customer === 'string' ? pi.customer : pi.customer.toString();
      userId = (await resolveUserIdFromCustomer(customerId)) ?? undefined;
    }

    if (!userId || !product) {
      console.warn('[Stripe Webhook] payment_intent.succeeded missing userId or product', {
        piId: pi.id,
        amount: pi.amount,
        metadata: pi.metadata,
        customer: pi.customer,
      });
      return NextResponse.json({ received: true });
    }

    await fulfillOrder(userId, product, referralCode, pi.id, pi.amount);
  }

  // ── Handle Checkout Session completed (legacy flow) ──
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as import('stripe').Stripe.Checkout.Session;
    const { userId, product, referralCode } = session.metadata || {};

    if (!userId || !product) {
      console.error('[Stripe Webhook] checkout.session.completed missing metadata', session.metadata);
      return NextResponse.json({ received: true });
    }

    await fulfillOrder(
      userId,
      product,
      referralCode,
      typeof session.payment_intent === 'string' ? session.payment_intent : null,
      session.amount_total
    );
  }

  return NextResponse.json({ received: true });
}
