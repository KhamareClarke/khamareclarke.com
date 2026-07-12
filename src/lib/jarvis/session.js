/** Persist JARVIS conversation in sessionStorage (tab-scoped — not localStorage). */

export const JARVIS_SESSION_KEY = 'jarvis-session-messages';
export const JARVIS_SESSION_MAX_MESSAGES = 50;

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

/** Strip ephemeral UI fields; keep only restorable conversation rows. */
export function serializeJarvisMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim() &&
        !m.pending
    )
    .slice(-JARVIS_SESSION_MAX_MESSAGES)
    .map((m) => ({
      id: String(m.id || `${m.role}-${Date.now()}`),
      role: m.role,
      content: m.content.slice(0, 8000),
      ...(m.system ? { system: true } : {}),
    }));
}

export function loadJarvisSessionMessages() {
  if (!canUseSessionStorage()) return [];

  try {
    const raw = sessionStorage.getItem(JARVIS_SESSION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim()
    );
  } catch {
    return [];
  }
}

export function saveJarvisSessionMessages(messages) {
  if (!canUseSessionStorage()) return;

  try {
    const payload = serializeJarvisMessages(messages);
    if (!payload.length) {
      sessionStorage.removeItem(JARVIS_SESSION_KEY);
      return;
    }
    sessionStorage.setItem(JARVIS_SESSION_KEY, JSON.stringify(payload));
  } catch {
    // quota or private mode — ignore
  }
}

export function clearJarvisSessionMessages() {
  if (!canUseSessionStorage()) return;
  try {
    sessionStorage.removeItem(JARVIS_SESSION_KEY);
  } catch {
    // ignore
  }
}
