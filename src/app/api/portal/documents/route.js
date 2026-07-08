import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

/**
 * GET /api/portal/documents
 * Returns the logged-in client's documents.
 * RLS on public.documents restricts SELECT to auth.uid() = client_id.
 */
export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('documents')
      .select('id, file_name, file_path, doc_type, uploaded_at')
      .eq('client_id', user.id)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ documents: data || [] });
  } catch (err) {
    console.error('Portal documents fetch error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
