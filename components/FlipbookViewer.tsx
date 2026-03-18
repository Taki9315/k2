'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FlipbookViewerProps = {
  /** URL to the PDF file */
  pdfUrl: string;
  /** Total page count */
  totalPages: number;
  /** Page image URLs (pre-rendered) or function to get page image */
  getPageUrl: (page: number) => string;
  className?: string;
};

/**
 * Magazine-style flipbook viewer with page-turning animations.
 * Renders pre-generated page images and provides a book-like reading experience.
 */
export function FlipbookViewer({
  pdfUrl,
  totalPages,
  getPageUrl,
  className,
}: FlipbookViewerProps) {
  const [currentSpread, setCurrentSpread] = useState(0); // 0 = cover (page 1), 1 = pages 2-3, etc.
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isCover = currentSpread === 0;
  const maxSpread = Math.ceil((totalPages - 1) / 2); // first page is cover, rest are spreads of 2

  const leftPage = isCover ? null : (currentSpread - 1) * 2 + 2;
  const rawRight = isCover ? 1 : (currentSpread - 1) * 2 + 3;
  const rightPage = isCover ? 1 : rawRight <= totalPages ? rawRight : null;
  const isSinglePage = !isCover && leftPage !== null && rightPage === null;
  const isLastSpread = currentSpread >= maxSpread;

  const goNext = () => {
    if (isFlipping || isLastSpread) return;
    setFlipDirection('right');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread((s) => s + 1);
      setIsFlipping(false);
    }, 400);
  };

  const goPrev = () => {
    if (isFlipping || currentSpread === 0) return;
    setFlipDirection('left');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread((s) => s - 1);
      setIsFlipping(false);
    }, 400);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSpread, isFlipping, isFullscreen]);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  const displayedPageNum = isCover
    ? '1'
    : isSinglePage
    ? `${leftPage}`
    : leftPage && rightPage
    ? `${leftPage}–${rightPage}`
    : `${leftPage || rightPage}`;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none',
        isFullscreen && 'fixed inset-0 z-50 bg-black flex flex-col items-center justify-center',
        className
      )}
    >
      {/* Book container */}
      <div
        className={cn(
          'relative mx-auto transition-transform duration-300',
          isFullscreen ? 'max-w-6xl w-full px-4' : 'w-full'
        )}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <div
          className={cn(
            'relative bg-white rounded-lg shadow-2xl overflow-hidden mx-auto',
            isCover || isSinglePage ? 'max-w-md' : 'max-w-4xl',
            'border border-slate-200'
          )}
        >
          {/* Page flip animation overlay */}
          {isFlipping && (
            <div
              className={cn(
                'absolute inset-0 z-10 pointer-events-none',
                'bg-gradient-to-r from-transparent via-white/30 to-transparent',
                flipDirection === 'right'
                  ? 'animate-[flipRight_0.4s_ease-in-out]'
                  : 'animate-[flipLeft_0.4s_ease-in-out]'
              )}
            />
          )}

          {/* Pages */}
          <div className={cn('flex', isCover || isSinglePage ? 'justify-center' : '')}>
            {/* Cover page or single trailing page */}
            {isCover ? (
              <div className="w-full aspect-[3/4] bg-slate-100 flex items-center justify-center">
                <img
                  src={getPageUrl(1)}
                  alt="Cover"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            ) : isSinglePage && leftPage ? (
              <div className="w-full aspect-[3/4] bg-white flex items-center justify-center">
                <img
                  src={getPageUrl(leftPage)}
                  alt={`Page ${leftPage}`}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            ) : (
              <>
                {/* Left page */}
                {leftPage && leftPage <= totalPages && (
                  <div
                    className="w-1/2 aspect-[3/4] bg-white border-r border-slate-100 flex items-center justify-center cursor-pointer"
                    onClick={goPrev}
                  >
                    <img
                      src={getPageUrl(leftPage)}
                      alt={`Page ${leftPage}`}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                )}
                {/* Right page */}
                {rightPage && rightPage <= totalPages && (
                  <div
                    className="w-1/2 aspect-[3/4] bg-white flex items-center justify-center cursor-pointer"
                    onClick={goNext}
                  >
                    <img
                      src={getPageUrl(rightPage)}
                      alt={`Page ${rightPage}`}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Page turn hover zones */}
          {!isCover && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-0 top-0 bottom-0 w-16 opacity-20 sm:opacity-0 sm:hover:opacity-100 bg-gradient-to-r from-black/10 to-transparent transition-opacity flex items-center justify-start pl-2"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-8 w-8 text-white drop-shadow-lg" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-0 top-0 bottom-0 w-16 opacity-20 sm:opacity-0 sm:hover:opacity-100 bg-gradient-to-l from-black/10 to-transparent transition-opacity flex items-center justify-end pr-2"
                aria-label="Next page"
              >
                <ChevronRight className="h-8 w-8 text-white drop-shadow-lg" />
              </button>
            </>
          )}

          {/* Book spine shadow */}
          {!isCover && !isSinglePage && (
            <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Controls bar */}
      <div
        className={cn(
          'flex items-center justify-center gap-3 mt-4 flex-wrap',
          isFullscreen && 'absolute bottom-6 left-0 right-0'
        )}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={currentSpread === 0 || isFlipping}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>

        <span className={cn('text-sm font-medium px-3', isFullscreen ? 'text-white' : 'text-gray-600')}>
          Page {displayedPageNum} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={goNext}
          disabled={isLastSpread || isFlipping}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 ml-2">
          <Button variant="ghost" size="sm" onClick={zoomOut} className="h-8 w-8 p-0">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className={cn('text-xs w-10 text-center', isFullscreen ? 'text-white' : 'text-gray-500')}>
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={zoomIn} className="h-8 w-8 p-0">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 w-8 p-0 ml-1">
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Fullscreen close hint */}
      {isFullscreen && (
        <p className="absolute top-4 right-4 text-white/50 text-xs">
          Press ESC to exit fullscreen
        </p>
      )}
    </div>
  );
}
