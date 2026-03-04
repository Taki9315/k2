'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { FlipbookViewer } from '@/components/FlipbookViewer';
import { Loader2, X } from 'lucide-react';

type DocumentPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  fileName: string;
  mimeType: string;
};

/**
 * Admin document preview dialog.
 * PDFs are rendered page-by-page via pdf.js and viewed through FlipbookViewer.
 * Images are shown directly.
 */
export function DocumentPreviewDialog({
  open,
  onOpenChange,
  fileId,
  fileName,
  mimeType,
}: DocumentPreviewDialogProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PDF state
  const [pageUrls, setPageUrls] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  // Image state
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const isPdf =
    mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
  const isImage = mimeType.startsWith('image/');

  const viewUrl = `/api/admin/application-docs/download?fileId=${fileId}&inline=true`;

  // Cleanup blob URLs on unmount
  const blobUrlsRef = useRef<string[]>([]);
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const loadPdf = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPageUrls([]);
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current = [];

    try {
      // Dynamically import pdfjs-dist (only when needed)
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker from CDN
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const pdf = await pdfjsLib.getDocument(viewUrl).promise;
      const numPages = pdf.numPages;
      setTotalPages(numPages);

      const urls: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        // Convert canvas to blob URL (more memory-efficient than data URLs)
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9)
        );
        const blobUrl = URL.createObjectURL(blob);
        urls.push(blobUrl);
        blobUrlsRef.current.push(blobUrl);
      }

      setPageUrls(urls);
    } catch (err) {
      console.error('PDF load error:', err);
      setError('Failed to load PDF. Try downloading the file instead.');
    }
    setLoading(false);
  }, [viewUrl]);

  const loadImage = useCallback(() => {
    setLoading(true);
    setError(null);
    setImageUrl(viewUrl);
    setLoading(false);
  }, [viewUrl]);

  useEffect(() => {
    if (!open) return;
    if (isPdf) {
      loadPdf();
    } else if (isImage) {
      loadImage();
    } else {
      setLoading(false);
      setError('Preview not available for this file type. Please download it.');
    }
  }, [open, isPdf, isImage, loadPdf, loadImage]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setPageUrls([]);
      setTotalPages(0);
      setImageUrl(null);
      setError(null);
      setLoading(true);
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-card p-0 [&>button.absolute]:hidden">
        <VisuallyHidden.Root>
          <DialogTitle>{fileName}</DialogTitle>
          <DialogDescription>Preview of {fileName}</DialogDescription>
        </VisuallyHidden.Root>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div className="min-w-0 pr-4">
            <h3 className="text-sm font-semibold truncate">{fileName}</h3>
            {isPdf && totalPages > 0 && (
              <p className="text-xs text-muted-foreground">
                {totalPages} page{totalPages !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/api/admin/application-docs/download?fileId=${fileId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isPdf ? 'Rendering PDF pages…' : 'Loading…'}
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`/api/admin/application-docs/download?fileId=${fileId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download File
                </a>
              </Button>
            </div>
          )}

          {/* PDF via FlipbookViewer */}
          {!loading && !error && isPdf && pageUrls.length > 0 && (
            <FlipbookViewer
              pdfUrl={viewUrl}
              totalPages={totalPages}
              getPageUrl={(page) => pageUrls[page - 1] || ''}
            />
          )}

          {/* Image preview */}
          {!loading && !error && isImage && imageUrl && (
            <div className="flex items-center justify-center">
              <img
                src={imageUrl}
                alt={fileName}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
