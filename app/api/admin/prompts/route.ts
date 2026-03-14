import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

/**
 * GET /api/admin/prompts
 * Fetch all prep coach prompts (admin view — includes hidden).
 */
export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("prep_coach_prompts")
      .select("*")
      .order("order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Prompts fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Prompts GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/prompts
 * Create a new prompt.
 */
export async function POST(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    // Get the max order to append at the end
    const { data: maxRow } = await supabase
      .from("prep_coach_prompts")
      .select("order")
      .order("order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxRow?.order ?? -1) + 1;

    const record = {
      title: body.title,
      content: body.content || "",
      order: body.order ?? nextOrder,
      is_hidden: body.is_hidden ?? false,
    };

    const { data, error } = await supabase
      .from("prep_coach_prompts")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error("Prompts create error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Prompts POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/prompts
 * Update an existing prompt. Body must include { id }.
 */
export async function PUT(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing prompt id" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.content !== undefined) updates.content = body.content;
    if (body.order !== undefined) updates.order = body.order;
    if (body.is_hidden !== undefined) updates.is_hidden = body.is_hidden;

    const { data, error } = await supabase
      .from("prep_coach_prompts")
      .update(updates)
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      console.error("Prompts update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Prompts PUT error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/prompts
 * Delete a prompt. Body must include { id }.
 */
export async function DELETE(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing prompt id" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("prep_coach_prompts")
      .delete()
      .eq("id", body.id);

    if (error) {
      console.error("Prompts delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Prompts DELETE error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/prompts
 * Reorder prompts. Body: { items: { id: string; order: number }[] }
 */
export async function PATCH(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "Missing items array" },
        { status: 400 }
      );
    }

    // Update each prompt's order
    const updates = body.items.map(
      (item: { id: string; order: number }) =>
        supabase
          .from("prep_coach_prompts")
          .update({ order: item.order })
          .eq("id", item.id)
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Prompts PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
