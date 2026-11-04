import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, Sparkles, Clock, Calendar, User, ArrowUpRight, BookOpen } from 'lucide-react';
import { INITIAL_ARTICLES, resolveArticleGeoSeo } from '../../src/data/articles';
import { ArticleCollectionJsonLd } from '../../src/components/ArticleJsonLd';
import { LibraryProvider } from '../../src/context/LibraryContext';
import StandaloneHeader from '../../src/components/StandaloneHeader';
import ArticleCoverGraphic from '../../src/components/ArticleCoverGraphic';
import Footer from '../../src/components/Footer';

export const dynamic = 'force-static';

const siteUrl = 'https://aiprodzone.com';

export const metadata: Metadata = {
  title: 'المقالات التقنية والأكاديمية المرجعية | AIProdZone — الدليل الأكاديمي العربي',
  description:
    '18 مقالاً هندسياً فائق العمق والتحليل المقارن يغطي لغات البرمجة، هندسة الحوسبة، الأمن السيبراني، والذكاء الاصطناعي مع المقارنات المعمارية وخارطة الطريق الأكاديمية.',
  keywords: [
    'مقالات برمجية',
    'تعلم البرمجة 2026',
    'مقارنات تقنية',
    'الذكاء الاصطناعي',
    'هندسة البرمجيات',
    'AIProdZone',
    'مقالات علوم الحاسوب'
  ],
  alternates: {
    canonical: `${siteUrl}/articles`
  },
  openGraph: {
    title: 'المقالات التقنية والأكاديمية المرجعية | AIProdZone — الدليل الأكاديمي العربي',
    description:
      '18 مقالاً هندسياً فائق العمق والتحليل المقارن يغطي لغات البرمجة، هندسة الحوسبة، الأمن السيبراني، والذكاء الاصطناعي.',
    url: `${siteUrl}/articles`,
    siteName: 'AIProdZone',
    locale: 'ar_AR',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/brand-banner.png`,
        width: 1200,
        height: 630,
        alt: 'المقالات التقنية — AIProdZone'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'المقالات التقنية والأكاديمية المرجعية | AIProdZone',
    description:
      '18 مقالاً هندسياً فائق العمق والتحليل المقارن يغطي لغات البرمجة، هندسة الحوسبة، والأمن السيبراني.',
    images: [`${siteUrl}/brand-banner.png`]
  }
};

export default function ArticlesHubPage() {
  return (
    <LibraryProvider>
      <div
        dir="ltr"
        className="min-h-screen bg-bg text-text font-arabic antialiased flex flex-col selection:bg-accent selection:text-accent-ink"
      >
        <ArticleCollectionJsonLd articles={INITIAL_ARTICLES} />
        <StandaloneHeader current="articles" />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
          {/* رأس قسم المقالات التقنية الدلالي */}
          <section className="text-right space-y-4 max-w-3xl ml-auto" dir="rtl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-accent-ink dark:text-accent text-xs font-bold">
              <Newspaper className="w-4 h-4 text-accent" />
              <span>مجلة المقالات التقنية المرجعية (18 مقالاً فائق العمق)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-text-heading leading-tight">
              المقالات التقنية والتحليلات المعمارية
            </h1>

            <p className="text-sm sm:text-lg text-text-muted leading-relaxed font-normal">
              تحليلات هندسية رصينة ومقارنات منهجية شاملة بين المناهج العربية الرائدة، مصممة لمساعدتك على اختيار المسار الأنسب وبناء مشاريع إنتاجية تواكب أعلى المعايير لعام 2026.
            </p>
          </section>

          {/* شبكة المقالات الـ 18 الدلالية المسبقة الرندر للـ SEO / GEO */}
          <section
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            dir="rtl"
            aria-label="قائمة المقالات المرجعية"
          >
            {INITIAL_ARTICLES.map((article) => {
              const resolved = resolveArticleGeoSeo(article) || article;
              return (
                <article
                  key={article.id}
                  className="rounded-3xl bg-surface border border-border/80 hover:border-accent hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <Link href={`/articles/${article.id}`} className="block overflow-hidden">
                    <ArticleCoverGraphic article={article} variant="card" />
                  </Link>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-md bg-accent/15 text-accent-ink dark:text-accent font-bold">
                          {article.category}
                        </span>
                        <span className="text-text-muted font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{article.readTime}</span>
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-black text-text-heading leading-snug group-hover:text-accent transition-colors">
                        <Link href={`/articles/${article.id}`}>
                          {article.title}
                        </Link>
                      </h2>

                      {resolved.definitionLead && (
                        <p className="text-xs sm:text-sm text-text-muted line-clamp-3 leading-relaxed">
                          {resolved.definitionLead}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-text-heading">{article.author}</span>
                      </div>

                      <Link
                        href={`/articles/${article.id}`}
                        className="font-bold text-accent inline-flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform"
                      >
                        <span>قراءة المقال</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </main>

        <Footer />
      </div>
    </LibraryProvider>
  );
}
