import { NextResponse } from 'next/server';
import { createServiceRoleClient, getUserFromRequest } from '@/lib/supabase-server';

/* ------------------------------------------------------------------ */
/*  GET /api/admin/generated-documents — all generated docs (admin)    */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const supabase = createServiceRoleClient();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse optional query params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
    const search = url.searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    // Build query — join profiles to get creator name & email
    let query = supabase
      .from('generated_documents')
      .select(
        'id, title, document_type, task_id, content, metadata, created_at, updated_at, user_id, profiles!generated_documents_user_id_fkey(full_name, email)',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`title.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch generated documents for admin:', error);
      // Fallback without join if foreign key name doesn't match
      const fallback = await supabase
        .from('generated_documents')
        .select('id, title, document_type, task_id, content, metadata, created_at, updated_at, user_id', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fallback.error) {
        return NextResponse.json(
          { error: 'Failed to fetch documents' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        documents: fallback.data ?? [],
        total: fallback.count ?? 0,
        page,
        limit,
      });
    }

    return NextResponse.json({
      documents: data ?? [],
      total: count ?? 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Unexpected admin generated-documents GET error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
