'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Download,
  ExternalLink,
  Sparkles,
  Cloud,
  ChevronRight,
  ChevronDown,
  Search,
  Layers,
  GraduationCap,
  Terminal,
  Video,
  Layout,
  Puzzle,
  Filter,
  X,
  ChevronLeft
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { matchesSmartSearch } from '../lib/search';
import { EBOOK_GUIDES } from '../data/ebooks';
import { BIMO_CATEGORIES } from '../data/bimo-catalog';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';

// تحويل روابط الصور السحابية غير المشفرة أو ذات الشهادات المنتهية إلى مزود CDN السحابي الموثوق
export function getSecureCoverUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (url.includes('bimocode.com')) {
    const cleanUrl = url.replace(/^https?:\/\//, '');
    return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=480&q=82&output=webp`;
  }
  return url;
}

// مكون غلاف الكتاب الذكي (Zero Load): بديل جمالي CSS دائم في الخلفية وصورة سحابية ناعمة
function EbookCover({ ebook, size = 'card' }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const rawCover = ebook.remoteCoverUrl || ebook.cover || ebook.image || ebook.thumbnail;
  const [currentCoverUrl, setCurrentCoverUrl] = useState(() => getSecureCoverUrl(rawCover));
  const hasRemoteCover = Boolean(currentCoverUrl) && !imageError;

  const handleImageError = () => {
    if (rawCover && currentCoverUrl !== rawCover) {
      setCurrentCoverUrl(rawCover);
    } else {
      setImageError(true);
    }
  };

  const isDetail = size === 'detail';
  const containerHeight = isDetail ? 'h-56 sm:h-72 w-full max-w-sm mx-auto' : 'h-48 w-full';

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

        <div className="space-y-1 text-right" dir="rtl">
          <div className="w-8 h-1 rounded-full bg-accent/40" />
          <p dir="rtl" className="text-xs font-extrabold text-text-heading line-clamp-2 leading-snug [unicode-bidi:plaintext] text-right">
            {ebook.title}
          </p>
          <p dir="rtl" className="text-[11px] text-text-muted line-clamp-1 [unicode-bidi:plaintext] text-right">{ebook.categoryName || ebook.category}</p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-text-muted border-t border-border/50 pt-2" dir="rtl">
          <span>{ebook.pages || 'محتوى رقمي'}</span>
          <span className="text-accent font-bold">{ebook.isCloudBook ? 'سحابي مباشر' : 'دليل حصري'}</span>
        </div>
      </div>

      {/* في حال وجود صورة سحابية عن بُعد - تظهر بسلاسة عند اكتمال الجلب */}
      {hasRemoteCover && (
        <img
          src={currentCoverUrl}
          alt={ebook.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
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

// خريطة أيقونات الأقسام
const CATEGORY_ICONS = {
  all: Layers,
  tracks: GraduationCap,
  ebook: BookOpen,
  software: Terminal,
  stickers: Sparkles,
  adobe: Video,
  theme: Layout,
  plugin: Puzzle
};

const ITEMS_PER_PAGE = 12;

export default function Ebooks({
  activeEbook: propActiveEbook = null,
  setActiveEbook: propSetActiveEbook = null,
  onSelectCategory = null,
  hideHeader = false
} = {}) {
  const library = useLibrary();
  const ebooks = Array.isArray(library?.ebooks) && library.ebooks.length > 0 ? library.ebooks : EBOOK_GUIDES;

  const [internalActiveEbook, setInternalActiveEbook] = useState(null);
  const activeEbook = propActiveEbook !== undefined ? propActiveEbook : internalActiveEbook;
  const setActiveEbook = propSetActiveEbook || setInternalActiveEbook;

  // فلاتر التصنيف والبحث والتنقل
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'tracks' | 'ebook' | 'software' | 'stickers' | 'adobe' | 'theme' | 'plugin'
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // مزامنة حالة قراءة الكتاب أو التصنيف المباشر من معلمات الرابط
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const readId = params.get('read');
    const catParam = params.get('cat');
    if (readId && !activeEbook) {
      const found = ebooks.find((b) => b.id === readId);
      if (found) setActiveEbook(found);
    }
    if (catParam && catParam !== selectedCategory) {
      setSelectedCategory(catParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ebooks]);

  const handleCategoryNav = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/?cat=${encodeURIComponent(cat)}`;
    }
  };

  // حالة فتح/طي القوائم المنسدلة (Adobe, Theme, Plugin)
  const [expandedCategories, setExpandedCategories] = useState({
    adobe: true,
    theme: false,
    plugin: false
  });

  const toggleExpand = (catId, e) => {
    if (e) e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // احتساب أعداد المواد الإجمالية ديناميكياً لكل تصنيف وقسم فرعي
  const { categoryCounts, subcategoryCounts } = useMemo(() => {
    const c = { all: ebooks.length, tracks: 0, ebook: 0, software: 0, stickers: 0, adobe: 0, theme: 0, plugin: 0 };
    const sub = {};

    ebooks.forEach((eb) => {
      if (!eb.isCloudBook) {
        c.tracks++;
      } else if (eb.category) {
        const cat = eb.category.toLowerCase();
        c[cat] = (c[cat] || 0) + 1;
      }
      if (eb.subcategory) {
        sub[eb.subcategory] = (sub[eb.subcategory] || 0) + 1;
      }
    });

    return { categoryCounts: c, subcategoryCounts: sub };
  }, [ebooks]);

  // تطبيق الفرز والتصفية
  const filteredEbooks = useMemo(() => {
    return ebooks.filter((item) => {
      // 1. فلتر التصنيف الرئيسي
      if (selectedCategory === 'tracks') {
        if (item.isCloudBook) return false;
      } else if (selectedCategory !== 'all') {
        const itemCat = (item.category || '').toLowerCase();
        if (itemCat !== selectedCategory) return false;
      }

      // 2. فلتر التصنيف الفرعي
      if (selectedSubcategory) {
        if (item.subcategory !== selectedSubcategory) return false;
      }

      // 3. فلتر البحث اللحظي مع التطبيع الذكي للعربية
      if (searchQuery.trim()) {
        const searchableText = [
          item.title,
          item.excerpt,
          item.description,
          item.categoryName,
          item.categoryNameEn,
          item.subcategoryName,
          item.subcategoryNameAr,
          item.provider,
          ...(Array.isArray(item.topics) ? item.topics : [])
        ]
          .filter(Boolean)
          .join(' ');

        if (!matchesSmartSearch(searchableText, searchQuery)) {
          return false;
        }
      }

      return true;
    });
  }, [ebooks, selectedCategory, selectedSubcategory, searchQuery]);

  // التصفح والصفحات
  const totalPages = Math.max(1, Math.ceil(filteredEbooks.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedEbooks = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredEbooks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEbooks, safePage]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(null);
    setCurrentPage(1);
    if (['adobe', 'theme', 'plugin'].includes(catId)) {
      setExpandedCategories((prev) => ({ ...prev, [catId]: true }));
    }
  };

  const handleSelectSubcategory = (catId, subId) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(subId);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const currentCategoryObj = BIMO_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6 animate-smooth">
      {/* ترويسة الصفحة والملخص السحابي */}
      {!hideHeader && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="accent">مكتبة AIProdZone الرقمية والسحابية 2026</Chip>
              <span className="text-xs text-text-muted font-bold font-mono">
                ({ebooks.length} مادة رقمية معتمدة • Zero Server Load)
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-text-heading">
              الكتب الإلكترونية، حزم التصميم والمكتبة الرقمية الشاملة
            </h1>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-3xl">
              تصفح أدلة مسارات الذكاء الاصطناعي الـ 10 الحصرية، بالإضافة إلى مكتبة Bimocode الرقمية المتكاملة: كتب، قوالب المواقع، أنظمة SaaS، إضافات وملصقات، ومؤثرات أدوبي السحابية مع روابط تحميل مباشر.
            </p>
          </div>

          {/* إحصائيات سريعة */}
          <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-2 p-2 rounded-xl border border-border self-start lg:self-auto shrink-0">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-1 font-bold text-text-heading">
              <Cloud className="w-4 h-4 text-accent" />
              <span>تحميل سحابي مباشر</span>
            </div>
            <span className="text-border">|</span>
            <span className="font-mono text-accent font-extrabold">{filteredEbooks.length}</span>
            <span>مادة معروضة</span>
          </div>
        </div>
      )}

      {/* عرض تفاصيل المادة الرقمية المختارة */}
      {activeEbook ? (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => setActiveEbook(null)} className="px-2 py-1">
              <ArrowLeft className="w-4 h-4 text-text-muted" />
              <span>العودة إلى مكتبة المواد الرقمية ({ebooks.length})</span>
            </Button>
            {activeEbook.category && (
              <Button
                variant="primary"
                onClick={() => handleCategoryNav(activeEbook.category)}
                className="text-xs py-1.5 px-3"
              >
                <span>مشاهدة شروحات قسم: {activeEbook.category}</span>
              </Button>
            )}
          </div>

          {/* صندوق التحميل السحابي البارز */}
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
                target={activeEbook.downloadUrl.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-surface-0 font-extrabold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-accent/25 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{activeEbook.isCloudBook ? 'تحميل المادة الرقمية الآن' : 'الانتقال إلى المسار التعليمي'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          )}

          {/* تفاصيل المادة والغلاف */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-border">
            <div className="md:col-span-1">
              <EbookCover ebook={activeEbook} size="detail" />
              <div className="mt-3 p-3.5 rounded-xl bg-surface-2 border border-border text-xs space-y-2" dir="rtl">
                <div className="flex items-center justify-between text-text-muted">
                  <span>المصدر / الناشر:</span>
                  <span className="font-bold text-text-heading">{activeEbook.author || activeEbook.provider}</span>
                </div>
                <div className="flex items-center justify-between text-text-muted">
                  <span>التصنيف الرقمي:</span>
                  <span className="font-bold text-accent">{activeEbook.categoryNameEn || activeEbook.category}</span>
                </div>
                {activeEbook.subcategoryName && (
                  <div className="flex items-center justify-between text-text-muted">
                    <span>القسم الفرعي:</span>
                    <span className="font-bold text-text-heading">{activeEbook.subcategoryName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-text-muted">
                  <span>نوع المحتوى / الملف:</span>
                  <span className="font-bold text-text-heading">{activeEbook.pages || activeEbook.fileType}</span>
                </div>
                {activeEbook.provider && (
                  <div className="flex items-center justify-between text-text-muted">
                    <span>سيرفر الاستضافة السحابي:</span>
                    <span className="font-bold text-accent">{activeEbook.provider}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="accent">
                    {activeEbook.tag || activeEbook.categoryNameEn || `مادة #${activeEbook.sectionOrder}`}
                  </Chip>
                  {activeEbook.categoryName && <Chip tone="neutral">{activeEbook.categoryName}</Chip>}
                  {activeEbook.subcategoryName && (
                    <Chip tone="neutral">{activeEbook.subcategoryName}</Chip>
                  )}
                </div>
                <h2 dir="rtl" className="text-xl sm:text-2xl font-extrabold text-text-heading leading-snug [unicode-bidi:plaintext] text-right">
                  {activeEbook.title}
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-surface-2 border border-border text-right" dir="rtl">
                <h3 className="text-xs font-bold text-accent mb-1.5 flex items-center justify-end gap-1.5">
                  <span>نبذة موجزة عن المحتوى:</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </h3>
                <p dir="rtl" className="text-xs sm:text-sm leading-relaxed text-text-muted [unicode-bidi:plaintext] text-right">
                  {activeEbook.excerpt}
                </p>
              </div>

              <div className="space-y-2 pt-2 text-right" dir="rtl">
                <h3 className="text-sm font-extrabold text-text-heading flex items-center justify-end gap-2">
                  <span>مواصفات وفصول المادة:</span>
                  <BookOpen className="w-4 h-4 text-accent" />
                </h3>
                <p dir="rtl" className="text-xs sm:text-sm leading-relaxed text-text whitespace-pre-line bg-surface-1 p-4 rounded-xl border border-border [unicode-bidi:plaintext] text-right">
                  {activeEbook.content}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* العرض الرئيسي: شريط الأقسام الأنيق المطابق للصورة + شبكة المنتجات */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* ==================== العمود الجانبي: قائمة الأقسام المطابقة للصورة 100% ==================== */}
          <aside className="lg:col-span-1 space-y-4 sticky top-20">
            {/* بطاقة الأقسام الأنيقة (نفس المظهر والترتيب الموجود في صورة المستخدم) */}
            <div className="rounded-2xl border border-border bg-surface-1 shadow-sm overflow-hidden">
              {/* شريط عنوان القائمة */}
              <div className="px-4 py-3 bg-surface-2/80 border-b border-border flex items-center justify-between">
                <span className="text-xs font-extrabold text-text-heading tracking-wide uppercase font-mono">
                  Categories
                </span>
                <span className="text-[11px] text-accent font-bold">
                  {ebooks.length} مادة
                </span>
              </div>

              {/* عناصر القائمة مع الخطوط الفاصلة ومؤشرات الأسهم */}
              <div className="divide-y divide-border/70 text-sm">
                {/* 1. خيار: الكل (All) */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory('all')}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                    selectedCategory === 'all' && !selectedSubcategory
                      ? 'bg-accent/10 text-accent font-extrabold'
                      : 'text-text-heading hover:bg-surface-2/60 hover:text-accent font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-accent/80 shrink-0" />
                    <span>All Products (الكل)</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-surface-2 text-text-muted">
                    {categoryCounts.all}
                  </span>
                </button>

                {/* 2. خيار: أدلة المسارات العشرة (Tracks) */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory('tracks')}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                    selectedCategory === 'tracks'
                      ? 'bg-accent/10 text-accent font-extrabold'
                      : 'text-text-heading hover:bg-surface-2/60 hover:text-accent font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-accent/80 shrink-0" />
                    <span>Track Guides (الأدلة الـ 10)</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-surface-2 text-text-muted">
                    {categoryCounts.tracks}
                  </span>
                </button>

                {/* 3. Ebook (الكتب والأدلة) - مطابق تماماً لصورة المستخدم */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory('ebook')}
                  className={`w-full px-4 py-3.5 text-left flex items-center justify-between transition-colors ${
                    selectedCategory === 'ebook'
                      ? 'bg-accent/10 text-accent font-extrabold'
                      : 'text-text-heading hover:bg-surface-2/60 hover:text-accent font-medium'
                  }`}
                >
                  <span className="text-base font-semibold tracking-tight">Ebook</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">
                    {categoryCounts.ebook}
                  </span>
                </button>

                {/* 4. Software (البرمجيات) - مطابق تماماً لصورة المستخدم */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory('software')}
                  className={`w-full px-4 py-3.5 text-left flex items-center justify-between transition-colors ${
                    selectedCategory === 'software'
                      ? 'bg-accent/10 text-accent font-extrabold'
                      : 'text-text-heading hover:bg-surface-2/60 hover:text-accent font-medium'
                  }`}
                >
                  <span className="text-base font-semibold tracking-tight">Software</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">
                    {categoryCounts.software}
                  </span>
                </button>

                {/* 5. Stickers (الملصقات والتصاميم) - مطابق تماماً لصورة المستخدم */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory('stickers')}
                  className={`w-full px-4 py-3.5 text-left flex items-center justify-between transition-colors ${
                    selectedCategory === 'stickers'
                      ? 'bg-accent/10 text-accent font-extrabold'
                      : 'text-text-heading hover:bg-surface-2/60 hover:text-accent font-medium'
                  }`}
                >
                  <span className="text-base font-semibold tracking-tight">Stickers</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">
                    {categoryCounts.stickers}
                  </span>
                </button>

                {/* 6. Adobe (مع سهم وسلسلة فرعية: Photo Shop, After Effects) */}
                <div>
                  <div
                    onClick={() => handleSelectCategory('adobe')}
                    className={`w-full px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCategory === 'adobe' && !selectedSubcategory
                        ? 'bg-accent/10 text-accent font-extrabold'
                        : 'text-text-heading hover:bg-surface-2/60 hover:text-accent font-medium'
                    }`}
                  >
                    <span className="text-base font-semibold tracking-tight">Adobe</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">
                        {categoryCounts.adobe}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleExpand('adobe', e)}
                        className="p-1 hover:bg-surface-3 rounded text-text-muted hover:text-accent transition-transform"
                      >
                        {expandedCategories.adobe ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* قائمة فرعية لـ Adobe عند الفتح */}
                  {expandedCategories.adobe && (
                    <div className="bg-surface-2/50 px-3 py-1.5 border-t border-border/50 space-y-1">
                      <button
                        type="button"
                        onClick={() => handleSelectSubcategory('adobe', 'photo-shop')}
                        className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                          selectedCategory === 'adobe' && selectedSubcategory === 'photo-shop'
                            ? 'bg-accent text-surface-0 font-bold'
                            : 'text-text-muted hover:text-text-heading hover:bg-surface-1'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          <span>Photo Shop</span>
                        </span>
                        <span className="font-mono text-[11px] opacity-80">
                          {subcategoryCounts['photo-shop'] || 0}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectSubcategory('adobe', 'after-effects')}
                        className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                          selectedCategory === 'adobe' && selectedSubcategory === 'after-effects'
                            ? 'bg-accent text-surface-0 font-bold'
                            : 'text-text-muted hover:text-text-heading hover:bg-surface-1'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          <span>After Effects</span>
                        </span>
                        <span className="font-mono text-[11px] opacity-80">
                          {subcategoryCounts['after-effects'] || 0}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 7. Theme (مع سهم وسلسلة فرعية لقوالب المواقع) */}
                <div>
                  <div
                    onClick={() => handleSelectCategory('theme')}
                    className={`w-full px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCategory === 'theme' && !selectedSubcategory
                        ? 'bg-accent/10 text-accent font-extrabold'
                        : 'text-text-heading hover:bg-surface-2/60 hover:text-accent font-medium'
                    }`}
                  >
                    <span className="text-base font-semibold tracking-tight">Theme</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">
                        {categoryCounts.theme}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleExpand('theme', e)}
                        className="p-1 hover:bg-surface-3 rounded text-text-muted hover:text-accent transition-transform"
                      >
                        {expandedCategories.theme ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* قائمة فرعية لـ Theme */}
                  {expandedCategories.theme && (
                    <div className="bg-surface-2/50 px-3 py-1.5 border-t border-border/50 space-y-1">
                      {[
                        { id: 'food-restaurants', label: 'Food & Restaurants' },
                        { id: 'sports-travel', label: 'Sports & Travel' },
                        { id: 'business-service', label: 'Business & Service' },
                        { id: 'design-photography', label: 'Design & Photography' },
                        { id: 'home-family', label: 'Home & Family' },
                        { id: 'fashion-beauty', label: 'Fashion & Beauty' }
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSelectSubcategory('theme', sub.id)}
                          className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                            selectedCategory === 'theme' && selectedSubcategory === sub.id
                              ? 'bg-accent text-surface-0 font-bold'
                              : 'text-text-muted hover:text-text-heading hover:bg-surface-1'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                            <span>{sub.label}</span>
                          </span>
                          <span className="font-mono text-[11px] opacity-80">
                            {subcategoryCounts[sub.id] || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 8. Plugin (مع سهم وسلسلة فرعية للإضافات والسكربتات) */}
                <div>
                  <div
                    onClick={() => handleSelectCategory('plugin')}
                    className={`w-full px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCategory === 'plugin' && !selectedSubcategory
                        ? 'bg-accent/10 text-accent font-extrabold'
                        : 'text-text-heading hover:bg-surface-2/60 hover:text-accent font-medium'
                    }`}
                  >
                    <span className="text-base font-semibold tracking-tight">Plugin</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-surface-2 text-text-muted">
                        {categoryCounts.plugin}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleExpand('plugin', e)}
                        className="p-1 hover:bg-surface-3 rounded text-text-muted hover:text-accent transition-transform"
                      >
                        {expandedCategories.plugin ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* قائمة فرعية لـ Plugin */}
                  {expandedCategories.plugin && (
                    <div className="bg-surface-2/50 px-3 py-1.5 border-t border-border/50 space-y-1">
                      {[
                        { id: 'ecommerce-business', label: 'eCommerce & Business' },
                        { id: 'seo-security', label: 'SEO & Security' },
                        { id: 'design-media', label: 'Design & Media' }
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSelectSubcategory('plugin', sub.id)}
                          className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                            selectedCategory === 'plugin' && selectedSubcategory === sub.id
                              ? 'bg-accent text-surface-0 font-bold'
                              : 'text-text-muted hover:text-text-heading hover:bg-surface-1'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                            <span>{sub.label}</span>
                          </span>
                          <span className="font-mono text-[11px] opacity-80">
                            {subcategoryCounts[sub.id] || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* بطاقة معلومات السحابة الذكية */}
            <div className="p-4 rounded-2xl bg-surface-2/70 border border-border text-xs space-y-2 hidden lg:block" dir="rtl">
              <div className="flex items-center gap-2 font-bold text-accent">
                <Sparkles className="w-4 h-4" />
                <span>معمارية Zero Local Load</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                جميع الملفات والكتب يتم استضافتها خارجياً على سيرفرات MediaFire و Google Drive و Mega.nz لتوفير سرعة خارقة وصفر استهلاك لسيرفر المنصة.
              </p>
            </div>
          </aside>

          {/* ==================== العمود الرئيسي: البحث، الفلاتر والمنتجات ==================== */}
          <section className="lg:col-span-3 space-y-5">
            {/* شريط البحث اللحظي والمسار النشط */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-surface-1 border border-border shadow-sm">
              {/* حقل البحث السريع */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="ابحث في الكتب والقوالب والمؤثرات أو اسم المزود..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-2 border border-border text-xs text-text-heading placeholder:text-text-muted focus:outline-none focus:border-accent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-heading p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* شارة القسم النشط + زر التصفير */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-border text-xs font-bold text-text-heading">
                  <span className="text-text-muted">القسم:</span>
                  <span className="text-accent">
                    {currentCategoryObj?.nameEn || selectedCategory}
                    {selectedSubcategory ? ` / ${selectedSubcategory}` : ''}
                  </span>
                  <span className="text-text-muted font-mono font-normal">
                    ({filteredEbooks.length})
                  </span>
                </div>

                {(selectedCategory !== 'all' || selectedSubcategory || searchQuery) && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="text-xs px-2.5 py-1.5 text-text-muted hover:text-accent"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>تصفير</span>
                  </Button>
                )}
              </div>
            </div>

            {/* شبكة عرض المواد الرقمية */}
            {paginatedEbooks.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-surface-1 border border-dashed border-border space-y-3">
                <div className="w-12 h-12 rounded-full bg-surface-2 text-text-muted mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-text-heading">لا توجد نتائج مطابقة لبحثك</h3>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  جرب تغيير كلمات البحث أو اختر قسماً آخر من شريط الأقسام على اليسار.
                </p>
                <Button variant="ghost" onClick={clearAllFilters} className="text-xs">
                  <span>عرض كافة المواد ({ebooks.length})</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 xl:gap-6">
                {paginatedEbooks.map((eb) => (
                  <Card
                    key={eb.id}
                    as="article"
                    interactive
                    onClick={() => setActiveEbook(eb)}
                    className="group p-4 flex flex-col h-full justify-between space-y-3.5 hover:border-accent/40"
                  >
                    {/* غلاف المادة الذكي */}
                    <EbookCover ebook={eb} size="card" />

                    <div className="space-y-2 flex-1" dir="rtl">
                      <div className="flex items-center justify-between gap-2">
                        <Chip tone="accent">
                          {eb.categoryNameEn || eb.badge || `قسم #${eb.sectionOrder}`}
                        </Chip>
                        <span className="text-[11px] font-bold text-text-muted font-mono truncate" dir="rtl">
                          {eb.subcategoryName || eb.pages || 'محتوى رقمي'}
                        </span>
                      </div>
                      <h2 dir="rtl" className="text-sm sm:text-base font-extrabold leading-snug text-text-heading group-hover:text-accent transition-colors line-clamp-2 [unicode-bidi:plaintext] text-right">
                        {eb.title}
                      </h2>
                      <p dir="rtl" className="text-xs leading-relaxed text-text-muted line-clamp-2 [unicode-bidi:plaintext] text-right">
                        {eb.excerpt}
                      </p>
                    </div>

                    {/* تذييل البطاقة مع زر التحميل المباشر وزر التفاصيل */}
                    <div className="pt-3 mt-auto border-t border-border flex items-center justify-between text-xs gap-2">
                      {eb.downloadUrl ? (
                        <>
                          <a
                            href={eb.downloadUrl}
                            target={eb.downloadUrl.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/15 hover:bg-accent hover:text-accent-ink text-teal-700 dark:text-teal-400 font-extrabold transition-all text-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{eb.isCloudBook ? 'تحميل مباشر' : 'المسار التعليمي'}</span>
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </a>
                          <span className="font-extrabold inline-flex items-center gap-1 text-text-heading group-hover:text-accent transition-colors">
                            <span>التفاصيل</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-text-muted text-[11px] font-bold">
                            {eb.readTime || 'قراءة فورية'}
                          </span>
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

            {/* التحكم في الصفحات (Pagination) */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
                <span className="text-xs text-text-muted font-mono font-bold">
                  عرض {paginatedEbooks.length} من أصل {filteredEbooks.length} مادة • صفحة {safePage} من {totalPages}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg bg-surface-2 border border-border text-text-heading disabled:opacity-30 disabled:pointer-events-none hover:bg-surface-3 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    // عرض الصفحات القريبة فقط إذا كانت كثيرة
                    if (
                      totalPages > 7 &&
                      Math.abs(pageNum - safePage) > 2 &&
                      pageNum !== 1 &&
                      pageNum !== totalPages
                    ) {
                      return null;
                    }
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition-colors ${
                          safePage === pageNum
                            ? 'bg-accent text-surface-0 shadow-sm'
                            : 'bg-surface-2 text-text-heading hover:bg-surface-3 border border-border'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg bg-surface-2 border border-border text-text-heading disabled:opacity-30 disabled:pointer-events-none hover:bg-surface-3 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
