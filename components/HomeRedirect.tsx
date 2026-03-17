'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Redirects logged-in users (kit buyers, certified borrowers) from the
 * public home page to their personalized dashboard.
 */
export function HomeRedirect() {
  const { user, loading, isKitBuyer, isCertifiedBorrower } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && (isKitBuyer || isCertifiedBorrower)) {
      router.replace('/dashboard');
    }
  }, [user, loading, isKitBuyer, isCertifiedBorrower, router]);

  return null;
}
