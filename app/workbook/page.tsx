import Image from 'next/image';
import { Montserrat, Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

type DividerCopy = {
  title: string;
  subtitle: string;
  footer: string;
  subItems: string[];
};

const dividerList: DividerCopy[] = [
  // ── Main sections ─────────────────────────────────────────────────
  {
    title: 'Start Here',
    subtitle: 'Welcome to the K2 Lender-Ready System and everything it includes.',
    footer: 'A cleaner process starts with a clearer plan.',
    subItems: [
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
    title: 'Commercial Loan Application',
    subtitle: 'Complete the application correctly before anything else moves.',
    footer: 'A strong application is the foundation of a credible file.',
    subItems: [
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
    title: 'Loan Programs',
    subtitle: 'Choose the right financing structure before you choose the lender.',
    footer: 'Program fit drives lender fit.',
    subItems: [
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
    title: 'Required Documentation and Supporting Forms',
    subtitle: 'Build a complete, organized file that lenders can move on.',
    footer: 'Missing documents are the most common reason deals stall.',
    subItems: [
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
    title: 'Building and Organizing the Deal Room',
    subtitle: 'Keep everything in one place and share it the right way.',
    footer: 'An organized deal room signals a prepared borrower.',
    subItems: [
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
    title: 'Deal Room Cover Page Template',
    subtitle: 'Give lenders a clear snapshot before they open a single file.',
    footer: 'The cover page sets the tone for everything that follows.',
    subItems: [
      '6.1 Purpose of the Cover Page',
      '6.2 Deal Room Snapshot Template',
      '6.3 Documents Included in This Deal Room',
      '6.4 Suggested File Name',
      '6.5 Final Checklist',
    ],
  },
  {
    title: 'Initial Lender Outreach',
    subtitle: 'Reach out professionally and strategically to the right lenders.',
    footer: 'Preparation first. Outreach second.',
    subItems: [
      '7.1 Why This Section Matters',
      '7.2 Start with the Right Lender Targets',
      '7.3 Why Your Preparation Gives You an Advantage',
      '7.4 Use the Email Templates — But Customize Them',
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
    title: 'Follow-Up Email Templates',
    subtitle: 'Stay professional, persistent, and easy to respond to.',
    footer: 'Clear follow-up keeps deals from going quiet.',
    subItems: [
      '8.1 Step 3 — First Follow-Up Email',
      '8.2 Step 3 — Short Version',
      '8.3 Step 4 — Final Follow-Up Email',
      '8.4 Step 4 — Short Version',
      '8.5 Follow-Up Style Rules',
      '8.6 When to Stop Following Up',
      '8.7 Final Checklist',
    ],
  },
  {
    title: 'Managing Lender Responses and Next Steps',
    subtitle: 'Respond quickly, stay consistent, and keep momentum moving.',
    footer: 'How you handle responses shapes how lenders see you.',
    subItems: [
      '9.1 Why This Section Matters',
      '9.2 What a Lender Response Usually Means',
      '9.3 Keep the Real Goal in Mind',
      '9.4 Respond Quickly — But Not Carelessly',
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
    title: 'Letters of Explanation Template Set',
    subtitle: 'Address concerns clearly before lenders have to ask twice.',
    footer: 'A well-written explanation removes doubt from the file.',
    subItems: [
      '10.1 Introduction and Instructions',
      '10.2 Template — LOE-Credit',
      '10.3 Template — LOE-Bankruptcy',
      '10.4 Template — LOE-Prior Record',
      '10.5 Template — LOE-Vacancy',
      '10.6 Template — LOE-Ownership Change',
      '10.7 Quick Instructions for Use',
    ],
  },
  {
    title: 'From Term Sheet to Formal Underwriting',
    subtitle: 'Understand the offer before you accept the structure.',
    footer: 'Not every yes is the right yes.',
    subItems: [
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
    title: 'Closing and Beyond',
    subtitle: 'Move through commitment, signing, and funding with confidence.',
    footer: 'A strong finish starts with a complete file.',
    subItems: [
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
    title: 'Final Thoughts',
    subtitle: 'Preparation is what separates funded deals from stalled ones.',
    footer: 'The work you do before outreach determines the outcome.',
    subItems: [
      '13.1 Becoming an Elite Borrowing Prospect',
      '13.2 Why Preparation Changes Outcomes',
      '13.3 Giving Your Transaction the Best Chance for Success',
      '13.4 The Long-Term Value of Borrower Readiness',
      '13.5 Continued Support for K2 Certified Borrowers',
      '13.6 Closing Encouragement',
    ],
  },
  // ── Bonus sections ────────────────────────────────────────────────
  {
    title: 'Bonus 1 — Underwriting Q&A',
    subtitle: 'Respond to lender questions clearly, calmly, and with documentation.',
    footer: 'A fast, credible response keeps deals moving.',
    subItems: [
      'A Plain-English Guide to Common Lender and Underwriter Questions After the Term Sheet',
      'Practical framework for handling questions clearly and professionally',
      'Covers due diligence, conditions, and closing-stage responses',
    ],
  },
  {
    title: 'Bonus 2 — Negotiating Loan Terms',
    subtitle: 'Read the offer carefully and know where the real risks are.',
    footer: 'Not every yes is the right yes.',
    subItems: [
      'A Plain-English Guide to Reading the Offer and Knowing Where to Push Back',
      'Covers pricing, timing, reserves, guarantees, and lender controls',
      'Practical framework for reviewing terms before you commit',
    ],
  },
  {
    title: 'Bonus 3 — SBA & Business-Purpose Lending',
    subtitle: 'Understand how lenders evaluate deals that go beyond pure real estate.',
    footer: 'Business-purpose lending follows a different path.',
    subItems: [
      'A Plain-English Supplement for Owner-Occupied and Business-Purpose Deals',
      'Covers SBA financing, equipment, working capital, and growth needs',
      'Programs, documentation, structure, and long-term financing objectives',
    ],
  },
];

const plainTextColumn = dividerList
  .map((block) => `${block.title}\n\n${block.subtitle}\n\n${block.footer}`)
  .join('\n\n');

const darkDividerTitles = new Set([
  'Final Thoughts',
  'Bonus 1 — Underwriting Q&A',
  'Bonus 2 — Negotiating Loan Terms',
  'Bonus 3 — SBA & Business-Purpose Lending',
]);

export default function WorkbookPage() {
  return (
    <main className={`${montserrat.className} min-h-screen bg-[linear-gradient(180deg,#fcfcfa_0%,#f5f6f9_60%,#eef2f7_100%)] text-slate-900`}>
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <header className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-sm backdrop-blur-sm md:p-12">
          <div className="flex flex-col gap-10">
            <div className="flex items-start justify-between gap-6">
              <div className="relative h-14 w-44 md:h-16 md:w-52">
                <Image
                  src="/logo2.png"
                  alt="K2 Commercial Finance Investor and Business Loans"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <p className="max-w-xs text-right text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Master Divider System
              </p>
            </div>

            <div className="space-y-4">
              <h1 className={`${playfair.className} text-4xl leading-tight text-[#192a56] md:text-6xl`}>
                Master Canva Divider Template
              </h1>
              <p className="max-w-3xl text-base text-slate-600 md:text-lg">
                Duplicate this single design for each workbook section. Keep layout, spacing,
                typography, and branding fixed. Only swap section title, subtitle, and footer text.
              </p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a14a] to-transparent" />

            <div className="grid gap-6 text-sm text-slate-700 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
                <p className="font-semibold text-slate-900">Dimensions</p>
                <p className="mt-2">US Letter Portrait: 8.5 x 11 in</p>
                <p className="mt-1">A4 Portrait: 210 x 297 mm</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
                <p className="font-semibold text-slate-900">Style Pairing</p>
                <p className="mt-2">Title: Playfair Display</p>
                <p className="mt-1">Subtitle/Footer: Montserrat</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
                <p className="font-semibold text-slate-900">Primary Palette</p>
                <p className="mt-2">Light background</p>
                <p className="mt-1">Navy text + gold accent</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <div className="grid items-start gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            <article className="rounded-2xl border border-slate-200 bg-[#fffefb] p-7 md:p-8">
              <div className="relative h-10 w-36">
                <Image
                  src="/logo2.png"
                  alt="K2 logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <div className="mt-20 md:mt-24">
                <h2 className={`${playfair.className} text-4xl text-[#192a56] md:text-5xl`}>
                  Start Here
                </h2>
                <p className="mt-4 max-w-xl text-base font-medium text-slate-600 md:text-lg">
                  Build your deal the right way from the beginning.
                </p>
                <div className="mt-6 h-[2px] w-44 bg-[#c9a14a]" />
              </div>
              <p className="mt-28 text-sm text-slate-500 md:mt-32">
                A cleaner process starts with a clearer plan.
              </p>
            </article>

            <div className="space-y-4 text-sm text-slate-700">
              <h3 className="text-base font-semibold uppercase tracking-[0.16em] text-[#192a56]">
                Canva Build Checklist
              </h3>
              <ol className="space-y-3">
                <li>1. Create one divider page with logo, title, subtitle, accent line, and footer.</li>
                <li>2. Keep logo top-left for a premium business layout.</li>
                <li>3. Follow fixed spacing and alignment across every duplicate page.</li>
                <li>4. Duplicate this divider design 20 times.</li>
                <li>5. Change only title, subtitle, and footer text for each section.</li>
                <li>6. Use dark variation only for major bonus or final CTA sections.</li>
              </ol>

              <h3 className="pt-3 text-base font-semibold uppercase tracking-[0.16em] text-[#192a56]">
                Spacing Guide
              </h3>
              <ul className="space-y-2">
                <li>Top margin: 0.75 in to 1.0 in</li>
                <li>Logo to title: 1.0 in to 1.5 in</li>
                <li>Title to subtitle: 0.2 in to 0.35 in</li>
                <li>Subtitle to accent: 0.25 in to 0.4 in</li>
                <li>Footer from bottom: 0.5 in to 0.75 in</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <h3 className="text-base font-semibold uppercase tracking-[0.16em] text-[#192a56]">
            Divider Text Blocks
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Includes 13 main sections plus 3 bonus sections.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {dividerList.map((block, index) => (
              <article key={block.title} className="rounded-2xl border border-slate-200 bg-[#fbfcff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {index + 1}
                </p>
                <h4 className={`${playfair.className} mt-2 text-2xl text-[#192a56]`}>
                  {block.title}
                </h4>
                <p className="mt-2 text-sm text-slate-700">{block.subtitle}</p>
                <div className="mt-4 h-[2px] w-24 bg-[#c9a14a]" />
                {block.subItems.length > 0 && (
                  <ul className="mt-4 space-y-1">
                    {block.subItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-500">
                        <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a14a]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 text-xs font-medium text-slate-400 italic">{block.footer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-8">
          {dividerList.map((block) => {
            const useDarkTheme = darkDividerTitles.has(block.title);

            return (
              <article
                key={`sheet-${block.title}`}
                className={`divider-sheet relative overflow-hidden rounded-3xl border shadow-sm ${
                  useDarkTheme
                    ? 'border-slate-700 bg-[#0f1d45]'
                    : 'border-slate-200 bg-[#fffefb]'
                }`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-2 ${
                    useDarkTheme ? 'bg-[#c9a14a]/60' : 'bg-[#c9a14a]/45'
                  }`}
                />

                <div className="divider-sheet-inner relative flex h-full flex-col">
                  <div className="divider-logo-wrap relative h-14 w-44 md:h-16 md:w-52">
                    <Image
                      src="/logo2.png"
                      alt="K2 logo"
                      fill
                      className={`object-contain object-left ${
                        useDarkTheme ? 'brightness-0 invert' : ''
                      }`}
                    />
                  </div>

                  <div className="divider-main-copy mt-auto">
                    <h2
                      className={`${playfair.className} text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.1] ${
                        useDarkTheme ? 'text-white' : 'text-[#192a56]'
                      }`}
                    >
                      {block.title}
                    </h2>
                    <p
                      className={`mt-4 max-w-[42ch] text-[clamp(0.95rem,2vw,1.1rem)] font-medium ${
                        useDarkTheme ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {block.subtitle}
                    </p>
                    <div className="mt-6 h-[2px] w-44 bg-[#c9a14a]" />
                    {block.subItems.length > 0 && (
                      <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1.5">
                        {block.subItems.map((item) => (
                          <li
                            key={item}
                            className={`flex items-start gap-2 text-[0.72rem] leading-snug ${
                              useDarkTheme ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          >
                            <span className="mt-[4px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a14a]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <p
                    className={`divider-footer mt-auto text-[0.72rem] md:text-[0.78rem] ${
                      useDarkTheme ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {block.footer}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
