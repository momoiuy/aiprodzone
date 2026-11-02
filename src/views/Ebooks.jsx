'use client';

import { ArrowLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';

// Props: { activeEbook: object | null, setActiveEbook: (eb: object | null) => void, onSelectCategory: (cat: string) => void }
export default function Ebooks({ activeEbook, setActiveEbook, onSelectCategory }) {
  const { ebooks } = useLibrary();

  const sortedEbooks = [...(ebooks || [])].sort(
    (a, b) => (a.sectionOrder || 0) - (b.sectionOrder || 0)
  );

  return (
    <div className="space-y-6 animate-smooth">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <Chip tone="accent">مكتبة AIProdZone الرقمية الشاملة لعام 2026</Chip>
          <h1 className="text-xl sm:text-3xl font-extrabold text-text-heading">
            الكتب الإلكترونية والأدلة التطبيقية المرافقة للأقسام الـ 10
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            دليل إلكتروني ومرجع شامل مرافق لكل مسار تعليمي يغطي القوالب والأوامر وأفضل الممارسات.
          </p>
        </div>
      </div>

      {activeEbook ? (
        <Card className="p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setActiveEbook(null)} className="px-2 py-1">
              <ArrowLeft className="w-4 h-4 text-text-muted" />
              <span>العودة إلى جميع الكتب والأدلة الـ 10</span>
            </Button>
            {activeEbook.category && (
              <Button
                variant="primary"
                onClick={() => onSelectCategory(activeEbook.category)}
                className="text-xs py-1.5 px-3"
              >
                <span>مشاهدة شروحات قسم: {activeEbook.category}</span>
              </Button>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="accent">{activeEbook.tag || `كتاب القسم #${activeEbook.sectionOrder}`}</Chip>
              {activeEbook.category && <Chip tone="neutral">{activeEbook.category}</Chip>}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-text-heading">
              {activeEbook.title}
            </h2>
            <p className="text-xs text-text-muted">
              إعداد: {activeEbook.author} • {activeEbook.pages} • {activeEbook.date}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-2 border border-border">
            <h3 className="text-xs font-bold text-accent mb-1.5">نبذة موجزة عن الكتاب:</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-text-muted">{activeEbook.excerpt}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-text-heading flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>فصول ومحتوى الدليل التطبيقي:</span>
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-text whitespace-pre-line">
              {activeEbook.content}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedEbooks.map((eb) => (
            <Card
              key={eb.id}
              as="article"
              interactive
              onClick={() => setActiveEbook(eb)}
              className="group p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Chip tone="accent">{eb.tag || `كتاب القسم #${eb.sectionOrder}`}</Chip>
                  <span className="text-[11px] font-bold text-text-muted">{eb.pages}</span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold leading-snug text-text-heading group-hover:text-accent transition-colors">
                  {eb.title}
                </h2>
                <p className="text-xs leading-relaxed text-text-muted line-clamp-3">{eb.excerpt}</p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-muted">{eb.readTime}</span>
                <span className="font-extrabold inline-flex items-center gap-1 text-text-heading group-hover:text-accent transition-colors">
                  <span>قراءة الدليل</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
