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
  Sparkles,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  FileImage,
  File,
} from 'lucide-react';

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
      .catch(() => {});
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
      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Financing Success Kit
                </h1>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Access your documents, companion downloads.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" asChild className="gap-1.5">
                <Link href="/workbook">
                  <FolderOpen className="h-4 w-4" />
                  Financing Success Kit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Library listing */}
        {libraryDocs.length > 0 && (
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
        )}

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
                <h4 className="text-sm font-semibold text-gray-900">Lifetime Access</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Free updates whenever we add new content or templates.
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
            <div className="absolute top-2 right-2 z-10">
              <Button size="sm" variant="secondary" asChild className="gap-1.5 h-7 text-xs shadow-sm">
                <a href={viewingPdf?.url || ''} download>
                  <Download className="h-3 w-3" />
                  Download
                </a>
              </Button>
            </div>
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
