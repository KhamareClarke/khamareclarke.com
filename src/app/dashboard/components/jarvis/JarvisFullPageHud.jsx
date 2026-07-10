'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useJarvis } from './JarvisProvider';
import JarvisAmbient from './JarvisAmbient';
import JarvisHudFrame from './JarvisHudFrame';
import JarvisHudRings from './JarvisHudRings';
import JarvisHudPanel from './JarvisHudPanel';
import JarvisHudVisualizer from './JarvisHudVisualizer';
import JarvisVoiceCore from './JarvisVoiceCore';
import JarvisMessageContent, { stripJarvisMarkdown } from './JarvisMessageContent';

function voiceState({ listening, streaming, speaking }) {
  if (listening) return 'listening';
  if (streaming) return 'thinking';
  if (speaking) return 'speaking';
  return 'idle';
}

function HudStat({ label, value }) {
  return (
    <div className="jarvis-hud-stat">
      <p className="text-[9px] uppercase tracking-[0.3em] text-sky-500/60">{label}</p>
      <p className="text-xl font-light text-cyan-300 tabular-nums mt-0.5">{value ?? '—'}</p>
    </div>
  );
}

function MessageCard({ card }) {
  const router = useRouter();

  if (card.type === 'help') {
    return (
      <div className="mt-2 rounded-lg border border-sky-500/25 bg-sky-950/50 p-3 text-xs backdrop-blur-sm">
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
        className="mt-2 w-full text-left rounded-lg border border-sky-500/20 bg-sky-950/40 p-2 hover:border-cyan-400/40 transition text-xs text-sky-100"
      >
        {card.name}
      </button>
    );
  }

  if (card.type === 'lead') {
    return (
      <div className="mt-2 rounded-lg border border-sky-500/20 bg-sky-950/40 p-2 text-xs text-sky-100/80">
        {card.name} · {card.source}
      </div>
    );
  }

  if (card.type === 'search') {
    return (
      <div className="mt-2 rounded-lg border border-cyan-500/25 bg-sky-950/50 p-3 text-xs backdrop-blur-sm max-h-48 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-wider text-cyan-400/70 mb-2">
          Live search · {card.query}
        </p>
        <ul className="space-y-2">
          {(card.results || []).slice(0, 5).map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-100 font-medium line-clamp-1"
              >
                {r.title}
              </a>
              {r.snippet && (
                <p className="text-sky-400/70 text-[10px] mt-0.5 line-clamp-2">{r.snippet}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (card.type === 'image' && card.dataUrl) {
    return (
      <div className="mt-2 rounded-lg border border-cyan-500/25 bg-sky-950/50 p-2 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.dataUrl}
          alt={card.prompt || 'Generated image'}
          className="w-full max-h-64 object-contain rounded-sm"
        />
        {card.prompt && (
          <p className="text-[10px] text-sky-500/70 mt-2 px-1 line-clamp-2">{card.prompt}</p>
        )}
      </div>
    );
  }

  return null;
}

function StatusChip({ active, label }) {
  return (
    <span
      className={`jarvis-status-chip text-[9px] tracking-[0.25em] uppercase px-2.5 py-1 rounded-sm border ${
        active
          ? 'border-cyan-400/60 text-cyan-300 bg-cyan-500/10 jarvis-status-chip-active'
          : 'border-sky-600/30 text-sky-500/50 bg-transparent'
      }`}
    >
      {label}
    </span>
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
    stopListening,
    speechSupported,
    voicePlatformHint,
    isMobileVoice,
    muted,
    setMuted,
    presentationMode,
    setPresentationMode,
    continuousListen,
    voiceInterim,
    voiceError,
    liveData,
    pendingAction,
    executeAction,
    cancelAction,
  } = useJarvis();

  const [input, setInput] = useState('');

  useEffect(() => {
    setOpen(true);
    return () => {
      setOpen(false);
      stopListening();
    };
  }, [setOpen, stopListening]);

  const coreState = voiceState({ listening, streaming, speaking });
  const hudActive = listening || streaming || speaking;
  const activeClients = liveData?.activeClients ?? liveData?.clients?.length;
  const recentMessages = messages.slice(-8);
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant' && m.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage(text);
  };

  return (
    <JarvisHudFrame>
      <div className="jarvis-fullpage relative flex h-full flex-col overflow-hidden bg-[#020617]/95">
        <JarvisAmbient />
        <JarvisHudRings active={hudActive} />

        <header className="relative z-20 flex shrink-0 items-center justify-between px-5 py-3 border-b border-sky-500/10">
          <div>
            <p className="text-[9px] tracking-[0.45em] uppercase text-cyan-500/50">Stark protocols engaged</p>
            <h1 className="text-lg md:text-xl font-light tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-sky-300 to-blue-400">
              J.A.R.V.I.S
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <StatusChip active={listening || continuousListen} label={listening ? 'Listening' : continuousListen ? 'Standby' : 'Mic'} />
            <StatusChip active={streaming} label="Processing" />
            <StatusChip active={speaking} label="Speaking" />
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className={`text-[10px] px-2.5 py-1 rounded-sm border tracking-wider uppercase transition ${
                muted
                  ? 'border-sky-600/40 text-sky-500/70'
                  : 'border-cyan-400/50 text-cyan-300 bg-cyan-500/10'
              }`}
            >
              {muted ? 'Voice off' : 'Voice on'}
            </button>
            <button
              type="button"
              onClick={() => setPresentationMode((p) => !p)}
              className={`text-[10px] px-2.5 py-1 rounded-sm border tracking-wider uppercase transition ${
                presentationMode
                  ? 'border-cyan-400/50 text-cyan-300 bg-cyan-500/10'
                  : 'border-sky-600/40 text-sky-500/70'
              }`}
            >
              Demo
            </button>
            <Link
              href="/dashboard/leads"
              className="text-[10px] px-2.5 py-1 rounded-sm border border-sky-600/40 text-sky-400/80 tracking-wider uppercase hover:text-sky-100 transition"
            >
              Leads
            </Link>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 min-h-0 flex-col lg:flex-row gap-2 px-3 md:px-5 py-3">
          <JarvisHudPanel title="Telemetry" align="left">
            <HudStat label="Leads today" value={liveData?.leadsToday} />
            <HudStat label="Tasks queued" value={liveData?.tasksQueued} />
            <HudStat label="Clients" value={activeClients} />
            {bootLine && bootTyped && (
              <p className="text-[10px] text-sky-500/70 leading-relaxed border-t border-sky-500/10 pt-2 mt-1">
                {bootLine}
              </p>
            )}
          </JarvisHudPanel>

          <div className="relative flex flex-1 flex-col items-center justify-center min-h-[220px] min-w-0">
            <div className="relative flex flex-col items-center w-full">
              <JarvisVoiceCore
                size="lg"
                state={coreState}
                label={bootTyped && bootLine ? undefined : 'Boot sequence'}
              />

              {(listening || voiceInterim) && (
                <div className="jarvis-interim-display mt-4 max-w-lg w-full px-4 py-3 text-center">
                  <p className="text-[9px] uppercase tracking-[0.35em] text-cyan-400/60 mb-1">
                    {listening ? 'Receiving audio' : 'Last heard'}
                  </p>
                  <p className="text-sm md:text-base text-cyan-100/90 font-light tracking-wide min-h-[1.25rem]">
                    {voiceInterim || (listening ? 'Speak now, sir…' : '…')}
                  </p>
                </div>
              )}

              {lastAssistant && !listening && !streaming && (
                <p className="mt-3 max-w-md text-center text-xs text-sky-400/70 px-4 line-clamp-3">
                  {stripJarvisMarkdown(lastAssistant.content)}
                </p>
              )}
            </div>
          </div>

          <JarvisHudPanel title="Comms log" align="right">
            {recentMessages.length === 0 ? (
              <p className="text-sky-500/50 text-[10px] leading-relaxed">
                Voice or text: <span className="text-cyan-400">status</span>,{' '}
                <span className="text-cyan-400">search rtx 4060 price</span>,{' '}
                <span className="text-cyan-400">open youtube</span>,{' '}
                <span className="text-cyan-400">draw iron man hud</span>
              </p>
            ) : (
              recentMessages.slice(-5).map((m) => (
                <p
                  key={m.id}
                  className={`text-[10px] leading-snug ${
                    m.role === 'user' ? 'text-cyan-200/90' : 'text-sky-400/80'
                  }`}
                >
                  <span className="text-sky-600/80">{m.role === 'user' ? '▸ ' : '◂ '}</span>
                  {stripJarvisMarkdown((m.content || '…').slice(0, 80))}
                  {(m.content || '').length > 80 ? '…' : ''}
                </p>
              ))
            )}
          </JarvisHudPanel>
        </div>

        <div
          className="relative z-10 flex shrink-0 max-h-28 sm:max-h-36 w-full max-w-3xl mx-auto overflow-y-auto px-4 py-1 space-y-2"
          onScroll={(e) => {
            const el = e.currentTarget;
            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
            userScrolledUpRef.current = !atBottom;
          }}
        >
          {recentMessages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[88%]">
                <div
                  className={`px-3 py-1.5 text-xs whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'jarvis-bubble-user text-sky-50'
                      : m.system
                        ? 'jarvis-bubble-system text-sky-300/70 italic'
                        : 'jarvis-bubble-assistant text-sky-100/95'
                  }`}
                >
                  {m.role === 'user' ? (
                    m.content
                  ) : m.content ? (
                    <JarvisMessageContent content={m.content} />
                  ) : streaming && m.role === 'assistant' ? (
                    <span className="inline-flex gap-1 items-center text-cyan-400/80">
                      <span className="jarvis-typing-dot" />
                      <span className="jarvis-typing-dot" style={{ animationDelay: '0.15s' }} />
                      <span className="jarvis-typing-dot" style={{ animationDelay: '0.3s' }} />
                    </span>
                  ) : (
                    ''
                  )}
                </div>
                {m.cards?.map((card, i) => (
                  <MessageCard key={`${m.id}-card-${i}`} card={card} />
                ))}
                {m.confirm && pendingAction?.command === m.confirm.command && (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => executeAction(m.confirm)}
                      className="flex-1 text-[10px] py-1.5 rounded-sm bg-cyan-600/80 text-white font-semibold uppercase tracking-wider"
                    >
                      Execute
                    </button>
                    <button
                      type="button"
                      onClick={cancelAction}
                      className="flex-1 text-[10px] py-1.5 rounded-sm border border-sky-500/40 text-sky-300/80 uppercase tracking-wider"
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

        <footer className="relative z-20 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] px-4 space-y-3 border-t border-sky-500/10 pt-3">
          <JarvisHudVisualizer active={hudActive} barCount={isMobileVoice ? 32 : 64} />

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            {voiceError && <p className="text-[10px] text-red-400 mb-2 text-center">{voiceError}</p>}
            {!speechSupported && voicePlatformHint && (
              <p className="text-[10px] text-amber-400/90 mb-2 text-center">{voicePlatformHint}</p>
            )}
            <div className="flex gap-2 items-stretch justify-center">
              <input
                type="text"
                inputMode="text"
                enterKeyHint="send"
                autoComplete="off"
                autoCorrect="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
                placeholder={
                  speechSupported
                    ? 'Speak anytime — or type here and press Send'
                    : 'Type a command…'
                }
                className="flex-1 min-w-0 w-full rounded-sm bg-sky-950/70 border border-sky-500/20 text-sky-50 text-base px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 font-mono placeholder:text-sky-600/60"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={stopGeneration}
                  className="shrink-0 px-3 py-2.5 rounded-sm border border-red-400/40 text-red-300 text-xs uppercase tracking-wider"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="shrink-0 px-4 py-2.5 rounded-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-30"
                  title="Typed text only — voice sends automatically"
                >
                  Send
                </button>
              )}
            </div>
            {speechSupported && (
              <p className="text-center text-[9px] text-sky-600/80 uppercase tracking-widest mt-2">
                Always listening · pause speaking to send
              </p>
            )}
          </form>
        </footer>
      </div>
    </JarvisHudFrame>
  );
}
