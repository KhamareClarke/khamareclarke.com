'use client';

/** Tactical side readout panel — glass HUD module. */
export default function JarvisHudPanel({ title, children, align = 'left', className = '' }) {
  return (
    <aside
      className={`jarvis-hud-panel jarvis-hud-module hidden md:flex flex-col gap-3 w-full md:w-48 lg:w-56 xl:w-60 shrink-0 min-h-0 max-h-full ${className} ${
        align === 'right' ? 'items-end text-right' : 'items-start text-left'
      } ${className}`}
    >
      <div className="jarvis-hud-module-header w-full flex items-center gap-2">
        <span className="jarvis-hud-module-dot" aria-hidden />
        <p className="jarvis-hud-panel-title flex-1 text-[10px] tracking-[0.35em] uppercase text-cyan-400/80">
          {title}
        </p>
      </div>
      <div className="jarvis-hud-panel-body w-full space-y-2.5 text-[11px] text-sky-300/85 font-mono min-h-0 overflow-y-auto">
        {children}
      </div>
    </aside>
  );
}
