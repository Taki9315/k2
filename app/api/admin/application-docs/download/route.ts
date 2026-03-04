import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';

/**
 * GET /api/admin/application-docs/download?fileId=xxx
 * Admin-only download endpoint for deal room files.
 * The admin layout already gates access to /admin/* routes.
 */
export async function GET(request: NextRequest) {
  const fileId = request.nextUrl.searchParams.get('fileId');
  if (!fileId) {
    return NextResponse.json({ error: 'Missing fileId' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: fileRecord } = await supabase
    .from('deal_room_files')
    .select('*')
    .eq('id', fileId)
    .maybeSingle();

  if (!fileRecord) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Download from storage
  const { data: fileData, error } = await supabase.storage
    .from('documents')
    .download(fileRecord.file_path);

  if (error || !fileData) {
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }

  const arrayBuffer = await fileData.arrayBuffer();

  // If ?inline=true, serve for viewing; otherwise force download
  const inline = request.nextUrl.searchParams.get('inline') === 'true';

  return new NextResponse(arrayBuffer, {
    headers: {
      'Content-Type': fileRecord.mime_type || 'application/octet-stream',
      'Content-Disposition': inline
        ? `inline; filename="${fileRecord.file_name}"`
        : `attachment; filename="${fileRecord.file_name}"`,
      'Content-Length': arrayBuffer.byteLength.toString(),
    },
  });
}
