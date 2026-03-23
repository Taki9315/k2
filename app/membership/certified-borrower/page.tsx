// app/membership/certified-borrower/page.tsx
// Certified Borrower sales page with expandable sections & Stripe checkout

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckoutButton } from '@/components/CheckoutButton';
import {
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Lock,
  Send,
  DollarSign,
  Brain,
  FileSearch,
  BarChart3,
  Headphones,
  BookOpen,
  FileText,
  Target,
  TrendingUp,
  Quote,
  Sparkles,
  ChevronDown,
  AlertTriangle,
  Users,
  Phone,
  Award,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Expandable component                                                */
/* ------------------------------------------------------------------ */
function Expandable({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  variant = 'default',
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'warning' | 'dark';
}) {
  const [open, setOpen] = useState(defaultOpen);

  const borderColor =
    variant === 'warning'
      ? 'border-amber-200'
      : variant === 'dark'
        ? 'border-slate-700'
        : 'border-slate-200';
  const bgColor =
    variant === 'warning'
      ? 'bg-amber-50/50'
      : variant === 'dark'
        ? 'bg-slate-800'
        : 'bg-white';
  const textColor = variant === 'dark' ? 'text-white' : 'text-gray-900';
  const iconBg =
    variant === 'warning'
      ? 'bg-amber-100 text-amber-700'
      : variant === 'dark'
        ? 'bg-white/10 text-white'
        : 'bg-primary/10 text-primary';

  return (
    <div
      className={`rounded-2xl border ${borderColor} ${bgColor} hover:shadow-lg transition-shadow`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-6 md:p-8 text-left cursor-pointer"
      >
        {Icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} flex-shrink-0`}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
        <h3 className={`flex-1 text-lg md:text-xl font-bold ${textColor}`}>
          {title}
        </h3>
        <ChevronDown
          className={`h-5 w-5 ${variant === 'dark' ? 'text-slate-400' : 'text-gray-400'} transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const TRUST_BADGES = [
  { icon: Zap, label: 'Lifetime Access' },
  { icon: Brain, label: 'K2 PrepCoach' },
  { icon: Lock, label: 'Secure Data Room' },
  { icon: Send, label: 'Warm Introductions' },
  { icon: DollarSign, label: '$1,000 Credit*' },
  { icon: Headphones, label: 'K2 Expert Support' },
];

const STEPS = [
  { num: '1', text: 'Pay $250 once \u2192 instant access' },
  { num: '2', text: 'Build & polish deal with PrepCoach & checklists' },
  { num: '3', text: 'Expert matching + warm lender introductions' },
  { num: '4', text: 'Close \u2192 collect $1,000 credit*' },
];

const TESTIMONIALS = [
  {
    quote:
      'K2 PrepCoach fixed issues I missed. First submission approved fast.',
    author: 'Michael R.',
    role: 'First-Time CRE Borrower',
  },
  {
    quote: 'Vetted lenders + credit made it worth every dollar.',
    author: 'Sarah L.',
    role: 'Small Business Owner',
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CertifiedBorrowerPage() {
  return (
    <main className="bg-white">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Shield className="h-4 w-4" />
            Partner with K2 Commercial Finance
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Become a K2{' '}
            <span className="text-primary">Certified Borrower</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-6">
            Expert Lender Matching, Warm Introductions, and Lifetime Tools
          </p>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-4 leading-relaxed">
            One&ndash;Time $250 Investment (Lifetime Access)
          </p>

          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Ready to stop chasing mismatched lenders and start getting your
            commercial deal taken seriously?
          </p>

          {/* Cautionary pulldown about online matching */}
          <div className="max-w-2xl mx-auto mb-10">
            <Expandable
              title="A cautionary word about online lender matching sites"
              icon={AlertTriangle}
              variant="warning"
            >
              <p className="text-gray-700 leading-relaxed mb-3">
                Online lender&ndash;matching sites promise speed&mdash;but they
                can&apos;t replace 26 years of real relationships.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Platforms blast your deal to hundreds of lenders with no context
                or advocacy. Responses are slow, fits are random, and no one
                fights for your terms. Borrowers are often steered to Merchant
                Cash Advances or Business Lines of Credit with notoriously bad
                terms.
              </p>
            </Expandable>
          </div>

          <p className="text-base text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
            By becoming a K2 Certified Borrower, you partner with K2 Commercial
            Finance to unlock our proprietary expertise: a private strategy call
            to review your deal, targeted warm introductions to the best&ndash;fit
            lenders in our vetted network, and unlimited access to PrepCoach AI +
            pro tools to strengthen your package anytime you want.
          </p>

          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Once we make the connection, you communicate directly with the
            lenders&mdash;no ongoing middleman. This is the professional
            partnership that positions serious borrowers for faster approvals,
            better terms, and real momentum.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {TRUST_BADGES.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm"
              >
                <b.icon className="h-3.5 w-3.5 text-primary" />
                {b.label}
              </span>
            ))}
          </div>

          {/* CTA */}
          <CheckoutButton
            product="certified"
            label="Become a Certified Borrower — $250 One-Time Investment"
            size="lg"
            className="text-lg px-8 py-4 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          />

          {/* First 100 lifetime note */}
          <div className="mt-8 inline-block rounded-xl bg-amber-50 border border-amber-200 px-6 py-3">
            <p className="text-base font-bold text-amber-800">
              First 100 Certified Borrowers secure lifetime access&mdash;spots are
              limited and going fast.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  THE CHALLENGES                                               */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              The Problem
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Challenges Small Commercial Borrowers Face
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You&apos;ve got a solid deal&mdash;strong numbers, great property.
              But you are not a financing expert:
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Appropriate lenders are hard to find. Many lenders ignore submissions or reject them over unseen "fit" issues.',
              'Traditional brokers often operate with opacity: hidden yield-spread premiums where lenders pay them more for steering you to higher rates/terms that cost you big.',
              'Industry broker fees frequently hit 3\u20135%, with little transparency on how compensation influences recommendations.',
              'Even strong prep can\u2019t deliver access to the right lenders at the right time or the pre-vetted credibility that opens doors.',
              'Time drags, deals stall, and hidden incentives quietly erode your outcome.',
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-red-200/60 bg-red-50/30 p-5"
              >
                <span className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 font-bold text-lg leading-5">
                  &times;
                </span>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-gray-700 text-lg font-medium">
            Most borrowers accept this as standard.{' '}
            <span className="text-primary font-bold">
              K2 Certified Borrowers skip the search and speak directly with
              interested, hungry lenders.
            </span>
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY PARTNER WITH K2                                          */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Why K2
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Partner with K2 Commercial Finance as a Certified Borrower?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Becoming Certified means you gain our full support
              ecosystem&mdash;without the conflicts or opacity of traditional
              brokers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              We do what&apos;s impossible for you alone (even with great tools):
            </h3>
            <ul className="space-y-4">
              {[
                'Proprietary matching drawn from 26 years of small commercial experience.',
                'Warm introductions to lenders who trust K2 borrowers as pre-qualified and professional.',
                'Controlled targeting so your deal lands with high-fit options first.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-600 border-t border-slate-100 pt-6">
              After the intro, it&apos;s you and the lender&mdash;direct and
              efficient.
            </p>
            <p className="mt-3 text-gray-600">
              You retain total flexibility: Use PrepCoach AI 24/7 to ask
              questions, spot gaps, generate narratives, compare options, and
              refine deals whenever inspiration hits.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHAT YOU GET (expandable sections)                           */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              What You Get
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              K2 Certified Borrower &ndash; Lifetime Access for $250 One&ndash;Time
            </h2>
          </div>

          <div className="space-y-4">
            {/* 1 – Strategy Call */}
            <Expandable
              title="30-Minute Private Strategy & Coaching Call"
              icon={Phone}
              defaultOpen
            >
              <p className="text-gray-600 leading-relaxed">
                We review your paperwork and deal in detail, then craft a custom
                lender&ndash;targeting plan. This session turns your package into
                one lenders want to fund.
              </p>
            </Expandable>

            {/* 2 – Lender Matching */}
            <Expandable
              title="Expert Lender Matching & Warm Introductions – Done For You"
              icon={Target}
            >
              <p className="text-gray-600 leading-relaxed">
                Post&ndash;call, we match your specifics to our vetted Preferred
                Lenders (and shop broader as needed), then make trusted, warm
                introductions. This access and precision can&apos;t be replicated
                independently.
              </p>
            </Expandable>

            {/* 3 – PrepCoach */}
            <Expandable
              title="K2 PrepCoach – Unlimited 24/7 AI Co-Pilot"
              icon={Brain}
            >
              <p className="text-gray-600 leading-relaxed mb-4">
                Always&ndash;available expert trained on small commercial deals:
              </p>
              <ul className="space-y-2">
                {[
                  'Instant deal health score + prioritized fixes',
                  'Document gap detector & missing-item alerts',
                  'Polished narrative/cover letter generator',
                  'Red-flag scanner for underwriting risks',
                  'Rate/term/total-cost comparisons',
                  'Realistic closing timeline predictor',
                  'Full memory\u2014pick up any conversation on any deal',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-gray-600">
                Use it freely to build stronger packages and get instant answers.
              </p>
            </Expandable>

            {/* 4 – Deal Builder */}
            <Expandable
              title="Secure Deal Builder & Private Data Room"
              icon={Lock}
            >
              <p className="text-gray-600 leading-relaxed">
                Guided narrative building + password&ndash;protected vault to
                upload, organize, version&ndash;control, and reuse files across
                deals.
              </p>
            </Expandable>

            {/* 5 – Readiness Checklists */}
            <Expandable
              title="Readiness Checklists & Pro Tools"
              icon={FileSearch}
            >
              <p className="text-gray-600 leading-relaxed">
                Step&ndash;by&ndash;step tasks to identify and fix issues early.
              </p>
            </Expandable>

            {/* 6 – Automated Tracking */}
            <Expandable
              title="Automated Tracking & Alerts"
              icon={BarChart3}
            >
              <p className="text-gray-600 leading-relaxed">
                Real&ndash;time status on lender interactions and follow&ndash;ups.
              </p>
            </Expandable>

            {/* 7 – Closing Credit */}
            <Expandable title="$1,000 Closing Credit*" icon={DollarSign}>
              <p className="text-gray-600 leading-relaxed">
                Credited at closing on any funded deal through our Preferred
                Lenders. (*Terms apply&mdash;full details provided.)
              </p>
            </Expandable>

            {/* 8 – Full Support */}
            <Expandable
              title="Full K2 Support Ecosystem"
              icon={Headphones}
            >
              <p className="text-gray-600 leading-relaxed">
                Advanced resources, private community, priority expert access.
              </p>
            </Expandable>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TRANSPARENCY                                                 */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                Full Transparency
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Your Specialized Low Fee Structure
              </h2>
            </div>

            <p className="text-gray-700 text-center mb-8">
              K2 Commercial Finance operates differently&mdash;no hidden
              incentives, no yield&ndash;spread games that reward worse terms for
              you.
            </p>

            <ul className="space-y-4 mb-6">
              {[
                'Our maximum fee is just 2% (typically lender-paid only on funded deals)\u2014well below typical industry norms of 3\u20135%.',
                'Everything is disclosed upfront in writing.',
                'We never accept undisclosed yield-spread premiums that could misalign our recommendations.',
                'Our success depends on your deal closing on strong terms\u2014that\u2019s the alignment you get as a Certified Borrower.',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  NOT THE RIGHT FIT                                            */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Expandable
            title="Not the Right Fit If…"
            icon={AlertTriangle}
            variant="warning"
          >
            <p className="text-gray-700 mb-4 leading-relaxed">
              This program is selective and high&ndash;value&mdash;it&apos;s not
              for everyone. It&apos;s not the right choice if:
            </p>
            <div className="space-y-3">
              {[
                'You insist on handling every lender outreach 100% solo with no expert introductions or matching.',
                'You\u2019re unwilling to prepare documents thoroughly and engage directly with lenders after we make the connection.',
                'You\u2019re solely focused on the absolute rock-bottom rate and don\u2019t prioritize professional positioning, speed, transparency, or risk reduction.',
                'You view a $250 one-time investment as too much to protect a six- or seven-figure financing decision.',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-red-200/60 bg-red-50/40 p-4"
                >
                  <span className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5 font-bold text-lg leading-5">
                    &times;
                  </span>
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-gray-600 italic">
              If any of these apply, we won&apos;t be a good match&mdash;better to
              know upfront.
            </p>
          </Expandable>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                 */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Four Steps to a Funded Deal
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl font-bold mx-auto mb-4">
                  {s.num}
                </div>
                <p className="text-gray-700 font-medium">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PREPCOACH HIGHLIGHT                                          */}
      {/* ============================================================ */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            Included with Certification
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet PrepCoach
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Your personal AI coach that walks you through every preparation
            step&mdash;so you show up organized, confident, and lender&ndash;ready.
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Prep Coach is your unfair competitive advantage &mdash; a turnkey AI
            system specifically for commercial real estate investors and business
            owners.
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            It doesn&apos;t replace experts&mdash;it prepares you to work smarter
            with them. Faster decisions, better terms, deals that close.
          </p>
          <Link
            href="/prepcoach"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Explore PrepCoach
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                 */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Real Results
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What Certified Borrowers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-8"
              >
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-slate-200 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {t.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {t.author}
                    </p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FINAL CTA                                                    */}
      {/* ============================================================ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
            One&ndash;time $250 unlocks the tools and network that win better
            deals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <CheckoutButton
              product="certified"
              label="Become a Certified Borrower — $250 (One-Time)"
              size="lg"
              className="text-lg px-8 py-4 shadow-lg shadow-primary/30 transition-all hover:shadow-xl"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/content"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900"
            >
              <BookOpen className="h-4 w-4" />
              Browse Free Content First
            </Link>
            <Link
              href="/#readiness-quiz"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900"
            >
              <FileText className="h-4 w-4" />
              Take 2-Minute Readiness Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            Lifetime access. $1,000 closing credit* from Preferred Lender at
            close. Lender-paid fees only on funded Preferred deals. $250
            one-time. *Terms may apply.
          </p>
        </div>
      </section>
    </main>
  );
}
