'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  FileCheck,
  Target,
  Users,
  Zap,
  Shield,
  Globe,
  DollarSign,
  ArrowRight,
  Handshake,
  Video,
  Upload,
  UserCheck,
  ClipboardList,
  Send,
  Search,
  PhoneCall,
  Star,
} from 'lucide-react';

/* ── Benefit items ────────────────────────────────────────────────── */
const BENEFITS = [
  {
    icon: FileCheck,
    title: 'Professionally Prepared, Complete Loan Packages',
    description:
      'Every submission is built by our team using our proven Financing Success Kit methodology. You receive submission packages with a complete application, transaction overview, required financials, projections, and supporting documentation — enough information to quickly determine a potential fit.',
  },
  {
    icon: Target,
    title: 'Laser-Targeted Submissions',
    description:
      'We only send you deals that align with your lending appetite (loan size, property type, geography, LTV, DSCR, industry focus, etc.). No spam. No tire-kickers. Just high-probability opportunities.',
  },
  {
    icon: Users,
    title: 'Warm, Efficient Introductions',
    description:
      'When you express interest, we schedule a short introductory video call between you and the borrower. The relationship starts warm, professional, and productive — saving everyone time and building trust from the first conversation.',
  },
  {
    icon: Zap,
    title: 'Faster Underwriting & Higher Close Rates',
    description:
      'Because packages are complete and borrowers are pre-vetted, your team spends less time chasing documents and more time making decisions. Lenders in our network consistently report faster turnaround and stronger conversion rates.',
  },
  {
    icon: Shield,
    title: 'Exclusive Deal Flow',
    description:
      'As a preferred partner, you get priority access to our growing pipeline of commercial mortgage and investment property transactions — before they hit the broader market.',
  },
  {
    icon: Globe,
    title: 'Dedicated Lender-Specific Page on Our Site',
    description:
      "You'll receive your own professional lender page on the K2 Commercial Finance website where prospective borrowers can learn about your programs.",
  },
  {
    icon: DollarSign,
    title: 'Completely Free to Participate',
    description:
      'There are no fees, no minimums, and no obligations. You simply review the opportunities we send and move forward only on the ones that fit.',
  },
];

/* ── What We Expect ───────────────────────────────────────────────── */
const EXPECTATIONS = [
  {
    icon: UserCheck,
    text: 'Offer borrowers a single dedicated point of contact for clear, responsive communication throughout the process.',
  },
  {
    icon: DollarSign,
    text: 'Provide a $1,000 closing credit to the borrower — a small gesture that builds goodwill and helps move deals forward.',
  },
  {
    icon: Upload,
    text: 'Upload professional tear sheets and other downloadable materials to your dedicated lender page so borrowers can easily review your programs.',
  },
  {
    icon: Video,
    text: 'Record a short video introduction to your company and programs. This exclusive benefit lets you personally tell borrowers why your lending solution may be the right fit for them. (Takes 10 minutes for us to record virtually.)',
  },
];

/* ── How It Works ─────────────────────────────────────────────────── */
const STEPS = [
  {
    num: '1',
    icon: ClipboardList,
    title: 'You Share Your Criteria',
    description:
      'Tell us your lending guidelines, preferred property types, locations, and deal parameters. We build a dedicated web page and provide priority matches.',
  },
  {
    num: '2',
    icon: Send,
    title: 'We Prepare and Submit Curated Packages',
    description:
      'Our team assembles complete, professional loan packages tailored to your requirements and submits them for your review.',
  },
  {
    num: '3',
    icon: Search,
    title: 'You Review and Decide',
    description:
      'Packages come to you cleanly organized. You evaluate at your own pace.',
  },
  {
    num: '4',
    icon: PhoneCall,
    title: 'Warm Introduction (When Interested)',
    description:
      'We schedule a brief video call so you can connect directly with the borrower.',
  },
  {
    num: '5',
    icon: Star,
    title: 'White-Glove Execution',
    description:
      'You work directly with the borrower through your dedicated point of contact and deliver the $1,000 closing credit.',
  },
];

export default function LendersJoinPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Handshake className="h-14 w-14 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Join the K2 Commercial Finance
            <br />
            Preferred Lender Network
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            High-Quality, Curated Commercial Mortgage Deals — Delivered Ready to Underwrite
          </p>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            At K2 Commercial Finance, we&apos;ve spent years perfecting the art
            of commercial and investment property financing. We don&apos;t just
            connect brokers and borrowers to lenders — we curate every
            transaction so you, the lender, receive only complete, professional,
            and highly targeted loan packages that match your exact criteria.
          </p>
          <p className="text-gray-900 font-medium italic border-l-4 border-primary pl-5">
            Think of it as your private deal pipeline: pre-screened,
            pre-packaged, and pre-warmed borrowers who are serious, qualified,
            and ready to close.
          </p>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Why Lenders Love Being Part of the K2 Preferred Lender Network
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Here&apos;s what you can expect as a preferred partner:
          </p>

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
            To deliver an outstanding experience to every borrower and help
            deals close smoothly, we ask our preferred lenders to provide simple
            but important white-glove service. The lenders who see the most
            success in our network do the following:
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
            These straightforward steps create a professional, transparent, and
            borrower-friendly experience that sets our network apart and helps
            everyone win.
          </p>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            How the K2 Preferred Lender Network Works
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
            Ready to Get Better Deals with Less Friction?
          </h2>
          <p className="text-slate-300 text-lg mb-4 leading-relaxed">
            Join the growing network of lenders who are enjoying higher-quality
            commercial mortgage opportunities, faster decision-making, and
            stronger borrower relationships — all at no cost to you.
          </p>
          <h3 className="text-xl font-semibold text-white mb-2">
            Apply to Join the K2 Preferred Lender Network Today
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
            Once approved, we&apos;ll set up your personalized lender page,
            gather your video and materials, and start sending you matching
            opportunities.
          </p>
          <p className="mt-4 text-slate-500 text-sm">
            Questions? Feel free to reach out — we&apos;re happy to walk
            through the process.
          </p>
        </div>
      </section>
    </div>
  );
}
