import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Sparkles, FolderDown, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { EBOOK_GUIDES } from '../../src/data/ebooks';
import { LibraryProvider } from '../../src/context/LibraryContext';
import StandaloneHeader from '../../src/components/StandaloneHeader';
import BooksExplorer from '../../src/components/BooksExplorer';
import Footer from '../../src/components/Footer';

export const dynamic = 'force-static';

const siteUrl = 'https://aiprodzone.com';
const canonicalUrl = `${siteUrl}/books`;

export const metadata: Metadata = {
  title: 'مكتبة الكتب والأدلة الرقمية (114 دليلاً تطبيقياً) | AIProdZone — الدليل الأكاديمي العربي',
  description:
    '114 كتاباً ودليلاً تطبيقياً سحابياً مجانياً 100% يغطي مسارات البرمجة، هندسة النظم، أدوات الذكاء الاصطناعي، التصميم، وتطوير المنتجات التقنية.',
  keywords: [
    'كتب برمجية مجانية',
    'أدلة ذكاء اصطناعي 2026',
    'كتب علوم الحاسوب',
    'كتب بايثون وجافاسكريبت',
    'AIProdZone',
    'كتب أمن سيبراني',
    'أدلة معمارية البرمجيات'
  ],
  alternates: {
    canonical: canonicalUrl
  },
  openGraph: {
    title: 'مكتبة الكتب والأدلة الرقمية (114 دليلاً تطبيقياً) | AIProdZone',
    description:
      '114 كتاباً ودليلاً تطبيقياً سحابياً مجانياً 100% يغطي مسارات البرمجة، هندسة النظم، أدوات الذكاء الاصطناعي، وتطوير المنتجات التقنية.',
    url: canonicalUrl,
    siteName: 'AIProdZone',
    locale: 'ar_AR',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/brand-banner.png`,
        width: 1200,
        height: 630,
        alt: 'مكتبة الكتب والأدلة الرقمية — AIProdZone'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مكتبة الكتب والأدلة الرقمية (114 دليلاً تطبيقياً) | AIProdZone',
    description:
      '114 كتاباً ودليلاً تطبيقياً سحابياً مجانياً 100% يغطي مسارات البرمجة، أدوات الذكاء الاصطناعي، وتطوير البرمجيات.',
    images: [`${siteUrl}/brand-banner.png`]
  }
};

export default function BooksPage() {
  // إعداد مخطط البيانات المهيكلة المزدوجة JSON-LD (CollectionPage + ItemList + BreadcrumbList)
  const jsonLdGraph = [
    {
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#collection`,
      url: canonicalUrl,
      name: 'مكتبة الكتب والأدلة الرقمية التقنية',
      description:
        'فهرس شامل يضم 114 دليلاً ومرجعاً برمجياً وتقنياً في مسارات علوم الحاسوب، الذكاء الاصطناعي، وهندسة البرمجيات.',
      inLanguage: 'ar',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'AIProdZone',
        url: siteUrl
      }
    },
    {
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#itemlist`,
      name: 'قائمة الكتب والأدلة الرقمية الـ 114',
      numberOfItems: EBOOK_GUIDES.length,
      itemListElement: EBOOK_GUIDES.map((book: any, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: book.title,
        description: book.excerpt || book.categoryNameEn || book.category,
        url: `${canonicalUrl}?read=${book.id}`
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
          name: 'الكتب والأدلة الرقمية',
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

        <StandaloneHeader current="ebooks" />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* مسار التنقل الدلالي (Breadcrumbs) */}
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted flex items-center gap-1.5" dir="rtl">
            <Link href="/" className="hover:text-accent transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-text font-bold">الكتب والأدلة الرقمية</span>
          </nav>

          {/* ترويسة قسم الكتب الدلالي المسبق الرندر للـ SEO */}
          <header className="space-y-4 text-right max-w-3xl ml-auto" dir="rtl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-accent-ink dark:text-accent text-xs font-bold">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>مكتبة الكتب والأدلة الرقمية (114 دليلاً تطبيقياً)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-heading leading-tight tracking-tight">
              المكتبة السحابية الشاملة للأدلة والكتب التقنية
            </h1>

            <p className="text-sm sm:text-base text-text-muted leading-relaxed font-normal">
              114 كتاباً ودليلاً تطبيقياً ومراجع معمارية متقدمة في علوم الحاسوب، الذكاء الاصطناعي، تطوير الويب، أدوات Adobe، والإضافات البرمجية، متوفرة مجاناً 100% بروابط مباشرة وصفر بايت على جهازك.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-text-muted">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>100% مجانية وبلا إعلانات</span>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>روابط سحابية مباشرة ونظيفة</span>
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>محدثة لعام 2026</span>
              </span>
            </div>
          </header>

          {/* مستكشف وفهرس الكتب التفاعلي */}
          <BooksExplorer initialBooks={EBOOK_GUIDES} />

          {/* فهرس دلالي نصي مسبق الرندر في الـ HTML لمحركات البحث وبوتات الزحف */}
          <section className="sr-only" aria-label="فهرس الكتب الأكاديمي الدلالي">
            <h2>قائمة كافة الكتب والمراجع التقنية المتاحة</h2>
            <ul>
              {EBOOK_GUIDES.map((book: any) => (
                <li key={book.id}>
                  <h3>{book.title}</h3>
                  <p>{book.excerpt || book.categoryNameEn || book.category}</p>
                  <a href={`/books?read=${book.id}`}>{book.title}</a>
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
