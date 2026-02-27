"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, X, Loader2, Eye } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProviderDialog } from "@/components/admin/dialogs/ProviderDialog";
import { ViewDialog } from "@/components/admin/dialogs/ViewDialog";
import { ConfirmDialog } from "@/components/admin/dialogs/ConfirmDialog";

export interface ProviderRow {
  id: string;
  name: string;
  email: string;
  company: string;
  type: string;
  state: string;
  website: string | null;
  description: string;
  status: "pending" | "approved" | "declined";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Adapter for the existing ProviderDialog which uses the old mock shape
function toDialogProvider(p: ProviderRow) {
  return {
    id: p.id,
    name: p.company || p.name,
    type: p.type,
    state: p.state,
    contact: p.email,
    approved: p.status === "approved",
  };
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [providerDialog, setProviderDialog] = useState(false);
  const [editProvider, setEditProvider] = useState<ReturnType<typeof toDialogProvider> | null>(null);
  const [viewProvider, setViewProvider] = useState<ProviderRow | null>(null);
  const [deleteProvider, setDeleteProvider] = useState<ProviderRow | null>(null);

  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/providers");
      if (!res.ok) throw new Error("Failed to fetch providers");
      const data: ProviderRow[] = await res.json();
      setProviders(data);
    } catch (err) {
      console.error("Error fetching providers:", err);
      toast({ title: "Error", description: "Failed to load providers." });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const updateStatus = async (id: string, status: "approved" | "declined" | "pending") => {
    try {
      const res = await fetch("/api/admin/providers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setProviders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
      toast({ title: "Provider updated", description: `Status changed to ${status}.` });
    } catch (err) {
      console.error("Update provider error:", err);
      toast({ title: "Error", description: "Failed to update provider." });
    }
  };

  const handleSave = async (data: { id?: string; name: string; type: string; state: string; contact: string; approved: boolean }) => {
    try {
      const res = await fetch("/api/admin/providers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          company: data.name,
          type: data.type,
          state: data.state,
          email: data.contact,
          status: data.approved ? "approved" : "pending",
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast({ title: "Provider updated" });
      fetchProviders();
    } catch (err) {
      console.error("Save provider error:", err);
      toast({ title: "Error", description: "Failed to save provider." });
    }
  };

  const handleDelete = async () => {
    if (!deleteProvider) return;
    try {
      const res = await fetch(`/api/admin/providers?id=${deleteProvider.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProviders((prev) => prev.filter((p) => p.id !== deleteProvider.id));
      toast({ title: "Provider deleted", description: `${deleteProvider.company || deleteProvider.name} has been removed.` });
    } catch (err) {
      console.error("Delete provider error:", err);
      toast({ title: "Error", description: "Failed to delete provider." });
    }
    setDeleteProvider(null);
  };

  const columns = [
    {
      key: "company",
      header: "Company",
      render: (p: ProviderRow) => (
        <div>
          <span className="font-medium text-foreground">{p.company || p.name}</span>
          {p.description && (
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{p.description}</p>
          )}
        </div>
      ),
    },
    { key: "name", header: "Contact Name" },
    { key: "email", header: "Email" },
    { key: "type", header: "Type", render: (p: ProviderRow) => <span>{p.type || "—"}</span> },
    { key: "state", header: "State", render: (p: ProviderRow) => <span>{p.state || "—"}</span> },
    {
      key: "status",
      header: "Status",
      render: (p: ProviderRow) => <StatusBadge status={p.status} />,
    },
    {
      key: "created_at",
      header: "Submitted",
      render: (p: ProviderRow) => <span>{p.created_at?.split("T")[0] ?? "—"}</span>,
    },
    {
      key: "actions",
      header: "",
      render: (p: ProviderRow) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewProvider(p)}
            title="View Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          {p.status !== "approved" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-success"
              onClick={() => updateStatus(p.id, "approved")}
              title="Approve"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
          {p.status !== "declined" && p.status !== "pending" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateStatus(p.id, "pending")}
              title="Revert to Pending"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          {p.status === "pending" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => updateStatus(p.id, "declined")}
              title="Decline"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setEditProvider(toDialogProvider(p));
              setProviderDialog(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => setDeleteProvider(p)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ] satisfies Column<ProviderRow>[];

  return (
    <div>
      <PageHeader
        title="Providers"
        description="Review partnership inquiries and manage approved providers"
        action={{
          label: "Add Provider",
          icon: Plus,
          onClick: () => {
            setEditProvider(null);
            setProviderDialog(true);
          },
        }}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading providers…</span>
        </div>
      ) : (
        <DataTable
          data={providers}
          columns={columns}
          searchKey="company"
          searchPlaceholder="Search providers..."
        />
      )}

      <ProviderDialog
        open={providerDialog}
        onOpenChange={setProviderDialog}
        provider={editProvider}
        onSave={handleSave}
      />
      <ViewDialog
        open={!!viewProvider}
        onOpenChange={() => setViewProvider(null)}
        title="Provider Details"
        fields={
          viewProvider
            ? [
                { label: "Contact Name", value: viewProvider.name },
                { label: "Email", value: viewProvider.email },
                { label: "Company", value: viewProvider.company || "—" },
                { label: "Type", value: viewProvider.type || "—" },
                { label: "State", value: viewProvider.state || "—" },
                { label: "Website", value: viewProvider.website || "—" },
                { label: "Description", value: viewProvider.description || "—" },
                { label: "Status", value: <StatusBadge status={viewProvider.status} /> },
                { label: "Submitted", value: viewProvider.created_at?.split("T")[0] ?? "—" },
              ]
            : []
        }
      />
      <ConfirmDialog
        open={!!deleteProvider}
        onOpenChange={() => setDeleteProvider(null)}
        title="Delete Provider"
        description={`Are you sure you want to delete ${deleteProvider?.company || deleteProvider?.name}?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
