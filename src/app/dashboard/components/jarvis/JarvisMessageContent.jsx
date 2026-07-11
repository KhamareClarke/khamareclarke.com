'use client';

/** Strip markdown for previews / speech. */
export function stripJarvisMarkdown(text) {
  return String(text || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^\s*[\*\-•]\s+/gm, '')
    .replace(/\*/g, '')
    .trim();
}

/**
 * Renders JARVIS text without ugly raw markdown asterisks.
 * Converts **bold** and * / - bullets into clean HUD typography.
 */
export default function JarvisMessageContent({ content, className = '' }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className={`jarvis-message-content space-y-1.5 ${className}`}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" aria-hidden />;

        const bulletMatch = trimmed.match(/^[*\-•]\s+(.*)$/);
        if (bulletMatch) {
          return (
            <div key={i} className="flex gap-2 items-start pl-1">
              <span className="text-cyan-400/80 shrink-0 mt-0.5 text-[10px]" aria-hidden>
                ▸
              </span>
              <span className="flex-1 min-w-0">{renderInline(bulletMatch[1])}</span>
            </div>
          );
        }

        return (
          <p key={i} className="leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text) {
  const parts = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let match;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(
        <span key={key++}>{text.slice(last, match.index).replace(/\*/g, '')}</span>
      );
    }
    parts.push(
      <strong key={key++} className="font-medium text-cyan-200/95">
        {match[1]}
      </strong>
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(<span key={key++}>{text.slice(last).replace(/\*/g, '')}</span>);
  }

  if (parts.length === 0) {
    return <span>{text.replace(/\*/g, '')}</span>;
  }

  return parts;
}
