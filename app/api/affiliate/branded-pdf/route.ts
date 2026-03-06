import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: 'Branded PDF endpoint — coming soon' },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: 'Branded PDF generation — coming soon' },
    { status: 200 }
  );
}
