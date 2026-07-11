'use client';

const CHIPS = [
  { label: 'Status', cmd: 'status' },
  { label: 'Briefing', cmd: 'briefing' },
  { label: 'Gold price', cmd: 'search gold price today' },
  { label: 'Open YouTube', cmd: 'open youtube' },
  { label: 'Help', cmd: 'help' },
];

export default function JarvisCommandChips({ onSelect, disabled }) {
  return (
    <div className="jarvis-command-chips flex flex-wrap justify-center gap-2 max-w-lg px-2">
      {CHIPS.map(({ label, cmd }) => (
        <button
          key={cmd}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(cmd)}
          className="jarvis-chip px-3 py-1.5 text-[10px] uppercase tracking-wider text-cyan-300/90 border border-cyan-500/25 bg-cyan-950/30 hover:bg-cyan-500/15 hover:border-cyan-400/50 transition disabled:opacity-40 touch-manipulation"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
