import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';

export type NotificationType = 'signup' | 'login' | 'logout' | 'upload' | 'contact' | 'checkout' | 'general';

/**
 * POST /api/admin/notifications/create
 * Create a new admin notification.
 * Called internally from other API routes when user actions occur.
 * Body: { type, title, message?, user_id?, user_name?, user_email?, metadata? }
 */
export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid or empty JSON body' }, { status: 400 });
    }

    const { type, title, message, user_id, user_name, user_email, metadata } = body as {
      type?: string;
      title?: string;
      message?: string;
      user_id?: string;
      user_name?: string;
      user_email?: string;
      metadata?: Record<string, unknown>;
    };

    if (!type || !title) {
      return NextResponse.json({ error: 'type and title required' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from('admin_notifications')
      .insert({
        type,
        title,
        message: message || null,
        user_id: user_id || null,
        user_name: user_name || null,
        user_email: user_email || null,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      // Silently fail if table doesn't exist — don't break the user flow
      if (error.message.includes('does not exist')) {
        return NextResponse.json({ success: false, _migrationRequired: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, notification: data });
  } catch (err) {
    console.error('Create notification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
