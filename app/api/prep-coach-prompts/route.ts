import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

/**
 * GET /api/prep-coach-prompts
 * Fetch visible prompts ordered by admin-set order.
 * Used by the public Prep Coach page.
 */
export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("prep_coach_prompts")
      .select("id, title, content, \"order\"")
      .eq("is_hidden", false)
      .order("order", { ascending: true });

    if (error) {
      console.error("Public prompts fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Public prompts GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
