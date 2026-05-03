// app/membership/certified-borrower/page.tsx
// K2 Certified Borrower Program – Final page

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckoutButton } from '@/components/CheckoutButton';
import {
  CERTIFIED_CLOSING_CREDIT_LABEL,
  CERTIFIED_PRICE_LABEL,
  KIT_PRICE_LABEL,
} from '@/lib/products';
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  Lock,
  DollarSign,
  Quote,
  ChevronDown,
  Target,
  TrendingUp,
  Users,
  Phone,
        const FAQ_ITEMS = [
          {
            q: 'Is this a broker relationship?',
            a: 'The K2 Certified Borrower Program is the higher-support option in which K2 Commercial Finance works directly with you throughout the financing process. Specific broker engagement terms and compensation are disclosed clearly in writing.',
          },
          {
            q: 'Do I still get the K2 Lender-Ready System?',
            a: 'Yes. The Program includes the K2 Lender-Ready System.',
          },
          {
            q: 'Does K2 Commercial Finance guarantee funding?',
            a: 'No. No honest lender, broker, or advisor can guarantee funding. What K2 Commercial Finance does is improve the quality of the strategy, targeting, presentation, communication, and process.',
          },
          {
            q: `Why charge ${CERTIFIED_PRICE_LABEL} upfront?`,
            a: 'Because serious transactions require real time, effort, and attention. The upfront investment helps ensure we are working with serious borrowers who are prepared to engage in the process.',
          },
          {
            q: `What is the ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit?`,
            a: `If your transaction successfully closes, you receive a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit. It is our way of rewarding serious borrowers who follow through.`,
          },
        ];
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-primary/20 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left cursor-pointer hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 md:px-8 pb-8 border-t border-slate-100 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Data                                                            */
/* ------------------------------------------------------------------ */
const FAQ_ITEMS = [
  {
    q: 'Is this a broker relationship?',
    a: 'The K2 Certified Borrower Program is the higher-support option in which K2 Commercial Finance works directly with you throughout the financing process. Specific broker engagement terms and compensation are disclosed clearly in writing.',
  },
  {
    q: 'Do I still get the K2 Lender-Ready System?',
    a: 'Yes. The Program includes the K2 Lender-Ready System.',
  },
  {
    q: 'Does K2 Commercial Finance guarantee funding?',
    a: 'No. No honest lender, broker, or advisor can guarantee funding. What K2 Commercial Finance does is improve the quality of the strategy, targeting, presentation, communication, and process.',
  },
  {
    q: `Why charge ${CERTIFIED_PRICE_LABEL} upfront?`,
    a: 'Because serious transactions require real time, effort, and attention. The upfront investment helps ensure we are working with serious borrowers who are prepared to engage in the process.',
  },
  {
    q: `What is the ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit?`,
    a: `If your transaction successfully closes, you receive a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit. It is our way of rewarding serious borrowers who follow through.`,
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
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Award className="h-4 w-4" />
            K2 Certified Borrower Program
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight max-w-3xl mx-auto">
            You Don&apos;t Have to Chase Lenders, Sort Through Mixed Signals, and Figure It All Out Alone
          </h1>

          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            When you become a K2 Certified Borrower, K2 Commercial Finance steps in to help shape the strategy, target the right lenders and loan programs, pursue direct lender term sheets, review terms, and help you negotiate the best possible transaction.
          </p>

          <p className="text-lg font-semibold text-gray-900 mb-2">
            {`One-time ${CERTIFIED_PRICE_LABEL} payment. Lifetime access.`}
          </p>
          <p className="text-base text-primary font-medium mb-8">
            {`Receive a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit on any successfully closed transaction.`}
          </p>

          <CheckoutButton
            product="certified"
            label={`Become a K2 Certified Borrower for ${CERTIFIED_PRICE_LABEL}`}
            size="lg"
            className="text-lg px-8 py-6 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          />

          <p className="mt-6 text-sm text-gray-500">
            Built for serious borrowers who want broker support, not random lender matching.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY BORROWERS UPGRADE                                        */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Borrowers Upgrade
            </h2>
          </div>

          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              In commercial real estate, strong deals deserve strong representation.
            </p>
            <p>
              Financing is about more than information. It is about strategy, positioning, relationships, and access to the right lenders.
            </p>
            <p className="font-medium text-gray-800">
                  `One-time ${CERTIFIED_PRICE_LABEL} payment`,
                  `Includes a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit on any successfully closed transaction`,
            <p>
              Because in this business, what you know matters. But who represents you matters too.
            </p>
            <p className="font-medium text-gray-800">
              The strongest investors build the right team. K2 is ready to be part of yours.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY THE $250 UPFRONT INVESTMENT MAKES SENSE                  */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {`Why the ${CERTIFIED_PRICE_LABEL} Upfront Investment Makes Sense`}
            </h2>
          </div>

          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              {`The ${CERTIFIED_PRICE_LABEL} upfront payment helps confirm that you are serious, engaged, and prepared to move forward on a real transaction. K2 Commercial Finance invests meaningful time, energy, judgment, and relationship capital into every file we take on, so it is important that our clients show a real level of commitment.`}
            </p>
            <p className="font-medium text-gray-800">
              {`And when your transaction closes, we make that commitment back to you with a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit.`}
            </p>
            <p>
              {`In other words, you invest ${CERTIFIED_PRICE_LABEL} up front, and if your transaction closes successfully, you receive a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit.`}
            </p>
            <p>
              That helps align incentives from the beginning and rewards borrowers who are prepared to follow through.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8 flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Let's Invest in Each Other</p>
              <p className="text-gray-600">
                {`You invest ${CERTIFIED_PRICE_LABEL} upfront → your transaction closes successfully → you receive a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FULL TRANSPARENCY                                             */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <p className="text-sm font-semibold text-primary tracking-wide mb-3">
              FULL TRANSPARENCY
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Your Specialized Low Fee Structure
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              <span className="font-semibold text-gray-900">K2 Commercial Finance</span> is built on transparency and alignment, with no compensation tied to less favorable terms for our clients.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                text: 'Our maximum fee is just 2% (typically lender-paid only on funded deals)—well below typical industry norms of 3–5%.',
              },
              {
                text: 'Everything is disclosed upfront in writing.',
              },
              {
                text: 'We never accept undisclosed yield-spread premiums that could misalign our recommendations.',
              },
              {
                text: `Our interests are fully aligned with yours—we are compensated only when your deal closes, and our success is measured by the strength of your outcome.`,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg bg-slate-50 p-4 border border-slate-200">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                  */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              {
                num: '1',
                title: `Pay ${CERTIFIED_PRICE_LABEL} once`,
                text: 'You become a K2 Certified Borrower and receive lifetime access.',
              },
              {
                num: '2',
                title: 'Complete your file',
                text: 'Use the K2 Lender-Ready System to organize your package and get lender-ready.',
              },
              {
                num: '3',
                title: 'Review strategy with K2 Commercial Finance',
                  `One-time ${KIT_PRICE_LABEL} payment`,
              },
              {
                num: '4',
                title: 'We handle lender targeting and outreach',
                text: 'K2 Commercial Finance launches your transaction and works to generate direct lender interest and term sheets.',
              },
              {
                num: '5',
                title: 'We stay involved through the process',
                text: 'We assist with lender calls, document and term review, underwriting navigation, negotiation support, and the path to closing.',
              },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-5 rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-lg font-bold flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{step.title}</p>
                  <p className="text-gray-600 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  COMPARISON: SYSTEM vs PROGRAM                                 */}
                  `One-time ${CERTIFIED_PRICE_LABEL} payment`,
                  `Includes a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit on any successfully closed transaction`,
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              K2 Lender-Ready System vs. K2 Certified Borrower Program
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* System */}
            <div className="rounded-2xl border-2 border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">K2 Lender-Ready System</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Self-directed financing preparation',
                  'Templates, tools, deal room, tracking, and Prep Coach AI',
                  'Build and manage the process yourself',
                  `One-time ${KIT_PRICE_LABEL} payment`,
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/lender-ready"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                >
                  View the System <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Certified Borrower Program */}
            <div className="rounded-2xl border-2 border-primary/30 bg-primary/[0.02] p-8 relative">
              <div className="absolute -top-3 right-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  <Award className="h-3 w-3" />
                  Recommended
                </span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">K2 Certified Borrower Program</h3>
              </div>
              <div className="space-y-3">
                {[
                  'Includes everything in the System',
                  'K2 Commercial Finance helps shape strategy and execute the financing process',
                  'Handles program targeting, lender targeting, and lender outreach',
                  'Works to secure direct lender term sheets',
                  'Assists with lender calls, term review, and negotiation',
                  'Supports you through underwriting and closing',
                  `One-time ${CERTIFIED_PRICE_LABEL} payment`,
                  `Includes a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit on any successfully closed transaction`,
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY K2 COMMERCIAL FINANCE                                    */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="absolute -top-40 left-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why K2 Commercial Finance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Online lender-matching sites cannot replace real judgment, real relationships, or real advocacy.
            </p>
          </div>

          <div className="text-lg font-medium text-gray-800 mb-8">
            K2 Commercial Finance brings:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
            {[
              { icon: Briefcase, text: 'Decades of commercial financing experience' },
              { icon: Handshake, text: 'Relationship-based lender access' },
              { icon: Target, text: 'Stronger judgment around lender fit' },
              { icon: TrendingUp, text: 'More professional deal positioning' },
              { icon: Shield, text: 'Better support through underwriting and closing' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-gray-700 leading-relaxed pt-2">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-lg text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
            When a lender receives a file through K2 Commercial Finance, it arrives with more context, stronger preparation, and greater credibility.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHO THIS IS FOR / NOT FOR                                    */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Good Fit */}
            <div className="rounded-2xl border-2 border-green-200 overflow-hidden">
              <div className="bg-green-50/50 p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-900">Who This Is For</h3>
                <p className="text-sm text-green-700 mt-1">
                  The K2 Certified Borrower Program is a strong fit if:
                </p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  'You have a real transaction and want to move efficiently',
                  'You want K2 Commercial Finance involved in the process',
                  'You want help targeting the right lenders and loan programs',
                  'You want professional lender outreach',
                  'You want help reviewing terms and negotiating the transaction',
                  'You want support through underwriting and closing',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Not a Fit */}
            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden">
              <div className="bg-slate-50/50 p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Who This Is Not For</h3>
                <p className="text-sm text-gray-500 mt-1">
                  This is probably not the right fit if:
                </p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  'You expect guaranteed approval',
                  'You are not willing to gather documents and complete your file',
                  'You want someone else to do everything while you stay disengaged',
                  'You are only looking for a free lender list',
                  'You are not ready to move on a real transaction',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-slate-300 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-500">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  A NOTE FROM KEN                                              */}
      {/* ============================================================ */}
      <section className="py-16 bg-slate-50 relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Collapsible title="A Note from Ken" icon={Quote}>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                When someone joins the K2 Certified Borrower Program, I take that seriously.
              </p>
              <p>
                This is not just about putting a file in front of lenders. It is about helping a borrower think clearly, position the transaction properly, avoid preventable mistakes, and move through a process that can easily become frustrating, time-consuming, and expensive.
              </p>
              <p>
                I&apos;ve spent more than 25 years in commercial mortgage lending, reviewed thousands of loan requests, and helped close over $100 million in transactions. Over that time, I&apos;ve seen how often small commercial borrowers are left to handle the most important parts of the process without enough guidance.
              </p>
              <p className="font-medium text-gray-800">
                That is exactly why this Program exists.
              </p>
              <p>
                If we work together, my goal is to bring clarity, judgment, structure, and real support to the transaction &mdash; from lender and program targeting through term review, negotiation, and closing.
              </p>
              <p>
                These deals matter. If you become a K2 Certified Borrower, I will do my best to help you move through the process with stronger preparation and the benefit of real experience behind you.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="font-semibold text-gray-900">Ken Kaplan</p>
                <p className="text-sm text-gray-500">Founder, K2 Commercial Finance</p>
              </div>
            </div>
          </Collapsible>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRICING                                                      */}
      {/* ============================================================ */}
      <section className="py-16 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              K2 Certified Borrower Program
            </h2>
            <p className="text-xl text-gray-700 mb-1">
              One-time <span className="font-bold text-primary">{CERTIFIED_PRICE_LABEL}</span> payment
            </p>
            <p className="text-lg text-gray-600 mb-1">
              Lifetime access
            </p>
            <p className="text-base text-primary font-medium mb-6">
              {`Plus a ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit on any successfully closed transaction`}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Transparent success fee structure on funded transactions will be disclosed upfront in writing.
            </p>

            <CheckoutButton
              product="certified"
              label={`Become a K2 Certified Borrower for ${CERTIFIED_PRICE_LABEL}`}
              size="lg"
              className="text-lg px-8 py-6 shadow-lg shadow-primary/20"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                          */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              FAQ
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FINAL CTA                                                    */}
      {/* ============================================================ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-lg text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed space-y-4">
            <p>
              If you want to handle lender targeting, lender outreach, and process management on your own, the{' '}
              <Link href="/lender-ready" className="text-white font-semibold hover:underline">
                K2 Lender-Ready System
              </Link>{' '}
              gives you the tools to do that.
            </p>
            <p>
              If you want K2 Commercial Finance actively involved to help target the right lenders and programs, pursue direct lender term sheets, review terms, help negotiate the best possible transaction, and support you through underwriting and closing, become a K2 Certified Borrower.
            </p>
          </div>

          <CheckoutButton
            product="certified"
            label={`Become a K2 Certified Borrower for ${CERTIFIED_PRICE_LABEL}`}
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
          />

          <p className="mt-6 text-sm text-slate-400">
            {`One-time payment. Lifetime access. ${CERTIFIED_CLOSING_CREDIT_LABEL} closing credit on any successfully closed transaction.`}
          </p>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Item component                                                  */
/* ------------------------------------------------------------------ */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}
