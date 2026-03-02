'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AssistantDialog } from '@/components/assistant/AssistantDialog';
import {
  BookOpen,
  Video,
  Award,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Bot,
  FileText,
  DollarSign,
  BarChart3,
  Phone,
  Compass,
  Handshake,
  Building2,
  Lock,
  Shield,
  Sparkles,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Order = {
  id: string;
  product_id: string;
  amount: number;
  status: string;
  created_at: string;
  products: {
    name: string;
    type: string;
  };
};

type Submission = {
  id: string;
  summary_text: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const { user, loading, isCertifiedBorrower, isKitBuyer, isAdmin, fullName } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      if (user) {
        await fetchOrders();
        await fetchRecentContent();
        await fetchSubmissions();
      }
    })();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, products(name, type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchRecentContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) {
        console.warn('Content table not available yet:', error.message);
        setRecentContent([]);
        return;
      }
      setRecentContent(data || []);
    } catch (error) {
      setRecentContent([]);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const response = await fetch('/api/submissions', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error('Failed to load submissions');
      const data = (await response.json()) as { submissions?: Submission[] };
      setSubmissions(data.submissions ?? []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-primary/90">Loading...</p>
      </div>
    );
  }

  const displayName = fullName || user.email?.split('@')[0] || 'there';

  /* ── Kit buyer: first 4 PrepCoach tasks ─────────────────────────── */
  const kitPrepCoachTasks = [
    { icon: FileText, label: 'Executive Summary', href: '/prepcoach#executive-summary' },
    { icon: Phone, label: 'Lender Scripts', href: '/prepcoach#lender-scripts' },
    { icon: BarChart3, label: 'Calculate DSCR', href: '/prepcoach#dscr-calculator' },
    { icon: DollarSign, label: 'Financial Statement', href: '/prepcoach#personal-financial-statement' },
  ];

  /* ── Certified borrower: all PrepCoach tasks ────────────────────── */
  const fullPrepCoachTasks = [
    ...kitPrepCoachTasks,
    { icon: Compass, label: 'General Onboarding', href: '/prepcoach#onboarding' },
  ];

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* ── Header ───────────────────────────────────────────────── */}
      <section className="bg-white border-b py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {displayName}!
            </h1>
            {isCertifiedBorrower && (
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                <Shield className="h-3 w-3" />
                Certified Borrower
              </Badge>
            )}
            {isAdmin && (
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
          <p className="text-primary/90 mt-2">
            {isCertifiedBorrower
              ? 'Your full K2 dashboard — partner network, PrepCoach, and deal room.'
              : 'Here\'s an overview of your learning journey'}
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Status cards ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary/90 mb-1">Status</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isCertifiedBorrower ? 'Certified' : isAdmin ? 'Admin' : 'Kit Owner'}
                    </p>
                  </div>
                  <Award className="h-12 w-12 text-primary/90" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary/90 mb-1">Purchases</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {orders.length}
                    </p>
                  </div>
                  <ShoppingBag className="h-12 w-12 text-primary/90" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary/90 mb-1">Resources</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isCertifiedBorrower ? 'Full Access' : 'Limited'}
                    </p>
                  </div>
                  <BookOpen className="h-12 w-12 text-primary/90" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary/90 mb-1">Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isCertifiedBorrower ? 'Active' : 'Getting Started'}
                    </p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-primary/90" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* ── Kit buyer upgrade CTA ─────────────────────────── */}
              {isKitBuyer && (
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full" />
                  <CardContent className="p-8 relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                        Upgrade Available
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">
                      Become a K2 Certified Borrower
                    </h2>
                    <p className="text-slate-300 mb-2 max-w-lg">
                      As a kit owner, you have access to our core templates. Upgrade to unlock:
                    </p>
                    <ul className="text-slate-300 text-sm space-y-1.5 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        Full K2 Partner Network (100+ lenders & vendors)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        All PrepCoach templates & AI coaching
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        Private Deal Room for document submissions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        Certified Borrower badge & priority support
                      </li>
                    </ul>
                    <Button variant="secondary" size="lg" asChild>
                      <Link href="/membership/certified-borrower">
                        Enroll Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* ── Download Kit (kit buyers only) ───────────────── */}
              {isKitBuyer && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Download Your Success Kit</h3>
                        <p className="text-sm text-gray-600">Access your purchased kit materials</p>
                      </div>
                    </div>
                    <Button size="sm" asChild className="mt-2">
                      <Link href="/workbook">
                        Get Success Kit
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* ── K2 PrepCoach Tasks ────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    K2 PrepCoach Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {isCertifiedBorrower
                      ? 'Select a task to get step-by-step AI coaching for your loan package.'
                      : 'Get started with these core templates. Upgrade to access all PrepCoach tasks.'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(isCertifiedBorrower ? fullPrepCoachTasks : kitPrepCoachTasks).map((task) => (
                      <Button
                        key={task.label}
                        variant="outline"
                        size="sm"
                        asChild
                        className="justify-start gap-2 h-auto py-2.5 text-left"
                      >
                        <Link href={task.href}>
                          <task.icon className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{task.label}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>

                  {isKitBuyer ? (
                    <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <Link href="/prepcoach" className="text-primary hover:underline font-medium">
                            View all templates
                          </Link>
                          {' '}— some require Certified Borrower access
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Button variant="link" size="sm" asChild className="mt-3 px-0">
                      <Link href="/prepcoach">
                        View all PrepCoach templates
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* ── K2 Partner Network ────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="h-5 w-5 text-primary" />
                    K2 Partner Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isCertifiedBorrower ? (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        Browse our vetted preferred lenders and trusted vendors for your
                        commercial real estate needs.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" asChild className="justify-start gap-2 h-auto py-2.5">
                          <Link href="/dashboard/resources?filter=lender">
                            <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Preferred Lenders</span>
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="justify-start gap-2 h-auto py-2.5">
                          <Link href="/dashboard/resources?filter=vendor">
                            <ShoppingBag className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm">Trusted Vendors</span>
                          </Link>
                        </Button>
                      </div>
                      <Button variant="link" size="sm" asChild className="mt-3 px-0">
                        <Link href="/dashboard/resources">
                          View all partners
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Lock className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-3">
                        Access our network of 100+ preferred lenders and trusted vendors
                        when you become a Certified Borrower.
                      </p>
                      <Button size="sm" asChild>
                        <Link href="/membership/certified-borrower">
                          Upgrade to Access
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ── Recent Content ────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentContent.length === 0 ? (
                    <p className="text-primary/90">No content available yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {recentContent.map((item) => (
                        <Link
                          key={item.id}
                          href={`/content/${item.slug}`}
                          className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="w-20 h-20 bg-slate-200 rounded flex items-center justify-center flex-shrink-0">
                            <Video className="h-8 w-8 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/content">View All Content</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* ── Loan Package Submissions / Deal Room ──────────── */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Loan Package Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isCertifiedBorrower ? (
                    <>
                      {submissions.length === 0 ? (
                        <div className="space-y-4">
                          <p className="text-primary/90">
                            No submissions yet. Start your first guided loan package intake.
                          </p>
                          <AssistantDialog
                            triggerLabel="Open PrepCoach"
                            triggerVariant="default"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {submissions.slice(0, 5).map((submission) => (
                            <div
                              key={submission.id}
                              className="rounded-lg border p-3 text-sm"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-gray-900">
                                  {submission.summary_text ? 'Summary Generated' : 'Intake Saved'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(submission.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                {submission.summary_text ?? 'Summary not generated yet. Open assistant to continue.'}
                              </p>
                            </div>
                          ))}
                          <AssistantDialog
                            triggerLabel="Start New Package"
                            triggerVariant="outline"
                            triggerClassName="w-full"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Lock className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1 font-medium">
                        Upload Documents to Your Private Deal Room
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        Certified Borrowers can submit loan packages directly to their private deal room.
                      </p>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/membership/certified-borrower">
                          Upgrade to Access
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── Sidebar ────────────────────────────────────────── */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isCertifiedBorrower && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/resources">
                        <Handshake className="mr-2 h-4 w-4" />
                        Partner Network
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/content">Browse Content</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/prepcoach">
                      <Bot className="mr-2 h-4 w-4" />
                      PrepCoach Templates
                    </Link>
                  </Button>
                  {isKitBuyer && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/workbook">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Get Success Kit
                      </Link>
                    </Button>
                  )}
                  {isCertifiedBorrower && (
                    <AssistantDialog
                      triggerLabel="PrepCoach"
                      triggerVariant="outline"
                      triggerClassName="w-full"
                    />
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {orders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Purchases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="text-sm pb-3 border-b last:border-0"
                        >
                          <p className="font-semibold text-gray-900">
                            {order.products.name}
                          </p>
                          <p className="text-gray-600">
                            ${(order.amount / 100).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upgrade nudge for kit buyers in sidebar */}
              {isKitBuyer && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Ready to Level Up?
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Join our Certified Borrower program for full partner access,
                      deal room, and priority support.
                    </p>
                    <Button size="sm" className="w-full" asChild>
                      <Link href="/membership/certified-borrower">
                        Enroll Now
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
