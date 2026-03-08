'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Loader2,
  Phone,
  ChevronRight,
  Home,
  Building2,
  ArrowLeft,
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  success_kit: 'Success Kit',
  certified_borrower: 'Certified Borrower',
  deal_room_ready: 'Deal Room Ready',
  lenders_identified: 'Lenders Identified',
  submitted_to_lenders: 'Submitted to Lenders',
  in_underwriting: 'In Underwriting',
  closed: 'Closed',
};

const STATUS_COLORS: Record<string, string> = {
  success_kit: 'bg-gray-100 text-gray-800 border-gray-200',
  certified_borrower: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  deal_room_ready: 'bg-blue-100 text-blue-800 border-blue-200',
  lenders_identified: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  submitted_to_lenders: 'bg-purple-100 text-purple-800 border-purple-200',
  in_underwriting: 'bg-orange-100 text-orange-800 border-orange-200',
  closed: 'bg-green-100 text-green-800 border-green-200',
};

type Deal = {
  id: string;
  name: string;
  outreach_status: string;
  created_at: string;
};

export default function LenderOutreachPage() {
  const { user, loading, isCertifiedBorrower, isKitBuyer, isAdmin } = useAuth();
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const hasAccess = isCertifiedBorrower || isKitBuyer || isAdmin;

  const fetchDeals = useCallback(async () => {
    if (!user) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    try {
      const res = await fetch('/api/lender-outreach', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDeals(data.deals ?? []);
      }
    } catch (err) {
      console.error('Error fetching deals:', err);
    }
    setFetching(false);
  }, [user]);

  useEffect(() => {
    if (hasAccess) fetchDeals();
    else setFetching(false);
  }, [hasAccess, fetchDeals]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Lender Outreach</h2>
            <p className="text-gray-600 mb-4">
              Track your lender outreach across all deals. Available with the Success Kit or Certified Borrower membership.
            </p>
            <Button asChild>
              <Link href="/membership">View Membership Options</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/dashboard" className="hover:text-primary flex items-center gap-1">
              <Home className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium">Lender Outreach</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lender Outreach</h1>
              <p className="text-sm text-gray-500">
                Track your lender outreach for each deal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deal list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {deals.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deals Yet</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
                Create a deal in your Deal Room first. Your deals will automatically appear here for lender outreach tracking.
              </p>
              <Button asChild>
                <Link href="/dashboard/deal-room">Go to Deal Room</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                href={`/dashboard/lender-outreach/${deal.id}`}
                className="block"
              >
                <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{deal.name}</h3>
                          <p className="text-xs text-gray-500">
                            Created {new Date(deal.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`text-xs ${STATUS_COLORS[deal.outreach_status] || STATUS_COLORS.success_kit}`}
                        >
                          {STATUS_LABELS[deal.outreach_status] || 'Success Kit'}
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
