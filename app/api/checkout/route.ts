import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRODUCTS, type ProductKey } from '@/lib/stripe';
import { getUserFromRequest } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    // Try to authenticate the user (optional for kit purchases)
    const user = await getUserFromRequest(request);

    // Certified product requires authentication
    if (!user && product !== 'kit') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productDef = PRODUCTS[product];
    const stripePriceId = process.env[productDef.envPriceKey];

    // Build line items – use Stripe Price ID if configured, otherwise ad-hoc
    const lineItems: import('stripe').Stripe.Checkout.SessionCreateParams.LineItem[] =
      stripePriceId
        ? [{ price: stripePriceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: productDef.name,
                  description: productDef.description,
                },
                unit_amount: productDef.priceAmount,
              },
              quantity: 1,
            },
          ];

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // For authenticated users, pre-fill their email; for guests, let Stripe collect it
      ...(user ? { customer_email: user.email } : {}),
      line_items: lineItems,
      metadata: {
        userId: user?.id || 'guest',
        product,
        ...(referralCode ? { referralCode } : {}),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout session error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
