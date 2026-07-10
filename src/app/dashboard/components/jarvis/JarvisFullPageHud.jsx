'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useJarvis } from './JarvisProvider';
import JarvisAmbient from './JarvisAmbient';
import JarvisHudFrame from './JarvisHudFrame';
import JarvisHudRings from './JarvisHudRings';
import JarvisHudPanel from './JarvisHudPanel';
import JarvisHudStatBar from './JarvisHudStatBar';
import JarvisHudVisualizer from './JarvisHudVisualizer';
import JarvisVoiceCore from './JarvisVoiceCore';
import JarvisCommandChips from './JarvisCommandChips';
import JarvisMessageContent, { stripJarvisMarkdown } from './JarvisMessageContent';

function voiceState({ listening, streaming, speaking }) {
  if (listening) return 'listening';
  if (streaming) return 'thinking';
  if (speaking) return 'speaking';
  return 'idle';
}

function dedupeMessages(messages) {
  const out = [];
  for (const m of messages) {
    const c = (m.content || '').trim();
    const prev = out[out.length - 1];
    if (prev && prev.role === m.role && (prev.content || '').trim() === c) continue;
    out.push(m);
  }
  return out;
}

function MessageCard({ card }) {
  const router = useRouter();

  if (card.type === 'help') {
    return (
      <div className="jarvis-card mt-2 p-3 text-xs">
        <p className="font-semibold text-cyan-300 mb-2 tracking-wide">{card.title}</p>
        {card.sections?.map((s) => (
          <div key={s.label} className="mb-2">
            <p className="text-sky-400/60 uppercase tracking-wide text-[9px] mb-1">{s.label}</p>
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
        className="jarvis-card mt-2 w-full text-left p-2.5 hover:border-cyan-400/40 transition text-xs text-sky-100"
      >
        {card.name}
      </button>
    );
  }

  if (card.type === 'lead') {
    return (
      <div className="jarvis-card mt-2 p-2.5 text-xs text-sky-100/80">
        {card.name} · {card.source}
      </div>
    );
  }

  if (card.type === 'search') {
    return (
      <div className="jarvis-card jarvis-card-search mt-2 p-3 text-xs max-h-40 overflow-y-auto">
        <p className="text-[9px] uppercase tracking-wider text-cyan-400/70 mb-2">Live search · {card.query}</p>
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
              {r.snippet && <p className="text-sky-400/70 text-[10px] mt-0.5 line-clamp-2">{r.snippet}</p>}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (card.type === 'image' && card.dataUrl) {
    return (
      <div className="jarvis-card mt-2 p-2 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.dataUrl} alt={card.prompt || 'Generated'} className="w-full max-h-48 object-contain" />
      </div>
    );
  }

  return null;
}

function CommsMessage({ m, streaming, pendingAction, executeAction, cancelAction }) {
  const isUser = m.role === 'user';
  const isError = !isUser && (m.content || '').includes('LLM error');

  return (
    <div className={`jarvis-comms-row ${isUser ? 'jarvis-comms-user' : 'jarvis-comms-assistant'}`}>
      <p className="jarvis-comms-label mb-1">
        {isUser ? 'Operator' : m.system ? 'System' : 'JARVIS'}
      </p>
      <div
        className={`jarvis-comms-bubble whitespace-pre-wrap ${
          isUser ? 'jarvis-bubble-user' : isError ? 'jarvis-bubble-error' : m.system ? 'jarvis-bubble-system' : 'jarvis-bubble-assistant'
        }`}
      >
        {isUser ? (
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
            className="flex-1 text-[9px] py-2 jarvis-btn-primary uppercase tracking-wider"
          >
            Execute
          </button>
          <button
            type="button"
            onClick={cancelAction}
            className="flex-1 text-[9px] py-2 jarvis-btn-ghost uppercase tracking-wider"
          >
            Cancel
          </button>
        </div>
      )}
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
    stopSpeakingReply,
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
    voiceInterim,
    voiceError,
    liveData,
    pendingAction,
    executeAction,
    cancelAction,
    audioUnlocked,
    unlockAndPrimeAudio,
    lastReplyText,
    replayLastReply,
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
  const displayMessages = useMemo(() => dedupeMessages(messages).slice(-20), [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage(text);
  };

  return (
    <JarvisHudFrame>
      <div className="jarvis-fullpage jarvis-cockpit relative flex h-full flex-col overflow-hidden">
        {isMobileVoice && !audioUnlocked && (
          <button
            type="button"
            onClick={unlockAndPrimeAudio}
            className="jarvis-audio-unlock fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-slate-950/92 backdrop-blur-sm border-0 cursor-pointer"
          >
            <span className="text-4xl">🔊</span>
            <span className="text-cyan-200 text-sm font-light tracking-[0.25em] uppercase">
              Tap to enable JARVIS voice
            </span>
            <span className="text-sky-500/60 text-[10px] max-w-xs text-center px-6">
              Required on mobile. Turn off silent mode, then tap once.
            </span>
          </button>
        )}
        <JarvisAmbient />

        {/* Floating controls */}
        <div className="absolute top-3 right-3 md:top-4 md:right-5 z-30 flex items-center gap-1.5">
          {speaking && (
            <button
              type="button"
              onClick={stopSpeakingReply}
              className="jarvis-pill jarvis-pill-btn jarvis-pill-active border-red-400/40 text-red-200"
              aria-label="Stop JARVIS voice"
            >
              Stop voice
            </button>
          )}
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className={`jarvis-pill jarvis-pill-btn ${!muted ? 'jarvis-pill-active' : ''}`}
            aria-label={muted ? 'Unmute voice' : 'Mute voice'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <Link href="/dashboard/leads" className="jarvis-pill jarvis-pill-btn hidden sm:inline">
            Exit
          </Link>
        </div>

        {/* Main cockpit grid */}
        <div className="relative z-10 flex flex-1 min-h-0 gap-3 px-3 md:px-5 pt-3 pb-2">
          <JarvisHudPanel title="Telemetry" align="left">
            <JarvisHudStatBar label="Leads today" value={liveData?.leadsToday} max={10} />
            <JarvisHudStatBar label="Tasks queued" value={liveData?.tasksQueued} max={20} />
            <JarvisHudStatBar label="Active clients" value={activeClients} max={10} />
            {bootLine && bootTyped && (
              <p className="text-[9px] text-sky-500/60 leading-relaxed border-t border-sky-500/10 pt-2 mt-1 font-sans">
                {bootLine}
              </p>
            )}
          </JarvisHudPanel>

          {/* Center stage — full rings + orb */}
          <div className="jarvis-center-stage relative flex flex-1 flex-col items-center min-w-0 min-h-0 overflow-visible">
            <p className="absolute top-0 left-0 right-0 z-10 text-center text-[9px] md:text-[10px] tracking-[0.45em] uppercase text-cyan-400/35 font-light pointer-events-none">
              J.A.R.V.I.S
            </p>

            <div className="relative z-10 flex flex-1 w-full min-h-0 items-center justify-center">
              <JarvisHudRings
                active={hudActive}
                className="jarvis-hud-rings-stage absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />

              <div className="relative z-10 flex w-full flex-col items-center justify-center">
                <JarvisVoiceCore
                  size="lg"
                  state={coreState}
                  label={bootTyped && bootLine ? undefined : 'Initializing'}
                />

                {(listening || voiceInterim) && (
                  <div className="jarvis-interim-display mt-4 max-w-md w-full mx-3 px-4 py-3 text-center">
                    <p className="text-[8px] uppercase tracking-[0.4em] text-cyan-400/50 mb-1.5">
                      {listening ? '◉ Receiving' : 'Last signal'}
                    </p>
                    <p className="text-sm text-cyan-50/95 font-light leading-snug min-h-[1.25rem]">
                      {voiceInterim || 'Speak now, sir…'}
                    </p>
                  </div>
                )}

                {!listening && !voiceInterim && !streaming && (
                  <JarvisCommandChips onSelect={sendMessage} disabled={streaming} />
                )}
              </div>
            </div>
          </div>

          {/* Comms panel */}
          <JarvisHudPanel title="Comms" variant="comms" className="min-h-0">
            <div
              className="jarvis-comms-feed font-sans flex-1 w-full space-y-4 overflow-y-auto pr-1 min-h-0"
              onScroll={(e) => {
                const el = e.currentTarget;
                const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
                userScrolledUpRef.current = !atBottom;
              }}
            >
              {displayMessages.length === 0 ? (
                <p className="text-sky-400/70 text-[11px] leading-relaxed font-sans">
                  Voice or tap a command chip. Try <span className="text-cyan-300 font-medium">status</span> or ask anything.
                </p>
              ) : (
                displayMessages.map((m) => (
                  <CommsMessage
                    key={m.id}
                    m={m}
                    streaming={streaming}
                    pendingAction={pendingAction}
                    executeAction={executeAction}
                    cancelAction={cancelAction}
                  />
                ))
              )}
            </div>
          </JarvisHudPanel>
        </div>

        {/* Mobile comms strip */}
        <div
          className="jarvis-mobile-comms font-sans md:hidden relative z-10 mx-3 mb-2 max-h-40 overflow-y-auto space-y-3 shrink-0"
          onScroll={(e) => {
            const el = e.currentTarget;
            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 32;
            userScrolledUpRef.current = !atBottom;
          }}
        >
          {displayMessages.slice(-4).map((m) => (
            <CommsMessage
              key={m.id}
              m={m}
              streaming={streaming}
              pendingAction={pendingAction}
              executeAction={executeAction}
              cancelAction={cancelAction}
            />
          ))}
        </div>

        {/* Cockpit footer */}
        <footer className="jarvis-cockpit-footer relative z-20 shrink-0 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1">
          <div ref={messagesEndRef} className="h-px w-full" aria-hidden />
          <JarvisHudVisualizer active={hudActive} barCount={isMobileVoice ? 40 : 72} />

          {(voiceError || (!speechSupported && voicePlatformHint)) && (
            <div className="jarvis-alert max-w-2xl mx-auto mb-2 px-3 py-2 text-[10px] text-center">
              {voiceError || voicePlatformHint}
            </div>
          )}

          {isMobileVoice && audioUnlocked && lastReplyText && !speaking && !streaming && (
            <div className="max-w-2xl mx-auto mb-2 flex justify-center">
              <button
                type="button"
                onClick={replayLastReply}
                className="jarvis-pill jarvis-pill-btn jarvis-pill-active text-[10px] uppercase tracking-wider"
              >
                Tap to hear reply
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="jarvis-input-dock max-w-2xl mx-auto">
            <input
              type="text"
              inputMode="text"
              enterKeyHint="send"
              autoComplete="off"
              autoCorrect="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={streaming}
              placeholder="Speak anytime — or type here"
              className="jarvis-input-field flex-1 min-w-0 bg-transparent border-0 outline-none text-sky-50 text-base font-mono placeholder:text-sky-600/50"
            />
            {streaming ? (
              <button type="button" onClick={stopGeneration} className="jarvis-btn-stop shrink-0">
                Stop
              </button>
            ) : speaking ? (
              <button type="button" onClick={stopSpeakingReply} className="jarvis-btn-stop shrink-0">
                Stop voice
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()} className="jarvis-btn-send shrink-0 disabled:opacity-30">
                Send
              </button>
            )}
          </form>
          {speechSupported && (
            <p className="text-center text-[8px] text-sky-600/70 uppercase tracking-[0.35em] mt-2">
              Continuous listen · pause to send
            </p>
          )}
        </footer>
      </div>
    </JarvisHudFrame>
  );
}
