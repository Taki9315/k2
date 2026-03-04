import { createServiceRoleClient } from '@/lib/supabase-server';

export type NotificationType = 'signup' | 'login' | 'logout' | 'upload' | 'contact' | 'checkout' | 'general';

type CreateNotificationParams = {
  type: NotificationType;
  title: string;
  message?: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Create an admin notification (server-side helper).
 * Silently fails if the table doesn't exist yet.
 */
export async function createAdminNotification(params: CreateNotificationParams) {
  try {
    const supabase = createServiceRoleClient();
    await supabase.from('admin_notifications').insert({
      type: params.type,
      title: params.title,
      message: params.message || null,
      user_id: params.user_id || null,
      user_name: params.user_name || null,
      user_email: params.user_email || null,
      metadata: params.metadata || {},
    });
  } catch {
    // Silently fail — notifications should never break user flows
  }
}
