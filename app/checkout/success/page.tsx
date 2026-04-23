'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-gray-600">Loading…</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isElementsFlow = searchParams.get('payment') === 'elements';
  const paymentIntentId = searchParams.get('pi');
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [product, setProduct] = useState<string | null>(null);

  useEffect(() => {
    // Elements flow: confirm server-side then refresh profile
    if (isElementsFlow) {
      const confirm = async () => {
        try {
          if (paymentIntentId) {
            const { supabase } = await import('@/lib/supabase');
            const { data: { session } } = await supabase.auth.getSession();

            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
              headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const res = await fetch('/api/checkout/confirm-payment', {
              method: 'POST',
              headers,
              body: JSON.stringify({ paymentIntentId }),
            });

            if (res.ok) {
              const data = await res.json();
              setProduct(data.product);
            }
          }
        } catch (err) {
          console.error('Confirm payment error:', err);
        }
        await refreshProfile();
        setStatus('success');
      };
      confirm();
      return;
    }

    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Verify session and refresh profile (legacy Checkout Session flow)
    const verify = async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setStatus('success');
          await refreshProfile();
        } else {
          setStatus('error');
        }
      } catch {
        // Even if verify fails, payment may have succeeded via webhook
        setStatus('success');
        await refreshProfile();
      }
    };

    verify();
  }, [sessionId, isElementsFlow, refreshProfile]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-gray-600">Confirming your purchase…</p>
      </div>
    );
  }

  const isCertified = product === 'certified';

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {status === 'error'
            ? 'Something went wrong'
            : isCertified
            ? 'Welcome, Certified Borrower!'
            : 'Purchase Complete!'}
        </h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {status === 'error'
            ? 'We could not verify your session. If you were charged, your access will be activated shortly.'
            : isCertified
            ? 'Your K2 Certified Borrower access is now active. Head to your dashboard to explore the Deal Room, PrepCoach, and Preferred Lender network.'
            : 'Your K2 Success Kit is ready. You now have six months of access to your documents, dashboard tools, and PrepCoach.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {isCertified && (
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/deal-room">Open Deal Room</Link>
            </Button>
          )}
          {!isCertified && (
            <Button size="lg" variant="outline" asChild>
              <Link href="/workbook">Download Kit</Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
