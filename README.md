# K2 Commercial Finance — Member Platform

A full-featured commercial real estate (CRE) financing platform built with **Next.js 16**, **Supabase**, **Tailwind CSS**, and **shadcn/ui**. K2 helps borrowers prepare professional loan packages, track lender outreach, and connect with preferred lenders.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database & Auth | Supabase (PostgreSQL, Auth, Storage) |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) |
| Icons | Lucide React |
| Payments | Stripe Checkout |
| Hosting | Cloudflare Workers |

---

## Project Structure

```
app/
├── page.tsx                  # Public landing page
├── layout.tsx                # Root layout (Navigation + Footer)
├── login/ signup/            # Auth pages (password required)
├── forgot-password/          # Password reset flow
├── dashboard/                # Authenticated member dashboard
│   ├── page.tsx              # Dashboard home (quick actions, stats)
│   ├── deal-room/            # Secure per-deal document upload
│   │   ├── page.tsx          # Deal list + "Add New Deal"
│   │   ├── [dealId]/         # Per-deal 5-category uploads
│   │   └── shared/           # Public shared deal room (password-protected)
│   ├── lender-outreach/      # 7-step deal progress tracker
│   │   ├── page.tsx          # All deals outreach list
│   │   └── [dealId]/         # Per-deal lender table + status steps
│   ├── booking/              # Schedule appointments
│   ├── resources/            # Partner network
│   └── success-kit/          # Success Kit flipbook viewer
├── prepcoach/                # AI coaching tool (PrepCoach)
│   ├── page.tsx              # Marketing page + prompts + Excel tips
│   └── prompts/              # Interactive prompt templates
├── membership/               # Membership tiers
│   ├── certified-borrower/   # $250 one-time certified membership
│   ├── preferred-lender/     # Lender membership
│   └── lender-network/       # Lender network
├── content/                  # Document library, videos, articles
├── profile/                  # Profile settings + change password
├── admin/                    # Admin panel (users, docs, analytics)
└── api/                      # API routes (all server-side)
    ├── deal-room/            # File CRUD, deals, share, password
    ├── lender-outreach/      # Lender outreach CRUD
    ├── auth/                 # Auth helpers
    ├── messages/             # Messaging API
    └── ...                   # checkout, webhook, etc.

components/
├── Navigation.tsx            # Global sticky header + green nav bar
├── Footer.tsx                # Site footer
├── CertifiedBorrowerBadge.tsx # Badge displayed on key pages
├── DashboardInbox.tsx        # (Deprecated) Messages inbox component
├── assistant/                # PrepCoach AI dialog
├── ui/                       # shadcn/ui primitives
└── admin/                    # Admin-specific components

contexts/
└── AuthContext.tsx            # Auth provider (user, roles, profile)

lib/
├── supabase.ts               # Client-side Supabase client
├── supabase-server.ts        # Server-side Supabase (service role)
├── stripe.ts                 # Stripe configuration
└── utils.ts                  # Utility functions (cn, etc.)
```

---

## Key Features

### Deal Room
- **Per-deal document organization** with 5 upload categories: Transaction, Borrower, Property, Business, Entity
- **Password-protected sharing** — every deal requires a password at creation; viewers must authenticate
- **Admin review workflow** — admins can approve/decline uploaded documents with notes

### Lender Outreach
- **7-step deal progress tracker**: Success Kit → Certified Borrower → Deal Room Ready → Lenders Identified → Submitted to Lenders → In Underwriting → Closed
- **Per-lender status tracking**: Contact → Submitted → In Review → Declined → In Process / Closing → Closed → Declined (Final)
- **Print-ready** — "Print This Page" button with optimized print styles

### PrepCoach (AI)
- **"Ask Anything"** prominent CTA at top of prompts section
- **Guided prompt templates** for Executive Summary, DSCR Calculator, Lender Scripts, Financial Statements, and more
- **Role-gated access** — Kit buyers get basic prompts; Certified Borrowers get all

### Membership Tiers
- **Certified Borrower** ($250 one-time) — full platform access, $1,000 closing credit
- **"First 100 Certified Borrowers receive lifetime membership"** prominently displayed
- **Success Kit** — entry-level workbook + basic PrepCoach access

### User Account Security
- **Password field on signup** with confirmation
- **Change Password** option in Profile settings
- Supabase Auth with email/password

### Navigation & Polish
- **Messages feature removed** — cleaner nav without mail icon/inbox
- **"My Documents" removed** from dashboard (redundant with per-deal uploads)
- **Explanatory text** on Deal Room and Lender Outreach pages (bigger/bolder)
- **Certified Borrower Badge** displayed at bottom-center of Deal Room and Lender Outreach pages
- **Quick link** "Add New Deal" in Deal Room header
- **Fixed broken links** — PrepCoach task links point to correct pages

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase project (with `profiles`, `deals`, `deal_room_files`, `deal_lenders` tables)
- Stripe account (for checkout)

### Install & Run

```bash
npm install
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Database Migrations

Run pending migrations in the Supabase SQL Editor:

```
supabase/migrations/20260308000000_deal_room_document_name.sql
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type checking |

---

## Deployment

Configured for **Cloudflare Workers** using OpenNext + Wrangler.

### Deploy Steps

```bash
npm run cf:build
npm run cf:deploy
```

### One-Time Setup

```bash
npx wrangler login
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put ADMIN_NOTIFICATION_EMAIL
```

Set non-secret runtime vars in Cloudflare (Workers & Pages settings), for example:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CALENDLY_URL`
- `NEXT_PUBLIC_SUCCESS_KIT_PAGES`
- `NEXT_PUBLIC_SUCCESS_KIT_PDF_URL`
