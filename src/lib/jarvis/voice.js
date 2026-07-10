'use client';

let preferredVoice = null;

export function pickBritishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  preferredVoice =
    voices.find((v) => v.lang === 'en-GB' && /google|daniel|arthur|martha/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith('en-GB')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0] ||
    null;
  return preferredVoice;
}

export function speakJarvis(text, { onStart, onEnd, muted } = {}) {
  if (muted || typeof window === 'undefined' || !window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = pickBritishVoice();
  utterance.rate = 0.95;
  utterance.pitch = 0.92;
  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function playBootChime(muted) {
  if (muted || typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // audio optional
  }
}

export function isSpeechRecognitionSupported() {
  return (
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  );
}

const SPEECH_ERRORS = {
  'not-allowed': 'Microphone access denied, sir. Allow mic permission for this site in browser settings.',
  'service-not-allowed': 'Microphone blocked by browser policy, sir. Try Chrome or Edge.',
  'no-speech': 'No speech detected, sir. Tap the mic and speak clearly.',
  'audio-capture': 'No microphone found, sir. Check your audio input device.',
  'network': 'Speech recognition needs network access, sir.',
  'aborted': null,
};

export function mapSpeechError(code) {
  return SPEECH_ERRORS[code] || (code ? `Voice input error (${code}), sir.` : null);
}

/** Extract best transcript from a SpeechRecognition result event. */
export function extractTranscript(event) {
  let transcript = '';
  for (let i = event.resultIndex; i < event.results.length; i += 1) {
    transcript += event.results[i][0]?.transcript || '';
  }
  return transcript.trim();
}

/**
 * Create a reusable SpeechRecognition instance (call once, reuse start/stop).
 */
export function createSpeechRecognition({ onResult, onError, onEnd, onStart, continuous = false }) {
  if (!isSpeechRecognitionSupported()) return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.continuous = continuous;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  rec.lang = 'en-GB';

  rec.onstart = () => onStart?.();
  rec.onresult = (e) => {
    const transcript = extractTranscript(e);
    if (transcript) onResult?.(transcript);
  };
  rec.onerror = (e) => onError?.(e.error || 'unknown');
  rec.onend = () => onEnd?.();

  return rec;
}

/** Warm up mic permission so the first recognition start is reliable. */
export async function ensureMicPermission() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}
