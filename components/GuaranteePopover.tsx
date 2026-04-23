'use client';

import { useState } from 'react';
import { Shield, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type GuaranteePopoverProps = {
  /** Element that triggers the popover on hover */
  children: React.ReactNode;
  className?: string;
};

/**
 * Guarantee hover popup — shows the refund guarantee text
 * when hovering over checkmark icons or guarantee mentions.
 */
export function GuaranteePopover({ children, className }: GuaranteePopoverProps) {
  const [show, setShow] = useState(false);

  return (
    <span
      className={cn('relative inline-flex items-center', className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {/* Popover */}
      <div
        className={cn(
          'absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 transition-all duration-200',
          show
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-1 pointer-events-none'
        )}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-5">
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 -translate-y-1.5" />
          </div>

          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">
              14-Day Ready or Refund Guarantee
            </h4>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            If you do not feel significantly more organized and confident after using the Kit, request a full refund within 14 days. No questions asked.
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              14-day guarantee
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              Full refund
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              No questions
            </span>
          </div>
        </div>
      </div>
    </span>
  );
}
