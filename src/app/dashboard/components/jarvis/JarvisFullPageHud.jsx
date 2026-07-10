'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useJarvis } from './JarvisProvider';
import JarvisAmbient from './JarvisAmbient';
import JarvisHudFrame from './JarvisHudFrame';
import JarvisHudRings from './JarvisHudRings';
import JarvisHudStatBar from './JarvisHudStatBar';
import JarvisVoiceCore from './JarvisVoiceCore';
import JarvisMessageContent from './JarvisMessageContent';

function useLiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
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

function WidgetCard({ title, children, className = '' }) {
  return (
    <div className={`jarvis-widget-card ${className}`}>
      <p className="jarvis-widget-title">{title}</p>
      <div className="jarvis-widget-body">{children}</div>
    </div>
  );
}

function MessageCard({ card }) {
  const router = useRouter();
  if (card.type === 'search') {
    return (
      <div className="jarvis-card jarvis-card-search mt-2 p-3 text-xs max-h-40 overflow-y-auto">
        <p className="text-[9px] uppercase tracking-wider text-cyan-400/70 mb-2">Live search · {card.query}</p>
        <ul className="space-y-2">
          {(card.results || []).slice(0, 5).map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-100 font-medium line-clamp-1">
                {r.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (card.type === 'link' && card.url) {
    return (
      <a href={card.url} target="_blank" rel="noopener noreferrer" className="jarvis-card jarvis-card-link mt-2 block p-3 text-xs text-center text-cyan-200">
        ↗ {card.label || 'Open link'}
      </a>
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
  if (card.type === 'client') {
    return (
      <button type="button" onClick={() => router.push(`/dashboard/clients/${card.id}`)} className="jarvis-card mt-2 w-full text-left p-2.5 text-xs text-sky-100">
        {card.name}
      </button>
    );
  }
  return null;
}

function CommsMessage({ m, streaming, pendingAction, executeAction, cancelAction }) {
  const isUser = m.role === 'user';
  return (
    <div className={`jarvis-comms-row ${isUser ? 'jarvis-comms-user' : 'jarvis-comms-assistant'}`}>
      <p className="jarvis-comms-label mb-1">{isUser ? 'Operator' : m.system ? 'System' : 'JARVIS'}</p>
      <div className={`jarvis-comms-bubble whitespace-pre-wrap ${isUser ? 'jarvis-bubble-user' : 'jarvis-bubble-assistant'}`}>
        {isUser ? m.content : m.content ? <JarvisMessageContent content={m.content} /> : streaming ? '…' : ''}
      </div>
      {m.cards?.map((card, i) => (
        <MessageCard key={`${m.id}-card-${i}`} card={card} />
      ))}
      {m.confirm && pendingAction?.command === m.confirm.command && (
        <div className="mt-2 flex gap-2">
          <button type="button" onClick={() => executeAction(m.confirm)} className="flex-1 text-[9px] py-2 jarvis-btn-primary uppercase">Execute</button>
          <button type="button" onClick={cancelAction} className="flex-1 text-[9px] py-2 jarvis-btn-ghost uppercase">Cancel</button>
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
    clearComms,
    stopGeneration,
    stopSpeakingReply,
    messagesEndRef,
    userScrolledUpRef,
    bootLine,
    bootTyped,
    speaking,
    listening,
    activity,
    stopListening,
    startListening,
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
    clapWake,
    setClapWake,
    setPresentationMode,
  } = useJarvis();

  const [input, setInput] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const inputRef = useRef(null);
  const sessionStartRef = useRef(Date.now());
  const [, tickUptime] = useState(0);
  const now = useLiveClock();

  useEffect(() => {
    setOpen(true);
    const id = setInterval(() => tickUptime((t) => t + 1), 1000);
    return () => {
      clearInterval(id);
      setOpen(false);
      stopListening();
    };
  }, [setOpen, stopListening]);

  const coreState = activity || 'idle';
  const hudActive = coreState !== 'idle' || listening;
  const activeClients = liveData?.activeClients ?? liveData?.clients?.length;
  const displayMessages = useMemo(() => dedupeMessages(messages).slice(-30), [messages]);
  const timeStr = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const uptime = formatUptime(Date.now() - sessionStartRef.current);
  const loadPct = Math.min(100, Math.round(((liveData?.tasksQueued || 0) / 20) * 100));

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage(text);
  };

  const toggleMic = () => {
    if (listening) stopListening();
    else startListening();
  };

  return (
    <JarvisHudFrame>
      <div className="jarvis-fullpage jarvis-cockpit jarvis-ref-ui relative flex h-full flex-col overflow-hidden" data-activity={coreState}>
        {isMobileVoice && !audioUnlocked && (
          <button type="button" onClick={unlockAndPrimeAudio} className="jarvis-audio-unlock fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-slate-950/92 backdrop-blur-sm border-0 cursor-pointer">
            <span className="text-4xl">🔊</span>
            <span className="text-cyan-200 text-sm font-light tracking-[0.25em] uppercase">Tap to enable JARVIS voice</span>
          </button>
        )}

        <JarvisAmbient />

        {/* Top bar — reference layout */}
        <header className="jarvis-topbar relative z-30 shrink-0 flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-sky-500/10">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`jarvis-online-dot ${hudActive || listening ? 'jarvis-online-dot-live' : ''}`} aria-hidden />
            <span className="jarvis-topbar-brand truncate">J.A.R.V.I.S</span>
            <span className="jarvis-topbar-status hidden sm:inline">Online</span>
          </div>
          <div className="jarvis-topbar-clock hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg border border-sky-500/15 bg-sky-950/40">
            <span className="tabular-nums text-cyan-100/95 text-sm">{timeStr}</span>
            <span className="text-sky-500/50">|</span>
            <span className="text-sky-400/80 text-xs">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="jarvis-topbar-meta hidden lg:inline text-xs text-sky-400/70">Fleet online</span>
            <div className="relative">
              <button type="button" onClick={() => setSettingsOpen((o) => !o)} className="jarvis-dock-btn" aria-label="Settings">⚙</button>
              {settingsOpen && (
                <div className="jarvis-settings-menu absolute right-0 top-full mt-2 z-50 min-w-[10rem] p-2 rounded-lg border border-sky-500/20 bg-slate-950/95 shadow-xl">
                  <button type="button" onClick={() => setMuted((m) => !m)} className="jarvis-settings-item w-full text-left">{muted ? 'Unmute voice' : 'Mute voice'}</button>
                  <button type="button" onClick={() => setClapWake((c) => !c)} className="jarvis-settings-item w-full text-left">Clap wake {clapWake ? 'on' : 'off'}</button>
                  <button type="button" onClick={() => setPresentationMode((p) => !p)} className="jarvis-settings-item w-full text-left">Presentation</button>
                  <Link href="/dashboard/leads" className="jarvis-settings-item block">Exit JARVIS</Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 min-h-0 gap-3 md:gap-4 px-3 md:px-5 py-3">
          {/* Left widgets */}
          <aside className="jarvis-left-widgets hidden lg:flex flex-col gap-3 w-52 xl:w-56 shrink-0 min-h-0 overflow-y-auto">
            <WidgetCard title="System Stats">
              <JarvisHudStatBar label="Leads today" value={liveData?.leadsToday} max={10} />
              <JarvisHudStatBar label="Tasks queued" value={liveData?.tasksQueued} max={20} />
              <JarvisHudStatBar label="Active clients" value={activeClients} max={10} />
            </WidgetCard>
            <WidgetCard title="Session">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="jarvis-mini-stat"><p className="jarvis-mini-stat-val">{displayMessages.filter((m) => m.role === 'user').length}</p><p className="jarvis-mini-stat-lbl">Commands</p></div>
                <div className="jarvis-mini-stat"><p className="jarvis-mini-stat-val">1</p><p className="jarvis-mini-stat-lbl">Session</p></div>
              </div>
            </WidgetCard>
            <WidgetCard title="System Uptime">
              <p className="jarvis-uptime tabular-nums">{uptime}</p>
              <div className="mt-3">
                <div className="flex justify-between text-[9px] uppercase tracking-wider text-sky-500/60 mb-1"><span>System load</span><span>{loadPct}%</span></div>
                <div className="jarvis-stat-bar h-1 w-full bg-sky-900/80 rounded-full overflow-hidden">
                  <div className="jarvis-stat-bar-fill h-full bg-gradient-to-r from-cyan-600 to-emerald-400" style={{ width: `${loadPct}%` }} />
                </div>
              </div>
              {bootLine && bootTyped && <p className="text-[9px] text-sky-500/55 mt-3 leading-relaxed border-t border-sky-500/10 pt-2">{bootLine}</p>}
            </WidgetCard>
          </aside>

          {/* Center stage */}
          <div className="jarvis-center-stage relative flex flex-1 flex-col items-center min-w-0 min-h-0">
            <div className="relative flex flex-1 w-full items-center justify-center min-h-0">
              <JarvisHudRings active={hudActive} listening={coreState === 'listening'} className="jarvis-hud-rings-stage absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10 flex flex-col items-center justify-center">
                <JarvisVoiceCore size="lg" state={coreState} label={bootTyped && bootLine ? undefined : undefined} />
                {(listening || voiceInterim) && (
                  <div className="jarvis-interim-display mt-3 max-w-sm w-full px-4 py-2 text-center">
                    <p className="text-sm text-cyan-50/90 font-light">{voiceInterim || 'Speak now, sir…'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom center dock — reference mic / keyboard */}
            <div className="jarvis-center-dock shrink-0 flex items-center justify-center gap-3 pb-2 pt-2">
              <button type="button" className="jarvis-dock-btn opacity-40 cursor-not-allowed" title="Camera (coming soon)" disabled aria-label="Camera">📷</button>
              <button
                type="button"
                onClick={toggleMic}
                className={`jarvis-dock-btn jarvis-dock-btn--mic ${listening ? 'jarvis-dock-btn--active' : ''}`}
                aria-label={listening ? 'Pause microphone' : 'Start microphone'}
              >
                🎤
              </button>
              <button type="button" onClick={() => inputRef.current?.focus()} className="jarvis-dock-btn" aria-label="Focus text input">⌨</button>
            </div>
          </div>

          {/* Conversation panel — reference right sidebar */}
          <aside className="jarvis-convo-panel hidden md:flex flex-col w-[19rem] lg:w-[26rem] xl:w-[28rem] shrink-0 min-h-0 rounded-xl border border-sky-500/15 bg-slate-950/50 backdrop-blur-md overflow-hidden">
            <div className="jarvis-convo-header flex items-center justify-between gap-2 px-4 py-3 border-b border-sky-500/10 shrink-0">
              <p className="jarvis-widget-title mb-0">Conversation</p>
              <div className="flex gap-1.5">
                <button type="button" onClick={clearComms} className="jarvis-convo-header-btn">Clear</button>
              </div>
            </div>
            <div
              className="jarvis-comms-feed flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0"
              onScroll={(e) => {
                const el = e.currentTarget;
                userScrolledUpRef.current = el.scrollHeight - el.scrollTop - el.clientHeight >= 48;
              }}
            >
              {displayMessages.length === 0 ? (
                <p className="text-sky-400/70 text-xs leading-relaxed">Hello, I am JARVIS. How can I assist you today, sir?</p>
              ) : (
                displayMessages.map((m) => (
                  <CommsMessage key={m.id} m={m} streaming={streaming} pendingAction={pendingAction} executeAction={executeAction} cancelAction={cancelAction} />
                ))
              )}
              <div ref={messagesEndRef} className="h-px" aria-hidden />
            </div>
            {(voiceError || voicePlatformHint) && (
              <p className="px-4 py-1 text-[10px] text-amber-200/80 text-center shrink-0">{voiceError || voicePlatformHint}</p>
            )}
            <form onSubmit={handleSubmit} className="jarvis-convo-input shrink-0 flex items-center gap-2 px-3 py-3 border-t border-sky-500/10">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
                placeholder="Type a message…"
                className="jarvis-convo-input-field flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-sky-50 placeholder:text-sky-600/50"
              />
              {streaming ? (
                <button type="button" onClick={stopGeneration} className="jarvis-convo-send">■</button>
              ) : speaking ? (
                <button type="button" onClick={stopSpeakingReply} className="jarvis-convo-send">■</button>
              ) : (
                <button type="submit" disabled={!input.trim()} className="jarvis-convo-send disabled:opacity-30" aria-label="Send">➤</button>
              )}
            </form>
          </aside>
        </div>

        {/* Mobile: conversation + input */}
        <div className="md:hidden shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] space-y-2">
          <div className="jarvis-mobile-comms max-h-36 overflow-y-auto space-y-2 text-xs">
            {displayMessages.slice(-3).map((m) => (
              <CommsMessage key={m.id} m={m} streaming={streaming} pendingAction={pendingAction} executeAction={executeAction} cancelAction={cancelAction} />
            ))}
          </div>
          <form onSubmit={handleSubmit} className="jarvis-convo-input flex items-center gap-2 px-3 py-2 rounded-lg border border-sky-500/15">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message…" className="flex-1 bg-transparent border-0 outline-none text-sm text-sky-50" />
            <button type="submit" disabled={!input.trim()} className="jarvis-convo-send">➤</button>
          </form>
        </div>
      </div>
    </JarvisHudFrame>
  );
}
