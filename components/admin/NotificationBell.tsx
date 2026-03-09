'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  UserPlus,
  LogIn,
  LogOut,
  Upload,
  Mail,
  CreditCard,
  Info,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string | null;
  user_name: string | null;
  user_email: string | null;
  read: boolean;
  created_at: string;
  metadata: Record<string, unknown>;
};

const TYPE_ICON: Record<string, typeof Bell> = {
  signup: UserPlus,
  login: LogIn,
  logout: LogOut,
  upload: Upload,
  contact: Mail,
  checkout: CreditCard,
  general: Info,
};

const TYPE_COLOR: Record<string, string> = {
  signup: 'text-green-600 bg-green-50',
  login: 'text-blue-600 bg-blue-50',
  logout: 'text-gray-500 bg-gray-50',
  upload: 'text-purple-600 bg-purple-50',
  contact: 'text-orange-600 bg-orange-50',
  checkout: 'text-emerald-600 bg-emerald-50',
  general: 'text-slate-600 bg-slate-50',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const { toast } = useToast();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prevCountRef = useRef(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications?limit=30');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        return data;
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    }
    return null;
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications().then((data) => {
      if (data) prevCountRef.current = data.unreadCount || 0;
    });
  }, [fetchNotifications]);

  // Realtime subscription for new notifications
  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_notifications' },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev].slice(0, 30));
          setUnreadCount((c) => c + 1);

          // Show toast for new notification
          const Icon = TYPE_ICON[newNotif.type] || Bell;
          toast({
            title: newNotif.title,
            description: newNotif.message || newNotif.user_email || undefined,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const markAllRead = async () => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const markRead = async (id: string) => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const wasUnread = notifications.find((n) => n.id === id && !n.read);
      const res = await fetch(`/api/admin/notifications?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
        // If deleting the last item on the current page, go back one page
        const remaining = notifications.length - 1;
        const maxPage = Math.max(0, Math.ceil(remaining / PAGE_SIZE) - 1);
        if (page > maxPage) setPage(maxPage);
      }
    } catch (err) {
      console.error('Delete notification error:', err);
    }
  };

  // Pagination helpers
  const totalPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));
  const paginatedNotifications = notifications.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  return (
    <div className="relative">
      {/* Bell button */}
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative rounded-xl"
        onClick={() => {
          setOpen(!open);
          if (!open) {
            fetchNotifications();
            setPage(0);
          }
        }}
      >
        <Bell className="h-4 w-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-card">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification panel (non-modal dropdown) */}
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-96 max-h-[70vh] rounded-xl border border-border bg-card shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge className="h-5 px-1.5 text-[10px] bg-red-500 text-white hover:bg-red-500">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                  onClick={markAllRead}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              paginatedNotifications.map((n) => {
                const Icon = TYPE_ICON[n.type] || Bell;
                const colorClass = TYPE_COLOR[n.type] || TYPE_COLOR.general;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 border-b border-border/50 transition-colors hover:bg-muted/50 cursor-pointer group',
                      !n.read && 'bg-primary/5'
                    )}
                    onClick={() => {
                      if (!n.read) markRead(n.id);
                    }}
                  >
                    <div
                      className={cn(
                        'shrink-0 mt-0.5 rounded-lg p-2',
                        colorClass
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-sm leading-tight',
                            !n.read ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
                          )}
                        >
                          {n.title}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {!n.read && (
                            <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="p-1 rounded hover:bg-red-50 text-muted-foreground/40 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete notification"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      {n.message && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {n.user_name && (
                          <span className="text-[11px] text-muted-foreground/70">
                            {n.user_name}
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground/50">
                          {timeAgo(n.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {notifications.length > PAGE_SIZE && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30">
              <span className="text-[11px] text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
