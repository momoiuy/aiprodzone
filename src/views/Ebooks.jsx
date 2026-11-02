'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Download,
  ExternalLink,
  Sparkles,
  Cloud,
  FileText,
  HardDrive
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';

// مكون غلاف الكتاب الذكي (Zero Load): بديل جمالي CSS دائم في الخلفية وصورة سحابية ناعمة
function EbookCover({ ebook, size = 'card' }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasRemoteCover = Boolean(ebook.remoteCoverUrl) && !imageError;

  const isDetail = size === 'detail';
  const containerHeight = isDetail ? 'h-56 sm:h-72 w-full max-w-sm mx-auto' : 'h-44 w-full';

  return (
    <div
      className={`relative ${containerHeight} rounded-xl overflow-hidden border border-border bg-surface-2 flex flex-col justify-between p-4 group-hover:border-accent/40 transition-colors shrink-0`}
    >
      {/* غلاف افتراضي فاخر (CSS Gradient) بصفر بايت وصفر استهلاك دائم الوجود كخلفية */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-surface-2 to-surface-1 flex flex-col justify-between p-4 pointer-events-none select-none">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold tracking-wider text-accent uppercase">
            {ebook.provider || 'AIProdZone Library'}
          </span>
          <BookOpen className="w-4 h-4 text-accent/70" />
        </div>

        <div className="space-y-1" dir="rtl">
          <div className="w-8 h-1 rounded-full bg-accent/40" />
          <p className="text-xs font-extrabold text-text-heading line-clamp-2 leading-snug">
            {ebook.title}
          </p>
          <p className="text-[11px] text-text-muted line-clamp-1">{ebook.category}</p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-text-muted border-t border-border/50 pt-2" dir="rtl">
          <span>{ebook.pages}</span>
          <span className="text-accent font-bold">{ebook.isCloudBook ? 'سحابي مباشر' : 'دليل حصري'}</span>
        </div>
      </div>

      {/* في حال وجود صورة سحابية عن بُعد - تظهر بسلاسة عند اكتمال الجلب */}
      {hasRemoteCover && (
        <img
          src={ebook.remoteCoverUrl}
          alt={ebook.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* شارة التخزين السحابي العائمة */}
      {ebook.provider && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-0/90 text-text-heading backdrop-blur-md border border-border shadow-sm">
            <Cloud className="w-3 h-3 text-accent" />
            <span>{ebook.provider}</span>
          </span>
        </div>
      )}
    </div>
  );
}

// Props: { activeEbook: object | null, setActiveEbook: (eb: object | null) => void, onSelectCategory: (cat: string) => void }
export default function Ebooks({ activeEbook, setActiveEbook, onSelectCategory }) {
  const { ebooks = [] } = useLibrary();
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'tracks' | 'cloud'

  const sortedEbooks = [...ebooks].sort(
    (a, b) => (a.sectionOrder || 0) - (b.sectionOrder || 0)
  );

  const trackGuides = sortedEbooks.filter((eb) => !eb.isCloudBook);
  const cloudBooks = sortedEbooks.filter((eb) => Boolean(eb.isCloudBook));

  const filteredEbooks =
    filterMode === 'tracks'
      ? trackGuides
      : filterMode === 'cloud'
      ? cloudBooks
      : sortedEbooks;

  return (
    <div className="space-y-6 animate-smooth">
      {/* الترويسة الرئيسية والكبسولات */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="accent">مكتبة AIProdZone الرقمية والسحابية 2026</Chip>
            <span className="text-xs text-text-muted font-bold font-mono">
              ({sortedEbooks.length} مادة رقمية معتمدة)
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-text-heading">
            الكتب الإلكترونية والأدلة التطبيقية والمكتبة السحابية
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-3xl">
            أدلة تطبيقية مرافقة لمسارات الذكاء الاصطناعي الـ 10، بالإضافة إلى حقائب وكتب سحابية مع روابط تحميل مباشر بصفر حمل على الخادم.
          </p>
        </div>

        {/* فلاتر التبويب السريع */}
        {!activeEbook && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-2 border border-border self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                filterMode === 'all'
                  ? 'bg-accent text-surface-0 shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              الكل ({sortedEbooks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('tracks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                filterMode === 'tracks'
                  ? 'bg-accent text-surface-0 shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              أدلة المسارات الـ 10 ({trackGuides.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('cloud')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                filterMode === 'cloud'
                  ? 'bg-accent text-surface-0 shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>المكتبة السحابية ({cloudBooks.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* عرض تفاصيل الكتاب النشط */}
      {activeEbook ? (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => setActiveEbook(null)} className="px-2 py-1">
              <ArrowLeft className="w-4 h-4 text-text-muted" />
              <span>العودة إلى قائمة الكتب والأدلة ({sortedEbooks.length})</span>
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

          {/* صندوق التحميل السحابي البارز في حال وجود رابط مباشر */}
          {activeEbook.downloadUrl && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-accent/15 via-surface-2 to-surface-1 border border-accent/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-bold text-accent">رابط التحميل السحابي المباشر متاح مجاناً</span>
                  <Chip tone="accent">{activeEbook.provider || 'سيرفر خارجي'}</Chip>
                  {activeEbook.fileType && (
                    <span className="text-xs text-text-muted font-mono">({activeEbook.fileType})</span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-text-muted">
                  تحميل فوري مباشر وسريع عبر {activeEbook.provider} بصفر إعلانات وبصفر استهلاك لموارد المنصة.
                </p>
              </div>

              <a
                href={activeEbook.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-surface-0 font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-accent/25 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الكتاب الآن</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          )}

          {/* تفاصيل الكتاب الأساسية والغلاف */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-border">
            <div className="md:col-span-1">
              <EbookCover ebook={activeEbook} size="detail" />
              <div className="mt-3 p-3.5 rounded-xl bg-surface-2 border border-border text-xs space-y-2" dir="rtl">
                <div className="flex items-center justify-between text-text-muted">
                  <span>المؤلف / المصدر:</span>
                  <span className="font-bold text-text-heading">{activeEbook.author}</span>
                </div>
                <div className="flex items-center justify-between text-text-muted">
                  <span>عدد الصفحات / الحجم:</span>
                  <span className="font-bold text-text-heading">{activeEbook.pages}</span>
                </div>
                <div className="flex items-center justify-between text-text-muted">
                  <span>تاريخ الإصدار:</span>
                  <span className="font-bold text-text-heading">{activeEbook.date}</span>
                </div>
                {activeEbook.provider && (
                  <div className="flex items-center justify-between text-text-muted">
                    <span>جهة الاستضافة السحابية:</span>
                    <span className="font-bold text-accent">{activeEbook.provider}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="accent">
                    {activeEbook.tag || `كتاب القسم #${activeEbook.sectionOrder}`}
                  </Chip>
                  {activeEbook.category && <Chip tone="neutral">{activeEbook.category}</Chip>}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-text-heading leading-snug">
                  {activeEbook.title}
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-surface-2 border border-border" dir="rtl">
                <h3 className="text-xs font-bold text-accent mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>نبذة موجزة عن المحتوى:</span>
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-text-muted">
                  {activeEbook.excerpt}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-extrabold text-text-heading flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span>فصول ومحتوى المادة الرقمية:</span>
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-text whitespace-pre-line bg-surface-1 p-4 rounded-xl border border-border" dir="rtl">
                  {activeEbook.content}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* شبكة عرض الكتب */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEbooks.map((eb) => (
            <Card
              key={eb.id}
              as="article"
              interactive
              onClick={() => setActiveEbook(eb)}
              className="group p-4 flex flex-col justify-between space-y-3.5 hover:border-accent/40"
            >
              {/* غلاف الكتاب */}
              <EbookCover ebook={eb} size="card" />

              <div className="space-y-2" dir="rtl">
                <div className="flex items-center justify-between">
                  <Chip tone="accent">{eb.tag || `دليل القسم #${eb.sectionOrder}`}</Chip>
                  <span className="text-[11px] font-bold text-text-muted">{eb.pages}</span>
                </div>
                <h2 className="text-sm sm:text-base font-extrabold leading-snug text-text-heading group-hover:text-accent transition-colors line-clamp-2">
                  {eb.title}
                </h2>
                <p className="text-xs leading-relaxed text-text-muted line-clamp-2">{eb.excerpt}</p>
              </div>

              {/* تذييل البطاقة مع زر التحميل المباشر وزر التفاصيل */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs gap-2">
                {eb.downloadUrl ? (
                  <>
                    <a
                      href={eb.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 hover:bg-accent hover:text-surface-0 text-accent font-bold transition-all text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل مباشر</span>
                    </a>
                    <span className="font-extrabold inline-flex items-center gap-1 text-text-heading group-hover:text-accent transition-colors">
                      <span>التفاصيل</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-text-muted text-[11px]">{eb.readTime}</span>
                    <span className="font-extrabold inline-flex items-center gap-1 text-text-heading group-hover:text-accent transition-colors">
                      <span>قراءة الدليل</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                    </span>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
