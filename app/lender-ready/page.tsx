import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle2,
    ArrowRight,
    Shield,
    BarChart3,
    MessageCircle,
    Sparkles,
    Lock,
    FileText,
    FolderLock,
    ListChecks,
    RefreshCw,
    Target,
    Send,
    UserCheck,
    TrendingUp,
    ClipboardList,
    Quote,
    ChevronDown,
    Landmark,
    Scale,
    HelpCircle,
    Star,
    BookMarked,
    Mail,
    Calculator,
    BookOpen,
} from 'lucide-react';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function LenderReadyPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* ============================================================ */}
            {/*  HERO                                                         */}
            {/* ============================================================ */}
            <section className="max-w-3xl mx-auto px-6 py-24 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    K2 Lender-Ready System
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8">
                    Get organized, present professionally, and approach lenders with confidence.
                </p>
                <div className="text-left text-gray-700 text-lg leading-relaxed space-y-4 mb-12">
                    <p>
                        Most transactions do not lose financing momentum because the deal is bad. They lose
                        it because the submission is incomplete, disorganized, or sent before it is ready.
                    </p>
                    <p>
                        The K2 Lender-Ready System helps you fix that before you ever contact a lender.
                        It gives you the tools, structure, and guidance to prepare a cleaner, stronger, more
                        professional financing submission so you can approach lenders with greater confidence
                        and far less guesswork.
                    </p>
                </div>
                <CheckoutButton
                    product="kit"
                    label="Get Six Months of Access for $39"
                    size="lg"
                    className="text-lg px-10 py-6 shadow-lg shadow-primary/20"
                />
                <p className="mt-4 text-sm text-gray-500">
                    One-time payment. Six months full access. No subscription.
                </p>
            </section>

            {/* ============================================================ */}
            {/*  BEST FOR                                                     */}
            {/* ============================================================ */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-center text-sm font-semibold text-primary uppercase tracking-wide mb-4">
                        Best For
                    </h2>
                    <p className="text-center text-gray-700 text-lg leading-relaxed">
                        Organized, self-motivated borrowers who want to submit clean, professional loan packages lenders actually want to fund &mdash; targeting lenders on your own and avoiding broker involvement.
                    </p>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  MORE THAN A KIT                                              */}
            {/* ============================================================ */}
            <section id="whats-included" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">Far More Than a Kit</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
                            It&apos;s Your Personal{' '}
                            <span className="text-primary">Loan Packaging System</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            The K2 Lender-Ready System is a self-directed financing preparation system for small
                            commercial real estate investors and business owners who want a more
                            professional way to prepare for lender outreach.
                            Instead of piecing things together from scattered spreadsheets, old PDFs, and generic
                            advice, you get one clear system to help you organize the file, strengthen the
                            submission, and manage the process more effectively.
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
                            Lenders are busy. A weak package creates extra work, lowers confidence, and often
                            gets ignored. Even a solid deal can lose momentum if the file is incomplete,
                            inconsistent, or poorly presented.
                            When you present a clear, complete, lender-friendly package:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            { icon: UserCheck, title: 'More Credible', text: 'You look more credible from the very first interaction.' },
                            { icon: MessageCircle, title: 'Fewer Follow-Ups', text: 'You reduce avoidable follow-up questions that slow the process.' },
                            { icon: TrendingUp, title: 'Easier for Lenders', text: 'You make the lender\'s job easier — and stay closer to the top of their stack.' },
                            { icon: BarChart3, title: 'Preferred Terms', text: 'You give yourself a better shot at better terms and faster decisions.' },
                            { icon: Shield, title: 'Professional Submissions', text: 'Professional submissions get the job done.' },
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
                        You stop looking like someone casually shopping a deal and start looking like someone prepared to close.
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
                        {/* 1. Document Library */}
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

                        {/* 2. Prep Coach AI */}
                        <Card id="meet-prepcoach" className="border-2 border-primary/20 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-b from-primary/[0.02] to-white">
                            <CardHeader>
                                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary mb-4 w-fit">
                                    <Sparkles className="h-3 w-3" />
                                    Built-In AI Agent
                                </div>
                                <CardTitle className="text-xl">Meet Prep Coach</CardTitle>
                                <p className="text-sm text-gray-500">The First AI Agent Built Specifically for Small Commercial Real Estate Questions</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Prep Coach is not generic AI. It is designed specifically to help you think through small commercial real estate financing, deal preparation, and lender readiness.
                                </p>
                                <div className="space-y-2">
                                    {[
                                        'Answer small CRE questions faster',
                                        'Think through deal structure more clearly',
                                        'Use guided prompts to build stronger submissions',
                                        'Analyze projects with more confidence',
                                        'Tighten your package before a lender points out the weak spots',
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                                    In plain English, Prep Coach helps you work smarter. You are not staring at a blank screen trying to guess what lenders want. You are using targeted prompts and guidance built around the actual questions small CRE borrowers deal with.
                                </p>
                            </CardContent>
                        </Card>

                        {/* 3. Deal Room */}
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

                        {/* 4. Submission Tracking */}
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

                        {/* 5. Six Month Access */}
                        <Card className="border-2 border-primary/20 rounded-2xl hover:shadow-xl transition-all duration-300 overflow-hidden bg-primary/[0.02] md:col-span-2">
                            <CardHeader>
                                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4">
                                    <RefreshCw className="h-7 w-7 text-primary" />
                                </div>
                                <CardTitle className="text-xl">Six Month Access, Unlimited Personal Use</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Your one-time fee gives you six months of access to the system for as many deals as you want to do.
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

                    <p className="text-center text-lg text-gray-700 mt-12 max-w-3xl mx-auto leading-relaxed">
                        This isn’t about documentation overload. It’s about making it easy for the right lender to understand, evaluate, and pursue your financing opportunity.
                    </p>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  HOW IT WORKS                                                  */}
            {/* ============================================================ */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                            How It Works
                        </h2>
                    </div>

                    <div className="space-y-6 max-w-3xl mx-auto">
                        {[
                            {
                                num: '1',
                                title: 'Build your package',
                                text: 'Use the templates, calculators, and checklists to organize the deal properly.',
                            },
                            {
                                num: '2',
                                title: 'Strengthen the file',
                                text: 'Use Prep Coach AI to improve clarity, identify weak spots, and think through strategy before outreach. Identify loan program and targeted lender options.',
                            },
                            {
                                num: '3',
                                title: 'Organize everything',
                                text: 'Upload documents into your secure deal room and keep the process clean.',
                            },
                            {
                                num: '4',
                                title: 'Approach lenders with confidence',
                                text: 'Send a more professional submission and track what happens next.',
                            },
                        ].map((step) => (
                            <div key={step.num} className="flex items-start gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5 hover:shadow-md hover:border-primary/30 transition-all">
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
            {/*  WHO IT'S FOR / NOT FOR                                        */}
            {/* ============================================================ */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Good Fit */}
                        <div className="rounded-2xl border-2 border-green-200 overflow-hidden bg-white">
                            <div className="bg-green-50/50 p-6">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-green-900">Who It&apos;s For</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                {[
                                    'Borrowers buying or refinancing small commercial properties',
                                    'Business owners financing owner-occupied properties',
                                    'Borrowers who want to approach lenders more professionally',
                                    'Borrowers who want a repeatable system they can use for future deals',
                                    'Borrowers willing to organize their file and take the process seriously',
                                ].map((item) => (
                                    <div key={item} className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Not a Fit */}
                        <div className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-white">
                            <div className="bg-slate-50/50 p-6">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                                    <Lock className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Who It&apos;s Not For</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                {[
                                    'Anyone looking for guaranteed loan approval',
                                    'Anyone expecting someone else to fully manage the process from day one',
                                    'Anyone unwilling to organize documents',
                                    'Anyone only looking for a lender list',
                                    'Anyone not serious about improving how the deal is presented',
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
            {/*  SIMPLE, ONE-TIME PRICING                                     */}
            {/* ============================================================ */}
            <section className="py-16 bg-primary">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Simple, One-Time Pricing
                        </h2>
                        <p className="text-xl font-semibold text-gray-900 mt-6 mb-1">
                            K2 Lender-Ready System
                        </p>
                        <p className="text-lg text-gray-700 mb-1">
                            One-time <span className="font-bold text-primary">$39</span> payment
                        </p>
                        <p className="text-base text-gray-600 mb-1">
                            Six months full access
                        </p>
                        <p className="text-base text-gray-600 mb-1">
                            No subscription
                        </p>
                        <p className="text-base text-gray-600 mb-8">
                            No recurring monthly fee
                        </p>

                        <CheckoutButton
                            product="kit"
                            label="Get the K2 Lender-Ready System for $39"
                            size="lg"
                            className="text-lg px-8 py-6 shadow-lg shadow-primary/20"
                        />
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/*  14-DAY GUARANTEE                                              */}
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
                        14-Day Ready or Refund Guarantee
                    </h2>
                    <p className="text-lg text-gray-600 mb-2 leading-relaxed">
                        Try the K2 Lender-Ready System risk-free.
                    </p>
                    <p className="text-lg text-gray-600 mb-2 leading-relaxed">
                        If you do not feel significantly more organized and confident within 14 days, request a full refund.
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mb-8">
                        No stress. No explanation required.
                    </p>

                    <CheckoutButton
                        product="kit"
                        label="Try It Risk-Free for $39"
                        size="lg"
                        className="text-lg px-8 py-6 shadow-lg shadow-primary/20"
                    />
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
                                    <p>
                                        That is why I built K2 Commercial Finance, the K2 Lender-Ready System, and the K2 Certified Borrower Program.
                                    </p>
                                    <p>
                                        My goal is simple: to give serious borrowers better tools, better guidance, and a more professional path through the financing process.
                                    </p>
                                    <p>
                                        Whether you use the System on your own or decide you want our direct help, I want you to feel more prepared, more confident, and better positioned from the start.
                                    </p>
                                    <p className="font-semibold text-gray-900 mt-2">
                                        Ken Kaplan
                                    </p>
                                    <p className="text-sm text-gray-500 -mt-2">
                                        Founder, K2 Commercial Finance
                                    </p>
                                </div>
                            </CollapsibleContent>
                        </div>
                    </Collapsible>
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
            {/*  WANT MORE THAN TOOLS?                                       */}
            {/* ============================================================ */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-primary/20 bg-white shadow-sm p-8 md:p-12">
                        <div className="max-w-3xl">
                            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                                Want More Than Tools?
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                                The K2 Certified Borrower Program Adds Direct Expert Help
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    The K2 Lender-Ready System is the self-directed option.
                                </p>
                                <p>
                                    If you want K2 Commercial Finance actively involved in the financing process, the K2 Certified Borrower Program includes everything in the System plus expert help with:
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {[
                                'financing strategy',
                                'loan program targeting',
                                'lender targeting',
                                'lender outreach',
                                'attempts to secure direct lender term sheets',
                                'assistance with calls with lenders',
                                'review of lender documents and lender terms',
                                'help negotiating the best possible transaction',
                                'support through underwriting and closing',
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <Link
                                href="/membership/certified-borrower"
                                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                            >
                                Learn About the K2 Certified Borrower Program
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">FAQ</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="space-y-3">
                        <AccordionItem value="faq-1" className="border border-slate-200 rounded-xl overflow-hidden px-0">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 text-left">
                                What is the K2 Lender-Ready System?
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                                It is a self-directed financing preparation system that helps serious borrowers organize documents, strengthen submissions, and approach lenders more professionally.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-2" className="border border-slate-200 rounded-xl overflow-hidden px-0">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 text-left">
                                Who is it for?
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                                It is built for small commercial real estate investors, business owners financing owner-occupied properties, and early-stage borrowers who want to prepare more effectively before contacting lenders.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-3" className="border border-slate-200 rounded-xl overflow-hidden px-0">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 text-left">
                                Is this a broker service?
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                                No. The K2 Lender-Ready System is the self-directed option. If you want K2 Commercial Finance actively involved in the process, that is what the K2 Certified Borrower Program is for.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-4" className="border border-slate-200 rounded-xl overflow-hidden px-0">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 text-left">
                                How long do I get access?
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                                Your purchase includes six months of full access from the date of purchase, with unlimited deals during that access window.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-5" className="border border-slate-200 rounded-xl overflow-hidden px-0">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 text-left">
                                Does this guarantee loan approval?
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                                No. No ethical lender, broker, or advisor can guarantee approval. What this System does is help you prepare better, present more professionally, and reduce avoidable mistakes.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-6" className="border border-slate-200 rounded-xl overflow-hidden px-0">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 text-left">
                                Can I use this for owner-occupied properties?
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-5 text-sm text-gray-600 leading-relaxed">
                                Yes. The System is designed to support both small commercial investment properties and owner-occupied business property financing.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>


            {/* ============================================================ */}
            {/*  FINAL CTA                                                    */}
            {/* ============================================================ */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border-2 border-primary/20 bg-white p-8 md:p-10 shadow-sm">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                            Final CTA
                        </h2>

                        <div className="space-y-4 text-gray-700 leading-relaxed text-center">
                            <p>
                                Good deals get overlooked every day because the borrower was not ready.
                            </p>
                            <p className="font-semibold">
                                Get organized.
                            </p>
                            <p className="font-semibold">
                                Present professionally.
                            </p>
                            <p className="font-semibold text-gray-900">
                                Approach lenders with confidence.
                            </p>
                        </div>

                        <div className="mt-8 text-center">
                            <CheckoutButton
                                product="kit"
                                label="Get Six Months of Access to the K2 Lender-Ready System for $39"
                                size="lg"
                                className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
