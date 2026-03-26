"use client";

import type { ReactNode } from "react";
import { useState, useEffect, useCallback } from "react";
import { Plus, ExternalLink, Pencil, Trash2, Video, FileText, Link, Eye, EyeOff, Image, ArrowUp, ArrowDown } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ResourceDialog, type ResourceRow } from "@/components/admin/dialogs/ResourceDialog";
import { ConfirmDialog } from "@/components/admin/dialogs/ConfirmDialog";

const typeIcons: Record<string, ReactNode> = {
  video: <Video className="h-3.5 w-3.5" />,
  pdf: <FileText className="h-3.5 w-3.5" />,
  link: <Link className="h-3.5 w-3.5" />,
  image: <Image className="h-3.5 w-3.5" />,
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [resDialog, setResDialog] = useState(false);
  const [editRes, setEditRes] = useState<ResourceRow | null>(null);
  const [deleteRes, setDeleteRes] = useState<ResourceRow | null>(null);

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/resources");
      if (!res.ok) throw new Error("Failed to fetch resources");
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error("Error fetching resources:", err);
      toast({ title: "Error", description: "Failed to load resources", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDelete = async () => {
    if (!deleteRes) return;
    try {
      const res = await fetch(`/api/admin/resources?id=${deleteRes.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setResources((prev) => prev.filter((r) => r.id !== deleteRes.id));
      toast({ title: "Resource deleted", description: deleteRes.title });
    } catch (err) {
      console.error("Delete error:", err);
      toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
    }
    setDeleteRes(null);
  };

  const togglePublish = async (item: ResourceRow) => {
    try {
      const res = await fetch("/api/admin/resources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, is_published: !item.is_published }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setResources((prev) =>
        prev.map((r) =>
          r.id === item.id ? { ...r, is_published: !r.is_published } : r
        )
      );
      toast({ title: item.is_published ? "Unpublished" : "Published" });
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  const getResourceUrl = (r: ResourceRow) => r.file_url || r.url || "#";

  const moveResource = async (index: number, direction: "up" | "down") => {
    const newResources = [...resources];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newResources.length) return;

    // Swap
    [newResources[index], newResources[targetIndex]] = [
      newResources[targetIndex],
      newResources[index],
    ];

    // Reassign sort_order values
    const items = newResources.map((r, i) => ({ id: r.id, sort_order: i }));
    setResources(newResources.map((r, i) => ({ ...r, sort_order: i })));

    try {
      const res = await fetch("/api/admin/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
    } catch (err) {
      console.error("Reorder error:", err);
      toast({ title: "Error", description: "Failed to reorder resources", variant: "destructive" });
      await fetchResources(); // revert on error
    }
  };

  const columns = [
    {
      key: "order",
      header: "Order",
      render: (r: ResourceRow) => {
        const index = resources.findIndex((res) => res.id === r.id);
        return (
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={index === 0}
              onClick={() => moveResource(index, "up")}
              title="Move up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              disabled={index === resources.length - 1}
              onClick={() => moveResource(index, "down")}
              title="Move down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
    {
      key: "title",
      header: "Title",
      render: (r: ResourceRow) => (
        <div>
          <span className="font-medium text-foreground">{r.title}</span>
          {r.description && (
            <p className="text-xs text-muted-foreground truncate max-w-[250px]">{r.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (r: ResourceRow) => (
        <div className="flex items-center gap-1.5 capitalize">
          {typeIcons[r.type]}
          <span>{r.type}</span>
        </div>
      ),
    },
    {
      key: "access_level",
      header: "Access",
      render: (r: ResourceRow) => (
        <Badge
          variant={r.access_level === "public" ? "secondary" : "default"}
          className="text-xs"
        >
          {r.access_level === "public" ? "Public" : "Members Only"}
        </Badge>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (r: ResourceRow) => (
        <div className="flex gap-1 flex-wrap">
          {r.tags.map((t) => (
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "is_published",
      header: "Status",
      render: (r: ResourceRow) => (
        <Badge variant={r.is_published ? "default" : "outline"} className="text-xs">
          {r.is_published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (r: ResourceRow) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => togglePublish(r)}
            title={r.is_published ? "Unpublish" : "Publish"}
          >
            {r.is_published ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => window.open(getResourceUrl(r), "_blank")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setEditRes(r);
              setResDialog(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => setDeleteRes(r)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ] satisfies Column<ResourceRow>[];

  return (
    <div>
      <PageHeader
        title="Resource Library"
        description="Videos, PDFs, and links for members"
        action={{
          label: "Add Resource",
          icon: Plus,
          onClick: () => {
            setEditRes(null);
            setResDialog(true);
          },
        }}
      />
      {loading ? (
        <p className="text-muted-foreground py-12 text-center">Loading resources...</p>
      ) : (
        <DataTable
          data={resources}
          columns={columns}
          searchKey="title"
          searchPlaceholder="Search resources..."
        />
      )}
      <ResourceDialog
        open={resDialog}
        onOpenChange={setResDialog}
        resource={editRes}
        onSaved={() => {
          fetchResources();
          toast({ title: editRes ? "Resource updated" : "Resource added" });
        }}
      />
      <ConfirmDialog
        open={!!deleteRes}
        onOpenChange={() => setDeleteRes(null)}
        title="Delete Resource"
        description={`Are you sure you want to delete "${deleteRes?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
