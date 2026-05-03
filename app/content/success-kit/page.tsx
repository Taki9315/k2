'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { FlipbookViewer } from '@/components/FlipbookViewer';
import { CERTIFIED_PRICE_LABEL, KIT_PRICE_LABEL } from '@/lib/products';
import {
  ArrowLeft,
  Download,
  Lock,
  BookOpen,
  Shield,
  ArrowRight,
} from 'lucide-react';

/**
 * Success Kit interactive flipbook page.
 *
 * The PDF is stored in public/assets/success-kit/ as individual page images
 * named page-1.jpg, page-2.jpg, etc. This allows a lightweight flipbook
 * without a heavy PDF rendering library.
 *
 * To generate page images from the PDF, run:
 *   pdftoppm -jpeg -r 200 SuccessKit.pdf public/assets/success-kit/page
 *
 * OR upload pre-rendered images to public/assets/success-kit/
 *
 * Set NEXT_PUBLIC_SUCCESS_KIT_PAGES to the total number of pages.
 * Set NEXT_PUBLIC_SUCCESS_KIT_PDF_URL to the downloadable PDF URL.
 */

const TOTAL_PAGES = parseInt(process.env.NEXT_PUBLIC_SUCCESS_KIT_PAGES || '50', 10);
const PDF_URL = process.env.NEXT_PUBLIC_SUCCESS_KIT_PDF_URL || '/assets/success-kit/FinancingSuccessKit.pdf';
const PAGE_IMAGE_BASE = '/assets/success-kit/page';

function getPageUrl(page: number): string {
  // Expects images named page-1.jpg, page-2.jpg, etc. in /public/assets/success-kit/
  return `${PAGE_IMAGE_BASE}-${page}.jpg`;
}

export default function SuccessKitViewerPage() {
  const { user, loading, isCertifiedBorrower, isKitBuyer } = useAuth();
  const router = useRouter();
  const hasPaidAccess = isCertifiedBorrower || isKitBuyer;

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-primary/90">Loading...</p>
      </div>
    );
  }

  if (!hasPaidAccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <Lock className="h-16 w-16 text-slate-300" />
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Financing Success Kit
          </h1>
          <p className="text-gray-600 mb-6">
            The interactive Success Kit viewer is available to kit buyers and
            Certified Borrowers. Purchase the Success Kit to unlock this
            interactive guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/workbook">
                {`Get the Success Kit — ${KIT_PRICE_LABEL}`}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/membership/certified-borrower">
                {`Become Certified — ${CERTIFIED_PRICE_LABEL}`}
              </Link>
            </Button>
          </div>
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
              <Link href="/content">
                <ArrowLeft className="mr-1 h-4 w-4" />
                All Content
              </Link>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-primary" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Financing Success Kit
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Shield className="h-3 w-3 mr-1" />
                  Member Access
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1 ml-10">
                Your complete guide to CRE financing preparation. Browse
                interactively or download the full PDF.
              </p>
            </div>
            <Button variant="outline" className="gap-2 flex-shrink-0" asChild>
              <a href={PDF_URL} download>
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Flipbook viewer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FlipbookViewer
          pdfUrl={PDF_URL}
          totalPages={TOTAL_PAGES}
          getPageUrl={getPageUrl}
        />

        {/* Help text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Use arrow keys or click the page edges to navigate. Click the
            fullscreen button for an immersive reading experience.
          </p>
        </div>
      </div>
    </div>
  );
}
