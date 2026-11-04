import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  HelpCircle,
  GraduationCap,
  ArrowRight,
  BookOpen,
  ArrowUpRight,
  Tag,
  Terminal,
  Layers
} from 'lucide-react';
import { INITIAL_ARTICLES, resolveArticleGeoSeo } from '../../../src/data/articles';
import { INITIAL_COURSES } from '../../../src/data/courses';
import { LibraryProvider } from '../../../src/context/LibraryContext';
import StandaloneHeader from '../../../src/components/StandaloneHeader';
import ArticleInteractiveBar from '../../../src/components/ArticleInteractiveBar';
import FormattedArticleContent from '../../../src/components/FormattedArticleContent';
import ArticleCoverGraphic from '../../../src/components/ArticleCoverGraphic';
import Footer from '../../../src/components/Footer';

export const dynamic = 'force-static';

interface PageProps {
  params: {
    id: string;
  };
}

/**
 * 1. توليد المسارات الثابتة لكافة المقالات الـ 18 أثناء البناء (SSG)
 */
export function generateStaticParams() {
  return INITIAL_ARTICLES.map((article) => ({
    id: article.id
  }));
}

/**
 * 2. توليد بيانات الميتا الفردية وعنوان الصفحة ورابط Canonical لكل مقال في HTML الخام
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = INITIAL_ARTICLES.find((a) => a.id === params.id || a.slug === params.id);
  if (!article) {
    return {
      title: 'المقال غير موجود | AIProdZone',
      description: 'عذراً، المقال المطلوب غير موجود في قاعدة بيانات AIProdZone.'
    };
  }

  const resolved = resolveArticleGeoSeo(article);
  const fullTitle = `${article.title} | AIProdZone — الدليل الأكاديمي العربي`;
  const description = resolved?.definitionLead || article.summary;
  const canonicalUrl = `https://aiprodzone.com/articles/${article.id}`;
  const keywords =
    resolved?.seoKeywords && resolved.seoKeywords.length > 0
      ? resolved.seoKeywords
      : article.tags;

  return {
    title: {
      absolute: fullTitle
    },
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'AIProdZone',
      locale: 'ar_AR',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.lastUpdated || article.publishedAt,
      authors: [article.author],
      tags: article.tags,
      images: [
        {
          url: 'https://aiprodzone.com/brand-banner.png',
          width: 1200,
          height: 630,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['https://aiprodzone.com/brand-banner.png']
    }
  };
}

/**
 * 3. المكون الخادمي الكامل للمقال: رندر نصوص دلالية 100% في SSR مع JSON-LD متكامل
 */
export default function ArticlePage({ params }: PageProps) {
  const article = INITIAL_ARTICLES.find((a) => a.id === params.id || a.slug === params.id);
  if (!article) {
    notFound();
  }

  const resolved = resolveArticleGeoSeo(article) || article;
  const canonicalUrl = `https://aiprodzone.com/articles/${article.id}`;
  const baseUrl = 'https://aiprodzone.com';

  const relatedCourses = (article.relatedCourseIds || [])
    .map((cId: string) => (INITIAL_COURSES as any[]).find((c) => c.id === cId))
    .filter(Boolean);

  // إعداد مخطط البيانات المهيكلة المزدوجة JSON-LD (TechArticle + FAQPage + BreadcrumbList)
  const jsonLdGraph: any[] = [
    {
      '@type': 'TechArticle',
      '@id': `${canonicalUrl}#techarticle`,
      url: canonicalUrl,
      headline: article.title,
      alternativeHeadline: article.subtitle || undefined,
      description: resolved.definitionLead || article.summary,
      inLanguage: 'ar',
      datePublished: article.publishedAt,
      dateModified: article.lastUpdated || article.publishedAt || '2026-11-01',
      author: {
        '@type': 'Person',
        name: article.author,
        jobTitle: article.authorRole
      },
      publisher: {
        '@type': 'Organization',
        name: 'AIProdZone',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/brand-banner.png`
        }
      },
      keywords: (resolved.seoKeywords || article.tags || []).join(', '),
      articleSection: article.category,
      timeRequired: article.readTime,
      about: {
        '@type': 'Thing',
        name: article.title,
        description: resolved.definitionLead
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'الرئيسية',
          item: baseUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'المقالات التقنية',
          item: `${baseUrl}/articles`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: canonicalUrl
        }
      ]
    }
  ];

  if (resolved.faqs && Array.isArray(resolved.faqs) && resolved.faqs.length > 0) {
    jsonLdGraph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: resolved.faqs.map((f: { question: string; answer: string }) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    });
  }

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': jsonLdGraph
  };

  const takeaways =
    resolved.quickTakeaways && resolved.quickTakeaways.length > 0
      ? resolved.quickTakeaways
      : resolved.keyTakeaways || [];

  return (
    <LibraryProvider>
      <div
        dir="ltr"
        className="min-h-screen bg-bg text-text font-arabic antialiased flex flex-col selection:bg-accent selection:text-accent-ink"
      >
        {/* حقن مخطط JSON-LD الكامل مباشرة داخل السيرفر */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />

        <StandaloneHeader current="articles" />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
          {/* شريط الإجراءات والتقدم التفاعلي */}
          <ArticleInteractiveBar
            articleId={article.id}
            articleSlug={article.slug}
            articleTitle={article.title}
          />

          {/* مسار التنقل الدلالي (Breadcrumbs) */}
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted flex items-center gap-1.5" dir="rtl">
            <Link href="/" className="hover:text-accent transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-accent transition-colors">
              المقالات التقنية
            </Link>
            <span>/</span>
            <span className="text-text font-bold truncate max-w-xs sm:max-w-md">{article.title}</span>
          </nav>

          {/* متن المقال الدلالي الكامل (HTML الخام الذي تقرأه محركات البحث وبوتات الذكاء الاصطناعي) */}
          <article className="space-y-8 text-right" dir="rtl">
            {/* غلاف ورأس المقال */}
            <header className="space-y-4 border-b border-border/80 pb-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-accent/15 text-accent-ink dark:text-accent font-bold">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-text-muted font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.publishedAt}</span>
                </span>
                <span className="flex items-center gap-1 text-text-muted font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime}</span>
                </span>
                {article.featured && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                    مقال مرجعي مميز
                  </span>
                )}
              </div>

              {/* غلاف هندسي رسومي متقدم */}
              <div className="rounded-3xl overflow-hidden border border-border/70 shadow-sm my-3">
                <ArticleCoverGraphic article={article} variant="hero" />
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-text-heading leading-tight tracking-tight">
                {article.title}
              </h1>

              {article.subtitle && (
                <p className="text-base sm:text-xl text-text-muted leading-relaxed font-normal">
                  {article.subtitle}
                </p>
              )}

              {/* بطاقة كاتب المقال */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border/80 w-fit">
                <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center font-bold shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-text-heading">{article.author}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-teal-700 dark:text-teal-400 font-bold">
                      كاتب معتمد
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">{article.authorRole}</span>
                </div>
              </div>
            </header>

            {/* صندوق الخلاصة التنفيذية والإجابة المباشرة (GEO Lead & Key Takeaways) */}
            <section
              className="rounded-3xl p-5 sm:p-7 border border-[#14B8A6]/40 dark:border-[#14B8A6]/50 bg-gradient-to-br from-[#14B8A6]/10 via-surface to-surface-2 dark:from-[#14B8A6]/15 shadow-sm space-y-4"
              aria-label="الخلاصة التنفيذية"
            >
              <div className="flex items-center gap-2 text-text-heading font-black text-base sm:text-lg">
                <div className="w-8 h-8 rounded-xl bg-[#14B8A6] text-white flex items-center justify-center shadow-sm shrink-0">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <h2 className="text-lg font-black">الخلاصة التنفيذية السريعة (Quick Answer & Key Takeaways)</h2>
              </div>

              {resolved.definitionLead && (
                <div className="p-4 rounded-2xl bg-surface/90 border border-[#14B8A6]/30 shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-[#14B8A6]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>الإجابة الحاسمة المباشرة (Direct Answer / Definition):</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-text-heading leading-relaxed">
                    {resolved.definitionLead}
                  </p>
                </div>
              )}

              {takeaways.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {takeaways.map((takeaway: string, idx: number) => (
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
            </section>

            {/* جدول المقارنة المنهجية المباشر إن وجد */}
            {resolved.comparisonTable && resolved.comparisonTable.headers && resolved.comparisonTable.rows && (
              <section className="space-y-3 bg-surface/60 p-5 rounded-3xl border border-border/70">
                <h2 className="text-lg font-black text-text-heading flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent" />
                  <span>جدول المقارنة المنهجية</span>
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-border/80">
                  <table className="w-full text-right text-xs sm:text-sm border-collapse">
                    <thead className="bg-surface-2 text-text-heading font-black border-b border-border">
                      <tr>
                        {resolved.comparisonTable.headers.map((h: string, hIdx: number) => (
                          <th key={hIdx} className="p-3 whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {resolved.comparisonTable.rows.map((row: string[], rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-surface-2/50 transition-colors">
                          {row.map((cell: string, cIdx: number) => (
                            <td key={cIdx} className="p-3 text-text">
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

            {/* فصول ومحاور المقال المنسقة للقراءة */}
            <div className="space-y-6">
              {(resolved.sections || []).map((sec: any, idx: number) => (
                <section
                  key={idx}
                  className="space-y-4 bg-surface/50 p-5 sm:p-7 rounded-3xl border border-border/60"
                >
                  <h2 className="text-lg sm:text-2xl font-black text-text-heading border-r-4 border-accent pr-3">
                    {sec.heading}
                  </h2>

                  <FormattedArticleContent content={sec.body} />

                  {/* كود برمجي مستقل داخل الفصل */}
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

                  {/* جدول فرعي مخصص داخل الفصل */}
                  {sec.table && sec.table.headers && sec.table.rows && (
                    <div className="overflow-x-auto rounded-2xl border border-border/80 my-3">
                      <table className="w-full text-right text-xs sm:text-sm border-collapse">
                        <thead className="bg-surface-2 text-text-heading font-black border-b border-border">
                          <tr>
                            {sec.table.headers.map((h: string, hIdx: number) => (
                              <th key={hIdx} className="p-3 whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {sec.table.rows.map((row: string[], rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-surface-2/50 transition-colors">
                              {row.map((cell: string, cIdx: number) => (
                                <td key={cIdx} className="p-3 text-text">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* قسم الأسئلة الشائعة (FAQ Section) الدلالي */}
            {resolved.faqs && Array.isArray(resolved.faqs) && resolved.faqs.length > 0 && (
              <section className="space-y-4 bg-surface/70 p-5 sm:p-7 rounded-3xl border border-border/80">
                <div className="flex items-center gap-2 text-text-heading">
                  <HelpCircle className="w-6 h-6 text-accent" />
                  <h2 className="text-xl sm:text-2xl font-black">الأسئلة الشائعة وإجابات الخبراء المباشرة</h2>
                </div>
                <div className="space-y-3 pt-2">
                  {resolved.faqs.map((faq: { question: string; answer: string }, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-surface border border-border/70 space-y-1.5">
                      <h3 className="text-sm sm:text-base font-black text-text-heading">
                        {faq.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* قسم المسارات الأكاديمية ذات الصلة */}
            {relatedCourses.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-border/70">
                <div className="flex items-center gap-2 text-text-heading">
                  <GraduationCap className="w-6 h-6 text-accent" />
                  <h2 className="text-xl font-black">المسارات الأكاديمية المعتمدة ذات الصلة بهذا المقال</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedCourses.map((rc: any) => (
                    <Link
                      key={rc.id}
                      href={`/tracks/${rc.id}`}
                      className="p-4 rounded-2xl bg-surface border border-border/80 hover:border-accent hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <span className="font-bold text-accent">{rc.domainTitle}</span>
                          <span className="font-mono">{rc.runtime || '20 ساعة'}</span>
                        </div>
                        <h3 className="font-extrabold text-sm sm:text-base text-text-heading group-hover:text-accent transition-colors">
                          {rc.title}
                        </h3>
                        <p className="text-xs text-text-muted line-clamp-2">
                          {rc.synopsis || rc.oneLineVerdict}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-accent pt-2 border-t border-border/50">
                        <span>بدء دراسة المسار</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* وسم المقال والكلمات الدلالية */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-border/60">
                <Tag className="w-4 h-4 text-accent ml-1" />
                <span className="text-xs font-bold text-text-muted">الوسوم:</span>
                {article.tags.map((tag: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </main>

        <Footer />
      </div>
    </LibraryProvider>
  );
}
