'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Loader2,
  Phone,
  ChevronRight,
  Home,
  Building2,
  Plus,
  Trash2,
  Save,
  ChevronDown,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Status definitions                                                   */
/* ------------------------------------------------------------------ */

const DEAL_STATUSES = [
  { value: 'preparing_materials', label: 'Preparing Materials' },
  { value: 'lenders_identified', label: 'Lenders Identified' },
  { value: 'submitted_to_lenders', label: 'Submitted to Lenders' },
  { value: 'closed', label: 'Closed' },
];

const LENDER_STATUSES = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'declined', label: 'Declined' },
  { value: 'closing', label: 'Closing' },
  { value: 'closed', label: 'Closed' },
];

const STATUS_BADGE_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  declined: 'bg-red-100 text-red-800',
  closing: 'bg-purple-100 text-purple-800',
  closed: 'bg-green-100 text-green-800',
};

type LenderRow = {
  id: string;
  lender_name: string;
  contact_name: string;
  phone: string;
  email: string;
  status: string;
  created_at: string;
};

type DealInfo = {
  id: string;
  name: string;
  outreach_status: string;
  created_at: string;
};

export default function DealOutreachPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const dealId = params.dealId as string;

  const [deal, setDeal] = useState<DealInfo | null>(null);
  const [lenders, setLenders] = useState<LenderRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const getToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchDeal = useCallback(async () => {
    if (!user) return;
    const token = await getToken();
    if (!token) return;

    try {
      const res = await fetch(`/api/lender-outreach?dealId=${dealId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDeal(data.deal);
        setLenders(data.lenders ?? []);
      } else if (res.status === 404) {
        router.push('/dashboard/lender-outreach');
      }
    } catch (err) {
      console.error('Error fetching deal:', err);
    }
    setFetching(false);
  }, [user, dealId, router]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  /* ---- Update deal outreach status ---- */
  const handleStatusChange = async (newStatus: string) => {
    if (!deal) return;
    setSaving('deal-status');
    try {
      const token = await getToken();
      await fetch('/api/lender-outreach', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ dealId: deal.id, outreachStatus: newStatus }),
      });
      setDeal((d) => (d ? { ...d, outreach_status: newStatus } : d));
    } catch (err) {
      console.error('Error updating status:', err);
    }
    setSaving(null);
  };

  /* ---- Add lender row ---- */
  const handleAddLender = async () => {
    if (!deal) return;
    setAdding(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/lender-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ dealId: deal.id, lenderName: '', contactName: '', phone: '', email: '' }),
      });
      if (res.ok) {
        const data = await res.json();
        setLenders((prev) => [...prev, data.lender]);
      }
    } catch (err) {
      console.error('Error adding lender:', err);
    }
    setAdding(false);
  };

  /* ---- Update a lender field ---- */
  const handleLenderUpdate = async (lenderId: string, field: string, value: string) => {
    // Optimistic update
    setLenders((prev) =>
      prev.map((l) => (l.id === lenderId ? { ...l, [field]: value } : l))
    );
  };

  const handleLenderSave = async (lenderId: string) => {
    const lender = lenders.find((l) => l.id === lenderId);
    if (!lender) return;
    setSaving(lenderId);

    try {
      const token = await getToken();
      await fetch('/api/lender-outreach', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          lenderId,
          lenderName: lender.lender_name,
          contactName: lender.contact_name,
          phone: lender.phone,
          email: lender.email,
          status: lender.status,
        }),
      });
    } catch (err) {
      console.error('Error saving lender:', err);
    }
    setSaving(null);
  };

  /* ---- Delete a lender row ---- */
  const handleDeleteLender = async (lenderId: string) => {
    setDeleting(lenderId);
    try {
      const token = await getToken();
      await fetch(`/api/lender-outreach?id=${lenderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setLenders((prev) => prev.filter((l) => l.id !== lenderId));
    } catch (err) {
      console.error('Error deleting lender:', err);
    }
    setDeleting(null);
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-500">Deal not found.</p>
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
            <Link href="/dashboard/lender-outreach" className="hover:text-primary">
              Lender Outreach
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{deal.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
                <p className="text-sm text-gray-500">
                  Outreach tracker &middot; Created {new Date(deal.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Overall status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Overall Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 flex-wrap">
              {DEAL_STATUSES.map((s) => {
                const isActive = deal.outreach_status === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => handleStatusChange(s.value)}
                    disabled={saving === 'deal-status'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                      isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 bg-white text-gray-600 hover:border-primary/30 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
              {saving === 'deal-status' && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
            </div>
            {/* Progress bar */}
            <div className="mt-4 flex gap-1">
              {DEAL_STATUSES.map((s, i) => {
                const currentIdx = DEAL_STATUSES.findIndex(
                  (x) => x.value === deal.outreach_status
                );
                return (
                  <div
                    key={s.value}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      i <= currentIdx ? 'bg-primary' : 'bg-slate-200'
                    }`}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Potential Lenders table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-900">
                Potential Lenders
              </CardTitle>
              <Button
                size="sm"
                onClick={handleAddLender}
                disabled={adding}
                className="gap-1.5"
              >
                {adding ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                Add Lender
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {lenders.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <Phone className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-3">
                  No lenders added yet. Start tracking your outreach.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddLender}
                  disabled={adding}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Your First Lender
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 pr-3 font-medium text-gray-500 min-w-[140px]">Lender Name</th>
                      <th className="pb-2 pr-3 font-medium text-gray-500 min-w-[130px]">Contact Name</th>
                      <th className="pb-2 pr-3 font-medium text-gray-500 min-w-[120px]">Phone</th>
                      <th className="pb-2 pr-3 font-medium text-gray-500 min-w-[150px]">Email</th>
                      <th className="pb-2 pr-3 font-medium text-gray-500 min-w-[130px]">Status</th>
                      <th className="pb-2 font-medium text-gray-500 w-[80px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {lenders.map((lender) => (
                      <tr key={lender.id} className="group">
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={lender.lender_name}
                            onChange={(e) =>
                              handleLenderUpdate(lender.id, 'lender_name', e.target.value)
                            }
                            onBlur={() => handleLenderSave(lender.id)}
                            placeholder="Bank name..."
                            className="w-full border border-transparent hover:border-slate-300 focus:border-primary rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="text"
                            value={lender.contact_name}
                            onChange={(e) =>
                              handleLenderUpdate(lender.id, 'contact_name', e.target.value)
                            }
                            onBlur={() => handleLenderSave(lender.id)}
                            placeholder="Contact..."
                            className="w-full border border-transparent hover:border-slate-300 focus:border-primary rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="tel"
                            value={lender.phone}
                            onChange={(e) =>
                              handleLenderUpdate(lender.id, 'phone', e.target.value)
                            }
                            onBlur={() => handleLenderSave(lender.id)}
                            placeholder="(555) 123-4567"
                            className="w-full border border-transparent hover:border-slate-300 focus:border-primary rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="email"
                            value={lender.email}
                            onChange={(e) =>
                              handleLenderUpdate(lender.id, 'email', e.target.value)
                            }
                            onBlur={() => handleLenderSave(lender.id)}
                            placeholder="email@bank.com"
                            className="w-full border border-transparent hover:border-slate-300 focus:border-primary rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <select
                            value={lender.status}
                            onChange={(e) => {
                              handleLenderUpdate(lender.id, 'status', e.target.value);
                              // Auto-save status changes
                              setTimeout(() => handleLenderSave(lender.id), 100);
                            }}
                            className={`w-full border rounded px-2 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 ${
                              STATUS_BADGE_COLORS[lender.status] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {LENDER_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-1">
                            {saving === lender.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                              <button
                                onClick={() => handleLenderSave(lender.id)}
                                className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                                title="Save"
                              >
                                <Save className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteLender(lender.id)}
                              disabled={deleting === lender.id}
                              className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              {deleting === lender.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
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
    </div>
  );
}
