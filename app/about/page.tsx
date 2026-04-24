'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Target,
  Heart,
  Bot,
  ArrowRight,
  FileText,
  Handshake,
  Shield,
  Scale,
  Lightbulb,
  Wrench,
} from 'lucide-react';

const ABOUT_MISSION_IMAGE =
  'https://images.unsplash.com/photo-1758518727734-98f0a55983b6?auto=format&fit=crop&w=1600&q=80';
const ABOUT_INTEGRITY_IMAGE =
  'https://images.unsplash.com/photo-1758518729711-1cbacd55efdb?auto=format&fit=crop&w=1200&q=80';
const ABOUT_COMMUNICATION_IMAGE =
  'https://images.pexels.com/photos/8729952/pexels-photo-8729952.jpeg?auto=compress&cs=tinysrgb&w=1200';
const ABOUT_SPEED_IMAGE =
  'https://images.pexels.com/photos/7947656/pexels-photo-7947656.jpeg?auto=compress&cs=tinysrgb&w=1200';
const ABOUT_AI_IMAGE =
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80';

export default function AboutPage() {
  const [approachExpanded, setApproachExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            About K2 Commercial Finance
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            A More Strategic, Better-Supported Path Through Commercial Financing
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            K2 Commercial Finance was built for borrowers who want to approach commercial financing with greater clarity, stronger preparation, and experienced guidance behind them.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  INTRO / WHY K2 EXISTS                                        */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                <p>
                  Too often, small commercial real estate investors and business owners are left to navigate a complicated lending process on their own. They may have a strong opportunity, but not a clear sense of how lenders evaluate deals, how a transaction should be positioned, or how to avoid the mistakes that can cost time, leverage, and momentum.
                </p>
                <p className="font-medium text-gray-800">
                  That is why K2 exists.
                </p>
                <p>
                  I built K2 Commercial Finance to give serious borrowers a better path &mdash; one grounded in preparation, sound strategy, lender insight, and real-world execution. We want you to succeed, and we believe the right support can create value far beyond its cost.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div
                className="aspect-square rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url('${ABOUT_MISSION_IMAGE}')` }}
                aria-label="Business strategy meeting"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OUR APPROACH                                                  */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 md:p-12 border border-slate-200 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Our Approach
            </h2>

            <div className="space-y-5">
              <p className="text-lg text-gray-600 leading-relaxed">
                At K2, we believe better-prepared borrowers make better decisions and put themselves in a stronger position throughout the financing process.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Commercial financing is not simply about finding a lender. It is about preparing the opportunity properly, aligning with the right lending sources, communicating clearly, and managing the process professionally from start to finish.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We are not here to offer hype, shortcuts, or generic advice. We are here to help clients move through the process with more confidence, more efficiency, and better support at every stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHAT MAKES K2 DIFFERENT                                      */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes K2 Different
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              K2 combines modern preparation tools with experienced, relationship-driven guidance.
            </p>
          </div>

          <div className="space-y-5 text-lg text-gray-600 leading-relaxed mb-12">
            <p>
              We believe AI and Prep Coach are valuable tools that help borrowers get organized, improve the quality of their preparation, and approach financing more effectively. We want borrowers to have access to those advantages from the beginning.
            </p>
            <p className="font-medium text-gray-800">
              But commercial finance is still a human business.
            </p>
            <p>
              When a transaction becomes more nuanced, more time-sensitive, or simply more important, personal guidance can make a meaningful difference. With 25+ years of experience navigating varied lending environments, along with lender relationships and practical market insight, K2 offers clients assets they can benefit from immediately.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-lg font-medium text-gray-800 mb-6">
              That value shows up in meaningful ways:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Target, text: 'Stronger preparation' },
              { icon: TrendingUp, text: 'Better positioning' },
              { icon: Handshake, text: 'Smarter lender alignment' },
              { icon: CheckCircle2, text: 'More effective execution' },
              { icon: Shield, text: 'Better support when it matters most' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-gray-700 leading-relaxed pt-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW WE HELP                                                   */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Help
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              K2 Commercial Finance offers two primary ways to work with us:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-slate-200 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  K2 Lender-Ready System
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  A self-directed system designed to help borrowers prepare more effectively, present more professionally, and approach lenders with greater confidence.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 rounded-2xl overflow-hidden bg-primary/[0.02]">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  K2 Certified Borrower Program
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  A higher-support option for borrowers who want direct help with strategy, lender targeting, term sheet review, negotiation, and guidance through the financing process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OUR VALUES                                                    */}
      {/* ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="border-2">
              <CardContent className="p-8">
                <div
                  className="mb-5 aspect-video rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url('${ABOUT_INTEGRITY_IMAGE}')` }}
                  aria-label="Honest guidance"
                />
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Honest Guidance
                </h3>
                <p className="text-gray-600">
                  Transparent, straightforward advice grounded in real-world experience. No hype, no empty promises.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div
                  className="mb-5 aspect-video rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url('${ABOUT_COMMUNICATION_IMAGE}')` }}
                  aria-label="Serious preparation"
                />
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Serious Preparation
                </h3>
                <p className="text-gray-600">
                  We believe the quality of your preparation directly impacts the quality of your outcome.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div
                  className="mb-5 aspect-video rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url('${ABOUT_SPEED_IMAGE}')` }}
                  aria-label="Practical expertise"
                />
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Practical Expertise
                </h3>
                <p className="text-gray-600">
                  Actionable knowledge drawn from decades of experience in commercial financing.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="p-8">
                <div
                  className="mb-5 aspect-video rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url('${ABOUT_MISSION_IMAGE}')` }}
                  aria-label="Lender relationships"
                />
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Lender Relationships
                </h3>
                <p className="text-gray-600">
                  Real connections built over 25+ years that create real advantages for our clients.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div
                  className="mb-5 aspect-video rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url('image.png')` }}
                  aria-label="Respect for the process"
                />
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Scale className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Respect for the Process
                </h3>
                <p className="text-gray-600">
                  Commercial financing is complex. We treat it with the seriousness and professionalism it deserves.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <div
                  className="mb-5 aspect-video rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url('${ABOUT_AI_IMAGE}')` }}
                  aria-label="Technology used with purpose"
                />
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Technology Used with Purpose
                </h3>
                <p className="text-gray-600">
                  AI and modern tools that enhance preparation and efficiency &mdash; always in service of better outcomes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOR SERIOUS BORROWERS                                        */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            For Serious Borrowers
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            K2 Commercial Finance is built for borrowers who are willing to prepare well, engage thoughtfully, and take the process seriously.
          </p>
          <p className="text-lg text-gray-700 font-medium leading-relaxed">
            If you are looking for a more strategic, more professional, and better-supported path through commercial financing, you are in the right place.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FINAL CTA                                                    */}
      {/* ============================================================ */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Get Started
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="text-lg px-8 py-6"
            >
              <Link href="/membership">
                Explore the K2 Lender-Ready System
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 border-white hover:bg-primary hover:text-primary-foreground"
            >
              <Link href="/membership/certified-borrower">
                Learn About the K2 Certified Borrower Program
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
