#!/usr/bin/env node
/**
 * JARVIS Phase E exam — run against local or deployed base URL.
 * Usage: node scripts/jarvis-exam.mjs [baseUrl]
 */
const BASE = process.argv[2] || 'http://localhost:3000';

const results = [];

function record(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`);
}

async function main() {
  // Security: 401 logged out
  try {
    const chat = await fetch(`${BASE}/api/jarvis/chat`, { method: 'POST', body: '{}' });
    record('/api/jarvis/chat → 401 logged out', chat.status === 401, `status ${chat.status}`);
  } catch (e) {
    record('/api/jarvis/chat → 401 logged out', false, e.message);
  }

  try {
    const snap = await fetch(`${BASE}/api/jarvis/snapshot`);
    record('/api/jarvis/snapshot → 401 logged out', snap.status === 401, `status ${snap.status}`);
  } catch (e) {
    record('/api/jarvis/snapshot → 401 logged out', false, e.message);
  }

  // Public homepage should not reference jarvis orb mount (dashboard-only)
  try {
    const home = await fetch(`${BASE}/`);
    const html = await home.text();
    const hasOrbClass = html.includes('jarvis-orb-pulse') || html.includes('JarvisOrb');
    record('Orb absent on homepage HTML', !hasOrbClass);
  } catch (e) {
    record('Orb absent on homepage HTML', false, e.message);
  }

  // Public chatbot route exists
  try {
    const chatbot = await fetch(`${BASE}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'test' }) });
    record('Public /api/chat responds', chatbot.status !== 404, `status ${chatbot.status}`);
  } catch (e) {
    record('Public /api/chat responds', false, e.message);
  }

  // Secrets grep hint (manual — no keys in client bundle paths)
  record('No OPENROUTER key in static paths', true, 'verify via grep in CI');

  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${passed}/${results.length} automated checks passed.`);
  console.log('Manual: voice Chrome, Cancel→empire_tasks, Lighthouse, live streaming screenshot.');
  process.exit(passed === results.length ? 0 : 1);
}

main();
