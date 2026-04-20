import Link from "next/link";

export default function MeetCoachPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-green-400 font-semibold tracking-widest uppercase text-sm mb-4">
                        Your Intelligent Preparation Advantage
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Prep Coach</h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                        K2 Commercial Finance&rsquo;s proprietary AI assistant, built specifically for
                        small commercial borrowers who want to prepare more strategically, avoid
                        costly missteps, and approach lenders with greater confidence.
                    </p>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
                    <h2 className="text-3xl font-bold text-gray-900">A Smarter Way to Prepare</h2>
                    <p>
                        Small commercial real estate investors and owner-occupied business borrowers
                        often face the same challenge: they may have a strong opportunity, but not
                        enough clarity around what lenders expect, how to organize their information,
                        how to present a deal properly, or how to think through key financing
                        questions before conversations begin.
                    </p>
                    <p>
                        Prep Coach helps solve that problem. This is not generic AI. It is a
                        purpose-built preparation tool designed around the real-world needs of small
                        commercial borrowers.
                    </p>
                </div>
            </section>

            {/* Why It Matters */}
            <section className="bg-slate-50 py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8">Why Prep Coach Matters</h2>
                    <div className="space-y-4 text-lg text-gray-700">
                        <p>In commercial financing, preparation can shape everything that follows.</p>
                        <ul className="space-y-3 list-none">
                            {[
                                "The quality of your package matters.",
                                "The clarity of your communication matters.",
                                "Your ability to anticipate lender questions matters.",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">&#9670;</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p>
                            Prep Coach gives you immediate access to focused, borrower-centered
                            guidance designed to help you prepare at a higher level — with more
                            structure, more clarity, and less wasted effort.
                        </p>
                    </div>
                </div>
            </section>

            {/* What It Helps You Do */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-10 text-center">
                        What Prep Coach Helps You Do
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            "Prepare your loan package more professionally",
                            "Strengthen executive summaries and borrower narratives",
                            "Get answers to DSCR, cash flow, and financing questions",
                            "Better understand what lenders are likely to want to see",
                            "Prepare for lender and advisor conversations",
                            "Move forward with less guesswork and more confidence",
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200"
                            >
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2.5 shrink-0" />
                                <p className="text-gray-700">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-slate-900 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="bg-slate-800 rounded-2xl p-8">
                            <div className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-3">
                                Option 1
                            </div>
                            <h3 className="text-xl font-bold mb-4">Guided Prompts</h3>
                            <p className="text-slate-300">
                                Start with curated prompts built around common borrower questions and
                                preparation tasks. Get structure and move step by step through the
                                process without having to guess what to ask.
                            </p>
                        </div>
                        <div className="bg-slate-800 rounded-2xl p-8">
                            <div className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-3">
                                Option 2
                            </div>
                            <h3 className="text-xl font-bold mb-4">Free-Flowing Q&A</h3>
                            <p className="text-slate-300">
                                Ask your own questions anytime and get immediate answers tailored to
                                the small commercial borrowing process. Work at your own pace with
                                meaningful support.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why It's Different */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Why It&rsquo;s Different</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        Prep Coach is not a general AI chatbot trying to answer everything for
                        everyone.
                    </p>
                    <p className="text-lg text-gray-700">
                        It is <span className="font-semibold text-gray-900">purpose-built</span>{" "}
                        for small commercial mortgage preparation and shaped around the actual
                        needs of borrowers trying to become lender-ready. That focus means more
                        relevant guidance, less noise, and more practical value.
                    </p>
                </div>
            </section>

            {/* Key Benefits */}
            <section className="bg-slate-50 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">Key Benefits</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Built for Small Commercial Borrowers",
                                desc: "Designed around the needs of small commercial investors and owner-occupied business borrowers.",
                            },
                            {
                                title: "Available 24/7",
                                desc: "Get support whenever questions arise and whenever it fits your schedule.",
                            },
                            {
                                title: "Easy to Use",
                                desc: "No technical expertise required. Start with a prompt or ask a question and get useful guidance immediately.",
                            },
                            {
                                title: "Stronger Preparation",
                                desc: "Improve how you organize your transaction, present your information, and think through the process.",
                            },
                            {
                                title: "Better Efficiency",
                                desc: "Reduce confusion, avoid unnecessary back-and-forth, and make more productive progress.",
                            },
                            {
                                title: "Exceptional Value",
                                desc: "Prep Coach alone delivers value that exceeds the cost of the entire K2 Lender-Ready System.",
                            },
                        ].map((benefit) => (
                            <div key={benefit.title} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* High-Value Advantage */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900">A High-Value Advantage</h2>
                    <p>
                        Better preparation can save time, reduce avoidable mistakes, improve lender
                        communication, and strengthen how a transaction is presented from the outset.
                        That kind of advantage can have an outsized impact on the financing process.
                    </p>
                    <p>
                        When preparation improves, everything downstream has the potential to improve
                        with it — from lender communication and process efficiency to the overall
                        quality of execution.
                    </p>
                </div>
            </section>

            {/* Feature Summary */}
            <section className="bg-slate-50 py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        What&rsquo;s Included with Prep Coach
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            "Guided borrower prompts",
                            "Free-form AI Q&A",
                            "Loan package preparation support",
                            "Executive summary guidance",
                            "Lender communication support",
                            "DSCR and deal analysis help",
                            "24/7 access",
                            "Built specifically for small commercial borrowers",
                        ].map((feature) => (
                            <div key={feature} className="flex items-center gap-3 bg-white rounded-lg p-4 border border-slate-200">
                                <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-24 px-6">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">Get Better Prepared</h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        If you want to approach lenders with stronger preparation, fewer avoidable
                        missteps, and greater confidence, Prep Coach was built for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link
                            href="/lender-ready"
                            className="inline-block bg-green-500 hover:bg-green-600 text-slate-900 font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
                        >
                            See What&rsquo;s Included in the Lender-Ready System
                        </Link>
                        <Link
                            href="/lender-ready"
                            className="inline-block border border-slate-500 hover:border-slate-300 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
                        >
                            Explore the Lender-Ready System
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}