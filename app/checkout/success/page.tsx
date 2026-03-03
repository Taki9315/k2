'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [product, setProduct] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    // Verify session and refresh profile
    const verify = async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setStatus('success');
          // Refresh the auth profile so the UI reflects the new role immediately
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
  }, [sessionId, refreshProfile]);

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
            : 'Your K2 Success Kit is ready. Head to your dashboard to download your documents and start using PrepCoach.'}
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
