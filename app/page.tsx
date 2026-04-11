import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  BookOpen,
  TrendingUp,
  Shield,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  BarChart3,
  Award,
  MessageCircle,
  Sparkles,
  Users,
  Quote,
  Bot,
  Building2,
  Lock,
  FileText,
  FolderLock,
  ListChecks,
  RefreshCw,
  ChevronDown,
  HelpCircle,
  Target,
  Send,
  ClipboardList,
  Calculator,
  UserCheck,
  Mail,
  BookMarked,
  Scale,
  Landmark,
} from 'lucide-react';
import { CheckoutButton } from '@/components/CheckoutButton';
import { GuaranteePopover } from '@/components/GuaranteePopover';
import { HomeRedirect } from '@/components/HomeRedirect';

const TESTIMONIALS = [
  {
    quote:
      'The Kit helped me organize everything before I even talked to a lender. I got approved on the first try with better terms than I expected.',
    author: 'Michael R.',
    role: 'First-Time CRE Borrower',
    stars: 5,
  },
  {
    quote:
      'I wasted months applying to the wrong lenders. K2 showed me how to identify the right ones and present my deal the way they want to see it.',
    author: 'Sarah L.',
    role: 'Small Business Owner',
    stars: 5,
  },
  {
    quote:
      'Having everything in one organized system saved me from costly mistakes. The Deal Room and Prep Coach alone made it worth every penny.',
    author: 'David K.',
    role: 'Multi-Property Investor',
    stars: 5,
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is this just a PDF download?',
    a: 'No. You do get downloadable materials, but this is more than a static PDF. It includes the online Document Library, your secure Deal Room, lender tracking support, calculators, templates, scripts, and bonus guides.',
  },
  {
    q: 'How long do I keep access?',
    a: 'Your one-time purchase gives you permanent online access for as many personal deals as you want to do.',
  },
  {
    q: 'Can I send documents securely to lenders?',
    a: 'Yes. Your Deal Room is password-protected, and you can send password-protected links to potential lenders instead of relying only on scattered attachments.',
  },
  {
    q: 'Does this include lender contacts?',
    a: 'Not inside the $39 kit itself. The kit is designed to help you prepare and present your deal professionally on your own. If you want lender targeting and warm introductions, that is where K2 Certified Borrower comes in.',
  },
  {
    q: 'What is Prep Coach?',
    a: 'Prep Coach is the first AI agent designed specifically to answer your small commercial real estate questions and help you think through deal preparation, structure, and submission quality.',
  },
  {
    q: 'Will this guarantee I get approved?',
    a: 'No. No honest product should promise that. What this program does is help you present a better file, target the process more intelligently, and reduce avoidable mistakes that slow deals down.',
  },
  {
    q: 'Is this a subscription?',
    a: 'No. It is a one-time purchase.',
  },
  {
    q: 'Can I use this on more than one deal?',
    a: 'Yes — for your own personal deals.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomeRedirect />

      {/* ============================================================ */}
      {/*  HERO                                                         */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Zap className="h-4 w-4" />
                Trusted by 500+ borrowers nationwide
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                The Lender-Ready{' '}
                <span className="text-primary">Small CRE Loan Package Kit</span>
              </h1>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Build a clean, lender-ready loan package in 1&ndash;2 hours, organize every deal in your own secure Deal Room, and approach lenders with the kind of file they actually want to review.
              </p>

              <p className="text-2xl font-bold text-gray-900 mb-1">
                One-time price: <span className="text-primary">$39</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                No subscription. No recurring fee. Permanent access for as many deals as you want to do.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <CheckoutButton
                  product="kit"
                  label="Get the Kit for $39"
                  size="lg"
                  className="text-lg px-8 py-6 shadow-lg shadow-primary/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  One-time purchase
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  No subscription
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Permanent access
                </span>
                <GuaranteePopover>
                  <span className="flex items-center gap-1 cursor-help">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    14-Day Guarantee
                  </span>
                </GuaranteePopover>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <Image
                src="/book_cover.png"
                alt="K2 Lender-Ready Small CRE Loan Package Kit"
                width={480}
                height={620}
                className="rounded-xl shadow-2xl object-contain max-h-[520px] w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PROBLEM STATEMENT                                            */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
            You do not need a bigger deal.{' '}
            <span className="text-primary">You need a better submission system.</span>
          </h2>
          <div className="text-lg text-gray-600 leading-relaxed space-y-4 text-left">
            <p>
              Most small commercial real estate borrowers do not lose momentum because the deal is automatically bad. They lose momentum because the package is incomplete, disorganized, inconsistent, or sent out before it is truly ready.
            </p>
            <p>
              Lenders are busy. If your file creates work, it gets delayed. If your numbers do not line up, confidence drops. If you send a messy pile of documents, you make the lender guess &mdash; and that is when deals stall, conditions pile up, or the file quietly dies.
            </p>
            <p className="font-medium text-gray-800">
              A clean package changes that. A clean system changes even more.
            </p>
            <p>
              This program helps you look prepared, credible, and easier to work with from the first touch.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MORE THAN A KIT                                              */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">This Is More Than a Kit</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
              It&apos;s Your Personal{' '}
              <span className="text-primary">Loan Packaging System</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The Lender-Ready Small CRE Loan Package Kit gives you the templates, tools, online structure, and workflow to build and manage lender-ready submissions the right way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: FileText, text: 'The Document Library with the forms and templates you need to build your package' },
              { icon: FolderLock, text: 'A password-protected Deal Room for each deal' },
              { icon: Send, text: 'A system for sending secure links to potential lenders' },
              { icon: ListChecks, text: 'A way to track lender interest, responses, and deal stages' },
              { icon: Target, text: 'Guidance for choosing the right loan program and approaching lenders correctly' },
              { icon: RefreshCw, text: 'Access that stays with you permanently for as many deals as you want to do' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center mt-8 max-w-3xl mx-auto italic">
            This is not legal or tax advice. It is a professional preparation system built to help you submit a better file, reduce back-and-forth, and improve the speed and quality of lender responses.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY PREPARATION WINS                                         */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Why Preparation Wins</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
              The Best-Prepared Borrowers Get the Best Results
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The borrowers who get the best results are not always the biggest. They are usually the best prepared. When you present a clear, complete, lender-friendly package:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: UserCheck, title: 'More Credible', text: 'You look more credible from the very first interaction.' },
              { icon: MessageCircle, title: 'Fewer Follow-Ups', text: 'You reduce avoidable follow-up questions that slow the process.' },
              { icon: TrendingUp, title: 'Easier for Lenders', text: 'You make the lender\'s job easier — and stay closer to the top of the stack.' },
              { icon: BarChart3, title: 'Cleaner Terms', text: 'You give yourself a better shot at cleaner terms and faster decisions.' },
              { icon: Shield, title: 'Stay in Control', text: 'You maintain control over timing, narrative, and deal presentation.' },
            ].map((card) => (
              <Card key={card.title} className="group border border-slate-200 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <card.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-sm">{card.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-lg font-medium text-gray-800 mt-12">
            That is what this program is designed to help you do.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  A NOTE FROM KEN KAPLAN (EXPANDABLE)                          */}
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
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">A Note from Ken Kaplan</h3>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 md:px-8 pb-8 space-y-4 text-gray-600 leading-relaxed border-t border-slate-100 pt-6">
                  <p>
                    I&apos;ve spent more than 25 years in commercial mortgage lending, working through thousands of loan requests and closing over $100 million in transactions.
                  </p>
                  <p>
                    And over all that time, one thing has stayed the same: small commercial borrowers need the most help and usually get the least of it.
                  </p>
                  <p>
                    Large institutions are not built around small commercial deals. Most banks do not have a simple, borrower-friendly process for guiding smaller investors and business owners through lender selection, loan packaging, underwriting, and closing. That leaves too many people guessing at exactly the stage where mistakes are the most expensive.
                  </p>
                  <p>
                    I&apos;ve seen strong deals lose momentum, get mispriced, or die completely because the borrower was not properly prepared. Not because the opportunity was bad. Not because financing was impossible. Because the file was incomplete, the wrong program was targeted, or the lender never got a clear picture of the deal.
                  </p>
                  <p className="font-medium text-gray-800">
                    That is exactly why I built this system.
                  </p>
                  <p>
                    Everything in this kit comes from real-world lending experience. It is based on what actually helps small commercial borrowers move faster, present better, and avoid the mistakes that quietly cost time, leverage, negotiating power, and real money.
                  </p>
                  <p>
                    Used the right way, this system can save you far more than it costs. In some cases, it can be the difference between a smooth financing process and a painful, expensive one.
                  </p>
                  <p>
                    If you want to go through the process on your own, this kit is not a nice extra. It is the preparation system you want in place before you start.
                  </p>
                  <p>
                    And if you decide you want my team to take a more active role in lender targeting, packaging strategy, and introductions, that is exactly what{' '}
                    <Link href="/membership/certified-borrower" className="text-primary font-semibold hover:underline">
                      K2 Certified Borrower
                    </Link>{' '}
                    is for.
                  </p>

                  <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-5">
                    <p className="text-sm font-semibold text-primary mb-2">K2 Callout</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Small commercial financing is where preparation matters most. The borrowers who show up organized, clear, and lender-ready consistently give themselves a better shot at better outcomes.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHAT MAKES THIS DIFFERENT                                    */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">A Cleaner Process</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
              What Makes This Different
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Most borrowers piece this together from random templates, old lender emails, half-complete spreadsheets, and advice that does not actually fit their deal. This program gives you a cleaner process.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              'Build the full package first',
              'Use the Document Library to pull the right forms',
              'Upload everything into your secure Deal Room',
              'Identify the right loan program',
              'Target the right lenders',
              'Make a strong first approach without overloading them',
              'Send the full package immediately when requested',
              'Track lender responses, interest, and transaction progress',
            ].map((step, i) => (
              <div key={step} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-lg font-medium text-gray-800 mt-10">
            That is how you stop looking like someone shopping a deal and start looking like someone ready to close one.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHAT YOU GET FOR $39                                          */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="absolute -top-40 left-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">What You Get for $39</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
              Everything You Need to Build, Organize &amp; Submit
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Document Library */}
            <Card className="border-2 border-slate-200 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Document Library</CardTitle>
                <p className="text-sm text-gray-500">Everything you need to build the file</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  The Document Library contains the forms, templates, guidance, calculators, and support materials you need to assemble a proper loan package.
                </p>
                <div className="space-y-2">
                  {[
                    'Transaction overview',
                    'Trailing financials',
                    'NOI and DSCR',
                    'Sources and uses',
                    'Borrower financials',
                    'Submission checklists',
                    'Lender outreach messaging',
                    'Underwriting prep',
                    'Term sheet review',
                    'Owner-user and SBA-related situations',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deal Room */}
            <Card className="border-2 border-slate-200 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                  <FolderLock className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Deal Room</CardTitle>
                <p className="text-sm text-gray-500">A secure workspace for every deal</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Each deal gets its own password-protected Deal Room. Lenders want easy access to well-organized files &mdash; not a messy chain of random attachments.
                </p>
                <div className="space-y-2">
                  {[
                    'Upload and organize all deal documents in one place',
                    'Keep files separated by transaction',
                    'Send password-protected links to potential lenders',
                    'Avoid scattered email attachments and broken document trails',
                    'Maintain a cleaner, more professional submission process',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submission Tracking */}
            <Card className="border-2 border-slate-200 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                  <ListChecks className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Submission Tracking</CardTitle>
                <p className="text-sm text-gray-500">Never lose track of who has what</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    'Which lenders received your paperwork',
                    'Which lenders expressed interest',
                    'Which lenders passed',
                    'What stage each deal is in',
                    'Where the next follow-up belongs',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 italic">
                  That alone saves time and helps prevent deals from stalling simply because you lost track of who has what.
                </p>
              </CardContent>
            </Card>

            {/* Permanent Access */}
            <Card className="border-2 border-primary/20 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden bg-primary/[0.02]">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                  <RefreshCw className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Permanent Access, Unlimited Personal Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Your one-time fee gives you permanent online access to the system for as many deals as you want to do.
                </p>
                <div className="space-y-2">
                  {[
                    'No subscription',
                    'No monthly fee',
                    'No repurchase for each deal',
                    'No starting over every time you have a new transaction',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-800 mt-4">
                  You build your system once, then keep using it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHAT'S INSIDE (ACCORDION)                                    */}
      {/* ============================================================ */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">What&apos;s Inside</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
              A Complete Walkthrough
            </h2>
          </div>

          <Accordion type="multiple" className="space-y-3">
            <AccordionItem value="quickstart" className="border border-slate-200 rounded-xl overflow-hidden px-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-left font-semibold">Start Here / Quick Start Guide</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <p className="text-gray-600 text-sm mb-3">A practical walkthrough that shows you:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {[
                    'How to use the system',
                    'How to prepare the full package before outreach',
                    'How to identify the right loan program first',
                    'How to target at least 3 likely lenders',
                    'How to approach lenders without sending a giant attachment dump too early',
                    'How to follow up every 72 hours without sounding desperate',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="overview" className="border border-slate-200 rounded-xl overflow-hidden px-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-left font-semibold">Transaction Overview Template</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <p className="text-gray-600 text-sm mb-3">A borrower-facing summary that helps you present:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {['The property', 'The request', 'The business plan', 'Strengths and risks', 'Sources and uses', 'Your borrower profile', 'The likely loan program and lender category'].map((t) => (
                    <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="t12" className="border border-slate-200 rounded-xl overflow-hidden px-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-left font-semibold">T-12 / Trailing Financials Organizer</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <p className="text-gray-600 text-sm mb-3">A polished underwriter-style spreadsheet and guide that helps you show:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {['12 months of actual operating performance', 'Monthly income and expenses', 'Trailing totals', 'NOI', 'Normalization notes for one-time items'].map((t) => (
                    <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="noi" className="border border-slate-200 rounded-xl overflow-hidden px-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-left font-semibold">NOI + DSCR Calculator</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <p className="text-gray-600 text-sm mb-3">A lender-style underwriting preview with:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {['Clean income and expense inputs', 'Debt service and DSCR calculations', 'Stabilized vs. transitional guidance', '3-case sensitivity testing'].map((t) => (
                    <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sources" className="border border-slate-200 rounded-xl overflow-hidden px-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-left font-semibold">Sources &amp; Uses + Cash-to-Close Planner</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <p className="text-gray-600 text-sm mb-3">A clean way to show:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {['Where the money is going', 'Where the money is coming from', 'How much cash is really required at closing', 'Whether the deal actually balances'].map((t) => (
                    <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="borrower" className="border border-slate-200 rounded-xl overflow-hidden px-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-left font-semibold">Borrower Financial Snapshot Tools</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <p className="text-gray-600 text-sm mb-3">Guidance and supporting tools to help you present:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {['Your personal financial picture', 'Global cash flow', 'Liquidity and reserves', 'Real estate owned support where needed'].map((t) => (
                    <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="checklist" className="border border-slate-200 rounded-xl overflow-hidden px-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <ListChecks className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-left font-semibold">Document Request Checklist + Submission Order</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <p className="text-gray-600 text-sm mb-3">The no-missing-pieces system that helps you prepare the file in the order lenders can review most easily, with:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {['File naming standards', 'PDF packaging guidance', 'Deal Room organization', 'Outreach workflow', 'Red-flag prevention'].map((t) => (
                    <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="scripts" className="border border-slate-200 rounded-xl overflow-hidden px-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-left font-semibold">Email / Message Scripts</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <p className="text-gray-600 text-sm mb-3">Copy-and-paste scripts for:</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  {['Initial lender contact', '72-hour follow-up', 'Full package delivery', 'Condition response notes', 'Polite pass replies'].map((t) => (
                    <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="casestudy" className="border border-slate-200 rounded-xl overflow-hidden px-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <BookMarked className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-left font-semibold">Completed Mini Case Study</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5">
                <p className="text-gray-600 text-sm">
                  A sanitized example of a strong lender-ready package, with K2 Callouts showing what works and why.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Bonus Material */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 border border-yellow-300 px-4 py-1.5 text-sm font-semibold text-yellow-800">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                Bonus Material Included
              </div>
            </div>

            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="bonus1" className="border border-yellow-200 bg-yellow-50/50 rounded-xl overflow-hidden px-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-yellow-700 flex-shrink-0" />
                    <span className="text-left font-semibold">Bonus 1: Underwriter Q&amp;A Bank</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5">
                  <p className="text-gray-600 text-sm">
                    A practical guide to common lender and underwriter questions, organized by stage of underwriting so you can stay prepared after the term sheet arrives.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bonus2" className="border border-yellow-200 bg-yellow-50/50 rounded-xl overflow-hidden px-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <Scale className="h-5 w-5 text-yellow-700 flex-shrink-0" />
                    <span className="text-left font-semibold">Bonus 2: Negotiating Term Sheets</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5">
                  <p className="text-gray-600 text-sm mb-3">
                    A broker-style markup guide that helps you read term sheets the way an experienced advisor would, including:
                  </p>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    {['Prepayment penalties', 'Personal guarantees', 'Timelines', 'Fees', 'Reserves', 'Extension terms', 'Lender discretion'].map((t) => (
                      <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bonus3" className="border border-yellow-200 bg-yellow-50/50 rounded-xl overflow-hidden px-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-5 w-5 text-yellow-700 flex-shrink-0" />
                    <span className="text-left font-semibold">Bonus 3: Owner-Operated Properties, SBA Financing &amp; Business-Purpose Lending</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5">
                  <p className="text-gray-600 text-sm mb-3">
                    A plain-English supplement for deals that go beyond pure investment real estate, including:
                  </p>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    {['SBA 7(a)', 'SBA 504', 'USDA Business & Industry', 'Equipment financing', 'Receivables factoring', 'Purchase order finance'].map((t) => (
                      <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />{t}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MEET PREP COACH                                              */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Built-In AI Agent
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet <span className="text-primary">Prep Coach</span>
          </h2>
          <p className="text-xl text-gray-700 mb-3 leading-relaxed max-w-2xl mx-auto font-medium">
            The First AI Agent Built Specifically for Small Commercial Real Estate Questions
          </p>
          <p className="text-lg text-gray-600 mb-4 leading-relaxed max-w-2xl mx-auto">
            Prep Coach is not generic AI. It is designed specifically to help you think through small commercial real estate financing, deal preparation, and lender readiness.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 mt-8">
            {[
              { icon: Zap, text: 'Answer small CRE questions faster' },
              { icon: Target, text: 'Think through deal structure more clearly' },
              { icon: ClipboardList, text: 'Use guided prompts to build stronger submissions' },
              { icon: BarChart3, text: 'Analyze projects with more confidence' },
              { icon: Shield, text: 'Tighten your package before a lender points out the weak spots' },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-2 rounded-xl bg-white/80 border border-slate-200 p-4 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-gray-700 text-center leading-snug">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            In plain English, Prep Coach helps you work smarter. You are not staring at a blank screen trying to guess what lenders want. You are using targeted prompts and guidance built around the actual questions small CRE borrowers deal with.
          </p>

          <Button size="lg" asChild className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
            <Link href="/prepcoach">
              Explore PrepCoach
              <Bot className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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
            <Card className="border-2 border-green-200 rounded-2xl overflow-hidden">
              <CardHeader className="bg-green-50/50">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-900">Who This Is For</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {[
                    'You are pursuing one of your first few small CRE deals',
                    'You already have a property identified or under LOI',
                    'You want to present a more professional file without hiring a broker first',
                    'You are organized enough to do the work, but want a better system',
                    'You want to approach lenders with more confidence and less guesswork',
                    'You are tired of piecing together random templates that do not match each other',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Not a Fit */}
            <Card className="border-2 border-slate-200 rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <CardTitle className="text-xl text-gray-900">This Is Probably Not For You If</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {[
                    'You want guaranteed approval',
                    'You want someone else to place the deal for you from day one',
                    'You are not ready to gather documents or organize the file',
                    'You want a generic course with theory but no practical tools',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-slate-300 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-800 mt-6 pt-4 border-t border-slate-100">
                  This is for people who want a real working system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY $39 IS AN EASY YES                                       */}
      {/* ============================================================ */}
      <section className="py-16 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why $39 Is an Easy Yes
            </h2>
            <p className="text-lg text-gray-700 mb-2">You are not paying for theory.</p>
            <p className="text-lg text-gray-700 font-medium mb-6">
              You are paying to avoid expensive confusion.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              One missing document, one bad first impression, one poorly framed request, or one week of wasted lender outreach costs more than this program.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto mb-8">
              {[
                'The tools to build the package',
                'The online Document Library',
                'Your secure Deal Room',
                'Tracking and organization support',
                'Permanent access for unlimited personal deals',
                'Guidance you can keep using',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <CheckoutButton
              product="kit"
              label="Get the Lender-Ready Small CRE Loan Package Kit for $39"
              size="lg"
              className="text-lg px-8 py-6 shadow-lg shadow-primary/20"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                  */}
      {/* ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Real Results</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
              What Other Borrowers Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="group border border-slate-200 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <CardContent className="p-8">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <div className="flex mb-4">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {t.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.author}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CERTIFIED BORROWER UPSELL                                    */}
      {/* ============================================================ */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Award className="h-4 w-4" />
            Want More Than DIY?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            K2 Certified Borrower
          </h2>
          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            If you want expert lender targeting, warm introductions, and active marketing support, that is exactly what K2 Certified Borrower is for.
          </p>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Certified Borrowers get access to K2 Commercial Finance&apos;s Preferred Lender database, and we handle the lender targeting, marketing, and communication process for you.
          </p>
          <Button size="lg" variant="outline" asChild className="border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
            <Link href="/membership/certified-borrower">
              Learn About K2 Certified Borrower
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  14-DAY GUARANTEE                                             */}
      {/* ============================================================ */}
      <section className="py-16 bg-slate-50 relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            14-Day Guarantee
          </h2>
          <p className="text-lg text-gray-600 mb-2 leading-relaxed">
            Try the program for 14 days.
          </p>
          <p className="text-lg text-gray-600 mb-2 leading-relaxed">
            If you do not feel more confident, more organized, and better prepared to approach lenders after using it, request a refund within 14 days and you will get your money back.
          </p>
          <p className="text-lg font-semibold text-gray-900">
            No questions asked.
          </p>
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
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Common Questions</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
              FAQ
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-slate-200 rounded-xl overflow-hidden px-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 text-left font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  NOT READY YET                                                */}
      {/* ============================================================ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Not Ready Yet?</h3>
          <p className="text-gray-600 mb-2 leading-relaxed">
            If you are still learning, start with the{' '}
            <Link href="/content" className="text-primary font-semibold hover:underline">
              free educational content
            </Link>{' '}
            on the K2 Commercial Finance website.
          </p>
          <p className="text-gray-600 mb-2 leading-relaxed">
            If you want to do it yourself, this program is the right next step.
          </p>
          <p className="text-gray-600 leading-relaxed">
            If you later decide you want expert placement, lender targeting, and done-with-you support, then becoming a{' '}
            <Link href="/membership/certified-borrower" className="text-primary font-semibold hover:underline">
              K2 Certified Borrower
            </Link>{' '}
            may be the better move.
          </p>
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-8">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Stop Piecing This Together the Hard Way
          </h2>
          <div className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed space-y-2">
            <p>Build the file first.</p>
            <p>Organize it properly.</p>
            <p>Store it securely.</p>
            <p>Make the lender&apos;s job easier.</p>
            <p className="font-medium text-white">Give yourself a better shot at the right answer, faster.</p>
          </div>
          <CheckoutButton
            product="kit"
            label="Get the Lender-Ready Small CRE Loan Package Kit — $39"
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/*  LENDER / VENDOR INQUIRY                                      */}
      {/* ============================================================ */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            If you&apos;re interested in joining our network as a preferred lender, or if you&apos;re a commercial real estate service provider,{' '}
            <Link href="/partnership" className="text-primary font-semibold hover:underline">
              click here for more information
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
