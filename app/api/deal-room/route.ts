import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, createServiceRoleClient } from '@/lib/supabase-server';
import { createAdminNotification } from '@/lib/admin-notifications';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

const STORAGE_BUCKET = 'documents';

/** Ensure the storage bucket exists — creates it once if missing. */
async function ensureBucket(supabase: ReturnType<typeof createServiceRoleClient>) {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets && !buckets.find((b: any) => b.name === STORAGE_BUCKET)) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: false,
      fileSizeLimit: MAX_FILE_SIZE,
    });
    if (error) console.error('Bucket creation error (may already exist):', error.message);
  }
}

/** Ensure the deal_room_files table exists — creates it via raw SQL if missing. */
async function ensureTable(supabase: ReturnType<typeof createServiceRoleClient>) {
  // Quick probe: try selecting 0 rows. If the table doesn't exist, create it.
  const { error } = await supabase
    .from('deal_room_files')
    .select('id')
    .limit(0);

  if (error && error.message.includes('does not exist')) {
    // Table is missing — create it
    await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS deal_room_files (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id uuid NOT NULL REFERENCES profiles(id),
          file_name text NOT NULL,
          file_path text NOT NULL,
          file_size integer NOT NULL,
          mime_type text NOT NULL,
          category text NOT NULL DEFAULT 'general',
          review_status text NOT NULL DEFAULT 'pending'
            CHECK (review_status IN ('pending', 'approved', 'declined')),
          admin_note text,
          reviewed_at timestamptz,
          reviewed_by uuid REFERENCES profiles(id),
          created_at timestamptz DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_deal_room_files_user ON deal_room_files(user_id);
        CREATE INDEX IF NOT EXISTS idx_deal_room_files_status ON deal_room_files(review_status);
        ALTER TABLE deal_room_files ENABLE ROW LEVEL SECURITY;
        CREATE POLICY IF NOT EXISTS "service_role_full_deal_room"
          ON deal_room_files FOR ALL TO service_role USING (true) WITH CHECK (true);
      `,
    }).then(({ error: rpcErr }) => {
      if (rpcErr) {
        console.error('Could not auto-create deal_room_files table via RPC:', rpcErr.message);
        console.error('Please run the migration: supabase/migrations/20260302000000_referral_dealroom_commissions.sql');
      }
    });
  }
}

/** Check if current user has deal-room access (kit buyers + certified + admin) */
async function checkAccess(
  supabase: ReturnType<typeof createServiceRoleClient>,
  userId: string
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, preferred, workbook_purchased')
    .eq('id', userId)
    .maybeSingle();

  return (
    profile?.role === 'certified' ||
    profile?.preferred === true ||
    profile?.role === 'admin' ||
    profile?.workbook_purchased === true
  );
}

/**
 * GET /api/deal-room — list files for authenticated user
 *   ?dealId=xxx — filter by deal (required for multi-deal)
 * POST /api/deal-room — upload a file
 * DELETE /api/deal-room?fileId=xxx — delete a file
 */
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();

  if (!(await checkAccess(supabase, user.id))) {
    return NextResponse.json({ error: 'Certified Borrower access required' }, { status: 403 });
  }

  await ensureTable(supabase);

  const dealId = request.nextUrl.searchParams.get('dealId');

  let query = supabase
    .from('deal_room_files')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (dealId) {
    query = query.eq('deal_id', dealId);
  }

  const { data: files, error } = await query;

  if (error) {
    console.error('GET deal-room error:', error);
    // If the table still doesn't exist gracefully return empty
    if (error.message.includes('does not exist')) {
      return NextResponse.json({ files: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ files: files || [] });
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServiceRoleClient();

  if (!(await checkAccess(supabase, user.id))) {
    return NextResponse.json({ error: 'Certified Borrower access required' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'general';
    const dealId = formData.get('dealId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Use PDF, Word, Excel, CSV, or image files.' },
        { status: 400 }
      );
    }

    // Ensure the storage bucket + DB table exist
    await ensureBucket(supabase);
    await ensureTable(supabase);

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `deal-room/${user.id}/${timestamp}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, Buffer.from(arrayBuffer), {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Save metadata to DB
    const insertData: Record<string, any> = {
      user_id: user.id,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      category,
    };
    if (dealId) {
      insertData.deal_id = dealId;
    }

    const { data: record, error: dbError } = await supabase
      .from('deal_room_files')
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
      return NextResponse.json(
        { error: `Failed to save file record: ${dbError.message}` },
        { status: 500 }
      );
    }

    // Notify admin about new upload
    const { data: uploaderProfile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .maybeSingle();
    await createAdminNotification({
      type: 'upload',
      title: 'New document uploaded',
      message: `${file.name} (${category})`,
      user_id: user.id,
      user_name: uploaderProfile?.full_name || null,
      user_email: uploaderProfile?.email || user.email || null,
    });

    return NextResponse.json({ file: record });
  } catch (err: any) {
    console.error('Deal room upload error:', err);
    return NextResponse.json(
      { error: err?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const fileId = request.nextUrl.searchParams.get('fileId');
  if (!fileId) {
    return NextResponse.json({ error: 'Missing fileId' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  // Get the file record (ensure it belongs to this user)
  const { data: fileRecord } = await supabase
    .from('deal_room_files')
    .select('*')
    .eq('id', fileId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!fileRecord) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Delete from storage
  await supabase.storage.from('documents').remove([fileRecord.file_path]);

  // Delete from DB
  await supabase.from('deal_room_files').delete().eq('id', fileId);

  return NextResponse.json({ success: true });
}
