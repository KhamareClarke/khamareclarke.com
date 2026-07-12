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
import JarvisTopbarStatus from './JarvisTopbarStatus';
import JarvisWeather from './JarvisWeather';
import JarvisDataPanels from './JarvisDataPanels';

/* ─── Utilities ──────────────────────────────────────────────────────────── */

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
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '00')}`;
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

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function StatusDot({ label, online }) {
  return (
    <div className={`jarvis-status-dot ${online ? 'jarvis-status-dot--online' : ''}`}>
      <span className="jarvis-status-dot-indicator" />
      <span>{label}</span>
    </div>
  );
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
        <p className="text-[9px] uppercase tracking-wider text-[#ffb700]/70 mb-2">Live search · {card.query}</p>
        <ul className="space-y-2">
          {(card.results || []).slice(0, 5).map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[#ffd54f] hover:text-[#fff8e1] font-medium line-clamp-1">
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
      <a href={card.url} target="_blank" rel="noopener noreferrer" className="jarvis-card jarvis-card-link mt-2 block p-3 text-xs text-center text-[#ffd54f]">
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
      <button type="button" onClick={() => router.push(`/dashboard/clients/${card.id}`)} className="jarvis-card mt-2 w-full text-left p-2.5 text-xs text-[#fff8e1]">
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
        {isUser ? m.content : m.content ? (
          <JarvisMessageContent content={m.content} />
        ) : streaming ? (
          <span className="jarvis-typing-indicator" aria-label="JARVIS is thinking">
            <span className="jarvis-typing-dot" />
            <span className="jarvis-typing-dot" style={{ animationDelay: '0.22s' }} />
            <span className="jarvis-typing-dot" style={{ animationDelay: '0.44s' }} />
          </span>
        ) : ''}
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

/* ─── Main HUD ───────────────────────────────────────────────────────────── */

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
    voiceNeedsTap,
    hearLastReply,
    lastReplyText,
    clapWake,
    setClapWake,
    clapActivated,
    voiceSessionActive,
    setPresentationMode,
  } = useJarvis();

  const [input, setInput] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [localStats, setLocalStats] = useState({ formCount: null, onboardingCount: null });
  const [emptyGreeting, setEmptyGreeting] = useState('Hello, I am JARVIS. How can I assist you today, sir?');
  const inputRef = useRef(null);
  const mobileCommsRef = useRef(null);
  const sessionStartRef = useRef(Date.now());
  const [, tickUptime] = useState(0);
  const now = useLiveClock();

  useEffect(() => {
    setOpen(true);
    const id = setInterval(() => tickUptime((t) => t + 1), 1000);
    return () => {
      clearInterval(id);
      setOpen(false);
    };
  }, [setOpen]);

  useEffect(() => {
    const key = 'jarvis-greeted';
    if (sessionStorage.getItem(key)) {
      setEmptyGreeting('Standing by, sir.');
    } else {
      sessionStorage.setItem(key, '1');
    }
  }, []);

  /* Fetch real counts for left rail */
  useEffect(() => {
    Promise.all([
      fetch('/api/submissions', { credentials: 'include', cache: 'no-store' }).then((r) => r.json()).catch(() => ({})),
      fetch('/api/onboarding',  { credentials: 'include', cache: 'no-store' }).then((r) => r.json()).catch(() => ({})),
    ]).then(([subs, onb]) => {
      const subsArr = Array.isArray(subs) ? subs : (subs?.submissions ?? subs?.data ?? []);
      const onbArr  = Array.isArray(onb)  ? onb  : (onb?.clients  ?? onb?.data  ?? []);
      setLocalStats({ formCount: subsArr.length, onboardingCount: onbArr.length });
    });
  }, []);

  const coreState = activity || 'idle';
  const hudActive = coreState !== 'idle' || listening;
  const displayMessages = useMemo(() => dedupeMessages(messages).slice(-30), [messages]);
  const timeStr = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const mobileTimeStr = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const dateStr = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const uptime = formatUptime(Date.now() - sessionStartRef.current);
  const loadPct = Math.min(100, Math.round(((liveData?.tasksQueued || 0) / 20) * 100));
  /* Show — during fetch; once both resolve, show the real sum */
  const totalLeads =
    localStats.formCount !== null && localStats.onboardingCount !== null
      ? localStats.formCount + localStats.onboardingCount
      : null;

  useEffect(() => {
    if (!mobileCommsRef.current) return;
    mobileCommsRef.current.scrollTop = mobileCommsRef.current.scrollHeight;
  }, [displayMessages, streaming, speaking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    if (isMobileVoice) unlockAndPrimeAudio();
    setInput('');
    sendMessage(text);
  };

  const toggleMic = async () => {
    if (listening) { stopListening(); return; }
    if (speaking) await stopSpeakingReply();
    await unlockAndPrimeAudio();
  };

  return (
    <JarvisHudFrame>
      <div
        className="jarvis-fullpage jarvis-cockpit jarvis-ref-ui relative flex h-full flex-col overflow-hidden"
        data-activity={coreState}
      >
        {isMobileVoice && !audioUnlocked && (
          <button
            type="button"
            onClick={() => unlockAndPrimeAudio()}
            className="jarvis-audio-unlock fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-[#080600]/92 backdrop-blur-sm border-0 cursor-pointer"
          >
            <span className="text-4xl">🔊</span>
            <span className="text-[#ffd54f] text-sm font-light tracking-[0.25em] uppercase">Tap to enable JARVIS voice</span>
            <span className="text-[#ffb700]/70 text-xs max-w-xs text-center px-6">Turn off silent mode. After each reply, tap 🔊 Hear to listen on mobile.</span>
          </button>
        )}

        <JarvisAmbient />

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <header className="jarvis-topbar relative z-30 shrink-0 flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-[#ffb700]/10">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`jarvis-online-dot ${hudActive || listening ? 'jarvis-online-dot-live' : ''}`} aria-hidden />
            <span className="jarvis-topbar-brand truncate">J.A.R.V.I.S</span>
            <span className="jarvis-topbar-status hidden sm:inline">
              {!voiceSessionActive
                ? 'Standing by'
                : activity === 'listening'
                  ? 'Listening…'
                  : activity === 'speaking'
                    ? 'Speaking…'
                    : activity === 'thinking'
                      ? 'Thinking…'
                      : 'Ready'}
            </span>
            <span className="md:hidden text-[10px] text-[#ffb700]/70 tabular-nums">{mobileTimeStr}</span>
          </div>

          {/* Clock — center */}
          <div className="jarvis-topbar-clock hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#ffb700]/15 bg-[#1a0800]/40">
            <span className="tabular-nums text-[#fff8e1]/95 text-sm">{timeStr}</span>
            <span className="text-[#ffb700]/50">|</span>
            <span className="text-[#ffb700]/80 text-xs">{dateStr}</span>
          </div>

          {/* Right cluster: weather + status + settings */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <JarvisWeather />
            </div>
            <JarvisTopbarStatus />
            <div className="relative">
              <button type="button" onClick={() => setSettingsOpen((o) => !o)} className="jarvis-dock-btn" aria-label="Settings">⚙</button>
              {settingsOpen && (
                <div className="jarvis-settings-menu absolute right-0 top-full mt-2 z-50 min-w-[10rem] p-2 rounded-lg border border-[#ffb700]/20 bg-[#080600]/95 shadow-xl">
                  <button type="button" onClick={() => setMuted((m) => !m)} className="jarvis-settings-item w-full text-left">{muted ? 'Unmute voice' : 'Mute voice'}</button>
                  <button type="button" onClick={() => setClapWake((c) => !c)} className="jarvis-settings-item w-full text-left">Clap wake {clapWake ? 'on' : 'off'}</button>
                  <button type="button" onClick={() => setPresentationMode((p) => !p)} className="jarvis-settings-item w-full text-left">Presentation</button>
                  <Link href="/dashboard/leads" className="jarvis-settings-item block">Exit JARVIS</Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-1 min-h-0 gap-3 md:gap-4 px-3 md:px-5 py-3">

          {/* Left stats rail */}
          <aside className="jarvis-left-widgets hidden lg:flex flex-col gap-3 w-52 xl:w-56 shrink-0 min-h-0 overflow-y-auto">
            <WidgetCard title="Operations">
              <JarvisHudStatBar label="Form submissions" value={localStats.formCount}       max={25} />
              <JarvisHudStatBar label="Onboarding"       value={localStats.onboardingCount} max={40} />
              <JarvisHudStatBar label="Total leads"      value={totalLeads ?? liveData?.leadsToday} max={60} />
              <JarvisHudStatBar label="Tasks queued"     value={liveData?.tasksQueued}      max={20} />
            </WidgetCard>
            <WidgetCard title="Session">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="jarvis-mini-stat">
                  <p className="jarvis-mini-stat-val">{displayMessages.filter((m) => m.role === 'user').length}</p>
                  <p className="jarvis-mini-stat-lbl">Commands</p>
                </div>
                <div className="jarvis-mini-stat">
                  <p className="jarvis-mini-stat-val">{liveData?.clients?.length ?? '—'}</p>
                  <p className="jarvis-mini-stat-lbl">Clients</p>
                </div>
              </div>
            </WidgetCard>
            <WidgetCard title="System Uptime">
              <p className="jarvis-uptime tabular-nums">{uptime}</p>
              <div className="mt-3">
                <div className="flex justify-between text-[9px] uppercase tracking-wider text-[#ffb700]/60 mb-1">
                  <span>System load</span>
                  <span>{loadPct}%</span>
                </div>
                <div className="jarvis-stat-bar h-1 w-full bg-[#1a0800]/80 rounded-full overflow-hidden">
                  <div className="jarvis-stat-bar-fill h-full bg-gradient-to-r from-[#ff8c00] to-[#ffb700]" style={{ width: `${loadPct}%` }} />
                </div>
              </div>
              {bootLine && bootTyped && (
                <p className="text-[9px] text-[#ffb700]/55 mt-3 leading-relaxed border-t border-[#ffb700]/10 pt-2">{bootLine}</p>
              )}
            </WidgetCard>
          </aside>

          {/* ── Centre stage ─────────────────────────────────────────── */}
          <div className="jarvis-center-stage relative flex flex-1 flex-col items-center min-w-0 min-h-0 gap-0">

            {/* Orb + rings in a co-centered assembly */}
            <div className="flex flex-1 w-full items-center justify-center min-h-0 overflow-hidden">
              <div className="jarvis-orb-assembly">
                {/* Rings fill the assembly exactly — always co-centered with orb */}
                <JarvisHudRings
                  active={hudActive}
                  listening={coreState === 'listening'}
                  className="absolute inset-0 w-full h-full"
                />
                {/* Orb centred via flex on the assembly */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <JarvisVoiceCore size="lg" state={coreState} />
                  {(listening || voiceInterim) && (
                    <div className="mt-3 max-w-[16rem] w-full px-4 py-2 rounded-xl bg-[#0a0600]/70 border border-[#ffb700]/15 text-center">
                      <p className="text-sm text-[#fff8e1]/90 font-light">{voiceInterim || 'Speak now, sir…'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile stats strip — left rail hidden on < lg screens */}
            <div className="lg:hidden jarvis-mobile-stat-strip">
              {[
                { label: 'Forms',       value: localStats.formCount },
                { label: 'Onboarding',  value: localStats.onboardingCount },
                { label: 'Leads',       value: totalLeads ?? liveData?.leadsToday },
                { label: 'Tasks',       value: liveData?.tasksQueued },
              ].map(({ label, value }) => (
                <div key={label} className="jarvis-mobile-stat-chip">
                  <span className="jarvis-mobile-stat-val">{value ?? '—'}</span>
                  <span className="jarvis-mobile-stat-lbl">{label}</span>
                </div>
              ))}
            </div>

            {/* Data panels — slide up from bottom of centre stage */}
            {activePanel && (
              <JarvisDataPanels activeTab={activePanel} onTabChange={setActivePanel} />
            )}

            {/* Bottom dock */}
            <div className="jarvis-center-dock shrink-0 flex flex-col items-center gap-2 pb-2 pt-2 w-full">
              {/* Panel shortcut tabs */}
              <div className="jarvis-dock-tab-bar">
                {[
                  { id: 'leads',    icon: '📊', label: 'Leads'     },
                  { id: 'clients',  icon: '👥', label: 'Clients'   },
                  { id: 'empire',   icon: '⚡', label: 'Empire'    },
                  { id: 'activity', icon: '📡', label: 'All projects'  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActivePanel((p) => p === t.id ? null : t.id)}
                    className={`jarvis-dock-tab ${activePanel === t.id ? 'jarvis-dock-tab--active' : ''}`}
                  >
                    <span aria-hidden>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Mic / keyboard controls */}
              <div className="flex items-center justify-center gap-3">
                <button type="button" className="jarvis-dock-btn opacity-40 cursor-not-allowed" title="Camera (coming soon)" disabled aria-label="Camera">📷</button>
                {isMobileVoice && (voiceNeedsTap || lastReplyText) && !speaking && !streaming && (
                  <button
                    type="button"
                    onClick={() => hearLastReply()}
                    className={`jarvis-dock-btn jarvis-dock-btn--hear ${voiceNeedsTap ? 'jarvis-dock-btn--hear-pulse' : ''}`}
                    aria-label="Hear JARVIS reply"
                  >
                    🔊
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`jarvis-dock-btn jarvis-dock-btn--mic ${listening ? 'jarvis-dock-btn--active' : speaking ? 'jarvis-dock-btn--speaking' : ''}`}
                  aria-label={listening ? 'Pause microphone' : speaking ? 'Interrupt and speak' : 'Start microphone'}
                >
                  🎤
                </button>
                <button type="button" onClick={() => inputRef.current?.focus()} className="jarvis-dock-btn" aria-label="Focus text input">⌨</button>
              </div>
            </div>
          </div>

          {/* ── Right conversation panel ──────────────────────────────── */}
          <aside className="jarvis-convo-panel hidden md:flex flex-col w-[19rem] lg:w-[26rem] xl:w-[28rem] shrink-0 min-h-0 rounded-xl border border-[#ffb700]/15 bg-[#080600]/50 backdrop-blur-md overflow-hidden">
            <div className="jarvis-convo-header flex items-center justify-between gap-2 px-4 py-3 border-b border-[#ffb700]/10 shrink-0">
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
                <p className="text-[#ffb700]/70 text-xs leading-relaxed">{emptyGreeting}</p>
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
            <form onSubmit={handleSubmit} className="jarvis-convo-input shrink-0 flex items-center gap-2 px-3 py-3 border-t border-[#ffb700]/10">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={streaming}
                placeholder="Type a message…"
                className="jarvis-convo-input-field flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-[#fff8e1] placeholder:text-[#ffb700]/40"
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

        {/* ── Mobile: conversation + input ──────────────────────────────── */}
        <div className="md:hidden shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] space-y-2">
          {(speaking || streaming || listening) && (
            <p className="text-center text-[10px] uppercase tracking-widest text-[#ffb700]/80">
              {speaking ? 'JARVIS speaking…' : streaming ? 'Thinking…' : 'Listening…'}
            </p>
          )}
          <div ref={mobileCommsRef} className="jarvis-mobile-comms max-h-48 overflow-y-auto space-y-2 text-xs">
            {displayMessages.length === 0 ? (
              <p className="text-[#ffb700]/70">Tap 🔊 above if you have not enabled voice yet.</p>
            ) : (
              displayMessages.slice(-5).map((m) => (
                <CommsMessage key={m.id} m={m} streaming={streaming} pendingAction={pendingAction} executeAction={executeAction} cancelAction={cancelAction} />
              ))
            )}
          </div>
          <form onSubmit={handleSubmit} className="jarvis-convo-input flex items-center gap-2 px-3 py-2 rounded-lg border border-[#ffb700]/15">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => isMobileVoice && unlockAndPrimeAudio()}
              placeholder="Type a message…"
              className="flex-1 bg-transparent border-0 outline-none text-sm text-[#fff8e1]"
            />
            {streaming ? (
              <button type="button" onClick={stopGeneration} className="jarvis-convo-send">■</button>
            ) : speaking ? (
              <button type="button" onClick={stopSpeakingReply} className="jarvis-convo-send">■</button>
            ) : (
              <button type="submit" disabled={!input.trim()} className="jarvis-convo-send disabled:opacity-30">➤</button>
            )}
          </form>
          {(voiceError || voicePlatformHint) && (
            <p className="text-[10px] text-amber-200/80 text-center">{voiceError || voicePlatformHint}</p>
          )}
          {isMobileVoice && voiceNeedsTap && !speaking && (
            <button
              type="button"
              onClick={() => hearLastReply()}
              className="w-full py-2.5 rounded-lg border border-amber-400/40 bg-amber-950/40 text-amber-100 text-xs uppercase tracking-widest"
            >
              🔊 Tap to hear JARVIS
            </button>
          )}
        </div>
      </div>
    </JarvisHudFrame>
  );
}
