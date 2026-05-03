import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  CheckCircle2,
  ArrowRight,
  Award,
  Quote,
  ChevronDown,
  FileText,
  Target,
  Users,
  Building2,
  Briefcase,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { HomeRedirect } from '@/components/HomeRedirect';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomeRedirect />

      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-start">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-5">
                <Award className="h-4 w-4" />
                Small CRE + Owner-Occupied Financing
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-5 leading-[1.15]">
                Many Borrowers Have Good Deals. Few Have{' '}
                <span className="text-primary">Finance-Ready Submissions</span>. Which One Are You?
              </h1>
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                Most small commercial real estate borrowers don&apos;t lose momentum because the deal is bad. They lose it because the submission package is incomplete, disorganized, inconsistent, or sent before it&apos;s truly ready.
              </p>

              <div className="space-y-3 text-sm md:text-base text-gray-600 leading-relaxed mb-8">
                <p>
                  Lenders are busy. A messy or incomplete file creates extra work, kills confidence, and quietly sinks in the stack.
                </p>
                <p className="font-medium text-gray-800">
                  A clean, professional package changes everything.
                </p>
                <p>
                  The K2 Lender-Ready Small CRE Loan Package Kit is built for both commercial real estate investing and owner-occupied business properties, giving you professional templates, secure tools, and Prep Coach AI to take the guesswork out of the process.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="px-6 py-5 shadow-lg shadow-primary/20">
                  <Link href="/lender-ready">
                    Get the Kit + Prep Coach AI for $39
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="px-6 py-5 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                  <Link href="/membership/certified-borrower">
                    Want Hands-On Expert Support?
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                14-Day Ready or Refund Guarantee. One-time payment. No subscription.
              </p>
            </div>

            <div className="relative hidden lg:flex items-start justify-end pt-4">
              <Image
                src="/book_cover_updated.png"
                alt="K2 Lender-Ready Small CRE Loan Package Kit with Prep Coach AI"
                width={420}
                height={540}
                className="rounded-xl shadow-2xl object-contain max-h-[440px] w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TWO WAYS TO MOVE FORWARD                                     */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              This Is More Than Templates
            </h2>
            <div className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto space-y-4">
              <p>
                It&apos;s your complete lender-ready system plus an intelligent AI co-pilot for small CRE investors and owner-occupied borrowers.
              </p>
              <p>
                Start with the K2 Lender-Ready System if you want a proven, self-directed way to build cleaner, more professional submissions.
              </p>
              <p className="font-medium text-gray-800">
                If you want direct expert involvement, the K2 Certified Borrower Program is the higher-support upgrade.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Option 1: K2 Lender-Ready System */}
            <Card className="border-2 border-slate-200 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">K2 Lender-Ready System</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-gray-600 leading-relaxed mb-6">
                  A self-directed system built to help you assemble a clean, consistent, lender-ready package before you ever start sending files to lenders.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    'Professional document library',
                    'Secure Deal Room',
                    'Submission tracking',
                    'Prep Coach AI for strategy, lender fit, and packaging help',
                    'One-time $39 payment',
                    '14-Day Ready or Refund Guarantee',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button size="lg" asChild className="w-full">
                    <Link href="/lender-ready">
                      Get the Kit for $39
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Option 2: K2 Certified Borrower Program */}
            <Card className="border-2 border-primary/20 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden bg-primary/[0.02] flex flex-col">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">K2 Certified Borrower Program</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-gray-600 leading-relaxed mb-6">
                  A higher-support option for borrowers who want K2 Commercial Finance directly involved in strategy, lender targeting, outreach, feedback review, and active deal management.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    'Includes everything in the K2 Lender-Ready System',
                    'Direct strategy, lender targeting, and outreach support',
                    'Help reviewing lender feedback, terms, and next steps',
                    'Active deal management support',
                    'One-time $250 payment',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button size="lg" variant="outline" asChild className="w-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                    <Link href="/membership/certified-borrower">
                      Explore the $250 Upgrade
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY THIS MATTERS                                             */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              What Makes This Different
            </h2>
          </div>

          <div className="space-y-4 text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
            <p>
              Instead of piecing together random templates and hoping for the best, you follow one proven system with intelligent AI guidance.
            </p>
            <p className="font-medium text-gray-800">
              You move through the financing process in a cleaner, more deliberate order:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle2, text: '1. Build your full package before you reach out' },
              { icon: FileText, text: '2. Use the Document Library to keep materials consistent' },
              { icon: Target, text: '3. Use Prep Coach AI for strategy, loan programs, and lender fit' },
              { icon: UserCheck, text: '4. Upload everything into your secure Deal Room' },
              { icon: TrendingUp, text: '5. Send professional submissions and track lender responses' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pt-2">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-lg font-medium text-gray-800 mt-10 max-w-3xl mx-auto">
            You stop looking like a novice investor and start looking like someone ready to close.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHO WE HELP                                                  */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Who This Is For
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Building2, text: 'Small commercial real estate investors' },
              { icon: Briefcase, text: 'Business owners seeking financing for owner-occupied properties' },
              { icon: Users, text: 'Borrowers who understand the importance of first impressions' },
              { icon: Target, text: 'Borrowers who want to present professionally without hiring a commercial mortgage broker' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-200 p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-gray-700 leading-relaxed pt-1">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Not For You If</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                'You are looking for guaranteed approval',
                'You are not willing to invest time organizing your documents',
                'You want someone else to fully shop and place the transaction for you',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-gray-600 leading-relaxed">
                  {item}
                </div>
              ))}
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
          <Collapsible>
            <div className="rounded-2xl border border-primary/20 bg-white shadow-sm overflow-hidden">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-6 md:p-8 text-left group cursor-pointer hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Quote className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-1">Personal Note</p>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">A Note from Ken</h3>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 md:px-8 pb-8 space-y-4 text-gray-600 leading-relaxed border-t border-slate-100 pt-6">
                  <p>
                    For most of my career, I&apos;ve focused on one part of the market in particular: small commercial borrowers and business owners.
                  </p>
                  <p>
                    They often have the fewest internal resources, the least guidance, and the greatest need to get things right the first time.
                  </p>
                  <p>
                    Too often, good borrowers are left trying to figure out what lenders want, how to present a deal properly, and how to avoid mistakes that quietly cost time, leverage, and momentum.
                  </p>
                  <p className="font-medium text-gray-800">
                    That is why I built the K2 Lender-Ready System, Prep Coach AI, and the K2 Certified Borrower Program.
                  </p>
                  <p>
                    My goal is simple: to give serious borrowers better tools, better guidance, and a more professional path through the financing process.
                  </p>
                  <p>
                    Whether you use the System on your own or decide you want our direct help, I want you to feel more prepared, more confident, and better positioned from the start.
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="font-semibold text-gray-900">Ken Kaplan</p>
                    <p className="text-sm text-gray-500">Founder, K2 Commercial Finance</p>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  START WITH THE PATH THAT FITS YOU BEST                       */}
      {/* ============================================================ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Ready to Build a Lender-Ready Package?
          </h2>
          <div className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed space-y-4">
            <p>
              Start with the K2 Lender-Ready System if you want a practical, low-cost way to organize your package, strengthen your submission, and move forward with more confidence.
            </p>
            <p>
              If you want direct expert involvement in strategy, lender targeting, outreach, and deal management, upgrade to the K2 Certified Borrower Program.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300">
              <Link href="/lender-ready">
                Get the Kit + Prep Coach AI for $39
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300">
              <Link href="/membership/certified-borrower">
                Explore the $250 Upgrade
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            14-Day "Ready or Refund" Guarantee. If you do not feel significantly more organized and confident within 14 days, request a full refund.
          </p>
        </div>
      </section>
    </div>
  );
}
