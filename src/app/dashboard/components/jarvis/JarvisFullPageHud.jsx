'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useJarvis } from './JarvisProvider';
import JarvisAmbient from './JarvisAmbient';
import JarvisHudRings from './JarvisHudRings';
import JarvisHudVisualizer from './JarvisHudVisualizer';
import JarvisVoiceCore from './JarvisVoiceCore';

function voiceState({ listening, streaming, speaking }) {
  if (listening) return 'listening';
  if (streaming) return 'thinking';
  if (speaking) return 'speaking';
  return 'idle';
}

function HudStat({ label, value }) {
  return (
    <div className="jarvis-hud-stat text-center">
      <p className="text-[10px] uppercase tracking-[0.25em] text-sky-500/70">{label}</p>
      <p className="text-2xl font-light text-cyan-300 tabular-nums">{value ?? '—'}</p>
    </div>
  );
}

export default function JarvisFullPageHud() {
  const {
    setOpen,
    messages,
    streaming,
    sendMessage,
    stopGeneration,
    messagesEndRef,
    userScrolledUpRef,
    bootLine,
    bootTyped,
    speaking,
    listening,
    startListening,
    speechSupported,
    muted,
    setMuted,
    presentationMode,
    setPresentationMode,
    voiceAutoSend,
    setVoiceAutoSend,
    voiceInterim,
    voiceError,
    liveData,
  } = useJarvis();

  const [input, setInput] = useState('');

  useEffect(() => {
    setOpen(true);
    return () => setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (listening && voiceInterim && !voiceAutoSend) {
      setInput(voiceInterim);
    }
  }, [listening, voiceInterim, voiceAutoSend]);

  const coreState = voiceState({ listening, streaming, speaking });
  const hudActive = listening || streaming || speaking;
  const recentMessages = messages.slice(-6);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input;
    setInput('');
    sendMessage(text);
  };

  const handleMic = () => {
    if (!speechSupported) return;
    startListening((transcript) => setInput((prev) => (prev ? `${prev} ${transcript}` : transcript)));
  };

  return (
    <div className="jarvis-fullpage relative flex h-full flex-col overflow-hidden bg-[#030712]">
      <JarvisAmbient />
      <JarvisHudRings active={hudActive} />

      <header className="relative z-20 flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-sky-500/60">Systems online</p>
          <h1 className="text-xl font-light tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-sky-400">
            J.A.R.V.I.S
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="text-xs px-3 py-1.5 rounded-full border border-sky-500/30 text-sky-300/80 hover:border-cyan-400/40 transition"
          >
            {muted ? 'Voice off' : 'Voice on'}
          </button>
          <button
            type="button"
            onClick={() => setPresentationMode((p) => !p)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              presentationMode
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-sky-500/30 text-sky-300/80'
            }`}
          >
            Demo
          </button>
          <Link
            href="/dashboard/leads"
            className="text-xs px-3 py-1.5 rounded-full border border-sky-500/30 text-sky-300/80 hover:text-sky-100 transition"
          >
            ← Leads
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex justify-center gap-12 px-6 py-2">
        <HudStat label="Leads today" value={liveData?.leadsToday} />
        <HudStat label="Tasks queued" value={liveData?.tasksQueued} />
        <HudStat label="Active clients" value={liveData?.activeClients} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-0 px-4">
        <div className="relative flex flex-col items-center">
          <JarvisVoiceCore state={coreState} label={bootTyped && bootLine ? undefined : 'Initialising'} />
          {bootLine && bootTyped && (
            <p className="mt-2 max-w-md text-center text-xs text-sky-400/80 tracking-wide animate-fade-in">
              {bootLine}
            </p>
          )}
        </div>

        <div
          className="mt-6 w-full max-w-2xl flex-1 min-h-0 overflow-y-auto px-2 space-y-2"
          onScroll={(e) => {
            const el = e.currentTarget;
            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
            userScrolledUpRef.current = !atBottom;
          }}
        >
          {recentMessages.length === 0 && (
            <p className="text-center text-sm text-sky-400/60">
              Tap the mic or type below — try <span className="text-cyan-300">status</span>,{' '}
              <span className="text-cyan-300">briefing</span>, or <span className="text-cyan-300">help</span>.
            </p>
          )}
          {recentMessages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-4 py-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'jarvis-bubble-user text-sky-50'
                    : m.system
                      ? 'jarvis-bubble-system text-sky-300/70 italic text-xs'
                      : 'jarvis-bubble-assistant text-sky-100/95'
                }`}
              >
                {m.content ||
                  (streaming && m.role === 'assistant' ? (
                    <span className="inline-flex gap-1 items-center text-cyan-400/80">
                      <span className="jarvis-typing-dot" />
                      <span className="jarvis-typing-dot" style={{ animationDelay: '0.15s' }} />
                      <span className="jarvis-typing-dot" style={{ animationDelay: '0.3s' }} />
                    </span>
                  ) : (
                    ''
                  ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="relative z-20 pb-6 px-4 space-y-4">
        <JarvisHudVisualizer active={hudActive} />

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          {voiceError && <p className="text-[11px] text-red-400 mb-2 text-center">{voiceError}</p>}
          <div className="flex gap-3 items-center justify-center">
            {speechSupported && (
              <button
                type="button"
                onClick={handleMic}
                className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-xl transition ${
                  listening ? 'jarvis-mic-btn-active jarvis-mic-active' : 'jarvis-mic-btn'
                }`}
                aria-label={listening ? 'Stop listening' : 'Start voice input'}
                aria-pressed={listening}
              >
                🎤
              </button>
            )}
            <input
              type="text"
              value={listening && voiceAutoSend && voiceInterim ? voiceInterim : input}
              onChange={(e) => setInput(e.target.value)}
              disabled={streaming}
              placeholder={listening ? 'Listening…' : 'Command JARVIS…'}
              className="flex-1 max-w-md rounded-full bg-sky-950/60 border border-sky-500/25 text-sky-50 text-sm px-5 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 disabled:opacity-50 placeholder:text-sky-500/50"
            />
            {streaming ? (
              <button
                type="button"
                onClick={stopGeneration}
                className="shrink-0 px-4 py-3 rounded-full border border-red-400/40 text-red-300 text-sm"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!(listening && voiceAutoSend ? voiceInterim : input).trim()}
                className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-bold disabled:opacity-30 transition"
              >
                ↑
              </button>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <label className="flex items-center gap-1.5 text-[10px] text-sky-400/70 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceAutoSend}
                onChange={(e) => setVoiceAutoSend(e.target.checked)}
                className="rounded border-sky-500/40 bg-sky-950 text-cyan-500"
              />
              Auto-send voice
            </label>
            {!speechSupported && (
              <span className="text-[10px] text-sky-500/50">Voice needs Chrome or Edge</span>
            )}
          </div>
        </form>
      </footer>
    </div>
  );
}
