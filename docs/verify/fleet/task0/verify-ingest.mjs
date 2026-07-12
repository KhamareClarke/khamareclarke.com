#!/usr/bin/env node
/**
 * Task 0 verify: POST /api/fleet/ingest (good + bad bearer).
 * Usage: FLEET_INGEST_SECRET=... node docs/verify/fleet/task0/verify-ingest.mjs
 * Optional: FLEET_INGEST_URL=https://www.khamareclarke.com/api/fleet/ingest
 */
const secret = process.env.FLEET_INGEST_SECRET;
const url =
  (process.env.FLEET_INGEST_URL || 'https://www.khamareclarke.com/api/fleet/ingest').replace(
    /\/$/,
    ''
  );

const body = JSON.stringify({
  project: 'test',
  event_type: 'lead',
  summary: 'curl test',
});

async function post(bearer) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearer}`,
    },
    body,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

async function main() {
  console.log('Fleet ingest verify');
  console.log('URL:', url);

  if (!secret) {
    console.error('FLEET_INGEST_SECRET not set — export it and re-run.');
    process.exit(1);
  }

  console.log('\n--- Good bearer ---');
  const good = await post(secret);
  console.log('HTTP', good.status);
  console.log(JSON.stringify(good.json, null, 2));

  console.log('\n--- Wrong bearer ---');
  const bad = await post('wrong-secret');
  console.log('HTTP', bad.status);
  console.log(JSON.stringify(bad.json, null, 2));

  const ok = good.status === 200 && good.json?.ok === true && bad.status === 401;
  console.log(ok ? '\nPASS' : '\nFAIL');
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
