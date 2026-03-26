import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

/**
 * GET /api/admin/resources
 * Fetch all resources (admin view).
 */
export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Resources fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Resources GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/resources
 * Create a new resource.
 * Expects JSON body.
 */
export async function POST(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    const record = {
      title: body.title,
      description: body.description || "",
      type: body.type || "link",
      url: body.url || null,
      file_url: body.file_url || null,
      file_path: body.file_path || null,
      thumbnail_url: body.thumbnail_url || null,
      access_level: body.access_level || "public",
      category: body.category || "General",
      tags: body.tags || [],
      keywords: body.keywords || "",
      is_published: body.is_published ?? true,
      sort_order: body.sort_order ?? 0,
    };

    const { data, error } = await supabase
      .from("resources")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error("Resources create error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Resources POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/resources
 * Update an existing resource.
 * Expects JSON body with id.
 */
export async function PUT(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Missing resource id" }, { status: 400 });
    }

    const record: Record<string, unknown> = {};
    if (body.title !== undefined) record.title = body.title;
    if (body.description !== undefined) record.description = body.description;
    if (body.type !== undefined) record.type = body.type;
    if (body.url !== undefined) record.url = body.url;
    if (body.file_url !== undefined) record.file_url = body.file_url;
    if (body.file_path !== undefined) record.file_path = body.file_path;
    if (body.thumbnail_url !== undefined) record.thumbnail_url = body.thumbnail_url;
    if (body.access_level !== undefined) record.access_level = body.access_level;
    if (body.category !== undefined) record.category = body.category;
    if (body.tags !== undefined) record.tags = body.tags;
    if (body.keywords !== undefined) record.keywords = body.keywords;
    if (body.is_published !== undefined) record.is_published = body.is_published;
    if (body.sort_order !== undefined) record.sort_order = body.sort_order;

    const { data, error } = await supabase
      .from("resources")
      .update(record)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Resources update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Resources PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/resources
 * Bulk reorder resources.
 * Expects JSON body: { items: { id: string; sort_order: number }[] }
 */
export async function PATCH(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Missing items array" }, { status: 400 });
    }

    // Update each item's sort_order
    for (const item of body.items) {
      const { error } = await supabase
        .from("resources")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);

      if (error) {
        console.error("Resources reorder error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resources PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/resources
 * Delete a resource by id (query param).
 */
export async function DELETE(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing resource id" }, { status: 400 });
    }

    // Get file_path to clean up storage
    const { data: resource } = await supabase
      .from("resources")
      .select("file_path")
      .eq("id", id)
      .single();

    // Delete the file from storage if it exists
    if (resource?.file_path) {
      await supabase.storage.from("resource-files").remove([resource.file_path]);
    }

    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) {
      console.error("Resources delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resources DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
