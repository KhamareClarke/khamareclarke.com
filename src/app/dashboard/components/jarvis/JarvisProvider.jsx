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
} from '@/lib/jarvis/voice';
import { stripJarvisMarkdown } from '@/app/dashboard/components/jarvis/JarvisMessageContent';

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
  const [muted, setMuted] = useState(true);
  const [voiceAutoSend, setVoiceAutoSend] = useState(true);
  const [continuousListen, setContinuousListen] = useState(false);
  const [voiceInterim, setVoiceInterim] = useState('');
  const [voiceError, setVoiceError] = useState(null);
  const [lastActivityTs, setLastActivityTs] = useState(null);

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
    setMuted(readCookie(MUTE_KEY) === '1');
    setVoiceAutoSend(readCookie(VOICE_AUTO_SEND_KEY) !== '0');
    setContinuousListen(readCookie(CONTINUOUS_LISTEN_KEY) !== '0');
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
    } else if (!speakingRef.current) {
      scheduleRestartRef.current?.();
    }
  }, [streaming]);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

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
      rec.start();
      return true;
    } catch {
      try {
        rec.stop();
      } catch {
        // ignore
      }
      await new Promise((r) => setTimeout(r, 350));
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
    if (streamingRef.current || speakingRef.current) return;
    setTimeout(() => {
      if (!continuousListenRef.current) return;
      if (streamingRef.current || speakingRef.current || recognizingRef.current) return;
      beginListeningRef.current?.();
    }, 600);
  }, []);

  useEffect(() => {
    beginListeningRef.current = beginListening;
    scheduleRestartRef.current = scheduleRestartListening;
  }, [beginListening, scheduleRestartListening]);

  useEffect(() => {
    if (minimal) return undefined;
    if (!isSpeechRecognitionSupported()) return undefined;

    const rec = createSpeechRecognition({
      continuous: true,
      onStart: () => {
        recognizingRef.current = true;
        setListening(true);
        setVoiceError(null);
        transcriptRef.current = '';
        setVoiceInterim('');
      },
      onResult: (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const piece = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            transcriptRef.current = `${transcriptRef.current} ${piece}`.trim();
          } else {
            interim += piece;
          }
        }
        const display = interim
          ? `${transcriptRef.current} ${interim}`.trim()
          : transcriptRef.current;
        if (display) setVoiceInterim(display);
      },
      onError: (code) => {
        if (code === 'no-speech' && continuousListenRef.current) return;
        if (code === 'aborted') return;
        const msg = mapSpeechError(code);
        if (msg) setVoiceError(msg);
      },
      onEnd: () => {
        recognizingRef.current = false;
        setListening(false);

        const transcript = (transcriptRef.current || '').trim();
        transcriptRef.current = '';
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
    (text) => {
      const finish = () => scheduleRestartRef.current?.();
      if (!text) {
        finish();
        return;
      }
      if (muted) {
        finish();
        return;
      }
      pauseListening();
      speakJarvis(stripJarvisMarkdown(text), {
        muted,
        onStart: () => {
          speakingRef.current = true;
          setSpeaking(true);
        },
        onEnd: () => {
          speakingRef.current = false;
          setSpeaking(false);
          finish();
        },
      });
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
          body: JSON.stringify({ messages: history }),
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
          const empty = 'No reply received, sir. Verify GEMINI_API_KEY in Vercel or try help / status.';
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
        if (!speakingRef.current) {
          scheduleRestartRef.current?.();
        }
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
        const reply = composeReadResponse(parsed, data || {});
        if (reply) {
          appendAssistant(reply.content, { cards: reply.cards });
          speakReply(reply.content);
          return;
        }
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

      const assistantId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
      const history = [...messages, userMsg]
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .filter((m) => typeof m.content === 'string' && m.content.trim())
        .map((m) => ({ role: m.role, content: m.content }));
      const full = await streamLLM(history, assistantId);
      if (full) speakReply(full);
      } catch (err) {
        console.error('[jarvis] sendMessage', err);
        appendAssistant(
          `Something went wrong, sir. ${err?.message || 'Try help, status, or briefing for instant commands.'}`
        );
        scheduleRestartRef.current?.();
      }
    },
    [liveData, refreshData, messages, appendAssistant, speakReply, streamLLM, executeAction, appendSystemNote, pauseListening]
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
    await beginListening();
  }, [beginListening]);

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
    ]
  );

  return <JarvisContext.Provider value={value}>{children}</JarvisContext.Provider>;
}
