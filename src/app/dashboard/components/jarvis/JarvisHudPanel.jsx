'use client';

/** Tactical side readout panel. */
export default function JarvisHudPanel({ title, children, align = 'left' }) {
  return (
    <aside
      className={`jarvis-hud-panel hidden lg:flex flex-col gap-3 w-44 xl:w-52 shrink-0 ${
        align === 'right' ? 'items-end text-right' : 'items-start text-left'
      }`}
    >
      <p className="jarvis-hud-panel-title text-[10px] tracking-[0.35em] uppercase text-cyan-400/70">
        {title}
      </p>
      <div className="jarvis-hud-panel-body w-full space-y-2 text-[11px] text-sky-300/80 font-mono">
        {children}
      </div>
    </aside>
  );
}
