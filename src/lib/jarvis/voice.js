'use client';

let preferredVoice = null;
let speechAudioUnlocked = false;
let sharedAudioContext = null;

export function isSpeechAudioUnlocked() {
  return speechAudioUnlocked;
}

function getSharedAudioContext() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    try {
      sharedAudioContext = new Ctx();
    } catch {
      return null;
    }
  }
  return sharedAudioContext;
}

/** Play a silent blip so iOS/Android keep the audio session open for TTS. */
export function primeMobileAudioSession() {
  const ctx = getSharedAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') ctx.resume();
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // optional
  }
}

export function pickBritishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return preferredVoice;
  preferredVoice =
    voices.find((v) => v.lang === 'en-GB' && /google|daniel|arthur|martha|samantha/i.test(v.name)) ||
    voices.find((v) => v.lang.startsWith('en-GB')) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    voices[0] ||
    null;
  return preferredVoice;
}

/** Wait until voices are loaded (iOS often needs this before first speak). */
export function waitForVoices(timeoutMs = 2500) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve(null);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) {
      resolve(pickBritishVoice());
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(pickBritishVoice());
    };
    const prev = window.speechSynthesis.onvoiceschanged;
    window.speechSynthesis.onvoiceschanged = () => {
      prev?.();
      finish();
    };
    setTimeout(finish, timeoutMs);
  });
}

/** Prime audio + speech synthesis after a user gesture (required on iOS/Android). */
export function unlockSpeechAudio({ prime = false } = {}) {
  if (typeof window === 'undefined') return;
  try {
    primeMobileAudioSession();
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
      pickBritishVoice();
      if (prime) {
        const u = new SpeechSynthesisUtterance('Online.');
        u.volume = 0.12;
        u.rate = 1.2;
        const voice = pickBritishVoice();
        if (voice) u.voice = voice;
        window.speechSynthesis.speak(u);
      }
    }
    speechAudioUnlocked = true;
  } catch {
    // optional
  }
}

function ttsDelayMs() {
  if (isIOS()) return 180;
  if (isMobileUserAgent()) return 120;
  return 80;
}

function splitForTts(text) {
  const mobile = isMobileUserAgent();
  const limit = isIOS() ? 160 : mobile ? 220 : 4000;
  if (!mobile || text.length < limit) return [text];
  const parts = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return (parts || [text]).map((p) => p.trim()).filter(Boolean);
}

function speakingRefSafe(synth) {
  return synth.speaking || synth.pending;
}

/** Resume TTS output after a user gesture (required on iOS/Android). */
export function prepareSpeechOutput() {
  unlockSpeechAudio({ prime: false });
  primeMobileAudioSession();
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.resume?.();
  } catch {
    // ignore
  }
}

/** Wait until the browser finishes TTS (iOS often fires onend early). */
export function waitUntilSpeechIdle(maxMs = 8000) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }
    const synth = window.speechSynthesis;
    const start = Date.now();
    const tick = () => {
      if (!speakingRefSafe(synth) || Date.now() - start > maxMs) {
        resolve();
        return;
      }
      setTimeout(tick, 80);
    };
    tick();
  });
}

function buildUtterance(spoken, { onStart, onEnd, onError }) {
  pickBritishVoice();
  const utterance = new SpeechSynthesisUtterance(spoken);
  const voice = pickBritishVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = isMobileUserAgent() ? 1.0 : 0.95;
  utterance.pitch = 0.95;
  utterance.volume = 1;
  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onError?.();
  return utterance;
}

function speakSingleChunk(spoken, { onStart, onEnd, muted } = {}) {
  if (muted || typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd?.();
    return Promise.resolve(false);
  }
  if (!spoken) {
    onEnd?.();
    return Promise.resolve(false);
  }

  prepareSpeechOutput();

  return new Promise((resolve) => {
    let started = false;
    let settled = false;
    let iosKeepAlive = null;
    let maxWait = null;

    const finish = (didStart) => {
      if (settled) return;
      settled = true;
      if (maxWait) clearTimeout(maxWait);
      if (iosKeepAlive) clearInterval(iosKeepAlive);
      onEnd?.();
      resolve(didStart);
    };

    const synth = window.speechSynthesis;
    synth.cancel();
    maxWait = setTimeout(() => finish(started), isMobileUserAgent() ? 12000 : 8000);

    const runAttempt = (attempt = 0) => {
      if (settled) return;
      try {
        synth.resume?.();
        primeMobileAudioSession();
      } catch {
        // ignore
      }

      const utterance = buildUtterance(spoken, {
        onStart: () => {
          started = true;
          onStart?.();
        },
        onEnd: () => finish(started),
        onError: () => {
          if (attempt < 2 && isMobileUserAgent()) {
            setTimeout(() => runAttempt(attempt + 1), isIOS() ? 320 : 400);
          } else {
            finish(started);
          }
        },
      });

      synth.speak(utterance);

      if (isIOS()) {
        iosKeepAlive = setInterval(() => {
          try {
            synth.resume?.();
          } catch {
            // ignore
          }
        }, 120);
      }

      if (isMobileUserAgent()) {
        setTimeout(() => {
          if (settled || started) return;
          if (!speakingRefSafe(synth) && attempt < 2) {
            runAttempt(attempt + 1);
          } else if (!started && attempt >= 2) {
            finish(false);
          }
        }, isIOS() ? 900 : 700);
      }
    };

    setTimeout(() => runAttempt(0), ttsDelayMs());
  });
}

async function speakChunks(chunks, opts, index = 0, anyStarted = false) {
  if (index >= chunks.length) {
    if (isMobileUserAgent()) {
      await waitUntilSpeechIdle(isIOS() ? 4000 : 2500);
    } else {
      await waitUntilSpeechIdle(6000);
    }
    opts.onEnd?.();
    return anyStarted;
  }
  if (index > 0 && isMobileUserAgent()) {
    await new Promise((r) => setTimeout(r, isIOS() ? 160 : 120));
  }
  const started = await speakSingleChunk(chunks[index], {
    muted: opts.muted,
    onStart: index === 0 ? opts.onStart : undefined,
  });
  return speakChunks(chunks, opts, index + 1, anyStarted || started);
}

export function speakJarvis(text, { onStart, onEnd, muted } = {}) {
  const spoken = String(text || '').trim().slice(0, 4000);
  if (muted || !spoken) {
    onEnd?.();
    return Promise.resolve(false);
  }

  return waitForVoices().then(() => {
    const chunks = splitForTts(spoken);
    return speakChunks(chunks, { onStart, onEnd, muted });
  });
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume?.();
    } catch {
      // ignore
    }
  }
}

/** Brief pause after TTS before reopening the mic on mobile. */
export async function handoffSpeechToMic() {
  if (!isMobileUserAgent()) return;
  await waitUntilSpeechIdle(isIOS() ? 2000 : 1200);
  await new Promise((r) => setTimeout(r, isIOS() ? 200 : 120));
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

export function isMobileUserAgent() {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/** iOS Safari handles single-utterance mode + auto-restart more reliably than continuous. */
export function speechRecognitionUsesContinuous() {
  return !isIOS();
}

export function getVoicePlatformHint() {
  if (typeof window === 'undefined') return null;
  if (!isSpeechRecognitionSupported()) {
    if (isIOS()) {
      return 'Voice needs Safari 14.5+ on iPhone, sir. Text commands work in the box below.';
    }
    if (isMobileUserAgent()) {
      return 'Voice works best in Chrome on Android, sir. Text commands always work below.';
    }
    return 'Voice needs Chrome or Edge, sir. Text commands work below.';
  }
  if (isMobileUserAgent()) {
    return 'Tap Enable voice once, then speak. Turn off silent mode. Tap 🎤 to interrupt JARVIS and speak again.';
  }
  return null;
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

/** Process a SpeechRecognition result event into accumulated finals + display text. */
export function processRecognitionResult(event, accumulated = '') {
  let interim = '';
  let finals = accumulated;
  let hadFinal = false;
  for (let i = event.resultIndex; i < event.results.length; i += 1) {
    const piece = event.results[i][0]?.transcript || '';
    if (event.results[i].isFinal) {
      hadFinal = true;
      finals = `${finals} ${piece}`.trim();
    } else {
      interim += piece;
    }
  }
  const display = (interim ? `${finals} ${interim}` : finals).trim();
  return { accumulated: finals, display, interim: interim.trim(), hadFinal };
}

/**
 * Create a reusable SpeechRecognition instance (call once, reuse start/stop).
 * onResult receives the raw SpeechRecognitionEvent.
 */
export function createSpeechRecognition({ onResult, onError, onEnd, onStart, continuous = false }) {
  if (!isSpeechRecognitionSupported()) return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.continuous = continuous;
  rec.interimResults = true;
  rec.maxAlternatives = 1;
  rec.lang = typeof navigator !== 'undefined' && navigator.language?.startsWith('en')
    ? navigator.language
    : 'en-GB';

  rec.onstart = () => onStart?.();
  rec.onresult = (e) => onResult?.(e);
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
