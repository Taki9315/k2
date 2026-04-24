import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, FolderOpen, Lock, Sparkles, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckoutButton } from '@/components/CheckoutButton';

const includedItems = [
    {
        title: 'K2 Lender Ready Workbook',
        tagline: 'Your step-by-step guide to preparing a stronger loan request.',
        body: 'This practical workbook walks you through the loan preparation process so you understand what lenders look for, what documents you need, and how to present your request more clearly and confidently.',
        ctaLabel: 'Preview the Workbook Table of Contents',
        href: '#table-of-contents',
        icon: BookOpen,
    },
    {
        title: 'K2 Online Document Library',
        tagline: 'All your forms, templates, and key documents in one place.',
        body: 'Access an organized library of forms, templates, and application documentation designed to save time and reduce confusion. No more digging through scattered files to figure out what is missing.',
        ctaLabel: 'Access the Document Library',
        href: '/dashboard/documents',
        icon: ClipboardList,
    },
    {
        title: 'K2 PrepCoach',
        tagline: '24/7 AI support for small commercial property financing questions.',
        body: 'Get instant guidance whenever you need clarity, direction, or help understanding the next step. K2 PrepCoach is available around the clock to support you as you prepare your request.',
        ctaLabel: 'Ask PrepCoach',
        href: '/prepcoach/prompts',
        icon: Sparkles,
    },
    {
        title: 'K2 Deal Room',
        tagline: 'A secure space to organize and share transaction documents.',
        body: 'Store your files in one password-protected, lender-friendly location so your deal materials stay organized, professional, and ready for review when it is time to share them.',
        ctaLabel: 'Explore the Deal Room',
        href: '/dashboard/deal-room',
        icon: Lock,
    },
    {
        title: 'K2 Submission Tracker',
        tagline: 'Track lenders, submissions, follow-ups, and deal status with ease.',
        body: 'Stay on top of every step of the process with a simple system for monitoring target lenders, submission activity, next actions, and transaction progress from outreach to decision.',
        ctaLabel: 'View the Submission Tracker',
        href: '/dashboard/lender-outreach',
        icon: ListChecks,
    },
];

const valuePoints = [
    'Step-by-step guidance so you know what to do next',
    'Practical tools to help you stay organized',
    'Smart technology to make the process easier',
    'A more professional way to prepare and present your request',
];

const tableOfContentsSections = [
    {
        number: '1',
        title: 'Start Here',
        items: [
            '1.1 Welcome to the K2 Lender-Ready System',
            '1.2 What Is Included in the System',
            '1.3 How to Use This Workbook',
            '1.4 Why This Process Works',
            '1.5 What Lenders Are Actually Looking For',
            '1.6 Before You Begin',
            '1.7 Recommended Workflow',
            '1.8 What a Complete Submission Usually Includes',
            '1.9 Submission Best Practices',
            '1.10 Common Mistakes to Avoid',
            '1.11 Final Note',
        ],
    },
    {
        number: '2',
        title: 'Commercial Loan Application',
        items: [
            '2.1 Why This Application Matters',
            '2.2 Your Goal in This Section',
            '2.3 Before You Start',
            '2.4 How to Complete the Application',
            '2.5 General Completion Rules',
            '2.6 Before You Upload to the Deal Room',
            '2.7 Final Note',
        ],
    },
    {
        number: '3',
        title: 'Loan Programs',
        items: [
            '3.1 Why This Section Matters',
            '3.2 What Drives Loan Program Fit',
            '3.3 Property Type Changes the Loan Options',
            '3.4 Borrower Factors Matter Too',
            '3.5 Common Loan Programs',
            '3.6 When Short-Term Financing May Be the Better First Step',
            '3.7 Quick Examples of Likely Program Fit',
            '3.8 What to Watch Out For',
            '3.9 Use Prep Coach',
            '3.10 Before You Move Forward',
            '3.11 Final Note',
        ],
    },
    {
        number: '4',
        title: 'Required Documentation and Supporting Forms',
        items: [
            '4.1 Why This Section Matters',
            '4.2 Start with the Application, Then Build Out the File',
            '4.3 Documentation Should Match the Loan Program',
            '4.4 The Four Main Document Categories',
            '4.5 Borrower Documents',
            '4.6 Property Documents',
            '4.7 Transaction Documents',
            '4.8 Explanatory and Supplemental Documents',
            '4.9 What Is Commonly Needed for Most Deals',
            '4.10 How Requirements Change by Transaction Type',
            '4.11 How to Use the Document Library',
            '4.12 Consistency Rules',
            '4.13 How to Organize Documents in the Deal Room',
            '4.14 Before You Move Forward',
            '4.15 Final Note',
        ],
    },
    {
        number: '5',
        title: 'Building and Organizing the Deal Room',
        items: [
            '5.1 Why the Deal Room Matters',
            '5.2 What the Deal Room Is For',
            '5.3 When to Build the Deal Room',
            '5.4 Create One Deal Room per Transaction',
            '5.5 How to Name the Deal Room',
            '5.6 What to Upload First',
            '5.7 How to Organize the Files',
            '5.8 What Good Organization Does for You',
            '5.9 What Not to Do',
            '5.10 Share the Deal Room the Right Way',
            '5.11 Keep the Deal Room Updated',
            '5.12 Use the Deal Room to Track Lender Activity',
            '5.13 Before You Share the Deal Room',
            '5.14 Final Note',
        ],
    },
    {
        number: '6',
        title: 'Deal Room Cover Page Template',
        items: [
            '6.1 Purpose of the Cover Page',
            '6.2 Deal Room Snapshot Template',
            '6.3 Documents Included in This Deal Room',
            '6.4 Suggested File Name',
            '6.5 Final Checklist',
        ],
    },
    {
        number: '7',
        title: 'Initial Lender Outreach',
        items: [
            '7.1 Why This Section Matters',
            '7.2 Start with the Right Lender Targets',
            '7.3 Why Your Preparation Gives You an Advantage',
            '7.4 Use the Email Templates - But Customize Them',
            '7.5 How Many Lenders to Target',
            '7.6 Stay Positive and Professional',
            '7.7 The Typical Outreach Sequence',
            '7.8 What the First Email Should Do',
            '7.9 When to Send the Deal Room',
            '7.10 Use Early Feedback to Improve the File',
            '7.11 Track Everything',
            '7.12 Before You Begin Outreach',
            '7.13 Final Note',
        ],
    },
    {
        number: '8',
        title: 'Follow-Up Email Templates',
        items: [
            '8.1 Step 3 - First Follow-Up Email',
            '8.2 Step 3 - Short Version',
            '8.3 Step 4 - Final Follow-Up Email',
            '8.4 Step 4 - Short Version',
            '8.5 Follow-Up Style Rules',
            '8.6 When to Stop Following Up',
            '8.7 Final Checklist',
        ],
    },
    {
        number: '9',
        title: 'Managing Lender Responses and Next Steps',
        items: [
            '9.1 Why This Section Matters',
            '9.2 What a Lender Response Usually Means',
            '9.3 Keep the Real Goal in Mind',
            '9.4 Respond Quickly - But Not Carelessly',
            '9.5 The First Response After Interest Is Shown',
            '9.6 Use Letters of Explanation the Right Way',
            '9.7 Track Every Response',
            '9.8 Expect Different Lenders to Ask for Different Things',
            '9.9 How to Handle Questions and Conditions',
            '9.10 Keep Your Story Consistent',
            '9.11 Know What a "No" Can Still Teach You',
            '9.12 Keep Momentum Without Creating Pressure',
            '9.13 Know When to Expand Outreach',
            '9.14 Use Prep Coach When Responses Get Complicated',
            '9.15 Common Mistakes to Avoid',
            '9.16 Before You Move Forward',
            '9.17 Final Note',
        ],
    },
    {
        number: '10',
        title: 'Letters of Explanation Template Set',
        items: [
            '10.1 Introduction and Instructions',
            '10.2 Template - LOE-Credit',
            '10.3 Template - LOE-Bankruptcy',
            '10.4 Template - LOE-Prior Record',
            '10.5 Template - LOE-Vacancy',
            '10.6 Template - LOE-Ownership Change',
            '10.7 Quick Instructions for Use',
        ],
    },
    {
        number: '11',
        title: 'From Term Sheet to Formal Underwriting',
        items: [
            '11.1 Why This Section Matters',
            '11.2 What a Term Sheet Usually Means',
            '11.3 Read the Term Sheet Carefully',
            '11.4 What to Ask Yourself Before Accepting',
            '11.5 A Word About Fees',
            '11.6 Formal Underwriting Is a Different Stage',
            '11.7 Expect More Document Requests',
            '11.8 Keep Responses Organized',
            '11.9 Third-Party Reports and Costs',
            '11.10 Conditions Are Normal',
            '11.11 Watch for Deal Drift',
            '11.12 Keep Momentum Going',
            '11.13 Know What Success Looks Like at This Stage',
            '11.14 Use Prep Coach if the Process Gets Heavy',
            '11.15 Common Mistakes to Avoid',
            '11.16 Before You Move Forward',
            '11.17 Final Note',
        ],
    },
    {
        number: '12',
        title: 'Closing and Beyond',
        items: [
            '12.1 Commitment Letter and What It Means',
            '12.2 Legal Review and Late-Stage Issues',
            '12.3 Why Borrowers Should Consider Their Own Legal Review',
            '12.4 How a Prep Coach Can Help During Closing',
            '12.5 Staying Calm When the Deal Feels Uncertain',
            '12.6 Final Loan Documents and Closing Disclosure',
            '12.7 Signing, Funding, and Finalizing the Transaction',
            '12.8 Life After Closing',
            '12.9 Ongoing Communication with Your Lender',
            '12.10 Maintaining Strong Banking Relationships Through Business Challenges',
            '12.11 Long-Term Borrower Responsibilities',
        ],
    },
    {
        number: '13',
        title: 'Final Thoughts',
        items: [
            '13.1 Becoming an Elite Borrowing Prospect',
            '13.2 Why Preparation Changes Outcomes',
            '13.3 Giving Your Transaction the Best Chance for Success',
            '13.4 The Long-Term Value of Borrower Readiness',
            '13.5 Continued Support for K2 Certified Borrowers',
            '13.6 Closing Encouragement',
        ],
    },
    {
        number: '14',
        title: 'Bonus Materials',
        items: [
            'BONUS 1 - Underwriting Q&A',
            'BONUS 2 - Negotiating Loan Terms',
            'BONUS 3 - Owner-Occupied Properties, SBA Financing & Business-Purpose Lending',
        ],
    },
];

const bonusMaterials = [
    {
        label: 'Bonus 1',
        title: 'Underwriting Q&A',
        subtitle: 'A Plain-English Guide to Common Lender and Underwriter Questions After the Term Sheet',
        body: 'Getting a term sheet is an important step. It means a lender has reviewed your file and sees enough potential to continue. But it does not mean the hard part is over. This bonus is designed to help you respond clearly, calmly, and credibly as the file moves deeper into underwriting, due diligence, and closing. It gives you a practical framework for handling common lender questions in a way that is organized, professional, and easy to support with documentation.',
    },
    {
        label: 'Bonus 2',
        title: 'Negotiating Loan Terms',
        subtitle: 'A Plain-English Guide to Reading the Offer, Spotting the Real Risks, and Knowing Where to Push Back',
        body: 'Getting a term sheet is an important step. It means a lender has reviewed your file and is prepared to discuss real terms. But it does not mean the deal is done. This bonus is designed to help you review loan terms clearly, carefully, and strategically before you commit. It gives you a practical framework for understanding pricing, timing, reserves, guarantees, flexibility, and lender controls.',
    },
    {
        label: 'Bonus 3',
        title: 'Owner-Occupied Properties, SBA Financing & Business-Purpose Lending',
        subtitle: 'A Plain-English Supplement for Deals That Go Beyond Pure Real Estate Financing',
        body: 'Getting financing as a business owner often involves more than the property alone. It may also involve the operating business, equipment, working capital, or growth needs. This bonus is designed to help you understand how lenders evaluate those situations and which financing paths may fit. It gives you a practical framework for thinking through programs, documentation, structure, and long-term financing objectives.',
    },
];

const totalWorkbookTopics = tableOfContentsSections.reduce((total, section) => total + section.items.length, 0);

export default function LenderReadyPage() {
    return (
        <main className="bg-white">
            <section id="included" className="py-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
                </div>
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">What&apos;s Included</p>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
                            Everything You Need to Get Lender Ready
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            A complete lender-readiness system to help you prepare, organize, and submit with confidence.
                        </p>
                        <div className="space-y-4 text-base md:text-lg text-gray-600 leading-relaxed">
                            <p>
                                K2 combines step-by-step guidance, practical tools, and smart technology to help you move through the loan preparation process in a more organized and lender-friendly way.
                            </p>
                            <p>
                                You do not have to figure this out piece by piece. Everything is designed to work together so you can prepare your request with more clarity, less stress, and greater confidence.
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-lg font-semibold text-gray-900">Inside the K2 system, you&apos;ll get:</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {includedItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Card key={item.title} className="h-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="space-y-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <CardTitle className="text-2xl text-gray-900">{item.title}</CardTitle>
                                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{item.tagline}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex h-full flex-col">
                                        <p className="text-gray-600 leading-relaxed mb-8">{item.body}</p>
                                        <div className="mt-auto">
                                            <Button asChild className="w-full sm:w-auto">
                                                <Link href={item.href}>
                                                    {item.ctaLabel}
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="table-of-contents" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <div className="absolute -left-16 top-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
                </div>
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div className="space-y-6 lg:sticky lg:top-24">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                                <FolderOpen className="h-4 w-4" />
                                Workbook Table of Contents
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    See exactly how the K2 workbook is structured
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    The workbook is organized to take you from preparation through outreach, lender responses, underwriting, and closing. Each chapter builds on the last so you can move through the process in a lender-friendly order.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-3xl font-bold text-gray-900">13</p>
                                    <p className="mt-2 text-sm text-gray-600">Core workbook sections</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-3xl font-bold text-gray-900">3</p>
                                    <p className="mt-2 text-sm text-gray-600">Bonus guides included</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <p className="text-3xl font-bold text-gray-900">{totalWorkbookTopics}</p>
                                    <p className="mt-2 text-sm text-gray-600">Guided topics and templates</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Card className="rounded-3xl border border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-gray-900">Table of Contents</CardTitle>
                                    <p className="text-gray-600 leading-relaxed">
                                        Expand each chapter to preview the sections covered inside the K2 Lender-Ready Workbook.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="multiple" className="space-y-3">
                                        {tableOfContentsSections.map((section) => (
                                            <AccordionItem
                                                key={section.number}
                                                value={section.number}
                                                className="rounded-2xl border border-slate-200 bg-white px-5"
                                            >
                                                <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                                                    <div className="flex min-w-0 items-center gap-4">
                                                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                                                            {section.number}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-lg font-semibold text-gray-900">{section.title}</p>
                                                            <p className="text-sm text-slate-500">{section.items.length} topics</p>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-5">
                                                    <div className="rounded-2xl bg-slate-50 p-5">
                                                        <ul className="grid gap-3 md:grid-cols-2">
                                                            {section.items.map((item) => (
                                                                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 gap-4">
                                {bonusMaterials.map((bonus) => (
                                    <Card key={bonus.label} className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] via-white to-slate-50 shadow-sm">
                                        <CardHeader className="space-y-3">
                                            <div className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                                                {bonus.label}
                                            </div>
                                            <CardTitle className="text-2xl text-gray-900">{bonus.title}</CardTitle>
                                            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                {bonus.subtitle}
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 leading-relaxed">{bonus.body}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
                        <div className="max-w-3xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                                Why Buyers Love This System
                            </h2>
                            <div className="space-y-4 text-lg text-gray-600 leading-relaxed mb-8">
                                <p>
                                    Because it gives them both the structure of a step-by-step process and the convenience of modern tools that make execution easier.
                                </p>
                                <p>
                                    It is not just information. It is a working system designed to help you get lender ready.
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 mb-4">Why this system works:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {valuePoints.map((item) => (
                                    <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-white to-slate-50 p-8 md:p-12 shadow-sm text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Get the Complete K2 Lender-Readiness System
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
                            Stop guessing what lenders need. Get the tools, structure, and support to prepare with confidence.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <CheckoutButton
                                product="kit"
                                label="Get Started with K2"
                                className="w-full sm:w-auto"
                            />
                            <Button variant="outline" asChild className="w-full sm:w-auto">
                                <Link href="#included">
                                    See What&apos;s Included
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}