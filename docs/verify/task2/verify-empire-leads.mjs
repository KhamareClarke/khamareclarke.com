#!/usr/bin/env node
/**
 * Task 2 VERIFY — empire_leads in JARVIS context.
 * Usage: node docs/verify/task2/verify-empire-leads.mjs [baseUrl]
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (+ session cookie for chat).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '../../..');
const BASE = process.argv[2] || 'http://localhost:3000';

function loadEnvLocal() {
  const path = join(root, '.env.local');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const admin = createClient(url, key, { auth: { persistSession: false } });
  const { count, error } = await admin
    .from('empire_leads')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', 'myapproved');

  if (error) {
    console.error('DB count error:', error.message);
    process.exit(1);
  }

  console.log('=== DB row count (empire_leads, project_id=myapproved) ===');
  console.log(count ?? 0);

  const { buildJarvisContext } = await import('../../../src/lib/jarvis/context.js');
  const ctx = await buildJarvisContext();
  const block = ctx.text || '';
  const totalLine = block
    .split('\n')
    .find((l) => l.includes('Empire scraped leads (empire_leads) total for myapproved:'));
  console.log('\n=== Context line ===');
  console.log(totalLine || '(missing)');

  const ctxMatch = totalLine?.match(/total for myapproved:\s*(\d+)/);
  const ctxTotal = ctxMatch ? Number(ctxMatch[1]) : null;
  const aligned = ctxTotal === count;
  console.log('\n=== Alignment ===');
  console.log(aligned ? 'PASS — context total matches DB count' : `FAIL — context=${ctxTotal} db=${count}`);

  const session = process.env.JARVIS_VERIFY_SESSION;
  if (session) {
    const res = await fetch(`${BASE}/api/jarvis/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: session,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'how many leads has Empire scraped for MyApproved?' }],
      }),
    });
    const text = await res.text();
    console.log('\n=== JARVIS raw stream (truncated) ===');
    console.log(text.slice(0, 2000));
  } else {
    console.log('\n(Set JARVIS_VERIFY_SESSION cookie to also capture live JARVIS answer)');
  }

  process.exit(aligned ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
