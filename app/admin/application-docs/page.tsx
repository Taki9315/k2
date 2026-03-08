"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  FileText,
  Eye,
  MessageSquare,
  User,
  Image as ImageIcon,
  Table2,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentPreviewDialog } from "@/components/admin/dialogs/DocumentPreviewDialog";
import { supabase } from "@/lib/supabase";

type DealRoomFileWithUser = {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category: string;
  document_name?: string | null;
  review_status: "pending" | "approved" | "declined";
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  profiles: { full_name: string | null; email: string } | null;
};

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
    label: "Property Related",
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
  transaction: {
    label: "Transaction Documentation",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  borrower: {
    label: "Borrower Documentation",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  business: {
    label: "Business Documentation",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  entity: {
    label: "Entity Documents",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-300",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    badgeClass: "bg-green-50 text-green-700 border-green-300",
  },
  declined: {
    label: "Declined",
    icon: XCircle,
    badgeClass: "bg-red-50 text-red-700 border-red-300",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function fileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    mimeType.includes("csv")
  )
    return Table2;
  return FileText;
}

export default function ApplicationDocsPage() {
  const [allFiles, setAllFiles] = useState<DealRoomFileWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationRequired, setMigrationRequired] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const prevFileCountRef = useRef<number>(0);

  // Preview dialog
  const [previewFile, setPreviewFile] = useState<DealRoomFileWithUser | null>(
    null
  );

  // Review dialog
  const [reviewFile, setReviewFile] = useState<DealRoomFileWithUser | null>(
    null
  );
  const [reviewStatus, setReviewStatus] = useState<string>("approved");
  const [reviewNote, setReviewNote] = useState("");
  const [saving, setSaving] = useState(false);

  // Always fetch ALL files (counts stay accurate); filter client-side
  const fetchFiles = useCallback(async (showNewToast = false) => {
    try {
      const res = await fetch("/api/admin/application-docs");
      if (res.ok) {
        const data = await res.json();
        const fetched: DealRoomFileWithUser[] = data.files || [];
        if (data._migrationRequired) setMigrationRequired(true);

        // Notify admin of new uploads
        if (showNewToast && fetched.length > prevFileCountRef.current) {
          const newCount = fetched.length - prevFileCountRef.current;
          const newest = fetched[0]; // ordered by created_at desc
          toast({
            title: `${newCount} new document${newCount > 1 ? "s" : ""} uploaded`,
            description: newest
              ? `${newest.file_name} by ${newest.profiles?.full_name || newest.profiles?.email || "a user"}`
              : undefined,
          });
        }
        prevFileCountRef.current = fetched.length;
        setAllFiles(fetched);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    setLoading(true);
    fetchFiles();
  }, [fetchFiles]);

  // Supabase realtime: listen for INSERT / UPDATE / DELETE on deal_room_files
  useEffect(() => {
    const channel = supabase
      .channel("admin-deal-room-files")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deal_room_files" },
        (payload) => {
          // Re-fetch on any change; show toast only for new inserts
          fetchFiles(payload.eventType === "INSERT");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchFiles]);

  // Client-side filtered list for display
  const files =
    statusFilter === "all"
      ? allFiles
      : allFiles.filter((f) => f.review_status === statusFilter);

  const openReview = (file: DealRoomFileWithUser) => {
    setReviewFile(file);
    setReviewStatus(
      file.review_status === "pending" ? "approved" : file.review_status
    );
    setReviewNote(file.admin_note || "");
  };

  const handleReview = async () => {
    if (!reviewFile) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/application-docs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reviewFile.id,
          review_status: reviewStatus,
          admin_note: reviewNote || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAllFiles((prev) =>
          prev.map((f) => (f.id === reviewFile.id ? data.file : f))
        );
        toast({
          title:
            reviewStatus === "approved"
              ? "Document Approved"
              : reviewStatus === "declined"
              ? "Document Declined"
              : "Status Updated",
          description: reviewFile.file_name,
        });
        setReviewFile(null);
      }
    } catch (err) {
      console.error("Review error:", err);
    }
    setSaving(false);
  };

  const quickApprove = async (file: DealRoomFileWithUser) => {
    try {
      const res = await fetch("/api/admin/application-docs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: file.id,
          review_status: "approved",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAllFiles((prev) =>
          prev.map((f) => (f.id === file.id ? data.file : f))
        );
        toast({ title: "Approved", description: file.file_name });
      }
    } catch (err) {
      console.error("Quick approve error:", err);
    }
  };

  const quickDecline = async (file: DealRoomFileWithUser) => {
    try {
      const res = await fetch("/api/admin/application-docs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: file.id,
          review_status: "declined",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAllFiles((prev) =>
          prev.map((f) => (f.id === file.id ? data.file : f))
        );
        toast({ title: "Declined", description: file.file_name });
      }
    } catch (err) {
      console.error("Quick decline error:", err);
    }
  };

  // Stats — always computed from allFiles so counts stay accurate regardless of filter
  const pendingCount = allFiles.filter(
    (f) => f.review_status === "pending"
  ).length;
  const approvedCount = allFiles.filter(
    (f) => f.review_status === "approved"
  ).length;
  const declinedCount = allFiles.filter(
    (f) => f.review_status === "declined"
  ).length;

  const columns = [
    {
      key: "file_name",
      header: "Document",
      render: (f: DealRoomFileWithUser) => {
        const Icon = fileIcon(f.mime_type);
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              {f.document_name && (
                <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-semibold mr-1.5">
                  {f.document_name}
                </span>
              )}
              <span className="font-medium text-foreground text-sm">
                {f.file_name}
              </span>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(f.file_size)}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "user",
      header: "Uploaded By",
      render: (f: DealRoomFileWithUser) => (
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {f.profiles?.full_name || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              {f.profiles?.email || f.user_id.slice(0, 8)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (f: DealRoomFileWithUser) => {
        const cat = CATEGORY_CONFIG[f.category] || { label: f.category, className: "bg-gray-50 text-gray-600 border-gray-200" };
        return (
          <Badge variant="outline" className={`text-xs font-medium ${cat.className}`}>
            {cat.label}
          </Badge>
        );
      },
    },
    {
      key: "review_status",
      header: "Status",
      render: (f: DealRoomFileWithUser) => {
        const cfg = STATUS_CONFIG[f.review_status] || STATUS_CONFIG.pending;
        const Icon = cfg.icon;
        return (
          <Badge variant="outline" className={`text-xs gap-1 ${cfg.badgeClass}`}>
            <Icon className="h-3 w-3" />
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: "created_at",
      header: "Uploaded",
      render: (f: DealRoomFileWithUser) => {
        const d = new Date(f.created_at);
        return (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            <span>{d.toLocaleDateString()}</span>
            <span className="block text-xs text-muted-foreground/70">
              {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "",
      render: (f: DealRoomFileWithUser) => (
        <div className="flex items-center gap-1">
          {f.review_status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => quickApprove(f)}
                title="Approve"
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => quickDecline(f)}
                title="Decline"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setPreviewFile(f)}
            title="Preview document"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openReview(f)}
            title="Review with note"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a
              href={`/api/admin/application-docs/download?fileId=${f.id}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Download"
            >
              <Download className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      ),
    },
  ] satisfies Column<DealRoomFileWithUser>[];

  return (
    <div>
      <PageHeader
        title="Application Documents"
        description="Review documents uploaded by users in their Deal Rooms"
      />

      {/* Stats row */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === "all"
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          All ({allFiles.length})
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === "pending"
              ? "border-yellow-400 bg-yellow-50 text-yellow-700"
              : "border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <Clock className="inline h-3.5 w-3.5 mr-1" />
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter("approved")}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === "approved"
              ? "border-green-400 bg-green-50 text-green-700"
              : "border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <CheckCircle2 className="inline h-3.5 w-3.5 mr-1" />
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setStatusFilter("declined")}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === "declined"
              ? "border-red-400 bg-red-50 text-red-700"
              : "border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <XCircle className="inline h-3.5 w-3.5 mr-1" />
          Declined ({declinedCount})
        </button>
      </div>

      {migrationRequired && (
        <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
          <p className="font-semibold">Database migration required</p>
          <p className="mt-1">
            The review columns have not been added to{" "}
            <code className="bg-yellow-100 px-1 rounded">deal_room_files</code>{" "}
            yet. Run the migration in your{" "}
            <strong>Supabase SQL Editor</strong>:
          </p>
          <code className="mt-2 block whitespace-pre-wrap bg-yellow-100 rounded p-2 text-xs">
            supabase/migrations/20260305000000_create_application_docs.sql
          </code>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground py-12 text-center">
          Loading documents...
        </p>
      ) : (
        <DataTable
          data={files}
          columns={columns}
          searchKey="file_name"
          searchPlaceholder="Search documents..."
        />
      )}

      {/* Review Dialog */}
      <Dialog
        open={!!reviewFile}
        onOpenChange={(open) => !open && setReviewFile(null)}
      >
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Review Document
            </DialogTitle>
          </DialogHeader>
          {reviewFile && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">
                  {reviewFile.document_name ? (
                    <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-semibold mr-2">
                      {reviewFile.document_name}
                    </span>
                  ) : null}
                  {reviewFile.file_name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Uploaded by{" "}
                  {reviewFile.profiles?.full_name || reviewFile.profiles?.email}{" "}
                  on {new Date(reviewFile.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Category:{" "}
                  {CATEGORY_CONFIG[reviewFile.category]?.label || reviewFile.category} •{" "}
                  {formatFileSize(reviewFile.file_size)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Decision</Label>
                <Select value={reviewStatus} onValueChange={setReviewStatus}>
                  <SelectTrigger className="bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="approved">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        Approve
                      </span>
                    </SelectItem>
                    <SelectItem value="declined">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                        Decline
                      </span>
                    </SelectItem>
                    <SelectItem value="pending">
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-yellow-600" />
                        Reset to Pending
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Note to user (optional)</Label>
                <Input
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="e.g. Please re-upload with updated figures"
                  className="bg-secondary"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewFile(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={saving}
              className={
                reviewStatus === "approved"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : reviewStatus === "declined"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "gradient-green text-primary-foreground"
              }
            >
              {saving
                ? "Saving…"
                : reviewStatus === "approved"
                ? "Approve"
                : reviewStatus === "declined"
                ? "Decline"
                : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog — FlipbookViewer for PDFs, image viewer for images */}
      {previewFile && (
        <DocumentPreviewDialog
          open={!!previewFile}
          onOpenChange={(open) => !open && setPreviewFile(null)}
          fileId={previewFile.id}
          fileName={previewFile.file_name}
          mimeType={previewFile.mime_type}
        />
      )}
    </div>
  );
}
