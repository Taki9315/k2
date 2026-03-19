'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ArrowRight,
  Bot,
  Lock,
  Send,
  Loader2,
  User,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  PROMPT CARD TYPE (used for launch handler)                          */
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
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        // Sort by admin-defined order
        arr.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        setDbPrompts(arr);
      })
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
            Prep Coach
          </h1>
          <p className="text-gray-600 text-sm max-w-2xl">
            Select a prompt to launch PrepCoach with a focused task. Follow up
            with questions in the chat panel.
            {isKitBuyer && !hasFullAccess && (
              <span className="text-amber-600 font-medium ml-1">
                Kit members have access to the first 4 prompts.
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
              {/* Database-managed prompts — first 4 available to kit buyers, rest certified-only */}
              {dbPrompts.map((dbp, index) => {
                const active = activeTitle === dbp.title;
                const locked = !hasFullAccess && index >= 4;
                return (
                  <button
                    key={`db-${dbp.id}`}
                    onClick={() =>
                      !locked &&
                      handleLaunch({
                        id: `db-${dbp.id}`,
                        taskId: 'onboarding',
                        title: dbp.title,
                        shortDesc: dbp.content.slice(0, 60) + (dbp.content.length > 60 ? '…' : ''),
                        icon: <Bot className="h-5 w-5" />,
                        color: 'bg-primary/10 text-primary',
                        availableForKit: index < 4,
                        buildPrompt: () => dbp.content,
                      })
                    }
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
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ${!locked && !active ? 'group-hover:scale-110' : ''} transition-transform duration-200`}>
                          <Bot className="h-5 w-5" />
                        </div>
                        {locked && (
                          <div className="flex items-center gap-1">
                            <Lock className="h-3 w-3 text-amber-500" />
                            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                              Certified
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                        {dbp.title}
                        {!locked && dbp.content && (
                          <span className="italic">
                            {' ('}
                            {dbp.content.split(/[.!?]\s/)[0]}
                            {dbp.content.split(/[.!?]\s/).length > 1 ? '.' : ''}
                            {')'}
                          </span>
                        )}
                      </h3>
                      {!locked && dbp.content && (
                        <div className="mt-1.5 rounded-md bg-slate-50 border border-slate-100 px-2.5 py-1.5">
                          <p className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {dbp.content}
                          </p>
                        </div>
                      )}
                      {locked && (
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Upgrade to Certified Borrower to access this prompt.
                        </p>
                      )}
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
                  Unlock All Certified-Only Prompts
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
