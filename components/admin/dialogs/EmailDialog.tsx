"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Recipient {
  id: string;
  email: string;
  name: string | null;
}

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipients: Recipient[];
  /** Descriptive label like "3 Kit Buyers" */
  groupLabel?: string;
}

export function EmailDialog({
  open,
  onOpenChange,
  recipients,
  groupLabel,
}: EmailDialogProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim() || recipients.length === 0) return;

    setSending(true);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: recipients.map((r) => ({
            email: r.email,
            name: r.name,
          })),
          subject: subject.trim(),
          body: body.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to send email");
      }

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setSubject("");
        setBody("");
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      console.error("Send email error:", err);
      alert("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!sending) {
      onOpenChange(open);
      if (!open) {
        setSent(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            {recipients.length === 1 ? "Send Email" : "Bulk Email"}
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-primary" />
            </div>
            <p className="font-semibold text-foreground">
              Email{recipients.length > 1 ? "s" : ""} sent successfully!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Sent to {recipients.length} recipient{recipients.length !== 1 ? "s" : ""}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              {/* Recipients */}
              <div className="space-y-2">
                <Label>
                  To{" "}
                  <span className="text-muted-foreground font-normal">
                    ({recipients.length} recipient{recipients.length !== 1 ? "s" : ""})
                  </span>
                </Label>
                {groupLabel ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{groupLabel}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {recipients.length}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-secondary/50 p-2 max-h-24 overflow-y-auto">
                    {recipients.map((r) => (
                      <Badge key={r.id} variant="outline" className="text-xs">
                        {r.name || r.email}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label>
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject line..."
                  className="bg-secondary"
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <Label>
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your message here..."
                  className="bg-secondary min-h-[200px]"
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Plain text email. This will be sent from the K2 system email address.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={
                  sending ||
                  !subject.trim() ||
                  !body.trim() ||
                  recipients.length === 0
                }
                className="gradient-green text-primary-foreground"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {sending
                  ? "Sending..."
                  : `Send to ${recipients.length} recipient${recipients.length !== 1 ? "s" : ""}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
