'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseJarvisCommand } from '@/lib/jarvis/commands';
import { composeReadResponse } from '@/lib/jarvis/templates';
import {
  speakJarvis,
  stopSpeaking,
  playBootChime,
  createSpeechRecognition,
  isSpeechRecognitionSupported,
  pickBritishVoice,
} from '@/lib/jarvis/voice';

const JarvisContext = createContext(null);
const PRESENTATION_KEY = 'jarvis-presentation';
const MUTE_KEY = 'jarvis-mute';
const VOICE_AUTO_SEND_KEY = 'jarvis-voice-auto-send';

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

export function JarvisProvider({ children, toastApi }) {
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
  const [voiceAutoSend, setVoiceAutoSend] = useState(false);
  const [lastActivityTs, setLastActivityTs] = useState(null);

  const abortRef = useRef(null);
  const messagesEndRef = useRef(null);
  const userScrolledUpRef = useRef(false);
  const recognitionRef = useRef(null);
  const bootPlayedRef = useRef(false);
  const pendingQueryRef = useRef(null);

  const toggle = useCallback(() => setOpen((o) => !o), []);
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
    setMuted(readCookie(MUTE_KEY) !== '0');
    setVoiceAutoSend(readCookie(VOICE_AUTO_SEND_KEY) === '1');
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
    writeCookie(VOICE_AUTO_SEND_KEY, voiceAutoSend ? '1' : '0');
  }, [voiceAutoSend]);

  useEffect(() => {
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
  }, [refreshData]);

  useEffect(() => {
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
  }, [open, lastActivityTs, toastApi]);

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
      if (!text || muted) return;
      speakJarvis(text, {
        muted,
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
      });
    },
    [muted]
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
          window.location.href = '/login?callbackUrl=/dashboard';
          return '';
        }

        if (!res.ok || !res.body) {
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
        return full;
      } catch (err) {
        if (err.name !== 'AbortError') {
          const offline = 'Systems are momentarily offline, sir. Retrying shortly.';
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

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const userMsg = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      userScrolledUpRef.current = false;

      let data = liveData || (await refreshData());
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
        return;
      }

      if (parsed?.type === 'action' && !parsed.needsConfirm) {
        await executeAction(parsed);
        return;
      }

      const assistantId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const full = await streamLLM(history, assistantId);
      if (full) speakReply(full);
    },
    [streaming, liveData, refreshData, messages, appendAssistant, speakReply, streamLLM, executeAction]
  );

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

  const startListening = useCallback(
    (onTranscript) => {
      if (!isSpeechRecognitionSupported() || listening) return;
      recognitionRef.current?.stop();
      const rec = createSpeechRecognition({
        onResult: (transcript) => {
          setListening(false);
          if (voiceAutoSend) sendMessage(transcript);
          else onTranscript?.(transcript);
        },
        onError: () => setListening(false),
        onEnd: () => setListening(false),
      });
      if (!rec) return;
      recognitionRef.current = rec;
      setListening(true);
      rec.start();
    },
    [listening, voiceAutoSend, sendMessage]
  );

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
      openWithQuery,
      liveData,
      refreshData,
    ]
  );

  return <JarvisContext.Provider value={value}>{children}</JarvisContext.Provider>;
}
