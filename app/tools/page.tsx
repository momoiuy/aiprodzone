import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Wrench, Sparkles, CheckCircle2, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { CURATED_AI_TOOLS } from '../../src/data/tools';
import { LibraryProvider } from '../../src/context/LibraryContext';
import StandaloneHeader from '../../src/components/StandaloneHeader';
import ToolsExplorer from '../../src/components/ToolsExplorer';
import Footer from '../../src/components/Footer';

export const dynamic = 'force-static';

const siteUrl = 'https://aiprodzone.com';
const canonicalUrl = `${siteUrl}/tools`;

export const metadata: Metadata = {
  title: 'دليل ومقارنة أفضل أدوات الذكاء الاصطناعي والبرمجة 2026 | AIProdZone',
  description:
    'جدول مقارنة منهجي وشامل لأفضل أدوات الذكاء الاصطناعي، بيئات التطوير، البرمجة التوليدية، ومولدات الفيديو والوسائط المتعددة الموصى بها هندسياً.',
  keywords: [
    'أدوات الذكاء الاصطناعي 2026',
    'مقارنة نماذج الذكاء الاصطناعي',
    'أدوات البرمجة للمطورين',
    'Cursor و Claude',
    'ComfyUI و Flux',
    'AIProdZone',
    'أدوات الأتمتة والوكلاء الأذكياء'
  ],
  alternates: {
    canonical: canonicalUrl
  },
  openGraph: {
    title: 'دليل ومقارنة أفضل أدوات الذكاء الاصطناعي والبرمجة 2026 | AIProdZone',
    description:
      'جدول مقارنة منهجي وشامل لأفضل أدوات الذكاء الاصطناعي، بيئات التطوير، البرمجة التوليدية، والوسائط المتعددة الموصى بها هندسياً.',
    url: canonicalUrl,
    siteName: 'AIProdZone',
    locale: 'ar_AR',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/brand-banner.png`,
        width: 1200,
        height: 630,
        alt: 'مقارنة أدوات الذكاء الاصطناعي — AIProdZone'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'دليل ومقارنة أفضل أدوات الذكاء الاصطناعي والبرمجة 2026 | AIProdZone',
    description:
      'جدول مقارنة منهجي وشامل لأفضل أدوات الذكاء الاصطناعي، بيئات التطوير، والبرمجة التوليدية.',
    images: [`${siteUrl}/brand-banner.png`]
  }
};

export default function ToolsPage() {
  // إعداد مخطط البيانات المهيكلة ItemList + BreadcrumbList JSON-LD
  const jsonLdGraph = [
    {
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#toolslist`,
      name: 'قائمة أفضل أدوات الذكاء الاصطناعي والبرمجة الموصى بها لعام 2026',
      description: 'جدول مقارنة تفصيلي لأدوات الذكاء الاصطناعي والبرمجة وصناعة الوسائط والأتمتة.',
      numberOfItems: CURATED_AI_TOOLS.length,
      itemListElement: CURATED_AI_TOOLS.map((tool, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: tool.name,
        description: tool.description,
        url: tool.url
      }))
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'الرئيسية',
          item: siteUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'مقارنة الأدوات الذكية',
          item: canonicalUrl
        }
      ]
    }
  ];

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': jsonLdGraph
  };

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

        <StandaloneHeader current="tools" />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* مسار التنقل الدلالي (Breadcrumbs) */}
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted flex items-center gap-1.5" dir="rtl">
            <Link href="/" className="hover:text-accent transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-text font-bold">مقارنة الأدوات البرمجية والذكية</span>
          </nav>

          {/* ترويسة قسم الأدوات الدلالي المسبق الرندر للـ SEO */}
          <header className="space-y-4 text-right max-w-3xl ml-auto" dir="rtl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-accent-ink dark:text-accent text-xs font-bold">
              <Wrench className="w-4 h-4 text-accent" />
              <span>دليل أدوات الذكاء الاصطناعي والبرمجة الموصى بها ({CURATED_AI_TOOLS.length} أدوات معتمدة)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-heading leading-tight tracking-tight">
              مقارنة أدوات الذكاء الاصطناعي وهندسة البرمجيات
            </h1>

            <p className="text-sm sm:text-base text-text-muted leading-relaxed font-normal">
              جدول مقارنة هندسي محايد ومحدث لعام 2026 يرتب أفضل نماذج التوليد، بيئات البرمجة الذكية، أدوات صناعة الفيديو السينمائي، وأطر تشغيل النماذج المحلية وفق معايير الكفاءة والتكلفة وتكامل الأنظمة.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-text-muted">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>تقييمات واقعية وموثوقة</span>
              </span>
              <span className="flex items-center gap-1">
                <Terminal className="w-4 h-4 text-accent" />
                <span>أوامر CLI جاهزة للتشغيل</span>
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>تحديثات مستمرة 2026</span>
              </span>
            </div>
          </header>

          {/* واجهة جدول وبطاقات المقارنة التفاعلية */}
          <ToolsExplorer initialTools={CURATED_AI_TOOLS} />

          {/* محتوى دلالي إضافي لمحركات البحث وبوتات الإجابة الذكية */}
          <section className="sr-only" aria-label="فهرس الأدوات الدلالي">
            <h2>قائمة كافة الأدوات الذكية الموصى بها</h2>
            <ul>
              {CURATED_AI_TOOLS.map((tool) => (
                <li key={tool.id}>
                  <h3>{tool.name}</h3>
                  <p>{tool.category}</p>
                  <p>{tool.description}</p>
                  <a href={tool.url}>{tool.name}</a>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <Footer />
      </div>
    </LibraryProvider>
  );
}
