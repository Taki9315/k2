import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRODUCTS, type ProductKey } from '@/lib/stripe';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

/**
 * POST /api/checkout/create-payment-intent
 *
 * Creates (or reuses) a Stripe Customer for the authenticated user,
 * then creates a PaymentIntent with `setup_future_usage: 'on_session'`
 * so the card is saved to the customer for future payments.
 *
 * Body: { product: 'kit' | 'certified', referralCode?: string }
 * Returns: { clientSecret, customerId, amount, productName }
 */
export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid or empty JSON body' }, { status: 400 });
    }

    const { product, referralCode } = body as {
      product: ProductKey;
      referralCode?: string;
    };

    if (!product || !PRODUCTS[product]) {
      return NextResponse.json(
        { error: 'Invalid product. Use "kit" or "certified".' },
        { status: 400 }
      );
    }

    const user = await getUserFromRequest(request);

    // Certified purchases require authentication
    if (!user && product !== 'kit') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productDef = PRODUCTS[product];
    const supabase = createServiceRoleClient();

    // ── Resolve or create Stripe Customer ──
    let stripeCustomerId: string | null = null;

    if (user) {
      // 1. Check if we already have a stripe_customer_id in the profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id, email, full_name')
        .eq('id', user.id)
        .single();

      stripeCustomerId = profile?.stripe_customer_id || null;

      // 2. If no customer yet, create one and persist the ID
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: profile?.full_name || undefined,
          metadata: { supabase_user_id: user.id },
        });
        stripeCustomerId = customer.id;

        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customer.id })
          .eq('id', user.id);
      } else {
        // Validate the stored customer still exists in Stripe
        try {
          await stripe.customers.retrieve(stripeCustomerId);
        } catch {
          // Customer was deleted or belongs to a different Stripe account — recreate
          const customer = await stripe.customers.create({
            email: user.email,
            name: profile?.full_name || undefined,
            metadata: { supabase_user_id: user.id },
          });
          stripeCustomerId = customer.id;

          await supabase
            .from('profiles')
            .update({ stripe_customer_id: customer.id })
            .eq('id', user.id);
        }
      }
    } else {
      // Guest kit purchase — create an ephemeral customer
      const customer = await stripe.customers.create({
        metadata: { guest: 'true', product },
      });
      stripeCustomerId = customer.id;
    }

    // ── Create PaymentIntent ──
    const paymentIntent = await stripe.paymentIntents.create({
      amount: productDef.priceAmount,
      currency: 'usd',
      customer: stripeCustomerId,
      // Save the card to the customer for future use
      setup_future_usage: 'on_session',
      metadata: {
        userId: user?.id || 'guest',
        product,
        ...(referralCode ? { referralCode } : {}),
      },
      automatic_payment_methods: { enabled: true },
      description: `K2 — ${productDef.name}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: stripeCustomerId,
      amount: productDef.priceAmount,
      productName: productDef.name,
    });
  } catch (err: any) {
    console.error('Create payment intent error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
