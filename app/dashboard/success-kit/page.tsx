'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { FlipbookViewer } from '@/components/FlipbookViewer';
import {
  BookOpen,
  Download,
  Printer,
  ArrowLeft,
  Lock,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

/**
 * Success Kit dashboard page — provides an embedded flipbook viewer
 * for the Success Kit PDF. Kit users + Certified users can view & download.
 */

const PDF_URL = '/assets/success-kit.pdf';
const TOTAL_PAGES = 52; // Update when final PDF is ready

// Generate page image URLs — when actual page images are available,
// point this to your CDN / public directory structure.
function getPageUrl(page: number): string {
  return `/assets/success-kit-pages/page-${page}.jpg`;
}

export default function SuccessKitDashboardPage() {
  const { user, loading, isCertifiedBorrower, isKitBuyer, isAdmin } = useAuth();
  const router = useRouter();
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const hasAccess = isCertifiedBorrower || isKitBuyer || isAdmin;

  // Check if the PDF / page images exist
  useEffect(() => {
    fetch('/assets/success-kit-pages/page-1.jpg', { method: 'HEAD' })
      .then((res) => setPdfReady(res.ok))
      .catch(() => setPdfReady(false));
  }, []);

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
            <Link href="/workbook">Get the Success Kit - $15</Link>
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
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                  <BookOpen className="h-3 w-3" />
                  Online Viewer
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Read online, download PDF, or print your Success Kit.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <a href={PDF_URL} download>
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pdfReady ? (
          <FlipbookViewer
            pdfUrl={PDF_URL}
            totalPages={TOTAL_PAGES}
            getPageUrl={getPageUrl}
            className="mb-8"
          />
        ) : (
          <Card className="mb-8">
            <CardContent className="py-16 text-center">
              <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Flipbook Coming Soon
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                The interactive flipbook viewer is being prepared. In the
                meantime, download the PDF directly to read and print.
              </p>
              <Button asChild className="gap-2">
                <a href={PDF_URL} download>
                  <Download className="h-4 w-4" />
                  Download Success Kit PDF
                </a>
              </Button>
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
    </div>
  );
}
