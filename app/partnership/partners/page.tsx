'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Globe,
  Upload,
  Users,
  Target,
  Handshake,
  DollarSign,
  ArrowRight,
  Wrench,
  UserCheck,
  Video,
  ClipboardList,
  PhoneCall,
  Heart,
  CheckCircle2,
  Shield,
} from 'lucide-react';

/* ── Benefits ────────────────────────────────────────────────────── */
const BENEFITS = [
  {
    icon: Target,
    title: 'Targeted Referrals of Serious Clients',
    description:
      'We send you warm introductions to borrowers who need commercial real estate services right now — buyers looking for properties, owners refinancing, or investors expanding their portfolios.',
  },
  {
    icon: Shield,
    title: 'Pre-Screened & Motivated Prospects',
    description:
      'Every referred client has completed our structured financing process and is actively working toward a transaction. No tire-kickers or unqualified leads.',
  },
  {
    icon: Handshake,
    title: 'Easy, Professional Introductions',
    description:
      'When there\'s a good fit, we make warm handoffs so you can connect quickly and start building the relationship.',
  },
  {
    icon: DollarSign,
    title: 'Completely Free to Participate',
    description:
      'No fees, no minimums, and no obligations. You only work with the clients you want.',
  },
  {
    icon: Globe,
    title: 'Your Own Professional Profile Page',
    description:
      'You get a dedicated page on the K2 Commercial Finance website where you can post a short video introduction, upload your service information, tear sheets, or marketing materials so our borrowers can easily find and learn about you.',
  },
];

/* ── What We Expect ───────────────────────────────────────────────── */
const EXPECTATIONS = [
  {
    icon: UserCheck,
    text: 'Provide a single dedicated point of contact for clear and responsive communication.',
  },
  {
    icon: CheckCircle2,
    text: 'Deliver professional, white-glove service that matches the high standards of our borrowers.',
  },
  {
    icon: Upload,
    text: 'Upload helpful service information or downloadable materials to your profile page so borrowers can quickly understand what you offer.',
  },
  {
    icon: Video,
    text: 'Record a short video introduction telling our borrowers why your services may be the right fit for their commercial real estate needs.',
  },
];

/* ── How It Works ────────────────────────────────────────────────── */
const STEPS = [
  {
    num: '1',
    title: 'You Tell Us Your Focus Areas',
    description:
      'Share the types of commercial real estate services you provide and any geographic or property-type preferences.',
  },
  {
    num: '2',
    title: 'We Match and Introduce',
    description:
      'When one of our certified borrowers needs your type of service, we send a warm introduction.',
  },
  {
    num: '3',
    title: 'You Connect Directly',
    description:
      'You speak with the borrower, present your expertise, and move forward at your own pace.',
  },
  {
    num: '4',
    title: 'Build Long-Term Relationships',
    description:
      'Many of our providers develop ongoing referral relationships with active commercial investors.',
  },
];

export default function PartnersJoinPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Wrench className="h-14 w-14 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Join the K2 Commercial Finance
            <br />
            Preferred Provider Program
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Get Steady Referrals of Serious Commercial Real Estate Clients — Ready to Act
          </p>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            At K2 Commercial Finance, we help commercial property owners and
            investors get the financing they need to buy, refinance, or grow
            their portfolios — fast and professionally.
          </p>
          <p>
            Our borrowers are certified, pre-qualified, and actively seeking
            commercial mortgages or investment property loans. That makes them
            high-quality prospects for commercial real estate agents, appraisers,
            property managers, real estate attorneys, and other CRE service
            providers.
          </p>
          <p className="text-gray-900 font-medium italic border-l-4 border-primary pl-5">
            By joining our Preferred Provider Program, you gain access to
            motivated clients who already understand the financing process and
            are ready to move.
          </p>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Why CRE Professionals Love the K2 Preferred Provider Program
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {BENEFITS.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Expect ───────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            What We Expect From You
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            To deliver excellent service to our borrowers, we simply ask our
            Preferred Providers to:
          </p>

          <div className="space-y-6">
            {EXPECTATIONS.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-border bg-slate-50 p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="text-gray-700 leading-relaxed pt-1">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            These easy steps help create a smooth, trustworthy experience for
            everyone involved.
          </p>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            How the K2 Preferred Provider Program Works
          </h2>

          <div className="space-y-6">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-5 rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white text-lg font-bold">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get More High-Quality CRE Clients?
          </h2>
          <p className="text-slate-300 text-lg mb-4 leading-relaxed">
            Join the growing network of commercial real estate agents,
            appraisers, property managers, attorneys, and other service providers
            who are receiving steady, warm referrals from motivated borrowers —
            at no cost to you.
          </p>
          <h3 className="text-xl font-semibold text-white mb-2">
            Apply to Join the K2 Preferred Provider Program Today
          </h3>
          <p className="text-slate-400 text-sm mb-8">
            Simple form — takes just a couple of minutes, no obligation
          </p>
          <Button size="lg" asChild className="gap-2 text-base px-8">
            <Link href="/partnership#apply">
              Apply Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-8 text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Once approved, we&apos;ll set up your personalized provider page,
            gather your video and materials, and start sending you matching
            opportunities.
          </p>
          <div className="mt-10 pt-8 border-t border-slate-700">
            <p className="text-slate-300 font-semibold">
              K2 Commercial Finance
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Commercial &amp; Investment Property Loans &bull; Get Your Loan Approved FAST
            </p>
            <p className="text-slate-500 text-sm mt-2">
              We&apos;re excited to build a long-term, mutually beneficial
              partnership with you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
