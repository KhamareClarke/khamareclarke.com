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
  listening: 'Listening…',
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
  const showDots = isListening || isSpeaking;
  const lg = size === 'lg';

  return (
    <div
      className={`jarvis-voice-core flex flex-col items-center ${lg ? 'py-0 relative' : 'py-6'} jarvis-voice-core--${state}`}
    >
      <div
        className={`jarvis-voice-core-stage relative flex items-center justify-center ${
          lg
            ? 'w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56'
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
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,183,0,0.15)" strokeWidth="2" />
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
                <stop offset="0%" stopColor="#ff8c00" />
                <stop offset="100%" stopColor="#ffb700" />
              </linearGradient>
            </defs>
          </svg>
        )}

        <div
          className={`jarvis-core-orb relative z-10 rounded-full overflow-hidden ${
            lg
              ? 'w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40'
              : 'w-20 h-20'
          } ${coreOrbClass(state)}`}
        >
          <div className="jarvis-core-inner absolute inset-0 rounded-full" />
          {/* Precision intelligence rings — thin SVG arcs give instrument-grade depth */}
          <svg className="jarvis-core-precision absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" aria-hidden>
            <defs>
              <linearGradient id="jvcPrimaryArc" gradientTransform="rotate(45,0.5,0.5)">
                <stop offset="0%"   stopColor="rgba(255,140,0,0)" />
                <stop offset="45%"  stopColor="rgba(255,183,0,0.48)" />
                <stop offset="60%"  stopColor="rgba(255,220,100,0.55)" />
                <stop offset="100%" stopColor="rgba(255,140,0,0)" />
              </linearGradient>
            </defs>
            {/* Outermost boundary ring */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,183,0,0.14)" strokeWidth="0.4" />
            {/* Primary rotating arc */}
            <circle cx="50" cy="50" r="41" fill="none" stroke="url(#jvcPrimaryArc)" strokeWidth="0.9" strokeLinecap="round" strokeDasharray="22 108" className="jarvis-core-arc-primary" />
            {/* Counter-rotating detail arc */}
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,183,0,0.18)" strokeWidth="0.55" strokeLinecap="round" strokeDasharray="10 70" className="jarvis-core-arc-counter" />
            {/* Inner fine dashed ring */}
            <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(255,183,0,0.08)" strokeWidth="0.35" strokeDasharray="4 8" />
            {/* Center energy point */}
            <circle cx="50" cy="50" r="3" fill="rgba(255,183,0,0.30)" className="jarvis-core-center-dot" />
            <circle cx="50" cy="50" r="1.4" fill="rgba(255,220,120,0.55)" />
          </svg>
          <div className="jarvis-core-shine absolute inset-0 rounded-full" aria-hidden />
          {showDots ? <CoreDots active={isListening || isSpeaking} /> : null}
        </div>
      </div>

      {/* When lg, position text absolutely so it doesn't affect flex centering (orb stays ring-centered) */}
      <p
        className={`jarvis-core-title font-bold tracking-[0.28em] uppercase ${
          isListening || state !== 'idle' ? 'jarvis-core-title--listening' : 'text-[#ffca28]/90'
        } ${
          lg
            ? 'absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm md:text-base'
            : 'mt-5 text-xs'
        }`}
        style={lg ? { top: 'calc(100% + 1rem)' } : {}}
      >
        {label || STATE_LABELS[state] || 'J.A.R.V.I.S'}
      </p>

      {!label && STATE_SUBLABELS[state] && (
        <div
          className={`jarvis-listen-pill ${lg ? 'absolute left-1/2 -translate-x-1/2' : 'mt-3'}`}
          style={lg ? { top: 'calc(100% + 2.8rem)' } : {}}
        >
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
