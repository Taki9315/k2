'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Link2,
  Copy,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  ExternalLink,
  BarChart3,
  Sparkles,
  Lock,
} from 'lucide-react';

type ReferralStats = {
  totalClicks: number;
  totalKitSales: number;
  totalCertifiedSales: number;
  totalCommission: number;
  pendingCommission: number;
};

export default function AffiliateDashboardPage() {
  const { user, loading, isPartner, isCertifiedBorrower, isAdmin, profile } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<ReferralStats>({
    totalClicks: 0,
    totalKitSales: 0,
    totalCertifiedSales: 0,
    totalCommission: 0,
    pendingCommission: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const hasAccess = isPartner || isAdmin;

  const referralCode = profile?.referral_code || '';
  const referralLink = referralCode
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${referralCode}`
    : '';

  const fetchStats = useCallback(async () => {
    if (!user || !hasAccess) {
      setLoadingStats(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const res = await fetch('/api/affiliate/stats', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching affiliate stats:', err);
    }
    setLoadingStats(false);
  }, [user, hasAccess]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <Lock className="h-16 w-16 text-slate-300" />
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Affiliate / Reseller Portal
          </h1>
          <p className="text-gray-600 mb-6">
            This portal is for K2 Preferred Partners. If you&apos;re interested
            in becoming a reseller or affiliate partner, contact us.
          </p>
          <Button asChild>
            <Link href="/partnership">Learn About Partnership</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Affiliate & Reseller Portal
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                  <Sparkles className="h-3 w-3" />
                  Partner
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Track referrals, commissions, and manage your unique referral link.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Referral Link Card */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              Your Referral Link
            </h3>
            {referralCode ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-gray-700 font-mono pr-24"
                  />
                  <Button
                    size="sm"
                    variant={copied ? 'default' : 'outline'}
                    onClick={handleCopy}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 gap-1.5"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No referral code assigned yet. Contact K2 admin to get your code.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-3">
              Share this link with potential borrowers. When they purchase a
              Success Kit or Certified Borrower membership through your link,
              you earn a commission.
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Link Clicks',
              value: stats.totalClicks,
              icon: ExternalLink,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              label: 'Kit Sales',
              value: stats.totalKitSales,
              icon: ShoppingBag,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              label: 'Certified Sales',
              value: stats.totalCertifiedSales,
              icon: Users,
              color: 'text-purple-600 bg-purple-50',
            },
            {
              label: 'Total Commission',
              value: `$${stats.totalCommission.toFixed(2)}`,
              icon: DollarSign,
              color: 'text-primary bg-primary/10',
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Commission Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Commission Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-gray-600">Success Kit ($15)</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    30% = $4.50
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-gray-600">Certified Borrower ($250)</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    20% = $49.80
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Payout schedule</span>
                  <span className="text-sm font-medium text-gray-900">Monthly (Net-30)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Pending Payouts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center py-6">
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.pendingCommission.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Pending for next payout cycle
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Branded PDF info */}
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Branded Kit Reselling — Coming Soon
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Soon you&apos;ll be able to sell co-branded Success Kits with your
              logo and a custom &ldquo;Brought to you by [Your Company]&rdquo;
              cover page. Stay tuned for this feature.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
