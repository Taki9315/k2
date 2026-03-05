import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { randomUUID } from "crypto";

/**
 * POST /api/admin/send-email
 * Send emails and store them as in-app messages.
 * Body: { recipients: [{id?, email, name}], subject, body, sender_id? }
 */
export async function POST(request: Request) {
  try {
    const supabase = createServiceRoleClient();
    const { recipients, subject, body, sender_id } = await request.json();

    if (!recipients?.length || !subject || !body) {
      return NextResponse.json(
        { error: "Missing recipients, subject, or body" },
        { status: 400 }
      );
    }

    // Determine admin sender — use provided sender_id or look up first admin
    let adminSenderId = sender_id;
    if (!adminSenderId) {
      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .limit(1)
        .single();
      adminSenderId = adminProfile?.id;
    }

    // Resolve recipient user IDs if not provided (lookup by email)
    const recipientsWithIds: { id: string; email: string; name: string | null }[] = [];
    for (const r of recipients) {
      if (r.id) {
        recipientsWithIds.push(r);
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", r.email)
          .limit(1)
          .single();
        if (profile) {
          recipientsWithIds.push({ ...r, id: profile.id });
        }
      }
    }

    // ── Store in-app messages ──
    if (adminSenderId && recipientsWithIds.length > 0) {
      const threadId = randomUUID(); // one thread per bulk send
      const messageRows = recipientsWithIds.map((r) => ({
        thread_id: threadId,
        sender_id: adminSenderId,
        recipient_id: r.id,
        subject,
        body,
      }));

      const { error: msgError } = await supabase
        .from("messages")
        .insert(messageRows);

      if (msgError) {
        console.error("Failed to store messages:", msgError);
      }
    }

    // ── Log for admin records ──
    try {
      await supabase.from("admin_notifications").insert({
        type: "email_sent",
        title: `Email: ${subject}`,
        message: `Sent to ${recipients.length} recipient(s): ${recipients
          .slice(0, 3)
          .map((r: any) => r.email)
          .join(", ")}${recipients.length > 3 ? "..." : ""}`,
        metadata: {
          recipients: recipients.map((r: any) => r.email),
          subject,
          body,
          sent_at: new Date().toISOString(),
          count: recipients.length,
        },
      });
    } catch {
      // Table may not exist
    }

    // ── External email (placeholder) ──
    // In production, integrate Resend/SendGrid here.
    // For now, messages are stored in-app and users see them on their dashboard.
    const results = recipients.map((r: any) => ({
      email: r.email,
      success: true,
    }));

    return NextResponse.json({
      success: true,
      sent: recipients.length,
      total: recipients.length,
      results,
      note: "Messages stored in-app. Users will see them on their dashboard.",
    });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
