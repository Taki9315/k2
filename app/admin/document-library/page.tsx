"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ApplicationDocDialog,
  type ApplicationDoc,
} from "@/components/admin/dialogs/ApplicationDocDialog";
import { ConfirmDialog } from "@/components/admin/dialogs/ConfirmDialog";

const DOC_TYPE_LABELS: Record<string, string> = {
  application_document: "Application Document",
  resource: "Resource / Free",
  partner_document: "Partner Document",
};

const CATEGORY_LABELS: Record<string, string> = {
  template: "Template",
  checklist: "Checklist",
  form: "Form",
  guide: "Guide",
  other: "Other",
};

function formatFileSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DocumentLibraryAdminPage() {
  const [docs, setDocs] = useState<ApplicationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<ApplicationDoc | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<ApplicationDoc | null>(null);
  const { toast } = useToast();

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/document-library");
      if (res.ok) {
        const data = await res.json();
        setDocs(data.docs || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleDelete = async () => {
    if (!deleteDoc) return;
    try {
      const res = await fetch(
        `/api/admin/document-library?id=${deleteDoc.id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setDocs((prev) => prev.filter((d) => d.id !== deleteDoc.id));
        toast({ title: "Document deleted", description: deleteDoc.title });
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
    setDeleteDoc(null);
  };

  const toggleActive = async (doc: ApplicationDoc) => {
    try {
      const res = await fetch("/api/admin/document-library", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doc.id, is_active: !doc.is_active }),
      });
      if (res.ok) {
        setDocs((prev) =>
          prev.map((d) =>
            d.id === doc.id ? { ...d, is_active: !d.is_active } : d
          )
        );
        toast({ title: doc.is_active ? "Deactivated" : "Activated" });
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const columns: Column<ApplicationDoc>[] = [
    {
      key: "title",
      header: "Document",
      render: (d) => (
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <span className="font-medium text-foreground">{d.title}</span>
            {d.description && (
              <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                {d.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "doc_type",
      header: "Type",
      render: (d) => (
        <Badge variant="outline" className="text-xs">
          {DOC_TYPE_LABELS[d.doc_type] || d.doc_type}
        </Badge>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (d) => (
        <Badge variant="secondary" className="text-xs">
          {CATEGORY_LABELS[d.category] || d.category}
        </Badge>
      ),
    },
    {
      key: "file_size",
      header: "Size",
      render: (d) => (
        <span className="text-sm text-muted-foreground">
          {formatFileSize(d.file_size)}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (d) => (
        <Badge
          variant={d.is_active ? "default" : "secondary"}
          className="text-xs"
        >
          {d.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (d) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => toggleActive(d)}
            title={d.is_active ? "Deactivate" : "Activate"}
          >
            {d.is_active ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setEditDoc(d);
              setDialogOpen(true);
            }}
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a
              href={d.file_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Download"
            >
              <Download className="h-3.5 w-3.5" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700"
            onClick={() => setDeleteDoc(d)}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Document Library"
        description="Manage downloadable application documents for Kit and Certified Borrowers"
      />

      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            setEditDoc(null);
            setDialogOpen(true);
          }}
          className="gradient-green text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground">Loading documents…</p>
        </div>
      ) : (
        <DataTable columns={columns} data={docs} searchKey="title" searchPlaceholder="Search documents…" />
      )}

      <ApplicationDocDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditDoc(null);
        }}
        doc={editDoc}
        onSaved={fetchDocs}
      />

      <ConfirmDialog
        open={!!deleteDoc}
        onOpenChange={(open) => !open && setDeleteDoc(null)}
        title="Delete Document"
        description={`Are you sure you want to delete "${deleteDoc?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
