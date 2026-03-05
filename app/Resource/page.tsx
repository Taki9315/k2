'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  ExternalLink,
  ArrowRight,
  BookOpen,
  FileSpreadsheet,
  BarChart3,
  X,
  Maximize2,
  Handshake,
  Loader2,
  Video,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Download,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type Resource = {
  title: string;
  description: string;
  href: string;
  external?: boolean;
  iframeable?: boolean;
  icon: React.ReactNode;
  badge?: string;
};

type DBResource = {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'link' | 'image';
  url: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  access_level: 'public' | 'members_only';
  category: string;
  tags: string[];
  view_count: number;
};

const resources: Resource[] = [
  {
    title: 'Mortgage Payment Calculator',
    description:
      'Run the numbers before you apply. This free calculator shows your estimated monthly payment, total interest, and full cost of any loan scenario - so you can walk into a lender meeting with confidence.',
    href: '/calculator',
    icon: <Calculator className="h-6 w-6" />,
    badge: 'Free Tool',
  },
  {
    title: 'Financing Success Kit',
    description:
      'The step-by-step guide that walks you through everything lenders want to see. Stop guessing and start preparing like a pro - this is the same framework used by borrowers who close deals.',
    href: '/workbook',
    icon: <BookOpen className="h-6 w-6" />,
    badge: '$14.95',
  },
  {
    title: 'LivePlan - Business Plan Software',
    description:
      'Lenders want a professional business plan - LivePlan builds one for you. Its AI-powered platform creates lender-ready financials, cash flow forecasts, and SBA-approved documents in a fraction of the time it takes with spreadsheets. Trusted by over 1 million entrepreneurs, this is the fastest way to present your business like a bankable borrower.',
    href: 'https://ssqt.co/mQLMnXG',
    external: true,
    iframeable: false,
    icon: <FileSpreadsheet className="h-6 w-6" />,
    badge: 'Partner',
  },
  {
    title: 'Deal Maker Analyzer - CRE Deal Analysis',
    description:
      'Evaluate any commercial property like a seasoned investor. Deal Maker Analyzer calculates cap rates, DSCR, cash-on-cash returns, and multi-year projections so you know exactly whether a deal pencils before you ever contact a lender. Present your numbers with confidence - the same way underwriters will evaluate them.',
    href: 'https://tinyurl.com/DealmakerPro',
    external: true,
    iframeable: true,
    icon: <BarChart3 className="h-6 w-6" />,
    badge: 'Partner',
  },
];

export default function ResourcePage() {
  const { user, isCertifiedBorrower, isKitBuyer } = useAuth();
  const hasPaidAccess = isCertifiedBorrower || isKitBuyer;
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [approvedProviders, setApprovedProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [dbResources, setDbResources] = useState<DBResource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [resourceSearch, setResourceSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('providers')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setApprovedProviders(data);
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoadingProviders(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let query = supabase
          .from('resources')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        // Only show public resources for non-members
        if (!hasPaidAccess) {
          query = query.eq('access_level', 'public');
        }

        const { data, error } = await query;
        if (!error && data) {
          setDbResources(data);
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoadingResources(false);
      }
    })();
  }, [hasPaidAccess]);

  const handleResourceClick = (resource: Resource) => {
    if (resource.external && resource.iframeable) {
      setActiveResource(resource);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClose = () => {
    setActiveResource(null);
  };

  /* ---- Iframe viewer -------------------------------------------- */
  if (activeResource) {
    return (
      <div className="flex flex-col h-[calc(100vh-6rem-3.5rem)]">
        <div className="flex items-center justify-between gap-4 border-b bg-slate-50 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              {activeResource.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">
                {activeResource.title}
              </h2>
              <p className="text-xs text-gray-500 truncate hidden sm:block">
                {activeResource.href}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              <a
                href={activeResource.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Maximize2 className="mr-1 h-3.5 w-3.5" />
                Open in New Tab
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Close
            </Button>
          </div>
        </div>

        <iframe
          src={activeResource.href}
          title={activeResource.title}
          className="flex-1 w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          allowFullScreen
        />
      </div>
    );
  }

  /* ---- Resource list -------------------------------------------- */
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Resource Library
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Curated tools, guides, and partner products to help you navigate
            commercial financing with confidence.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {resources.map((resource) => {
              const isExternal = resource.external;
              const opensIframe = isExternal && resource.iframeable;
              const opensNewTab = isExternal && !resource.iframeable;

              const cardInner = (
                <Card className="border-2 transition-all hover:shadow-lg hover:border-primary/30">
                  <CardContent className="flex items-start gap-5 p-6 md:p-8">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {resource.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {resource.title}
                        </h2>
                        {resource.badge && (
                          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-700">
                            {resource.badge}
                          </span>
                        )}
                        {isExternal && (
                          <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>

                    <ArrowRight className="h-5 w-5 shrink-0 text-gray-300 group-hover:text-primary transition-colors mt-1 hidden sm:block" />
                  </CardContent>
                </Card>
              );

              if (opensIframe) {
                return (
                  <button
                    key={resource.title}
                    type="button"
                    onClick={() => handleResourceClick(resource)}
                    className="block w-full text-left group"
                  >
                    {cardInner}
                  </button>
                );
              }

              if (opensNewTab) {
                return (
                  <a
                    key={resource.title}
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    {cardInner}
                  </a>
                );
              }

              return (
                <Link
                  key={resource.title}
                  href={resource.href}
                  className="block group"
                >
                  {cardInner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DB-backed resources from admin uploads ─────────────────── */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">More Resources</h2>
            <p className="mt-2 text-gray-600">
              Videos, guides, PDFs, and more to help you succeed in commercial financing.
            </p>
          </div>

          {/* Search */}
          {dbResources.length > 3 && (
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search resources..."
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {loadingResources ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading resources…</span>
            </div>
          ) : dbResources.length === 0 ? (
            <p className="text-center text-gray-500 py-8">More resources coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dbResources
                .filter((r) => {
                  if (!resourceSearch) return true;
                  const q = resourceSearch.toLowerCase();
                  return (
                    r.title.toLowerCase().includes(q) ||
                    r.description.toLowerCase().includes(q) ||
                    r.tags.some((t) => t.toLowerCase().includes(q))
                  );
                })
                .map((r) => {
                  const href = r.file_url || r.url || '#';
                  const isExternal = href.startsWith('http');
                  const typeIcon = r.type === 'video' ? (
                    <Video className="h-5 w-5" />
                  ) : r.type === 'pdf' ? (
                    <FileText className="h-5 w-5" />
                  ) : r.type === 'image' ? (
                    <ImageIcon className="h-5 w-5" />
                  ) : (
                    <LinkIcon className="h-5 w-5" />
                  );

                  return (
                    <a
                      key={r.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <Card className="h-full border-2 transition-all hover:shadow-lg hover:border-primary/30">
                        {r.thumbnail_url && (
                          <div className="aspect-video rounded-t-lg overflow-hidden bg-slate-200">
                            <img
                              src={r.thumbnail_url}
                              alt={r.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              {typeIcon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                  {r.title}
                                </h3>
                                {r.access_level === 'members_only' && (
                                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                    Member
                                  </Badge>
                                )}
                                {isExternal && (
                                  <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                                )}
                              </div>
                              {r.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">{r.description}</p>
                              )}
                              <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {r.type}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {r.category}
                                </Badge>
                                {r.type === 'pdf' && r.file_url && (
                                  <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                                    <Download className="h-3 w-3" />
                                    Download
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* Approved Partners from DB */}
      {!loadingProviders && approvedProviders.length > 0 && (
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Our Partners</h2>
              <p className="mt-2 text-gray-600">
                Trusted partners who share our mission to help borrowers succeed.
              </p>
            </div>
            <div className="space-y-6">
              {approvedProviders.map((provider) => (
                <div key={provider.id} className="block group">
                  <Card className="border-2 transition-all hover:shadow-lg hover:border-primary/30">
                    <CardContent className="flex items-start gap-5 p-6 md:p-8">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Handshake className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {provider.company || provider.name}
                          </h3>
                          {provider.type && (
                            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-700">
                              {provider.type}
                            </span>
                          )}
                          {provider.state && (
                            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-700">
                              {provider.state}
                            </span>
                          )}
                          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                            Partner
                          </span>
                          {provider.website && (
                            <a
                              href={provider.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex"
                            >
                              <ExternalLink className="h-4 w-4 text-gray-400 hover:text-primary" />
                            </a>
                          )}
                        </div>
                        {provider.description && (
                          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                            {provider.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          Contact: {provider.email}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {loadingProviders && (
        <section className="py-8 bg-slate-50">
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading partners…</span>
          </div>
        </section>
      )}

      <section className="border-t bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-slate-300">
            The Financing Success Kit gives you everything you need
            to present yourself as a borrower banks want to work with.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/workbook">
                Get the Success Kit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/membership">Explore Membership</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
