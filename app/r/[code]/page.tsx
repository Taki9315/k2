'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckoutButton } from '@/components/CheckoutButton';
import {
  Shield,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Building2,
  Handshake,
} from 'lucide-react';

type PartnerInfo = {
  name: string;
  company: string;
  avatarUrl: string | null;
  role: string;
};

export default function ReferralPage() {
  const params = useParams();
  const code = params.code as string;
  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/referral/${code}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setPartner(data.partner);
        setLoading(false);
      })
      .catch(() => {
        setInvalid(true);
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (invalid || !partner) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-600 text-lg">Invalid referral link.</p>
        <Link href="/membership" className="text-primary hover:underline">
          Browse membership options →
        </Link>
      </div>
    );
  }

  const partnerLabel =
    partner.role === 'lender' ? 'Preferred Lender' : 'Preferred Vendor';

  return (
    <main className="bg-white">
      {/* Partner banner */}
      <div className="bg-slate-900 text-white py-3 text-center text-sm">
        <span className="inline-flex items-center gap-2">
          <Handshake className="h-4 w-4 text-primary" />
          Referred by{' '}
          <strong>
            {partner.company || partner.name}
          </strong>{' '}
          — K2 {partnerLabel}
        </span>
      </div>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-slate-100 text-center px-4">
        <div className="max-w-3xl mx-auto">
          {/* Partner badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-5 py-2 text-sm font-medium text-primary mb-8">
            <Building2 className="h-4 w-4" />
            Exclusive offer via {partner.company || partner.name}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get the <span className="text-primary">K2 Success Kit</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Everything you need to start preparing your commercial real estate
            loan package — templates, document checklists, and 4 AI-powered
            PrepCoach prompts.
          </p>

          <p className="text-3xl font-bold text-gray-900 mb-2">$39</p>
          <p className="text-sm text-gray-500 mb-8">One-time purchase</p>

          <CheckoutButton
            product="kit"
            referralCode={code}
            label="Get Your Success Kit — $39"
            size="lg"
            className="text-lg px-8 py-4 shadow-lg shadow-primary/20"
          />
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            What&apos;s Included
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Executive Summary template',
              'Lender Script generator',
              'DSCR Calculator',
              'Personal Financial Statement builder',
              'Document checklists by loan type',
              'CRE financing fundamentals guide',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade path */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready for More?
          </h2>
          <p className="text-gray-600 mb-6">
            Upgrade to K2 Certified Borrower for full access — Deal Room,
            Preferred Lender network, all PrepCoach prompts, and a $1,000
            closing credit.
          </p>
          <CheckoutButton
            product="certified"
            referralCode={code}
            label="Become Certified — $250"
            variant="outline"
            size="lg"
          />
        </div>
      </section>

      {/* Partner footer */}
      <section className="py-8 bg-white border-t text-center">
        <p className="text-xs text-gray-500">
          Referred by {partner.company || partner.name} • K2 {partnerLabel}
        </p>
      </section>
    </main>
  );
}
