'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CertifiedBorrowerBadge } from '@/components/CertifiedBorrowerBadge';
import {
  Shield,
  FileText,
  Loader2,
  FolderOpen,
  AlertTriangle,
  Download,
  Clock,
  Image as ImageIcon,
  Table2,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

type SharedFile = {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  category: string;
  created_at: string;
};

type ShareData = {
  files: SharedFile[];
  dealName: string;
  owner: {
    name: string;
    company: string | null;
    isCertified: boolean;
    membershipNumber: string | null;
  };
  expiresAt: string;
};

const CATEGORIES: Record<string, string> = {
  financials: 'Financial Statements',
  'tax-returns': 'Tax Returns',
  'entity-docs': 'Entity Documents',
  property: 'Property Info',
  personal: 'Personal Docs',
  general: 'Other',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv'))
    return Table2;
  return FileText;
}

function SharedDealRoomContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [data, setData] = useState<ShareData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Password state
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('No share token provided');
      setLoading(false);
      return;
    }

    fetch(`/api/deal-room/share?token=${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || 'Invalid share link');
        }
        return res.json();
      })
      .then((d) => {
        if (d.requiresPassword) {
          setRequiresPassword(true);
        } else {
          setData(d);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handlePasswordSubmit = async () => {
    if (!passwordInput.trim() || !token) return;
    setPasswordLoading(true);
    setPasswordError(null);

    try {
      const res = await fetch('/api/deal-room/share', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: passwordInput }),
      });

      if (!res.ok) {
        const body = await res.json();
        setPasswordError(body.error || 'Incorrect password');
        setPasswordLoading(false);
        return;
      }

      const d = await res.json();
      setData(d);
      setRequiresPassword(false);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to verify password');
    }
    setPasswordLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || (!data && !requiresPassword)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <h1 className="text-xl font-bold text-gray-900">{error || 'Share link not found'}</h1>
        <p className="text-sm text-gray-600 text-center max-w-md">
          This share link may have expired, been revoked, or is invalid. Contact the person who
          shared it for a new link.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  // Password entry screen
  if (requiresPassword && !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Password Required</h2>
            <p className="text-sm text-gray-600 mb-6">
              This deal room is password-protected. Enter the password to view the documents.
            </p>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePasswordSubmit();
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
            {passwordError && (
              <p className="text-sm text-red-600 mb-4">{passwordError}</p>
            )}
            <Button
              className="w-full"
              onClick={handlePasswordSubmit}
              disabled={passwordLoading || !passwordInput.trim()}
            >
              {passwordLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Unlock Deal Room'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const expiresDate = new Date(data.expiresAt);
  const isExpired = expiresDate < new Date();

  // Group files by category
  const grouped = Object.entries(
    data.files.reduce<Record<string, SharedFile[]>>((acc, file) => {
      const cat = file.category || 'general';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(file);
      return acc;
    }, {})
  ).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-1">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-gray-900">
              {data.dealName || 'Shared Deal Room'}
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Shared by <strong>{data.owner.name}</strong>
            {data.owner.company && <span> ({data.owner.company})</span>}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant="outline"
              className={`text-xs gap-1 ${
                isExpired
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <Clock className="h-3 w-3" />
              {isExpired ? 'Expired' : `Expires ${expiresDate.toLocaleDateString()}`}
            </Badge>
            <Badge variant="outline" className="text-xs gap-1">
              {data.files.length} file{data.files.length !== 1 && 's'}
            </Badge>
          </div>
        </div>
      </section>

      {/* Warning banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            This is a private deal room. These documents are confidential and shared for review
            purposes only. Do not distribute without the owner&apos;s permission.
          </p>
        </div>
      </div>

      {/* Files */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {data.files.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No Documents</h3>
              <p className="text-sm text-gray-600">
                This deal room doesn&apos;t have any documents yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {grouped.map(([category, files]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    {CATEGORIES[category] || category}
                    <Badge variant="outline" className="ml-1 text-xs">
                      {files.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {files.map((file) => {
                      const Icon = getFileIcon(file.mime_type);
                      return (
                        <div
                          key={file.id}
                          className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3"
                        >
                          <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.file_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.file_size)} &bull;{' '}
                              {new Date(file.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Certified Borrower Badge - shown at bottom center */}
        {data.owner.isCertified && (
          <div className="mt-10 mb-6 flex justify-center">
            <CertifiedBorrowerBadge
              fullName={data.owner.name}
              membershipNumber={data.owner.membershipNumber}
              variant="full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SharedDealRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SharedDealRoomContent />
    </Suspense>
  );
}
