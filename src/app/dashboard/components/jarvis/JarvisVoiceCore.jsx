'use client';

/**
 * Central voice orb — arc reactor style. size="lg" for full-page HUD.
 */
const STATE_LABELS = {
  listening: 'Listening',
  thinking: 'Processing',
  searching: 'Searching',
  opening: 'Opening',
  drawing: 'Generating',
  speaking: 'Speaking',
  clap: 'Activated',
  idle: 'Online',
};

export default function JarvisVoiceCore({ state = 'idle', label, size = 'md' }) {
  const isListening = state === 'listening' || state === 'clap';
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';
  const isSearching = state === 'searching';
  const isDrawing = state === 'drawing';
  // Searching/drawing share the spinner treatment with thinking.
  const showSpinner = isThinking || isSearching || isDrawing;
  const lg = size === 'lg';

  return (
    <div className={`jarvis-voice-core flex flex-col items-center ${lg ? 'py-0' : 'py-6'}`}>
      <div
        className={`relative flex items-center justify-center ${
          lg ? 'w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72' : 'w-36 h-36'
        }`}
      >
        <span
          className={`jarvis-arc-reactor-glow absolute rounded-full ${
            lg ? 'inset-4' : 'inset-2'
          } ${hudActiveClass(state)}`}
          aria-hidden
        />
        {isListening && (
          <>
            <span className="jarvis-ring jarvis-ring-1 absolute inset-0 rounded-full border border-sky-400/50" />
            <span className="jarvis-ring jarvis-ring-2 absolute inset-0 rounded-full border border-cyan-400/40" />
            <span className="jarvis-ring jarvis-ring-3 absolute inset-0 rounded-full border border-sky-300/30" />
            <span className="jarvis-ring jarvis-ring-1 absolute inset-[-12px] rounded-full border border-cyan-300/20" />
          </>
        )}
        {showSpinner && (
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
          className={`jarvis-core-orb relative z-10 rounded-full ${
            lg ? 'w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40' : 'w-20 h-20'
          } ${coreOrbClass(state)}`}
        >
          <div className="jarvis-core-inner absolute inset-2 rounded-full" />
          <div className="jarvis-core-triangle absolute inset-0 m-auto w-0 h-0 opacity-40" aria-hidden />
        </div>
        {isSpeaking && (
          <div className="jarvis-wave-bars absolute -bottom-1 flex gap-1 items-end h-6" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="jarvis-wave-bar w-1 rounded-full bg-cyan-400/80" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
      </div>
      <p
        className={`mt-3 font-medium tracking-[0.25em] uppercase text-sky-300/90 ${
          lg ? 'text-sm' : 'text-xs'
        }`}
      >
        {label || STATE_LABELS[state] || 'Online'}
      </p>
    </div>
  );
}

function hudActiveClass(state) {
  switch (state) {
    case 'listening':
      return 'jarvis-reactor-listening';
    case 'thinking':
      return 'jarvis-reactor-thinking';
    case 'searching':
      return 'jarvis-reactor-searching';
    case 'opening':
      return 'jarvis-reactor-opening';
    case 'drawing':
      return 'jarvis-reactor-drawing';
    case 'speaking':
      return 'jarvis-reactor-speaking';
    case 'clap':
      return 'jarvis-reactor-clap';
    default:
      return 'jarvis-reactor-idle';
  }
}

function coreOrbClass(state) {
  switch (state) {
    case 'speaking':
      return 'jarvis-core-speaking';
    case 'listening':
      return 'jarvis-core-listening';
    case 'searching':
      return 'jarvis-core-searching';
    case 'opening':
      return 'jarvis-core-opening';
    case 'drawing':
      return 'jarvis-core-drawing';
    case 'thinking':
      return 'jarvis-core-listening';
    case 'clap':
      return 'jarvis-core-clap';
    default:
      return 'jarvis-core-idle';
  }
}
