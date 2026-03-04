import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

/**
 * GET /api/admin/application-docs
 * List ALL deal_room_files from all users for admin review.
 * Joins with profiles to get user name/email.
 * ?status=pending|approved|declined — filter by review status
 */
export async function GET(request: Request) {
  const supabase = createServiceRoleClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // optional filter

  let query = supabase
    .from("deal_room_files")
    .select("*, profiles:user_id(full_name, email)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("review_status", status);
  }

  const { data, error } = await query;

  if (error) {
    // If columns don't exist yet, return empty + migration hint
    if (
      error.message.includes("does not exist") ||
      error.message.includes("review_status")
    ) {
      return NextResponse.json({
        files: [],
        _migrationRequired: true,
        _migrationHint:
          "Run supabase/migrations/20260305000000_create_application_docs.sql in the Supabase SQL Editor to add review columns.",
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ files: data || [] });
}

/**
 * PUT /api/admin/application-docs
 * Update review_status (approve / decline) for a deal_room_file.
 * Body: { id, review_status: 'approved'|'declined', admin_note? }
 */
export async function PUT(request: Request) {
  const supabase = createServiceRoleClient();

  try {
    const body = await request.json();
    const { id, review_status, admin_note } = body;

    if (!id || !review_status) {
      return NextResponse.json(
        { error: "Missing id or review_status" },
        { status: 400 }
      );
    }

    if (!["pending", "approved", "declined"].includes(review_status)) {
      return NextResponse.json(
        { error: "review_status must be pending, approved, or declined" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("deal_room_files")
      .update({
        review_status,
        admin_note: admin_note ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, profiles:user_id(full_name, email)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ file: data });
  } catch (err) {
    console.error("Review update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

