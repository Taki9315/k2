'use client';

import Image from 'next/image';
import { Shield } from 'lucide-react';

const BORROWER_BADGE_IMG = '/assets/Borrower_Logo.png';

type CertifiedBorrowerBadgeProps = {
  fullName: string;
  /** 'compact' shows a small inline badge. 'full' shows the certificate card. */
  variant?: 'compact' | 'full';
  /** K2 membership number, e.g. "K2-1001" */
  membershipNumber?: string | null;
};

export function CertifiedBorrowerBadge({
  fullName,
  variant = 'full',
  membershipNumber,
}: CertifiedBorrowerBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className="inline-flex flex-col items-center gap-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary border border-primary/20">
          <Image src={BORROWER_BADGE_IMG} alt="Certified Borrower" width={20} height={20} className="h-5 w-5 object-contain" />
          K2 Certified Borrower
        </div>
        {membershipNumber && (
          <span className="text-[11px] font-mono text-primary/70 tracking-wide">
            {fullName}, {membershipNumber}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-white via-primary/5 to-primary/10 p-6 sm:p-8 shadow-lg max-w-md mx-auto">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-tr-full" />

      <div className="relative text-center space-y-4">
        {/* Badge Image */}
        <div className="inline-flex items-center justify-center">
          <Image
            src={BORROWER_BADGE_IMG}
            alt="K2 Certified Borrower Badge"
            width={100}
            height={100}
            className="h-24 w-24 object-contain"
          />
        </div>

        {/* Title */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">
            K2 Commercial Finance
          </p>
          <h3 className="text-lg font-bold text-gray-900">
            Certified Borrower
          </h3>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 px-4">
          <div className="flex-1 h-px bg-primary/20" />
          <Shield className="h-4 w-4 text-primary/40" />
          <div className="flex-1 h-px bg-primary/20" />
        </div>

        {/* Name */}
        <div>
          <p className="text-2xl font-bold text-gray-900 tracking-wide">
            {fullName}
          </p>
          {membershipNumber ? (
            <p className="text-sm font-mono font-semibold text-primary mt-1">
              {membershipNumber}
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              Verified &amp; Prepared Borrower
            </p>
          )}
        </div>

        {/* Status badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </div>
      </div>
    </div>
  );
}
