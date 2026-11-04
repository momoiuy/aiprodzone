import type { MetadataRoute } from 'next';
import { INITIAL_COURSES } from '../src/data/courses';
import { INITIAL_ARTICLES } from '../src/data/articles';
import { ACADEMIC_DOMAINS } from '../src/data/categories';
import { LEGAL_PAGES_LIST } from '../src/data/legal-pages';

export const dynamic = 'force-static';

const BASE_URL = 'https://aiprodzone.com';

/**
 * مولد خريطة الموقع الثابتة بالكامل لمنصة AIProdZone
 * مبني للعمل 100% Static أثناء next build ليتوافق مع معايير Technical SEO و GEO
 * يستخدم الروابط النظيفة الثابتة SSG لكافة المقالات الـ 18 والمسارات الـ 73
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date('2026-11-03T00:00:00.000Z');

  // 1. الصفحات الرئيسية والتشغيلية (Core Operational Views)
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95
    },
    {
      url: `${BASE_URL}/books`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    }
  ];

  // 2. القطاعات الأكاديمية الثمانية (8 Academic Domains)
  const domainRoutes: MetadataRoute.Sitemap = (ACADEMIC_DOMAINS as any[]).map((domain) => ({
    url: `${BASE_URL}/?cat=${encodeURIComponent(domain.name)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.75
  }));

  // 3. المقالات التقنية المرجعية المعمقة عبر المسار الثابت النظيف (/articles/[id])
  const articleRoutes: MetadataRoute.Sitemap = (INITIAL_ARTICLES as any[]).map((article) => {
    let lastModifiedDate = currentDate;
    if (article.publishedAt) {
      const parsed = new Date(article.publishedAt);
      if (!isNaN(parsed.getTime())) {
        lastModifiedDate = parsed;
      }
    }

    return {
      url: `${BASE_URL}/articles/${article.id}`,
      lastModified: lastModifiedDate,
      changeFrequency: 'monthly',
      priority: article.featured ? 0.95 : 0.9
    };
  });

  // 4. المسارات الأكاديمية الشاملة عبر المسار الثابت النظيف (/tracks/[id])
  const courseRoutes: MetadataRoute.Sitemap = (INITIAL_COURSES as any[]).map((course) => ({
    url: `${BASE_URL}/tracks/${course.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: course.featured ? 0.85 : 0.8
  }));

  // 5. الصفحات والسياسات القانونية (5 Legal Pages)
  const legalRoutes: MetadataRoute.Sitemap = (LEGAL_PAGES_LIST as any[]).map((page) => ({
    url: `${BASE_URL}/governance/${page.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.5
  }));

  return [
    ...coreRoutes,
    ...domainRoutes,
    ...articleRoutes,
    ...courseRoutes,
    ...legalRoutes
  ];
}
