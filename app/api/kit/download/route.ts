import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';
import fs from 'fs/promises';
import path from 'path';

/**
 * GET /api/kit/download?code=PARTNER_CODE
 * Returns the Success Kit PDF. If a partner referral code is provided,
 * the second page is branded with the partner's company name / logo.
 */
export async function GET(request: NextRequest) {
  // Authenticate user
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const referralCode = request.nextUrl.searchParams.get('code');
  const supabase = createServiceRoleClient();

  // Verify the user purchased the kit
  const { data: profile } = await supabase
    .from('profiles')
    .select('workbook_purchased, role, preferred')
    .eq('id', user.id)
    .maybeSingle();

  const hasAccess =
    profile?.workbook_purchased ||
    profile?.role === 'certified' ||
    profile?.preferred === true ||
    profile?.role === 'admin';

  if (!hasAccess) {
    return NextResponse.json({ error: 'Kit not purchased' }, { status: 403 });
  }

  try {
    // Load the base kit PDF from public/assets (or create a placeholder)
    let pdfDoc: PDFDocument;
    const basePdfPath = path.join(process.cwd(), 'public', 'assets', 'k2-success-kit.pdf');

    try {
      const existingPdf = await fs.readFile(basePdfPath);
      pdfDoc = await PDFDocument.load(new Uint8Array(existingPdf));
    } catch {
      // If no base PDF exists yet, create a simple placeholder
      pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      page.drawText('K2 Success Kit', {
        x: 50,
        y: 700,
        size: 36,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText('Your commercial real estate financing toolkit.', {
        x: 50,
        y: 660,
        size: 14,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    // If a referral code was provided, add partner branding on page 2
    if (referralCode) {
      const { data: partner } = await supabase
        .from('profiles')
        .select('full_name, company')
        .eq('referral_code', referralCode)
        .maybeSingle();

      if (partner) {
        const brandPage = pdfDoc.insertPage(1, [612, 792]); // Insert as page 2
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Partner branding header
        brandPage.drawText('Brought to You By', {
          x: 50,
          y: 700,
          size: 14,
          font: fontRegular,
          color: rgb(0.4, 0.4, 0.4),
        });

        brandPage.drawText(partner.company || partner.full_name || 'K2 Partner', {
          x: 50,
          y: 670,
          size: 28,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.3),
        });

        brandPage.drawText('K2 Preferred Partner', {
          x: 50,
          y: 640,
          size: 12,
          font: fontRegular,
          color: rgb(0.2, 0.5, 0.3),
        });

        // Divider line
        brandPage.drawRectangle({
          x: 50,
          y: 620,
          width: 512,
          height: 1,
          color: rgb(0.8, 0.8, 0.8),
        });

        brandPage.drawText(
          'This Success Kit was provided through our partner network.',
          { x: 50, y: 590, size: 11, font: fontRegular, color: rgb(0.4, 0.4, 0.4) }
        );
        brandPage.drawText(
          'For questions, contact your referring partner or visit k2commercialfinance.com.',
          { x: 50, y: 572, size: 11, font: fontRegular, color: rgb(0.4, 0.4, 0.4) }
        );
      }
    }

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="K2-Success-Kit.pdf"',
      },
    });
  } catch (err: any) {
    console.error('Kit download error:', err);
    return NextResponse.json(
      { error: 'Failed to generate kit' },
      { status: 500 }
    );
  }
}
