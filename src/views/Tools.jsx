'use client';

import { useState } from 'react';
import { ExternalLink, Table as TableIcon, LayoutGrid, Terminal, Star, Sparkles } from 'lucide-react';
import { CURATED_AI_TOOLS } from '../data/tools';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';

// Props: { onSelectCategory: (cat: string) => void }
export default function Tools({ onSelectCategory }) {
  const [displayView, setDisplayView] = useState('table'); // 'table' | 'cards'

  return (
    <div className="space-y-6 animate-smooth" dir="rtl">
      {/* 1. الترويسة والأزرار الإرشادية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Chip tone="accent">دليل أدوات AIProdZone الموصى بها</Chip>
            <span className="text-xs font-mono font-bold text-text-muted">
              ({CURATED_AI_TOOLS.length} أدوات معتمدة 2026)
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-text-heading">
            مقارنة أفضل أدوات الذكاء الاصطناعي والبرمجة وصناعة الفيديو
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-3xl">
            جدول تحليلي مهيكل لمقارنة النماذج والأدوات الرائدة في السوق مع روابطها الرسمية وأوامر التشغيل البرمجية المباشرة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          {/* أزرار التبديل بين جدول المقارنة وشبكة البطاقات */}
          <div className="flex items-center p-1 rounded-2xl bg-surface-2 border border-border">
            <button
              type="button"
              onClick={() => setDisplayView('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                displayView === 'table'
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
              title="عرض جدول المقارنة الشامل"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>جدول المقارنة</span>
            </button>

            <button
              type="button"
              onClick={() => setDisplayView('cards')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                displayView === 'cards'
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
              title="عرض شبكة البطاقات"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>البطاقات</span>
            </button>
          </div>

          <Button
            variant="primary"
            onClick={() => onSelectCategory('أدوات')}
            className="px-4 py-2 self-start sm:self-auto text-xs font-extrabold"
          >
            عرض شروحات الفيديو للأدوات
          </Button>
        </div>
      </div>

      {/* 2. جدول مقارنة الأدوات الذكية الشامل (Curated AI Tools Comparison Matrix) */}
      {displayView === 'table' ? (
        <div className="space-y-2">
          <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
            {/* مؤشر التمرير الأفقي الناعم على الهاتف حتى لا تتسبب الجداول العريضة في كسر عرض شاشة الهاتف */}
            <div className="sm:hidden flex items-center justify-between px-3.5 py-2 bg-accent/10 border-b border-border/60 text-[11px] text-teal-700 dark:text-teal-400 font-bold select-none">
              <span>⟵ اسحب أفقياً لتصفح كامل جدول المقارنة</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 font-mono">
                {CURATED_AI_TOOLS.length} أدوات ذكية
              </span>
            </div>

            <table className="w-full text-right text-xs border-collapse">
              <thead className="bg-surface-2 border-b border-border text-text-heading font-extrabold">
                <tr>
                  <th className="p-3.5 whitespace-nowrap">الأداة الذكية</th>
                  <th className="p-3.5 whitespace-nowrap">التصنيف المنهجي</th>
                  <th className="p-3.5 whitespace-nowrap">التقييم</th>
                  <th className="p-3.5 whitespace-nowrap">نموذج التسعير</th>
                  <th className="p-3.5 whitespace-nowrap min-w-[220px]">أبرز المهام والاستخدامات</th>
                  <th className="p-3.5 whitespace-nowrap min-w-[240px]">أمر التشغيل / التثبيت البرمجي (CLI)</th>
                  <th className="p-3.5 whitespace-nowrap">الرابط الرسمي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-surface">
                {CURATED_AI_TOOLS.map((tool) => (
                  <tr
                    key={tool.id}
                    className="hover:bg-accent/5 transition-colors odd:bg-surface even:bg-surface-2/40"
                  >
                    {/* اسم الأداة */}
                    <td className="p-3.5 font-black text-text-heading whitespace-nowrap text-right" dir="rtl">
                      <div className="flex items-center gap-1.5 justify-start">
                        <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span dir="ltr" className="font-extrabold [unicode-bidi:plaintext]">
                          {tool.name}
                        </span>
                      </div>
                    </td>

                    {/* التصنيف المنهجي */}
                    <td className="p-3.5 text-text-muted whitespace-nowrap">
                      <Chip tone="neutral">{tool.category}</Chip>
                    </td>

                    {/* التقييم الأكاديمي */}
                    <td className="p-3.5 whitespace-nowrap font-mono font-bold text-teal-700 dark:text-teal-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current text-accent" />
                        <span>{tool.rating} / 10</span>
                      </div>
                    </td>

                    {/* نموذج التسعير */}
                    <td className="p-3.5 whitespace-nowrap font-bold text-text-muted">
                      {tool.pricing}
                    </td>

                    {/* الاستخدامات والمهام */}
                    <td className="p-3.5 leading-relaxed text-text max-w-sm">
                      {tool.description}
                    </td>

                    {/* كود وأمر التشغيل البرمجي السريع معزول تماماً بـ dir="ltr" text-left */}
                    <td className="p-3.5">
                      {tool.command ? (
                        <div className="w-full overflow-x-auto rounded-lg border border-border/80 bg-slate-950 dark:bg-black/90 p-2 shadow-inner">
                          <pre dir="ltr" className="text-left overflow-x-auto font-mono text-[11px] text-emerald-400">
                            <code dir="ltr" className="text-left font-mono block whitespace-pre">
                              {tool.command}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <span className="text-[11px] text-text-muted font-mono">-</span>
                      )}
                    </td>

                    {/* الرابط الخارجي */}
                    <td className="p-3.5 whitespace-nowrap">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl font-extrabold inline-flex items-center gap-1.5 bg-surface-2 text-text border border-border hover:border-accent hover:text-text-heading transition-colors"
                      >
                        <span>زيارة الموقع</span>
                        <ExternalLink className="w-3.5 h-3.5 text-accent" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 3. شبكة بطاقات الأدوات المنسقة */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURATED_AI_TOOLS.map((t) => (
            <Card
              key={t.id}
              interactive
              className="p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Chip tone="neutral">{t.category}</Chip>
                  <Chip tone="accent">★ {t.rating} / 10</Chip>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-text-heading" dir="ltr">
                  {t.name}
                </h3>

                <p className="text-xs leading-relaxed text-text-muted">{t.description}</p>

                {/* أمر التشغيل السريع داخل البطاقة */}
                {t.command && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-text-muted flex items-center gap-1" dir="rtl">
                      <Terminal className="w-3 h-3 text-accent" />
                      <span>أمر الاستخدام السريع (CLI):</span>
                    </span>
                    <div className="w-full overflow-x-auto rounded-lg border border-border/80 bg-slate-950 dark:bg-black/90 p-2 shadow-inner">
                      <pre dir="ltr" className="text-left overflow-x-auto font-mono text-[11px] text-emerald-400">
                        <code dir="ltr" className="text-left font-mono block whitespace-pre">
                          {t.command}
                        </code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="font-bold text-text-muted">{t.pricing}</span>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold inline-flex items-center gap-1 text-text-heading hover:text-accent transition-colors"
                >
                  <span>زيارة الموقع الرسمي</span>
                  <ExternalLink className="w-3.5 h-3.5 text-accent" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
