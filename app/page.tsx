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
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-5 leading-[1.15]">
                Professional Commercial Financing Support for{' '}
                <span className="text-primary">Serious Borrowers</span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                Choose the path that fits you best: prepare your deal yourself with the K2 Lender-Ready System, or work directly with K2 Commercial Finance through the K2 Certified Borrower Program.
              </p>

              <div className="space-y-3 text-sm md:text-base text-gray-600 leading-relaxed mb-8">
                <p>
                  A lot of good deals lose momentum for preventable reasons. The file is incomplete. The wrong lenders are targeted. The borrower is left guessing through a process that should be clearer than it is.
                </p>
                <p className="font-medium text-gray-800">
                  K2 Commercial Finance exists to solve that problem.
                </p>
                <p>
                  We help small commercial real estate borrowers and owner-occupied business-property borrowers prepare more professionally, communicate more clearly, and move through the financing process with greater confidence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="px-6 py-5 shadow-lg shadow-primary/20">
                  <Link href="/membership">
                    Explore the K2 Lender-Ready System
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="px-6 py-5 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                  <Link href="/membership/certified-borrower">
                    Learn About the K2 Certified Borrower Program
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:flex items-start justify-end pt-4">
              <Image
                src="/book_cover.png"
                alt="K2 Lender-Ready Small CRE Loan Package Kit"
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
              Two Ways to Move Forward
            </h2>
            <div className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto space-y-4">
              <p>
                Some borrowers want a better system so they can prepare and manage the process themselves.
              </p>
              <p>
                Others want direct broker support to help target lenders, review terms, and navigate the transaction from strategy through closing.
              </p>
              <p className="font-medium text-gray-800">
                That is why K2 Commercial Finance offers two clear paths.
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
                  A self-directed financing preparation system designed to help you get organized, present professionally, and approach lenders with confidence.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    'Professional templates and financial tools',
                    'Secure deal room',
                    'Submission tracking',
                    'Prep Coach AI',
                    'Lifetime access for a one-time $39 payment',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button size="lg" asChild className="w-full">
                    <Link href="/membership">
                      View the K2 Lender-Ready System
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
                  A higher-support option for serious borrowers who want K2 Commercial Finance actively involved in strategy, lender targeting, lender outreach, term review, negotiation support, and the path to closing.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    'Includes everything in the System',
                    'Direct support from K2 Commercial Finance',
                    'Lender and program targeting',
                    'Attempts to secure direct lender term sheets',
                    'Help reviewing terms and negotiating the transaction',
                    '$500 closing credit on successfully closed transactions',
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
                      View the K2 Certified Borrower Program
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
              Why This Matters
            </h2>
          </div>

          <div className="space-y-4 text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
            <p>
              Most banks and large institutions are not structured to guide smaller commercial borrowers through lender selection, loan program fit, packaging, underwriting, negotiation, and closing in a practical, borrower-friendly way.
            </p>
            <p className="font-medium text-gray-800">
              That is where good deals often lose momentum.
            </p>
            <p>
              When the file is clearer, the submission is stronger, and the process is better managed:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: TrendingUp, text: 'Lenders can review the deal faster' },
              { icon: UserCheck, text: 'Credibility goes up' },
              { icon: Target, text: 'Confusion goes down' },
              { icon: CheckCircle2, text: 'Preventable mistakes are easier to catch' },
              { icon: ArrowRight, text: 'The path to closing becomes easier to navigate' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pt-2">{item.text}</p>
              </div>
            ))}
          </div>
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
              Who We Help
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Building2, text: 'Small commercial real estate investors' },
              { icon: Briefcase, text: 'Business owners financing owner-occupied properties' },
              { icon: Users, text: 'First-time and early-stage commercial borrowers' },
              { icon: Target, text: 'Serious borrowers who want better preparation, stronger execution, and more confidence throughout the process' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-200 p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-gray-700 leading-relaxed pt-1">{item.text}</p>
              </div>
            ))}
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
                    That is why I built K2 Commercial Finance, the K2 Lender-Ready System, and the K2 Certified Borrower Program.
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
            Start with the Path That Fits You Best
          </h2>
          <div className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed space-y-4">
            <p>
              If you want a practical, low-cost system to help you prepare and manage the process yourself, start with the K2 Lender-Ready System.
            </p>
            <p>
              If you want K2 Commercial Finance directly involved in strategy, lender targeting, lender outreach, term review, negotiation support, and the transaction process, explore the K2 Certified Borrower Program.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300">
              <Link href="/membership">
                Explore the K2 Lender-Ready System
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" asChild className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300">
              <Link href="/membership/certified-borrower">
                Explore the K2 Certified Borrower Program
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
