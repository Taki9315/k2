'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { CertifiedBorrowerBadge } from '@/components/CertifiedBorrowerBadge';
import { supabase } from '@/lib/supabase';
import {
  Upload,
  FileText,
  Trash2,
  Loader2,
  FolderOpen,
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle2,
  Clock,
  XCircle,
  Image as ImageIcon,
  Table2,
  Download,
  MessageSquare,
  Link2,
  Copy,
  AlertTriangle,
  X,
  KeyRound,
  Eye,
  EyeOff,
  Users,
  Building2,
  Briefcase,
  Landmark,
  ChevronDown,
  Search,
  Bot,
  ChevronRight,
  Phone,
  Handshake,
} from 'lucide-react';

/* ───── Legacy categories (kept for backward-compat display) ───── */
const LEGACY_CATEGORIES: Record<string, string> = {
  financials: 'Financial Statements',
  'tax-returns': 'Tax Returns',
  'entity-docs': 'Entity Documents',
  property: 'Property Info',
  personal: 'Personal Docs',
  general: 'Other',
};

/* ───── New 5-category document upload system ───── */
const DOCUMENT_CATEGORIES = [
  {
    id: 'transaction',
    label: 'Transaction Documentation',
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    documents: [
      'LOAN APPLICATION',
      'Appraisal',
      'Closing Statement',
      'Construction or Renovation Budget',
      'Environmental Report',
      'Executive Summary',
      'General Contractor Agreement',
      'Letter of Intent',
      'Loan Application',
      'Market Analysis',
      'Permits',
      'Pro Forma',
      'Property Management Agreement',
      'Purchase Agreement',
      'Sale & Lease Comps',
      'Service Maintenance Contracts',
      'Title Related',
      'Title Report',
      'Other Transaction Document',
    ],
  },
  {
    id: 'borrower',
    label: 'Borrower Documentation',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    documents: [
      '1099 Forms',
      'Bank Statements (Personal)',
      'Borrower Track Record',
      'Credit Authorization',
      'Credit Report',
      'Form W9 Individual',
      'Government ID',
      'Immigration Documents',
      'Liquidity Verification',
      'Net Worth Statement',
      'Pay Stubs',
      'Personal Financial Statement',
      'Principal / Guarantor Tax Return',
      'Principal / Sponsor Driver License',
      'Proof of Address',
      'Resume / Bio',
      'Schedule of Real Estate Owned (SREO)',
      'Social Security Card',
      'Sponsor Bio',
      'Tax Returns (Personal)',
      'W-2 Forms',
      'Other Borrower Document',
    ],
  },
  {
    id: 'property',
    label: 'Property Related',
    icon: Building2,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    documents: [
      'Alta Property Survey',
      'Appraisal',
      'Certificate of Occupancy',
      'Environmental Assessment',
      'Environmental Reports',
      'Evidence of Property Insurance',
      'Floor Plans / Site Plans',
      'Historical Capital Improvements',
      'HUD Settlement Statement',
      'Inspection Report',
      'Insurance Policy',
      'Lease Agreements',
      'Occupancy History',
      'Property Management Agreement',
      'Property Photographs / Renderings',
      'Property Photos',
      'Property Tax Bill',
      'Property Video',
      'Rent Roll',
      'STR Report',
      'Site Plan',
      'Survey',
      'Utility Bill',
      'Zoning Letter',
      'Zoning Report',
      'Other Property Document',
    ],
  },
  {
    id: 'business',
    label: 'Business Documentation',
    icon: Briefcase,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    documents: [
      'A/R Aging Report',
      'Accounts Receivable / Payable',
      'Articles of Incorporation',
      'Balance Sheet',
      'Business Bank Statements',
      'Business Financials',
      'Business License',
      'Business Plan',
      'Business Tax Returns',
      'Franchise Agreement',
      'Marketing Plan',
      'Proforma Projections',
      'Profit & Loss Statement',
      'Revenue Projections',
      'Other Business Document',
    ],
  },
  {
    id: 'entity',
    label: 'Entity Documents',
    icon: Landmark,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    documents: [
      'Articles of Incorporation',
      'Articles of Organization',
      'Bylaws',
      'Certificate of Formation',
      'Certificate of Good Standing',
      'Certificate of Liability Insurance',
      'Corporate Resolution',
      'EIN Letter',
      'Operating Agreement',
      'Organizational Chart',
      'Partnership Agreement',
      'TIC Agreement',
      'Trust Agreement',
      'Trust Documents',
      'Other Entity Document',
    ],
  },
];

type DealRoomFile = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category: string;
  document_name?: string | null;
  review_status: 'pending' | 'approved' | 'declined';
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function fileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv'))
    return Table2;
  return FileText;
}

export default function DealDetailPage() {
  const { user, loading, isCertifiedBorrower, isKitBuyer, isAdmin, fullName, membershipNumber } = useAuth();
  const router = useRouter();
  const params = useParams();
  const dealId = params.dealId as string;

  const [dealName, setDealName] = useState('');
  const [dealHasPassword, setDealHasPassword] = useState(false);
  const [files, setFiles] = useState<DealRoomFile[]>([]);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingCategoryId, setUploadingCategoryId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Category upload state: which document type is selected per category
  const [selectedDocTypes, setSelectedDocTypes] = useState<Record<string, string>>({});
  // Track which category card is actively being used for upload
  const [activeCategoryForUpload, setActiveCategoryForUpload] = useState<string | null>(null);

  // Share state
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [showShareWarning, setShowShareWarning] = useState(false);

  // Password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const hasAccess = isCertifiedBorrower || isKitBuyer || isAdmin;

  // Fetch deal info + deal files
  const fetchDealData = useCallback(async () => {
    if (!user) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    try {
      // Fetch deals list to find this deal's info
      const dealsRes = await fetch('/api/deal-room/deals', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (dealsRes.ok) {
        const dealsData = await dealsRes.json();
        const deal = dealsData.deals?.find((d: any) => d.id === dealId);
        if (deal) {
          setDealName(deal.name);
          setDealHasPassword(deal.hasPassword);
        } else {
          // Deal not found — redirect
          router.push('/dashboard/deal-room');
          return;
        }
      }

      // Fetch files for this deal
      const filesRes = await fetch(`/api/deal-room?dealId=${dealId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (filesRes.ok) {
        const filesData = await filesRes.json();
        setFiles(filesData.files);
      }
    } catch (err) {
      console.error('Error fetching deal data:', err);
    }
    setFetching(false);
  }, [user, dealId, router]);

  useEffect(() => {
    if (hasAccess) fetchDealData();
    else setFetching(false);
  }, [hasAccess, fetchDealData]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const categoryId = activeCategoryForUpload || 'transaction';
    const docName = selectedDocTypes[categoryId] || '';
    await uploadFile(file, categoryId, docName);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveCategoryForUpload(null);
  };

  /** Trigger file picker for a specific category card */
  const triggerCategoryUpload = (categoryId: string) => {
    const docName = selectedDocTypes[categoryId];
    if (!docName) {
      alert('Please select a document type first.');
      return;
    }
    setActiveCategoryForUpload(categoryId);
    // Small delay to let state settle before triggering file input
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const uploadFile = async (file: File, categoryId: string, documentName: string) => {
    const MAX_CLIENT_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
    if (file.size > MAX_CLIENT_FILE_SIZE) {
      alert('File too large? Compress or upload via alternative link (email K2 support).');
      return;
    }
    setUploading(true);
    setUploadingCategoryId(categoryId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', categoryId);
      formData.append('dealId', dealId);
      if (documentName) {
        formData.append('document_name', documentName);
      }

      const res = await fetch('/api/deal-room', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Upload failed');
        return;
      }

      // Clear the selected doc type for this category after upload
      setSelectedDocTypes((prev) => ({ ...prev, [categoryId]: '' }));
      await fetchDealData();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadingCategoryId(null);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    setDeletingId(fileId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await fetch(`/api/deal-room?fileId=${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
    setDeletingId(null);
  };

  const handleDownload = async (file: DealRoomFile) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await fetch(`/api/deal-room/download?fileId=${file.id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download. Please try again.');
    }
  };

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    // Use the first category with a selected doc type, or default
    const catWithSelection = DOCUMENT_CATEGORIES.find((c) => selectedDocTypes[c.id]);
    const categoryId = catWithSelection?.id || 'transaction';
    const docName = selectedDocTypes[categoryId] || '';
    await uploadFile(file, categoryId, docName);
  };

  // Share link — force password if deal doesn't have one yet
  const handleGenerateShareLink = () => {
    if (!dealHasPassword) {
      // Force password setup before sharing
      setShowPasswordModal(true);
      return;
    }
    setShowShareWarning(true);
  };

  const confirmGenerateShareLink = async () => {
    setShowShareWarning(false);
    setShareLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await fetch('/api/deal-room/share', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealId }),
      });

      if (!res.ok) throw new Error('Failed to generate share link');
      const data = await res.json();
      setShareUrl(data.shareUrl);
    } catch (err) {
      console.error('Share link error:', err);
      alert('Failed to generate share link.');
    }
    setShareLoading(false);
  };

  const copyShareLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Password protection
  const handleSetPassword = async () => {
    if (!passwordInput.trim()) {
      alert('Password is required.');
      return;
    }
    setPasswordLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await fetch('/api/deal-room/deals/password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId,
          password: passwordInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setDealHasPassword(data.hasPassword);
        setShowPasswordModal(false);
        setPasswordInput('');
        // If user was trying to share and set password first, proceed to share warning
        if (!dealHasPassword) {
          setShowShareWarning(true);
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to set password');
      }
    } catch (err) {
      console.error('Password error:', err);
      alert('Failed to set password.');
    }
    setPasswordLoading(false);
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
            The Deal Room is available to paid members.
          </p>
          <Button asChild>
            <Link href="/workbook">Get the Success Kit</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group files by new categories (also catch legacy categories under closest match)
  const grouped = DOCUMENT_CATEGORIES.map((cat) => ({
    ...cat,
    files: files.filter((f) => f.category === cat.id),
  })).filter((cat) => cat.files.length > 0);

  // Files that don't match any new category (legacy)
  const newCatIds = DOCUMENT_CATEGORIES.map((c) => c.id);
  const legacyFiles = files.filter((f) => !newCatIds.includes(f.category));

  /** Helper: get display label for a file's category */
  const getCategoryLabel = (catId: string) => {
    const newCat = DOCUMENT_CATEGORIES.find((c) => c.id === catId);
    if (newCat) return newCat.label;
    return LEGACY_CATEGORIES[catId] || catId;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/deal-room">
                <ArrowLeft className="mr-1 h-4 w-4" />
                All Deals
              </Link>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {fetching ? 'Loading...' : dealName || 'Deal'}
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                  <Shield className="h-3 w-3" />
                  Secure
                </Badge>
                <Badge variant="outline" className="gap-1 text-amber-600 border-amber-200 bg-amber-50">
                  <KeyRound className="h-3 w-3" />
                  Password Protected
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Upload and organize your loan package documents.{' '}
                {files.length > 0
                  ? `${files.length} file${files.length > 1 ? 's' : ''} uploaded.`
                  : 'Start by uploading your first document.'}
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
            <div className="flex items-center gap-2">
              {/* Change Password */}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowPasswordModal(true)}
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </Button>
              {/* Share Link Button */}
              {(isCertifiedBorrower || isAdmin) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleGenerateShareLink}
                  disabled={shareLoading}
                >
                  {shareLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  Copy Share Deal Room Link
                </Button>
              )}
            </div>
          </div>

          {/* Share URL display */}
          {shareUrl && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 text-xs font-mono bg-transparent border-none focus:outline-none text-gray-700"
              />
              <Button
                size="sm"
                variant={shareCopied ? 'default' : 'outline'}
                onClick={copyShareLink}
                className="gap-1.5 shrink-0"
              >
                {shareCopied ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hidden file input (shared across all category cards) */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.webp"
        />

        {/* Upload Documents heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload Documents
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a category below, choose the document type, then upload your file.
          </p>
        </div>

        {/* Category Cards + Find Targeted Lenders — 3 across grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {DOCUMENT_CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isUploading = uploading && uploadingCategoryId === cat.id;
            const catFileCount = files.filter((f) => f.category === cat.id).length;
            return (
              <Card
                key={cat.id}
                className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
                  activeCategoryForUpload === cat.id
                    ? 'ring-2 ring-primary shadow-md'
                    : ''
                }`}
              >
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-lg ${cat.bg} flex items-center justify-center`}
                      >
                        <CatIcon className={`h-4 w-4 ${cat.color}`} />
                      </div>
                      <CardTitle className="text-sm font-semibold text-gray-900 leading-tight">
                        {cat.label}
                      </CardTitle>
                    </div>
                    {catFileCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {catFileCount}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-1">
                  <div className="relative mb-3">
                    <select
                      value={selectedDocTypes[cat.id] || ''}
                      onChange={(e) =>
                        setSelectedDocTypes((prev) => ({
                          ...prev,
                          [cat.id]: e.target.value,
                        }))
                      }
                      className={`w-full rounded-md border ${cat.border} bg-white pl-3 pr-8 py-2 text-xs shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none`}
                    >
                      <option value="">Select document type…</option>
                      {cat.documents.map((doc) => (
                        <option key={doc} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <Button
                    onClick={() => triggerCategoryUpload(cat.id)}
                    disabled={isUploading || !selectedDocTypes[cat.id]}
                    size="sm"
                    className="w-full gap-1.5 text-xs"
                    variant={selectedDocTypes[cat.id] ? 'default' : 'outline'}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        Browse &amp; Upload
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {/* View Preferred Lender & Vendor Network — 3rd column (Certified only) */}
          {(isCertifiedBorrower || isAdmin) ? (
          <Link
            href="/dashboard/resources"
            className="lg:col-start-3 lg:row-start-1"
          >
            <Card className="h-full border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-emerald-50/50 to-white hover:border-primary/40 hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col justify-center">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center h-full">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  View Preferred Lender &amp; Vendor Network
                </h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Browse vetted lenders and vendors for your deal
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all">
                  <Handshake className="h-3 w-3" />
                  Partner Network
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
          ) : (
          <div className="lg:col-start-3 lg:row-start-1">
            <Card className="h-full border-2 border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden flex flex-col justify-center">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center h-full">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  Preferred Lender &amp; Vendor Network
                </h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Upgrade to access our vetted lender &amp; vendor network
                </p>
                <Link href="/membership/certified-borrower">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                    Unlock Full Access
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Track Lender Submissions & Deal Status (Certified only) */}
          {(isCertifiedBorrower || isAdmin) ? (
          <Link
            href={`/dashboard/lender-outreach/${dealId}`}
            className="lg:col-start-3 lg:row-start-2"
          >
            <Card className="h-full border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col justify-center">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center h-full">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  Track Lender Submissions &amp; Deal Status
                </h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  K2 will update or add your own
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/30 transition-all">
                  <Phone className="h-3 w-3" />
                  Track Outreach
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
          ) : (
          <div className="lg:col-start-3 lg:row-start-2">
            <Card className="h-full border-2 border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden flex flex-col justify-center">
              <CardContent className="p-5 flex flex-col items-center text-center justify-center h-full">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  Track Lender Submissions &amp; Deal Status
                </h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Upgrade to track submissions &amp; deal status
                </p>
                <Link href="/membership/certified-borrower">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                    Unlock Full Access
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
          )}
        </div>

        {/* Compact drag & drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-8 rounded-lg border-2 border-dashed transition-all duration-200 ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.005]'
              : 'border-slate-200 bg-white hover:border-primary/40'
          }`}
        >
          <div className="flex items-center justify-center gap-3 py-4 px-4 text-center">
            <Upload
              className={`h-5 w-5 flex-shrink-0 ${isDragging ? 'text-primary' : 'text-slate-400'}`}
            />
            <p className="text-sm text-gray-500">
              {isDragging
                ? 'Drop your file here'
                : 'Or drag and drop a file here — PDF, Word, Excel, CSV, or images (max 50 MB)'}
            </p>
          </div>
        </div>

        {/* Files list */}
        {fetching ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : files.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No Documents Yet</h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Select a category above, choose a document type, and upload to start building your
                loan package.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => {
              const CatIcon = group.icon;
              return (
                <Card key={group.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div
                        className={`h-7 w-7 rounded-lg ${group.bg} flex items-center justify-center`}
                      >
                        <CatIcon className={`h-4 w-4 ${group.color}`} />
                      </div>
                      {group.label}
                      <Badge variant="outline" className="ml-2">
                        {group.files.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      {group.files.map((file) => {
                        const Icon = fileIcon(file.mime_type);
                        return (
                          <div key={file.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-slate-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                {file.document_name ? (
                                  <>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      <span className="inline-flex items-center gap-1.5">
                                        <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-semibold">
                                          {file.document_name}
                                        </span>
                                      </span>
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                      {file.file_name} &bull; {formatFileSize(file.file_size)} &bull;{' '}
                                      {new Date(file.created_at).toLocaleDateString()}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {file.file_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize(file.file_size)} &bull;{' '}
                                      {new Date(file.created_at).toLocaleDateString()}
                                    </p>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-500 hover:text-primary hover:bg-primary/5 h-8 w-8 p-0"
                                  onClick={() => handleDownload(file)}
                                  title="Download"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                  onClick={() => handleDelete(file.id)}
                                  disabled={deletingId === file.id}
                                >
                                  {deletingId === file.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            {file.admin_note && (
                              <div className="ml-[52px] mt-2 flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
                                <MessageSquare className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-blue-700">{file.admin_note}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Legacy files (from old category system) */}
            {legacyFiles.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-slate-500" />
                    Other Documents
                    <Badge variant="outline" className="ml-2">
                      {legacyFiles.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {legacyFiles.map((file) => {
                      const Icon = fileIcon(file.mime_type);
                      return (
                        <div key={file.id} className="py-3 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-5 w-5 text-slate-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.file_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {getCategoryLabel(file.category)} &bull;{' '}
                                {formatFileSize(file.file_size)} &bull;{' '}
                                {new Date(file.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 hover:text-primary hover:bg-primary/5 h-8 w-8 p-0"
                                onClick={() => handleDownload(file)}
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                onClick={() => handleDelete(file.id)}
                                disabled={deletingId === file.id}
                              >
                                {deletingId === file.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          {file.admin_note && (
                            <div className="ml-[52px] mt-2 flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
                              <MessageSquare className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                              <p className="text-xs text-blue-700">{file.admin_note}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Certified Borrower Badge */}
      {isCertifiedBorrower && (
        <div className="flex justify-center py-8">
          <CertifiedBorrowerBadge fullName={fullName} membershipNumber={membershipNumber} variant="compact" />
        </div>
      )}

      {/* Share Link Warning Modal */}
      {showShareWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <button
              onClick={() => setShowShareWarning(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Share This Deal?</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              <strong className="text-amber-700">Warning:</strong> Anyone with this link can view{' '}
              <strong>all files in &ldquo;{dealName}&rdquo;</strong>. Only share with trusted
              lenders/K2.
            </p>
            <ul className="text-sm text-gray-600 space-y-1.5 mb-6 ml-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                Your lender or loan officer
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                K2 Commercial Finance team
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                Your attorney or CPA
              </li>
            </ul>
            <p className="text-xs text-gray-500 mb-5">
              The link expires in 45 days. You can generate a new one anytime (which revokes the
              previous link).
              {dealHasPassword && (
                <span className="block mt-1 text-amber-600 font-medium">
                  This deal is password-protected. Viewers will need the password to access files.
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowShareWarning(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1 gap-1.5" onClick={confirmGenerateShareLink}>
                <Link2 className="h-4 w-4" />
                Generate Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Password Protection Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordInput('');
                setShowPassword(false);
              }}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {dealHasPassword ? 'Change Password' : 'Set Password'}
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-1">
              {dealHasPassword
                ? 'Enter a new password for this deal room.'
                : 'A password is required to protect your deal room. Viewers must enter this password to access shared files.'}
            </p>
            <p className="text-xs text-amber-600 font-medium mb-4 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Password protection is always required.
            </p>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && passwordInput.trim()) handleSetPassword();
                }}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput('');
                  setShowPassword(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSetPassword}
                disabled={passwordLoading || !passwordInput.trim()}
              >
                {passwordLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : dealHasPassword ? (
                  'Update Password'
                ) : (
                  'Set Password'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
