import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-guard';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionAndProfile } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_TYPES = ['contract', 'proposal', 'report', 'invoice', 'general'];

/**
 * POST /api/admin/documents  (multipart/form-data)
 * Fields: file, client_id, doc_type
 * Uploads to Supabase Storage bucket 'client-documents' at path <client_id>/<uuid>-<name>,
 * then inserts a metadata row into public.documents.
 */
export async function POST(req) {
  const guard = await requireAuth();
  if (guard) return guard;

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 503 });
    }

    const { user: adminUser } = await getSessionAndProfile();

    const form = await req.formData();
    const file = form.get('file');
    const clientId = String(form.get('client_id') || '').trim();
    const docType = String(form.get('doc_type') || 'general').trim();

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'file required' }, { status: 400 });
    }
    if (!clientId) {
      return NextResponse.json({ error: 'client_id required' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(docType)) {
      return NextResponse.json({ error: `doc_type must be one of ${ALLOWED_TYPES.join(', ')}` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 25MB' }, { status: 413 });
    }

    // Verify client exists.
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', clientId)
      .maybeSingle();
    if (!profile) return NextResponse.json({ error: 'Unknown client' }, { status: 404 });

    const safeName = String(file.name).replace(/[^\w.\-]+/g, '_').slice(0, 200);
    const key = `${clientId}/${crypto.randomUUID()}-${safeName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabaseAdmin.storage
      .from('client-documents')
      .upload(key, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });
    if (upErr) throw upErr;

    const { error: insErr, data: inserted } = await supabaseAdmin
      .from('documents')
      .insert({
        client_id: clientId,
        file_path: key,
        file_name: safeName,
        doc_type: docType,
        uploaded_by: adminUser?.id || null,
      })
      .select('id')
      .single();
    if (insErr) throw insErr;

    return NextResponse.json({ ok: true, id: inserted.id, path: key });
  } catch (err) {
    console.error('Document upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/documents?id=<documentId>
 * Removes the storage object + metadata row.
 */
export async function DELETE(req) {
  const guard = await requireAuth();
  if (guard) return guard;

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 503 });
    }
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { data: doc } = await supabaseAdmin
      .from('documents')
      .select('id, file_path')
      .eq('id', id)
      .maybeSingle();
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await supabaseAdmin.storage.from('client-documents').remove([doc.file_path]);
    await supabaseAdmin.from('documents').delete().eq('id', id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Document delete error:', err);
    return NextResponse.json({ error: err.message || 'Delete failed' }, { status: 500 });
  }
}
