'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  FileCheck,
  Headphones,
  Star,
  DollarSign,
  ChevronDown,
} from 'lucide-react';

type PathItem = {
  step: number;
  icon: typeof BookOpen;
  title: string;
  idealFor: string;
  bullets: string[];
  commitment: string;
  cta: { label: string; href: string };
  featured?: boolean;
  feeTransparency?: {
    title: string;
    text: string;
  };
};

const PATHS: PathItem[] = [
  {
    step: 1,
    icon: BookOpen,
    title: 'Learn Borrowing Tips and Strategies for Free',
    idealFor: `you're brand new to commercial real estate financing, unsure if it fits your goals, or want smart, no-risk education before committing time or money\u2014avoid wasting months on bad advice or rookie mistakes.`,
    bullets: [
      'Free videos & articles \u2013 no signup, no email gate',
      'Clear breakdowns of major loan programs, common pitfalls, and must-have prep steps',
      'Honest insights to decide quickly whether financing accelerates your deals (or if another path makes more sense)',
    ],
    commitment: '$0 \u2013 just your time and curiosity.',
    cta: { label: 'Browse Free Educational Content', href: '/content' },
  },
  {
    step: 2,
    icon: FileCheck,
    title: 'Go Independent \u2013 Financing Success Kit',
    idealFor: `you're organized, self-motivated, and ready to take control\u2014wanting to submit clean, professional packages that lenders actually want to fund, while skipping expensive brokers and saving thousands in fees.`,
    featured: true,
    bullets: [
      '$15 one-time instant access (50+ pages, 15+ ready-to-use worksheets & templates)',
      'Step-by-step tools to pick the right loan program, organize docs lenders love, compare offers apples-to-apples, and dodge common deal-killers',
      'Private Document Vault with checklists, tear sheets, lifetime updates, and immediate download',
      'Pro-level polish without needing years of experience',
    ],
    commitment: '$15 one-time. No subscriptions, no hidden upsells \u2013 pure leverage for the DIY borrower.',
    cta: { label: 'Get the Kit \u2013 Only $15', href: '/workbook' },
  },
  {
    step: 3,
    icon: Headphones,
    title: 'K2 Certified Borrower \u2013 Expert Placement & AI Support',
    idealFor: `you want expert guidance, lender placement, and AI-powered prep support to maximize your close probability and terms.`,
    bullets: [
      'K2 Certified Borrower status + lifetime unlimited access ($249 one-time)',
      'PrepCoach \u2013 your dedicated AI agent built specifically for small commercial borrowers: guides every step of prep, spots gaps, and helps you show up lender-ready. CRE expertise available 24/7/365',
      '30-minute free expert consultation to personally review your loan submission package, strategy, and positioning',
      'Done-for-you Transaction Overview \u2013 professional, lender-attractive Executive Summary we customize for your deal',
      'Direct access to our Preferred Lender network \u2013 we handle the placement work, introductions, and follow-through to get your deal in front of the right capital sources - or contact lenders on your own',
      'Advanced video library, document review support, ongoing chat / email support',
      '$1,500 closing credit from any Preferred Lender you close with (6x ROI on your membership fee) *Terms Apply*',
    ],
    feeTransparency: {
      title: 'How We Get Paid',
      text: 'Flat, success-only fee paid by the lender on closed loans (typically 1\u20132% depending on size) \u2013 zero cost to you if it doesn\u2019t close, full transparency, no hidden upfront fees.',
    },
    commitment:
      '$249 one-time \u2013 with 6X payback via closing $1,500 credit + dramatically higher close probability and better terms.',
    cta: {
      label: 'Become K2 Certified \u2013 $249',
      href: '/membership/certified-borrower',
    },
  },
];

export function PathsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {PATHS.map((item, index) => {
        const isFeatured = item.featured === true;
        const isOpen = openIndex === index;

        return (
          <Card
            key={item.step}
            className={`relative flex flex-col rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full ${
              isFeatured
                ? 'border-2 border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/20'
                : 'border border-slate-200 hover:border-primary/30'
            }`}
          >
            {isFeatured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                  <Star className="h-3.5 w-3.5 fill-white" />
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className="pb-4 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-white text-lg font-bold shadow-sm ${
                    isFeatured ? 'bg-primary' : 'bg-slate-800'
                  }`}
                >
                  {item.step}
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isFeatured
                      ? 'bg-primary/10 text-primary'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
              <CardTitle className="text-xl leading-snug">
                {item.title}
              </CardTitle>
              <p className="text-sm text-primary/90 mt-3 leading-relaxed">
                <span className="font-semibold">Best if:</span> {item.idealFor}
              </p>

              {/* Accordion toggle */}
              <button
                onClick={() => toggle(index)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                {isOpen ? 'Less' : 'More'}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </CardHeader>

            {/* Expandable content */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
                <div className="flex-1 space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      What You Get
                    </p>
                    <ul className="space-y-3">
                      {item.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {item.feeTransparency && (
                    <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-sm">
                      <p className="font-semibold text-gray-900 mb-2">
                        {item.feeTransparency.title}
                      </p>
                      <p className="text-gray-600 mb-2">
                        {item.feeTransparency.text}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-auto pt-6 flex-shrink-0 space-y-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">
                      {item.commitment}
                    </p>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className={`w-full ${
                      isFeatured ? 'shadow-md shadow-primary/20' : ''
                    }`}
                    variant={isFeatured ? 'default' : 'outline'}
                  >
                    <Link href={item.cta.href}>
                      {item.cta.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
