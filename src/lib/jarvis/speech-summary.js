import { stripJarvisMarkdown } from '@/app/dashboard/components/jarvis/JarvisMessageContent';

const SHORT_MAX = 200;
const SPEECH_MAX = 240;
const MAX_SENTENCES = 2;

function normalizePlain(text) {
  return stripJarvisMarkdown(text).replace(/\s+/g, ' ').trim();
}

function countBullets(text) {
  return (text.match(/^\s*[\*\-•▸]\s+/gm) || []).length;
}

function firstSentences(text, max = MAX_SENTENCES) {
  const parts = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  return parts.slice(0, max).join(' ').trim();
}

function looksLikeDraft(text) {
  if (text.length < 380) return false;
  return (
    /\b(dear|sincerely|regards|to whom|subject:|yours faithfully|yours sincerely)\b/i.test(text) ||
    (text.split('\n').filter(Boolean).length >= 5 && text.length > 450)
  );
}

/**
 * Short spoken line for voice — full text stays in the chat panel.
 */
export function summarizeForSpeech(text, { writingTask = false, speakFull = false } = {}) {
  const plain = normalizePlain(text);
  if (!plain) return '';

  if (speakFull || plain.length <= SHORT_MAX) {
    return plain;
  }

  if (writingTask || looksLikeDraft(plain)) {
    if (/\bsick leave\b/i.test(plain)) {
      return "I've drafted your sick leave application in the chat, sir.";
    }
    if (/\b(email|letter|application|message|draft)\b/i.test(plain)) {
      return "I've prepared the full draft in the chat, sir.";
    }
    return "I've written that out in the chat for you, sir.";
  }

  const bullets = countBullets(stripJarvisMarkdown(text));
  if (bullets >= 3) {
    const intro = firstSentences(plain, 1);
    if (intro && intro.length < SPEECH_MAX) {
      return `${intro} I've put the full list and links in the chat, sir.`;
    }
    return `I've found several results, sir. See the full list in the chat.`;
  }

  let summary = firstSentences(plain, MAX_SENTENCES);
  if (summary.length > SPEECH_MAX) {
    summary = `${summary.slice(0, SPEECH_MAX).replace(/\s+\S*$/, '').trim()}…`;
  }

  if (summary.length < plain.length * 0.75) {
    return `${summary} Full details are in the chat, sir.`;
  }

  return summary;
}
