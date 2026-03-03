'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <XCircle className="h-10 w-10 text-slate-400" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Checkout Cancelled
        </h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Your payment was not processed. No charges were made to your account.
          You can try again anytime.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild>
            <Link href="/membership">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Membership
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
