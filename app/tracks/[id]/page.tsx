import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  Clock,
  BookOpen,
  User,
  Star,
  CheckCircle2,
  Code2,
  ChevronLeft
} from 'lucide-react';
import { INITIAL_COURSES } from '../../../src/data/courses';
import { LibraryProvider } from '../../../src/context/LibraryContext';
import StandaloneHeader from '../../../src/components/StandaloneHeader';
import TrackWatchClient from '../../../src/components/TrackWatchClient';
import Footer from '../../../src/components/Footer';

export const dynamic = 'force-static';

interface PageProps {
  params: {
    id: string;
  };
}

/**
 * 1. توليد المسارات الثابتة لكافة المسارات الأكاديمية الـ 73 أثناء البناء (SSG)
 */
export function generateStaticParams() {
  return (INITIAL_COURSES as any[]).map((course: any) => ({
    id: course.id
  }));
}

/**
 * 2. توليد بيانات الميتا الفردية ورابط Canonical وعناوين المشاركة الاجتماعية
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = (INITIAL_COURSES as any[]).find((c: any) => c.id === params.id);
  if (!course) {
    return {
      title: 'المسار غير موجود | AIProdZone',
      description: 'عذراً، المسار الأكاديمي المطلوب غير موجود في قاعدة بيانات AIProdZone.'
    };
  }

  const instructorsList = (course.instructors || []).map((i: any) => i.name).filter(Boolean);
  const instructorNames = instructorsList.length > 0 ? instructorsList.join('، ') : (course.instructor || 'محاضرون معتمدون');
  const fullTitle = `${course.title} | AIProdZone — الدليل الأكاديمي العربي`;
  const description = `${course.synopsis || course.oneLineVerdict || course.title} — بإشراف ${instructorNames}. مسار أكاديمي شامل يغطي ${course.toolsSummary || course.domainTitle} مجاناً 100% وبلا إعلانات.`;
  const canonicalUrl = `https://aiprodzone.com/tracks/${course.id}`;
  const keywords = Array.from(
    new Set([
      course.title,
      course.domainTitle,
      ...(course.techStack || []),
      'AIProdZone',
      'مسار تعليمي',
      'دورات مجانية',
      'تعلم البرمجة 2026'
    ])
  );

  const bannerImg = course.thumbnail || 'https://aiprodzone.com/brand-banner.png';

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
      type: 'website',
      images: [
        {
          url: bannerImg,
          width: 1200,
          height: 630,
          alt: course.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [bannerImg]
    }
  };
}

/**
 * 3. المكون الخادمي الكامل للمسار الأكاديمي: حقن Course + ItemList JSON-LD ورندر HTML الدلالي
 */
export default function TrackPage({ params }: PageProps) {
  const course = (INITIAL_COURSES as any[]).find((c: any) => c.id === params.id);
  if (!course) {
    notFound();
  }

  const canonicalUrl = `https://aiprodzone.com/tracks/${course.id}`;
  const baseUrl = 'https://aiprodzone.com';

  const primaryInstructor = (course.instructors || []).find((i: any) => i.role === 'أساسي') || course.instructors?.[0];
  const primaryLessons = primaryInstructor?.lessons || [];

  // بناء مخطط البيانات المهيكلة Course + ItemList + BreadcrumbList
  const jsonLdGraph: any[] = [
    {
      '@type': 'Course',
      '@id': `${canonicalUrl}#course`,
      name: course.title,
      description: course.synopsis || course.oneLineVerdict || course.title,
      url: canonicalUrl,
      provider: {
        '@type': 'Organization',
        name: 'AIProdZone',
        url: baseUrl,
        sameAs: baseUrl
      },
      inLanguage: 'ar',
      isAccessibleForFree: true,
      educationalLevel: course.level || 'جميع المستويات',
      about: course.domainTitle,
      teaches: (course.techStack || []).join(', '),
      hasCourseInstance: (course.instructors || []).map((inst: any) => ({
        '@type': 'CourseInstance',
        name: `شرح ${inst.name}`,
        courseMode: 'online',
        instructor: {
          '@type': 'Person',
          name: inst.name
        }
      }))
    },
    {
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#curriculum`,
      name: `منهج ومحاضرات: ${course.title}`,
      numberOfItems: primaryLessons.length,
      itemListElement: primaryLessons.slice(0, 40).map((lesson: any, idx: number) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: lesson.title || `الدرس ${idx + 1}`
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
          item: baseUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: course.domainTitle,
          item: `${baseUrl}/?cat=${encodeURIComponent(course.domainTitle)}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: course.title,
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
        {/* حقن مخطط Course و ItemList JSON-LD مباشرة داخل السيرفر */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />

        <StandaloneHeader current="tracks" />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* مسار التنقل الدلالي (Breadcrumbs) */}
          <nav aria-label="Breadcrumb" className="text-xs text-text-muted flex items-center gap-1.5" dir="rtl">
            <Link href="/" className="hover:text-accent transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href={`/?cat=${encodeURIComponent(course.domainTitle)}`} className="hover:text-accent transition-colors">
              {course.domainTitle}
            </Link>
            <span>/</span>
            <span className="text-text font-bold truncate max-w-xs sm:max-w-md">{course.title}</span>
          </nav>

          {/* ترويسة المسار الدلالية في الـ HTML الخام المسبق الرندر */}
          <section className="space-y-4 rounded-3xl p-5 sm:p-7 bg-surface border border-border/80 text-right shadow-sm" dir="rtl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-accent/15 text-accent-ink dark:text-accent font-bold">
                  قطاع: {course.domainTitle}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text font-bold">
                  #{course.orderIndex || course.rankOrder} {course.badge || course.qualityBadge}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text-muted font-mono">
                  {course.runtime || '20 ساعة'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text-muted">
                  {course.level || 'مسار تأسيسي وشامل'}
                </span>
              </div>

              {course.examCode && (
                <span className="px-2.5 py-1 rounded-lg bg-accent text-accent-ink font-mono font-black text-xs shadow-sm flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>كود الشهادة: {course.examCode}</span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black text-text-heading leading-snug">
                {course.title}
              </h1>

              {course.synopsis && (
                <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                  {course.synopsis}
                </p>
              )}
            </div>

            {/* بطاقات المحاضرين المعتمدين في الـ HTML الابتدائي */}
            {course.instructors && course.instructors.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-bold text-text-muted mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-accent" />
                  <span>المحاضرون المعتمدون لهذا المسار ({course.instructors.length} شروحات متوفرة):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.instructors.map((inst: any) => (
                    <div
                      key={inst.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 border border-border text-xs font-bold text-text"
                    >
                      {inst.role === 'أساسي' && <Star className="w-3.5 h-3.5 text-accent fill-current" />}
                      <span>{inst.name}</span>
                      <span className="text-[11px] font-mono text-text-muted">({inst.lessonsCount || inst.lessons?.length || 20} درساً)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* حزم التقنيات المغطاة */}
            {course.techStack && course.techStack.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <Code2 className="w-4 h-4 text-accent ml-1" />
                <span className="text-xs font-bold text-text-muted">التقنيات والأدوات:</span>
                {course.techStack.map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-surface-2 border border-border text-text font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* واجهة المسار التفاعلية للمستخدم (المشغل، تبديل المحاضر، وقائمة الدروس المحفوظة) */}
          <TrackWatchClient course={course} />
        </main>

        <Footer />
      </div>
    </LibraryProvider>
  );
}
