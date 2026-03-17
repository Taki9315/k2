"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Download,
  FileText,
  Eye,
  Lock,
  ShieldCheck,
} from "lucide-react";

interface DocItem {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  category: string;
  doc_type: string;
}

function formatFileSize(bytes: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function isPdfUrl(url: string): boolean {
  return url.toLowerCase().endsWith(".pdf");
}

export default function DocumentLibraryPage() {
  const router = useRouter();
  const { user, loading: authLoading, isCertifiedBorrower, isKitBuyer } = useAuth();
  const hasPaidAccess = isCertifiedBorrower || isKitBuyer;

  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/document-library?type=application_document");
        if (res.ok) {
          const data = await res.json();
          setDocs(data.docs || []);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return docs;
    const q = searchQuery.toLowerCase();
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)) ||
        d.file_name.toLowerCase().includes(q)
    );
  }, [docs, searchQuery]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  // Kit buyers see an upgrade tease on restricted items;
  // Free/basic borrowers see full upgrade wall
  if (!hasPaidAccess) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <Lock className="h-16 w-16 text-slate-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Document Library
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Access professional loan application documents, templates, and
            checklists. Available to Success Kit and Certified Borrower members.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/membership/certified-borrower">
                Become a Certified Borrower
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/membership">View Membership Options</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Document Library
            </h1>
          </div>
          <p className="text-lg font-semibold text-primary max-w-2xl">
            Select the documents you need to prepare a professional loan package.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>
        </div>
      </section>

      {/* Document list */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-muted-foreground">Loading documents…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No documents match your search" : "No documents available yet"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try a different search term."
                : "Check back soon — new documents are added regularly."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((doc) => {
              const canViewOnline = isPdfUrl(doc.file_url);
              // Certified borrowers get full access; Kit buyers see a tease on certain items
              const isRestricted = !isCertifiedBorrower && isKitBuyer;

              return (
                <Card
                  key={doc.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <FileText className="h-5 w-5 text-slate-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-sm text-gray-500 truncate">
                          {doc.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {doc.category}
                        </Badge>
                        {doc.file_size > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(doc.file_size)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {canViewOnline && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="hidden sm:inline-flex"
                        >
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            View Online
                          </a>
                        </Button>
                      )}
                      <Button size="sm" asChild>
                        <a href={doc.file_url} download={doc.file_name}>
                          <Download className="h-4 w-4 mr-1.5" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Upgrade tease for Kit buyers */}
        {isKitBuyer && !isCertifiedBorrower && (
          <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
            <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unlock the Full Document Library
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Certified Borrowers get access to additional premium templates,
              checklists, and lender-ready documents.
            </p>
            <Button asChild>
              <Link href="/membership/certified-borrower">
                Upgrade to Certified Borrower
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
