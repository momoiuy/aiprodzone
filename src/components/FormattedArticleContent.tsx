import React from 'react';

export interface FormattedArticleContentProps {
  content?: string;
  className?: string;
}

/**
 * مكون منسق للنصوص والأكواد البرمجية داخل المقالات
 * متوافق 100% مع Server-Side Rendering (SSG) ومعايير GEO وSEO
 */
export default function FormattedArticleContent({ content, className = '' }: FormattedArticleContentProps) {
  if (!content) return null;

  if (content.includes('```')) {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
      <div className={`space-y-3 ${className}`}>
        {parts.map((part, pIdx) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const raw = part.slice(3, -3);
            const firstLineBreak = raw.indexOf('\n');
            const lang = firstLineBreak > 0 ? raw.slice(0, firstLineBreak).trim() : '';
            const code = firstLineBreak > 0 ? raw.slice(firstLineBreak + 1) : raw;

            return (
              <div
                key={pIdx}
                className="w-full overflow-x-auto rounded-xl border border-border/80 bg-slate-950 dark:bg-black/90 p-3.5 my-3 shadow-inner"
              >
                {lang && (
                  <div className="text-[10px] font-mono text-emerald-400/80 mb-1.5 uppercase select-none font-bold" dir="ltr">
                    # {lang}
                  </div>
                )}
                <pre dir="ltr" className="text-left overflow-x-auto font-mono text-xs text-emerald-400">
                  <code dir="ltr" className="text-left font-mono block leading-relaxed whitespace-pre">
                    {code.trim()}
                  </code>
                </pre>
              </div>
            );
          }
          return (
            <p
              key={pIdx}
              dir="rtl"
              className="text-sm sm:text-base text-text leading-loose font-normal whitespace-pre-line [unicode-bidi:plaintext] text-right"
            >
              {part}
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <p
      dir="rtl"
      className={`text-sm sm:text-base text-text leading-loose font-normal whitespace-pre-line [unicode-bidi:plaintext] text-right ${className}`}
    >
      {content}
    </p>
  );
}
