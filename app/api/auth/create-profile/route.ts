import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { createAdminNotification } from "@/lib/admin-notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, full_name, role, phone, company } = body;

    if (!id || !email) {
      return NextResponse.json(
        { error: "Missing required fields: id, email" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Upsert so it won't fail if the trigger already created the row
    const { error } = await supabase.from("profiles").upsert(
      {
        id,
        email,
        full_name: full_name || null,
        role: role || "borrower",
        phone: phone || null,
        company: company || null,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Profile upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Notify admin about new signup
    await createAdminNotification({
      type: 'signup',
      title: 'New user registered',
      message: `${full_name || email} signed up as ${role || 'borrower'}`,
      user_id: id,
      user_name: full_name || null,
      user_email: email,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Create profile error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
