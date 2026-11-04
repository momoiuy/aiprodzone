'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  FileText,
  Clock,
  Calendar,
  User,
  Bookmark,
  Share2,
  ArrowRight,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  Lightbulb,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronDown,
  X,
  Play,
  Award,
  Filter,
  HelpCircle,
  Tag,
  Terminal,
  Code
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { ARTICLE_CATEGORIES, INITIAL_ARTICLES, resolveArticleGeoSeo } from '../data/articles';
import { ArticleJsonLd, ArticleCollectionJsonLd } from '../components/ArticleJsonLd';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';
import ArticleCoverGraphic from '../components/ArticleCoverGraphic';

// مكون منسق للنصوص والأكواد البرمجية مع عزل كامل للاتجاه dir="ltr" text-left
function FormattedArticleText({ content }) {
  if (!content) return null;

  // فحص الكتل البرمجية المحاطة بـ ```
  if (content.includes('```')) {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
      <div className="space-y-3">
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
      className="text-sm sm:text-base text-text leading-loose font-normal whitespace-pre-line [unicode-bidi:plaintext] text-right"
    >
      {content}
    </p>
  );
}

// Props: { onWatchCourse?: (courseId: string, instructorId?: string) => void, initialArticleSlug?: string }
export default function Articles({ onWatchCourse, initialArticleSlug }) {
  const {
    articles = INITIAL_ARTICLES,
    courses = [],
    bookmarkedArticleIds = [],
    toggleBookmarkArticle
  } = useLibrary();

  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleId, setActiveArticleId] = useState(() => {
    if (!initialArticleSlug) return null;
    const match = articles.find(
      (a) => a.slug === initialArticleSlug || a.id === initialArticleSlug
    );
    return match ? match.id : null;
  });
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const readerContainerRef = useRef(null);

  // البحث عن المقال النشط في حال تحديد معرّف أو slug
  useEffect(() => {
    if (initialArticleSlug) {
      const match = articles.find(
        (a) => a.slug === initialArticleSlug || a.id === initialArticleSlug
      );
      if (match) setActiveArticleId(match.id);
    }
  }, [initialArticleSlug, articles]);

  const activeArticle = useMemo(
    () => articles.find((a) => a.id === activeArticleId) || null,
    [articles, activeArticleId]
  );

  // إثراء بيانات المقال النشط بحقول GEO & SEO مع قيم افتراضية ذكية
  const resolvedArticle = useMemo(
    () => (activeArticle ? resolveArticleGeoSeo(activeArticle) : null),
    [activeArticle]
  );

  // تحديث شريط تقدم القراءة عند التمرير في وضع قراءة المقال
  useEffect(() => {
    if (!activeArticle) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setReadingProgress(100);
        return;
      }
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeArticle]);

  // الانتقال للأعلى عند فتح المقال وتحديث الرابط
  const openArticle = (articleId) => {
    setActiveArticleId(articleId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const art = articles.find((a) => a.id === articleId);
      if (art) {
        const url = new URL(window.location.href);
        url.searchParams.set('view', 'articles');
        url.searchParams.set('slug', art.slug);
        url.searchParams.delete('article');
        window.history.pushState({ view: 'articles', slug: art.slug }, '', url.toString());
      }
    }
  };

  const closeReader = () => {
    setActiveArticleId(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'articles');
      url.searchParams.delete('slug');
      url.searchParams.delete('article');
      window.history.pushState({ view: 'articles' }, '', url.toString());
    }
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    const url = activeArticle
      ? `https://aiprodzone.com/?view=articles&slug=${activeArticle.slug}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // فلترة المقالات مع دعم البحث في العناوين والوسوم والكلمات المفتاحية والأسئلة الشائعة
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (selectedCategory !== 'الكل' && art.category !== selectedCategory) {
        return false;
      }
      if (onlyBookmarked && !bookmarkedArticleIds.includes(art.id)) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSub = (art.subtitle || '').toLowerCase().includes(q);
      const matchSummary = (art.summary || '').toLowerCase().includes(q);
      const matchTags = (art.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchKeywords = (art.seoKeywords || []).some((k) => k.toLowerCase().includes(q));
      const matchFaqs = (art.faqs || []).some(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
      const matchAuthor = (art.author || '').toLowerCase().includes(q);
      const matchSections = (art.sections || []).some(
        (s) => s.heading.toLowerCase().includes(q) || s.body.toLowerCase().includes(q)
      );

      return (
        matchTitle ||
        matchSub ||
        matchSummary ||
        matchTags ||
        matchKeywords ||
        matchFaqs ||
        matchAuthor ||
        matchSections
      );
    });
  }, [articles, selectedCategory, searchQuery, onlyBookmarked, bookmarkedArticleIds]);

  // المقال المميز (Featured Hero)
  const heroArticle = useMemo(() => {
    return articles.find((a) => a.featured) || articles[0] || null;
  }, [articles]);

  // الدورات والمسارات المرتبطة بالمقال النشط
  const relatedCourses = useMemo(() => {
    if (!activeArticle || !Array.isArray(activeArticle.relatedCourseIds)) return [];
    return activeArticle.relatedCourseIds
      .map((cId) => courses.find((c) => c.id === cId))
      .filter(Boolean);
  }, [activeArticle, courses]);

  // ==========================================
  // وضع قراءة المقال الكامل (Article Reader Mode)
  // ==========================================
  if (activeArticle && resolvedArticle) {
    const isBookmarked = bookmarkedArticleIds.includes(activeArticle.id);

    return (
      <div className="space-y-8 animate-smooth pb-16" ref={readerContainerRef}>
        {/* حقن البيانات المهيكلة المزدوجة Stacked JSON-LD (TechArticle + FAQPage + BreadcrumbList) */}
        <ArticleJsonLd article={resolvedArticle} />

        {/* شريط تقدم القراءة العلوي الدائم */}
        <div className="fixed top-14 sm:top-16 left-0 right-0 z-30 h-1 bg-surface-2">
          <div
            className="h-full bg-accent transition-all duration-150 shadow-sm"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* شريط الإجراءات والرجوع */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <Button
            variant="secondary"
            onClick={closeReader}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-extrabold flex items-center gap-2 group"
          >
            <ArrowRight className="w-4 h-4 text-accent group-hover:-translate-x-1 transition-transform" />
            <span>العودة إلى فهرس المقالات</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleCopyLink}
              className="px-3 py-2 text-xs font-bold flex items-center gap-1.5"
              title="نسخ رابط المقال"
            >
              <Share2 className="w-3.5 h-3.5 text-text-muted" />
              <span>{copiedLink ? 'تم نسخ الرابط ✓' : 'مشاركة'}</span>
            </Button>

            <Button
              variant={isBookmarked ? 'primary' : 'secondary'}
              onClick={(e) => toggleBookmarkArticle(e, activeArticle.id)}
              className="px-3 py-2 text-xs font-bold flex items-center gap-1.5"
              title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ في قائمتي'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'محفوظ في قائمتي' : 'حفظ المقال'}</span>
            </Button>
          </div>
        </div>

        {/* ترويسة المقال الفاخرة */}
        <header className="space-y-5 max-w-4xl mx-auto text-right" dir="rtl">
          {/* الغلاف البصري الهندسي كـ Banner علوي بانورامي فاخر */}
          <div className="w-full overflow-hidden rounded-3xl border border-border/70 shadow-md">
            <ArticleCoverGraphic
              article={resolvedArticle}
              variant="banner"
              className="w-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="accent">{resolvedArticle.category}</Chip>
            <span className="px-2.5 py-1 rounded-xl bg-surface-2 border border-border text-xs text-text-muted flex items-center gap-1 font-bold">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span>{resolvedArticle.readTime}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-surface-2 border border-border text-xs text-text-muted flex items-center gap-1 font-bold">
              <Calendar className="w-3.5 h-3.5 text-text-muted" />
              <span>نُشر: </span>
              <span className="font-mono">{resolvedArticle.publishedAt}</span>
            </span>
            {resolvedArticle.lastUpdated && (
              <span className="px-2.5 py-1 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-xs text-[#14B8A6] flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>آخر تحديث: </span>
                <span className="font-mono">{resolvedArticle.lastUpdated}</span>
              </span>
            )}
          </div>

          <h1 dir="rtl" className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-heading leading-tight tracking-tight [unicode-bidi:plaintext] text-right">
            {resolvedArticle.title}
          </h1>

          {resolvedArticle.subtitle && (
            <p dir="rtl" className="text-base sm:text-lg text-text-muted leading-relaxed font-normal [unicode-bidi:plaintext] text-right">
              {resolvedArticle.subtitle}
            </p>
          )}

          {/* بطاقة كاتب المقال */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border/80 w-fit">
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center font-bold shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-text-heading">{resolvedArticle.author}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-accent/15 text-teal-700 dark:text-teal-400 font-bold">
                  كاتب معتمد
                </span>
              </div>
              <span className="text-xs text-text-muted">{resolvedArticle.authorRole}</span>
            </div>
          </div>
        </header>

        {/* صندوق الخلاصة التنفيذية السريعة والإجابة المباشرة (Quick Answer & Key Takeaways) بتصميم أكاديمي زمردي */}
        <div
          className="max-w-4xl mx-auto rounded-3xl p-5 sm:p-7 border border-[#14B8A6]/40 dark:border-[#14B8A6]/50 bg-gradient-to-br from-[#14B8A6]/10 via-surface to-surface-2 dark:from-[#14B8A6]/15 shadow-sm text-right space-y-4"
          dir="rtl"
        >
          <div className="flex items-center gap-2 text-text-heading font-black text-base sm:text-lg">
            <div className="w-8 h-8 rounded-xl bg-[#14B8A6] text-white flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <h2>الخلاصة التنفيذية السريعة (Quick Answer & Key Takeaways)</h2>
          </div>

          {/* جملة التعريف الحاسمة المستقلة (Definition Lead) المهيكلة لمحركات الذكاء الاصطناعي */}
          {resolvedArticle.definitionLead && (
            <div className="p-4 rounded-2xl bg-surface/90 border border-[#14B8A6]/30 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-[#14B8A6]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الإجابة الحاسمة المباشرة (Direct Answer / Definition):</span>
              </div>
              <p dir="rtl" className="text-sm sm:text-base font-bold text-text-heading leading-relaxed [unicode-bidi:plaintext] text-right">
                {resolvedArticle.definitionLead}
              </p>
            </div>
          )}

          {/* النقاط والمحاور الأساسية */}
          {((resolvedArticle.quickTakeaways && resolvedArticle.quickTakeaways.length > 0)
            ? resolvedArticle.quickTakeaways
            : resolvedArticle.keyTakeaways || []
          ).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {((resolvedArticle.quickTakeaways && resolvedArticle.quickTakeaways.length > 0)
                ? resolvedArticle.quickTakeaways
                : resolvedArticle.keyTakeaways || []
              ).map((takeaway, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-surface/80 border border-border/70 text-xs sm:text-[13px] leading-relaxed text-text font-bold"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* جسم وفصول المقال المنسقة للقراءة المريحة */}
        <article className="max-w-4xl mx-auto space-y-8 text-right" dir="rtl">
          {(resolvedArticle.sections || []).map((sec, idx) => {
            const hasCallout = Boolean(sec.callout);
            const callout = sec.callout;
            const hasTable = Boolean(sec.table && sec.table.headers && sec.table.rows);
            const table = sec.table;

            return (
              <section
                key={idx}
                className="space-y-4 bg-surface/50 p-5 sm:p-7 rounded-3xl border border-border/60 hover:border-border transition-colors"
              >
                <h3 dir="rtl" className="text-lg sm:text-xl font-black text-text-heading border-r-4 border-accent pr-3 [unicode-bidi:plaintext] text-right">
                  {sec.heading}
                </h3>

                <FormattedArticleText content={sec.body} />

                {/* كود برمجي مستقل داخل الفصل إن وجد */}
                {sec.code && (
                  <div className="w-full overflow-x-auto rounded-xl border border-border/80 bg-slate-950 dark:bg-black/90 p-3.5 my-3 shadow-inner">
                    {sec.codeTitle && (
                      <div className="text-[11px] font-mono font-bold text-accent mb-1.5 flex items-center gap-1.5" dir="ltr">
                        <Terminal className="w-3.5 h-3.5 text-accent" />
                        <span># {sec.codeTitle}</span>
                      </div>
                    )}
                    <pre dir="ltr" className="text-left overflow-x-auto font-mono text-xs text-emerald-400">
                      <code dir="ltr" className="text-left font-mono block leading-relaxed whitespace-pre">
                        {sec.code.trim()}
                      </code>
                    </pre>
                  </div>
                )}

                {/* جدول مقارنة منهجي داخل الفصل إن وجد محاط بحاوية تمرير أفقي مستجيبة ومؤشر بصري للهاتف */}
                {hasTable && (
                  <div className="w-full overflow-x-auto rounded-xl border border-border/80 bg-surface shadow-sm my-3">
                    <div className="sm:hidden flex items-center justify-between px-3 py-1.5 bg-accent/10 border-b border-border/60 text-[10px] text-accent font-bold select-none">
                      <span>⟵ اسحب أفقياً لتصفح كامل أعمدة الجدول</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/20 font-mono">جدول متجاوب</span>
                    </div>
                    <table className="w-full text-right text-xs border-collapse">
                      <thead className="bg-surface-2 border-b border-border text-text-heading font-extrabold">
                        <tr>
                          {table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-surface">
                        {table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-accent-soft/20 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`p-3 leading-relaxed ${
                                  cIdx === 0 ? 'font-bold text-text-heading' : 'text-text-muted'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* صندوق الملاحظة المنهجية (Callout) */}
                {hasCallout && (
                  <div
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      callout.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                        : callout.type === 'tip'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                        : 'bg-accent-soft border-accent/30 text-text'
                    }`}
                  >
                    {callout.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    ) : callout.type === 'tip' ? (
                      <Lightbulb className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      {callout.title && (
                        <h4 className="text-xs font-black text-text-heading">{callout.title}</h4>
                      )}
                      <p className="text-xs leading-relaxed">{callout.text}</p>
                    </div>
                  </div>
                )}
              </section>
            );
          })}

          {/* جدول المقارنة المهيكل المستقل المخصص للاقتباس المباشر من نماذج الذكاء الاصطناعي (GEO) */}
          {resolvedArticle.comparisonTable &&
            resolvedArticle.comparisonTable.headers &&
            resolvedArticle.comparisonTable.rows && (
              <section
                className="space-y-3 bg-surface/60 p-5 sm:p-7 rounded-3xl border border-[#14B8A6]/30 dark:border-[#14B8A6]/40 shadow-sm"
                dir="rtl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-r-4 border-[#14B8A6] pr-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-text-heading flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#14B8A6]" />
                      <span>جدول المقارنة المنهجي المهيكل (Structured Comparison Matrix)</span>
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      مصفوفة تحليلية متكاملة مهيكلة لاقتباسات محركات الإجابة التوليدية والباحثين
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] font-bold border border-[#14B8A6]/20">
                    مهيكل لـ GEO / LLMs
                  </span>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-border/80 bg-surface shadow-sm my-3">
                  {/* مؤشر بصري ناعم على شاشات الهاتف للتمرير الأفقي */}
                  <div className="sm:hidden flex items-center justify-between px-3.5 py-2 bg-accent/10 border-b border-border/60 text-[10px] text-accent font-bold select-none">
                    <span>⟵ اسحب أفقياً لتصفح كامل أعمدة المصفوفة</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/20 font-mono">مصفوفة GEO</span>
                  </div>
                  <table className="w-full text-right text-xs border-collapse">
                    <thead className="bg-surface-2 border-b border-border text-text-heading font-extrabold">
                      <tr>
                        {resolvedArticle.comparisonTable.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3.5 whitespace-nowrap bg-surface-2 text-text-heading font-black">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 bg-surface">
                      {resolvedArticle.comparisonTable.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-[#14B8A6]/5 transition-colors odd:bg-surface even:bg-surface-2/40"
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`p-3.5 leading-relaxed ${
                                cIdx === 0 ? 'font-black text-text-heading bg-surface-2/30' : 'text-text'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          {/* قسم الأسئلة الشائعة الحوارية (Conversational FAQs) في نهاية المقال */}
          {resolvedArticle.faqs && resolvedArticle.faqs.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-border" dir="rtl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-text-heading flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#14B8A6]" />
                    <span>الأسئلة الشائعة والأكثر بحثاً (Conversational FAQs)</span>
                  </h3>
                  <p className="text-xs text-text-muted">
                    إجابات موجزة ودقيقة وفق استفسارات المستخدمين في جوجل ونماذج الذكاء الاصطناعي (ChatGPT & Perplexity)
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-xl bg-surface-2 border border-border text-text-muted font-bold">
                  {resolvedArticle.faqs.length} أسئلة شائعة
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {resolvedArticle.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    open={idx === 0}
                    className="group rounded-2xl bg-surface border border-border/70 p-4 open:border-[#14B8A6]/40 transition-all duration-200"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-sm text-text-heading select-none">
                      <span className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center text-xs font-black shrink-0">
                          {idx + 1}
                        </span>
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-text-muted transition-transform duration-200 group-open:rotate-180 shrink-0" />
                    </summary>
                    <div className="pt-3 pr-8 text-xs sm:text-sm text-text leading-relaxed border-t border-border/50 mt-3 font-normal">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* شارات الكلمات المفتاحية القوية للسيو ومحركات الإجابة (SEO & GEO Keywords) */}
          {resolvedArticle.seoKeywords && resolvedArticle.seoKeywords.length > 0 && (
            <div className="pt-4 flex flex-wrap items-center gap-2 border-t border-border" dir="rtl">
              <span className="text-xs font-bold text-text-muted flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>الكلمات المفتاحية للسيو ومحركات الإجابة (SEO & GEO Keywords):</span>
              </span>
              {resolvedArticle.seoKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 text-xs font-bold hover:bg-[#14B8A6]/20 transition-colors"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}

          {/* الوسوم والمواضيع التقليدية */}
          {activeArticle.tags && activeArticle.tags.length > 0 && (
            <div className="pt-3 flex flex-wrap items-center gap-2 border-t border-border/60">
              <span className="text-xs font-bold text-text-muted">الوسوم والمواضيع:</span>
              {activeArticle.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-surface-2 border border-border text-xs text-text-muted font-bold hover:text-accent transition-colors"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* قسم تفاعلي: المسارات والدورات العملية المرتبطة بهذا المقال */}
        {relatedCourses.length > 0 && (
          <section className="max-w-4xl mx-auto pt-8 border-t border-border space-y-4 text-right" dir="rtl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-text-heading flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-accent" />
                  <span>المسارات والدورات العملية المرتبطة بهذا المقال</span>
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  انتقل مباشرة لتطبيق ما تعلمته في هذا المقال عبر شروحات يوتيوب المنظمة
                </p>
              </div>
              <Chip tone="accent">{relatedCourses.length} مسارات معتمدة</Chip>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {relatedCourses.map((rc) => {
                const primaryInst = rc.instructors?.[0] || {
                  name: rc.instructor || 'محاضر معتمد',
                  lessonsCount: rc.lessonsCount || 20,
                  durationText: rc.runtime || '15 ساعة'
                };
                const thumb =
                  rc.thumbnail ||
                  `https://i.ytimg.com/vi/${rc.youtubeId || 'wHIdCNIQHpo'}/hqdefault.jpg`;

                return (
                  <Card
                    key={rc.id}
                    interactive
                    onClick={() => onWatchCourse && onWatchCourse(rc.id)}
                    className="p-3.5 flex items-center gap-3.5 group hover:border-accent bg-surface hover:-translate-y-0.5 transition-all text-right"
                  >
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface-2 shrink-0 relative">
                      <img
                        src={thumb}
                        alt={rc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className="font-extrabold text-accent truncate">{rc.category}</span>
                        <span className="font-mono text-text-muted">{primaryInst.durationText}</span>
                      </div>
                      <h4 className="text-xs font-black text-text-heading truncate group-hover:text-accent transition-colors">
                        {rc.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-text-muted pt-0.5">
                        <span className="truncate">{primaryInst.name}</span>
                        <span className="text-accent font-extrabold inline-flex items-center gap-0.5 shrink-0">
                          <span>مشاهدة</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ==========================================
  // وضع فهرس المجلة (Articles Directory Mode)
  // ==========================================
  return (
    <div className="space-y-7 animate-smooth">
      {/* حقن مخطط CollectionPage و ItemList الخاص بفهرس مقالات المنصة */}
      <ArticleCollectionJsonLd articles={articles} />

      {/* 1. المقال المميز العلوي (Hero Featured Article) */}
      {heroArticle && !searchQuery && selectedCategory === 'الكل' && !onlyBookmarked && (
        <Card
          as="section"
          className="relative overflow-hidden p-6 sm:p-8 border-accent/40 bg-gradient-to-br from-accent/15 via-surface to-surface-2 shadow-lg"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-6 text-right" dir="rtl">
            <div className="space-y-3.5 flex-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-accent text-accent-ink text-xs font-black flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>مقال الأسبوع المميز</span>
                </span>
                <Chip tone="neutral">{heroArticle.category}</Chip>
                <span className="px-2 py-0.5 rounded-lg bg-surface/80 border border-border text-[11px] text-text-muted font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-accent" />
                  <span>{heroArticle.readTime}</span>
                </span>
              </div>

              <h2
                dir="rtl"
                onClick={() => openArticle(heroArticle.id)}
                className="text-xl sm:text-2xl lg:text-3xl font-black text-text-heading hover:text-accent transition-colors cursor-pointer leading-snug [unicode-bidi:plaintext] text-right"
              >
                {heroArticle.title}
              </h2>

              <p dir="rtl" className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3 [unicode-bidi:plaintext] text-right">
                {heroArticle.summary}
              </p>

              {/* الكاتب والوسوم وزر القراءة */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <span className="font-extrabold text-text-heading">{heroArticle.author}</span>
                  <span>•</span>
                  <span>{heroArticle.authorRole}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={(e) => toggleBookmarkArticle(e, heroArticle.id)}
                    className="h-9 px-3 text-xs"
                    title="حفظ المقال"
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        bookmarkedArticleIds.includes(heroArticle.id) ? 'fill-current text-accent' : ''
                      }`}
                    />
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => openArticle(heroArticle.id)}
                    className="h-9 px-4 text-xs font-black flex items-center gap-1.5 shadow-sm"
                  >
                    <span>اقرأ المقال كاملاً</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </Button>
                </div>
              </div>
            </div>

            {/* الجانب البصري والتطبيقي المصاحب: الغلاف الهندسي وصندوق المسارات وأهم المحاور */}
            <div className="w-full lg:w-80 shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              {/* الغلاف البصري الهندسي الأكاديمي لمقال الأسبوع المميز */}
              <div
                onClick={() => openArticle(heroArticle.id)}
                className="group cursor-pointer w-full sm:flex-1 lg:flex-none overflow-hidden rounded-2xl border border-border/70 shadow-sm transition-all duration-300 hover:border-accent/60"
                title="اقرأ مقال الأسبوع المميز"
              >
                <ArticleCoverGraphic
                  article={heroArticle}
                  variant="hero"
                  className="w-full h-36 sm:h-40"
                />
              </div>

              {/* بطاقة جانبية سريعة لعدد المسارات المرتبطة وأهم النقاط */}
              <div className="w-full sm:flex-1 lg:flex-none p-3.5 sm:p-4 rounded-2xl bg-surface/90 border border-border/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-text-muted">المسارات المرتبطة:</span>
                  <span className="text-accent font-mono">
                    {(heroArticle.relatedCourseIds || []).length} مسارات أكاديمية
                  </span>
                </div>

                <div className="space-y-1.5 border-t border-border/60 pt-2">
                  <span className="text-[11px] font-bold text-text-heading block">
                    أهم المحاور في المقال:
                  </span>
                  {(heroArticle.keyTakeaways || []).slice(0, 2).map((k, i) => (
                    <p key={i} className="text-[11px] text-text-muted leading-tight flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-accent shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{k}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 2. شريط البحث والفلترة بالتصنيفات والمحفوظات */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* حقل البحث الذكي في المقالات */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 pointer-events-none text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في عناوين ومحتوى ووسوم وكلمات المقالات..."
              className="w-full h-10 text-xs rounded-xl pl-9 pr-9 bg-surface-2 text-text placeholder:text-text-muted border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-text-muted hover:text-text-heading"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* زر فلترة المحفوظات + عداد المقالات */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant={onlyBookmarked ? 'primary' : 'secondary'}
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className="h-10 px-3.5 text-xs font-bold flex items-center gap-1.5"
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
              <span>المحفوظات ({bookmarkedArticleIds.length})</span>
            </Button>

            <span className="text-xs font-bold text-text-muted bg-surface-2 px-3 py-2.5 rounded-xl border border-border whitespace-nowrap">
              {filteredArticles.length} {filteredArticles.length >= 3 && filteredArticles.length <= 10 ? 'مقالات' : 'مقالاً'}
            </span>
          </div>
        </div>

        {/* أزرار الفئات والتصنيفات (Category Chips) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {ARTICLE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-accent text-accent-ink border-accent shadow-sm'
                    : 'bg-surface-2 border-border text-text-muted hover:text-text-heading hover:border-accent/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. شبكة بطاقات المقالات (Articles Grid) */}
      {filteredArticles.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="text-base font-black text-text-heading">لا توجد مقالات تطابق خيارات البحث</h3>
          <p className="text-xs text-text-muted">
            جرب تعديل كلمات البحث أو اختيار تصنيف آخر لإظهار المقالات التقنية
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('الكل');
              setOnlyBookmarked(false);
            }}
            className="text-xs mt-2"
          >
            إعادة تعيين الفلاتر
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 xl:gap-6">
          {filteredArticles.map((article) => {
            const isSaved = bookmarkedArticleIds.includes(article.id);
            const relatedCount = (article.relatedCourseIds || []).length;

            return (
              <Card
                key={article.id}
                interactive
                onClick={() => openArticle(article.id)}
                className="group flex flex-col h-full justify-between p-4 sm:p-5 hover:border-accent/60 hover:-translate-y-1 transition-all text-right shadow-sm bg-surface overflow-hidden"
                dir="rtl"
              >
                <div className="space-y-3 flex-1 flex flex-col">
                  {/* الغلاف البصري الهندسي أعلى البطاقة */}
                  <div className="w-full overflow-hidden rounded-xl border border-border/60 shadow-sm relative shrink-0">
                    <ArticleCoverGraphic
                      article={article}
                      variant="card"
                      className="h-36 sm:h-40 w-full"
                    />
                  </div>

                  {/* الشريط العلوي للبطاقة: التصنيف وزمن القراءة وحفظ المفضلة */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <Chip tone="accent">{article.category}</Chip>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-text-muted font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-text-muted" />
                        <span>{article.readTime}</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleBookmarkArticle(e, article.id)}
                        className={`w-7 h-7 rounded-lg border transition-colors flex items-center justify-center ${
                          isSaved
                            ? 'bg-accent text-accent-ink border-accent'
                            : 'bg-surface-2 border-border text-text-muted hover:text-text-heading'
                        }`}
                        title={isSaved ? 'إزالة من المحفوظات' : 'حفظ في قائمتي'}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* عنوان المقال */}
                  <h3 dir="rtl" className="text-base font-extrabold text-text-heading group-hover:text-accent transition-colors line-clamp-2 leading-snug [unicode-bidi:plaintext] text-right">
                    {article.title}
                  </h3>

                  {/* ملخص المقال أو التعريف الحاسم */}
                  <p dir="rtl" className="text-xs text-text-muted line-clamp-3 leading-relaxed [unicode-bidi:plaintext] text-right">
                    {article.definitionLead || article.summary}
                  </p>
                </div>

                {/* ذيل البطاقة: الكاتب والمسارات وزر اقرأ */}
                <div className="pt-4 mt-auto border-t border-border flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <span className="font-extrabold text-text-heading block truncate text-[11px]" dir="rtl">
                      {article.author}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {relatedCount} مسارات مرتبطة
                    </span>
                  </div>

                  <span className="font-extrabold inline-flex items-center gap-1 text-teal-700 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform text-xs shrink-0">
                    <span>قراءة</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
