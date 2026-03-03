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
  File,
  Image as ImageIcon,
  Table2,
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
  const { user, loading, isCertifiedBorrower, isAdmin } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<DealRoomFile[]>([]);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const hasAccess = isCertifiedBorrower || isAdmin;

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
            The Deal Room is available to K2 Certified Borrowers. Upload your
            loan documents, organize by category, and prepare for lender
            submission.
          </p>
          <Button asChild>
            <Link href="/membership/certified-borrower">
              Become Certified
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
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload section */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.webp"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
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
            </div>
            <p className="text-xs text-gray-500 mt-3">
              PDF, Word, Excel, CSV, or image files. Max 10 MB per file.
            </p>
          </CardContent>
        </Card>

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
                        <div
                          key={file.id}
                          className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
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
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700 border-green-200 gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Uploaded
                            </Badge>
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
    </div>
  );
}
