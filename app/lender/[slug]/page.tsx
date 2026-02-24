'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  PartnerProfilePage,
  type PartnerProfile,
} from '@/components/partner/PartnerProfilePage';

export default function LenderPage() {
  const params = useParams();
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (params.slug) {
        await fetchPartner(params.slug as string);
      }
    })();
  }, [params.slug]);

  const fetchPartner = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('partner_profiles')
        .select('*')
        .eq('slug', slug)
        .eq('partner_type', 'lender')
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        router.push('/preferred-lenders');
        return;
      }

      setPartner(data as PartnerProfile);
    } catch (err) {
      console.error('Error fetching lender:', err);
      router.push('/preferred-lenders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading lender profile...</p>
        </div>
      </div>
    );
  }

  if (!partner) return null;

  return <PartnerProfilePage partner={partner} />;
}
