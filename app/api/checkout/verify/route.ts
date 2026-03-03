import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 402 }
      );
    }

    return NextResponse.json({
      product: session.metadata?.product || null,
      userId: session.metadata?.userId || null,
      status: session.payment_status,
    });
  } catch (err: any) {
    console.error('Verify checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}
