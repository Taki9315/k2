'use client';

import Image from 'next/image';
import { Shield } from 'lucide-react';

const BADGE_IMAGES = {
  lender: '/assets/Lender_Logo.png',
  vendor: '/assets/Vendor_Logo.png',
} as const;

type PreferredPartnerBadgeProps = {
  partnerType: 'lender' | 'vendor';
  companyName: string;
  /** 'compact' for inline badge, 'full' for display card */
  variant?: 'compact' | 'full';
};

export function PreferredPartnerBadge({
  partnerType,
  companyName,
  variant = 'full',
}: PreferredPartnerBadgeProps) {
  const isLender = partnerType === 'lender';
  const label = isLender ? 'Preferred Lender' : 'Preferred Vendor';
  const badgeImg = BADGE_IMAGES[partnerType];

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary border border-primary/20">
        <Image src={badgeImg} alt={label} width={20} height={20} className="h-5 w-5 object-contain" />
        K2 {label}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-white via-primary/5 to-primary/10 p-6 shadow-lg max-w-sm">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full" />

      <div className="relative text-center space-y-3">
        <div className="inline-flex items-center justify-center">
          <Image
            src={badgeImg}
            alt={`K2 ${label} Badge`}
            width={100}
            height={100}
            className="h-20 w-20 object-contain"
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1">
            K2 Commercial Finance
          </p>
          <h3 className="text-lg font-bold text-gray-900">{label}</h3>
        </div>

        <div className="flex items-center gap-3 px-4">
          <div className="flex-1 h-px bg-primary/20" />
          <Shield className="h-3 w-3 text-primary/40" />
          <div className="flex-1 h-px bg-primary/20" />
        </div>

        <p className="text-lg font-bold text-gray-900">{companyName}</p>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Verified Partner
        </div>
      </div>
    </div>
  );
}
