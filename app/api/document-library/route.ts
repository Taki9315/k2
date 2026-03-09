import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

/**
 * GET /api/document-library
 * Public endpoint — returns active application documents.
 * Optional: ?type=application_document|resource|partner_document
 */
export async function GET(request: Request) {
  const supabase = createServiceRoleClient();
  const { searchParams } = new URL(request.url);
  const docType = searchParams.get("type");

  let query = supabase
    .from("application_docs")
    .select("id, title, description, file_name, file_url, file_size, mime_type, category, doc_type, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (docType) {
    query = query.eq("doc_type", docType);
  }

  const { data, error } = await query;

  if (error) {
    // Table may not exist yet
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ docs: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ docs: data || [] });
}
