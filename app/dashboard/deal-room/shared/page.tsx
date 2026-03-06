'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  owner: { name: string; company: string | null };
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

export default function SharedDealRoomPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [data, setData] = useState<ShareData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <h1 className="text-xl font-bold text-gray-900">
          {error || 'Share link not found'}
        </h1>
        <p className="text-sm text-gray-600 text-center max-w-md">
          This share link may have expired, been revoked, or is invalid. Contact
          the person who shared it for a new link.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

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
              Shared Deal Room
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Shared by <strong>{data.owner.name}</strong>
            {data.owner.company && (
              <span> ({data.owner.company})</span>
            )}
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
              {isExpired
                ? 'Expired'
                : `Expires ${expiresDate.toLocaleDateString()}`}
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
            This is a private deal room. These documents are confidential and
            shared for review purposes only. Do not distribute without
            the owner&apos;s permission.
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
                        <div key={file.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-4 w-4 text-slate-500" />
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
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
