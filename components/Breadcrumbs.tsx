'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

/** Map slug segments to readable labels */
const LABEL_MAP: Record<string, string> = {
  about: 'About',
  admin: 'Admin',
  calculator: 'Calculator',
  contact: 'Contact',
  content: 'Free Content',
  dashboard: 'Dashboard',
  disclaimer: 'Disclaimer',
  login: 'Sign In',
  signup: 'Sign Up',
  membership: 'Membership',
  partnership: 'Partnership',
  'preferred-lenders': 'Preferred Lenders',
  prepcoach: 'PrepCoach',
  privacy: 'Privacy',
  profile: 'Profile',
  terms: 'Terms',
  workbook: 'Success Kit',
  resources: 'Resources',
  'forgot-password': 'Forgot Password',
  'reset-password': 'Reset Password',
  'certified-borrower': 'Certified Borrower',
  'preferred-lender': 'Preferred Lender',
  'preferred-vendor': 'Preferred Vendor',
  'lender-network': 'Lender Network',
  'vendor-network': 'Vendor Network',
  'k2-preferred-lender': 'K2 Preferred Lender',
  analytics: 'Analytics',
  'business-requests': 'Business Requests',
  chat: 'Chat',
  documents: 'Documents',
  meetings: 'Meetings',
  partners: 'Partners',
  payments: 'Payments',
  providers: 'Providers',
  settings: 'Settings',
  submissions: 'Submissions',
  users: 'Users',
  booking: 'Booking',
  'deal-room': 'Deal Room',
  Resource: 'Resource',
};

function formatSegment(segment: string): string {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  // Capitalise and replace hyphens
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page
  if (!pathname || pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  // Skip dynamic segments that look like UUIDs or slugs we can't map
  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    return { label: formatSegment(seg), href };
  });

  return (
    <div className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center h-10 text-sm text-gray-500 overflow-x-auto">
          <Link
            href="/"
            className="flex items-center hover:text-primary transition-colors flex-shrink-0"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
          {crumbs.map((crumb, idx) => (
            <span key={crumb.href} className="flex items-center flex-shrink-0">
              <ChevronRight className="h-3.5 w-3.5 mx-2 text-gray-400" />
              {idx === crumbs.length - 1 ? (
                <span className="font-medium text-gray-900 truncate max-w-[200px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-primary transition-colors truncate max-w-[200px]"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
