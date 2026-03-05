import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase-server";

/**
 * GET /api/messages
 * Fetch messages for the authenticated user.
 * Query params:
 *   ?thread=<thread_id>  — fetch thread
 *   ?unread=true          — count unread only
 *
 * POST /api/messages
 * Send a reply. Body: { thread_id, parent_id, recipient_id, subject, body }
 *
 * PATCH /api/messages
 * Mark messages as read. Body: { message_ids: string[] } or { thread_id: string }
 */

function getUserFromAuth(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export async function GET(request: Request) {
  try {
    const token = getUserFromAuth(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const threadId = url.searchParams.get("thread");
    const unreadOnly = url.searchParams.get("unread") === "true";

    // Return unread count
    if (unreadOnly) {
      const { count, error } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .eq("is_read", false);

      // Table may not exist yet — return 0 gracefully
      if (error) {
        console.warn("Messages table not available:", error.message);
        return NextResponse.json({ unreadCount: 0 });
      }
      return NextResponse.json({ unreadCount: count ?? 0 });
    }

    // Return thread messages
    if (threadId) {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (error) {
        console.warn("Messages table not available:", error.message);
        return NextResponse.json({ messages: [] });
      }

      // Also fetch sender names via service role (profiles table has RLS)
      const serviceClient = createServiceRoleClient();
      const senderIds = Array.from(new Set((data || []).map((m: any) => m.sender_id)));
      const { data: profiles } = await serviceClient
        .from("profiles")
        .select("id, full_name, role")
        .in("id", senderIds);

      const profileMap = new Map(
        (profiles || []).map((p: any) => [p.id, p])
      );

      const enriched = (data || []).map((m: any) => ({
        ...m,
        sender_name: profileMap.get(m.sender_id)?.full_name ?? "K2 Team",
        sender_role: profileMap.get(m.sender_id)?.role ?? "admin",
      }));

      return NextResponse.json({ messages: enriched });
    }

    // Return inbox (latest message per thread, for this user)
    // Get all messages where user is recipient, grouped by thread
    const { data: allMessages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Messages table not available:", error.message);
      return NextResponse.json({ threads: [] });
    }

    // Group by thread, take latest per thread
    const threadMap = new Map<
      string,
      { latest: any; unreadCount: number; messageCount: number }
    >();
    for (const msg of allMessages || []) {
      const existing = threadMap.get(msg.thread_id);
      if (!existing) {
        threadMap.set(msg.thread_id, {
          latest: msg,
          unreadCount: msg.is_read ? 0 : 1,
          messageCount: 1,
        });
      } else {
        existing.messageCount++;
        if (!msg.is_read) existing.unreadCount++;
      }
    }

    // Enrich with sender names
    const serviceClient = createServiceRoleClient();
    const senderIds = Array.from(
      new Set(
        Array.from(threadMap.values()).map((t) => t.latest.sender_id)
      )
    );
    const { data: profiles } = await serviceClient
      .from("profiles")
      .select("id, full_name, role")
      .in("id", senderIds.length > 0 ? senderIds : ["__none__"]);

    const profileMap = new Map(
      (profiles || []).map((p: any) => [p.id, p])
    );

    const threads = Array.from(threadMap.entries())
      .map(([threadId, { latest, unreadCount, messageCount }]) => ({
        thread_id: threadId,
        subject: latest.subject,
        body_preview: latest.body.slice(0, 120),
        sender_name:
          profileMap.get(latest.sender_id)?.full_name ?? "K2 Team",
        sender_role: profileMap.get(latest.sender_id)?.role ?? "admin",
        is_read: unreadCount === 0,
        unread_count: unreadCount,
        message_count: messageCount,
        latest_at: latest.created_at,
      }))
      .sort(
        (a, b) =>
          new Date(b.latest_at).getTime() - new Date(a.latest_at).getTime()
      );

    return NextResponse.json({ threads });
  } catch (err: any) {
    console.error("Messages GET error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = getUserFromAuth(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { thread_id, parent_id, recipient_id, subject, body } =
      await request.json();

    if (!thread_id || !recipient_id || !body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("messages").insert({
      thread_id,
      parent_id: parent_id || null,
      sender_id: user.id,
      recipient_id,
      subject: subject || "Re: (no subject)",
      body,
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ message: data });
  } catch (err: any) {
    console.error("Messages POST error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const token = getUserFromAuth(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message_ids, thread_id } = await request.json();

    if (thread_id) {
      // Mark all messages in thread as read
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("thread_id", thread_id)
        .eq("recipient_id", user.id)
        .eq("is_read", false);

      if (error) throw error;
    } else if (message_ids?.length) {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in("id", message_ids)
        .eq("recipient_id", user.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Messages PATCH error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
