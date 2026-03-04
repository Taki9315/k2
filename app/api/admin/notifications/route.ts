import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';

/**
 * GET /api/admin/notifications
 * List admin notifications. ?unread=true for unread only, ?limit=N
 */
export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();
  const { searchParams } = request.nextUrl;
  const unreadOnly = searchParams.get('unread') === 'true';
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  let query = supabase
    .from('admin_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;

  if (error) {
    // Table might not exist yet
    if (error.message.includes('does not exist')) {
      return NextResponse.json({ notifications: [], unreadCount: 0, _migrationRequired: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also get unread count
  const { count } = await supabase
    .from('admin_notifications')
    .select('id', { count: 'exact', head: true })
    .eq('read', false);

  return NextResponse.json({
    notifications: data || [],
    unreadCount: count || 0,
  });
}

/**
 * PUT /api/admin/notifications
 * Mark notifications as read.
 * Body: { ids: string[] } or { markAllRead: true }
 */
export async function PUT(request: NextRequest) {
  const supabase = createServiceRoleClient();
  const body = await request.json();

  if (body.markAllRead) {
    const { error } = await supabase
      .from('admin_notifications')
      .update({ read: true })
      .eq('read', false);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (body.ids && Array.isArray(body.ids)) {
    const { error } = await supabase
      .from('admin_notifications')
      .update({ read: true })
      .in('id', body.ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Provide ids or markAllRead' }, { status: 400 });
}
