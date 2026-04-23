'use client';

import { useState, useCallback, FormEvent } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

/* ─── Stripe singleton ─── */
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

/* ─── Types ─── */
export interface StripePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: 'kit' | 'certified';
  referralCode?: string;
  /** Called after successful payment confirmation with the PaymentIntent ID */
  onSuccess?: (paymentIntentId: string) => void;
}

/* ─── Inner form (mounted inside <Elements>) ─── */
function PaymentForm({
  product,
  amount,
  productName,
  onSuccess,
  onClose,
}: {
  product: string;
  amount: number;
  productName: string;
  onSuccess?: (paymentIntentId: string) => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<'idle' | 'processing' | 'succeeded' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setStatus('processing');
    setErrorMessage(null);

    const origin = window.location.origin;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      setStatus('error');
    } else if (paymentIntent?.status === 'succeeded') {
      // Immediately confirm server-side to upgrade role (works on localhost too)
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        await fetch('/api/checkout/confirm-payment', {
          method: 'POST',
          headers,
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });
      } catch (err) {
        console.error('Server-side confirm error (role will be updated via webhook):', err);
      }

      setStatus('succeeded');
      onSuccess?.(paymentIntent.id);
    } else {
      // Payment requires additional action (3DS etc.) — Stripe handles redirect
      setStatus('idle');
    }
  };

  if (status === 'succeeded') {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900">Payment Successful!</h3>
          <p className="text-sm text-gray-600 mt-1">
            {product === 'kit'
              ? `Your purchase of ${productName} is complete. Six months of access is now ready.`
              : `Your purchase of ${productName} is complete.`}
          </p>
        </div>
        <Button onClick={onClose} className="mt-2">
          Continue
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order summary */}
      <div className="rounded-lg border bg-slate-50 p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{productName}</p>
          <p className="text-xs text-gray-500">
            {product === 'kit' ? 'One-time payment for six months of access' : 'One-time payment'}
          </p>
        </div>
        <Badge variant="secondary" className="text-base font-bold px-3 py-1">
          ${(amount / 100).toFixed(2)}
        </Badge>
      </div>

      {/* Stripe Payment Element */}
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {errorMessage && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || status === 'processing'}
        className="w-full gap-2"
        size="lg"
      >
        {status === 'processing' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pay ${(amount / 100).toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <ShieldCheck className="h-3 w-3" />
        Secured by Stripe. Your card details never touch our servers.
      </p>
    </form>
  );
}

/* ─── Main dialog ─── */
export function StripePaymentDialog({
  open,
  onOpenChange,
  product,
  referralCode,
  onSuccess,
}: StripePaymentDialogProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const initPaymentIntent = useCallback(async () => {
    if (clientSecret) return; // already initialized
    setLoading(true);
    setInitError(null);

    try {
      // Get the auth token if available
      const { supabase } = await import('@/lib/supabase');
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers,
        body: JSON.stringify({ product, referralCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      setClientSecret(data.clientSecret);
      setAmount(data.amount);
      setProductName(data.productName);
    } catch (err: any) {
      setInitError(err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  }, [clientSecret, product, referralCode]);

  // Reset state when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setClientSecret(null);
      setAmount(0);
      setProductName('');
      setInitError(null);
    }
    onOpenChange(isOpen);
  };

  // Initialize on open
  const handleDialogOpen = () => {
    if (open && !clientSecret && !loading) {
      initPaymentIntent();
    }
  };

  // Trigger init when dialog opens
  if (open && !clientSecret && !loading && !initError) {
    initPaymentIntent();
  }

  const handleSuccess = (paymentIntentId: string) => {
    onSuccess?.(paymentIntentId);
    // Give user a moment to see the success state, then close
    setTimeout(() => handleOpenChange(false), 1500);
  };

  const elementsOptions: StripeElementsOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#16a34a',
            borderRadius: '8px',
          },
        },
      }
    : {};

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            {product === 'kit'
              ? 'Enter your payment details below to start six months of full K2 Lender-Ready System access.'
              : 'Enter your payment details below. Your card will be securely saved for future use.'}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Preparing payment…</p>
          </div>
        )}

        {initError && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="rounded-md bg-red-50 border border-red-200 p-4 w-full">
              <p className="text-sm text-red-700">{initError}</p>
            </div>
            <Button variant="outline" onClick={() => { setInitError(null); initPaymentIntent(); }}>
              Try Again
            </Button>
          </div>
        )}

        {clientSecret && (
          <Elements stripe={stripePromise} options={elementsOptions}>
            <PaymentForm
              product={product}
              amount={amount}
              productName={productName}
              onSuccess={handleSuccess}
              onClose={() => handleOpenChange(false)}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}
