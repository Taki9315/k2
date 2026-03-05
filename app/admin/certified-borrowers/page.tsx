"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  FileText,
  Download,
  Eye,
  ChevronDown,
  ChevronRight,
  Loader2,
  ExternalLink,
  FolderOpen,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DocumentPreviewDialog } from "@/components/admin/dialogs/DocumentPreviewDialog";

interface DealRoomFile {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category: string;
  review_status: "pending" | "approved" | "declined";
  created_at: string;
  signed_url: string | null;
}

interface CertifiedBorrower {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  preferred: boolean;
  created_at: string;
  files: DealRoomFile[];
  file_count: number;
}

const CATEGORY_CONFIG: Record<string, { label: string; className: string }> = {
  financials: {
    label: "Financial Statements",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "tax-returns": {
    label: "Tax Returns",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  "entity-docs": {
    label: "Entity Documents",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  property: {
    label: "Property Info",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  personal: {
    label: "Personal Docs",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  general: {
    label: "Other",
    className: "bg-gray-50 text-gray-600 border-gray-200",
  },
  "executive-summary": {
    label: "Executive Summary",
    className: "bg-teal-50 text-teal-700 border-teal-200",
  },
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border-yellow-300",
  },
  approved: {
    label: "Approved",
    className: "bg-green-50 text-green-700 border-green-300",
  },
  declined: {
    label: "Declined",
    className: "bg-red-50 text-red-700 border-red-300",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function CertifiedBorrowersPage() {
  const [borrowers, setBorrowers] = useState<CertifiedBorrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Preview dialog
  const [previewFile, setPreviewFile] = useState<DealRoomFile | null>(null);

  const fetchBorrowers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/certified-borrowers");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBorrowers(data.borrowers || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast({ title: "Error", description: "Failed to load certified borrowers." });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBorrowers();
  }, [fetchBorrowers]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredBorrowers.map((b) => b.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const filtered = search.trim()
    ? borrowers.filter(
        (b) =>
          (b.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
          b.email.toLowerCase().includes(search.toLowerCase())
      )
    : borrowers;

  const filteredBorrowers = filtered;

  const totalFiles = borrowers.reduce((acc, b) => acc + b.file_count, 0);

  return (
    <div>
      <PageHeader
        title="Certified Borrowers"
        description={`${borrowers.length} certified borrowers · ${totalFiles} documents uploaded`}
      />

      {/* Search & controls */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Input
          placeholder="Search by name, email, or membership #…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading certified borrowers…</span>
        </div>
      ) : filteredBorrowers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <User className="h-12 w-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">No certified borrowers found</p>
          <p className="text-sm">
            {search ? "Try adjusting your search." : "No users have been certified yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBorrowers.map((borrower) => {
            const isExpanded = expandedIds.has(borrower.id);
            return (
              <Card key={borrower.id} className="overflow-hidden">
                {/* Borrower row */}
                <button
                  onClick={() => toggleExpand(borrower.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/50 transition"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">
                        {borrower.full_name || borrower.email}
                      </span>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                        <Star className="h-3 w-3 fill-primary mr-0.5" />
                        Certified Borrower
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {borrower.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      <FolderOpen className="h-3 w-3 mr-1" />
                      {borrower.file_count} {borrower.file_count === 1 ? "doc" : "docs"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Joined {new Date(borrower.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </button>

                {/* Expanded: file list */}
                {isExpanded && (
                  <CardContent className="border-t bg-muted/20 px-5 py-4">
                    {borrower.files.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        No documents uploaded yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 gap-y-0.5 text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 pb-1">
                          <span>File Name</span>
                          <span>Category</span>
                          <span>Status</span>
                          <span>Uploaded</span>
                          <span>Actions</span>
                        </div>
                        {borrower.files.map((file) => {
                          const cat = CATEGORY_CONFIG[file.category] || CATEGORY_CONFIG.general;
                          const status = STATUS_CONFIG[file.review_status] || STATUS_CONFIG.pending;
                          return (
                            <div
                              key={file.id}
                              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-4 items-center rounded-lg border bg-background px-3 py-2.5 text-sm"
                            >
                              {/* File name */}
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="truncate font-medium">{file.file_name}</span>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  {formatFileSize(file.file_size)}
                                </span>
                              </div>

                              {/* Category */}
                              <Badge variant="outline" className={`text-[10px] ${cat.className}`}>
                                {cat.label}
                              </Badge>

                              {/* Status */}
                              <Badge variant="outline" className={`text-[10px] ${status.className}`}>
                                {status.label}
                              </Badge>

                              {/* Date */}
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(file.created_at).toLocaleDateString()}{" "}
                                {new Date(file.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>

                              {/* Actions */}
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  title="Preview"
                                  onClick={() => setPreviewFile(file)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                {file.signed_url && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    title="Download"
                                    asChild
                                  >
                                    <a href={file.signed_url} download={file.file_name} target="_blank" rel="noopener noreferrer">
                                      <Download className="h-3.5 w-3.5" />
                                    </a>
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  title="Open in Application Docs"
                                  onClick={() =>
                                    window.open(`/admin/application-docs`, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Document preview dialog */}
      {previewFile && (
        <DocumentPreviewDialog
          open={!!previewFile}
          onOpenChange={(open) => {
            if (!open) setPreviewFile(null);
          }}
          fileId={previewFile.id}
          fileName={previewFile.file_name}
          mimeType={previewFile.mime_type}
        />
      )}
    </div>
  );
}
