/**
 * VERIFY Task 6 — sessionStorage conversation persistence
 * Run: node docs/verify/task6/verify-session.mjs
 */
import {
  serializeJarvisMessages,
  JARVIS_SESSION_MAX_MESSAGES,
} from '../../../src/lib/jarvis/session.js';

const sample = [
  { id: 'u-1', role: 'user', content: 'status' },
  { id: 'a-1', role: 'assistant', content: 'All systems nominal, sir.' },
  { id: 'a-2', role: 'assistant', content: '', pending: true },
  { id: 'a-3', role: 'assistant', content: 'Searching…', pending: true },
  ...Array.from({ length: 55 }, (_, i) => ({
    id: `u-${i + 10}`,
    role: 'user',
    content: `message ${i}`,
  })),
];

const serialized = serializeJarvisMessages(sample);
if (serialized.length !== JARVIS_SESSION_MAX_MESSAGES) {
  console.error('FAIL expected max', JARVIS_SESSION_MAX_MESSAGES, 'got', serialized.length);
  process.exit(1);
}
if (serialized.some((m) => m.pending)) {
  console.error('FAIL pending messages should be stripped');
  process.exit(1);
}
if (!serialized.every((m) => m.role && m.content && m.id)) {
  console.error('FAIL invalid serialized shape');
  process.exit(1);
}

console.log('OK  serializeJarvisMessages caps at', JARVIS_SESSION_MAX_MESSAGES);
console.log('Manual VERIFY: khamareclarke.com/dashboard/jarvis → chat → refresh → history remains');
