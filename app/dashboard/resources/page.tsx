'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  Wrench,
  MapPin,
  DollarSign,
  Globe,
  Search,
  Shield,
  Star,
  ArrowRight,
  Lock,
  Users,
  Handshake,
  SlidersHorizontal,
  X,
  ChevronDown,
  Target,
} from 'lucide-react';

type PartnerCard = {
  id: string;
  partner_type: 'lender' | 'vendor';
  slug: string;
  company_name: string;
  logo_url: string | null;
  contact_picture_url: string | null;
  tagline: string | null;
  contact_name: string | null;
  lender_type: string | null;
  lending_focus: string | null;
  service_type: string | null;
  min_loan: number | null;
  max_loan: number | null;
  states_served: string[] | null;
  property_types: string[] | null;
  loan_programs: string[] | null;
  searchable_tags: string[] | null;
  service_areas: string | null;
  highlights: { icon: string; label: string }[];
  featured: boolean;
};

const LENDER_TYPE_LABELS: Record<string, string> = {
  bank: 'Bank',
  credit_union: 'Credit Union',
  cdfi: 'CDFI',
  sba_lender: 'SBA Lender',
  private_lender: 'Private / Direct Lender',
  hard_money: 'Hard Money',
  bridge_lender: 'Bridge Lender',
  life_company: 'Life Company',
  agency: 'Agency Lender',
  other: 'Other',
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  appraisal: 'Appraisal',
  environmental: 'Environmental',
  insurance: 'Insurance',
  legal: 'Legal / Attorney',
  title: 'Title Services',
  construction_mgmt: 'Construction Mgmt',
  property_inspection: 'Inspection',
  property_mgmt: 'Property Mgmt',
  accounting: 'Accounting / CPA',
  architecture: 'Architecture',
  surveying: 'Surveying',
  other: 'Other',
};

function formatCurrency(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
}

/* ── Filter dropdown options ─────────────────────────────────────── */
const LOAN_PROGRAM_OPTIONS = [
  { value: 'SBA 7(a)', label: 'SBA 7(a)' },
  { value: 'SBA 504', label: 'SBA 504' },
  { value: 'Bridge Loan', label: 'Bridge Loan' },
  { value: 'Hard Money', label: 'Hard Money' },
  { value: 'Fix & Flip', label: 'Fix & Flip' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Stated Income', label: 'Stated Income' },
  { value: 'DSCR Loan', label: 'DSCR Loan' },
  { value: 'Short-Term Rental', label: 'Short-Term Rental' },
  { value: 'Long-Term Rental', label: 'Long-Term Rental' },
  { value: 'Commercial Mortgage', label: 'Commercial Mortgage' },
  { value: 'Conventional', label: 'Conventional' },
  { value: 'USDA', label: 'USDA' },
  { value: 'Mezzanine', label: 'Mezzanine' },
  { value: 'Line of Credit', label: 'Line of Credit' },
  { value: 'Equipment Financing', label: 'Equipment Financing' },
  { value: 'CMBS', label: 'CMBS' },
  { value: 'Portfolio Loan', label: 'Portfolio Loan' },
  { value: 'Ground-Up Construction', label: 'Ground-Up Construction' },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: 'Multifamily', label: 'Multifamily' },
  { value: 'Office', label: 'Office' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Warehouse', label: 'Warehouse' },
  { value: 'Mixed Use', label: 'Mixed Use' },
  { value: 'Hotel / Hospitality', label: 'Hotel / Hospitality' },
  { value: 'Self Storage', label: 'Self Storage' },
  { value: 'Mobile Home Park', label: 'Mobile Home Park' },
  { value: 'Medical / Healthcare', label: 'Medical / Healthcare' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Gas Station', label: 'Gas Station' },
  { value: 'Car Wash', label: 'Car Wash' },
  { value: 'Land', label: 'Land' },
  { value: '1-4 Unit Residential', label: '1-4 Unit Residential' },
  { value: '5+ Unit Residential', label: '5+ Unit Residential' },
  { value: 'Single Family', label: 'Single Family' },
  { value: 'Special Purpose', label: 'Special Purpose' },
  { value: 'Assisted Living', label: 'Assisted Living' },
];

const LENDER_TYPE_OPTIONS = [
  { value: 'bank', label: 'Bank' },
  { value: 'credit_union', label: 'Credit Union' },
  { value: 'cdfi', label: 'CDFI' },
  { value: 'sba_lender', label: 'SBA Lender' },
  { value: 'private_lender', label: 'Private / Direct Lender' },
  { value: 'hard_money', label: 'Hard Money Lender' },
  { value: 'bridge_lender', label: 'Bridge Lender' },
  { value: 'life_company', label: 'Life Company' },
  { value: 'agency', label: 'Agency Lender' },
];

/* ── Dropdown filter component ───────────────────────────────────── */
function FilterDropdown({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${
          value
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className="max-w-[140px] truncate">
          {value
            ? options.find((o) => o.value === value)?.label || value
            : label}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 z-50 mt-1 w-56 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-50"
            >
              All {label}s
            </button>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                  value === opt.value ? 'bg-primary/5 text-primary font-medium' : 'text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DashboardResourcesPageInner() {
  const { user, loading, isCertifiedBorrower } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [partners, setPartners] = useState<PartnerCard[]>([]);
  const [fetching, setFetching] = useState(true);

  // Filters
  const [filter, setFilter] = useState<'all' | 'lender' | 'vendor'>(
    (searchParams.get('filter') as 'all' | 'lender' | 'vendor') || 'all'
  );
  const [search, setSearch] = useState('');
  const [loanProgram, setLoanProgram] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [lenderType, setLenderType] = useState('');
  const [lendingFocus, setLendingFocus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [loanProgram, propertyType, lenderType, lendingFocus].filter(Boolean).length;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchPartners();
  }, [user]);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_profiles')
        .select(
          'id, partner_type, slug, company_name, logo_url, contact_picture_url, tagline, contact_name, lender_type, lending_focus, service_type, min_loan, max_loan, states_served, property_types, loan_programs, searchable_tags, service_areas, highlights, featured'
        )
        .eq('is_published', true)
        .order('featured', { ascending: false })
        .order('company_name', { ascending: true });

      if (error) throw error;
      setPartners((data as PartnerCard[]) || []);
    } catch (err) {
      console.error('Error fetching partners:', err);
    } finally {
      setFetching(false);
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setLoanProgram('');
    setPropertyType('');
    setLenderType('');
    setLendingFocus('');
    setFilter('all');
  };

  const filtered = useMemo(() => {
    return partners
      .filter((p) => filter === 'all' || p.partner_type === filter)
      .filter((p) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          p.company_name.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.contact_name?.toLowerCase().includes(q) ||
          p.lending_focus?.toLowerCase().includes(q) ||
          p.loan_programs?.some((lp) => lp.toLowerCase().includes(q)) ||
          p.property_types?.some((pt) => pt.toLowerCase().includes(q)) ||
          p.searchable_tags?.some((t) => t.toLowerCase().includes(q))
        );
      })
      .filter((p) => {
        if (!loanProgram) return true;
        return p.loan_programs?.some(
          (lp) => lp.toLowerCase() === loanProgram.toLowerCase()
        );
      })
      .filter((p) => {
        if (!propertyType) return true;
        return p.property_types?.some(
          (pt) => pt.toLowerCase() === propertyType.toLowerCase()
        );
      })
      .filter((p) => {
        if (!lenderType) return true;
        return p.lender_type === lenderType;
      })
      .filter((p) => {
        if (!lendingFocus) return true;
        return p.lending_focus?.toLowerCase().includes(lendingFocus.toLowerCase());
      });
  }, [partners, filter, search, loanProgram, propertyType, lenderType, lendingFocus]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-primary/90">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm">
            <Link href="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-white">Partner Resources</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            K2 Partner Resources
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Browse our vetted network of K2 Preferred Lenders and trusted vendors.
            Click any partner to view their full profile, documents, and contact form.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Row 1: Type tabs + search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex gap-2">
              {[
                { key: 'all' as const, label: 'All Partners', icon: Users },
                { key: 'lender' as const, label: 'Lenders', icon: Building2 },
                { key: 'vendor' as const, label: 'Vendors', icon: Wrench },
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={filter === tab.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(tab.key)}
                  className="gap-1.5"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                  <span className="text-xs opacity-70 ml-1">
                    (
                    {tab.key === 'all'
                      ? partners.length
                      : partners.filter((p) => p.partner_type === tab.key).length}
                    )
                  </span>
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, keyword, loan type…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-1.5 shrink-0"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Row 2: Advanced filter dropdowns (collapsible) */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500 mr-1">Filter by:</span>
              {(filter === 'all' || filter === 'lender') && (
                <>
                  <FilterDropdown
                    label="Loan Program"
                    icon={DollarSign}
                    options={LOAN_PROGRAM_OPTIONS}
                    value={loanProgram}
                    onChange={setLoanProgram}
                  />
                  <FilterDropdown
                    label="Property Type"
                    icon={Building2}
                    options={PROPERTY_TYPE_OPTIONS}
                    value={propertyType}
                    onChange={setPropertyType}
                  />
                  <FilterDropdown
                    label="Lender Type"
                    icon={Shield}
                    options={LENDER_TYPE_OPTIONS}
                    value={lenderType}
                    onChange={setLenderType}
                  />
                </>
              )}
              {/* Lending Focus text filter */}
              {(filter === 'all' || filter === 'lender') && (
                <div className="relative">
                  <Input
                    placeholder="Lending Focus…"
                    value={lendingFocus}
                    onChange={(e) => setLendingFocus(e.target.value)}
                    className="h-9 w-44 text-sm pl-8"
                  />
                  <Target className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              )}
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-foreground gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </Button>
              )}
            </div>
          )}

          {/* Active filter chips */}
          {activeFilterCount > 0 && !showFilters && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-500">Active filters:</span>
              {loanProgram && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {loanProgram}
                  <button type="button" onClick={() => setLoanProgram('')} className="ml-0.5 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {propertyType && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {propertyType}
                  <button type="button" onClick={() => setPropertyType('')} className="ml-0.5 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {lenderType && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {LENDER_TYPE_OPTIONS.find((o) => o.value === lenderType)?.label || lenderType}
                  <button type="button" onClick={() => setLenderType('')} className="ml-0.5 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {lendingFocus && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  Focus: {lendingFocus}
                  <button type="button" onClick={() => setLendingFocus('')} className="ml-0.5 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="text-xs text-muted-foreground">
            Showing {filtered.length} of {partners.length} partner{partners.length !== 1 ? 's' : ''}
            {(search || activeFilterCount > 0) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-2 text-primary hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Partner grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {fetching ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading partners...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Handshake className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {search ? 'No partners match your search' : 'No partners available yet'}
              </h3>
              <p className="text-muted-foreground">
                {search
                  ? 'Try a different search term.'
                  : 'Partners will appear here once published by the admin.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((partner) => (
                <Link
                  key={partner.id}
                  href={`/${partner.partner_type}/${partner.slug}`}
                  className="group"
                >
                  <Card className="h-full border border-slate-200 hover:border-primary/40 hover:shadow-lg transition-all duration-200 overflow-hidden">
                    {/* Card header with logo / picture */}
                    <div className="relative bg-gradient-to-br from-slate-800 to-slate-700 p-6 pb-4">
                      {partner.featured && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500/90 text-white border-0 text-[10px]">
                          <Star className="h-3 w-3 mr-0.5 fill-white" />
                          Featured
                        </Badge>
                      )}

                      <div className="flex items-center gap-4">
                        {/* Logo or picture */}
                        {partner.logo_url ? (
                          <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                            <img
                              src={partner.logo_url}
                              alt={partner.company_name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        ) : partner.contact_picture_url ? (
                          <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 border-white/30">
                            <img
                              src={partner.contact_picture_url}
                              alt={partner.contact_name || partner.company_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                            <img
                              src="/assets/Network_Logo.png"
                              alt={partner.company_name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-primary transition">
                            {partner.company_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-white/15 text-white border-0"
                            >
                              {partner.partner_type === 'lender' ? 'Lender' : 'Vendor'}
                            </Badge>
                            <Badge className="text-[10px] bg-primary/20 text-primary border-primary/30">
                              <Shield className="h-2.5 w-2.5 mr-0.5" />
                              K2 Preferred
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1">
                      {/* Tagline */}
                      {partner.tagline && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {partner.tagline}
                        </p>
                      )}

                      {/* Details row */}
                      <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                        {partner.partner_type === 'lender' && partner.lender_type && (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{LENDER_TYPE_LABELS[partner.lender_type] || partner.lender_type}</span>
                          </div>
                        )}
                        {partner.partner_type === 'vendor' && partner.service_type && (
                          <div className="flex items-center gap-1.5">
                            <Handshake className="h-3.5 w-3.5" />
                            <span>{SERVICE_TYPE_LABELS[partner.service_type] || partner.service_type}</span>
                          </div>
                        )}
                        {partner.partner_type === 'lender' &&
                          partner.min_loan != null &&
                          partner.max_loan != null && (
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-3.5 w-3.5" />
                              <span>
                                {formatCurrency(partner.min_loan)} – {formatCurrency(partner.max_loan)}
                              </span>
                            </div>
                          )}
                        {partner.states_served && partner.states_served.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">{partner.states_served.join(', ')}</span>
                          </div>
                        )}
                        {partner.partner_type === 'vendor' && partner.service_areas && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">{partner.service_areas}</span>
                          </div>
                        )}
                      </div>

                      {/* Highlight badges */}
                      {partner.highlights && partner.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {partner.highlights.slice(0, 3).map((h, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                            >
                              {h.label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Loan programs / property types tags */}
                      {((partner.loan_programs && partner.loan_programs.length > 0) ||
                        (partner.property_types && partner.property_types.length > 0)) && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {partner.loan_programs?.slice(0, 3).map((lp, i) => (
                            <span
                              key={`lp-${i}`}
                              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                            >
                              {lp}
                            </span>
                          ))}
                          {partner.property_types?.slice(0, 2).map((pt, i) => (
                            <span
                              key={`pt-${i}`}
                              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
                            >
                              {pt}
                            </span>
                          ))}
                          {((partner.loan_programs?.length ?? 0) + (partner.property_types?.length ?? 0)) > 5 && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                              +{(partner.loan_programs?.length ?? 0) + (partner.property_types?.length ?? 0) - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto pt-3 border-t border-slate-100">
                        <span className="text-sm font-medium text-primary group-hover:underline flex items-center gap-1">
                          View Profile
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA for non-members */}
      {!isCertifiedBorrower && (
        <section className="py-12 bg-white border-t">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <Lock className="h-10 w-10 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unlock Full Partner Access
            </h2>
            <p className="text-gray-600 mb-6">
              Become a K2 Certified Borrower to access partner documents, videos,
              and direct contact forms.
            </p>
            <Button size="lg" asChild>
              <Link href="/membership/certified-borrower">
                Become a Certified Borrower
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

export default function DashboardResourcesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-primary/90">Loading...</p>
      </div>
    }>
      <DashboardResourcesPageInner />
    </Suspense>
  );
}