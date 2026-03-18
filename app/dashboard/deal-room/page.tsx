'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Plus,
  Loader2,
  FolderOpen,
  ArrowLeft,
  Shield,
  Lock,
  Trash2,
  FileText,
  ChevronRight,
  Home,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

type Deal = {
  id: string;
  name: string;
  hasPassword: boolean;
  fileCount: number;
  created_at: string;
  updated_at: string;
};

export default function DealRoomPage() {
  const { user, loading, isCertifiedBorrower, isKitBuyer, isAdmin, fullName, membershipNumber } = useAuth();
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [fetching, setFetching] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showNewDealInput, setShowNewDealInput] = useState(false);
  const [newDealName, setNewDealName] = useState('');
  const [newDealPassword, setNewDealPassword] = useState('');
  const [showNewDealPassword, setShowNewDealPassword] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

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
      const res = await fetch('/api/deal-room/deals', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDeals(data.deals);
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

  const handleCreateDeal = async () => {
    const name = newDealName.trim();
    const password = newDealPassword.trim();
    if (!name) return;
    if (!password) {
      alert('A password is required to protect your deal room.');
      return;
    }

    setCreating(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await fetch('/api/deal-room/deals', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      if (res.ok) {
        const data = await res.json();
        toast({
          title: '\u2705 Deal Created Successfully',
          description: `"${name}" is ready. Start uploading documents.`,
        });
        router.push(`/dashboard/deal-room/${data.deal.id}`);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create deal');
      }
    } catch (err) {
      console.error('Create deal error:', err);
      alert('Failed to create deal. Please try again.');
    }
    setCreating(false);
  };

  const handleDeleteDeal = async (dealId: string, dealName: string) => {
    if (!confirm(`Delete "${dealName}" and all its files? This cannot be undone.`)) return;

    setDeletingId(dealId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await fetch(`/api/deal-room/deals?dealId=${dealId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        setDeals((prev) => prev.filter((d) => d.id !== dealId));
      }
    } catch (err) {
      console.error('Delete deal error:', err);
    }
    setDeletingId(null);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal Room</h1>
          <p className="text-gray-600 mb-6">
            The Deal Room is available to paid members. Upload your loan documents, organize by
            category, and prepare for lender submission.
          </p>
          <Button asChild>
            <Link href="/workbook">Get the Success Kit</Link>
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
                <h1 className="text-2xl font-bold text-gray-900">Deal Room</h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                  <Shield className="h-3 w-3" />
                  Secure
                </Badge>
              </div>
              <p className="text-base font-semibold text-primary mt-1">
                Manage your deals and loan packages. Each deal has its own secure document room.
              </p>
              {/* Certified Borrower / Kit Buyer badge + name */}
              {fullName && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary border border-primary/20">
                  <Image src="/assets/Borrower_Logo.png" alt="Badge" width={20} height={20} className="h-5 w-5 object-contain" />
                  {isCertifiedBorrower ? 'K2 Certified Borrower' : 'Kit Buyer'}
                  <span className="mx-1 text-primary/30">|</span>
                  <span className="font-medium text-primary/80">{fullName}</span>
                  {isCertifiedBorrower && membershipNumber && (
                    <span className="text-xs font-mono text-primary/60 ml-1">({membershipNumber})</span>
                  )}
                </div>
              )}
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setShowNewDealInput(true);
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
            >
              <Plus className="h-4 w-4" />
              Add New Deal
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
        {/* Add New Deal Section */}
        {!showNewDealInput ? (
          <Button
            size="lg"
            className="w-full mb-6 gap-2 h-14 text-base"
            onClick={() => setShowNewDealInput(true)}
          >
            <Plus className="h-5 w-5" />
            Add New Deal
          </Button>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-primary flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Deal name (e.g. 123 Elm Street)"
                  value={newDealName}
                  onChange={(e) => setNewDealName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setShowNewDealInput(false);
                      setNewDealName('');
                      setNewDealPassword('');
                    }
                  }}
                  className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div className="relative flex-1">
                  <input
                    type={showNewDealPassword ? 'text' : 'password'}
                    placeholder="Set a password (required)"
                    value={newDealPassword}
                    onChange={(e) => setNewDealPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateDeal();
                      if (e.key === 'Escape') {
                        setShowNewDealInput(false);
                        setNewDealName('');
                        setNewDealPassword('');
                      }
                    }}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewDealPassword(!showNewDealPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewDealPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-end">
                <p className="text-xs text-amber-600 flex items-center gap-1 order-last sm:order-first sm:flex-1">
                  <Lock className="h-3 w-3 flex-shrink-0" />
                  Password is required — viewers must enter it to access shared links.
                </p>
                <div className="flex items-center gap-3 self-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewDealInput(false);
                    setNewDealName('');
                    setNewDealPassword('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateDeal} disabled={creating || !newDealName.trim() || !newDealPassword.trim()}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Deal'}
                </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deals List */}
        {fetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : deals.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No Deals Yet</h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto mb-4">
                Create your first deal to start uploading loan package documents. Each deal gets its
                own document room and shareable link.
              </p>
              {!showNewDealInput && (
                <Button onClick={() => setShowNewDealInput(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Deal
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <Card
                key={deal.id}
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <Link
                      href={`/dashboard/deal-room/${deal.id}`}
                      className="flex-1 flex items-center gap-4 p-4 min-w-0"
                    >
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Home className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{deal.name}</h3>
                          {deal.hasPassword && (
                            <KeyRound className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {deal.fileCount} file{deal.fileCount !== 1 ? 's' : ''}
                          </span>
                          <span className="text-xs text-gray-400">
                            Created {new Date(deal.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                    <div className="pr-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDeal(deal.id, deal.name);
                        }}
                        disabled={deletingId === deal.id}
                      >
                        {deletingId === deal.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
