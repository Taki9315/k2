'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  FileText,
  DollarSign,
  BarChart3,
  Phone,
  Compass,
  ArrowRight,
  Bot,
  Lock,
  Send,
  Loader2,
  Calculator,
  TrendingUp,
  Briefcase,
  Building2,
  Scale,
  Landmark,
  PiggyBank,
  Receipt,
  ClipboardCheck,
  Handshake,
  Target,
  Eye,
  MessageCircle,
  BookOpen,
  Search,
  Award,
  User,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  PROMPT DEFINITIONS                                                  */
/* ------------------------------------------------------------------ */

type PromptCard = {
  id: string;
  taskId: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  color: string;
  availableForKit: boolean;
  buildPrompt: () => string;
};

const PROMPT_CARDS: PromptCard[] = [
  /* ── Kit-Accessible (4 prompts) ── */
  {
    id: 'executive-summary',
    taskId: 'executive-summary',
    title: 'Executive Summary',
    shortDesc: 'Create a lender-ready 1-page summary',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-primary/10 text-primary',
    availableForKit: true,
    buildPrompt: () =>
      'Help me write a compelling 1-page Executive Summary for my commercial loan request. Walk me through structure, key points lenders care about, and output a clean draft.',
  },
  {
    id: 'pfs',
    taskId: 'pfs',
    title: 'Personal Financial Statement',
    shortDesc: 'Build a professional PFS',
    icon: <DollarSign className="h-5 w-5" />,
    color: 'bg-emerald-50 text-emerald-600',
    availableForKit: true,
    buildPrompt: () =>
      'Help me complete a professional Personal Financial Statement (PFS). Guide me through assets, liabilities, net worth, and contingent liabilities section by section.',
  },
  {
    id: 'dscr',
    taskId: 'dscr',
    title: 'DSCR Calculator',
    shortDesc: 'Calculate debt service coverage ratio',
    icon: <Calculator className="h-5 w-5" />,
    color: 'bg-blue-50 text-blue-600',
    availableForKit: true,
    buildPrompt: () =>
      "Walk me through calculating DSCR for my deal. Show the formula, explain what lenders look for (1.20x-1.35x+), and suggest improvements if I'm below target.",
  },
  {
    id: 'document-organizer',
    taskId: 'onboarding',
    title: 'Document Organizer',
    shortDesc: 'What docs do I need & how to organize',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'bg-teal-50 text-teal-600',
    availableForKit: true,
    buildPrompt: () =>
      'Help me organize my loan package documents. What does a lender need? Create a checklist organized by category with tips on formatting, naming conventions, and submission order.',
  },
  /* ── Certified-Only prompts ── */
  {
    id: 'lender-scripts',
    taskId: 'lender-scripts',
    title: 'Lender Phone Scripts',
    shortDesc: 'Professional outreach scripts',
    icon: <Phone className="h-5 w-5" />,
    color: 'bg-violet-50 text-violet-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me create professional phone scripts and email templates to contact lenders. I need a 30-45 second phone script, a follow-up email template, a voicemail version, and tips on tone.',
  },
  {
    id: 'email-templates',
    taskId: 'lender-scripts',
    title: 'Lender Email Templates',
    shortDesc: 'Follow-up email sequences',
    icon: <MessageCircle className="h-5 w-5" />,
    color: 'bg-pink-50 text-pink-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me write professional follow-up email templates for lender outreach. Include initial inquiry, follow-up after no response, and thank-you after meeting.',
  },
  {
    id: 'tax-return-prep',
    taskId: 'pfs',
    title: 'Tax Return Prep',
    shortDesc: 'Organize returns for lender review',
    icon: <Receipt className="h-5 w-5" />,
    color: 'bg-lime-50 text-lime-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me organize my tax returns for lender submission. What do lenders look at in personal and business returns? How do I explain deductions, depreciation, and add-backs?',
  },
  {
    id: 'credit-optimization',
    taskId: 'pfs',
    title: 'Credit Optimization',
    shortDesc: 'Improve your borrower profile',
    icon: <Award className="h-5 w-5" />,
    color: 'bg-purple-50 text-purple-600',
    availableForKit: false,
    buildPrompt: () =>
      'Review my credit profile and suggest optimizations before I apply for a commercial loan. What FICO ranges matter, how to improve quickly, and how to explain blemishes.',
  },
  {
    id: 'lender-matching',
    taskId: 'onboarding',
    title: 'Find the Right Lender',
    shortDesc: 'Match your deal to lender type',
    icon: <Target className="h-5 w-5" />,
    color: 'bg-amber-50 text-amber-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me identify the right type of lender for my commercial deal. Walk me through bank vs credit union vs CDFI vs private lender considerations based on my deal profile.',
  },
  {
    id: 'rent-roll-analysis',
    taskId: 'executive-summary',
    title: 'Rent Roll Analysis',
    shortDesc: 'Analyze & optimize your rent roll',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'bg-teal-50 text-teal-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me analyze and optimize my rent roll for lender presentation. Check for red flags, occupancy issues, rollover risk, and below-market rents.',
  },
  {
    id: 'noi-projection',
    taskId: 'dscr',
    title: 'NOI Projections',
    shortDesc: 'Build net operating income model',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-cyan-50 text-cyan-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me build a professional NOI projection for my property. Walk me through gross potential rent, vacancy, operating expenses, and how to present stabilized vs current NOI.',
  },
  {
    id: 'cap-rate',
    taskId: 'dscr',
    title: 'Cap Rate Deep Dive',
    shortDesc: 'Understand & calculate cap rates',
    icon: <PiggyBank className="h-5 w-5" />,
    color: 'bg-orange-50 text-orange-600',
    availableForKit: false,
    buildPrompt: () =>
      'Explain cap rates thoroughly for my commercial deal. How to calculate them, market comparisons, what lenders expect, and how cap rate affects my loan terms.',
  },
  {
    id: 'business-plan',
    taskId: 'executive-summary',
    title: 'Business Plan Builder',
    shortDesc: 'CRE-focused business plan',
    icon: <Briefcase className="h-5 w-5" />,
    color: 'bg-indigo-50 text-indigo-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me write a CRE-focused business plan for my loan application. Include property overview, market analysis, management plan, financial projections, and exit strategy.',
  },
  {
    id: 'entity-structure',
    taskId: 'onboarding',
    title: 'Entity Structure Review',
    shortDesc: 'LLC/Corp structure optimization',
    icon: <Building2 className="h-5 w-5" />,
    color: 'bg-rose-50 text-rose-600',
    availableForKit: false,
    buildPrompt: () =>
      'Review my entity structure for CRE lending. Help me understand LLC vs S-Corp considerations, asset protection, and what lenders prefer to see in the borrowing entity.',
  },
  {
    id: 'sba-loans',
    taskId: 'onboarding',
    title: 'SBA Loan Readiness',
    shortDesc: 'SBA 504/7(a) qualification check',
    icon: <Landmark className="h-5 w-5" />,
    color: 'bg-sky-50 text-sky-600',
    availableForKit: false,
    buildPrompt: () =>
      'Walk me through SBA loan programs (504 and 7a) for commercial real estate. Help me understand eligibility, documentation requirements, and how to maximize my chances.',
  },
  {
    id: 'loan-comparison',
    taskId: 'onboarding',
    title: 'Loan Program Comparison',
    shortDesc: 'Compare conventional vs SBA vs DSCR',
    icon: <Scale className="h-5 w-5" />,
    color: 'bg-fuchsia-50 text-fuchsia-600',
    availableForKit: false,
    buildPrompt: () =>
      'Compare loan programs for my deal: conventional bank, SBA 504, SBA 7(a), DSCR-only, bridge, and construction loans. Help me understand which fits my situation best.',
  },
  {
    id: 'deal-review',
    taskId: 'onboarding',
    title: 'Full Deal Review',
    shortDesc: 'Comprehensive deal health check',
    icon: <ClipboardCheck className="h-5 w-5" />,
    color: 'bg-emerald-50 text-emerald-600',
    availableForKit: false,
    buildPrompt: () =>
      'Do a comprehensive review of my CRE deal. Check my financials, property metrics, borrower profile, market conditions, and loan structure for any weaknesses or red flags.',
  },
  {
    id: 'negotiation-prep',
    taskId: 'lender-scripts',
    title: 'Negotiation Strategy',
    shortDesc: 'Prepare for term sheet talks',
    icon: <Handshake className="h-5 w-5" />,
    color: 'bg-amber-50 text-amber-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me prepare for loan term negotiations. What points are negotiable, how to counter unfavorable terms, and strategies for getting the best rate, fees, and covenants.',
  },
  {
    id: 'closing-checklist',
    taskId: 'onboarding',
    title: 'Closing Checklist',
    shortDesc: 'Pre-close document & action list',
    icon: <ClipboardCheck className="h-5 w-5" />,
    color: 'bg-green-50 text-green-600',
    availableForKit: false,
    buildPrompt: () =>
      'Generate a comprehensive closing checklist for my commercial loan. Include all documents, inspections, insurance, entity filings, and timeline milestones.',
  },
  {
    id: 'market-analysis',
    taskId: 'onboarding',
    title: 'Market Analysis Helper',
    shortDesc: 'Comp research & market narrative',
    icon: <Search className="h-5 w-5" />,
    color: 'bg-blue-50 text-blue-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me build a market analysis section for my loan package. Guide me through finding comps, vacancy rates, rent trends, and constructing a compelling market narrative.',
  },
  {
    id: 'property-valuation',
    taskId: 'dscr',
    title: 'Property Valuation',
    shortDesc: 'Income approach & comp analysis',
    icon: <Eye className="h-5 w-5" />,
    color: 'bg-slate-100 text-slate-600',
    availableForKit: false,
    buildPrompt: () =>
      'Help me estimate the value of my commercial property using income approach, sales comparison, and cost approach. Show me how lenders will appraise it.',
  },
  {
    id: 'portfolio-strategy',
    taskId: 'onboarding',
    title: 'Portfolio Growth Strategy',
    shortDesc: 'Plan your next acquisition',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-primary/10 text-primary',
    availableForKit: false,
    buildPrompt: () =>
      'Help me plan my commercial real estate portfolio growth strategy. How to leverage existing properties, optimize financing across multiple assets, and scale sustainably.',
  },
  {
    id: 'freeform',
    taskId: 'onboarding',
    title: 'Ask Anything',
    shortDesc: 'Free-form CRE financing question',
    icon: <Bot className="h-5 w-5" />,
    color: 'bg-gradient-to-br from-primary/10 to-emerald-50 text-primary',
    availableForKit: false,
    buildPrompt: () =>
      'I have a question about commercial real estate financing. Let me type it in.',
  },
];

/* ------------------------------------------------------------------ */
/*  Chat message types                                                  */
/* ------------------------------------------------------------------ */

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  message: string;
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT — Split Layout                                       */
/* ------------------------------------------------------------------ */

export default function PrepCoachPromptsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-gray-500">Loading PrepCoach...</p></div>}>
      <PrepCoachPromptsContent />
    </Suspense>
  );
}

function PrepCoachPromptsContent() {
  const { user, isCertifiedBorrower, isKitBuyer, isAdmin } = useAuth();
  const searchParams = useSearchParams();
  const dealId = searchParams.get('dealId');

  const hasFullAccess = isCertifiedBorrower || isAdmin;
  const userTier = isKitBuyer ? 'kit' : 'certified';

  /* ---- DB prompts state ---- */
  const [dbPrompts, setDbPrompts] = useState<{ id: string; title: string; content: string; order: number }[]>([]);

  useEffect(() => {
    fetch('/api/prep-coach-prompts')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setDbPrompts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  /* ---- chat state ---- */
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dealContext, setDealContext] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoLaunched = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (activeTaskId) inputRef.current?.focus();
  }, [activeTaskId]);

  /* ---- Auto-launch "Find Targeted Lenders" when dealId is in URL ---- */
  useEffect(() => {
    if (hasAutoLaunched.current || !dealId || !user) return;
    hasAutoLaunched.current = true;

    (async () => {
      setLoading(true);
      setActiveTaskId('find-lenders');
      setActiveTitle('Find Targeted Lenders');
      setMessages([{ id: uid(), role: 'user', message: 'Find Targeted Lenders' }]);

      try {
        const token = await getToken();

        // Fetch deal info
        const dealsRes = await fetch('/api/deal-room/deals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dealsData = await dealsRes.json();
        const deal = dealsData.deals?.find((d: any) => d.id === dealId);
        const dealName = deal?.name || 'Unknown Deal';

        // Fetch documents for this deal
        const docsRes = await fetch(`/api/deal-room?dealId=${dealId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const docsData = await docsRes.json();
        const files = docsData.files || [];
        const docList = files.length > 0
          ? files.map((f: any) => `- ${f.document_name || f.file_name} (${f.category || 'general'}, ${f.review_status})`).join('\n')
          : 'No documents uploaded yet.';

        // Build deal context string
        const context =
          `Deal Name: ${dealName}\n` +
          `Deal ID: ${dealId}\n` +
          `Number of documents: ${files.length}\n` +
          `Documents in Deal Room:\n${docList}`;

        setDealContext(context);

        const prompt =
          `I need help finding the best lenders for my deal "${dealName}". ` +
          `Please review my Deal Room documents and recommend targeted lender matches. ` +
          `Consider transaction size, property type, property location, cash flow, and LTV.`;

        const initHistory = [{ role: 'user' as const, content: prompt }];
        setHistory(initHistory);

        const answer = await askAI(prompt, 'find-lenders', [], context);
        setMessages((m) => [...m, { id: uid(), role: 'assistant', message: answer }]);
        setHistory((h) => [...h, { role: 'assistant', content: answer }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deal context');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealId, user]);

  /* ---- helpers ---- */
  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error('Please sign in to continue.');
    return session.access_token;
  };

  const askAI = async (
    question: string,
    taskId: string,
    prevHistory: { role: string; content: string }[],
    extraDealContext?: string | null,
  ): Promise<string> => {
    const token = await getToken();
    const res = await fetch('/api/ask-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        question,
        taskId,
        history: prevHistory.slice(-20),
        userTier,
        ...(extraDealContext ? { dealContext: extraDealContext } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed (${res.status})`);
    }
    const data = await res.json();
    return data.answer ?? 'Sorry, I could not generate an answer.';
  };

  /* ---- launch a prompt ---- */
  const handleLaunch = async (card: PromptCard) => {
    if (!user) return;
    const prompt = card.buildPrompt();
    setActiveTaskId(card.taskId);
    setActiveTitle(card.title);
    setError(null);

    const userMsg: ChatMessage = { id: uid(), role: 'user', message: card.title };
    setMessages([userMsg]);
    setHistory([{ role: 'user', content: prompt }]);
    setLoading(true);

    try {
      const answer = await askAI(prompt, card.taskId, []);
      setMessages((m) => [...m, { id: uid(), role: 'assistant', message: answer }]);
      setHistory((h) => [...h, { role: 'assistant', content: answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  /* ---- follow-up ---- */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading || !activeTaskId) return;

    setMessages((m) => [...m, { id: uid(), role: 'user', message: q }]);
    const updated = [...history, { role: 'user' as const, content: q }];
    setHistory(updated);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const answer = await askAI(q, activeTaskId, updated, dealContext);
      setMessages((m) => [...m, { id: uid(), role: 'assistant', message: answer }]);
      setHistory((h) => [...h, { role: 'assistant', content: answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  /* ---- reset ---- */
  const reset = () => {
    setMessages([]);
    setActiveTaskId(null);
    setActiveTitle(null);
    setHistory([]);
    setError(null);
    setInput('');
    setDealContext(null);
  };

  const kitCount = PROMPT_CARDS.filter((c) => c.availableForKit).length;
  const lockedCount = PROMPT_CARDS.filter((c) => !c.availableForKit).length;

  /* ================================================================ */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Bot className="h-3.5 w-3.5" />
              AI-Powered
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Prep Coach Tasks / View All
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl">
            Select a prompt to launch PrepCoach with a focused task. Follow up
            with questions in the chat panel.
            {isKitBuyer && !hasFullAccess && (
              <span className="text-amber-600 font-medium ml-1">
                Kit members have access to {kitCount} prompts.
              </span>
            )}
          </p>
        </div>
      </section>

      {/* ============ SPLIT LAYOUT ============ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ──── LEFT: Prompt Grid ──── */}
          <div className="lg:w-[55%] xl:w-[50%] flex-shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Admin-managed DB prompts */}
              {dbPrompts.map((dbp) => {
                const active = activeTitle === dbp.title;
                return (
                  <button
                    key={`db-${dbp.id}`}
                    onClick={() =>
                      handleLaunch({
                        id: `db-${dbp.id}`,
                        taskId: 'onboarding',
                        title: dbp.title,
                        shortDesc: dbp.content.slice(0, 60) + (dbp.content.length > 60 ? '…' : ''),
                        icon: <Bot className="h-5 w-5" />,
                        color: 'bg-primary/10 text-primary',
                        availableForKit: true,
                        buildPrompt: () => dbp.content,
                      })
                    }
                    disabled={loading}
                    className={`group text-left rounded-xl border-2 transition-all duration-200 ${
                      active
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-slate-200 bg-white hover:border-primary/30 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
                          <Bot className="h-5 w-5" />
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200"
                        >
                          New
                        </Badge>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                        {dbp.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {dbp.content.slice(0, 80)}{dbp.content.length > 80 ? '…' : ''}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* Hardcoded prompt cards */}
              {PROMPT_CARDS.map((card) => {
                const locked = !hasFullAccess && !card.availableForKit;
                const active = activeTitle === card.title;

                return (
                  <button
                    key={card.id}
                    onClick={() => !locked && handleLaunch(card)}
                    disabled={locked || loading}
                    className={`group text-left rounded-xl border-2 transition-all duration-200 ${
                      active
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : locked
                        ? 'border-slate-200 bg-slate-50/80 opacity-60 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:border-primary/30 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.color} ${
                            !locked && !active ? 'group-hover:scale-110' : ''
                          } transition-transform duration-200`}
                        >
                          {card.icon}
                        </div>
                        {locked ? (
                          <div className="flex items-center gap-1">
                            <Lock className="h-3 w-3 text-amber-500" />
                            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                              Certified
                            </span>
                          </div>
                        ) : card.availableForKit && !active ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200"
                          >
                            Kit
                          </Badge>
                        ) : null}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                        {card.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {locked
                          ? 'Upgrade to Certified Borrower to access this prompt.'
                          : card.shortDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Kit upgrade CTA */}
            {isKitBuyer && !hasFullAccess && (
              <div className="mt-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-center">
                <Lock className="h-7 w-7 text-primary mx-auto mb-2" />
                <h3 className="text-base font-bold text-white mb-1">
                  Unlock All {lockedCount} Certified-Only Prompts
                </h3>
                <p className="text-xs text-slate-300 mb-4 max-w-sm mx-auto">
                  Certified Borrowers get unlimited access to all PrepCoach
                  prompts, free-text AI coaching, the preferred lender network,
                  deal room, and more.
                </p>
                <Button size="sm" asChild>
                  <Link href="/membership/certified-borrower">
                    Become a Certified Borrower
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Not logged in */}
            {!user && (
              <div className="mt-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-center">
                <Bot className="h-7 w-7 text-primary mx-auto mb-2" />
                <h3 className="text-base font-bold text-white mb-1">
                  Sign In to Use PrepCoach
                </h3>
                <p className="text-xs text-slate-300 mb-4 max-w-sm mx-auto">
                  Log in to launch PrepCoach prompts and get personalized CRE
                  financing coaching.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button size="sm" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="border-white/20 text-white bg-white/10 hover:bg-white hover:text-slate-900"
                  >
                    <Link href="/workbook">Get the Success Kit</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ──── RIGHT: Chat Panel ──── */}
          <div className="lg:w-[45%] xl:w-[50%] lg:sticky lg:top-28 lg:self-start">
            <div
              className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden"
              style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}
            >
              {/* chat header */}
              <div className="flex items-center justify-between border-b px-5 py-3 bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">PrepCoach</h3>
                    <p className="text-[11px] text-gray-500">
                      {activeTitle || 'Select a prompt to start'}
                    </p>
                  </div>
                </div>
                {activeTaskId && (
                  <Button variant="ghost" size="sm" onClick={reset} className="text-xs gap-1.5">
                    <RotateCcw className="h-3 w-3" />
                    New Chat
                  </Button>
                )}
              </div>

              {/* messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      Ready to help you prepare
                    </h3>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Click any prompt on the left to start a focused coaching
                      session. I&apos;ll guide you step by step.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl border px-4 py-3 shadow-sm ${
                          msg.role === 'user'
                            ? 'border-primary/30 bg-primary text-primary-foreground'
                            : 'border-slate-200 bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2 text-xs font-medium opacity-80">
                          {msg.role === 'user' ? (
                            <>
                              <User className="h-3.5 w-3.5" /> You
                            </>
                          ) : (
                            <>
                              <Bot className="h-3.5 w-3.5" /> PrepCoach
                            </>
                          )}
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                        <Bot className="h-3.5 w-3.5" /> PrepCoach
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking&hellip;
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* input */}
              <div className="border-t px-4 py-3 bg-white">
                {activeTaskId ? (
                  <form onSubmit={handleSend} className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={
                        hasFullAccess
                          ? 'Ask a follow-up question\u2026'
                          : 'Ask a follow-up about this topic\u2026'
                      }
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={loading}
                      className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50"
                    />
                    <Button type="submit" size="sm" disabled={loading || !input.trim()} className="px-3">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center text-xs text-gray-400 py-2">
                    Select a prompt to start chatting
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
