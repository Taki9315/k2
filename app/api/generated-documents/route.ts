import { NextResponse } from 'next/server';
import { createServiceRoleClient, getUserFromRequest } from '@/lib/supabase-server';

type CreateDocumentPayload = {
  title: string;
  documentType: string;
  content: string;
  taskId?: string;
  metadata?: Record<string, unknown>;
};

/* ------------------------------------------------------------------ */
/*  GET /api/generated-documents — list current user's documents       */
/* ------------------------------------------------------------------ */

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('generated_documents')
      .select('id, title, document_type, content, task_id, metadata, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch generated documents:', error);
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    return NextResponse.json({ documents: data ?? [] });
  } catch (error) {
    console.error('Unexpected generated-documents GET error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  POST /api/generated-documents — save a new generated document      */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as CreateDocumentPayload;

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      );
    }
    if (!body.content?.trim()) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from('generated_documents')
      .insert({
        user_id: user.id,
        title: body.title.trim(),
        document_type: body.documentType || 'executive-summary',
        content: body.content,
        task_id: body.taskId || null,
        metadata: body.metadata || {},
      })
      .select('id, title, document_type, created_at')
      .single();

    if (error) {
      console.error('Failed to save generated document:', error);
      return NextResponse.json(
        { error: 'Failed to save document' },
        { status: 500 }
      );
    }

    return NextResponse.json({ document: data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected generated-documents POST error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
