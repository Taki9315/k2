import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: 'Affiliate sales endpoint — coming soon' },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: 'Affiliate sales recording — coming soon' },
    { status: 200 }
  );
}
