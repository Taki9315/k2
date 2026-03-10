"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
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

  const { toast } = useToast();
  const prevFileCountRef = useRef<number>(0);

  // Preview dialog
  const [previewFile, setPreviewFile] = useState<DealRoomFileWithUser | null>(
    null
  );

  // Note dialog
  const [reviewFile, setReviewFile] = useState<DealRoomFileWithUser | null>(
    null
  );
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

  const files = allFiles;

  const openReview = (file: DealRoomFileWithUser) => {
    setReviewFile(file);
    setReviewNote(file.admin_note || "");
  };

  const handleSaveNote = async () => {
    if (!reviewFile) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/application-docs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reviewFile.id,
          admin_note: reviewNote || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAllFiles((prev) =>
          prev.map((f) => (f.id === reviewFile.id ? data.file : f))
        );
        toast({
          title: "Note Saved",
          description: reviewFile.file_name,
        });
        setReviewFile(null);
      }
    } catch (err) {
      console.error("Save note error:", err);
    }
    setSaving(false);
  };

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

      {/* Document count */}
      <div className="flex gap-3 mb-6">
        <div className="rounded-xl border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          Total Documents ({allFiles.length})
        </div>
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

      {/* Note Dialog */}
      <Dialog
        open={!!reviewFile}
        onOpenChange={(open) => !open && setReviewFile(null)}
      >
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Add Note
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
                <Label>Note (optional)</Label>
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
              onClick={handleSaveNote}
              disabled={saving}
              className="gradient-green text-primary-foreground"
            >
              {saving ? "Saving…" : "Save Note"}
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
