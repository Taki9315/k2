/**
 * Seed Prep Coach Prompts into the database.
 *
 * Run:  node scripts/seed-prep-coach-prompts.mjs
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env
 * Uses upsert on title so re-running is safe (won't duplicate).
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Manual .env parser (no dotenv dependency)
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      // Strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env may not exist
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

/* ── Prompt definitions (matching the frontend PROMPT_CARDS) ── */
const PROMPTS = [
  /* Kit-Accessible (order 0-3) */
  {
    title: 'Executive Summary',
    content:
      'Help me write a compelling 1-page Executive Summary for my commercial loan request. Walk me through structure, key points lenders care about, and output a clean draft.',
    order: 0,
    is_hidden: false,
  },
  {
    title: 'Personal Financial Statement',
    content:
      'Help me complete a professional Personal Financial Statement (PFS). Guide me through assets, liabilities, net worth, and contingent liabilities section by section.',
    order: 1,
    is_hidden: false,
  },
  {
    title: 'DSCR Calculator',
    content:
      "Walk me through calculating DSCR for my deal. Show the formula, explain what lenders look for (1.20x-1.35x+), and suggest improvements if I'm below target.",
    order: 2,
    is_hidden: false,
  },
  {
    title: 'Document Organizer',
    content:
      'Help me organize my loan package documents. What does a lender need? Create a checklist organized by category with tips on formatting, naming conventions, and submission order.',
    order: 3,
    is_hidden: false,
  },

  /* Certified-Only (order 4+) */
  {
    title: 'Lender Phone Scripts',
    content:
      'Help me create professional phone scripts and email templates to contact lenders. I need a 30-45 second phone script, a follow-up email template, a voicemail version, and tips on tone.',
    order: 4,
    is_hidden: false,
  },
  {
    title: 'Lender Email Templates',
    content:
      'Help me write professional follow-up email templates for lender outreach. Include initial inquiry, follow-up after no response, and thank-you after meeting.',
    order: 5,
    is_hidden: false,
  },
  {
    title: 'Tax Return Prep',
    content:
      'Help me organize my tax returns for lender submission. What do lenders look at in personal and business returns? How do I explain deductions, depreciation, and add-backs?',
    order: 6,
    is_hidden: false,
  },
  {
    title: 'Credit Optimization',
    content:
      'Review my credit profile and suggest optimizations before I apply for a commercial loan. What FICO ranges matter, how to improve quickly, and how to explain blemishes.',
    order: 7,
    is_hidden: false,
  },
  {
    title: 'Find the Right Lender',
    content:
      'Help me identify the right type of lender for my commercial deal. Walk me through bank vs credit union vs CDFI vs private lender considerations based on my deal profile.',
    order: 8,
    is_hidden: false,
  },
  {
    title: 'Rent Roll Analysis',
    content:
      'Help me analyze and optimize my rent roll for lender presentation. Check for red flags, occupancy issues, rollover risk, and below-market rents.',
    order: 9,
    is_hidden: false,
  },
  {
    title: 'NOI Projections',
    content:
      'Help me build a professional NOI projection for my property. Walk me through gross potential rent, vacancy, operating expenses, and how to present stabilized vs current NOI.',
    order: 10,
    is_hidden: false,
  },
  {
    title: 'Cap Rate Deep Dive',
    content:
      'Explain cap rates thoroughly for my commercial deal. How to calculate them, market comparisons, what lenders expect, and how cap rate affects my loan terms.',
    order: 11,
    is_hidden: false,
  },
  {
    title: 'Business Plan Builder',
    content:
      'Help me write a CRE-focused business plan for my loan application. Include property overview, market analysis, management plan, financial projections, and exit strategy.',
    order: 12,
    is_hidden: false,
  },
  {
    title: 'Entity Structure Review',
    content:
      'Review my entity structure for CRE lending. Help me understand LLC vs S-Corp considerations, asset protection, and what lenders prefer to see in the borrowing entity.',
    order: 13,
    is_hidden: false,
  },
  {
    title: 'SBA Loan Readiness',
    content:
      'Walk me through SBA loan programs (504 and 7a) for commercial real estate. Help me understand eligibility, documentation requirements, and how to maximize my chances.',
    order: 14,
    is_hidden: false,
  },
  {
    title: 'Loan Program Comparison',
    content:
      'Compare loan programs for my deal: conventional bank, SBA 504, SBA 7(a), DSCR-only, bridge, and construction loans. Help me understand which fits my situation best.',
    order: 15,
    is_hidden: false,
  },
  {
    title: 'Full Deal Review',
    content:
      'Do a comprehensive review of my CRE deal. Check my financials, property metrics, borrower profile, market conditions, and loan structure for any weaknesses or red flags.',
    order: 16,
    is_hidden: false,
  },
  {
    title: 'Negotiation Strategy',
    content:
      'Help me prepare for loan term negotiations. What points are negotiable, how to counter unfavorable terms, and strategies for getting the best rate, fees, and covenants.',
    order: 17,
    is_hidden: false,
  },
  {
    title: 'Closing Checklist',
    content:
      'Generate a comprehensive closing checklist for my commercial loan. Include all documents, inspections, insurance, entity filings, and timeline milestones.',
    order: 18,
    is_hidden: false,
  },
  {
    title: 'Market Analysis Helper',
    content:
      'Help me build a market analysis section for my loan package. Guide me through finding comps, vacancy rates, rent trends, and constructing a compelling market narrative.',
    order: 19,
    is_hidden: false,
  },
  {
    title: 'Property Valuation',
    content:
      'Help me estimate the value of my commercial property using income approach, sales comparison, and cost approach. Show me how lenders will appraise it.',
    order: 20,
    is_hidden: false,
  },
  {
    title: 'Portfolio Growth Strategy',
    content:
      'Help me plan my commercial real estate portfolio growth strategy. How to leverage existing properties, optimize financing across multiple assets, and scale sustainably.',
    order: 21,
    is_hidden: false,
  },
  {
    title: 'Ask Anything',
    content:
      'I have a question about commercial real estate financing. Let me type it in.',
    order: 22,
    is_hidden: false,
  },
];

async function seed() {
  console.log(`Seeding ${PROMPTS.length} prompts into prep_coach_prompts...`);

  // Check existing prompts to avoid duplicates
  const { data: existing, error: fetchErr } = await supabase
    .from('prep_coach_prompts')
    .select('title');

  if (fetchErr) {
    console.error('Error fetching existing prompts:', fetchErr.message);
    process.exit(1);
  }

  const existingTitles = new Set((existing || []).map((p) => p.title));

  let inserted = 0;
  let skipped = 0;

  for (const prompt of PROMPTS) {
    if (existingTitles.has(prompt.title)) {
      console.log(`  SKIP (exists): "${prompt.title}"`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('prep_coach_prompts')
      .insert(prompt);

    if (error) {
      console.error(`  ERROR inserting "${prompt.title}":`, error.message);
    } else {
      console.log(`  OK: "${prompt.title}" (order ${prompt.order})`);
      inserted++;
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
}

seed().catch(console.error);
