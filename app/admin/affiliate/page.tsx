"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Users,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Search,
  Loader2,
  UserCheck,
  Shield,
} from "lucide-react";

type AffiliateUser = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  referral_code: string | null;
  total_clicks: number;
  total_kit_sales: number;
  total_certified_sales: number;
  total_commission: number;
};

export default function AffiliateManagementPage() {
  const [affiliates, setAffiliates] = useState<AffiliateUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAffiliates = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const res = await fetch("/api/admin/affiliate", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAffiliates(data.affiliates ?? []);
      }
    } catch (err) {
      console.error("Error fetching affiliates:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const ALLOWED_ROLES = ["kit_buyer", "certified_borrower", "partner", "admin"];

  // Filter affiliates: only those with qualifying roles + search filter
  const filtered = affiliates
    .filter((a) => ALLOWED_ROLES.includes(a.role))
    .filter((a) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (a.full_name?.toLowerCase().includes(q) ?? false) ||
        a.email.toLowerCase().includes(q) ||
        (a.referral_code?.toLowerCase().includes(q) ?? false)
      );
    });

  const totalCommission = filtered.reduce((sum, a) => sum + a.total_commission, 0);
  const totalKitSales = filtered.reduce((sum, a) => sum + a.total_kit_sales, 0);
  const totalCertifiedSales = filtered.reduce((sum, a) => sum + a.total_certified_sales, 0);

  const roleLabel = (role: string) => {
    switch (role) {
      case "kit_buyer":
        return "Kit Buyer";
      case "certified_borrower":
        return "Certified Borrower";
      case "partner":
        return "Partner";
      case "admin":
        return "Admin";
      default:
        return role;
    }
  };

  const roleBadgeClass = (role: string) => {
    switch (role) {
      case "certified_borrower":
        return "bg-primary/10 text-primary border-primary/20";
      case "partner":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "kit_buyer":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-primary" />
          Affiliate Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage referral affiliates. Only Kit Buyers, Certified Borrowers, and Partners are eligible.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filtered.length}</p>
                <p className="text-xs text-muted-foreground">Active Affiliates</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalCommission.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Total Commission</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalKitSales}</p>
                <p className="text-xs text-muted-foreground">Kit Sales Referred</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCertifiedSales}</p>
                <p className="text-xs text-muted-foreground">Certified Sales Referred</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Affiliates</CardTitle>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No eligible affiliates found.</p>
              <p className="text-xs mt-1">
                Only Kit Buyers, Certified Borrowers, and Partners can be affiliates.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Referral Code</th>
                    <th className="text-right py-3 px-4 font-medium">Clicks</th>
                    <th className="text-right py-3 px-4 font-medium">Kit Sales</th>
                    <th className="text-right py-3 px-4 font-medium">Certified Sales</th>
                    <th className="text-right py-3 px-4 font-medium">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((affiliate) => (
                    <tr key={affiliate.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{affiliate.full_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{affiliate.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={`text-xs ${roleBadgeClass(affiliate.role)}`}>
                          {roleLabel(affiliate.role)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                          {affiliate.referral_code || "—"}
                        </code>
                      </td>
                      <td className="py-3 px-4 text-right">{affiliate.total_clicks}</td>
                      <td className="py-3 px-4 text-right">{affiliate.total_kit_sales}</td>
                      <td className="py-3 px-4 text-right">{affiliate.total_certified_sales}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        ${affiliate.total_commission.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
