'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CheckoutButton } from '@/components/CheckoutButton';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  FolderOpen,
  LayoutDashboard,
  ListChecks,
  Shield,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { GuaranteePopover } from '@/components/GuaranteePopover';

/* ------------------------------------------------------------------ */
/*  Expandable section component                                       */
/* ------------------------------------------------------------------ */
function Expandable({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-shadow">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-6 md:p-8 text-left cursor-pointer"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="flex-1 text-lg md:text-xl font-bold text-gray-900">
          {title}
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero image                                                         */
/* ------------------------------------------------------------------ */
const SUCCESSKIT_HERO_IMAGE =
  'https://images.pexels.com/photos/6801643/pexels-photo-6801643.jpeg?auto=compress&cs=tinysrgb&w=1400';

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
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

      const viewportMiddle = window.scrollY + window.innerHeight / 2;
      let currentIdx = 0;
      sections.forEach((sec, idx) => {
        const rect = sec.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        if (viewportMiddle >= sectionTop) {
          currentIdx = idx;
        }
      });

      if (currentSectionRef.current === -1) {
        currentSectionRef.current = currentIdx;
        return;
      }

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
      {/* ── Slide-in Guarantee card ──────────────────────────── */}
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
          <CheckoutButton product="kit" size="default" className="w-full">
            Get the Success Kit &mdash; $20
            <ArrowRight className="ml-2 h-4 w-4" />
          </CheckoutButton>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
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

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Go Independent &ndash; Financing Success Kit
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A small investment that protects a very big decision.
              </p>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-gray-900">$20</span>
                <span className="text-gray-500">One&ndash;Time &middot; Instant Access</span>
              </div>

              <CheckoutButton
                product="kit"
                size="lg"
                className="text-lg px-8 py-6 w-full sm:w-auto mt-6"
              >
                Get the Kit &ndash; $20
                <Download className="ml-2 h-5 w-5" />
              </CheckoutButton>

              <p className="text-sm text-gray-500 mt-4">
                Instant access. No subscription required.
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
                  <span className="font-semibold">Online Tools + PDF</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Access</span>
                  <span className="font-semibold">Instant</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Updates</span>
                  <span className="font-semibold">Lifetime</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Price</span>
                  <span className="font-bold text-primary text-lg">$20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BEST FOR                                                     */}
      {/* ============================================================ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Best For
          </p>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Organized, self&#x2011;motivated borrowers who want to submit clean,
            professional loan packages lenders actually want to fund&mdash;targeting
            lenders on your own and avoiding broker involvement.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHAT YOU GET (expandable sections)                           */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              What You Get
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Instant Access &ndash; $20 One&#x2011;Time
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete DIY financing system: instantly downloadable guidance and
              online tools to help you move through the financing process with
              clarity and purpose.
            </p>
          </div>

          <div className="space-y-4">
            {/* 1 – Loan Prep Tools */}
            <Expandable title="Step-By-Step Loan Prep Tools" icon={ListChecks} defaultOpen>
              <p className="text-gray-700 mb-3">No guesswork. No confusion.</p>
              <p className="text-gray-600 leading-relaxed">
                Just a clear path to choosing the right loan program, organizing
                lender&#x2011;ready documents, accelerating your process and
                avoiding the mistakes that quietly kill deals.
              </p>
            </Expandable>

            {/* 2 – Document Library */}
            <Expandable title="Document Library – Everything Lenders Expect" icon={FileText}>
              <p className="text-gray-600 mb-4 leading-relaxed">
                A complete library of essential application documents, including:
              </p>
              <ul className="space-y-2">
                {[
                  'Personal financial statements',
                  'Borrower forms',
                  'Templates lenders expect',
                  'Supporting docs you\u2019ll need for every deal',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mt-4 font-medium">
                Everything organized, downloadable, and ready to use.
              </p>
            </Expandable>

            {/* 3 – Deal Room */}
            <Expandable title="Deal Room – Track Each Deal Independently" icon={FolderOpen}>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Each deal gets its own dedicated workspace.
              </p>
              <ul className="space-y-2">
                {[
                  'Upload documents',
                  'Track progress',
                  'Keep everything organized and lender\u2011ready',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mt-4 font-medium">
                No more scattered files or lost emails.
              </p>
            </Expandable>

            {/* 4 – Submission Tracker */}
            <Expandable title="Submission Tracker – Know Exactly Where You Stand" icon={LayoutDashboard}>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Log every lender you&apos;ve submitted to and track the status of each one.
              </p>
              <ul className="space-y-2">
                {[
                  'Who has your package',
                  'What stage they\u2019re in',
                  'What they need next',
                  'Where to follow up',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mt-4 font-medium">
                This alone saves hours and prevents deals from stalling.
              </p>
            </Expandable>

            {/* 5 – Pro-Level Polish */}
            <Expandable title="Pro-Level Polish, Zero Experience Required" icon={Zap}>
              <p className="text-gray-600 leading-relaxed">
                Everything you need to present a clean, credible,
                lender&#x2011;friendly package&mdash;without years of industry
                experience.
              </p>
            </Expandable>
          </div>

          {/* One-Time Purchase callout */}
          <div className="mt-10 rounded-2xl bg-white border border-slate-200 p-6 md:p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              One&ndash;Time Purchase
            </h3>
            <p className="text-gray-600 mb-6">
              No subscriptions. No upsells. Just a powerful, self&#x2011;directed
              system that puts you in control.
            </p>
            <CheckoutButton
              product="kit"
              size="lg"
              className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Get the Kit &ndash; $20 One&ndash;Time
              <ArrowRight className="ml-2 h-5 w-5" />
            </CheckoutButton>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Prep Coach Section                                           */}
      {/* ============================================================ */}
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
                AI made simple &mdash; the first AI agent designed exclusively for
                small commercial property investors.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Turnkey program &mdash; no tech expertise needed. Click
                prompts &rarr; get expert guidance instantly.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Prep Coach is your unfair competitive advantage &mdash; a turnkey AI
                system that prepares you to work smarter with lenders and
                advisors.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Step-by-step guided loan package preparation',
                  'AI-generated executive summaries & lender scripts',
                  'DSCR calculations & financial statement builders',
                  'Available 24/7 \u2014 work at your own pace',
                  'No experience needed \u2014 Prep Coach leads the way',
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
                    <p className="text-xs text-slate-400">
                      AI-Guided Preparation
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-slate-300">
                      &ldquo;Generate an executive summary for my SBA loan&hellip;&rdquo;
                    </p>
                  </div>
                  <div className="bg-primary/20 rounded-xl p-3 ml-4">
                    <p className="text-slate-200">
                      Here&apos;s your executive summary draft based on your
                      financials&hellip;
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-slate-300">
                      &ldquo;What documents do I need for underwriting?&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STILL UNSURE?                                                */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Still Unsure? Consider This.
            </h2>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                You&apos;re about to make a six&#x2011; or seven&#x2011;figure move.
              </p>
              <p>
                One missing document or unclear submission can stall your deal
                instantly.
              </p>
              <p>
                For <span className="font-bold text-primary">$20</span>, you get
                the tools, documents, and structure that keep deals alive and
                moving.
              </p>
              <p className="font-semibold">
                This is the smallest investment in your entire financing
                process&mdash;and the one that can change your outcome the most.
              </p>
              <p className="text-gray-900 font-bold">
                Don&apos;t risk a major financial decision over a $20 shortcut.
              </p>
            </div>

            <div className="mt-8 text-center">
              <CheckoutButton
                product="kit"
                size="lg"
                className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Get the Kit &ndash; $20 One&ndash;Time
                <ArrowRight className="ml-2 h-5 w-5" />
              </CheckoutButton>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Certified Borrower upsell                                    */}
      {/* ============================================================ */}
      <section className="py-16 bg-gradient-to-br from-emerald-50/50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white border-2 border-primary/20 rounded-2xl px-6 py-4 shadow-lg shadow-primary/5 mb-8">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  K2 Certified Borrower
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Rated 5.0 &mdash; Trusted by hundreds of borrowers
              </p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready for the Next Level?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Upgrade to Certified Borrower for expert lender matching, warm
            introductions, and lifetime access to our full platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="shadow-lg shadow-primary/20"
            >
              <a href="/membership/certified-borrower">
                Become Certified &mdash; $250
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Guarantee                                                    */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/*  FINAL CTA                                                    */}
      {/* ============================================================ */}
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
            <span className="text-5xl font-bold">$20</span>
            <span className="text-slate-300">One&ndash;Time</span>
          </div>
          <CheckoutButton
            product="kit"
            variant="secondary"
            size="lg"
            className="text-lg px-8 py-6"
          >
            Get the Kit &ndash; $20
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
