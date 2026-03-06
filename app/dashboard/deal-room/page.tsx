'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
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
} from 'lucide-react';

const CATEGORIES = [
  { value: 'financials', label: 'Financial Statements' },
  { value: 'tax-returns', label: 'Tax Returns' },
  { value: 'entity-docs', label: 'Entity Documents' },
  { value: 'property', label: 'Property Info' },
  { value: 'personal', label: 'Personal Docs' },
  { value: 'general', label: 'Other' },
];

type DealRoomFile = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category: string;
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

export default function DealRoomPage() {
  const { user, loading, isCertifiedBorrower, isKitBuyer, isAdmin } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<DealRoomFile[]>([]);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [showShareWarning, setShowShareWarning] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const hasAccess = isCertifiedBorrower || isKitBuyer || isAdmin;

  const fetchFiles = useCallback(async () => {
    if (!user) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;

    try {
      const res = await fetch('/api/deal-room', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
    }
    setFetching(false);
  }, [user]);

  useEffect(() => {
    if (hasAccess) fetchFiles();
    else setFetching(false);
  }, [hasAccess, fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);

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

      await fetchFiles();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    setDeletingId(fileId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
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
      const { data: { session } } = await supabase.auth.getSession();
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

  // Drag and drop handlers
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

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);

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

      await fetchFiles();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Share link generation
  const handleGenerateShareLink = async () => {
    setShowShareWarning(true);
  };

  const confirmGenerateShareLink = async () => {
    setShowShareWarning(false);
    setShareLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await fetch('/api/deal-room/share', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
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
            The Deal Room is available to paid members. Upload your
            loan documents, organize by category, and prepare for lender
            submission.
          </p>
          <Button asChild>
            <Link href="/workbook">
              Get the Success Kit
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Group files by category
  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    files: files.filter((f) => f.category === cat.value),
  })).filter((cat) => cat.files.length > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Deal Room</h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                  <Shield className="h-3 w-3" />
                  Secure
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Upload and organize your loan package documents.{' '}
                {files.length > 0
                  ? `${files.length} file${files.length > 1 ? 's' : ''} uploaded.`
                  : 'Start by uploading your first document.'}
              </p>
            </div>
            {/* Share Link Button (Certified only) */}
            {isCertifiedBorrower && (
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
                Generate Share Link
              </Button>
            )}
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
        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-6 rounded-xl border-2 border-dashed transition-all duration-200 ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-slate-300 bg-slate-50 hover:border-primary/40 hover:bg-primary/5'
          }`}
        >
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <Upload className={`h-10 w-10 mb-3 ${isDragging ? 'text-primary' : 'text-slate-400'}`} />
            <p className="text-base font-semibold text-gray-900 mb-1">
              {isDragging ? 'Drop your file here' : 'Upload Document Here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop files, or click to browse
            </p>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.webp"
            />
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                size="lg"
                className="gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              PDF, Word, Excel, CSV, or image files. Max 10 MB per file.
            </p>
          </div>
        </div>

        {/* Files */}
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
                Upload your financial statements, tax returns, entity documents,
                and property information to build your loan package.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <Card key={group.value}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    {group.label}
                    <Badge variant="outline" className="ml-2">{group.files.length}</Badge>
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
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.file_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.file_size)} •{' '}
                                {new Date(file.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-slate-50 text-slate-600 border-slate-200"
                              >
                                {CATEGORIES.find(c => c.value === file.category)?.label || file.category}
                              </Badge>
                              {file.review_status === 'approved' ? (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200 gap-1"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Approved
                                </Badge>
                              ) : file.review_status === 'declined' ? (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-red-50 text-red-700 border-red-200 gap-1"
                                >
                                  <XCircle className="h-3 w-3" />
                                  Declined
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 gap-1"
                                >
                                  <Clock className="h-3 w-3" />
                                  Pending Review
                                </Badge>
                              )}
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
            ))}

            {/* Ungrouped files (if any have categories not in the list) */}
            {files.filter(
              (f) => !CATEGORIES.some((c) => c.value === f.category)
            ).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Uncategorized</CardTitle>
                </CardHeader>
                <CardContent>
                  {files
                    .filter((f) => !CATEGORIES.some((c) => c.value === f.category))
                    .map((file) => {
                      const Icon = fileIcon(file.mime_type);
                      return (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 py-3"
                        >
                          <Icon className="h-5 w-5 text-slate-500" />
                          <span className="text-sm text-gray-900 truncate flex-1">
                            {file.file_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatFileSize(file.file_size)}
                          </span>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Share Link Warning Popup */}
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
              <h3 className="text-lg font-bold text-gray-900">
                Share Your Deal Room?
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              <strong className="text-amber-700">Warning:</strong> Anyone with this link
              can view <strong>all your uploaded files</strong>. Only share with
              trusted parties such as:
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
              The link expires in 7 days. You can generate a new one anytime (which
              revokes the previous link).
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowShareWarning(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gap-1.5"
                onClick={confirmGenerateShareLink}
              >
                <Link2 className="h-4 w-4" />
                Generate Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
