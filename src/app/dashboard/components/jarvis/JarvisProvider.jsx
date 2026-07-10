'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseJarvisCommand } from '@/lib/jarvis/commands';
import { composeReadResponse, normalizeJarvisContext } from '@/lib/jarvis/templates';
import {
  speakJarvis,
  stopSpeaking,
  playBootChime,
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  pickBritishVoice,
  mapSpeechError,
  ensureMicPermission,
  processRecognitionResult,
  isMobileUserAgent,
  speechRecognitionUsesContinuous,
  getVoicePlatformHint,
  unlockSpeechAudio,
  isSpeechAudioUnlocked,
} from '@/lib/jarvis/voice';
import { stripJarvisMarkdown } from '@/app/dashboard/components/jarvis/JarvisMessageContent';
import { messageNeedsWebSearch, extractSearchQueryFromTranscript, normalizeSearchQuery, summarizeSearchResults } from '@/lib/jarvis/web-search';

const JarvisContext = createContext(null);
const PRESENTATION_KEY = 'jarvis-presentation';
const MUTE_KEY = 'jarvis-mute';
const VOICE_AUTO_SEND_KEY = 'jarvis-voice-auto-send';
const CONTINUOUS_LISTEN_KEY = 'jarvis-continuous-listen';

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
  const [liveData, setLiveData] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [muted, setMuted] = useState(false);
  const [voiceAutoSend, setVoiceAutoSend] = useState(true);
  const [continuousListen, setContinuousListen] = useState(true);
  const [voiceInterim, setVoiceInterim] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const [lastActivityTs, setLastActivityTs] = useState(null);
  const [lastReplyText, setLastReplyText] = useState('');
  const [audioUnlocked, setAudioUnlocked] = useState(false);

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
    setPresentationMode(readCookie(PRESENTATION_KEY) === '1');
    if (readCookie(MUTE_KEY) === '1') setMuted(true);
    if (readCookie(VOICE_AUTO_SEND_KEY) === '0') setVoiceAutoSend(false);
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

    let cancelled = false;
    const armMic = async () => {
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;
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
        !pendingTtsRef.current &&
        !recognizingRef.current &&
        !streamingRef.current &&
        !speakingRef.current
      ) {
        beginListeningRef.current?.();
      }
    }, 6000);

    return () => {
      cancelled = true;
      clearInterval(keepalive);
      if (isMobileUserAgent()) {
        document.removeEventListener('pointerdown', onGesture);
      }
    };
  }, [minimal, open]);

  const pauseListening = useCallback(() => {
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
    if (speakingRef.current && !interruptSpeech) return false;

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

    try {
      if (isMobileUserAgent()) {
        try {
          rec.abort();
        } catch {
          // ignore
        }
        await new Promise((r) => setTimeout(r, 80));
      }
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
      await new Promise((r) => setTimeout(r, isMobileUserAgent() ? 650 : 350));
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
    if (pendingTtsRef.current || streamingRef.current || speakingRef.current) return;
    const delay = isMobileUserAgent() ? 900 : 500;
    setTimeout(() => {
      if (!continuousListenRef.current) return;
      if (streamingRef.current || speakingRef.current || recognizingRef.current) return;
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
        if (!transcript || streamingRef.current || speakingRef.current) return;

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

        // Continuous mode never fires onEnd per utterance — send after a pause in speech.
        if (display && (voiceAutoSendRef.current || continuousListenRef.current)) {
          scheduleVoiceAutoSend(hadFinal ? 550 : 1100);
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
        setListening(false);
        clearVoiceSendTimer();

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

        if (transcript && !streamingRef.current && !speakingRef.current) {
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
    refreshData().then((d) => {
      if (d) {
        setBootLine(`JARVIS online. ${d.leadsToday ?? 0} leads today, ${d.tasksQueued ?? 0} tasks queued.`);
        if (!bootPlayedRef.current && readCookie(PRESENTATION_KEY) === '1' && readCookie(MUTE_KEY) === '0') {
          playBootChime(false);
          bootPlayedRef.current = true;
        }
        setTimeout(() => setBootTyped(true), 1200);
      }
    });
  }, [refreshData, minimal]);

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
    setSpeaking(false);
  }, []);

  const appendAssistant = useCallback((content, extras = {}) => {
    const id = `a-${Date.now()}`;
    setMessages((prev) => [...prev, { id, role: 'assistant', content, ...extras }]);
    return id;
  }, []);

  const speakReply = useCallback(
    async (text) => {
      const finish = () => scheduleRestartRef.current?.();
      if (!text?.trim()) {
        finish();
        return;
      }
      if (muted) {
        finish();
        return;
      }

      pendingTtsRef.current = true;
      pauseListening();
      stopSpeaking();

      const plain = stripJarvisMarkdown(text);
      setLastReplyText(plain);

      const gap = isMobileUserAgent() ? 280 : 200;
      await new Promise((r) => setTimeout(r, gap));

      try {
        const safety = setTimeout(() => {
          if (pendingTtsRef.current) {
            pendingTtsRef.current = false;
            speakingRef.current = false;
            setSpeaking(false);
            finish();
          }
        }, 45000);

        await speakJarvis(plain, {
          muted: false,
          onStart: () => {
            pendingTtsRef.current = false;
            speakingRef.current = true;
            setSpeaking(true);
          },
          onEnd: () => {
            clearTimeout(safety);
            speakingRef.current = false;
            setSpeaking(false);
            pendingTtsRef.current = false;
            finish();
          },
        });
      } catch {
        pendingTtsRef.current = false;
        finish();
      }
    },
    [muted, pauseListening]
  );

  const streamLLM = useCallback(
    async (history, assistantId) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setStreaming(true);

      try {
        const res = await fetch('/api/jarvis/chat', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history,
            webSearch: messageNeedsWebSearch(history[history.length - 1]?.content),
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
          const empty = 'No reply received, sir. Verify OPENROUTER_API_KEY in Vercel or try help / status.';
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
      const confirmId = appendAssistant('Executing…', { pending: true });

      try {
        if (action.command === 'open') {
          router.push(action.route);
          const msg = `Opening ${action.tab} tab, sir.`;
          setMessages((prev) => prev.map((m) => (m.id === confirmId ? { ...m, content: msg, pending: false } : m)));
          speakReply(msg);
          return;
        }

        if (action.command === 'browse') {
          window.open(action.url, '_blank', 'noopener,noreferrer');
          const msg = `Opening ${action.label || action.url}, sir.`;
          setMessages((prev) => prev.map((m) => (m.id === confirmId ? { ...m, content: msg, pending: false } : m)));
          speakReply(msg);
          scheduleRestartRef.current?.();
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
              msg = `Task ${outcome.status}: ${(outcome.result_message || outcome.task_description || '').slice(0, 200)}`;
              appendAssistant(msg);
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
      }
    },
    [appendAssistant, liveData, router, speakReply]
  );

  const cancelAction = useCallback(() => {
    setPendingAction(null);
    setMessages((prev) => prev.map((m) => (m.confirm ? { ...m, confirm: null } : m)));
    appendAssistant('Action cancelled. No changes made, sir.');
  }, [appendAssistant]);

  const appendSystemNote = useCallback((content) => {
    setMessages((prev) => [
      ...prev,
      { id: `sys-${Date.now()}`, role: 'assistant', content, system: true },
    ]);
  }, []);

  const runWebSearch = useCallback(
    async (query) => {
      const pendingId = appendAssistant('Searching the web, sir…', { pending: true });
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
        let summary = data.summary || summarizeSearchResults(data.query || query, data.results || []);
        if (!summary?.trim() || /\bcould not find results\b/i.test(summary)) {
          summary = summarizeSearchResults(data.query || query, data.results || []);
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
        scheduleRestartRef.current?.();
      }
    },
    [appendAssistant, speakReply]
  );

  const runImageGen = useCallback(
    async (prompt) => {
      const pendingId = appendAssistant('Generating image, sir…', { pending: true });
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
        scheduleRestartRef.current?.();
      }
    },
    [appendAssistant, speakReply]
  );

  const sendMessage = useCallback(
    async (text) => {
      try {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (streamingRef.current) {
        appendSystemNote('Still processing your last message, sir. Wait a moment or tap Stop.');
        return;
      }

      pauseListening();

      const userMsg = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      userScrolledUpRef.current = false;

      let data = normalizeJarvisContext(liveData || (await refreshData()));
      const clients = data?.clients || [];
      const parsed = parseJarvisCommand(trimmed, clients);

      if (parsed?.type === 'read' && parsed.command === 'leads' && parsed.days > 1) {
        if (data?.leadsHistory?.[parsed.days] == null) {
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
            // fall through
          }
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
          appendAssistant(reply.content, { cards: reply.cards });
          speakReply(reply.content);
          return;
        }
      }

      if (parsed?.type === 'action' && parsed.command === 'image') {
        await runImageGen(parsed.prompt);
        return;
      }

      if (parsed?.type === 'action' && parsed.command === 'browse') {
        window.open(parsed.url, '_blank', 'noopener,noreferrer');
        const msg = `Opening ${parsed.label || parsed.url}, sir.`;
        appendAssistant(msg);
        speakReply(msg);
        scheduleRestartRef.current?.();
        return;
      }

      if (parsed?.type === 'action' && parsed.needsConfirm) {
        setPendingAction(parsed);
        appendAssistant(`${parsed.summary}\n\nConfirm execution below, sir.`, {
          confirm: parsed,
        });
        scheduleRestartRef.current?.();
        return;
      }

      if (parsed?.type === 'action' && !parsed.needsConfirm) {
        await executeAction(parsed);
        return;
      }

      if (!parsed && messageNeedsWebSearch(trimmed)) {
        const autoQuery =
          extractSearchQueryFromTranscript(trimmed) || normalizeSearchQuery(trimmed);
        if (autoQuery.length > 2) {
          await runWebSearch(autoQuery);
          return;
        }
      }

      const assistantId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
      const history = [...messages, userMsg]
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .filter((m) => typeof m.content === 'string' && m.content.trim())
        .map((m) => ({ role: m.role, content: m.content }));
      const full = await streamLLM(history, assistantId);
      if (full) {
        await speakReply(full);
      } else {
        scheduleRestartRef.current?.();
      }
      } catch (err) {
        console.error('[jarvis] sendMessage', err);
        appendAssistant(
          `Something went wrong, sir. ${err?.message || 'Try help, status, or briefing for instant commands.'}`
        );
        scheduleRestartRef.current?.();
      }
    },
    [liveData, refreshData, messages, appendAssistant, speakReply, streamLLM, executeAction, appendSystemNote, pauseListening, runWebSearch, runImageGen]
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
    onTranscriptRef.current = onTranscript;
    if (recognizingRef.current) {
      pauseListening();
      setContinuousListen(false);
      return;
    }
    setContinuousListen(true);
    await beginListening({ interruptSpeech: true });
  }, [beginListening, pauseListening]);

  const stopListening = useCallback(() => {
    setContinuousListen(false);
    pauseListening();
  }, [pauseListening]);

  const enableContinuousListen = useCallback(async () => {
    setContinuousListen(true);
    setVoiceAutoSend(true);
    const ok = await beginListening();
    if (!ok) {
      setContinuousListen(false);
    }
    return ok;
  }, [beginListening]);

  const unlockAndPrimeAudio = useCallback(() => {
    unlockSpeechAudio({ prime: true });
    setAudioUnlocked(true);
    if (!recognizingRef.current && !streamingRef.current && !speakingRef.current) {
      beginListeningRef.current?.();
    }
  }, []);

  const replayLastReply = useCallback(async () => {
    if (!lastReplyText?.trim() || muted) return;
    unlockSpeechAudio({ prime: true });
    setAudioUnlocked(true);
    pauseListening();
    stopSpeaking();
    pendingTtsRef.current = true;
    await speakJarvis(lastReplyText, {
      muted: false,
      onStart: () => {
        pendingTtsRef.current = false;
        speakingRef.current = true;
        setSpeaking(true);
      },
      onEnd: () => {
        speakingRef.current = false;
        setSpeaking(false);
        pendingTtsRef.current = false;
        scheduleRestartRef.current?.();
      },
    });
  }, [lastReplyText, muted, pauseListening]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      close,
      messages,
      streaming,
      sendMessage,
      stopGeneration,
      bootLine,
      bootTyped,
      messagesEndRef,
      userScrolledUpRef,
      pendingAction,
      executeAction,
      cancelAction,
      speaking,
      listening,
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
      replayLastReply,
    }),
    [
      open,
      toggle,
      close,
      messages,
      streaming,
      sendMessage,
      stopGeneration,
      bootLine,
      bootTyped,
      pendingAction,
      executeAction,
      cancelAction,
      speaking,
      listening,
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
      replayLastReply,
    ]
  );

  return <JarvisContext.Provider value={value}>{children}</JarvisContext.Provider>;
}
