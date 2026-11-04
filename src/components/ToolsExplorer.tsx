'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Table as TableIcon,
  LayoutGrid,
  Terminal,
  Star,
  Sparkles,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { CURATED_AI_TOOLS } from '../data/tools';

export default function ToolsExplorer({ initialTools = CURATED_AI_TOOLS }: { initialTools?: typeof CURATED_AI_TOOLS }) {
  const [displayView, setDisplayView] = useState<'table' | 'cards'>('table');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCommand = (id: string, cmd: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cmd).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }).catch(() => {});
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* شريط أدوات التبديل بين الجدول والبطاقات */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-border/80">
        <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
          <span>طريقة العرض:</span>
          <div className="flex items-center p-1 rounded-xl bg-surface-2 border border-border">
            <button
              type="button"
              onClick={() => setDisplayView('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                displayView === 'table'
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>جدول المقارنة</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayView('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                displayView === 'cards'
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>شبكة البطاقات</span>
            </button>
          </div>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl text-xs font-extrabold bg-accent/15 text-accent-ink dark:text-accent hover:bg-accent hover:text-accent-ink transition-colors flex items-center gap-1.5 border border-accent/30"
        >
          <span>تصفح مسارات الشروحات ذات الصلة</span>
          <span>←</span>
        </Link>
      </div>

      {/* عرض جدول المقارنة */}
      {displayView === 'table' ? (
        <div className="w-full overflow-x-auto rounded-3xl border border-border bg-surface shadow-sm">
          {/* مؤشر الهاتف للتمرير الأفقي */}
          <div className="sm:hidden flex items-center justify-between px-4 py-2.5 bg-accent/10 border-b border-border text-xs text-teal-700 dark:text-teal-400 font-bold">
            <span>⟵ مرر أفقياً للاطلاع على كامل معايير المقارنة</span>
            <span className="font-mono text-[11px]">{initialTools.length} أدوات</span>
          </div>

          <table className="w-full text-right text-xs sm:text-sm border-collapse">
            <thead className="bg-surface-2 border-b border-border text-text-heading font-extrabold">
              <tr>
                <th className="p-4 whitespace-nowrap">الأداة الذكية</th>
                <th className="p-4 whitespace-nowrap">التصنيف المنهجي</th>
                <th className="p-4 whitespace-nowrap">التقييم</th>
                <th className="p-4 whitespace-nowrap">نموذج التسعير</th>
                <th className="p-4 whitespace-nowrap min-w-[240px]">أبرز المهام والاستخدامات</th>
                <th className="p-4 whitespace-nowrap min-w-[260px]">أمر التشغيل البرمجي (CLI)</th>
                <th className="p-4 whitespace-nowrap">الرابط الرسمي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {initialTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-surface-2/40 transition-colors">
                  <td className="p-4 font-black text-text-heading whitespace-nowrap">
                    {tool.name}
                  </td>
                  <td className="p-4 text-text-muted whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-[11px] font-bold">
                      {tool.category}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{tool.rating}</span>
                    </span>
                  </td>
                  <td className="p-4 text-text whitespace-nowrap font-medium">
                    {tool.pricing}
                  </td>
                  <td className="p-4 text-text-muted leading-relaxed max-w-sm">
                    {tool.description}
                  </td>
                  <td className="p-4">
                    {tool.command ? (
                      <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950 dark:bg-black/80 border border-border/80 font-mono text-[11px] text-emerald-400 group max-w-xs">
                        <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
                        <code dir="ltr" className="truncate flex-1 text-left select-all">
                          {tool.command}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyCommand(tool.id, tool.command)}
                          className="p-1 rounded text-text-muted hover:text-white transition-colors shrink-0"
                          title="نسخ الأمر"
                        >
                          {copiedId === tool.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-border text-xs font-bold text-text hover:text-accent hover:border-accent transition-colors"
                    >
                      <span>زيارة الموقع</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* عرض شبكة البطاقات */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {initialTools.map((tool) => (
            <article
              key={tool.id}
              className="rounded-3xl bg-surface border border-border p-5 space-y-4 flex flex-col justify-between hover:border-accent hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent-ink dark:text-accent text-xs font-bold">
                    {tool.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-bold text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{tool.rating}</span>
                  </span>
                </div>

                <h3 className="text-lg font-black text-text-heading">
                  {tool.name}
                </h3>

                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {tool.description}
                </p>

                <div className="text-xs text-text font-bold">
                  <span className="text-text-muted font-normal">التسعير: </span>
                  <span>{tool.pricing}</span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border/80">
                {tool.command && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950 dark:bg-black/80 border border-border/80 font-mono text-[11px] text-emerald-400">
                    <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
                    <code dir="ltr" className="truncate flex-1 text-left select-all">
                      {tool.command}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyCommand(tool.id, tool.command)}
                      className="p-1 rounded text-text-muted hover:text-white transition-colors shrink-0"
                      title="نسخ الأمر"
                    >
                      {copiedId === tool.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}

                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-surface-2 border border-border text-xs font-bold text-text hover:text-accent hover:border-accent transition-colors flex items-center justify-center gap-2"
                >
                  <span>الرابط الرسمي للأداة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
