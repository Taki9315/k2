'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AssistantDialog } from '@/components/assistant/AssistantDialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  DollarSign,
  BarChart3,
  Phone,
  Compass,
  ArrowRight,
  Bot,
  Lock,
  Rocket,
  Shield,
  Zap,
  Users,
  Search,
  FileSpreadsheet,
  Clock,
  Award,
  Building2,
  Calculator,
  TrendingUp,
  Briefcase,
  Scale,
  Landmark,
  PiggyBank,
  HandCoins,
  Receipt,
  ClipboardCheck,
  Handshake,
  Target,
  Eye,
  MessageCircle,
  BookOpen,
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
  color: string; // tailwind bg class
  availableForKit: boolean;
  buildPrompt: () => string;
};

const PROMPT_CARDS: PromptCard[] = [
  // Row 1 — Core Prep
  {
    id: 'executive-summary',
    taskId: 'executive-summary',
    title: 'Executive Summary',
    shortDesc: 'Create a lender-ready 1-page summary',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-primary/10 text-primary',
    availableForKit: true,
    buildPrompt: () => 'Help me write a compelling 1-page Executive Summary for my commercial loan request. Walk me through structure, key points lenders care about, and output a clean draft.',
  },
  {
    id: 'pfs',
    taskId: 'pfs',
    title: 'Personal Financial Statement',
    shortDesc: 'Build a professional PFS',
    icon: <DollarSign className="h-5 w-5" />,
    color: 'bg-emerald-50 text-emerald-600',
    availableForKit: true,
    buildPrompt: () => 'Help me complete a professional Personal Financial Statement (PFS). Guide me through assets, liabilities, net worth, and contingent liabilities section by section.',
  },
  {
    id: 'dscr',
    taskId: 'dscr',
    title: 'DSCR Calculator',
    shortDesc: 'Calculate debt service coverage ratio',
    icon: <Calculator className="h-5 w-5" />,
    color: 'bg-blue-50 text-blue-600',
    availableForKit: true,
    buildPrompt: () => 'Walk me through calculating DSCR for my deal. Show the formula, explain what lenders look for (1.20x-1.35x+), and suggest improvements if I\'m below target.',
  },
  // Row 2 — Outreach
  {
    id: 'lender-scripts',
    taskId: 'lender-scripts',
    title: 'Lender Phone Scripts',
    shortDesc: 'Professional outreach scripts',
    icon: <Phone className="h-5 w-5" />,
    color: 'bg-violet-50 text-violet-600',
    availableForKit: true,
    buildPrompt: () => 'Help me create professional phone scripts and email templates to contact lenders. I need a 30-45 second phone script, a follow-up email template, a voicemail version, and tips on tone.',
  },
  {
    id: 'email-templates',
    taskId: 'lender-scripts',
    title: 'Lender Email Templates',
    shortDesc: 'Follow-up email sequences',
    icon: <MessageCircle className="h-5 w-5" />,
    color: 'bg-pink-50 text-pink-600',
    availableForKit: true,
    buildPrompt: () => 'Help me write professional follow-up email templates for lender outreach. Include initial inquiry, follow-up after no response, and thank-you after meeting.',
  },
  {
    id: 'lender-matching',
    taskId: 'onboarding',
    title: 'Find the Right Lender',
    shortDesc: 'Match your deal to lender type',
    icon: <Target className="h-5 w-5" />,
    color: 'bg-amber-50 text-amber-600',
    availableForKit: false,
    buildPrompt: () => 'Help me identify the right type of lender for my commercial deal. Walk me through bank vs credit union vs CDFI vs private lender considerations based on my deal profile.',
  },
  // Row 3 — Analysis
  {
    id: 'rent-roll-analysis',
    taskId: 'executive-summary',
    title: 'Rent Roll Analysis',
    shortDesc: 'Analyze & optimize your rent roll',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'bg-teal-50 text-teal-600',
    availableForKit: false,
    buildPrompt: () => 'Help me analyze and optimize my rent roll for lender presentation. Check for red flags, occupancy issues, rollover risk, and below-market rents.',
  },
  {
    id: 'noi-projection',
    taskId: 'dscr',
    title: 'NOI Projections',
    shortDesc: 'Build net operating income model',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-cyan-50 text-cyan-600',
    availableForKit: false,
    buildPrompt: () => 'Help me build a professional NOI projection for my property. Walk me through gross potential rent, vacancy, operating expenses, and how to present stabilized vs current NOI.',
  },
  {
    id: 'cap-rate',
    taskId: 'dscr',
    title: 'Cap Rate Deep Dive',
    shortDesc: 'Understand & calculate cap rates',
    icon: <PiggyBank className="h-5 w-5" />,
    color: 'bg-orange-50 text-orange-600',
    availableForKit: false,
    buildPrompt: () => 'Explain cap rates thoroughly for my commercial deal. How to calculate them, market comparisons, what lenders expect, and how cap rate affects my loan terms.',
  },
  // Row 4 — Documents
  {
    id: 'business-plan',
    taskId: 'executive-summary',
    title: 'Business Plan Builder',
    shortDesc: 'CRE-focused business plan',
    icon: <Briefcase className="h-5 w-5" />,
    color: 'bg-indigo-50 text-indigo-600',
    availableForKit: false,
    buildPrompt: () => 'Help me write a CRE-focused business plan for my loan application. Include property overview, market analysis, management plan, financial projections, and exit strategy.',
  },
  {
    id: 'entity-structure',
    taskId: 'onboarding',
    title: 'Entity Structure Review',
    shortDesc: 'LLC/Corp structure optimization',
    icon: <Building2 className="h-5 w-5" />,
    color: 'bg-rose-50 text-rose-600',
    availableForKit: false,
    buildPrompt: () => 'Review my entity structure for CRE lending. Help me understand LLC vs S-Corp considerations, asset protection, and what lenders prefer to see in the borrowing entity.',
  },
  {
    id: 'tax-return-prep',
    taskId: 'pfs',
    title: 'Tax Return Prep',
    shortDesc: 'Organize returns for lender review',
    icon: <Receipt className="h-5 w-5" />,
    color: 'bg-lime-50 text-lime-600',
    availableForKit: true,
    buildPrompt: () => 'Help me organize my tax returns for lender submission. What do lenders look at in personal and business returns? How do I explain deductions, depreciation, and add-backs?',
  },
  // Row 5 — Deal Specific
  {
    id: 'sba-loans',
    taskId: 'onboarding',
    title: 'SBA Loan Readiness',
    shortDesc: 'SBA 504/7(a) qualification check',
    icon: <Landmark className="h-5 w-5" />,
    color: 'bg-sky-50 text-sky-600',
    availableForKit: false,
    buildPrompt: () => 'Walk me through SBA loan programs (504 and 7a) for commercial real estate. Help me understand eligibility, documentation requirements, and how to maximize my chances.',
  },
  {
    id: 'loan-comparison',
    taskId: 'onboarding',
    title: 'Loan Program Comparison',
    shortDesc: 'Compare conventional vs SBA vs DSCR',
    icon: <Scale className="h-5 w-5" />,
    color: 'bg-fuchsia-50 text-fuchsia-600',
    availableForKit: false,
    buildPrompt: () => 'Compare loan programs for my deal: conventional bank, SBA 504, SBA 7(a), DSCR-only, bridge, and construction loans. Help me understand which fits my situation best.',
  },
  {
    id: 'deal-review',
    taskId: 'onboarding',
    title: 'Full Deal Review',
    shortDesc: 'Comprehensive deal health check',
    icon: <ClipboardCheck className="h-5 w-5" />,
    color: 'bg-emerald-50 text-emerald-600',
    availableForKit: false,
    buildPrompt: () => 'Do a comprehensive review of my CRE deal. Check my financials, property metrics, borrower profile, market conditions, and loan structure for any weaknesses or red flags.',
  },
  // Row 6 — Strategy
  {
    id: 'negotiation-prep',
    taskId: 'lender-scripts',
    title: 'Negotiation Strategy',
    shortDesc: 'Prepare for term sheet talks',
    icon: <Handshake className="h-5 w-5" />,
    color: 'bg-amber-50 text-amber-600',
    availableForKit: false,
    buildPrompt: () => 'Help me prepare for loan term negotiations. What points are negotiable, how to counter unfavorable terms, and strategies for getting the best rate, fees, and covenants.',
  },
  {
    id: 'credit-optimization',
    taskId: 'pfs',
    title: 'Credit Optimization',
    shortDesc: 'Improve your borrower profile',
    icon: <Award className="h-5 w-5" />,
    color: 'bg-purple-50 text-purple-600',
    availableForKit: true,
    buildPrompt: () => 'Review my credit profile and suggest optimizations before I apply for a commercial loan. What FICO ranges matter, how to improve quickly, and how to explain blemishes.',
  },
  {
    id: 'closing-checklist',
    taskId: 'onboarding',
    title: 'Closing Checklist',
    shortDesc: 'Pre-close document & action list',
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'bg-green-50 text-green-600',
    availableForKit: false,
    buildPrompt: () => 'Generate a comprehensive closing checklist for my commercial loan. Include all documents, inspections, insurance, entity filings, and timeline milestones.',
  },
  // Row 7 — Advanced
  {
    id: 'market-analysis',
    taskId: 'onboarding',
    title: 'Market Analysis Helper',
    shortDesc: 'Comp research & market narrative',
    icon: <Search className="h-5 w-5" />,
    color: 'bg-blue-50 text-blue-600',
    availableForKit: false,
    buildPrompt: () => 'Help me build a market analysis section for my loan package. Guide me through finding comps, vacancy rates, rent trends, and construction a compelling market narrative.',
  },
  {
    id: 'property-valuation',
    taskId: 'dscr',
    title: 'Property Valuation',
    shortDesc: 'Income approach & comp analysis',
    icon: <Eye className="h-5 w-5" />,
    color: 'bg-slate-100 text-slate-600',
    availableForKit: false,
    buildPrompt: () => 'Help me estimate the value of my commercial property using income approach, sales comparison, and cost approach. Show me how lenders will appraise it.',
  },
  {
    id: 'portfolio-strategy',
    taskId: 'onboarding',
    title: 'Portfolio Growth Strategy',
    shortDesc: 'Plan your next acquisition',
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'bg-primary/10 text-primary',
    availableForKit: false,
    buildPrompt: () => 'Help me plan my commercial real estate portfolio growth strategy. How to leverage existing properties, optimize financing across multiple assets, and scale sustainably.',
  },
  // Row 8 — Getting Started
  {
    id: 'onboarding',
    taskId: 'onboarding',
    title: 'General Coaching',
    shortDesc: 'Not sure where to start? Ask here.',
    icon: <Compass className="h-5 w-5" />,
    color: 'bg-primary/10 text-primary',
    availableForKit: false,
    buildPrompt: () => 'I\'m looking for guidance on getting prepared for a commercial loan. Based on where I am, what should I tackle first? Help me figure out my next step.',
  },
  {
    id: 'document-organizer',
    taskId: 'onboarding',
    title: 'Document Organizer',
    shortDesc: 'What docs do I need & how to organize',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'bg-teal-50 text-teal-600',
    availableForKit: true,
    buildPrompt: () => 'Help me organize my loan package documents. What does a lender need? Create a checklist organized by category with tips on formatting, naming conventions, and submission order.',
  },
  {
    id: 'freeform',
    taskId: 'onboarding',
    title: 'Ask Anything',
    shortDesc: 'Free-form CRE financing question',
    icon: <Bot className="h-5 w-5" />,
    color: 'bg-gradient-to-br from-primary/10 to-emerald-50 text-primary',
    availableForKit: false,
    buildPrompt: () => 'I have a question about commercial real estate financing. Let me type it in.',
  },
];

/* We need CheckCircle from lucide - import it */
function CheckCircle({ className }: { className?: string }) {
  return <ClipboardCheck className={className} />;
}

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                      */
/* ------------------------------------------------------------------ */

export default function PrepCoachPromptsPage() {
  const { user, isCertifiedBorrower, isKitBuyer, isAdmin } = useAuth();
  const [launchTask, setLaunchTask] = useState<{
    taskId: string;
    prompt: string;
  } | null>(null);

  const hasFullAccess = isCertifiedBorrower || isAdmin;

  const handleLaunch = (card: PromptCard) => {
    setLaunchTask({ taskId: card.taskId, prompt: card.buildPrompt() });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Bot className="h-3.5 w-3.5" />
              AI-Powered
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            PrepCoach Prompts
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Click any prompt below to launch PrepCoach with a focused task.
            {isKitBuyer && (
              <span className="text-amber-600 font-medium ml-1">
                Some prompts require Certified Borrower access.
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMPT_CARDS.map((card) => {
            const isLocked = !hasFullAccess && !card.availableForKit;

            return (
              <button
                key={card.id}
                onClick={() => !isLocked && handleLaunch(card)}
                disabled={isLocked && !isKitBuyer}
                className={`group text-left rounded-xl border-2 transition-all duration-200 ${
                  isLocked
                    ? 'border-slate-200 bg-slate-50/80 opacity-70 cursor-default'
                    : 'border-slate-200 bg-white hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color} ${
                        !isLocked ? 'group-hover:scale-110' : ''
                      } transition-transform duration-200`}
                    >
                      {card.icon}
                    </div>
                    {isLocked && (
                      <div className="flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                          Certified
                        </span>
                      </div>
                    )}
                    {card.availableForKit && !isLocked && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200"
                      >
                        Kit
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {card.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Kit buyer upgrade CTA */}
        {isKitBuyer && (
          <div className="mt-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
            <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">
              Unlock All {PROMPT_CARDS.filter((c) => !c.availableForKit).length} Certified Prompts
            </h3>
            <p className="text-sm text-slate-300 mb-5 max-w-md mx-auto">
              Certified Borrowers get unlimited access to all PrepCoach prompts,
              free-text AI coaching, the preferred lender network, deal room, and more.
            </p>
            <Button size="lg" asChild>
              <Link href="/membership/certified-borrower">
                Become a Certified Borrower
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="mt-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
            <Bot className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">
              Sign In to Use PrepCoach
            </h3>
            <p className="text-sm text-slate-300 mb-5 max-w-md mx-auto">
              Log in to your account to launch PrepCoach prompts and get
              personalized CRE financing guidance.
            </p>
            <div className="flex gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/20 text-white bg-white/10 hover:bg-white hover:text-slate-900">
                <Link href="/workbook">Get the Success Kit</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog - opens when a prompt is launched */}
      {launchTask && (
        <AssistantDialog
          defaultOpen
          initialPrompt={launchTask.prompt}
          initialTaskId={launchTask.taskId}
          onClose={() => setLaunchTask(null)}
        />
      )}
    </div>
  );
}
