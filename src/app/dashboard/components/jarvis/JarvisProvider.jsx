'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseJarvisCommand } from '@/lib/jarvis/commands';
import { composeReadResponse, normalizeJarvisContext } from '@/lib/jarvis/templates';
import {
  speakJarvis,
  speakJarvisFromGesture,
  stopSpeaking,
  playBootChime,
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  pickBritishVoice,
  mapSpeechError,
  ensureMicPermission,
  processRecognitionResult,
  isMobileUserAgent,
  isIOS,
  speechRecognitionUsesContinuous,
  getVoicePlatformHint,
  unlockSpeechAudio,
  isSpeechAudioUnlocked,
  prepareSpeechOutput,
  handoffSpeechToMic,
  primeMobileAudioSession,
} from '@/lib/jarvis/voice';
import { stripJarvisMarkdown } from '@/app/dashboard/components/jarvis/JarvisMessageContent';
import { summarizeForSpeech } from '@/lib/jarvis/speech-summary';
import {
  messageNeedsWebSearch,
  hasExplicitSearchIntent,
  buildWebSearchQuery,
  isWritingRequest,
  extractSearchQueryFromTranscript,
  normalizeSearchQuery,
  summarizeSearchResults,
  isRealSearchResultSet,
} from '@/lib/jarvis/web-search';
import { navigateExternalUrl } from '@/lib/jarvis/open-url';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import {
  clearJarvisSessionMessages,
  loadJarvisSessionMessages,
  saveJarvisSessionMessages,
} from '@/lib/jarvis/session';

function resolveOpenUrlFromParsed(parsed) {
  if (!parsed || parsed.type !== 'action') return null;
  if (parsed.command === 'browse' && parsed.url) return parsed.url;
  if (parsed.command === 'open' && parsed.route && typeof window !== 'undefined') {
    return `${window.location.origin}${parsed.route}`;
  }
  return null;
}

function prefetchOpenFromTranscript(transcript, prefetchedRef) {
  const url = resolveOpenUrlFromParsed(parseJarvisCommand(transcript, []));
  if (!url) return false;
  prefetchedRef.current = url;
  return navigateExternalUrl(url);
}

const JarvisContext = createContext(null);
const PRESENTATION_KEY = 'jarvis-presentation';
const MUTE_KEY = 'jarvis-mute';
const VOICE_AUTO_SEND_KEY = 'jarvis-voice-auto-send';
const CONTINUOUS_LISTEN_KEY = 'jarvis-continuous-listen';
const CLAP_WAKE_KEY = 'jarvis-clap-wake';

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name, value) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=31536000;SameSite=Lax`;
}

export function useJarvis() {
  const ctx = useContext(JarvisContext);
  if (!ctx) throw new Error('useJarvis must be used within JarvisProvider');
  return ctx;
}

async function pollTaskOutcome(taskId, signal) {
  for (let i = 0; i < 60; i += 1) {
    if (signal?.aborted) return null;
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`/api/empire/task-status?id=${taskId}`, { credentials: 'include', cache: 'no-store', signal });
    if (!res.ok) continue;
    const data = await res.json();
    const task = data.task || data.tasks?.[0];
    if (task && task.status !== 'pending' && task.status !== 'running') {
      return task;
    }
  }
  return null;
}

export function JarvisProvider({ children, toastApi, minimal = false }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [bootLine, setBootLine] = useState(null);
  const [bootTyped, setBootTyped] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  /** True while continuous voice session is armed (mic loop) — stabilises mobile UI between recognition restarts. */
  const [micSessionActive, setMicSessionActive] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [muted, setMuted] = useState(false);
  const [voiceAutoSend, setVoiceAutoSend] = useState(true);
  const [continuousListen, setContinuousListen] = useState(true);
  const [clapWake, setClapWake] = useState(true);
  const [clapActivated, setClapActivated] = useState(false);
  const [voiceInterim, setVoiceInterim] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const [lastActivityTs, setLastActivityTs] = useState(null);
  const [lastFleetEventTs, setLastFleetEventTs] = useState(null);
  const [lastReplyText, setLastReplyText] = useState('');
  const [voiceNeedsTap, setVoiceNeedsTap] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  // Manual activity override for the HUD: 'searching' | 'opening' | 'drawing' | null.
  const [busyActivity, setBusyActivity] = useState(null);
  const busyActivityTimerRef = useRef(null);

  const abortRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userScrolledUpRef = useRef(false);
  const recognitionRef = useRef(null);
  const recognizingRef = useRef(false);
  const transcriptRef = useRef('');
  const voiceAutoSendRef = useRef(false);
  const sendMessageRef = useRef(null);
  const onTranscriptRef = useRef(null);
  const bootPlayedRef = useRef(false);
  const pendingQueryRef = useRef(null);
  const streamingRef = useRef(false);
  const speakingRef = useRef(false);
  const continuousListenRef = useRef(false);
  const scheduleRestartRef = useRef(null);
  const beginListeningRef = useRef(null);
  const lastInterimRef = useRef('');
  const voiceSendTimerRef = useRef(null);
  const skipOnEndSendRef = useRef(false);
  const pendingTtsRef = useRef(false);
  const lastSearchQueryRef = useRef(null);
  const lastBrowseRef = useRef(null);
  const lastSpeechTextRef = useRef('');
  const prefetchedOpenUrlRef = useRef(null);
  const messageQueueRef = useRef([]);
  const flushMessageQueueRef = useRef(null);
  const clapFlashTimerRef = useRef(null);
  const clapDetectorRef = useRef(null);
  const mutedRef = useRef(false);
  const refreshDataRef = useRef(null);
  const speakReplyRef = useRef(null);
  const micSessionActiveRef = useRef(false);
  const listeningClearTimerRef = useRef(null);
  const restartListeningTimerRef = useRef(null);
  /** Sticky arm flag — stays true between recognition restarts so HUD never flickers to idle. */
  const voiceSessionArmedRef = useRef(false);

  const toggle = useCallback(() => {
    router.push('/dashboard/jarvis');
  }, [router]);
  const close = useCallback(() => setOpen(false), []);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/jarvis/snapshot', { credentials: 'include', cache: 'no-store' });
      if (!res.ok) return null;
      const d = await res.json();
      if (d?.ok) {
        setLiveData(d);
        return d;
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  useEffect(() => {
    refreshDataRef.current = refreshData;
  }, [refreshData]);

  useEffect(() => {
    if (minimal) return;
    const saved = loadJarvisSessionMessages();
    if (saved.length) setMessages(saved);
    sessionPersistReadyRef.current = true;
  }, [minimal]);

  useEffect(() => {
    if (minimal || !sessionPersistReadyRef.current) return;
    saveJarvisSessionMessages(messages);
  }, [messages, minimal]);

  useEffect(() => {
    setPresentationMode(readCookie(PRESENTATION_KEY) === '1');
    if (readCookie(MUTE_KEY) === '1') setMuted(true);
    if (readCookie(VOICE_AUTO_SEND_KEY) === '0') setVoiceAutoSend(false);
    if (readCookie(CLAP_WAKE_KEY) === '0') setClapWake(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = pickBritishVoice;
      pickBritishVoice();
    }
  }, []);

  useEffect(() => {
    if (presentationMode) {
      document.documentElement.classList.add('jarvis-presentation');
    } else {
      document.documentElement.classList.remove('jarvis-presentation');
    }
    writeCookie(PRESENTATION_KEY, presentationMode ? '1' : '0');
  }, [presentationMode]);

  useEffect(() => {
    writeCookie(MUTE_KEY, muted ? '1' : '0');
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    continuousListenRef.current = continuousListen;
    writeCookie(CONTINUOUS_LISTEN_KEY, continuousListen ? '1' : '0');
  }, [continuousListen]);

  useEffect(() => {
    voiceAutoSendRef.current = voiceAutoSend;
    writeCookie(VOICE_AUTO_SEND_KEY, voiceAutoSend ? '1' : '0');
  }, [voiceAutoSend]);

  useEffect(() => {
    writeCookie(CLAP_WAKE_KEY, clapWake ? '1' : '0');
    clapDetectorRef.current?.setEnabled?.(clapWake);
  }, [clapWake]);

  useEffect(() => {
    streamingRef.current = streaming;
    if (streaming) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    }
  }, [streaming]);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  /** Full JARVIS page: always-on listen → reply → listen loop. */
  useEffect(() => {
    if (minimal || !open) return undefined;
    if (!isSpeechRecognitionSupported()) return undefined;

    setMuted((m) => (readCookie(MUTE_KEY) === '1' ? m : false));
    setVoiceAutoSend(true);
    setContinuousListen(true);
    continuousListenRef.current = true;
    voiceAutoSendRef.current = true;
    armMicSession(true);

    let cancelled = false;
    const armMic = async () => {
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;
      if (isMobileUserAgent() && !isSpeechAudioUnlocked()) return;
      await beginListeningRef.current?.();
    };
    armMic();

    const onGesture = () => {
      unlockSpeechAudio({ prime: isMobileUserAgent() });
      setAudioUnlocked(true);
      if (!recognizingRef.current && !streamingRef.current && !speakingRef.current) {
        beginListeningRef.current?.();
      }
    };
    if (isMobileUserAgent()) {
      document.addEventListener('pointerdown', onGesture, { passive: true });
    } else {
      document.addEventListener('pointerdown', onGesture, { once: true, passive: true });
    }

    const keepalive = setInterval(() => {
      if (
        continuousListenRef.current &&
        (voiceSessionArmedRef.current || micSessionActiveRef.current) &&
        !pendingTtsRef.current &&
        !recognizingRef.current &&
        !streamingRef.current &&
        !speakingRef.current &&
        !restartListeningTimerRef.current
      ) {
        scheduleRestartRef.current?.();
      }
    }, isMobileUserAgent() ? 4500 : 7000);

    return () => {
      cancelled = true;
      clearInterval(keepalive);
      armMicSession(false);
      if (isMobileUserAgent()) {
        document.removeEventListener('pointerdown', onGesture);
      }
    };
  }, [minimal, open, armMicSession]);

  /** After mobile audio unlock tap, start the mic loop. */
  useEffect(() => {
    if (minimal || !open || !audioUnlocked) return;
    if (!isMobileUserAgent()) return;
    setContinuousListen(true);
    continuousListenRef.current = true;
    voiceAutoSendRef.current = true;
    const t = setTimeout(() => {
      if (!recognizingRef.current && !streamingRef.current && !speakingRef.current) {
        beginListeningRef.current?.();
      }
    }, 300);
    return () => clearTimeout(t);
  }, [minimal, open, audioUnlocked]);

  /** Double-clap activates JARVIS when hands are busy (full-page HUD only). */
  useEffect(() => {
    if (minimal || !open || !clapWake) {
      clapDetectorRef.current?.stop?.();
      clapDetectorRef.current = null;
      return undefined;
    }

    let cancelled = false;

    (async () => {
      const { createClapDetector } = await import('@/lib/jarvis/clap-detect');
      if (cancelled) return;

      const detector = await createClapDetector({
        shouldListen: () =>
          !speakingRef.current && !pendingTtsRef.current && !streamingRef.current,
        onDoubleClap: () => {
          unlockSpeechAudio({ prime: false });
          setAudioUnlocked(true);
          setClapActivated(true);
          clearTimeout(clapFlashTimerRef.current);
          clapFlashTimerRef.current = setTimeout(() => setClapActivated(false), 2000);

          if (speakingRef.current) {
            stopSpeaking();
            speakingRef.current = false;
            setSpeaking(false);
            pendingTtsRef.current = false;
          }

          try {
            recognitionRef.current?.stop();
          } catch {
            // ignore
          }
          recognizingRef.current = false;
          setListening(false);

          window.setTimeout(() => {
            beginListeningRef.current?.({ interruptSpeech: true });
            if (!mutedRef.current) {
              speakJarvis('Yes, sir.', { muted: false });
            }
          }, 150);
        },
      });

      if (cancelled) {
        detector.stop();
        return;
      }
      clapDetectorRef.current = detector;
    })();

    return () => {
      cancelled = true;
      clearTimeout(clapFlashTimerRef.current);
      clapDetectorRef.current?.stop?.();
      clapDetectorRef.current = null;
    };
  }, [minimal, open, clapWake]);

  const armMicSession = useCallback((active) => {
    micSessionActiveRef.current = active;
    voiceSessionArmedRef.current = active;
    setMicSessionActive(active);
    if (!active && listeningClearTimerRef.current) {
      clearTimeout(listeningClearTimerRef.current);
      listeningClearTimerRef.current = null;
    }
    if (!active && restartListeningTimerRef.current) {
      clearTimeout(restartListeningTimerRef.current);
      restartListeningTimerRef.current = null;
    }
  }, []);

  const pauseListening = useCallback(() => {
    if (listeningClearTimerRef.current) {
      clearTimeout(listeningClearTimerRef.current);
      listeningClearTimerRef.current = null;
    }
    if (restartListeningTimerRef.current) {
      clearTimeout(restartListeningTimerRef.current);
      restartListeningTimerRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    recognizingRef.current = false;
    setListening(false);
  }, []);

  const beginListening = useCallback(async (opts = {}) => {
    const { interruptSpeech = false } = opts;
    if (!isSpeechRecognitionSupported()) return false;
    const rec = recognitionRef.current;
    if (!rec || recognizingRef.current) return false;
    if (streamingRef.current) return false;
    if (pendingTtsRef.current && !speakingRef.current) {
      pendingTtsRef.current = false;
    }
    if (speakingRef.current && !interruptSpeech) return false;
    if (isMobileUserAgent() && !isSpeechAudioUnlocked()) return false;

    if (interruptSpeech) {
      stopSpeaking();
      speakingRef.current = false;
      setSpeaking(false);
    }

    setVoiceError(null);
    const micOk = await ensureMicPermission();
    if (!micOk) {
      setVoiceError('Microphone access denied, sir. Allow mic permission for this site.');
      return false;
    }

    /* Keep HUD in listening while the session is armed, even before recognition starts. */
    if (voiceSessionArmedRef.current || micSessionActiveRef.current) {
      setListening(true);
    }

    try {
      /* Only abort a stale instance — never abort mid-session restart races on mobile. */
      if (isMobileUserAgent() && !recognizingRef.current) {
        try {
          rec.abort();
        } catch {
          // ignore
        }
        await new Promise((r) => setTimeout(r, isIOS() ? 120 : 60));
      }
      if (recognizingRef.current || streamingRef.current || speakingRef.current) return false;
      rec.start();
      return true;
    } catch {
      try {
        rec.abort?.();
      } catch {
        // ignore
      }
      try {
        rec.stop();
      } catch {
        // ignore
      }
      await new Promise((r) => setTimeout(r, isMobileUserAgent() ? 700 : 350));
      try {
        if (!recognizingRef.current && !streamingRef.current && !speakingRef.current) {
          rec.start();
          return true;
        }
      } catch {
        setVoiceError('Could not start voice input, sir. Try again in a moment.');
      }
    }
    return false;
  }, []);

  const scheduleRestartListening = useCallback(() => {
    if (!continuousListenRef.current) return;
    if (!voiceSessionArmedRef.current && !micSessionActiveRef.current) return;
    if (streamingRef.current || speakingRef.current) return;
    if (restartListeningTimerRef.current) {
      clearTimeout(restartListeningTimerRef.current);
      restartListeningTimerRef.current = null;
    }
    /* Debounce competing restarts from onEnd + onError + keepalive. */
    const delay = isIOS() ? 850 : isMobileUserAgent() ? 750 : 450;
    restartListeningTimerRef.current = setTimeout(async () => {
      restartListeningTimerRef.current = null;
      if (!continuousListenRef.current) return;
      if (!voiceSessionArmedRef.current && !micSessionActiveRef.current) return;
      if (streamingRef.current || speakingRef.current || recognizingRef.current) return;
      if (pendingTtsRef.current && !speakingRef.current) pendingTtsRef.current = false;
      if (isMobileUserAgent()) {
        await handoffSpeechToMic();
      }
      if (!continuousListenRef.current || streamingRef.current || speakingRef.current) return;
      if (recognizingRef.current) return;
      beginListeningRef.current?.();
    }, delay);
  }, []);

  useEffect(() => {
    beginListeningRef.current = beginListening;
    scheduleRestartRef.current = scheduleRestartListening;
  }, [beginListening, scheduleRestartListening]);

  useEffect(() => {
    if (minimal) return undefined;
    if (!isSpeechRecognitionSupported()) return undefined;

    const clearVoiceSendTimer = () => {
      if (voiceSendTimerRef.current) {
        clearTimeout(voiceSendTimerRef.current);
        voiceSendTimerRef.current = null;
      }
    };

    const scheduleVoiceAutoSend = (delayMs) => {
      if (!voiceAutoSendRef.current && !continuousListenRef.current) return;
      clearVoiceSendTimer();
      voiceSendTimerRef.current = setTimeout(() => {
        voiceSendTimerRef.current = null;
        const transcript = (transcriptRef.current || lastInterimRef.current || '').trim();
        if (!transcript) return;

        transcriptRef.current = '';
        lastInterimRef.current = '';
        setVoiceInterim('');
        skipOnEndSendRef.current = true;

        try {
          recognitionRef.current?.stop();
        } catch {
          skipOnEndSendRef.current = false;
          sendMessageRef.current?.(transcript);
          return;
        }

        sendMessageRef.current?.(transcript);
      }, delayMs);
    };

    const rec = createSpeechRecognition({
      continuous: speechRecognitionUsesContinuous(),
      onStart: () => {
        recognizingRef.current = true;
        setListening(true);
        setVoiceError(null);
        clearVoiceSendTimer();
        skipOnEndSendRef.current = false;
        transcriptRef.current = '';
        lastInterimRef.current = '';
        setVoiceInterim('');
      },
      onResult: (event) => {
        const { accumulated, display, interim, hadFinal } = processRecognitionResult(
          event,
          transcriptRef.current
        );
        transcriptRef.current = accumulated;
        if (interim) lastInterimRef.current = interim;
        else if (display) lastInterimRef.current = display;
        if (display) setVoiceInterim(display);

        if (hadFinal && accumulated.trim()) {
          prefetchOpenFromTranscript(accumulated, prefetchedOpenUrlRef);
        }

        // Continuous mode never fires onEnd per utterance — send after a pause in speech.
        // 1.5s after a final result on desktop; longer during interim to avoid cutting
        // off mid-thought when the speaker pauses between clauses.
        if (display && (voiceAutoSendRef.current || continuousListenRef.current)) {
          const pauseMs = hadFinal
            ? (isIOS() ? 900 : isMobileUserAgent() ? 1200 : 1500)
            : (isMobileUserAgent() ? 1400 : 1800);
          scheduleVoiceAutoSend(pauseMs);
        }
      },
      onError: (code) => {
        if (code === 'no-speech' && continuousListenRef.current) {
          scheduleRestartRef.current?.();
          return;
        }
        if (code === 'aborted') return;
        const msg = mapSpeechError(code);
        if (msg) setVoiceError(msg);
        if (continuousListenRef.current) {
          scheduleRestartRef.current?.();
        }
      },
      onEnd: () => {
        recognizingRef.current = false;
        clearVoiceSendTimer();

        if (listeningClearTimerRef.current) {
          clearTimeout(listeningClearTimerRef.current);
          listeningClearTimerRef.current = null;
        }

        /*
         * While the voice session is armed, NEVER drop listening UI to idle —
         * mobile browsers end recognition every few seconds. Keep the HUD
         * stable until stopListening / speak / stream clears the session.
         */
        const sessionArmed =
          (voiceSessionArmedRef.current || micSessionActiveRef.current) &&
          continuousListenRef.current &&
          !streamingRef.current &&
          !speakingRef.current;

        if (sessionArmed) {
          setListening(true);
        } else {
          setListening(false);
        }

        if (skipOnEndSendRef.current) {
          skipOnEndSendRef.current = false;
          transcriptRef.current = '';
          lastInterimRef.current = '';
          setVoiceInterim('');
          return;
        }

        const transcript = (
          transcriptRef.current ||
          lastInterimRef.current ||
          ''
        ).trim();
        transcriptRef.current = '';
        lastInterimRef.current = '';
        setVoiceInterim('');

        if (transcript) {
          const autoSend = voiceAutoSendRef.current || continuousListenRef.current;
          if (autoSend) {
            sendMessageRef.current?.(transcript);
          } else {
            onTranscriptRef.current?.(transcript);
          }
        }

        scheduleRestartRef.current?.();
      },
    });

    recognitionRef.current = rec;
    return () => {
      clearVoiceSendTimer();
      try {
        rec.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
      recognizingRef.current = false;
    };
  }, [minimal]);

  useEffect(() => {
    if (minimal) return;
    refreshData().then(async (d) => {
      if (!d) return;
      // Only greet once per browser session — skip on page-navigation refreshes.
      let alreadyGreeted = false;
      try { alreadyGreeted = !!sessionStorage.getItem('jarvis-greeted'); } catch { /* ignore */ }
      if (alreadyGreeted) {
        setBootTyped(true);
        return;
      }
      let line = `JARVIS online. ${d.leadsToday ?? 0} leads today, ${d.tasksQueued ?? 0} tasks queued.`;
      try {
        const lr = await fetch('/api/jarvis/llm-status', { credentials: 'include', cache: 'no-store' });
        if (lr.ok) {
          const ls = await lr.json();
          if (!ls.ready) {
            const hint =
              ls.hint ||
              'Add OPENROUTER_API_KEY or GEMINI_API_KEY in Vercel, then redeploy.';
            line += ` Chat offline — ${hint}`;
            toastApi?.pushToast?.(`JARVIS chat needs an LLM key. ${hint}`);
          }
        }
      } catch {
        // snapshot still usable; chat status unknown
      }
      setBootLine(line);
      try { sessionStorage.setItem('jarvis-greeted', '1'); } catch { /* ignore */ }
      if (!bootPlayedRef.current && readCookie(PRESENTATION_KEY) === '1' && readCookie(MUTE_KEY) === '0') {
        playBootChime(false);
        bootPlayedRef.current = true;
      }
      setTimeout(() => setBootTyped(true), 1200);
    });
  }, [refreshData, minimal, toastApi]);

  useEffect(() => {
    if (minimal) return undefined;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, toggle, close]);

  useEffect(() => {
    if (minimal) return undefined;
    const interval = setInterval(async () => {
      const res = await fetch('/api/empire/activity/list?limit=5', { credentials: 'include', cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const events = data.events || [];
      if (!events.length) return;
      const newest = events[0]?.created_at;
      if (!lastActivityTs) {
        setLastActivityTs(newest);
        return;
      }
      const fresh = events.filter((e) => e.created_at > lastActivityTs);
      if (fresh.length) {
        setLastActivityTs(fresh[0].created_at);
        const line = fresh.map((e) => `${e.event_type} on ${e.project_id} (${e.status})`).join('; ');
        const msg = `Activity update, sir: ${line}`;
        if (open) {
          setMessages((prev) => [
            ...prev,
            { id: `sys-${Date.now()}`, role: 'assistant', content: msg, system: true },
          ]);
        } else {
          toastApi?.pushToast?.(msg);
        }
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [open, lastActivityTs, toastApi, minimal]);

  useEffect(() => {
    if (minimal) return undefined;
    const interval = setInterval(async () => {
      const res = await fetch('/api/fleet/list?limit=5', { credentials: 'include', cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const events = data.events || [];
      if (!events.length) return;
      const newest = events[0]?.created_at;
      if (!lastFleetEventTs) {
        setLastFleetEventTs(newest);
        return;
      }
      const fresh = events.filter((e) => e.created_at > lastFleetEventTs);
      if (fresh.length) {
        setLastFleetEventTs(fresh[0].created_at);
        const e = fresh[0];
        const msg = `New ${e.event_type} on ${e.project}, sir.`;
        toastApi?.pushToast?.(msg);
        refreshDataRef.current?.();
        if (!mutedRef.current) {
          speakReplyRef.current?.(msg, { speakFull: true });
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [lastFleetEventTs, toastApi, minimal]);

  const scrollToBottom = useCallback(() => {
    if (!userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming, scrollToBottom]);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
    stopSpeaking();
    speakingRef.current = false;
    setSpeaking(false);
    pendingTtsRef.current = false;
    flushMessageQueueRef.current?.();
  }, []);

  const stopSpeakingReply = useCallback(async () => {
    stopSpeaking();
    speakingRef.current = false;
    setSpeaking(false);
    pendingTtsRef.current = false;
    if (isMobileUserAgent()) {
      await handoffSpeechToMic();
    }
    scheduleRestartRef.current?.();
    flushMessageQueueRef.current?.();
  }, []);

  const appendAssistant = useCallback((content, extras = {}) => {
    const id = `a-${Date.now()}`;
    setMessages((prev) => [...prev, { id, role: 'assistant', content, ...extras }]);
    return id;
  }, []);

  const beginActivity = useCallback((mode) => {
    if (busyActivityTimerRef.current) {
      clearTimeout(busyActivityTimerRef.current);
      busyActivityTimerRef.current = null;
    }
    setBusyActivity(mode);
  }, []);

  const endActivity = useCallback((delayMs = 0) => {
    if (busyActivityTimerRef.current) {
      clearTimeout(busyActivityTimerRef.current);
      busyActivityTimerRef.current = null;
    }
    if (delayMs > 0) {
      busyActivityTimerRef.current = setTimeout(() => {
        busyActivityTimerRef.current = null;
        setBusyActivity(null);
      }, delayMs);
    } else {
      setBusyActivity(null);
    }
  }, []);

  const flushMessageQueue = useCallback(() => {
    if (streamingRef.current || speakingRef.current) return;
    if (pendingTtsRef.current) pendingTtsRef.current = false;
    const next = messageQueueRef.current.shift();
    if (next) {
      setTimeout(() => processUserMessageRef.current?.(next, { addUserBubble: false }), 80);
    }
  }, []);

  useEffect(() => {
    flushMessageQueueRef.current = flushMessageQueue;
  }, [flushMessageQueue]);

  const processUserMessageRef = useRef(null);

  const speakReply = useCallback(
    async (text, { writingTask = false, speakFull = false, fromGesture = false } = {}) => {
      const finish = () => {
        scheduleRestartRef.current?.();
        flushMessageQueueRef.current?.();
      };
      if (!text?.trim()) {
        finish();
        return false;
      }
      if (muted) {
        finish();
        return false;
      }

      const plain = stripJarvisMarkdown(text);
      setLastReplyText(plain);
      const spoken = summarizeForSpeech(plain, { writingTask, speakFull });
      lastSpeechTextRef.current = spoken;

      const mobile = isMobileUserAgent();
      const shortAck = spoken.length <= 100;

      // iOS/Android block auto-TTS after async LLM — prompt tap unless short ack or desktop.
      if (mobile && !fromGesture && !shortAck) {
        pendingTtsRef.current = false;
        setVoiceNeedsTap(true);
        finish();
        return false;
      }

      pendingTtsRef.current = true;
      pauseListening();
      stopSpeaking();
      unlockSpeechAudio({ prime: fromGesture || mobile });
      primeMobileAudioSession();
      prepareSpeechOutput();
      setAudioUnlocked(true);
      setVoiceNeedsTap(false);

      if (!fromGesture && !mobile) {
        await new Promise((r) => setTimeout(r, 200));
      }

      let started = false;
      try {
        const safety = setTimeout(() => {
          if (pendingTtsRef.current || speakingRef.current) {
            pendingTtsRef.current = false;
            speakingRef.current = false;
            setSpeaking(false);
            if (mobile) setVoiceNeedsTap(true);
            finish();
          }
        }, mobile ? 15000 : 45000);

        const onStart = () => {
          started = true;
          pendingTtsRef.current = false;
          speakingRef.current = true;
          setSpeaking(true);
          setVoiceNeedsTap(false);
        };
        const onEnd = () => {
          clearTimeout(safety);
          speakingRef.current = false;
          setSpeaking(false);
          pendingTtsRef.current = false;
          if (mobile && !started) setVoiceNeedsTap(true);
          finish();
        };

        primeMobileAudioSession();
        if (fromGesture || mobile) {
          started = await speakJarvisFromGesture(spoken, { muted: false, onStart, onEnd });
        } else {
          started = await speakJarvis(spoken, { muted: false, onStart, onEnd });
        }

        if (pendingTtsRef.current) {
          clearTimeout(safety);
          pendingTtsRef.current = false;
          if (mobile && !started) setVoiceNeedsTap(true);
          finish();
        }
        return started;
      } catch {
        pendingTtsRef.current = false;
        if (mobile) setVoiceNeedsTap(true);
        finish();
        return false;
      }
    },
    [muted, pauseListening]
  );

  useEffect(() => {
    speakReplyRef.current = speakReply;
  }, [speakReply]);

  useEffect(() => {
    if (minimal) return undefined;

    let supabase;
    try {
      supabase = getSupabaseBrowser();
    } catch {
      return undefined;
    }

    const LEAD_MESSAGE = 'New lead, sir.';
    const notifyNewLead = () => {
      toastApi?.pushToast?.(LEAD_MESSAGE);
      refreshDataRef.current?.();
      if (!mutedRef.current) {
        speakReplyRef.current?.(LEAD_MESSAGE, { speakFull: true });
      }
    };

    const notifyFleetEvent = (payload) => {
      const row = payload?.new;
      if (!row) return;
      const eventType = row.event_type || 'event';
      const project = row.project || 'unknown';
      const message = `New ${eventType} on ${project}, sir.`;
      toastApi?.pushToast?.(message);
      refreshDataRef.current?.();
      if (!mutedRef.current) {
        speakReplyRef.current?.(message, { speakFull: true });
      }
    };

    const channel = supabase
      .channel('jarvis-new-leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'form_submissions' },
        notifyNewLead
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'onboarding_clients' },
        notifyNewLead
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'fleet_events' },
        notifyFleetEvent
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [minimal, toastApi]);

  const replyAssistant = useCallback(
    (content, extras = {}) => {
      const text = String(content || '').trim();
      if (!text) return null;
      const id = appendAssistant(text, extras);
      speakReply(text);
      return id;
    },
    [appendAssistant, speakReply]
  );

  const openBrowseUrl = useCallback(
    (url, label) => {
      beginActivity('opening');
      const name = label || url;
      lastBrowseRef.current = { url, label: name };
      let opened = false;
      if (prefetchedOpenUrlRef.current === url) {
        prefetchedOpenUrlRef.current = null;
        opened = true;
      } else {
        opened = navigateExternalUrl(url);
      }
      const msg = opened
        ? `Opening ${name} in a new tab, sir.`
        : `Could not open a new tab for ${name}, sir — allow popups for this site or use the link below.`;
      replyAssistant(msg, opened ? { cards: [{ type: 'link', url, label: `Open ${name}` }] } : { cards: [{ type: 'link', url, label: `Open ${name}` }] });
      endActivity(2500);
      scheduleRestartRef.current?.();
    },
    [replyAssistant, beginActivity, endActivity]
  );

  const streamLLM = useCallback(
    async (history, assistantId, { writingTask = false } = {}) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setStreaming(true);

      const lastContent = history[history.length - 1]?.content || '';

      try {
        const res = await fetch('/api/jarvis/chat', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history,
            webSearch: writingTask ? false : messageNeedsWebSearch(lastContent),
            writingTask: writingTask || undefined,
          }),
          signal: controller.signal,
        });

        if (res.status === 401) {
          window.location.href = '/login?callbackUrl=/dashboard/jarvis';
          return '';
        }

        if (res.status === 403) {
          const denied = 'Access denied, sir. Admin session required — try logging in again.';
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: denied } : m))
          );
          return denied;
        }

        if (!res.ok) {
          let msg = 'Systems are momentarily offline, sir. Retrying shortly.';
          try {
            const errData = await res.json();
            if (errData?.error) {
              msg = `Configuration issue, sir. ${errData.error}`;
            }
          } catch {
            // not JSON
          }
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: msg } : m))
          );
          return msg;
        }

        if (!res.body) {
          const offline = 'Systems are momentarily offline, sir. Retrying shortly.';
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: offline } : m))
          );
          return offline;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let full = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split('\n\n');
          buffer = chunks.pop() || '';
          for (const chunk of chunks) {
            const line = chunk.trim();
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') continue;
            try {
              const { token } = JSON.parse(data);
              if (token) {
                full += token;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + token } : m))
                );
              }
            } catch {
              // ignore
            }
          }
        }
        if (!full.trim()) {
          const empty =
            'No reply received, sir. Set OPENROUTER_API_KEY or GEMINI_API_KEY in Vercel, redeploy, then try again. Instant commands: help, status, leads today.';
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: empty } : m))
          );
          return empty;
        }
        return full;
      } catch (err) {
        if (err.name !== 'AbortError') {
          const offline = err?.message
            ? `Connection error, sir. ${String(err.message).slice(0, 160)}`
            : 'Systems are momentarily offline, sir. Retrying shortly.';
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: offline } : m))
          );
          return offline;
        }
        return '';
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    []
  );

  const executeAction = useCallback(
    async (action) => {
      setPendingAction(null);
      const confirmId = appendAssistant('On it, sir.', { pending: true });

      try {
        if (action.command === 'open') {
          openBrowseUrl(
            `${typeof window !== 'undefined' ? window.location.origin : ''}${action.route}`,
            action.tab
          );
          setMessages((prev) => prev.filter((m) => m.id !== confirmId));
          return;
        }

        if (action.command === 'browse') {
          openBrowseUrl(action.url, action.label || action.url);
          setMessages((prev) => prev.filter((m) => m.id !== confirmId));
          return;
        }

        if (action.command === 'run') {
          const teamRes = await fetch('/api/empire/supervisor/run-team', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectId: action.project,
              teamId: 'JARVIS_SINGLE',
              skills: [action.skill],
              taskDescription: `JARVIS: run ${action.skill} for ${action.project}`,
            }),
          });
          const teamData = await teamRes.json();
          if (!teamRes.ok) throw new Error(teamData.error || 'Run failed');
          const taskId = teamData.taskIds?.[0];
          if (taskId) {
            const runRes = await fetch('/api/empire/run-task', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ taskId }),
            });
            const runData = await runRes.json();
            if (!runRes.ok && runData.error) {
              throw new Error(runData.error);
            }
          }
          let msg = `Task queued${taskId ? ` (#${String(taskId).slice(0, 8)})` : ''} for ${action.skill} on ${action.project}, sir.`;
          setMessages((prev) => prev.map((m) => (m.id === confirmId ? { ...m, content: msg, pending: false } : m)));
          if (taskId) {
            const outcome = await pollTaskOutcome(taskId);
            if (outcome) {
              const label = `${action.skill} on ${action.project}`;
              const statusWord = /^(complete|completed|done)$/i.test(outcome.status) ? 'complete' : outcome.status;
              msg = `${label} ${statusWord}, sir.${outcome.result_message ? ` ${outcome.result_message.slice(0, 160)}` : ''}`;
              appendAssistant(msg);
              speakReply(msg);
              toastApi?.pushToast?.(msg);
            }
          }
          speakReply(msg);
          return;
        }

        if (action.command === 'report') {
          const project = (liveData?.projects || []).find((p) => p.client_id === action.client.id);
          if (!project) {
            const msg = 'No project on file for that client, sir.';
            setMessages((prev) => prev.map((m) => (m.id === confirmId ? { ...m, content: msg, pending: false } : m)));
            speakReply(msg);
            return;
          }
          const res = await fetch('/api/admin/reports/generate', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client_id: action.client.id, project_id: project.id }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Report failed');
          const msg = `Report generated for ${action.client.full_name || action.client.company}, sir. View in Clients.`;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === confirmId
                ? {
                    ...m,
                    content: msg,
                    pending: false,
                    cards: [{ type: 'report', projectId: project.id, message: 'Report ready' }],
                  }
                : m
            )
          );
          speakReply(msg);
          return;
        }

        if (action.command === 'pause' || action.command === 'resume') {
          const res = await fetch('/api/empire/agent-control', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent_id: action.agent, action: action.command }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Agent control failed');
          const msg = `Agent ${action.agent} ${action.command === 'pause' ? 'paused' : 'resumed'}, sir.`;
          setMessages((prev) => prev.map((m) => (m.id === confirmId ? { ...m, content: msg, pending: false } : m)));
          speakReply(msg);
        }
      } catch (err) {
        const msg = `That action could not complete, sir. ${err.message || 'Please try from the dashboard.'}`;
        setMessages((prev) => prev.map((m) => (m.id === confirmId ? { ...m, content: msg, pending: false } : m)));
        speakReply(msg);
      }
    },
    [appendAssistant, liveData, router, speakReply, beginActivity, endActivity, openBrowseUrl]
  );

  const cancelAction = useCallback(() => {
    setPendingAction(null);
    setMessages((prev) => prev.map((m) => (m.confirm ? { ...m, confirm: null } : m)));
    replyAssistant('Action cancelled. No changes made, sir.');
  }, [replyAssistant]);

  const appendSystemNote = useCallback((content) => {
    setMessages((prev) => [
      ...prev,
      { id: `sys-${Date.now()}`, role: 'assistant', content, system: true },
    ]);
  }, []);

  const runWebSearch = useCallback(
    async (query) => {
      beginActivity('searching');
      const pendingId = appendAssistant(`Searching the web for "${query}", sir…`, { pending: true });
      speakReply(`Searching the web for ${query}, sir.`);
      try {
        const res = await fetch('/api/jarvis/search', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Search failed');
        lastSearchQueryRef.current = data.query || query;
        let summary = data.summary || '';
        if ((!summary?.trim() || /\bcould not find results\b/i.test(summary)) && isRealSearchResultSet(data.results)) {
          summary = summarizeSearchResults(data.query || query, data.results || []);
        }
        if (!summary?.trim()) {
          summary = data.summary || `Search complete for "${query}", sir. See links in comms.`;
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? {
                  ...m,
                  content: summary,
                  pending: false,
                  cards: [{ type: 'search', query: data.query || query, results: data.results || [] }],
                }
              : m
          )
        );
        speakReply(summary);
      } catch (err) {
        const msg = `Web search failed, sir. ${err.message || 'Try again.'}`;
        setMessages((prev) =>
          prev.map((m) => (m.id === pendingId ? { ...m, content: msg, pending: false } : m))
        );
        speakReply(msg);
      } finally {
        endActivity();
      }
    },
    [appendAssistant, speakReply, beginActivity, endActivity]
  );

  const runImageGen = useCallback(
    async (prompt) => {
      beginActivity('drawing');
      const pendingId = appendAssistant(`Generating image: ${prompt}, sir…`, { pending: true });
      speakReply('Generating image, sir.');
      try {
        const res = await fetch('/api/jarvis/image', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Image generation failed');
        const msg = 'Image ready, sir.';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? {
                  ...m,
                  content: msg,
                  pending: false,
                  cards: [{ type: 'image', dataUrl: data.dataUrl, prompt: data.prompt || prompt }],
                }
              : m
          )
        );
        speakReply(msg);
      } catch (err) {
        const msg = `Could not generate that image, sir. ${err.message || ''}`.trim();
        setMessages((prev) =>
          prev.map((m) => (m.id === pendingId ? { ...m, content: msg, pending: false } : m))
        );
        speakReply(msg);
      } finally {
        endActivity();
      }
    },
    [appendAssistant, speakReply, beginActivity, endActivity]
  );

  const processUserMessage = useCallback(
    async (trimmed, { addUserBubble = true } = {}) => {
      try {
        if (!trimmed) return;
        pauseListening();

        const userMsg = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
        if (addUserBubble) {
          setMessages((prev) => [...prev, userMsg]);
          userScrolledUpRef.current = false;
        }

        const parsedQuick = parseJarvisCommand(trimmed, liveData?.clients || []);

        if (
          /\b(?:have you opened|did you open|where(?:'s|\s+is)|can't see|cannot see|don't see|do not see|i can't see|not see it)\b/i.test(
            trimmed
          )
        ) {
          const yt = /\b(?:youtube|yt)\b/i.test(trimmed);
          const target = yt
            ? { url: 'https://www.youtube.com', label: 'YouTube' }
            : lastBrowseRef.current;
          if (target?.url) {
            openBrowseUrl(target.url, target.label || 'link');
            return;
          }
          replyAssistant('Nothing is open yet, sir. Say "open YouTube" and I will open it.');
          return;
        }

        if (parsedQuick?.type === 'action' && parsedQuick.command === 'browse') {
          openBrowseUrl(parsedQuick.url, parsedQuick.label || parsedQuick.url);
          return;
        }

        if (parsedQuick?.type === 'action' && parsedQuick.command === 'image') {
          await runImageGen(parsedQuick.prompt);
          return;
        }

        if (parsedQuick?.type === 'action' && parsedQuick.command === 'open') {
          const abs =
            typeof window !== 'undefined'
              ? `${window.location.origin}${parsedQuick.route}`
              : parsedQuick.route;
          openBrowseUrl(abs, parsedQuick.tab);
          return;
        }

        let data = normalizeJarvisContext(liveData || (await refreshData()));
        const clients = data?.clients || [];
        const parsed = parseJarvisCommand(trimmed, clients);

        if (parsed?.type === 'read' && parsed.command === 'leads' && parsed.days > 1) {
          try {
            const lr = await fetch(`/api/jarvis/leads?days=${parsed.days}`, {
              credentials: 'include',
              cache: 'no-store',
            });
            if (lr.ok) {
              const ld = await lr.json();
              data = {
                ...data,
                leadsHistory: { ...(data?.leadsHistory || {}), [parsed.days]: ld.count },
              };
            }
          } catch {
            // fall through — composeLeads will report unavailable range
          }
        }

        if (parsed?.type === 'read' && parsed.command === 'fleet-events') {
          try {
            const fr = await fetch('/api/fleet/list?limit=20', {
              credentials: 'include',
              cache: 'no-store',
            });
            if (fr.ok) {
              const fd = await fr.json();
              data = { ...data, fleetEvents: fd.events || [] };
            }
          } catch {
            // fall through — composeFleetEvents will report none
          }
        }

        if (parsed?.type === 'read') {
          if (parsed.command === 'search-retry' && lastSearchQueryRef.current) {
            await runWebSearch(lastSearchQueryRef.current);
            return;
          }
          if (parsed.command === 'search') {
            await runWebSearch(parsed.query);
            return;
          }
          const reply = composeReadResponse(parsed, data || {});
          if (reply?.content) {
            replyAssistant(reply.content, { cards: reply.cards });
            return;
          }
        }

        if (parsed?.type === 'action' && parsed.command === 'image') {
          await runImageGen(parsed.prompt);
          return;
        }

        if (parsed?.type === 'action' && parsed.needsConfirm) {
          setPendingAction(parsed);
          replyAssistant(`${parsed.summary}\n\nConfirm execution below, sir.`, {
            confirm: parsed,
          });
          return;
        }

        if (parsed?.type === 'action' && !parsed.needsConfirm) {
          await executeAction(parsed);
          return;
        }

        if (
          !parsed &&
          !isWritingRequest(trimmed) &&
          (hasExplicitSearchIntent(trimmed) || messageNeedsWebSearch(trimmed))
        ) {
          const autoQuery = buildWebSearchQuery(trimmed);
          if (autoQuery.length > 2) {
            await runWebSearch(autoQuery);
            return;
          }
        }

        const writingTask = isWritingRequest(trimmed);

        const assistantId = `a-${Date.now()}`;
        setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
        const history = [...messages, userMsg]
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .filter((m) => typeof m.content === 'string' && m.content.trim())
          .map((m) => ({ role: m.role, content: m.content }));
        const full = await streamLLM(history, assistantId, { writingTask });
        if (full?.trim()) {
          await speakReply(full, { writingTask });
        } else if (!full) {
          flushMessageQueueRef.current?.();
        } else {
          const fallback = 'I did not get a clear reply for that, sir. Please try again.';
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: fallback } : m))
          );
          await speakReply(fallback);
        }
      } catch (err) {
        console.error('[jarvis] processUserMessage', err);
        replyAssistant(
          `Something went wrong, sir. ${err?.message || 'Try help, status, or briefing for instant commands.'}`
        );
      }
    },
    [
      liveData,
      refreshData,
      messages,
      replyAssistant,
      speakReply,
      streamLLM,
      executeAction,
      pauseListening,
      openBrowseUrl,
      runWebSearch,
      runImageGen,
      beginActivity,
      endActivity,
    ]
  );

  useEffect(() => {
    processUserMessageRef.current = processUserMessage;
  }, [processUserMessage]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      prefetchOpenFromTranscript(trimmed, prefetchedOpenUrlRef);
      if (streamingRef.current || speakingRef.current) {
        setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content: trimmed }]);
        userScrolledUpRef.current = false;
        messageQueueRef.current.push(trimmed);
        const isFirstQueued = messageQueueRef.current.length === 1;
        if (isFirstQueued) {
          appendAssistant('One moment, sir — I will answer that next.');
          if (!speakingRef.current && !pendingTtsRef.current) {
            speakReply('One moment, sir — I will answer that next.');
          }
        }
        return;
      }
      await processUserMessage(trimmed);
    },
    [processUserMessage, appendAssistant, speakReply]
  );

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  const openWithQuery = useCallback(
    (query) => {
      setOpen(true);
      if (query?.trim()) {
        pendingQueryRef.current = query.trim();
      }
    },
    []
  );

  useEffect(() => {
    if (open && pendingQueryRef.current && !streaming) {
      const q = pendingQueryRef.current;
      pendingQueryRef.current = null;
      sendMessage(q);
    }
  }, [open, streaming, sendMessage]);

  const startListening = useCallback(async (onTranscript) => {
    unlockSpeechAudio({ prime: isMobileUserAgent() });
    prepareSpeechOutput();
    setAudioUnlocked(true);
    onTranscriptRef.current = onTranscript;
    if (recognizingRef.current) {
      pauseListening();
      setContinuousListen(false);
      armMicSession(false);
      return;
    }
    setContinuousListen(true);
    armMicSession(true);
    if (speakingRef.current) {
      stopSpeaking();
      speakingRef.current = false;
      setSpeaking(false);
      pendingTtsRef.current = false;
      if (isMobileUserAgent()) {
        await handoffSpeechToMic();
      }
    }
    await beginListening({ interruptSpeech: true });
  }, [beginListening, pauseListening, armMicSession]);

  const stopListening = useCallback(() => {
    setContinuousListen(false);
    armMicSession(false);
    pauseListening();
  }, [pauseListening, armMicSession]);

  const enableContinuousListen = useCallback(async () => {
    unlockSpeechAudio({ prime: isMobileUserAgent() });
    prepareSpeechOutput();
    setAudioUnlocked(true);
    setContinuousListen(true);
    armMicSession(true);
    setVoiceAutoSend(true);
    const ok = await beginListening({ interruptSpeech: true });
    if (!ok) {
      setContinuousListen(false);
      armMicSession(false);
    }
    return ok;
  }, [beginListening, armMicSession]);

  const unlockAndPrimeAudio = useCallback(async () => {
    unlockSpeechAudio({ prime: true });
    primeMobileAudioSession();
    setAudioUnlocked(true);
    setContinuousListen(true);
    continuousListenRef.current = true;
    voiceAutoSendRef.current = true;
    await new Promise((r) => setTimeout(r, 200));
    await beginListeningRef.current?.({ interruptSpeech: true });
  }, []);

  const clearComms = useCallback(() => {
    setMessages([]);
    setPendingAction(null);
    clearJarvisSessionMessages();
  }, []);

  const hearLastReply = useCallback(() => {
    const text = lastSpeechTextRef.current || lastReplyText;
    if (!text?.trim() || muted) return;
    unlockSpeechAudio({ prime: true });
    primeMobileAudioSession();
    setAudioUnlocked(true);
    setVoiceNeedsTap(false);
    speakReply(text, { fromGesture: true, speakFull: false });
  }, [lastReplyText, muted, speakReply]);

  const replayLastReply = useCallback(() => {
    hearLastReply();
  }, [hearLastReply]);

  const voiceUiActive =
    (micSessionActive || voiceSessionArmedRef.current) &&
    continuousListen &&
    !speaking &&
    !streaming &&
    !busyActivity &&
    !clapActivated;

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      close,
      messages,
      streaming,
      sendMessage,
      clearComms,
      stopGeneration,
      stopSpeakingReply,
      bootLine,
      bootTyped,
      messagesEndRef,
      userScrolledUpRef,
      pendingAction,
      executeAction,
      cancelAction,
      speaking,
      listening,
      micSessionActive,
      voiceUiActive,
      /** Session armed + mic open — use for live-dot when transcript is flowing. */
      voiceCapturing: Boolean(listening && voiceInterim),
      busyActivity,
      activity:
        busyActivity ||
        (clapActivated
          ? 'clap'
          : speaking
            ? 'speaking'
            : streaming
              ? 'thinking'
              : voiceUiActive || listening || micSessionActive
                ? 'listening'
                : 'idle'),
      clapWake,
      setClapWake,
      clapActivated,
      startListening,
      speechSupported: isSpeechRecognitionSupported(),
      voicePlatformHint: getVoicePlatformHint(),
      isMobileVoice: isMobileUserAgent(),
      muted,
      setMuted,
      presentationMode,
      setPresentationMode,
      voiceAutoSend,
      setVoiceAutoSend,
      continuousListen,
      setContinuousListen,
      enableContinuousListen,
      voiceInterim,
      voiceError,
      stopListening,
      openWithQuery,
      liveData,
      refreshData,
      audioUnlocked: audioUnlocked || isSpeechAudioUnlocked(),
      unlockAndPrimeAudio,
      lastReplyText,
      voiceNeedsTap,
      hearLastReply,
      replayLastReply,
    }),
    [
      open,
      toggle,
      close,
      messages,
      streaming,
      sendMessage,
      clearComms,
      stopGeneration,
      stopSpeakingReply,
      bootLine,
      bootTyped,
      pendingAction,
      executeAction,
      cancelAction,
      speaking,
      listening,
      micSessionActive,
      voiceUiActive,
      busyActivity,
      clapWake,
      clapActivated,
      startListening,
      muted,
      presentationMode,
      voiceAutoSend,
      continuousListen,
      enableContinuousListen,
      voiceInterim,
      voiceError,
      stopListening,
      openWithQuery,
      liveData,
      refreshData,
      audioUnlocked,
      unlockAndPrimeAudio,
      lastReplyText,
      voiceNeedsTap,
      hearLastReply,
      replayLastReply,
    ]
  );

  return <JarvisContext.Provider value={value}>{children}</JarvisContext.Provider>;
}
