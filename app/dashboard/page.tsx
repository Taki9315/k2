'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { AssistantDialog } from '@/components/assistant/AssistantDialog';
import { CertifiedBorrowerBadge } from '@/components/CertifiedBorrowerBadge';
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
  Clock,
  ChevronRight,
  Play,
  Calendar,
  User,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

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

type GeneratedDocument = {
  id: string;
  title: string;
  document_type: string;
  content: string;
  task_id: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const { user, loading, isCertifiedBorrower, isKitBuyer, isBasicBorrower, isAdmin, fullName, membershipNumber } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDocument[]>([]);

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
        await fetchGeneratedDocs();
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

  const fetchGeneratedDocs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const response = await fetch('/api/generated-documents', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) return;
      const data = (await response.json()) as { documents?: GeneratedDocument[] };
      setGeneratedDocs(data.documents ?? []);
    } catch (error) {
      console.error('Error fetching generated documents:', error);
    }
  };

  /* ── Time-based greeting ───────────────────────────────────────── */
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-primary/90">Loading...</p>
      </div>
    );
  }

  const displayName = fullName || user.email?.split('@')[0] || 'there';
  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email?.[0] ?? 'U').toUpperCase();

  /* ── Journey steps / progress ──────────────────────────────────── */
  const journeySteps = [
    { label: 'Account Created', done: true },
    { label: 'Success Kit', done: isKitBuyer || isCertifiedBorrower },
    { label: 'Certified Borrower', done: isCertifiedBorrower },
    { label: 'Deal Room Ready', done: isCertifiedBorrower && submissions.length > 0 },
  ];
  const completedSteps = journeySteps.filter((s) => s.done).length;
  const progressPercent = Math.round((completedSteps / journeySteps.length) * 100);

  /* ── PrepCoach tasks ───────────────────────────────────────────── */
  const kitPrepCoachTasks = [
    { icon: FileText, label: 'Executive Summary', href: '/prepcoach#executive-summary', color: 'text-emerald-700 bg-emerald-50' },
    { icon: Phone, label: 'Lender Scripts', href: '/prepcoach#lender-scripts', color: 'text-emerald-700 bg-emerald-50' },
    { icon: BarChart3, label: 'Calculate DSCR', href: '/prepcoach#dscr-calculator', color: 'text-emerald-700 bg-emerald-50' },
    { icon: DollarSign, label: 'Financial Statement', href: '/prepcoach#personal-financial-statement', color: 'text-emerald-700 bg-emerald-50' },
  ];

  const fullPrepCoachTasks = [
    ...kitPrepCoachTasks,
    { icon: Compass, label: 'General Onboarding', href: '/prepcoach#onboarding', color: 'text-emerald-700 bg-emerald-50' },
  ];

  const prepTasks = isCertifiedBorrower ? fullPrepCoachTasks : kitPrepCoachTasks;

  /* ── Quick action cards config ─────────────────────────────────── */
  const quickActions = [
    {
      icon: FileText,
      title: 'Download Documents',
      description: 'Access forms, templates & application docs',
      href: '/dashboard/resources?tab=documents',
      btnLabel: 'View Documents',
      gradient: 'from-emerald-500/10 to-emerald-600/5',
      iconBg: 'bg-emerald-100 text-emerald-700',
      available: true,
    },
    {
      icon: Upload,
      title: 'Deal Room',
      description: 'Upload documents for lender review',
      href: (isCertifiedBorrower || isKitBuyer) ? '/dashboard/deal-room' : '/membership/certified-borrower',
      btnLabel: (isCertifiedBorrower || isKitBuyer) ? 'Open Deal Room' : 'Upgrade to Access',
      gradient: 'from-gray-900/5 to-gray-800/5',
      iconBg: 'bg-gray-100 text-gray-800',
      available: true,
      locked: !(isCertifiedBorrower || isKitBuyer),
    },
    {
      icon: Calendar,
      title: 'Book Appointment',
      description: 'Schedule a transaction review session',
      href: isCertifiedBorrower ? '/dashboard/booking' : '/membership/certified-borrower',
      btnLabel: isCertifiedBorrower ? 'Book Now' : 'Upgrade to Access',
      gradient: 'from-emerald-500/8 to-white',
      iconBg: 'bg-emerald-50 text-emerald-700',
      available: true,
      locked: !isCertifiedBorrower,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">

      {/* ════════════════════════════════════════════════════════════
          HERO HEADER
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/30 ring-4 ring-white/10">
                {initials}
              </div>
            </div>

            {/* Greeting + badges */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {greeting}, {displayName}
                </h1>
              </div>
              <p className="text-slate-400 text-sm md:text-base mb-3">
                {isCertifiedBorrower
                  ? 'Your full K2 platform — partner network, PrepCoach & deal room at your fingertips.'
                  : 'Track your progress, access resources, and prepare for financing success.'}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Always show both tier badges — gray out the missing one */}
                <Badge className={cn(
                  'gap-1',
                  (isKitBuyer || isCertifiedBorrower)
                    ? 'bg-white/10 text-white/90 border-white/20'
                    : 'bg-white/5 text-white/30 border-white/10'
                )}>
                  <BookOpen className="h-3 w-3" />
                  Kit Buyer
                </Badge>
                <Badge className={cn(
                  'gap-1',
                  isCertifiedBorrower
                    ? 'bg-primary/20 text-primary border-primary/30'
                    : 'bg-white/5 text-white/30 border-white/10'
                )}>
                  <Shield className="h-3 w-3" />
                  Certified Borrower
                </Badge>
                {isCertifiedBorrower && membershipNumber && (
                  <Badge className="bg-white/10 text-white/80 border-white/20 gap-1 font-mono text-xs">
                    {membershipNumber}
                  </Badge>
                )}
                {isAdmin && (
                  <Badge className="bg-white/20 text-white/90 border-white/30 gap-1">
                    <Shield className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            {/* Certified badge visual */}
            {isCertifiedBorrower && fullName && (
              <div className="flex-shrink-0 hidden lg:block">
                <CertifiedBorrowerBadge fullName={fullName} membershipNumber={membershipNumber} variant="compact" />
              </div>
            )}
          </div>

          {/* ── Journey progress bar ──────────────────────────── */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white/90">Your Journey</h3>
              <span className="text-xs font-medium text-primary">{progressPercent}% Complete</span>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {journeySteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    step.done
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/40 border border-white/20'
                  }`}>
                    {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                  </div>
                  <span className={`text-xs ${step.done ? 'text-white/90' : 'text-white/40'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════════════════════════════ */}
      <section className="py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Quick Action Cards ─────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href} className="group">
                <Card className={`relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${action.gradient} h-full`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      {action.locked && (
                        <Lock className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {action.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary gap-1">
                      {action.btnLabel}
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* ── Basic borrower welcome banner ──────────────── */}
          {isBasicBorrower && (
            <div className="mb-10 relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-emerald-50/30 to-white p-8 md:p-10 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 mb-4">
                    <Sparkles className="h-3.5 w-3.5" />
                    GET STARTED
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Welcome to K2 Commercial Finance
                  </h2>
                  <p className="text-gray-500 mb-6 max-w-lg">
                    You&apos;re on the path to CRE financing success. Start with our Success Kit to access essential tools, templates, and PrepCoach guidance.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {[
                      'CRE financing templates & scripts',
                      'PrepCoach AI-guided preparation',
                      'DSCR & financial calculators',
                      'Lender communication tools',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30" asChild>
                      <Link href="/workbook">
                        Get the Success Kit — $15
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <span className="text-xs text-gray-400">or</span>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/membership/certified-borrower">
                        Become Certified — $250
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:flex items-center justify-center">
                  <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-primary/10 to-emerald-100 flex items-center justify-center border border-primary/10">
                    <Image
                      src="/assets/Borrower_Logo.png"
                      alt="K2 Borrower"
                      width={120}
                      height={120}
                      className="object-contain opacity-70"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Kit buyer upgrade banner ──────────────────────── */}
          {isKitBuyer && (
            <div className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-px">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
              <div className="relative rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 p-8 md:p-10">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs font-semibold text-primary mb-4">
                      <Sparkles className="h-3.5 w-3.5" />
                      UPGRADE AVAILABLE
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      Become a K2 Certified Borrower
                    </h2>
                    <p className="text-slate-400 mb-6 max-w-lg">
                      Unlock the full power of K2 — partner network, deal room, and AI-guided prep.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {[
                        'Full K2 Partner Network (100+ lenders)',
                        'All PrepCoach AI templates',
                        'Private Deal Room',
                        'Certified Borrower badge & priority support',
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30" asChild>
                        <Link href="/membership/certified-borrower">
                          Enroll Now — $250
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <span className="text-xs text-slate-500">One-time payment</span>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center justify-center">
                    <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-primary/20 to-emerald-500/10 flex items-center justify-center border border-primary/20">
                      <Image
                        src="/assets/Borrower_Logo.png"
                        alt="Certified Borrower"
                        width={120}
                        height={120}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Two-column grid ───────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ──── LEFT COLUMN (2/3) ─────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Download Kit CTA for kit buyers */}
              {isKitBuyer && (
                <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-emerald-50/50 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">Download Your Success Kit</h3>
                        <p className="text-sm text-gray-500">Access your purchased kit materials and templates</p>
                      </div>
                      <Button size="sm" className="flex-shrink-0" asChild>
                        <Link href="/workbook">
                          Download
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ── PrepCoach Tasks ──────────────────────────────── */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-lg">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4.5 w-4.5 text-primary" />
                      </div>
                      PrepCoach Tasks
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild className="text-primary">
                      <Link href="/prepcoach">
                        View All
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <p className="text-sm text-gray-500 mb-4">
                    {isCertifiedBorrower
                      ? 'Select a task to get step-by-step AI coaching for your loan package.'
                      : 'Get started with core templates. Upgrade to unlock all tasks.'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* View All first */}
                    <Link
                      href="/prepcoach"
                      className="group flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 hover:border-primary/40 hover:bg-primary/10 transition-all duration-200"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Bot className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-primary group-hover:text-primary">
                        View All Tasks
                      </span>
                      <ChevronRight className="h-4 w-4 text-primary/50 ml-auto group-hover:translate-x-0.5 transition-all" />
                    </Link>
                    {prepTasks.map((task) => (
                      <Link
                        key={task.label}
                        href={task.href}
                        className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 hover:border-primary/30 hover:bg-slate-50/80 transition-all duration-200"
                      >
                        <div className={`h-10 w-10 rounded-lg ${task.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                          <task.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {task.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                  {isKitBuyer && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-sm text-gray-500">
                      <Lock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      Advanced tasks require{' '}
                      <Link href="/membership/certified-borrower" className="text-primary hover:underline font-medium">
                        Certified Borrower
                      </Link>{' '}
                      access
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ── My Generated Documents ────────────────────────── */}
              {(isKitBuyer || isCertifiedBorrower) && (
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2.5 text-lg">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <FileText className="h-4.5 w-4.5 text-blue-600" />
                        </div>
                        My Documents
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    {generatedDocs.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-8 w-8 text-blue-200" />
                        </div>
                        <p className="text-sm text-gray-500 mb-1 font-medium">No documents yet</p>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto">
                          Use PrepCoach to generate executive summaries, financial statements, and more. Your documents will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {generatedDocs.slice(0, 5).map((doc) => (
                          <div
                            key={doc.id}
                            className="rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
                                <p className="font-medium text-sm text-gray-900 truncate">
                                  {doc.title}
                                </p>
                              </div>
                              <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                                <Clock className="h-3 w-3" />
                                {new Date(doc.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="ml-4 flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] capitalize">
                                {doc.document_type.replace(/-/g, ' ')}
                              </Badge>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {doc.content.slice(0, 100)}...
                              </p>
                            </div>
                          </div>
                        ))}
                        {generatedDocs.length > 5 && (
                          <p className="text-xs text-center text-gray-400 pt-1">
                            +{generatedDocs.length - 5} more documents
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* ── K2 Partner Network ────────────────────────────── */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-lg">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Handshake className="h-4.5 w-4.5 text-emerald-600" />
                      </div>
                      K2 Partner Network
                    </CardTitle>
                    {isCertifiedBorrower && (
                      <Button variant="ghost" size="sm" asChild className="text-primary">
                        <Link href="/dashboard/resources">
                          View All
                          <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  {isCertifiedBorrower ? (
                    <>
                      <p className="text-sm text-gray-500 mb-4">
                        Browse vetted lenders and trusted vendors for your CRE needs.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                          href="/dashboard/resources?filter=lender"
                          className="group flex items-center gap-3 rounded-xl border border-slate-100 p-4 hover:border-primary/30 hover:bg-slate-50/80 transition-all"
                        >
                          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <Image src="/assets/Lender_Logo.png" alt="Lenders" width={32} height={32} className="object-contain" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">Preferred Lenders</h4>
                            <p className="text-xs text-gray-500">100+ vetted lenders</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-primary" />
                        </Link>
                        <Link
                          href="/dashboard/resources?filter=vendor"
                          className="group flex items-center gap-3 rounded-xl border border-slate-100 p-4 hover:border-primary/30 hover:bg-slate-50/80 transition-all"
                        >
                          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <Image src="/assets/Vendor_Logo.png" alt="Vendors" width={32} height={32} className="object-contain" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">Trusted Vendors</h4>
                            <p className="text-xs text-gray-500">CRE service providers</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-primary" />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Image src="/assets/Network_Logo.png" alt="Network" width={48} height={48} className="object-contain opacity-50" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1 font-medium">
                        Unlock our partner network
                      </p>
                      <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
                        100+ preferred lenders and trusted vendors await Certified Borrowers.
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
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-lg">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Play className="h-4 w-4 text-emerald-600" />
                      </div>
                      Recent Content
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild className="text-primary">
                      <Link href="/content">
                        View All
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  {recentContent.length === 0 ? (
                    <div className="text-center py-6">
                      <Video className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">No content available yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentContent.map((item) => (
                        <Link
                          key={item.id}
                          href={`/content/${item.slug}`}
                          className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-primary/10 group-hover:to-primary/5 transition-colors">
                            <Video className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm mb-0.5 truncate group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300 flex-shrink-0 group-hover:text-primary" />
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ── Loan Submissions / Deal Room ─────────────────── */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-4">
                  <CardTitle className="flex items-center gap-2.5 text-lg">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Upload className="h-4 w-4 text-emerald-600" />
                    </div>
                    Loan Package Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {isCertifiedBorrower ? (
                    <>
                      {submissions.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-emerald-300" />
                          </div>
                          <p className="text-sm text-gray-500 mb-4">
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
                              className="rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-3 mb-1">
                                <div className="flex items-center gap-2">
                                  <div className={`h-2 w-2 rounded-full ${submission.summary_text ? 'bg-primary' : 'bg-amber-400'}`} />
                                  <p className="font-medium text-sm text-gray-900">
                                    {submission.summary_text ? 'Summary Generated' : 'Intake Saved'}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(submission.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2 ml-4">
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
                    <div className="text-center py-8">
                      <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-7 w-7 text-slate-300" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1 font-medium">
                        Private Deal Room
                      </p>
                      <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
                        Upload documents to your private deal room as a Certified Borrower.
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

            {/* ──── RIGHT SIDEBAR (1/3) ───────────────────────── */}
            <div className="space-y-6">

              {/* Profile card */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="h-16 bg-gradient-to-r from-primary/80 to-emerald-400/80" />
                <CardContent className="p-5 -mt-8">
                  <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center text-lg font-bold text-primary mb-3 border-2 border-white">
                    {initials}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{displayName}</h3>
                  <p className="text-xs text-gray-400 mb-3 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {isCertifiedBorrower && (
                      <Badge className="bg-primary/10 text-primary text-[10px] px-2 py-0.5">Certified</Badge>
                    )}
                    {isCertifiedBorrower && membershipNumber && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-mono">{membershipNumber}</Badge>
                    )}
                    {isKitBuyer && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5">Kit Owner</Badge>
                    )}
                    {isBasicBorrower && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5">Borrower</Badge>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                      <Link href="/profile">
                        <User className="mr-1.5 h-3 w-3" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick links */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-1">
                  {[
                    { icon: BookOpen, label: 'Document Library', href: '/content' },
                    ...(isCertifiedBorrower ? [{ icon: Upload, label: 'Deal Room', href: '/dashboard/deal-room' }] : []),
                    { icon: Bot, label: 'Prep Coach Prompts', href: '/prepcoach' },
                    { icon: BookOpen, label: 'Success Kit', href: '/workbook' },
                    ...(isCertifiedBorrower ? [{ icon: Calendar, label: 'Schedule Call', href: '/dashboard/booking' }] : []),
                    ...(isCertifiedBorrower ? [{ icon: Handshake, label: 'Partner Network', href: '/dashboard/resources' }] : []),
                    ...(isAdmin ? [{ icon: Shield, label: 'Admin Panel', href: '/admin' }] : []),
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-slate-50 hover:text-gray-900 transition-colors"
                    >
                      <link.icon className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      <span className="flex-1">{link.label}</span>
                      <ExternalLink className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                  {isCertifiedBorrower && (
                    <div className="pt-1">
                      <AssistantDialog
                        triggerLabel="Open PrepCoach"
                        triggerVariant="outline"
                        triggerClassName="w-full text-xs"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Purchase history */}
              {orders.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">Your Purchases</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80"
                        >
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {order.products.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            ${(order.amount / 100).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upgrade nudge (sidebar) for kit buyers */}
              {isKitBuyer && (
                <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-emerald-50 overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-sm text-gray-900">Ready to Level Up?</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      Certified Borrowers get full partner access, deal room, and priority support.
                    </p>
                    <Button size="sm" className="w-full" asChild>
                      <Link href="/membership/certified-borrower">
                        Enroll Now — $250
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Upgrade nudge (sidebar) for basic borrowers */}
              {isBasicBorrower && (
                <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-emerald-50 overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-sm text-gray-900">Start Your Journey</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      Get the Success Kit for essential CRE templates, scripts, and financial tools.
                    </p>
                    <Button size="sm" className="w-full" asChild>
                      <Link href="/workbook">
                        Get Success Kit — $15
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                    <div className="mt-3 pt-3 border-t border-primary/10">
                      <Button size="sm" variant="ghost" className="w-full text-xs text-gray-500" asChild>
                        <Link href="/membership/certified-borrower">
                          Or become Certified — $250
                        </Link>
                      </Button>
                    </div>
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
