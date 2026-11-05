'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { HERO_ARTICLES_SUMMARY } from '../data/articles-summary';
import ArticleCoverGraphic from './ArticleCoverGraphic';
import Chip from './Chip';

export const ROTATION_INTERVAL_MS = 10000; // تبديل المقال تلقائياً كل 10 ثوانٍ بالضبط

/**
 * محرك عارض المقالات التلقائي (Zero-CPU Waste Engine)
 * يدعم التبديل كل 10 ثوانٍ (10000ms) والإيقاف اللحظي عند التمرير أو مغادرة التبويبة
 */
export class ArticleCarouselController {
  constructor({
    articles = HERO_ARTICLES_SUMMARY,
    interval = ROTATION_INTERVAL_MS,
    onIndexChange
  } = {}) {
    this.articles = Array.isArray(articles) && articles.length > 0 ? articles : HERO_ARTICLES_SUMMARY;
    this.interval = interval;
    this.currentIndex = 0;
    this.isPaused = false;
    this.timer = null;
    this.onIndexChange = onIndexChange;
    this.startTimer();
  }

  startTimer() {
    this.clearTimer();
    if (!this.isPaused && this.articles.length > 1) {
      this.timer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.articles.length;
        if (typeof this.onIndexChange === 'function') {
          this.onIndexChange(this.currentIndex, this.currentArticle);
        }
      }, this.interval);
    }
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  pause() {
    this.isPaused = true;
    this.clearTimer();
  }

  resume() {
    this.isPaused = false;
    this.startTimer();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.articles.length;
    this.startTimer();
    if (typeof this.onIndexChange === 'function') {
      this.onIndexChange(this.currentIndex, this.currentArticle);
    }
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.articles.length) % this.articles.length;
    this.startTimer();
    if (typeof this.onIndexChange === 'function') {
      this.onIndexChange(this.currentIndex, this.currentArticle);
    }
  }

  goTo(idx) {
    this.currentIndex = Math.max(0, Math.min(idx, this.articles.length - 1));
    this.startTimer();
    if (typeof this.onIndexChange === 'function') {
      this.onIndexChange(this.currentIndex, this.currentArticle);
    }
  }

  get currentArticle() {
    return this.articles[this.currentIndex] || this.articles[0];
  }

  destroy() {
    this.clearTimer();
  }
}

/**
 * هوك مخصص لإدارة دوران المقالات والمؤقت الذكي الخالي من استنزاف المعالج (Zero-CPU Waste)
 */
export function useArticleCarousel({
  articles = HERO_ARTICLES_SUMMARY,
  interval = ROTATION_INTERVAL_MS
} = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);

  const safeArticles = useMemo(() => {
    return Array.isArray(articles) && articles.length > 0
      ? articles
      : HERO_ARTICLES_SUMMARY;
  }, [articles]);

  // 1. مراقبة ظهور الصفحة (Page Visibility API): لا يعمل المؤقت إطلاقاً والتبويبة في الخلفية
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 2. مؤقت التبديل التلقائي الذكي كل 10 ثوانٍ (10,000ms) مع استئناف فوري
  useEffect(() => {
    if (isPaused || isTabHidden || safeArticles.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeArticles.length);
      setCycleKey((k) => k + 1);
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, isTabHidden, safeArticles.length, interval, currentIndex]);

  const goToNext = useCallback(() => {
    if (safeArticles.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % safeArticles.length);
    setCycleKey((k) => k + 1);
  }, [safeArticles.length]);

  const goToPrev = useCallback(() => {
    if (safeArticles.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + safeArticles.length) % safeArticles.length);
    setCycleKey((k) => k + 1);
  }, [safeArticles.length]);

  const goToIndex = useCallback((index) => {
    if (safeArticles.length === 0) return;
    const bounded = Math.max(0, Math.min(index, safeArticles.length - 1));
    setCurrentIndex(bounded);
    setCycleKey((k) => k + 1);
  }, [safeArticles.length]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    setCycleKey((k) => k + 1);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPaused(false);
    setCycleKey((k) => k + 1);
  }, []);

  const currentArticle = safeArticles[currentIndex] || safeArticles[0] || null;

  return {
    currentIndex,
    currentArticle,
    articles: safeArticles,
    isPaused: isPaused || isTabHidden,
    setIsPaused,
    goToNext,
    goToPrev,
    goToIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    cycleKey
  };
}

/**
 * مكون العارض الدوّار الفاخر للمقالات التقنية المرجعية الـ 18 (HeroArticleCarousel)
 * تصميم أكاديمي أصيل RTL مع شريط تقدم زمردي (#14B8A6) وانعدام تام للانزياح البصري (CLS = 0)
 */
export default function HeroArticleCarousel({
  articles = HERO_ARTICLES_SUMMARY,
  onOpenArticle,
  onViewAllArticles,
  setView,
  className = ''
}) {
  const {
    currentIndex,
    currentArticle,
    articles: list,
    isPaused,
    goToNext,
    goToPrev,
    goToIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    cycleKey
  } = useArticleCarousel({ articles, interval: ROTATION_INTERVAL_MS });

  if (!currentArticle) return null;

  // استخراج أهم 3 محاور أو نقاط سريعة للمقال
  const takeaways = (
    currentArticle.quickTakeaways && currentArticle.quickTakeaways.length > 0
      ? currentArticle.quickTakeaways
      : currentArticle.keyTakeaways && currentArticle.keyTakeaways.length > 0
      ? currentArticle.keyTakeaways
      : currentArticle.tags || []
  ).slice(0, 3);

  const articleHref = `/articles/${currentArticle.id}`;

  const handleArticleClick = (e) => {
    if (onOpenArticle) {
      e.preventDefault();
      onOpenArticle(currentArticle.id);
    }
  };

  const handleViewAllClick = (e) => {
    if (onViewAllArticles) {
      e.preventDefault();
      onViewAllArticles();
    } else if (setView) {
      e.preventDefault();
      setView('articles');
    }
  };

  return (
    <section
      dir="rtl"
      role="region"
      aria-roledescription="carousel"
      aria-label="المقالات التقنية والأكاديمية المرجعية"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`group relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[300px] lg:min-h-[320px] flex flex-col justify-between bg-gradient-to-br from-teal-950/20 via-surface to-surface-2 dark:from-teal-950/40 dark:via-surface-2 dark:to-surface border border-teal-500/25 hover:border-teal-500/50 transition-all duration-300 shadow-md ${className}`}
    >
      {/* 1. خلفية هندسية متجهة نقية (0 KB Network Requests - خالية تماماً من ملفات الصور الخارجية) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <svg className="absolute w-full h-full opacity-10 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-circuit-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path
                d="M 36 0 L 0 0 0 36"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                className="text-teal-500/40"
              />
              <circle cx="36" cy="36" r="1.5" className="fill-teal-500/60" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-circuit-grid)" />
        </svg>

        {/* هالات إضاءة زمردية وأرجوانية خافتة تمنح البانر طابع الحداثة والعمق */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-10 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* 2. المحتوى الأساسي للبانر: الجزء الأيمن (التفاصيل الأكاديمية) + الجزء الأيسر (البطاقة البصرية الزجاجية) */}
      <div className="relative z-10 w-full p-4 sm:p-6 lg:p-7 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 lg:gap-8 flex-1">
        {/* الجزء الأيمن/الأساسي: محتوى المقال المرتب بدقة متناهية */}
        <div
          key={`content-${currentArticle.id}`}
          className="flex-1 min-w-0 space-y-3 sm:space-y-3.5 text-right transition-opacity duration-500 animate-hero-fade"
        >
          {/* الصف العلوي للشارات */}
          <div className="flex flex-wrap items-center gap-2">
            {/* الشارة المضيئة */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30 shadow-xs backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-500 fill-teal-500/20" />
              <span>✨ مقال مرجعي • تحديث 2026</span>
            </span>

            {/* شارة القطاع الأكاديمي */}
            <Chip tone="accent" className="px-2.5 py-1 text-xs font-bold rounded-full backdrop-blur-md">
              <span>{currentArticle.category}</span>
            </Chip>

            {/* وقت القراءة المقدر */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/80 dark:bg-surface-2/80 border border-border text-[11px] text-text-muted font-bold">
              <Clock className="w-3 h-3 text-teal-500" />
              <span>{currentArticle.readTime || '8 دقائق قراءة'}</span>
            </span>

            {/* عداد ترتيب المقال */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface/80 dark:bg-surface-2/80 border border-border text-[11px] text-text-muted font-mono font-bold">
              <BookOpen className="w-3 h-3 text-teal-500" />
              <span>مقال {currentIndex + 1} من {list.length}</span>
            </span>
          </div>

          {/* عنوان المقال <h2> بخط Cairo عريض وتباين فائق */}
          <h2
            dir="rtl"
            className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-arabic leading-snug line-clamp-2 text-text-heading hover:text-teal-600 dark:hover:text-teal-400 transition-colors [unicode-bidi:plaintext] text-right"
          >
            <Link
              href={articleHref}
              onClick={handleArticleClick}
              className="focus:outline-none focus-visible:underline"
              title={currentArticle.title}
            >
              {currentArticle.title}
            </Link>
          </h2>

          {/* الملخص التعريفي الأكاديمي (سطران مركزان) */}
          <p
            dir="rtl"
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 max-w-2xl [unicode-bidi:plaintext] text-right"
          >
            {currentArticle.definitionLead || currentArticle.summary}
          </p>

          {/* معلومات الكاتب وصفته الأكاديمية */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted pt-0.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
            <span className="font-extrabold text-text-heading">{currentArticle.author}</span>
            <span className="text-border dark:text-slate-700">•</span>
            <span className="truncate max-w-xs sm:max-w-md">{currentArticle.authorRole}</span>
          </div>

          {/* أزرار الإجراء السريع (Call-to-Action) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
            {/* الزر الأساسي الزمردي: اقرأ المقال كاملاً ↗ */}
            <Link
              href={articleHref}
              onClick={handleArticleClick}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md bg-[#14B8A6] hover:bg-[#0ea5e9]/90 text-slate-950 transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <span>اقرأ المقال كاملاً</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            {/* الزر الثانوي: تصفح كل المقالات (18) */}
            <Link
              href="/articles"
              onClick={handleViewAllClick}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-surface/90 hover:bg-surface border border-border hover:border-teal-500/40 text-text-heading shadow-xs transition-colors"
            >
              <Layers className="w-4 h-4 text-teal-500" />
              <span>تصفح كل المقالات ({list.length})</span>
            </Link>
          </div>
        </div>

        {/* الجزء الأيسر: اللوحة البصرية الهندسية الفاخرة (ArticleCoverGraphic + Takeaways) */}
        <div
          key={`graphic-${currentArticle.id}`}
          className="hidden md:flex w-72 lg:w-80 shrink-0 flex-col gap-2.5 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-teal-500/20 rounded-2xl p-3 sm:p-3.5 shadow-md transition-opacity duration-500 animate-hero-fade"
        >
          {/* بطاقة الغلاف الهندسي المتجهي */}
          <div
            onClick={handleArticleClick}
            className="cursor-pointer overflow-hidden rounded-xl border border-border/80 shadow-inner group/cover"
            title="اضغط لقراءة المقال كاملاً"
          >
            <ArticleCoverGraphic
              article={currentArticle}
              variant="card"
              className="w-full h-32 sm:h-36 group-hover/cover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          {/* صندوق أهم محاور المقال والمسارات المرتبطة */}
          <div className="space-y-1.5 pt-1 border-t border-border/60" dir="rtl">
            <div className="flex items-center justify-between text-[11px] font-black text-text-heading">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-500" />
                أهم محاور المقال:
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                {(currentArticle.relatedCourseIds || []).length > 0
                  ? `${currentArticle.relatedCourseIds.length} مسارات`
                  : 'أكاديمي'}
              </span>
            </div>

            {takeaways.map((takeaway, idx) => (
              <p
                key={idx}
                className="text-[11px] text-text-muted leading-tight flex items-start gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{takeaway}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 3. شريط التحكم والتنقل المدمج (Arrows + Pagination Dots + Status) */}
      <div className="relative z-10 px-4 sm:px-6 py-2.5 bg-surface/50 dark:bg-slate-950/50 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* أزرار السهمين: السابق والتالي */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="المقال السابق"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-surface/90 hover:bg-surface border border-border hover:border-teal-500/50 text-text-heading text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
          >
            <ChevronRight className="w-4 h-4 text-teal-500" />
            <span className="hidden sm:inline">السابق</span>
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="المقال التالي"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-surface/90 hover:bg-surface border border-border hover:border-teal-500/50 text-text-heading text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs"
          >
            <span className="hidden sm:inline">التالي</span>
            <ChevronLeft className="w-4 h-4 text-teal-500" />
          </button>
        </div>

        {/* نقاط التنقل الـ 18 المرقمة الأنيقة (Pagination Dots) */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 max-w-[50%] overflow-x-auto no-scrollbar py-1"
          role="tablist"
          aria-label="مؤشرات المقالات"
        >
          {list.map((art, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={art.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`مقال ${idx + 1}: ${art.title}`}
                onClick={() => goToIndex(idx)}
                className={`transition-all duration-300 rounded-full shrink-0 ${
                  isActive
                    ? 'w-5 sm:w-6 h-2 bg-[#14B8A6] shadow-xs'
                    : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-teal-500/50'
                }`}
              />
            );
          })}
        </div>

        {/* مؤشر حالة المؤقت (يعلم القارئ بتوقف التبديل عند وضع المؤشر) */}
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-mono select-none">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isPaused ? 'bg-amber-500' : 'bg-teal-500 animate-pulse'
            }`}
          />
          <span className="hidden sm:inline">
            {isPaused ? 'المؤقت متوقف مؤقتاً' : 'يتبدل تلقائياً كل 10 ثوانٍ'}
          </span>
          <span className="sm:hidden">
            {isPaused ? 'متوقف' : '10 ثوانٍ'}
          </span>
        </div>
      </div>

      {/* 4. شريط التقدم البصري الرفيع جداً باللون الزمردي (#14B8A6) في أسفل البانر */}
      <div
        className="absolute bottom-0 inset-x-0 h-1 bg-slate-200/50 dark:bg-slate-800/60 overflow-hidden"
        aria-hidden="true"
      >
        <div
          key={`bar-${currentIndex}-${cycleKey}`}
          className="h-full bg-[#14B8A6] rounded-full animate-hero-progress"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        />
      </div>
    </section>
  );
}
