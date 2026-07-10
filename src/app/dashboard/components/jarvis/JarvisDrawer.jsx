'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJarvis } from './JarvisProvider';
import JarvisSheet from './JarvisSheet';
import JarvisVoiceCore from './JarvisVoiceCore';
import JarvisAmbient from './JarvisAmbient';
import { useFocusTrap } from './useFocusTrap';

function StatusPill({ status }) {
  const colors = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    paused: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    completed: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${colors[status] || colors.active}`}>
      {status || 'active'}
    </span>
  );
}

function MessageCard({ card }) {
  const router = useRouter();

  if (card.type === 'help') {
    return (
      <div className="mt-2 rounded-xl border border-sky-500/25 bg-sky-950/40 p-3 text-xs backdrop-blur-sm">
        <p className="font-bold text-cyan-300 mb-2">{card.title}</p>
        {card.sections?.map((s) => (
          <div key={s.label} className="mb-2">
            <p className="text-sky-400/60 uppercase tracking-wide text-[10px] mb-1">{s.label}</p>
            <ul className="space-y-0.5 text-sky-100/80">
              {s.items.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (card.type === 'client') {
    return (
      <button
        type="button"
        onClick={() => router.push(`/dashboard/clients/${card.id}`)}
        className="mt-2 w-full text-left rounded-xl border border-sky-500/20 bg-sky-950/30 p-2.5 hover:border-cyan-400/40 transition backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sky-50 text-xs">{card.name}</span>
          <StatusPill status={card.status} />
        </div>
        {card.company && <p className="text-[10px] text-sky-400/60 mt-0.5">{card.company}</p>}
        <p className="text-[10px] text-sky-500/50 mt-1">{card.projectCount} project(s)</p>
      </button>
    );
  }

  if (card.type === 'lead') {
    return (
      <div className="mt-2 rounded-xl border border-sky-500/20 bg-sky-950/30 p-2.5 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sky-50 text-xs">{card.name}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
            {card.source}
          </span>
        </div>
        <p className="text-[10px] text-sky-500/50 mt-1">{card.date?.slice(0, 10)}</p>
      </div>
    );
  }

  if (card.type === 'report') {
    return (
      <button
        type="button"
        onClick={() => router.push('/dashboard/clients')}
        className="mt-2 w-full text-left rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-2.5 hover:bg-cyan-500/15 transition"
      >
        <p className="text-xs text-cyan-300 font-medium">Report event — {card.projectId}</p>
        <p className="text-[10px] text-sky-400/60 mt-0.5">{card.message || card.eventType}</p>
      </button>
    );
  }

  return null;
}

function voiceState({ listening, streaming, speaking }) {
  if (listening) return 'listening';
  if (streaming) return 'thinking';
  if (speaking) return 'speaking';
  return 'idle';
}

export default function JarvisDrawer() {
  const {
    open,
    close,
    messages,
    streaming,
    sendMessage,
    stopGeneration,
    messagesEndRef,
    userScrolledUpRef,
    pendingAction,
    executeAction,
    cancelAction,
    muted,
    setMuted,
    presentationMode,
    setPresentationMode,
    listening,
    speaking,
    startListening,
    speechSupported,
    voiceAutoSend,
    setVoiceAutoSend,
    voiceInterim,
    voiceError,
  } = useJarvis();
  const [input, setInput] = useState('');
  const trapRef = useFocusTrap(open);

  useEffect(() => {
    if (listening && voiceInterim && !voiceAutoSend) {
      setInput(voiceInterim);
    }
  }, [listening, voiceInterim, voiceAutoSend]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input;
    setInput('');
    sendMessage(text);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMic = () => {
    if (!speechSupported) return;
    startListening((transcript) => setInput((prev) => (prev ? `${prev} ${transcript}` : transcript)));
  };

  const coreState = voiceState({ listening, streaming, speaking });

  return (
    <JarvisSheet open={open} onClose={close}>
      <div ref={trapRef} className="relative flex h-full flex-col jarvis-drawer overflow-hidden">
        <JarvisAmbient />

        <header className="relative z-10 jarvis-header-glass flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400 tracking-[0.15em]">
              JARVIS
            </h2>
            <p className="text-[10px] text-sky-400/70 tracking-widest uppercase">Voice operations assistant</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="text-xs px-2.5 py-1 rounded-full border border-sky-500/30 text-sky-300/80 hover:text-cyan-200 hover:border-cyan-400/40 transition"
              aria-label={muted ? 'Unmute voice' : 'Mute voice'}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button
              type="button"
              onClick={() => setPresentationMode((p) => !p)}
              className={`text-xs px-2.5 py-1 rounded-full border transition ${
                presentationMode
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-sky-500/30 text-sky-300/80 hover:border-cyan-400/40'
              }`}
            >
              Demo
            </button>
            <button
              type="button"
              onClick={close}
              className="text-sky-400/70 hover:text-sky-100 px-2 py-1 rounded-full hover:bg-sky-500/10 text-sm transition"
              aria-label="Close JARVIS"
            >
              ✕
            </button>
          </div>
        </header>

        <JarvisVoiceCore state={coreState} />

        <div
          className="relative z-10 flex-1 overflow-y-auto px-4 pb-4 space-y-3"
          onScroll={(e) => {
            const el = e.currentTarget;
            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
            userScrolledUpRef.current = !atBottom;
          }}
        >
          {messages.length === 0 && (
            <div className="jarvis-bubble-assistant px-4 py-3 text-sm text-sky-200/80">
              <p className="text-cyan-300/90 text-xs font-medium mb-1">Ready, sir.</p>
              Tap the mic or say a command — try <strong className="text-cyan-300">status</strong>,{' '}
              <strong className="text-cyan-300">briefing</strong>, or <strong className="text-cyan-300">help</strong>.
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[88%]">
                {m.role === 'assistant' && !m.system && (
                  <p className="text-[10px] text-cyan-400/60 mb-1 ml-1 tracking-wide">JARVIS</p>
                )}
                <div
                  className={`px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'jarvis-bubble-user text-sky-50'
                      : m.system
                        ? 'jarvis-bubble-system text-sky-300/70 italic text-xs'
                        : 'jarvis-bubble-assistant text-sky-100/95'
                  }`}
                >
                  {m.content || (streaming && m.role === 'assistant' ? (
                    <span className="inline-flex gap-1 items-center text-cyan-400/80">
                      <span className="jarvis-typing-dot" />
                      <span className="jarvis-typing-dot" style={{ animationDelay: '0.15s' }} />
                      <span className="jarvis-typing-dot" style={{ animationDelay: '0.3s' }} />
                    </span>
                  ) : '')}
                </div>
                {m.cards?.map((card, i) => (
                  <MessageCard key={`${m.id}-card-${i}`} card={card} />
                ))}
                {m.confirm && pendingAction?.command === m.confirm.command && (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => executeAction(m.confirm)}
                      className="flex-1 text-xs py-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 text-white font-semibold shadow-lg shadow-cyan-500/20"
                    >
                      Execute
                    </button>
                    <button
                      type="button"
                      onClick={cancelAction}
                      className="flex-1 text-xs py-2 rounded-full border border-sky-500/40 text-sky-300/80"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 jarvis-input-bar p-4">
          {voiceError && (
            <p className="text-[11px] text-red-400 mb-2 px-1">{voiceError}</p>
          )}
          <div className="flex gap-3 items-end">
            {speechSupported && (
              <button
                type="button"
                onClick={handleMic}
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg transition ${
                  listening ? 'jarvis-mic-btn-active jarvis-mic-active' : 'jarvis-mic-btn'
                }`}
                aria-label={listening ? 'Stop listening' : 'Start voice input'}
                aria-pressed={listening}
              >
                🎤
              </button>
            )}
            <div className="flex-1 min-w-0">
              <textarea
                value={listening && voiceAutoSend && voiceInterim ? voiceInterim : input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={streaming}
                rows={2}
                placeholder={
                  listening
                    ? voiceAutoSend
                      ? 'Listening…'
                      : 'Listening… tap mic when done'
                    : 'Ask JARVIS anything…'
                }
                className="w-full resize-none rounded-2xl bg-sky-950/50 border border-sky-500/25 text-sky-50 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 disabled:opacity-50 placeholder:text-sky-500/50"
                aria-label="Message JARVIS"
              />
              <div className="flex items-center justify-between mt-2 px-1">
                <label className="flex items-center gap-1.5 text-[10px] text-sky-400/70 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={voiceAutoSend}
                    onChange={(e) => setVoiceAutoSend(e.target.checked)}
                    className="rounded border-sky-500/40 bg-sky-950 text-cyan-500 focus:ring-cyan-400/30"
                  />
                  Auto-send voice
                </label>
                {streaming ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="text-[10px] px-3 py-1 rounded-full border border-red-400/40 text-red-300 hover:bg-red-500/10"
                  >
                    Stop
                  </button>
                ) : (
                  <span className="text-[10px] text-sky-500/50">⌘J · Enter</span>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={streaming || !(listening && voiceAutoSend ? voiceInterim : input).trim()}
              className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 disabled:opacity-30 disabled:shadow-none transition hover:scale-105"
              aria-label="Send message"
            >
              ↑
            </button>
          </div>
          {!speechSupported && (
            <p className="text-[10px] text-sky-500/50 mt-2 text-center">Voice requires Chrome or Edge, sir.</p>
          )}
        </form>
      </div>
    </JarvisSheet>
  );
}
