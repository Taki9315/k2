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

type RichBullet = {
  title: string;
  description?: string;
  subBullets?: string[];
};

type BulletItem = string | RichBullet;

type PathItem = {
  step: number;
  icon: typeof BookOpen;
  title: string;
  subtitle?: string;
  idealFor: string;
  bullets: BulletItem[];
  commitment: string;
  cta: { label: string; href: string };
  featured?: boolean;
  feeTransparency?: {
    title: string;
    text: string;
    bullets?: string[];
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
    subtitle: 'A small investment that protects a very big decision.',
    idealFor: `organized, self\u2011motivated borrowers who want to submit clean, professional loan packages lenders actually want to fund\u2014targeting lenders on your own and avoiding broker involvement.`,
    featured: true,
    bullets: [
      {
        title: 'Instant Access \u2013 $20 One\u2011Time',
        description: 'A complete DIY financing system: instantly downloadable guidance and online tools to help you move through the financing process with clarity and purpose.',
      },
      {
        title: 'Step\u2011By\u2011Step Loan Prep Tools',
        description: 'A clear path to choosing the right loan program, organizing lender\u2011ready documents, accelerating your process and avoiding the mistakes that quietly kill deals.',
      },
      {
        title: 'Document Library \u2013 Everything Lenders Expect',
        description: 'Personal financial statements, borrower forms, templates lenders expect, and supporting docs\u2014organized, downloadable, and ready to use.',
      },
      {
        title: 'Deal Room \u2013 Track Each Deal Independently',
        description: 'Each deal gets its own dedicated workspace. Upload documents, track progress, and keep everything organized and lender\u2011ready.',
      },
      {
        title: 'Submission Tracker \u2013 Know Exactly Where You Stand',
        description: 'Log every lender you\u2019ve submitted to and track the status of each one. This alone saves hours and prevents deals from stalling.',
      },
      {
        title: 'Pro\u2011Level Polish, Zero Experience Required',
        description: 'Everything you need to present a clean, credible, lender\u2011friendly package\u2014without years of industry experience.',
      },
    ],
    commitment: '$20 one\u2011time. No subscriptions. No upsells. Just a powerful, self\u2011directed system that puts you in control.',
    cta: { label: 'Get the Kit \u2013 $20 One\u2011Time', href: '/workbook' },
  },
  {
    step: 3,
    icon: Headphones,
    title: 'K2 Certified Borrower',
    subtitle: 'Partner with K2 Commercial Finance',
    idealFor: `borrowers ready to move fast\u2014partner with K2 for expert lender matching, warm introductions, and lifetime tools.`,
    bullets: [
      {
        title: '30\u2011Minute Private Strategy & Coaching Call',
        description: 'We review your paperwork and deal in detail, then craft a custom lender\u2011targeting plan.',
      },
      {
        title: 'Expert Lender Matching & Warm Introductions \u2013 Done For You',
        description: 'We match your specifics to our vetted Preferred Lenders, then make trusted, warm introductions. After the intro, it\u2019s you and the lender\u2014direct and efficient.',
      },
      {
        title: 'K2 PrepCoach\u2122 \u2013 Unlimited 24/7 AI Co\u2011Pilot',
        description: 'Always\u2011available expert trained on small commercial deals.',
        subBullets: [
          'Instant deal health score + prioritized fixes',
          'Document gap detector & missing\u2011item alerts',
          'Polished narrative/cover letter generator',
          'Red\u2011flag scanner for underwriting risks',
          'Rate/term/total\u2011cost comparisons',
          'Realistic closing timeline predictor',
        ],
      },
      {
        title: 'Secure Deal Builder & Private Data Room',
        description: 'Guided narrative building + password\u2011protected vault to upload, organize, version\u2011control, and reuse files across deals.',
      },
      {
        title: 'Readiness Checklists & Pro Tools',
        description: 'Step\u2011by\u2011step tasks to identify and fix issues early.',
      },
      {
        title: '$1,000 Closing Credit*',
        description: 'Credited at closing on any funded deal through our Preferred Lenders. (*Terms apply.)',
      },
    ],
    feeTransparency: {
      title: 'Full Transparency: Your Low Fee Structure',
      text: 'No hidden incentives, no yield\u2011spread games.',
      bullets: [
        'Maximum fee just 2% (typically lender\u2011paid only on funded deals)',
        'Everything disclosed upfront in writing',
        'No undisclosed yield\u2011spread premiums',
        'Our success depends on your deal closing on strong terms',
      ],
    },
    commitment:
      '$250 one\u2011time \u2013 Lifetime access. First 100 Certified Borrowers secure lifetime access\u2014spots are limited.',
    cta: {
      label: 'Become a Certified Borrower \u2013 $250',
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
              {item.subtitle && (
                <p className="text-base text-gray-500 font-medium mt-1 leading-snug">
                  {item.subtitle}
                </p>
              )}
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
                isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
                <div className="flex-1 space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                      What You Get
                    </p>
                    <ul className="space-y-3">
                      {item.bullets.map((bullet, i) => {
                        if (typeof bullet === 'string') {
                          return (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed"
                            >
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              {bullet}
                            </li>
                          );
                        }
                        return (
                          <li key={i} className="space-y-1">
                            <div className="flex items-start gap-2.5">
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{bullet.title}</p>
                                {bullet.description && (
                                  <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{bullet.description}</p>
                                )}
                                {bullet.subBullets && (
                                  <ul className="mt-1.5 space-y-1 ml-0.5">
                                    {bullet.subBullets.map((sub, j) => (
                                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-primary mt-0.5">&bull;</span>
                                        {sub}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
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
                      {item.feeTransparency.bullets && (
                        <ul className="space-y-1 mt-2">
                          {item.feeTransparency.bullets.map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600">
                              <span className="text-primary mt-0.5">&bull;</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
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
