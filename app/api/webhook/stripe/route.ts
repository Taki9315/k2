import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRODUCTS } from '@/lib/stripe';
import { createServiceRoleClient } from '@/lib/supabase-server';

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as import('stripe').Stripe.Checkout.Session;
    const { userId, product, referralCode } = session.metadata || {};

    if (!userId || !product) {
      console.error('Webhook missing metadata', session.metadata);
      return NextResponse.json({ received: true });
    }

    const supabase = createServiceRoleClient();
    const productDef = PRODUCTS[product as keyof typeof PRODUCTS];

    if (!productDef) {
      console.error('Unknown product in webhook:', product);
      return NextResponse.json({ received: true });
    }

    // 1. Create order record
    await supabase.from('orders').insert({
      user_id: userId,
      product_id: product,
      amount: session.amount_total || productDef.priceAmount,
      status: 'completed',
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
    });

    // 2. Update user role if purchasing certified borrower
    if (product === 'certified') {
      // Generate a unique K2 membership number
      let membershipNumber: string | null = null;
      try {
        const { data: seqData } = await supabase.rpc('nextval_membership');
        if (seqData) {
          membershipNumber = `K2-${seqData}`;
        } else {
          // Fallback: use timestamp-based number
          membershipNumber = `K2-${Date.now().toString().slice(-6)}`;
        }
      } catch {
        membershipNumber = `K2-${Date.now().toString().slice(-6)}`;
      }

      await supabase
        .from('profiles')
        .update({
          role: 'certified',
          preferred: true,
          certified_at: new Date().toISOString(),
          membership_number: membershipNumber,
        })
        .eq('id', userId);
    }

    // 3. Mark kit purchased for kit buyers
    if (product === 'kit') {
      await supabase
        .from('profiles')
        .update({ workbook_purchased: true })
        .eq('id', userId);
    }

    // 4. Track referral commission if a referral code was provided
    if (referralCode) {
      // Look up the partner who owns this referral code
      const { data: partner } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .maybeSingle();

      if (partner) {
        const commissionAmount =
          product === 'kit' ? 500 : product === 'certified' ? 5000 : 0; // $5 / $50 in cents

        await supabase.from('referral_commissions').insert({
          partner_id: partner.id,
          buyer_id: userId,
          product,
          referral_code: referralCode,
          commission_amount: commissionAmount,
          order_stripe_payment_intent:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : null,
        });
      }
    }

    console.log(
      `[Stripe Webhook] Order completed: user=${userId}, product=${product}`
    );
  }

  return NextResponse.json({ received: true });
}
