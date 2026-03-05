"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Eye,
  Pencil,
  Ban,
  Trash2,
  UserPlus,
  Star,
  MessageCircle,
  Calendar,
  Briefcase,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserDialog } from "@/components/admin/dialogs/UserDialog";
import { ViewDialog } from "@/components/admin/dialogs/ViewDialog";
import { ConfirmDialog } from "@/components/admin/dialogs/ConfirmDialog";
import { EmailDialog } from "@/components/admin/dialogs/EmailDialog";

type MainFilter = "all" | "kit_buyers" | "certified" | "partners";
type PartnerSubFilter = "all" | "lenders" | "vendors" | "preferred";

// Matches the profiles table shape
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "borrower" | "certified" | "lender" | "vendor";
  status: "active" | "inactive" | "suspended";
  preferred: boolean;
  workbook_purchased: boolean;
  membership_number: string | null;
  created_at: string;
  updated_at: string;
}

// Adapter so the existing UserDialog (which uses name/createdAt keys) still works
function toDialogUser(p: UserProfile) {
  return {
    id: p.id,
    name: p.full_name ?? "",
    email: p.email,
    role: p.role,
    status: p.status ?? "active",
    preferred: p.preferred ?? false,
    workbook_purchased: p.workbook_purchased ?? false,
    createdAt: p.created_at?.split("T")[0] ?? "",
  };
}

/** Check if a user profile represents a certified borrower */
function isCertified(u: UserProfile) {
  return u.role === "certified" || (u.role === "borrower" && u.preferred);
}

type DialogUser = ReturnType<typeof toDialogUser>;

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const [userDialog, setUserDialog] = useState(false);
  const [editUser, setEditUser] = useState<DialogUser | null>(null);
  const [viewUser, setViewUser] = useState<DialogUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null);
  const [disableUser, setDisableUser] = useState<UserProfile | null>(null);

  // Filter state
  const [mainFilter, setMainFilter] = useState<MainFilter>("all");
  const [partnerSubFilter, setPartnerSubFilter] = useState<PartnerSubFilter>("all");

  // Email state
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<
    { id: string; email: string; name: string | null }[]
  >([]);
  const [emailGroupLabel, setEmailGroupLabel] = useState<string | undefined>();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: UserProfile[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast({ title: "Error", description: "Failed to load users." });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveUser = async (
    data: { id?: string; name: string; email: string; role: string; status: string; preferred: boolean; workbook_purchased?: boolean }
  ) => {
    try {
      const isNew = !data.id;
      const res = await fetch("/api/admin/users", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isNew
            ? {
                name: data.name,
                email: data.email,
                role: data.role,
                status: data.status,
                preferred: data.preferred,
                workbook_purchased: data.workbook_purchased ?? false,
              }
            : {
                id: data.id,
                full_name: data.name,
                email: data.email,
                role: data.role,
                status: data.status,
                preferred: data.preferred,
                workbook_purchased: data.workbook_purchased ?? false,
              }
        ),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || (isNew ? "Failed to create user" : "Failed to update user"));
      }

      toast({
        title: isNew ? "User created" : "User updated",
        description: `${data.name || data.email} has been ${isNew ? "created" : "updated"}.`,
      });
      fetchUsers();
    } catch (err: any) {
      console.error("Save user error:", err);
      toast({ title: "Error", description: err.message || "Failed to save user." });
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      const res = await fetch(`/api/admin/users?id=${deleteUser.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      toast({
        title: "User deleted",
        description: `${deleteUser.full_name ?? deleteUser.email} has been removed.`,
      });
    } catch (err) {
      console.error("Delete user error:", err);
      toast({ title: "Error", description: "Failed to delete user." });
    }
    setDeleteUser(null);
  };

  const handleDisable = async () => {
    if (!disableUser) return;
    const newStatus =
      disableUser.status === "suspended" ? "active" : "suspended";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: disableUser.id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === disableUser.id ? { ...u, status: newStatus } : u
        )
      );
      toast({
        title: "User updated",
        description: `${disableUser.full_name ?? disableUser.email} status changed to ${newStatus}.`,
      });
    } catch (err) {
      console.error("Disable user error:", err);
      toast({ title: "Error", description: "Failed to update user status." });
    }
    setDisableUser(null);
  };

  // ── Filtered users ──
  const filteredUsers = useMemo(() => {
    let result = users;
    switch (mainFilter) {
      case "kit_buyers":
        result = users.filter(
          (u) => u.workbook_purchased && !isCertified(u) && u.role === "borrower"
        );
        break;
      case "certified":
        result = users.filter((u) => isCertified(u));
        break;
      case "partners":
        result = users.filter(
          (u) => u.role === "lender" || u.role === "vendor"
        );
        if (partnerSubFilter === "lenders") {
          result = result.filter((u) => u.role === "lender");
        } else if (partnerSubFilter === "vendors") {
          result = result.filter((u) => u.role === "vendor");
        } else if (partnerSubFilter === "preferred") {
          result = result.filter((u) => u.preferred);
        }
        break;
    }
    return result;
  }, [users, mainFilter, partnerSubFilter]);

  // ── Filter counts ──
  const counts = useMemo(() => {
    const kitBuyers = users.filter(
      (u) => u.workbook_purchased && !isCertified(u) && u.role === "borrower"
    ).length;
    const certified = users.filter((u) => isCertified(u)).length;
    const partners = users.filter(
      (u) => u.role === "lender" || u.role === "vendor"
    ).length;
    return { all: users.length, kitBuyers, certified, partners };
  }, [users]);

  // ── Email helpers ──
  const filterLabel = (filter: MainFilter) => {
    switch (filter) {
      case "kit_buyers": return "Kit Buyers";
      case "certified": return "Certified Borrowers";
      case "partners": return partnerSubFilter === "all" ? "Partners" : partnerSubFilter === "lenders" ? "Lenders" : partnerSubFilter === "vendors" ? "Vendors" : "Preferred Partners";
      default: return "All Users";
    }
  };

  const openBulkEmail = () => {
    const recipients = filteredUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.full_name,
    }));
    setEmailRecipients(recipients);
    setEmailGroupLabel(`${recipients.length} ${filterLabel(mainFilter)}`);
    setEmailDialogOpen(true);
  };

  const openSingleEmail = (u: UserProfile) => {
    setEmailRecipients([{ id: u.id, email: u.email, name: u.full_name }]);
    setEmailGroupLabel(undefined);
    setEmailDialogOpen(true);
  };

  const columns = [
    {
      key: "full_name",
      header: "Name",
      render: (u: UserProfile) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            {u.full_name || u.email}
          </span>
          {isCertified(u) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Star className="h-3 w-3 fill-primary" /> Certified Borrower
            </span>
          )}
          {u.role === "borrower" && !isCertified(u) && u.workbook_purchased && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Kit Owner
            </span>
          )}
          {u.membership_number && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-600">
              {u.membership_number}
            </span>
          )}
        </div>
      ),
    },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (u: UserProfile) => (
        <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-semibold capitalize text-secondary-foreground">
          {u.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u: UserProfile) => <StatusBadge status={u.status ?? "active"} />,
    },
    {
      key: "created_at",
      header: "Joined",
      render: (u: UserProfile) => (
        <span>{u.created_at?.split("T")[0] ?? "—"}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (u: UserProfile) => {
        const du = toDialogUser(u);
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewUser(du)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setEditUser(du);
                setUserDialog(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {isCertified(u) && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary"
                  onClick={() =>
                    router.push(
                      `/admin/chat?userId=${u.id}&userName=${encodeURIComponent(u.full_name ?? u.email)}`
                    )
                  }
                  title="Chat"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary"
                  onClick={() =>
                    router.push(
                      `/admin/meetings?userId=${u.id}&userName=${encodeURIComponent(u.full_name ?? u.email)}`
                    )
                  }
                  title="Meeting"
                >
                  <Calendar className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary"
                  onClick={() =>
                    router.push(
                      `/admin/business-requests?userId=${u.id}&userName=${encodeURIComponent(u.full_name ?? u.email)}`
                    )
                  }
                  title="Business Request"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600"
              onClick={() => openSingleEmail(u)}
              title="Send Email"
            >
              <Mail className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDisableUser(u)}
            >
              <Ban className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => setDeleteUser(u)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ] satisfies Column<UserProfile>[];

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage borrowers, certified borrowers, lenders, and vendors"
        action={{
          label: "Add User",
          icon: UserPlus,
          onClick: () => {
            setEditUser(null);
            setUserDialog(true);
          },
        }}
      />

      {/* ── Filter Tabs ── */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {([
          { key: "all" as MainFilter, label: "All", count: counts.all },
          { key: "kit_buyers" as MainFilter, label: "Kit Buyers", count: counts.kitBuyers },
          { key: "certified" as MainFilter, label: "Certified Borrowers", count: counts.certified },
          { key: "partners" as MainFilter, label: "Partners", count: counts.partners },
        ]).map((f) => (
          <Button
            key={f.key}
            variant={mainFilter === f.key ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setMainFilter(f.key);
              if (f.key !== "partners") setPartnerSubFilter("all");
            }}
          >
            {f.label}
            <span
              className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                mainFilter === f.key
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {f.count}
            </span>
          </Button>
        ))}

        {/* Partner sub-filters */}
        {mainFilter === "partners" && (
          <div className="ml-2 flex items-center gap-1 border-l pl-2">
            {([
              { key: "all" as PartnerSubFilter, label: "All" },
              { key: "lenders" as PartnerSubFilter, label: "Lenders" },
              { key: "vendors" as PartnerSubFilter, label: "Vendors" },
              { key: "preferred" as PartnerSubFilter, label: "Preferred" },
            ]).map((sf) => (
              <Button
                key={sf.key}
                variant={partnerSubFilter === sf.key ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setPartnerSubFilter(sf.key)}
              >
                {sf.label}
              </Button>
            ))}
          </div>
        )}

        {/* Bulk email button */}
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={openBulkEmail}
            disabled={filteredUsers.length === 0}
          >
            <Send className="h-3.5 w-3.5" />
            Bulk Email ({filteredUsers.length})
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading users…</span>
        </div>
      ) : (
        <DataTable
          data={filteredUsers}
          columns={columns}
          searchKey="full_name"
          searchPlaceholder="Search users..."
        />
      )}

      <UserDialog
        open={userDialog}
        onOpenChange={setUserDialog}
        user={editUser}
        onSave={handleSaveUser}
      />
      <ViewDialog
        open={!!viewUser}
        onOpenChange={() => setViewUser(null)}
        title="User Details"
        fields={
          viewUser
            ? [
                { label: "Name", value: viewUser.name || "—" },
                { label: "Email", value: viewUser.email },
                {
                  label: "Role",
                  value: (
                    <span className="capitalize">{viewUser.role}</span>
                  ),
                },
                {
                  label: "Status",
                  value: <StatusBadge status={viewUser.status} />,
                },
                {
                  label: "Certified Borrower",
                  value: viewUser.role === "certified" || viewUser.preferred ? "Yes ✅" : "No",
                },
                {
                  label: "Kit Purchased",
                  value: viewUser.workbook_purchased ? "Yes ✅" : "No",
                },
                { label: "Joined", value: viewUser.createdAt },
              ]
            : []
        }
      />
      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={() => setDeleteUser(null)}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteUser?.full_name ?? deleteUser?.email}? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={!!disableUser}
        onOpenChange={() => setDisableUser(null)}
        title={
          disableUser?.status === "suspended" ? "Enable User" : "Disable User"
        }
        description={`Are you sure you want to ${disableUser?.status === "suspended" ? "enable" : "suspend"} ${disableUser?.full_name ?? disableUser?.email}?`}
        onConfirm={handleDisable}
        variant="default"
      />
      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        recipients={emailRecipients}
        groupLabel={emailGroupLabel}
      />
    </div>
  );
}
