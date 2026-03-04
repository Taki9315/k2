import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const fileId = request.nextUrl.searchParams.get('fileId');
  if (!fileId) {
    return NextResponse.json({ error: 'Missing fileId' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Get the file record (ensure it belongs to this user or user is admin)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  let fileRecord;
  if (profile?.role === 'admin') {
    const { data } = await supabase
      .from('deal_room_files')
      .select('*')
      .eq('id', fileId)
      .maybeSingle();
    fileRecord = data;
  } else {
    const { data } = await supabase
      .from('deal_room_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', user.id)
      .maybeSingle();
    fileRecord = data;
  }

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

  const buffer = Buffer.from(await fileData.arrayBuffer());

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': fileRecord.mime_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileRecord.file_name}"`,
      'Content-Length': buffer.length.toString(),
    },
  });
}
