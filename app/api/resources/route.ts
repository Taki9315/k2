import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

/**
 * GET /api/resources
 * Fetch published resources ordered by sort_order (public endpoint).
 */
export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("resources")
      .select("id, title, description, type, url, file_url, access_level, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Public resources fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Public resources GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
