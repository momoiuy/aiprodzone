import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  FileText,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { LEGAL_PAGES, LEGAL_PAGES_LIST, getLegalPage } from '../../../src/data/legal-pages';
import { LibraryProvider } from '../../../src/context/LibraryContext';
import StandaloneHeader from '../../../src/components/StandaloneHeader';
import Footer from '../../../src/components/Footer';
import ContactFormSection from '../../../src/components/ContactFormSection';

export const dynamic = 'force-static';

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * 1. توليد المسارات الثابتة لكافة الصفحات القانونية والتنظيمية الخمس (SSG)
 */
export function generateStaticParams() {
  return LEGAL_PAGES_LIST.map((page) => ({
    slug: page.slug
  }));
}

/**
 * 2. توليد بيانات الميتا الدقيقة ورابط Canonical لكل صفحة حوكمة لرفع معيار E-E-A-T
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = getLegalPage(params.slug);
  if (!page || (params.slug !== 'about' && page.slug !== params.slug)) {
    return {
      title: 'الصفحة التنظيمية غير موجودة | AIProdZone',
      description: 'الصفحة القانونية المطلوبة غير موجودة في سجلات AIProdZone.'
    };
  }

  const fullTitle = `${page.title} | AIProdZone — الدليل الأكاديمي العربي`;
  const canonicalUrl = `https://aiprodzone.com/governance/${page.slug}`;

  return {
    title: {
      absolute: fullTitle
    },
    description: page.summary,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: fullTitle,
      description: page.summary,
      url: canonicalUrl,
      siteName: 'AIProdZone',
      locale: 'ar_AR',
      type: 'website',
      images: [
        {
          url: 'https://aiprodzone.com/brand-banner.png',
          width: 1200,
          height: 630,
          alt: page.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: page.summary,
      images: ['https://aiprodzone.com/brand-banner.png']
    }
  };
}

/**
 * 3. المكون الخادمي الكامل للصفحة التنظيمية والقانونية: HTML دلالي 100% مع JSON-LD متكامل
 */
export default function GovernancePage({ params }: PageProps) {
  const page = getLegalPage(params.slug);
  if (!page || (params.slug !== 'about' && page.slug !== params.slug)) {
    notFound();
  }

  const siteUrl = 'https://aiprodzone.com';
  const canonicalUrl = `${siteUrl}/governance/${page.slug}`;

  // تحديد نوع المخطط وفق الصفحة (AboutPage / ContactPage / WebPage)
  const schemaType =
    page.slug === 'about'
      ? 'AboutPage'
      : page.slug === 'contact'
      ? 'ContactPage'
      : 'WebPage';

  const jsonLdGraph: any[] = [
    {
      '@type': schemaType,
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: page.title,
      description: page.summary,
      inLanguage: 'ar',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'AIProdZone',
        url: siteUrl
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
          item: siteUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'الحوكمة والسياسات',
          item: `${siteUrl}/governance/about`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.title,
          item: canonicalUrl
        }
      ]
    }
  ];

  // إذا كانت صفحة الأسئلة الشائعة، نضيف FAQPage JSON-LD
  if (page.faqs && Array.isArray(page.faqs) && page.faqs.length > 0) {
    jsonLdGraph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: page.faqs.map((f: { question: string; answer: string }) => ({
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

        <StandaloneHeader />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* مسار التنقل الدلالي (Breadcrumbs) */}
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted flex items-center gap-1.5" dir="rtl">
            <Link href="/" className="hover:text-accent transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <span className="text-text-muted">الحوكمة والسياسات</span>
            <span>/</span>
            <span className="text-text font-bold truncate max-w-xs">{page.shortTitle || page.title}</span>
          </nav>

          {/* ترويسة الصفحة الدلالية للـ E-E-A-T */}
          <header className="space-y-4 text-right border-b border-border/80 pb-6" dir="rtl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full bg-accent/15 text-accent-ink dark:text-accent text-xs font-bold">
                {page.badge}
              </span>
              <span className="text-xs text-text-muted font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>آخر مراجعة: {page.lastUpdated}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-text-heading leading-tight tracking-tight">
              {page.title}
            </h1>

            {page.subtitle && (
              <p className="text-sm sm:text-lg text-text-muted leading-relaxed font-normal">
                {page.subtitle}
              </p>
            )}
          </header>

          {/* شريط التبويبات المتنقل السريع بين الصفحات التنظيمية الخمس (Internal Linking) */}
          <nav
            aria-label="أقسام الحوكمة والسياسات"
            className="flex items-center gap-1 p-1 rounded-2xl bg-surface border border-border/80 overflow-x-auto no-scrollbar"
            dir="rtl"
          >
            {LEGAL_PAGES_LIST.map((tab) => {
              const isActive = tab.slug === page.slug;
              return (
                <Link
                  key={tab.id}
                  href={`/governance/${tab.slug}`}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-accent text-accent-ink font-black shadow-sm'
                      : 'text-text-muted hover:text-text-heading hover:bg-surface-2'
                  }`}
                >
                  <span>{tab.shortTitle || tab.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* صندوق الخلاصة والنبذة التأسيسية */}
          <section
            className="p-5 sm:p-7 rounded-3xl bg-surface border border-border text-right space-y-3"
            dir="rtl"
            aria-label="الخلاصة التنفيذية"
          >
            <div className="flex items-center gap-2 text-accent font-black text-xs sm:text-sm">
              <Sparkles className="w-4 h-4" />
              <span>البيان المؤسسي والرؤية الرسمية:</span>
            </div>
            <p className="text-sm sm:text-base text-text-heading leading-relaxed font-medium">
              {page.summary}
            </p>
          </section>

          {/* محتوى صفحة "من نحن ومنهجية التقييم" */}
          {page.slug === 'about' && (
            <div className="space-y-8 text-right" dir="rtl">
              {/* شريط الإحصائيات الأكاديمية الأربعة */}
              {page.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {page.stats.map((st: { label: string; value: string }, sIdx: number) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-2xl bg-surface border border-border/80 text-center space-y-1 shadow-xs"
                    >
                      <span className="block text-xl sm:text-3xl font-black text-teal-700 dark:text-teal-400 font-mono">
                        {st.value}
                      </span>
                      <span className="text-xs font-bold text-text-muted">{st.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* أقسام المقال المؤسسي */}
              {(page.sections || []).map((sec: any) => (
                <section
                  key={sec.id}
                  className="p-6 sm:p-8 rounded-3xl bg-surface/60 border border-border/80 space-y-4"
                >
                  <h2 className="text-lg sm:text-2xl font-black text-text-heading border-r-4 border-accent pr-3">
                    {sec.heading}
                  </h2>

                  {sec.paragraphs && (
                    <div className="space-y-3 text-sm sm:text-base text-text-muted leading-relaxed">
                      {sec.paragraphs.map((p: string, pIdx: number) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  )}

                  {sec.description && (
                    <p className="text-sm sm:text-base text-text leading-relaxed font-bold">
                      {sec.description}
                    </p>
                  )}

                  {/* معايير التقييم الأربعة الصارمة */}
                  {sec.items && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {sec.items.map((item: any, iIdx: number) => (
                        <div
                          key={iIdx}
                          className="p-5 rounded-2xl bg-surface border border-border/70 space-y-2.5 shadow-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-xl bg-accent/15 text-accent-ink dark:text-accent font-black text-sm font-mono flex items-center justify-center shrink-0">
                              {item.number}
                            </span>
                            <h3 className="font-extrabold text-sm sm:text-base text-text-heading">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* محتوى صفحة "سياسة الخصوصية" */}
          {page.slug === 'privacy' && (
            <div className="space-y-6 text-right" dir="rtl">
              {(page.sections || []).map((sec: any) => (
                <section
                  key={sec.id}
                  className="p-6 sm:p-8 rounded-3xl bg-surface/60 border border-border/80 space-y-4"
                >
                  <h2 className="text-lg sm:text-2xl font-black text-text-heading border-r-4 border-accent pr-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <span>{sec.heading}</span>
                  </h2>

                  {sec.paragraphs && (
                    <div className="space-y-3 text-sm sm:text-base text-text-muted leading-relaxed">
                      {sec.paragraphs.map((p: string, pIdx: number) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* محتوى صفحة "شروط الاستخدام" */}
          {page.slug === 'terms' && (
            <div className="space-y-6 text-right" dir="rtl">
              {(page.sections || []).map((sec: any) => (
                <section
                  key={sec.id}
                  className="p-6 sm:p-8 rounded-3xl bg-surface/60 border border-border/80 space-y-4"
                >
                  <h2 className="text-lg sm:text-2xl font-black text-text-heading border-r-4 border-accent pr-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    <span>{sec.heading}</span>
                  </h2>

                  {sec.paragraphs && (
                    <div className="space-y-3 text-sm sm:text-base text-text-muted leading-relaxed">
                      {sec.paragraphs.map((p: string, pIdx: number) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* محتوى صفحة "حقوق الملكية DMCA" */}
          {page.slug === 'copyright' && (
            <div className="space-y-6 text-right" dir="rtl">
              {(page.sections || []).map((sec: any) => (
                <section
                  key={sec.id}
                  className="p-6 sm:p-8 rounded-3xl bg-surface/60 border border-border/80 space-y-4"
                >
                  <h2 className="text-lg sm:text-2xl font-black text-text-heading border-r-4 border-accent pr-3 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-accent" />
                    <span>{sec.heading}</span>
                  </h2>

                  {sec.paragraphs && (
                    <div className="space-y-3 text-sm sm:text-base text-text-muted leading-relaxed">
                      {sec.paragraphs.map((p: string, pIdx: number) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* محتوى صفحة "اتصل بنا والأسئلة الشائعة" */}
          {page.slug === 'contact' && (
            <div className="space-y-8 text-right" dir="rtl">
              {/* بطاقات قنوات التواصل الرسمية */}
              {page.contactInfo && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-surface border border-border/80 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-accent text-xs font-bold">
                      <Mail className="w-4 h-4" />
                      <span>البريد الإلكتروني العام</span>
                    </div>
                    <a
                      href={`mailto:${page.contactInfo.email}`}
                      className="block text-sm sm:text-base font-black text-text-heading hover:text-accent font-mono"
                    >
                      {page.contactInfo.email}
                    </a>
                    <span className="block text-[11px] text-text-muted">{page.contactInfo.responseTime}</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-border/80 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-accent text-xs font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>قناة بلاغات DMCA الرسمية</span>
                    </div>
                    <a
                      href={`mailto:${page.contactInfo.dmcaEmail}`}
                      className="block text-sm sm:text-base font-black text-text-heading hover:text-accent font-mono"
                    >
                      {page.contactInfo.dmcaEmail}
                    </a>
                    <span className="block text-[11px] text-text-muted">استجابة سريعة للمؤلفين</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface border border-border/80 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-accent text-xs font-bold">
                      <Clock className="w-4 h-4" />
                      <span>ساعات العمل الأكاديمي</span>
                    </div>
                    <span className="block text-xs sm:text-sm font-bold text-text-heading">
                      {page.contactInfo.workingDays}
                    </span>
                    <span className="block text-[11px] text-text-muted">{page.contactInfo.location}</span>
                  </div>
                </div>
              )}

              {/* نموذج إرسال التذاكر والتواصل التفاعلي المباشر */}
              <ContactFormSection />

              {/* بنك الأسئلة الشائعة (FAQ Accordion) المبني بـ HTML أصيل فائق السرعة */}
              {page.faqs && page.faqs.length > 0 && (
                <section className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                    <HelpCircle className="w-5 h-5 text-accent" />
                    <h2 className="text-xl sm:text-2xl font-black text-text-heading">
                      الأسئلة الشائعة وإجابات المركز الأكاديمي
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {page.faqs.map((faq: { id: string; question: string; answer: string }) => (
                      <details
                        key={faq.id}
                        className="group rounded-2xl bg-surface border border-border/80 p-4 sm:p-5 transition-all open:border-accent open:shadow-xs"
                      >
                        <summary className="flex items-center justify-between gap-3 cursor-pointer select-none font-bold text-sm sm:text-base text-text-heading list-none">
                          <span>{faq.question}</span>
                          <ChevronDown className="w-4 h-4 text-accent shrink-0 transition-transform duration-300 group-open:rotate-180" />
                        </summary>
                        <p className="pt-3 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border/50 mt-3">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </LibraryProvider>
  );
}
