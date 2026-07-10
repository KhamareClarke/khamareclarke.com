'use client';

/**
 * Central voice orb — arc reactor style. size="lg" for full-page HUD.
 */
const STATE_LABELS = {
  listening: 'J.A.R.V.I.S',
  thinking: 'J.A.R.V.I.S',
  searching: 'J.A.R.V.I.S',
  opening: 'J.A.R.V.I.S',
  drawing: 'J.A.R.V.I.S',
  speaking: 'J.A.R.V.I.S',
  clap: 'J.A.R.V.I.S',
  idle: 'J.A.R.V.I.S',
};

const STATE_SUBLABELS = {
  listening: 'Listening for wake word…',
  speaking: 'Transmitting response…',
  thinking: 'Processing request…',
  searching: 'Searching the web…',
  opening: 'Opening destination…',
  drawing: 'Generating image…',
  idle: 'Standing by',
};

function CoreDots({ active, count = 5 }) {
  return (
    <div className="jarvis-core-dots absolute inset-0 flex items-center justify-center gap-2 sm:gap-2.5 z-20 pointer-events-none" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`jarvis-core-dot ${active ? 'jarvis-core-dot--live' : ''}`}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

export default function JarvisVoiceCore({ state = 'idle', label, size = 'md' }) {
  const isListening = state === 'listening' || state === 'clap';
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';
  const isSearching = state === 'searching';
  const isDrawing = state === 'drawing';
  const showSpinner = isThinking || isSearching || isDrawing;
  const showDots = isListening || isSpeaking || state === 'idle';
  const lg = size === 'lg';

  return (
    <div
      className={`jarvis-voice-core flex flex-col items-center ${lg ? 'py-0' : 'py-6'} ${
        isListening ? 'jarvis-voice-core--listening' : ''
      }`}
    >
      <div
        className={`jarvis-voice-core-stage relative flex items-center justify-center ${
          lg
            ? isListening
              ? 'w-64 h-64 sm:w-72 sm:h-72 md:w-[22rem] md:h-[22rem]'
              : 'w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72'
            : 'w-36 h-36'
        }`}
      >
        {isListening && (
          <>
            <span className="jarvis-listen-aura jarvis-listen-aura-1 absolute inset-[-8%] rounded-full" aria-hidden />
            <span className="jarvis-listen-aura jarvis-listen-aura-2 absolute inset-[-18%] rounded-full" aria-hidden />
            <span className="jarvis-listen-scan absolute inset-2 rounded-full" aria-hidden />
          </>
        )}

        <span
          className={`jarvis-arc-reactor-glow absolute rounded-full inset-2 ${hudActiveClass(state)}`}
          aria-hidden
        />

        {isListening && (
          <>
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-1 absolute inset-0 rounded-full" />
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-2 absolute inset-0 rounded-full" />
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-3 absolute inset-0 rounded-full" />
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-1 absolute inset-[-16px] rounded-full" />
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-2 absolute inset-[-28px] rounded-full opacity-60" />
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
          className={`jarvis-core-orb relative z-10 rounded-full overflow-hidden ${
            lg
              ? isListening
                ? 'w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48'
                : 'w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44'
              : 'w-20 h-20'
          } ${coreOrbClass(state)}`}
        >
          <div className="jarvis-core-inner absolute inset-0 rounded-full" />
          <div className="jarvis-core-shine absolute inset-0 rounded-full" aria-hidden />
          {showDots ? <CoreDots active={isListening || isSpeaking} /> : null}
        </div>
      </div>

      <p
        className={`jarvis-core-title mt-5 font-bold tracking-[0.28em] uppercase ${
          isListening || state !== 'idle' ? 'jarvis-core-title--listening' : 'text-sky-300/90'
        } ${lg ? 'text-base md:text-lg' : 'text-xs'}`}
      >
        {label || STATE_LABELS[state] || 'J.A.R.V.I.S'}
      </p>

      {!label && STATE_SUBLABELS[state] && (
        <div className="jarvis-listen-pill mt-3">
          <span className="jarvis-listen-pill-dot" aria-hidden />
          <span>{STATE_SUBLABELS[state]}</span>
        </div>
      )}
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
