import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/portal/documents/download?id=<documentId>
 * Verifies the logged-in user owns the document, then generates a signed URL
 * from the private 'client-documents' Storage bucket (60 second expiry).
 * Uses supabaseAdmin (service role) so we never expose bucket credentials to the browser.
 */
export async function GET(req) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Storage not configured' }, { status: 503 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    // Check ownership via profile.role — admins can download any doc.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    const isAdmin = profile?.role === 'admin';

    // Use service role for the ownership lookup (avoids RLS quirks).
    const query = supabaseAdmin
      .from('documents')
      .select('client_id, file_path, file_name')
      .eq('id', id)
      .maybeSingle();
    const { data: doc, error: docErr } = await query;
    if (docErr) throw docErr;
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!isAdmin && doc.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from('client-documents')
      .createSignedUrl(doc.file_path, 60, { download: doc.file_name });
    if (signErr) throw signErr;

    return NextResponse.json({ url: signed.signedUrl, fileName: doc.file_name });
  } catch (err) {
    console.error('Document download error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
