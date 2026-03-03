'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Calendar, Lock, Shield, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Transaction review booking page – embeds Calendly (or any scheduling tool).
 * Set NEXT_PUBLIC_CALENDLY_URL in your .env to activate the embed.
 * Falls back to a contact prompt if not configured.
 */
export default function BookingPage() {
  const { user, loading, isCertifiedBorrower, isAdmin } = useAuth();
  const router = useRouter();
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const hasAccess = isCertifiedBorrower || isAdmin;

  // Load Calendly widget script
  useEffect(() => {
    if (!hasAccess || !calendlyUrl) return;

    const existing = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [hasAccess, calendlyUrl]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <Lock className="h-16 w-16 text-slate-300" />
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Transaction Review Booking
          </h1>
          <p className="text-gray-600 mb-6">
            Schedule a one-on-one transaction review with a K2 expert. This
            feature is available to Certified Borrowers.
          </p>
          <Button asChild>
            <Link href="/membership/certified-borrower">Become Certified</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Calendar className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">
              Book a Transaction Review
            </h1>
          </div>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Schedule a session with a K2 expert to review your deal package
            before submitting it to lenders. We&apos;ll help you identify gaps,
            strengthen your narrative, and maximize your chances of approval.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Shield, text: 'Expert review of your full loan package' },
            { icon: CheckCircle2, text: 'Identify gaps before lender submission' },
            { icon: Calendar, text: '30-minute focused session' },
          ].map((b) => (
            <Card key={b.text}>
              <CardContent className="p-4 flex items-center gap-3">
                <b.icon className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-gray-700">{b.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Calendar embed or fallback */}
        {calendlyUrl ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className="calendly-inline-widget"
                data-url={calendlyUrl}
                style={{ minWidth: '320px', height: '700px' }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Calendar Coming Soon
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                Online scheduling is being set up. In the meantime, contact us
                directly to book your transaction review.
              </p>
              <Button asChild>
                <Link href="/contact">Contact Us to Schedule</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
