'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckoutButton } from '@/components/CheckoutButton';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Download,
  Star,
  Shield,
  X,
} from 'lucide-react';
import { GuaranteePopover } from '@/components/GuaranteePopover';

const SUCCESSKIT_HERO_IMAGE =
  'https://images.pexels.com/photos/6801643/pexels-photo-6801643.jpeg?auto=compress&cs=tinysrgb&w=1400';

const SUCCESSKIT_FEATURES = [
  {
    title: 'Preparing for Financing Success',
    description:
      'How to position yourself as a borrower lenders will want to work with.',
    image:
      'https://images.pexels.com/photos/7947656/pexels-photo-7947656.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: ' Understanding and Selecting the loan program best suited for your unique situation.',
    description:
      'Learn what financial documents lenders require, how to organize them, and how to present your cash flow story effectively.',
    image:
      'https://images.pexels.com/photos/8729952/pexels-photo-8729952.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Finding the right lender - hint...it may not be your local bank',
    description:
      'Proven frameworks for creating business plans that lenders actually read and approve. Includes real examples.',
    image:
      'https://images.unsplash.com/photo-1758518729711-1cbacd55efdb?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Navigating Underwriting and Closing your deal.',
    description:
      'How to identify, value, and present collateral in a way that maximizes your borrowing capacity.',
    image:
      'https://images.unsplash.com/photo-1758518727734-98f0a55983b6?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Document Vault - All the forms a lender may request available for instant download.',
    description:
      'Complete checklists for SBA loans, term loans, lines of credit, and other common financing types.',
    image:
      'https://images.pexels.com/photos/6801643/pexels-photo-6801643.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function WorkbookPage() {
  const [showGuarantee, setShowGuarantee] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSectionRef = useRef(-1);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (hasTriggeredRef.current) return;

      const sections = container.querySelectorAll('section');
      if (!sections.length) return;

      // Find which section is currently most visible
      const viewportMiddle = window.scrollY + window.innerHeight / 2;
      let currentIdx = 0;
      sections.forEach((sec, idx) => {
        const rect = sec.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        if (viewportMiddle >= sectionTop) {
          currentIdx = idx;
        }
      });

      // First scroll sets the baseline
      if (currentSectionRef.current === -1) {
        currentSectionRef.current = currentIdx;
        return;
      }

      // If user scrolled to a different section, show the card
      if (currentIdx !== currentSectionRef.current) {
        currentSectionRef.current = currentIdx;
        hasTriggeredRef.current = true;
        setShowGuarantee(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dismissPopup = () => {
    setShowGuarantee(false);
    setDismissed(true);
  };

  return (
    <div ref={containerRef} className="flex flex-col">
      {/* Slide-in Prepared Borrower Guarantee card (bottom-left) */}
      <div
        className={`fixed bottom-6 left-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] transition-all duration-500 ease-out ${
          showGuarantee && !dismissed
            ? 'translate-x-0 opacity-100'
            : '-translate-x-[120%] opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
          <button
            onClick={dismissPopup}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight pr-6">
              The Prepared Borrower Guarantee
            </h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            If you don&apos;t feel more confident, more organized, and better
            equipped to approach lenders after using the Kit, return it within
            30&nbsp;days for a full refund.
          </p>
          <CheckoutButton
            product="kit"
            size="default"
            className="w-full"
          >
            Get the Success Kit — $15
            <ArrowRight className="ml-2 h-4 w-4" />
          </CheckoutButton>
        </div>
      </div>

      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  Rated 5.0 by 200+ borrowers
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                The Financing Success Kit
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Stop guessing. Start preparing. A complete, step-by-step system
                to get financing-ready before you apply.
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-gray-900">$15</span>
                <span className="text-gray-500">Instant PDF Download</span>
              </div>
              {/* <p className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block mb-6">
                Launch pricing — lock in $15 before it goes up.
              </p> */}
              <CheckoutButton
                product="kit"
                size="lg"
                className="text-lg px-8 py-6 w-full sm:w-auto"
              >
                Get Started
                <Download className="ml-2 h-5 w-5" />
              </CheckoutButton>
              <p className="text-sm text-gray-500 mt-4">
                Instant PDF download. No subscription required.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-slate-200">
              <div
                className="aspect-[3/4] rounded-lg mb-6 bg-cover bg-center"
                style={{ backgroundImage: `url('${SUCCESSKIT_HERO_IMAGE}')` }}
                aria-label="Success Kit planning materials on desk"
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Format</span>
                  <span className="font-semibold">PDF Download</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pages</span>
                  <span className="font-semibold">50+ Pages</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Worksheets</span>
                  <span className="font-semibold">15 Templates</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Updates</span>
                  <span className="font-semibold">Lifetime Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  DETAILED OVERVIEW (moved from homepage)                       */}
      {/* ============================================================ */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 border border-yellow-200 px-4 py-1.5 text-sm font-medium text-yellow-800 mb-6">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                Launch pricing — lock in $15 before it goes up.
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Financing Success Kit
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Everything you need in one place: 50+ pages of clear, actionable
                guidance along with 15+ worksheets and templates. It walks you
                through selecting the right loan type, pulling together the
                documents lenders want to see, comparing your options, and
                sidestepping the mistakes that slow deals down.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Preparing for Financing Success',
                  'Understanding and Selecting the loan program best suited for your unique situation',
                  'Finding the right lender - hint... it may not be your local bank',
                  'Navigating Underwriting and Closing your deal',
                  'Document Vault - All the forms a lender may request, ready for download',
                ].map((feature) => (
                  <li key={feature} className="flex items-start group">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 mr-3 flex-shrink-0 mt-0.5 group-hover:bg-green-200 transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <CheckoutButton
                product="kit"
                size="lg"
                className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                Get the Financing Success Kit - $15
                <ArrowRight className="ml-2 h-5 w-5" />
              </CheckoutButton>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-emerald-50/50 rounded-3xl -rotate-2 scale-105" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center mb-8">
                  <Image
                    src="/assets/Lender_Logo.png"
                    alt="Lender Logo"
                    width={510}
                    height={225}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Format', value: 'PDF Download' },
                    { label: 'Pages', value: '50+ Pages' },
                    { label: 'Templates', value: '15 Worksheets' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                      <span className="text-gray-500 text-sm">{row.label}</span>
                      <span className="font-semibold text-gray-900">{row.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-500 text-sm">Price</span>
                    <span className="font-bold text-3xl text-primary">$15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Get
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to prepare for financing, in one comprehensive
              resource
            </p>
          </div>

          <div className="space-y-6">
            {SUCCESSKIT_FEATURES.map((item, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-lg bg-cover bg-center flex-shrink-0 border border-slate-200"
                      style={{ backgroundImage: `url('${item.image}')` }}
                      aria-label={item.title}
                    />
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Prep Coach Section ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Bot className="h-4 w-4" />
                AI-Powered Prep Coach
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Your Prep Coach
              </h2>
              <p className="text-xl text-gray-700 mb-3 leading-relaxed font-medium">
                AI made simple &mdash; the first AI agent designed exclusively for small commercial property investors.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Turnkey program &mdash; no tech expertise needed. Click prompts &rarr; get expert guidance instantly.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Prep Coach is your unfair competitive advantage &mdash; a turnkey AI
                system that prepares you to work smarter with lenders and advisors.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Step-by-step guided loan package preparation',
                  'AI-generated executive summaries & lender scripts',
                  'DSCR calculations & financial statement builders',
                  'Available 24/7 — work at your own pace',
                  'No experience needed — Prep Coach leads the way',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild className="shadow-lg shadow-primary/20">
                <a href="/prepcoach">
                  Explore Prep Coach
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-emerald-50/50 rounded-3xl -rotate-2 scale-105" />
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">K2 Prep Coach</h4>
                    <p className="text-xs text-slate-400">AI-Guided Preparation</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-slate-300">"Generate an executive summary for my SBA loan…"</p>
                  </div>
                  <div className="bg-primary/20 rounded-xl p-3 ml-4">
                    <p className="text-slate-200">Here&apos;s your executive summary draft based on your financials…</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-slate-300">"What documents do I need for underwriting?"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Certified Borrower Badge / Rating Bubble ───────────── */}
      <section className="py-16 bg-gradient-to-br from-emerald-50/50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white border-2 border-primary/20 rounded-2xl px-6 py-4 shadow-lg shadow-primary/5 mb-8">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">K2 Certified Borrower</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">Rated 5.0 — Trusted by hundreds of borrowers</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready for the Next Level?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Upgrade to Certified Borrower for full access to the partner network, private deal room, and priority support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="shadow-lg shadow-primary/20">
              <a href="/membership/certified-borrower">
                Become Certified — $250
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <GuaranteePopover>
            <Shield className="h-14 w-14 text-primary mx-auto mb-6 cursor-help" />
          </GuaranteePopover>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Prepared Borrower Guarantee
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            If you don&apos;t feel more confident, more organized, and better
            equipped to approach lenders after using the Kit, return it within
            30 days for a full refund.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Financing-Ready?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Download the Success Kit and start preparing today
          </p>
          <div className="flex items-baseline gap-3 justify-center mb-8">
            <span className="text-5xl font-bold">$15</span>
            <span className="text-slate-300">Instant PDF Download</span>
          </div>
          <CheckoutButton
            product="kit"
            variant="secondary"
            size="lg"
            className="text-lg px-8 py-6"
          >
            Get Started
            <Download className="ml-2 h-5 w-5" />
          </CheckoutButton>
          <p className="text-sm text-slate-400 mt-4">
            Instant access. Lifetime updates.
          </p>
        </div>
      </section>
    </div>
  );
}
