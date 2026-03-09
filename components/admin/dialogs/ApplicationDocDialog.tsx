"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/admin/FileUpload";
import { Loader2 } from "lucide-react";

export interface ApplicationDoc {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  category: string;
  doc_type: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ApplicationDocDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doc?: ApplicationDoc | null;
  onSaved: () => void;
}

const CATEGORIES = [
  { value: "template", label: "Template" },
  { value: "checklist", label: "Checklist" },
  { value: "form", label: "Form" },
  { value: "guide", label: "Guide" },
  { value: "other", label: "Other" },
];

const DOC_TYPES = [
  { value: "application_document", label: "Application Document" },
  { value: "resource", label: "Resource / Free Content" },
  { value: "partner_document", label: "Partner Document" },
];

export function ApplicationDocDialog({
  open,
  onOpenChange,
  doc,
  onSaved,
}: ApplicationDocDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState("template");
  const [docType, setDocType] = useState("application_document");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setDescription(doc.description || "");
      setFileUrl(doc.file_url);
      setFileName(doc.file_name);
      setCategory(doc.category);
      setDocType(doc.doc_type || "application_document");
      setSortOrder(doc.sort_order);
    } else {
      setTitle("");
      setDescription("");
      setFileUrl("");
      setFileName("");
      setCategory("template");
      setDocType("application_document");
      setSortOrder(0);
    }
  }, [doc, open]);

  const handleSubmit = async () => {
    if (!title.trim() || !fileUrl) return;
    setSaving(true);

    try {
      const payload = {
        ...(doc ? { id: doc.id } : {}),
        title,
        description: description || null,
        file_name: fileName || title,
        file_url: fileUrl,
        file_size: 0,
        mime_type: "application/pdf",
        category,
        doc_type: docType,
        sort_order: sortOrder,
      };

      const res = await fetch("/api/admin/document-library", {
        method: doc ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error("Save error:", err);
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle>
            {doc ? "Edit Application Document" : "Upload Application Document"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Loan Application Template"
              className="bg-secondary"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="bg-secondary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select
                value={docType}
                onValueChange={setDocType}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {DOC_TYPES.map((dt) => (
                    <SelectItem key={dt.value} value={dt.value}>
                      {dt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              Document File <span className="text-red-500">*</span>
            </Label>
            <FileUpload
              value={fileUrl}
              onChange={(url) => {
                setFileUrl(url);
                // Extract filename from URL
                if (url) {
                  const parts = url.split("/");
                  setFileName(parts[parts.length - 1] || title);
                }
              }}
              folder="application-docs"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              label="Upload document file"
            />
          </div>
          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="bg-secondary w-24"
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !title.trim() || !fileUrl}
            className="gradient-green text-primary-foreground"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : doc ? (
              "Save Changes"
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
