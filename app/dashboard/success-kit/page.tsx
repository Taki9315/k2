'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  Download,
  ArrowLeft,
  Lock,
  Loader2,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  FileImage,
  File,
} from 'lucide-react';
import { montserrat, playfair, dividerList, darkDividerTitles } from '@/app/workbook/page';
import Image from 'next/image';

/**
 * Success Kit dashboard page — provides document library access,
 * companion downloads, and PrepCoach for Kit + Certified users.
 */

/** Detect file format from mime type or file URL */
function getFileFormat(mimeType: string, fileUrl: string): { label: string; color: string; icon: typeof FileText } {
  const url = fileUrl.toLowerCase();
  if (mimeType === 'application/pdf' || url.endsWith('.pdf')) {
    return { label: 'PDF', color: 'bg-red-100 text-red-700 border-red-200', icon: FileText };
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel' ||
    url.endsWith('.xlsx') || url.endsWith('.xls') || url.endsWith('.csv')
  ) {
    return { label: url.endsWith('.csv') ? 'CSV' : 'Excel', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: FileSpreadsheet };
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    url.endsWith('.docx') || url.endsWith('.doc')
  ) {
    return { label: 'Word', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: FileText };
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mimeType === 'application/vnd.ms-powerpoint' ||
    url.endsWith('.pptx') || url.endsWith('.ppt')
  ) {
    return { label: 'PowerPoint', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: FileText };
  }
  if (mimeType.startsWith('image/') || url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
    return { label: 'Image', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: FileImage };
  }
  if (url.endsWith('.md') || mimeType === 'text/markdown') {
    return { label: 'Markdown', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText };
  }
  return { label: 'File', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: File };
}

export default function SuccessKitDashboardPage() {
  const { user, loading, isCertifiedBorrower, isKitBuyer, isAdmin } = useAuth();
  const router = useRouter();
  const [libraryDocs, setLibraryDocs] = useState<{ id: string; title: string; description: string | null; file_url: string; file_size: number; mime_type: string; category: string }[]>([]);
  const [viewingPdf, setViewingPdf] = useState<{ title: string; url: string } | null>(null);
  const [isKitPreviewOpen, setIsKitPreviewOpen] = useState(false);

  const workbookPdfUrlTemplate =
    (process.env.NEXT_PUBLIC_SUPABASE_URL
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/workbook/pdfs/[number].pdf`
      : '');

  const getWorkbookPdfUrl = (index: number) => {
    if (!workbookPdfUrlTemplate) return null;

    if (workbookPdfUrlTemplate.includes('[number]')) {
      return workbookPdfUrlTemplate.replace('[number]', String(index + 1));
    }

    return `${workbookPdfUrlTemplate.replace(/\/$/, '')}/${index + 1}.pdf`;
  };

  const openWorkbookSectionPdf = (index: number, title: string) => {
    const url = getWorkbookPdfUrl(index);
    if (!url) return;

    setViewingPdf({ title, url });
  };

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const hasAccess = isCertifiedBorrower || isKitBuyer || isAdmin;

  // Fetch document library docs
  useEffect(() => {
    if (!hasAccess) return;
    fetch('/api/document-library')
      .then((res) => res.ok ? res.json() : { docs: [] })
      .then((data) => setLibraryDocs(data.docs || []))
      .catch(() => { });
  }, [hasAccess]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <Lock className="h-16 w-16 text-slate-300" />
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Success Kit Viewer</h1>
          <p className="text-gray-600 mb-6">
            Purchase the Success Kit to access the online flipbook viewer, PDF
            download, and print-ready version.
          </p>
          <Button asChild>
            <Link href="/workbook">Get the Success Kit - $39</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className={`${montserrat.className} min-h-screen bg-[linear-gradient(180deg,#fcfcfa_0%,#f5f6f9_60%,#eef2f7_100%)] text-slate-900`}>
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
          <header
            className={`rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-sm backdrop-blur-sm transition-all md:p-12 ${isKitPreviewOpen ? 'shadow-md' : 'hover:shadow-md'} cursor-pointer`}
            role="button"
            tabIndex={0}
            aria-expanded={isKitPreviewOpen}
            onClick={() => setIsKitPreviewOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setIsKitPreviewOpen((open) => !open);
              }
            }}
          >
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
                <div className="flex items-center gap-3 self-start text-right">
                  <p className="max-w-xs text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    K2 Financing Success Kit
                  </p>
                  <ChevronDown
                    className={`mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isKitPreviewOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className={`${playfair.className} text-4xl leading-tight text-[#192a56] md:text-6xl`}>
                  Welcome to the K2 Financing Success Kit
                </h1>
                <p className="max-w-3xl text-base text-slate-600 md:text-lg">
                  This is your lender-ready workspace for small commercial real estate and owner-occupied business financing. Use the kit to organize your package, strengthen your submission, and move into lender outreach with more clarity and confidence.
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a14a] to-transparent" />

              <div className="grid gap-6 text-sm text-slate-700 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
                  <p className="font-semibold text-slate-900">What It Helps You Do</p>
                  <p className="mt-2">Build a cleaner, more complete loan package.</p>
                  <p className="mt-1">Reduce avoidable back-and-forth with lenders.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
                  <p className="font-semibold text-slate-900">What&apos;s Inside</p>
                  <p className="mt-2">Guides, templates, worksheets, and checklists.</p>
                  <p className="mt-1">Tools to support preparation, packaging, and submission.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5">
                  <p className="font-semibold text-slate-900">How to Use It</p>
                  <p className="mt-2">Work through the kit section by section.</p>
                  <p className="mt-1">Download what you need, complete your package, then move forward.</p>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-500">
                {isKitPreviewOpen ? 'Click this section to collapse the full kit preview.' : 'Click this section to expand the full kit preview.'}
              </p>
            </div>
          </header>

          {isKitPreviewOpen && (
            <>
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
                        Use the kit to turn a rough opportunity into a cleaner, lender-ready submission.
                      </p>
                      <div className="mt-6 h-[2px] w-44 bg-[#c9a14a]" />
                    </div>
                    <p className="mt-28 text-sm text-slate-500 md:mt-32">
                      Start with the story, then support it with organized documents and clean numbers.
                    </p>
                  </article>

                  <div className="space-y-4 text-sm text-slate-700">
                    <h3 className="text-base font-semibold uppercase tracking-[0.16em] text-[#192a56]">
                      Best First Steps
                    </h3>
                    <ol className="space-y-3">
                      <li>1. Read through the guide once so you understand the full financing path before outreach.</li>
                      <li>2. Gather borrower, property, and business documents into one working file set.</li>
                      <li>3. Complete the templates and worksheets to tighten weak spots in the package.</li>
                      <li>4. Use PrepCoach when you need help with loan programs, lender fit, or submission strategy.</li>
                      <li>5. Move your final materials into the Document Library and Deal Room in a clean order.</li>
                      <li>6. Send only when the package feels complete, consistent, and easy for a lender to review.</li>
                    </ol>

                    <h3 className="pt-3 text-base font-semibold uppercase tracking-[0.16em] text-[#192a56]">
                      What to Focus On
                    </h3>
                    <ul className="space-y-2">
                      <li>A clear sponsor story and transaction overview</li>
                      <li>Clean financials, NOI or DSCR support, and sources and uses</li>
                      <li>Complete supporting documents with fewer obvious gaps</li>
                      <li>Consistent naming, organization, and presentation</li>
                      <li>Smart lender targeting before you begin sending files</li>
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
                {dividerList.map((block, index) => {
                  const useDarkTheme = darkDividerTitles.has(block.title);

                  return (
                    <article
                      key={`sheet-${block.title}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${block.title} PDF`}
                      onClick={() => openWorkbookSectionPdf(index, block.title)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openWorkbookSectionPdf(index, block.title);
                        }
                      }}
                      className={`divider-sheet relative overflow-hidden rounded-3xl border shadow-sm ${useDarkTheme
                          ? 'border-[#245b12] bg-[#3f8700]'
                          : 'border-slate-200 bg-[#fffefb]'
                        } cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2`}
                    >
                      <div
                        className={`absolute left-0 top-0 h-full w-2 ${useDarkTheme ? 'bg-[#c9a14a]/60' : 'bg-[#c9a14a]/45'
                          }`}
                      />

                      <div className="divider-sheet-inner relative flex h-full flex-col">
                        <div className={`divider-logo-wrap relative h-14 w-44 md:h-16 md:w-52 ${useDarkTheme ? 'rounded-2xl bg-white/95 p-2 shadow-sm shadow-black/20' : ''}`}>
                          <div className="relative h-full w-full">
                            <Image
                              src="/brand.png"
                              alt="K2 logo"
                              fill
                              className="object-contain object-left"
                            />
                          </div>
                        </div>

                        <div className="divider-main-copy mt-auto">
                          <h2
                            className={`${playfair.className} text-[clamp(2.2rem,5vw,3.2rem)] leading-[1.1] ${useDarkTheme ? 'text-white' : 'text-[#192a56]'
                              }`}
                          >
                            {block.title}
                          </h2>
                          <p
                            className={`mt-4 max-w-[42ch] text-[clamp(0.95rem,2vw,1.1rem)] font-medium ${useDarkTheme ? 'text-slate-200' : 'text-slate-600'
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
                                  className={`flex items-start gap-2 text-[0.72rem] leading-snug ${useDarkTheme ? 'text-slate-300' : 'text-slate-500'
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
                          className={`divider-footer mt-auto text-[0.72rem] md:text-[0.78rem] ${useDarkTheme ? 'text-slate-300' : 'text-slate-500'
                            }`}
                        >
                          {block.footer}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </section>
            </>
          )}
        </div>
      </main>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Library listing */}
        {/* {libraryDocs.length > 0 && (
          <Card className="mb-8">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Document Library</h3>
                      <p className="text-xs text-gray-500">{libraryDocs.length} {libraryDocs.length === 1 ? 'document' : 'documents'} available</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {libraryDocs.map((doc) => {
                      const fmt = getFileFormat(doc.mime_type, doc.file_url);
                      const isPdf = fmt.label === 'PDF';
                      const FormatIcon = fmt.icon;
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${fmt.color.split(' ')[0]}`}>
                              <FormatIcon className={`h-4 w-4 ${fmt.color.split(' ')[1]}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                              {doc.description && (
                                <p className="text-xs text-gray-500 truncate">{doc.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className={`text-[10px] px-1.5 py-0 border ${fmt.color}`}>
                                  {fmt.label}
                                </Badge>
                                {doc.category && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {doc.category}
                                  </Badge>
                                )}
                                {doc.file_size > 0 && (
                                  <span className="text-[10px] text-gray-400">
                                    {doc.file_size < 1024 * 1024
                                      ? (doc.file_size / 1024).toFixed(1) + ' KB'
                                      : (doc.file_size / (1024 * 1024)).toFixed(1) + ' MB'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isPdf && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1.5 h-8"
                                title="Open PDF viewer"
                                onClick={() => setViewingPdf({ title: doc.title, url: doc.file_url })}
                              >
                                <BookOpen className="h-3.5 w-3.5" />
                                View
                              </Button>
                            )}
                            <Button size="sm" variant="outline" asChild className="gap-1.5 h-8">
                              <a href={doc.file_url} download>
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
        )} */}

        {/* Quick info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">50+ Pages</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Comprehensive guide covering every step of CRE financing.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">15 Templates</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ready-to-use worksheets and forms for your loan package.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {isCertifiedBorrower || isAdmin ? 'Full Access Active' : '6 Months Access'}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isCertifiedBorrower || isAdmin
                    ? 'Your Success Kit remains included with your broader dashboard access.'
                    : 'Unlimited deals during your six-month access window.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companion downloads */}
        <div className="mt-8">

          {/* PrepCoach upsell box */}
          <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 via-emerald-50/30 to-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    AI Made Simple &mdash; Meet PrepCoach
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    The first AI agent designed exclusively for small commercial property investors.
                    Turnkey program &mdash; no tech expertise needed.
                  </p>
                  <p className="text-sm text-primary font-medium">
                    Click prompts &rarr; get expert guidance instantly.
                  </p>
                </div>
                <Button size="lg" asChild className="flex-shrink-0 shadow-md">
                  <Link href="/prepcoach">
                    Explore PrepCoach
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <h3 className="text-lg font-bold text-gray-900 mb-4">Companion Downloads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    K2 Financing Success Kit — Full Guide
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 mb-3">
                    The complete 4-chapter guide: preparation, loan programs,
                    finding lenders, and closing your deal.
                  </p>
                  <Button variant="outline" size="sm" asChild className="gap-1.5">
                    <a href="/assets/K2_Financing_Success_Kit.md" download>
                      <Download className="h-4 w-4" />
                      Download Guide
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-emerald-200">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Loan Comparison Spreadsheet
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 mb-3">
                    Side-by-side loan comparison worksheet with key formulas
                    and example entries — ready to fill in.
                  </p>
                  <Button variant="outline" size="sm" asChild className="gap-1.5">
                    <a href="/assets/K2_Loan_Comparison_Spreadsheet.xlsx" download>
                      <Download className="h-4 w-4" />
                      Download Spreadsheet
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Access Document Library — prominent CTA */}
        <Card className="mt-8 border-primary/20 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Access Document Library
              </h3>
              <p className="text-sm text-gray-600">
                Download application forms, companion worksheets, templates, and all
                the documents you need for your loan package.
              </p>
            </div>
            <Button size="lg" asChild className="gap-2 bg-black hover:bg-black/80 text-white shadow-md flex-shrink-0">
              <Link href="/dashboard/documents">
                <FolderOpen className="h-5 w-5" />
                Open Document Library
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Certified upsell (only for Kit users) */}
        {isKitBuyer && (
          <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-emerald-50/30">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Unlock Full Access
                </h3>
                <p className="text-sm text-gray-600">
                  Become a K2 Certified Borrower for full Prep Coach access,
                  preferred lender network, deal room, and personalized coaching.
                </p>
              </div>
              <Button asChild>
                <Link href="/membership/certified-borrower">
                  Upgrade to Certified
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!viewingPdf} onOpenChange={() => setViewingPdf(null)}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-5 py-3 border-b flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base pr-8">
              <BookOpen className="h-4 w-4 text-primary" />
              {viewingPdf?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 relative">
            {/* <div className="absolute top-2 right-2 z-10">
              <Button size="sm" variant="secondary" asChild className="gap-1.5 h-7 text-xs shadow-sm">
                <a href={viewingPdf?.url || ''} download>
                  <Download className="h-3 w-3" />
                  Download
                </a>
              </Button>
            </div> */}
            {viewingPdf && (
              <iframe
                src={viewingPdf.url}
                className="w-full h-full border-0"
                title={viewingPdf.title}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
