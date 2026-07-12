/**
 * VERIFY: conversational lead date-range parsing (no @/ imports).
 * Run: node docs/verify/leads-date-ranges/verify-parser.mjs
 */

function norm(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ');
}

const MAX_LEADS_DAYS = 90;

function clampLeadsDays(n) {
  return Math.min(Math.max(parseInt(n, 10) || 1, 1), MAX_LEADS_DAYS);
}

function parseLeadsDaysRange(text) {
  const t = norm(text);
  if (!t) return null;

  let m = t.match(/\b(?:last|past|previous|in the last|over the last|for the last)\s+(\d{1,2})\s+days?\b/);
  if (m) return { days: clampLeadsDays(m[1]) };

  m = t.match(/\bleads?\s+(?:for\s+)?(?:the\s+)?(?:last|past)\s+(\d{1,2})\s+days?\b/);
  if (m) return { days: clampLeadsDays(m[1]) };

  if (/\blast\s+month\b/.test(t)) return { days: 30, label: 'last month' };
  if (/\bthis\s+month\b/.test(t)) return { days: 30, label: 'this month' };
  if (/\b(?:this|current)\s+week\b/.test(t)) return { days: 7, label: 'this week' };
  if (/\blast\s+week\b/.test(t)) return { days: 7, label: 'last week' };

  return null;
}

const CASES = [
  { input: 'leads this week', days: 7, label: 'this week' },
  { input: 'leads last 30 days', days: 30 },
  { input: 'how many leads last month', days: 30, label: 'last month' },
  { input: 'leads last month', days: 30, label: 'last month' },
  { input: 'this month leads', days: 30, label: 'this month' },
  { input: 'how many leads in the last 7 days', days: 7 },
  { input: 'leads today', days: null },
];

let failed = 0;
for (const { input, days, label } of CASES) {
  const got = parseLeadsDaysRange(input);
  const ok =
    days == null
      ? got == null
      : got?.days === days && (label == null || got.label === label);
  if (!ok) {
    failed += 1;
    console.error('FAIL', input, 'expected', { days, label }, 'got', got);
  } else {
    console.log('OK  ', input, '→', got || '(no range)');
  }
}

if (failed) {
  console.error(`\n${failed} case(s) failed`);
  process.exit(1);
}
console.log('\nAll parser cases passed.');
