'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
  GraduationCap,
  Terminal,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { BIMO_CATEGORIES } from '../data/bimo-catalog';
import { EBOOK_GUIDES } from '../data/ebooks';

const ITEMS_PER_PAGE = 24;

interface EbookItem {
  id: string;
  title: string;
  category: string;
  categoryName?: string;
  provider?: string;
  isCloudBook?: boolean;
  remoteCoverUrl?: string;
  downloadUrl?: string;
  pages?: string;
  size?: string;
  description?: string;
  fileType?: string;
  [key: string]: any;
}

export default function BooksExplorer({ initialBooks = EBOOK_GUIDES }: { initialBooks?: EbookItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeEbook, setActiveEbook] = useState<EbookItem | null>(null);

  // تصنيف الكتب
  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      // فلتر التصنيف
      if (selectedCategory === 'tracks') {
        if (book.isCloudBook) return false;
      } else if (selectedCategory !== 'all') {
        if (book.category !== selectedCategory) return false;
      }

      // فلتر البحث
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (book.title || '').toLowerCase().includes(q);
        const matchCategory = (book.categoryName || book.category || '').toLowerCase().includes(q);
        const matchProvider = (book.provider || '').toLowerCase().includes(q);
        const matchDesc = (book.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCategory && !matchProvider && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [initialBooks, selectedCategory, searchQuery]);

  // تقسيم الصفحات
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* شريط البحث وتصنيفات الأقسام السريعة */}
      <div className="space-y-4 bg-surface p-4 sm:p-6 rounded-3xl border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ابحث في عناوين الكتب والتقنيات..."
              className="w-full h-11 text-xs sm:text-sm rounded-2xl pr-10 pl-9 bg-surface-2 text-text placeholder:text-text-muted border border-border focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-heading"
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
            <span className="px-3 py-1.5 rounded-xl bg-surface-2 border border-border">
              إجمالي النتائج: <span className="text-accent font-black">{filteredBooks.length}</span> من {initialBooks.length}
            </span>
          </div>
        </div>

        {/* فئات التصنيف (BIMO_CATEGORIES) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
          {BIMO_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-accent text-accent-ink border-accent shadow-sm font-black'
                    : 'bg-surface-2 text-text-muted border-border hover:border-accent/60 hover:text-text-heading'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70 font-mono">({cat.nameEn})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* شبكة الكتب الـ 114 */}
      {paginatedBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {paginatedBooks.map((ebook) => (
            <article
              key={ebook.id}
              onClick={() => setActiveEbook(ebook)}
              className="group cursor-pointer rounded-2xl bg-surface border border-border/80 hover:border-accent hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden p-2.5 sm:p-3 justify-between"
            >
              {/* غلاف هندسي بنمط Zero-Load مع دعم الصور السحابية الناعمة */}
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gradient-to-br from-accent/15 via-surface-2 to-surface-1 border border-border/70 flex flex-col justify-between p-3 select-none">
                <div className="flex items-center justify-between text-[9px] font-mono text-accent font-bold">
                  <span className="truncate max-w-[80px]">{ebook.provider || 'AIProdZone'}</span>
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                </div>

                <div className="space-y-1">
                  <div className="w-6 h-0.5 rounded-full bg-accent/40" />
                  <p className="text-[11px] sm:text-xs font-extrabold text-text-heading line-clamp-3 leading-snug">
                    {ebook.title}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[9px] text-text-muted border-t border-border/50 pt-1.5">
                  <span className="truncate max-w-[60px]">{ebook.pages || 'دليل رقمي'}</span>
                  <span className="text-accent font-bold">{ebook.isCloudBook ? 'سحابي' : 'حصري'}</span>
                </div>

                {ebook.remoteCoverUrl && (
                  <img
                    src={ebook.remoteCoverUrl}
                    alt={ebook.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              {/* عنوان وتفاصيل سريعة */}
              <div className="pt-2.5 space-y-1">
                <h3 className="text-xs font-bold text-text-heading line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                  {ebook.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-text-muted">
                  <span className="truncate max-w-[70%]">{ebook.categoryName || ebook.category}</span>
                  <span className="text-accent font-extrabold flex items-center gap-0.5 group-hover:translate-x-[-2px] transition-transform">
                    <span>فتح</span>
                    <ChevronLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-surface border border-border/80 space-y-3">
          <BookOpen className="w-10 h-10 text-text-muted mx-auto" />
          <h3 className="text-base font-bold text-text-heading">لا توجد كتب مطابقة لبحثك</h3>
          <p className="text-xs text-text-muted">جرب البحث بكلمة مفتاحية مختلفة أو اختر تصنيفاً آخر.</p>
        </div>
      )}

      {/* أزرار التنقل بين الصفحات */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-surface border border-border text-text disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition-colors"
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-text-muted px-3 py-1.5 rounded-xl bg-surface-2 border border-border">
            صفحة <span className="text-accent font-black">{currentPage}</span> من {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-surface border border-border text-text disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition-colors"
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* نافذة تفاصيل الكتاب وتحميله المنبثقة */}
      {activeEbook && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveEbook(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-smooth"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-border p-5 sm:p-7 space-y-5 text-right shadow-2xl"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-accent/15 text-accent-ink dark:text-accent font-bold text-xs">
                  {activeEbook.categoryName || activeEbook.category}
                </span>
                <span className="text-xs font-mono text-text-muted">{activeEbook.provider || 'AIProdZone'}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveEbook(null)}
                className="p-1.5 rounded-xl text-text-muted hover:text-text-heading hover:bg-surface-2 transition-colors"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg sm:text-2xl font-black text-text-heading leading-snug">
                {activeEbook.title}
              </h2>
              {activeEbook.description && (
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {activeEbook.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-surface-2 border border-border/80 text-xs text-text-muted">
              <div>
                <span className="block text-[10px] text-text-muted">الحجم / الصفحات</span>
                <span className="font-bold text-text-heading">{activeEbook.pages || activeEbook.size || 'محتوى رقمي'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted">نوع الملف</span>
                <span className="font-bold text-text-heading uppercase font-mono">{activeEbook.fileType || 'PDF / EPUB'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted">الوصول</span>
                <span className="font-bold text-teal-700 dark:text-teal-400">مجاني 100%</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-border/80">
              <button
                type="button"
                onClick={() => setActiveEbook(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:bg-surface-2 transition-colors"
              >
                إغلاق
              </button>

              {activeEbook.downloadUrl && (
                <a
                  href={activeEbook.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-accent text-accent-ink hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل / تصفح الدليل الآن</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
