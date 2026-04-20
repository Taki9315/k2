import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { BarChart3, BookMarked, BookOpen, Calculator, CheckCircle2, ClipboardList, HelpCircle, Landmark, ListChecks, Mail, Scale, Star, TrendingUp, UserCheck } from "lucide-react";

export default function LenderReadyPage() {
    return (
        <main className="container mx-auto px-4 py-16">
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
            {/*  ACCESS DETAILS                                               */}
            {/* ============================================================ */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                            Access Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                'One-time purchase',
                                'No subscription',
                                'Permanent online access',
                                'Use on unlimited personal deals',
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}