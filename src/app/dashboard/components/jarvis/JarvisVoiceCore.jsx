'use client';

/**
 * Central voice orb — listening rings, thinking arcs, speaking pulse.
 */
export default function JarvisVoiceCore({ state = 'idle', label }) {
  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';

  return (
    <div className="jarvis-voice-core flex flex-col items-center py-6">
      <div className="relative flex items-center justify-center w-36 h-36">
        {isListening && (
          <>
            <span className="jarvis-ring jarvis-ring-1 absolute inset-0 rounded-full border border-sky-400/50" />
            <span className="jarvis-ring jarvis-ring-2 absolute inset-0 rounded-full border border-cyan-400/40" />
            <span className="jarvis-ring jarvis-ring-3 absolute inset-0 rounded-full border border-sky-300/30" />
          </>
        )}
        {isThinking && (
          <svg className="jarvis-arc-spinner absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="2" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#jarvisArcGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="60 220"
            />
            <defs>
              <linearGradient id="jarvisArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
        )}
        <div
          className={`jarvis-core-orb relative z-10 w-20 h-20 rounded-full ${
            isSpeaking ? 'jarvis-core-speaking' : isListening ? 'jarvis-core-listening' : 'jarvis-core-idle'
          }`}
        >
          <div className="jarvis-core-inner absolute inset-2 rounded-full" />
        </div>
        {isSpeaking && (
          <div className="jarvis-wave-bars absolute -bottom-1 flex gap-1 items-end h-6" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="jarvis-wave-bar w-1 rounded-full bg-cyan-400/80" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>
      <p className="mt-3 text-xs font-medium tracking-[0.2em] uppercase text-sky-300/90">
        {label || (isListening ? 'Listening' : isThinking ? 'Processing' : isSpeaking ? 'Speaking' : 'Online')}
      </p>
    </div>
  );
}
