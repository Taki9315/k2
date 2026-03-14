"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bot,
  Plus,
  Pencil,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Trash2,
  Loader2,
  GripVertical,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface Prompt {
  id: string;
  title: string;
  content: string;
  order: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  // Preview state
  const [previewPrompt, setPreviewPrompt] = useState<Prompt | null>(null);

  // Delete confirmation
  const [deletePrompt, setDeletePrompt] = useState<Prompt | null>(null);

  /* ── Fetch ─────────────────────────────────────────────────── */

  const fetchPrompts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/prompts");
      if (!res.ok) throw new Error("Failed to fetch prompts");
      const data = await res.json();
      setPrompts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  /* ── Create / Update ───────────────────────────────────────── */

  const openCreateDialog = () => {
    setEditingPrompt(null);
    setFormTitle("");
    setFormContent("");
    setDialogOpen(true);
  };

  const openEditDialog = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormTitle(prompt.title);
    setFormContent(prompt.content);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim()) return;
    setSaving(true);

    try {
      if (editingPrompt) {
        // Update
        const res = await fetch("/api/admin/prompts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingPrompt.id,
            title: formTitle.trim(),
            content: formContent.trim(),
          }),
        });
        if (!res.ok) throw new Error("Failed to update prompt");
      } else {
        // Create
        const res = await fetch("/api/admin/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            content: formContent.trim(),
          }),
        });
        if (!res.ok) throw new Error("Failed to create prompt");
      }

      setDialogOpen(false);
      await fetchPrompts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Toggle visibility ─────────────────────────────────────── */

  const toggleVisibility = async (prompt: Prompt) => {
    try {
      const res = await fetch("/api/admin/prompts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prompt.id, is_hidden: !prompt.is_hidden }),
      });
      if (!res.ok) throw new Error("Failed to toggle visibility");
      await fetchPrompts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* ── Reorder ───────────────────────────────────────────────── */

  const movePrompt = async (index: number, direction: "up" | "down") => {
    const newPrompts = [...prompts];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPrompts.length) return;

    // Swap
    [newPrompts[index], newPrompts[targetIndex]] = [
      newPrompts[targetIndex],
      newPrompts[index],
    ];

    // Reassign order values
    const items = newPrompts.map((p, i) => ({ id: p.id, order: i }));
    setPrompts(newPrompts.map((p, i) => ({ ...p, order: i })));

    try {
      const res = await fetch("/api/admin/prompts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
    } catch (err: any) {
      setError(err.message);
      await fetchPrompts(); // revert on error
    }
  };

  /* ── Delete ────────────────────────────────────────────────── */

  const handleDelete = async () => {
    if (!deletePrompt) return;
    try {
      const res = await fetch("/api/admin/prompts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletePrompt.id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setDeletePrompt(null);
      await fetchPrompts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  /* ── Render ────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Prep Coach Prompts
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage prompts displayed on the public Prep Coach page
            </p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Prompt
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-muted-foreground mt-1 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Prompts list */}
      {prompts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-muted-foreground/30 p-12 text-center">
          <Bot className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium mb-2">
            No prompts yet
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Create your first Prep Coach prompt to display on the public page.
          </p>
          <Button onClick={openCreateDialog} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Prompt
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {prompts.map((prompt, index) => (
            <div
              key={prompt.id}
              className={`group rounded-xl border bg-card p-5 transition-all hover:shadow-md ${
                prompt.is_hidden ? "opacity-60 border-dashed" : "border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Grip indicator */}
                <div className="pt-1 text-muted-foreground/40">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-wider">
                      #{index + 1}
                    </span>
                    {prompt.is_hidden && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <EyeOff className="h-3 w-3" />
                        Hidden
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {prompt.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {prompt.content || "No content"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Reorder */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === 0}
                    onClick={() => movePrompt(index, "up")}
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === prompts.length - 1}
                    onClick={() => movePrompt(index, "down")}
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>

                  {/* Preview */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPreviewPrompt(prompt)}
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  {/* Edit */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEditDialog(prompt)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Toggle visibility */}
                  <div className="flex items-center gap-1.5 px-2">
                    <Switch
                      checked={!prompt.is_hidden}
                      onCheckedChange={() => toggleVisibility(prompt)}
                    />
                  </div>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeletePrompt(prompt)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create/Edit Dialog ──────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPrompt ? "Edit Prompt" : "New Prompt"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="prompt-title">Title</Label>
              <Input
                id="prompt-title"
                placeholder="e.g., Preparing Your Executive Summary"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt-content">Content</Label>
              <Textarea
                id="prompt-content"
                placeholder="Enter the prompt content / instructions..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !formTitle.trim()}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingPrompt ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Preview Dialog ──────────────────────────────────── */}
      <Dialog
        open={!!previewPrompt}
        onOpenChange={() => setPreviewPrompt(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewPrompt?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
              {previewPrompt?.content || "No content"}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ─────────────────────────────── */}
      <AlertDialog
        open={!!deletePrompt}
        onOpenChange={() => setDeletePrompt(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deletePrompt?.title}
              &rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
