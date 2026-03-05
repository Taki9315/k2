"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  MailOpen,
  ArrowLeft,
  Send,
  Loader2,
  Inbox as InboxIcon,
  ChevronRight,
  Shield,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

/* ── Types ──────────────────────────────────────────────── */

interface Thread {
  thread_id: string;
  subject: string;
  body_preview: string;
  sender_name: string;
  sender_role: string;
  is_read: boolean;
  unread_count: number;
  message_count: number;
  latest_at: string;
}

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  recipient_id: string;
  sender_name: string;
  sender_role: string;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

/* ── Helper ─────────────────────────────────────────────── */

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

/* ── Component ──────────────────────────────────────────── */

interface DashboardInboxProps {
  userId: string;
}

export function DashboardInbox({ userId }: DashboardInboxProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);

  // Reply
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  /* ── Fetch token ── */
  const getToken = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
  }, []);

  /* ── Fetch inbox threads ── */
  const fetchThreads = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (err) {
      console.error("Inbox fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  /* ── Open a thread ── */
  const openThread = async (threadId: string) => {
    setActiveThread(threadId);
    setThreadLoading(true);
    setReplyText("");
    try {
      const token = await getToken();
      if (!token) return;

      // Fetch messages
      const res = await fetch(`/api/messages?thread=${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load thread");
      const data = await res.json();
      setMessages(data.messages || []);

      // Mark as read
      await fetch("/api/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ thread_id: threadId }),
      });

      // Update local thread state
      setThreads((prev) =>
        prev.map((t) =>
          t.thread_id === threadId
            ? { ...t, is_read: true, unread_count: 0 }
            : t
        )
      );
    } catch (err) {
      console.error("Thread fetch error:", err);
    } finally {
      setThreadLoading(false);
    }
  };

  /* ── Send reply ── */
  const handleReply = async () => {
    if (!replyText.trim() || !activeThread || messages.length === 0) return;

    setSending(true);
    try {
      const token = await getToken();
      if (!token) return;

      // Find the original sender (admin) to reply to
      const originalMsg = messages[0];
      const recipientId =
        originalMsg.sender_id === userId
          ? originalMsg.recipient_id
          : originalMsg.sender_id;

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          thread_id: activeThread,
          parent_id: messages[messages.length - 1].id,
          recipient_id: recipientId,
          subject: `Re: ${originalMsg.subject}`,
          body: replyText.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to send reply");

      const { message: newMsg } = await res.json();

      // Add to local messages
      setMessages((prev) => [
        ...prev,
        {
          ...newMsg,
          sender_name: "You",
          sender_role: "borrower",
        },
      ]);
      setReplyText("");
    } catch (err) {
      console.error("Reply error:", err);
    } finally {
      setSending(false);
    }
  };

  const unreadTotal = threads.reduce((sum, t) => sum + t.unread_count, 0);

  /* ── Thread detail view ── */
  if (activeThread) {
    const thread = threads.find((t) => t.thread_id === activeThread);
    return (
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setActiveThread(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">
                {thread?.subject || "Message"}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {messages.length} message{messages.length !== 1 ? "s" : ""} in
                this thread
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {threadLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "p-4",
                        isMe ? "bg-primary/5" : "bg-white"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold",
                            isMe
                              ? "bg-primary/20 text-primary"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {isMe ? "You" : msg.sender_role === "admin" ? (
                            <Shield className="h-3.5 w-3.5" />
                          ) : (
                            msg.sender_name?.[0]?.toUpperCase() || "?"
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-900">
                            {isMe ? "You" : msg.sender_name}
                          </span>
                          {!isMe && msg.sender_role === "admin" && (
                            <Badge
                              variant="outline"
                              className="ml-1.5 text-[10px] px-1.5 py-0"
                            >
                              K2 Team
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(msg.created_at)}
                        </span>
                      </div>
                      <div className="ml-9 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {msg.body}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply box */}
              <div className="border-t p-4 bg-slate-50/50">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="bg-white min-h-[80px] mb-3"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyText.trim() || sending}
                    className="gap-1.5"
                  >
                    {sending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    {sending ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  /* ── Inbox list view ── */
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Mail className="h-4.5 w-4.5 text-blue-600" />
            </div>
            Messages
            {unreadTotal > 0 && (
              <Badge className="bg-red-500 text-white text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
                {unreadTotal}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <InboxIcon className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-sm text-gray-500 font-medium">No messages yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              When K2 sends you a message, it will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {threads.map((thread) => (
              <button
                key={thread.thread_id}
                onClick={() => openThread(thread.thread_id)}
                className={cn(
                  "w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3",
                  !thread.is_read && "bg-blue-50/40"
                )}
              >
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    thread.is_read
                      ? "bg-slate-100 text-slate-400"
                      : "bg-blue-100 text-blue-600"
                  )}
                >
                  {thread.is_read ? (
                    <MailOpen className="h-4 w-4" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={cn(
                        "text-sm truncate",
                        thread.is_read
                          ? "text-gray-700"
                          : "font-semibold text-gray-900"
                      )}
                    >
                      {thread.subject}
                    </span>
                    {thread.unread_count > 0 && (
                      <Badge className="bg-blue-500 text-white text-[10px] h-4 min-w-4 flex items-center justify-center rounded-full px-1">
                        {thread.unread_count}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      {thread.sender_name}
                    </span>
                    {thread.sender_role === "admin" && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 h-3.5"
                      >
                        K2 Team
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {thread.body_preview}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[11px] text-muted-foreground">
                    {timeAgo(thread.latest_at)}
                  </span>
                  {thread.message_count > 1 && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      {thread.message_count} <ChevronRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
