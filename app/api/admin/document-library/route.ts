import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

/**
 * GET /api/admin/document-library
 * List all application_docs for admin management.
 */
export async function GET() {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("application_docs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    // Table may not exist yet
    if (error.message.includes("does not exist")) {
      return NextResponse.json({
        docs: [],
        _migrationRequired: true,
        _migrationHint:
          "Run supabase/migrations/20260309000000_create_application_docs.sql in the Supabase SQL Editor.",
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ docs: data || [] });
}

/**
 * POST /api/admin/document-library
 * Create a new application document.
 */
export async function POST(request: Request) {
  const supabase = createServiceRoleClient();

  try {
    const body = await request.json();
    const { title, description, file_name, file_url, file_size, mime_type, category, doc_type, sort_order } = body;

    if (!title || !file_url) {
      return NextResponse.json(
        { error: "Title and file_url are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("application_docs")
      .insert({
        title,
        description: description || null,
        file_name: file_name || title,
        file_url,
        file_size: file_size || 0,
        mime_type: mime_type || "application/pdf",
        category: category || "template",
        doc_type: doc_type || "application_document",
        sort_order: sort_order ?? 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ doc: data }, { status: 201 });
  } catch (err) {
    console.error("Create doc error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/document-library
 * Update an existing application document.
 */
export async function PUT(request: Request) {
  const supabase = createServiceRoleClient();

  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("application_docs")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ doc: data });
  } catch (err) {
    console.error("Update doc error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/document-library
 * Delete an application document by id (passed as ?id=...)
 */
export async function DELETE(request: Request) {
  const supabase = createServiceRoleClient();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("application_docs")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete doc error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete" },
      { status: 500 }
    );
  }
}
