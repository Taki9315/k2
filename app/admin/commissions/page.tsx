'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Commission = {
  id: string;
  partner_id: string;
  buyer_id: string;
  product: string;
  referral_code: string;
  commission_amount: number;
  status: 'pending' | 'paid';
  paid_at: string | null;
  created_at: string;
  partner_name: string;
  partner_company: string;
  buyer_name: string;
};

type Summary = {
  totalPending: number;
  totalPaid: number;
  count: number;
};

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalPending: 0, totalPaid: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCommissions = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    const res = await fetch('/api/admin/commissions', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCommissions(data.commissions);
      setSummary(data.summary);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const markPaid = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    const res = await fetch('/api/admin/commissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ id, action: 'mark_paid' }),
    });
    if (res.ok) {
      fetchCommissions();
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading commissions…</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue Sharing</h1>
        <p className="text-sm text-gray-500 mt-1">
          Partner referral commissions — $5 per kit, $50 per certified borrower
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(summary.totalPending / 100).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid Out</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(summary.totalPaid / 100).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900">{summary.count}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commissions table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            All Commissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <p className="text-gray-500 text-sm">No referral commissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4">Partner</th>
                    <th className="pb-3 pr-4">Buyer</th>
                    <th className="pb-3 pr-4">Product</th>
                    <th className="pb-3 pr-4">Commission</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-gray-900">{c.partner_name}</p>
                        {c.partner_company && (
                          <p className="text-xs text-gray-500">{c.partner_company}</p>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">{c.buyer_name}</td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className="capitalize">
                          {c.product}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-gray-900">
                        ${(c.commission_amount / 100).toFixed(2)}
                      </td>
                      <td className="py-3 pr-4">
                        {c.status === 'paid' ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-500">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {c.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markPaid(c.id)}
                          >
                            Mark Paid
                          </Button>
                        )}
                        {c.status === 'paid' && c.paid_at && (
                          <span className="text-xs text-gray-500">
                            {new Date(c.paid_at).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
