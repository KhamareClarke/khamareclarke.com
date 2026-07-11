'use client';

/**
 * Central voice orb — refined arc-reactor core. size="lg" for full-page HUD.
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
    <div className="jarvis-core-dots absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 z-20 pointer-events-none" aria-hidden>
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
      className={`jarvis-voice-core flex w-full flex-col items-center text-center ${
        lg ? 'py-0' : 'py-6'
      } ${isListening ? 'jarvis-voice-core--listening' : ''}`}
    >
      <div
        className={`jarvis-voice-core-stage relative mx-auto flex items-center justify-center ${
          lg
            ? isListening
              ? 'w-52 h-52 sm:w-56 sm:h-56 md:w-60 md:h-60'
              : 'w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56'
            : 'w-32 h-32'
        }`}
      >
        {isListening && (
          <>
            <span className="jarvis-listen-aura jarvis-listen-aura-1 absolute inset-[-6%] rounded-full" aria-hidden />
            <span className="jarvis-listen-aura jarvis-listen-aura-2 absolute inset-[-14%] rounded-full" aria-hidden />
            <span className="jarvis-listen-scan absolute inset-3 rounded-full" aria-hidden />
          </>
        )}

        <span
          className={`jarvis-arc-reactor-glow absolute rounded-full inset-3 ${hudActiveClass(state)}`}
          aria-hidden
        />

        {isListening && (
          <>
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-1 absolute inset-0 rounded-full" />
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-2 absolute inset-0 rounded-full" />
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-3 absolute inset-0 rounded-full" />
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-1 absolute inset-[-12px] rounded-full" />
            <span className="jarvis-ring jarvis-ring-listen jarvis-ring-2 absolute inset-[-20px] rounded-full opacity-50" />
          </>
        )}

        {showSpinner && (
          <svg className="jarvis-arc-spinner absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="1.5" />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#jarvisArcGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="48 232"
            />
            <defs>
              <linearGradient id="jarvisArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--jarvis-sky)" />
                <stop offset="100%" stopColor="var(--jarvis-cyan)" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Outer precision ring */}
        <span className="jarvis-core-ring absolute inset-[18%] rounded-full z-[5]" aria-hidden />

        <div
          className={`jarvis-core-orb relative z-10 rounded-full overflow-hidden ${
            lg
              ? isListening
                ? 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36'
                : 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32'
              : 'w-16 h-16'
          } ${coreOrbClass(state)}`}
        >
          <div className="jarvis-core-inner absolute inset-0 rounded-full" />
          <div className="jarvis-core-shine absolute inset-0 rounded-full" aria-hidden />
          {showDots ? <CoreDots active={isListening || isSpeaking} /> : null}
        </div>
      </div>

      <p
        className={`jarvis-core-title mt-4 w-full text-center font-bold tracking-[0.24em] uppercase ${
          isListening || state !== 'idle' ? 'jarvis-core-title--listening' : ''
        } ${lg ? 'text-sm md:text-base' : 'text-xs'}`}
      >
        {label || STATE_LABELS[state] || 'J.A.R.V.I.S'}
      </p>

      {!label && STATE_SUBLABELS[state] && (
        <div className="jarvis-listen-pill mt-2.5 mx-auto">
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
