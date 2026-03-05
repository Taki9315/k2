"use client";

import { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Loader2, X, FileText, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

export type ResourceRow = {
  id: string;
  title: string;
  description: string;
  type: "video" | "pdf" | "link" | "image";
  url: string | null;
  file_url: string | null;
  file_path: string | null;
  thumbnail_url: string | null;
  access_level: "public" | "members_only";
  category: string;
  tags: string[];
  keywords: string;
  is_published: boolean;
  view_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const CATEGORIES = [
  "General",
  "Tools & Calculators",
  "Education",
  "Templates",
  "Guides",
  "Market Data",
  "Legal & Compliance",
  "Partner Resources",
];

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: ResourceRow | null;
  onSaved: () => void;
}

function slugifyFile(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ResourceDialog({
  open,
  onOpenChange,
  resource,
  onSaved,
}: ResourceDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"video" | "pdf" | "link" | "image">("link");
  const [url, setUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [accessLevel, setAccessLevel] = useState<"public" | "members_only">("public");
  const [category, setCategory] = useState("General");
  const [tagsStr, setTagsStr] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setDescription(resource.description);
      setType(resource.type);
      setUrl(resource.url ?? "");
      setFileUrl(resource.file_url ?? "");
      setFilePath(resource.file_path ?? "");
      setFileName(resource.file_url ? resource.file_url.split("/").pop() ?? "" : "");
      setThumbnailUrl(resource.thumbnail_url ?? "");
      setAccessLevel(resource.access_level);
      setCategory(resource.category);
      setTagsStr(resource.tags.join(", "));
      setKeywords(resource.keywords ?? "");
      setIsPublished(resource.is_published);
    } else {
      setTitle("");
      setDescription("");
      setType("link");
      setUrl("");
      setFileUrl("");
      setFilePath("");
      setFileName("");
      setThumbnailUrl("");
      setAccessLevel("public");
      setCategory("General");
      setTagsStr("");
      setKeywords("");
      setIsPublished(true);
    }
  }, [resource, open]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${slugifyFile(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;

      const { data, error } = await supabase.storage
        .from("resource-files")
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("resource-files").getPublicUrl(data.path);

      setFileUrl(publicUrl);
      setFilePath(data.path);
      setFileName(file.name);

      // Auto-detect type from file
      if (file.type === "application/pdf") {
        setType("pdf");
      } else if (file.type.startsWith("image/")) {
        setType("image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `thumbnails/${Date.now()}-${slugifyFile(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;

      const { data, error } = await supabase.storage
        .from("resource-files")
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("resource-files").getPublicUrl(data.path);

      setThumbnailUrl(publicUrl);
    } catch (err) {
      console.error("Thumbnail upload error:", err);
      alert("Failed to upload thumbnail. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setSaving(true);
    try {
      const record = {
        title: title.trim(),
        description: description.trim(),
        type,
        url: url.trim() || null,
        file_url: fileUrl.trim() || null,
        file_path: filePath.trim() || null,
        thumbnail_url: thumbnailUrl.trim() || null,
        access_level: accessLevel,
        category,
        tags: tagsStr
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        keywords: keywords.trim(),
        is_published: isPublished,
      };

      const method = resource ? "PUT" : "POST";
      const body = resource ? { ...record, id: resource.id } : record;

      const res = await fetch("/api/admin/resources", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save resource. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {resource ? "Edit Resource" : "Add Resource"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Title <span className="text-red-500">*</span></Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
              className="bg-secondary"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this resource"
              className="bg-secondary"
              rows={3}
            />
          </div>

          {/* Type + Access Level row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type <span className="text-red-500">*</span></Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as typeof type)}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Access <span className="text-red-500">*</span></Label>
              <Select
                value={accessLevel}
                onValueChange={(v) =>
                  setAccessLevel(v as "public" | "members_only")
                }
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="members_only">Members Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* URL (for videos, links, or external resources) */}
          <div className="space-y-2">
            <Label>
              {type === "video" ? "Video URL (YouTube / Vimeo)" : "URL"}
            </Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                type === "video"
                  ? "https://youtube.com/watch?v=..."
                  : "https://..."
              }
              className="bg-secondary"
            />
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <Label>
              File Upload {type === "pdf" ? "(PDF)" : type === "image" ? "(Image)" : "(optional)"}
            </Label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept={
                  type === "pdf"
                    ? ".pdf"
                    : type === "image"
                      ? "image/*"
                      : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,.mp3,.zip,image/*"
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {uploading ? "Uploading..." : "Choose File"}
              </Button>
              {fileName && (
                <div className="flex items-center gap-2">
                  {type === "pdf" ? (
                    <FileText className="h-4 w-4 text-red-500" />
                  ) : type === "image" ? (
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                  ) : null}
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {fileName}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => {
                      setFileUrl("");
                      setFilePath("");
                      setFileName("");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div className="flex items-center gap-3">
              <input
                ref={thumbInputRef}
                type="file"
                className="hidden"
                onChange={handleThumbnailUpload}
                accept="image/*"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => thumbInputRef.current?.click()}
                disabled={uploading}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Thumbnail
              </Button>
              {thumbnailUrl && (
                <div className="flex items-center gap-2">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className="h-8 w-8 rounded object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => setThumbnailUrl("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            {!thumbnailUrl && (
              <Input
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Or paste thumbnail URL"
                className="bg-secondary mt-1"
              />
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="education, sba, tools"
              className="bg-secondary"
            />
          </div>

          {/* Keywords (SEO) */}
          <div className="space-y-2">
            <Label>Keywords (SEO)</Label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="commercial loan, SBA 504, financing guide"
              className="bg-secondary"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated keywords for search optimization
            </p>
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Published</p>
              <p className="text-xs text-muted-foreground">
                Make this resource visible to users
              </p>
            </div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !title.trim()}
            className="gradient-green text-primary-foreground"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {resource ? "Save Changes" : "Add Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
