import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';

type InquiryPayload = {
  type: 'lender' | 'vendor';
  name: string;
  company: string;
  email: string;
  lenderType?: string;
  serviceType?: string;
};

/**
 * POST /api/inquiry
 *
 * Called after a lender or vendor inquiry is inserted client-side.
 * Creates an admin_notifications row and (optionally) sends an email.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryPayload;

    if (!body.type || !body.name || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    /* Build notification content */
    const isLender = body.type === 'lender';
    const subject = isLender
      ? `New Lender Inquiry: ${body.company}`
      : `New Vendor Inquiry: ${body.company}`;

    const detail = isLender
      ? `Lender type: ${body.lenderType || 'N/A'}`
      : `Service type: ${body.serviceType || 'N/A'}`;

    const notificationBody = [
      `${body.name} from ${body.company} has submitted a ${isLender ? 'lender' : 'vendor'} inquiry.`,
      detail,
      `Email: ${body.email}`,
    ].join('\n');

    /* Look up the most recent inquiry to link as reference_id */
    const table = isLender ? 'lender_inquiries' : 'vendor_inquiries';
    const { data: recent } = await supabase
      .from(table)
      .select('id')
      .eq('email', body.email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const referenceId = recent?.id;

    if (referenceId) {
      await supabase.from('admin_notifications').insert({
        type: isLender ? 'lender_inquiry' : 'vendor_inquiry',
        reference_id: referenceId,
        subject,
        body: notificationBody,
        sent: false,
      });
    }

    /* ────────────────────────────────────────────────────────────────
     * Email notification (optional - works if ADMIN_EMAIL + a mailer
     * are configured; otherwise, the admin_notifications table row is
     * the record of the event)
     * ──────────────────────────────────────────────────────────────── */
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;

    if (adminEmail && resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'K2 Commercial Finance <notifications@k2commercialfinance.com>',
            to: adminEmail,
            subject,
            text: notificationBody,
          }),
        });

        /* Mark notification as sent */
        if (referenceId) {
          await supabase
            .from('admin_notifications')
            .update({ sent: true })
            .eq('reference_id', referenceId)
            .eq('sent', false);
        }
      } catch (emailErr) {
        console.error('Email send failed (non-blocking):', emailErr);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Inquiry notification error:', error);
    return NextResponse.json(
      { error: 'Failed to process notification' },
      { status: 500 }
    );
  }
}
