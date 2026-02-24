import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';

type ContactPartnerPayload = {
  partner_id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
};

/**
 * POST /api/contact-partner
 *
 * Sends an email to a partner (lender or vendor) when a certified borrower
 * submits the contact form on the partner's profile page.
 *
 * Also inserts an admin notification for tracking.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPartnerPayload;

    if (!body.partner_id || !body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    /* Look up partner details */
    const { data: partner, error: partnerErr } = await supabase
      .from('partner_profiles')
      .select('id, company_name, contact_email, contact_name, partner_type')
      .eq('id', body.partner_id)
      .eq('is_published', true)
      .maybeSingle();

    if (partnerErr || !partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    /* Build email content */
    const isLender = partner.partner_type === 'lender';
    const partnerLabel = isLender ? 'Lender' : 'Vendor';

    const subject = `New Inquiry from K2 Certified Borrower – ${body.name}`;

    const partnerEmailBody = [
      `Hi ${partner.contact_name || partner.company_name},`,
      '',
      `You have received a new inquiry through your K2 Commercial Finance ${partnerLabel} profile page.`,
      '',
      `Borrower Name: ${body.name}`,
      `Email: ${body.email}`,
      body.phone ? `Phone: ${body.phone}` : null,
      '',
      'Message:',
      body.message,
      '',
      '---',
      'This message was sent via K2 Commercial Finance (https://k2cfinance.com).',
    ]
      .filter((line) => line !== null)
      .join('\n');

    const adminSubject = `${partnerLabel} Contact: ${body.name} → ${partner.company_name}`;
    const adminEmailBody = [
      `A certified borrower submitted a contact request to ${partner.company_name}.`,
      '',
      `Borrower: ${body.name}`,
      `Email: ${body.email}`,
      body.phone ? `Phone: ${body.phone}` : null,
      '',
      'Message:',
      body.message,
    ]
      .filter((line) => line !== null)
      .join('\n');

    /* Store an admin notification */
    await supabase.from('admin_notifications').insert({
      type: isLender ? 'lender_contact' : 'vendor_contact',
      reference_id: partner.id,
      subject: adminSubject,
      body: adminEmailBody,
      sent: false,
    });

    /* ── Send emails via Resend ──────────────────────────────────── */
    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (resendKey) {
      const fromAddress =
        'K2 Commercial Finance <notifications@k2commercialfinance.com>';

      // Email to partner
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: partner.contact_email,
            reply_to: body.email,
            subject,
            text: partnerEmailBody,
          }),
        });
      } catch (emailErr) {
        console.error('Partner email send failed (non-blocking):', emailErr);
      }

      // Copy to admin
      if (adminEmail) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromAddress,
              to: adminEmail,
              subject: adminSubject,
              text: adminEmailBody,
            }),
          });

          // Mark notification sent
          await supabase
            .from('admin_notifications')
            .update({ sent: true })
            .eq('reference_id', partner.id)
            .eq('type', isLender ? 'lender_contact' : 'vendor_contact')
            .eq('sent', false);
        } catch (emailErr) {
          console.error('Admin email send failed (non-blocking):', emailErr);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact partner error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact request' },
      { status: 500 }
    );
  }
}
