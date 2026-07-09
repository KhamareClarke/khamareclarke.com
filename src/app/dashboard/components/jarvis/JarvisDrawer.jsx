'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogPanel } from '@headlessui/react';
import { TypeAnimation } from 'react-type-animation';
import { useJarvis } from './JarvisProvider';
import { useFocusTrap } from './useFocusTrap';

function StatusPill({ status }) {
  const colors = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    paused: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    completed: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40',
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors[status] || colors.active}`}>
      {status || 'active'}
    </span>
  );
}

function MessageCard({ card }) {
  const router = useRouter();

  if (card.type === 'help') {
    return (
      <div className="mt-2 rounded-lg border border-[#ffb700]/25 bg-[#121212] p-3 text-xs">
        <p className="font-bold text-[#ffb700] mb-2">{card.title}</p>
        {card.sections?.map((s) => (
          <div key={s.label} className="mb-2">
            <p className="text-[#888] uppercase tracking-wide text-[10px] mb-1">{s.label}</p>
            <ul className="space-y-0.5 text-[#ccc]">
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
        className="mt-2 w-full text-left rounded-lg border border-[#333] bg-[#121212] p-2.5 hover:border-[#ffb700]/40 transition"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-white text-xs">{card.name}</span>
          <StatusPill status={card.status} />
        </div>
        {card.company && <p className="text-[10px] text-[#888] mt-0.5">{card.company}</p>}
        <p className="text-[10px] text-[#666] mt-1">{card.projectCount} project(s)</p>
      </button>
    );
  }

  if (card.type === 'lead') {
    return (
      <div className="mt-2 rounded-lg border border-[#333] bg-[#121212] p-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-white text-xs">{card.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffb700]/15 text-[#ffb700] border border-[#ffb700]/30">
            {card.source}
          </span>
        </div>
        <p className="text-[10px] text-[#666] mt-1">{card.date?.slice(0, 10)}</p>
      </div>
    );
  }

  if (card.type === 'report') {
    return (
      <button
        type="button"
        onClick={() => router.push('/dashboard/clients')}
        className="mt-2 w-full text-left rounded-lg border border-[#ffb700]/25 bg-[#ffb700]/5 p-2.5 hover:bg-[#ffb700]/10 transition"
      >
        <p className="text-xs text-[#ffb700] font-medium">Report event — {card.projectId}</p>
        <p className="text-[10px] text-[#888] mt-0.5">{card.message || card.eventType}</p>
      </button>
    );
  }

  return null;
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
    startListening,
    speechSupported,
    voiceAutoSend,
    setVoiceAutoSend,
  } = useJarvis();
  const [input, setInput] = useState('');
  const trapRef = useFocusTrap(open);

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
    if (!speechSupported || listening) return;
    startListening((transcript) => setInput((prev) => (prev ? `${prev} ${transcript}` : transcript)));
  };

  return (
    <Dialog open={open} onClose={close} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              ref={trapRef}
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex h-full flex-col bg-[#0a0a0a] border-l border-[#ffb700]/20 shadow-2xl jarvis-drawer">
                <header className="flex items-center justify-between px-4 py-3 border-b border-[#222]">
                  <div>
                    <h2 className="text-lg font-bold text-[#ffb700] tracking-wide">JARVIS</h2>
                    <p className="text-xs text-[#ADB7BE]">Operations intelligence</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMuted((m) => !m)}
                      className="text-xs px-2 py-1 rounded border border-[#333] text-[#ADB7BE] hover:text-white"
                      aria-label={muted ? 'Unmute voice' : 'Mute voice'}
                    >
                      {muted ? '🔇' : '🔊'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresentationMode((p) => !p)}
                      className={`text-xs px-2 py-1 rounded border ${presentationMode ? 'border-[#ffb700] text-[#ffb700]' : 'border-[#333] text-[#ADB7BE]'} hover:text-white`}
                    >
                      Demo
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className="text-[#ADB7BE] hover:text-white px-2 py-1 rounded hover:bg-[#222] text-sm"
                      aria-label="Close JARVIS"
                    >
                      Esc
                    </button>
                  </div>
                </header>

                <div
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
                    userScrolledUpRef.current = !atBottom;
                  }}
                >
                  {messages.length === 0 && (
                    <p className="text-sm text-[#ADB7BE]">
                      Ask about leads, clients, tasks, or fleet status. Type <strong>help</strong> for commands.
                    </p>
                  )}
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-[90%]">
                        <div
                          className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                            m.role === 'user'
                              ? 'bg-[#ffb700]/15 text-white border border-[#ffb700]/30'
                              : m.system
                                ? 'bg-[#1a1a2e] text-[#9ab] border border-[#334] italic'
                                : 'bg-[#1a1a1a] text-[#e5e5e5] border border-[#333]'
                          }`}
                        >
                          {m.content || (streaming && m.role === 'assistant' ? '…' : '')}
                        </div>
                        {m.cards?.map((card, i) => (
                          <MessageCard key={`${m.id}-card-${i}`} card={card} />
                        ))}
                        {m.confirm && pendingAction?.command === m.confirm.command && (
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => executeAction(m.confirm)}
                              className="flex-1 text-xs py-2 rounded-lg bg-[#ffb700] text-[#0a0a0a] font-bold"
                            >
                              Execute
                            </button>
                            <button
                              type="button"
                              onClick={cancelAction}
                              className="flex-1 text-xs py-2 rounded-lg border border-[#555] text-[#ADB7BE]"
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

                <form onSubmit={handleSubmit} className="border-t border-[#222] p-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    disabled={streaming}
                    rows={2}
                    placeholder="Message JARVIS… (Enter send, Shift+Enter newline)"
                    className="w-full resize-none rounded-lg bg-[#121212] border border-[#333] text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb700]/50 disabled:opacity-50"
                    aria-label="Message JARVIS"
                  />
                  <div className="flex justify-between mt-2 gap-2 items-center">
                    <div className="flex items-center gap-2">
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={handleMic}
                          className={`text-xs px-2 py-1.5 rounded border ${
                            listening
                              ? 'border-[#ffb700] text-[#ffb700] jarvis-mic-active'
                              : 'border-[#666] text-[#ADB7BE]'
                          }`}
                          aria-label="Voice input"
                        >
                          🎤
                        </button>
                      )}
                      {streaming ? (
                        <button
                          type="button"
                          onClick={stopGeneration}
                          className="text-xs px-3 py-1.5 rounded border border-[#666] text-[#ADB7BE] hover:text-white"
                        >
                          Stop
                        </button>
                      ) : (
                        <span className="text-xs text-[#666]">⌘J · ⌘K</span>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={streaming || !input.trim()}
                      className="px-4 py-1.5 rounded-lg bg-[#ffb700] text-[#0a0a0a] text-sm font-bold disabled:opacity-40"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
