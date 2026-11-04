import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { INITIAL_ARTICLES } from '../src/data/articles';
import { INITIAL_COURSES } from '../src/data/courses';
import ArticlePage, {
  generateStaticParams as generateArticleStaticParams,
  generateMetadata as generateArticleMetadata
} from '../app/articles/[id]/page';
import TrackPage, {
  generateStaticParams as generateTrackStaticParams,
  generateMetadata as generateTrackMetadata
} from '../app/tracks/[id]/page';
import ArticlesHubPage, { metadata as articlesHubMetadata } from '../app/articles/page';

describe('AIProdZone SSG & Technical SEO Static Generation Tests (المرحلة 9)', () => {
  // =========================================================================
  // 1. اختبارات توليد مسارات وميتا المقالات (app/articles/[id]/page.tsx)
  // =========================================================================
  describe('1. اختبارات توليد مسارات وميتا المقالات الثابتة (app/articles/[id])', () => {
    it('يولد generateStaticParams مسارات ثابتة لجميع المقالات الـ 18 بدقة', () => {
      const params = generateArticleStaticParams();
      expect(Array.isArray(params)).toBe(true);
      expect(params.length).toBe(18);

      const ids = params.map((p) => p.id);
      expect(new Set(ids).size).toBe(18);

      INITIAL_ARTICLES.forEach((article) => {
        expect(ids).toContain(article.id);
      });
    });

    it('يولد generateMetadata بيانات ميتا وعنوان و canonical لكل مقال في HTML الخام', async () => {
      for (const article of INITIAL_ARTICLES) {
        const metadata = await generateArticleMetadata({ params: { id: article.id } });
        expect(metadata).toBeDefined();
        const titleStr = typeof metadata.title === 'object' && metadata.title !== null ? metadata.title.absolute || metadata.title.default : String(metadata.title);
        expect(titleStr).toContain(article.title);
        expect(titleStr).toContain('AIProdZone');
        expect(metadata.description).toBeTruthy();
        expect(metadata.description.length).toBeGreaterThan(30);

        // التحقق من الرابط الدائم النظيف (Canonical)
        expect(metadata.alternates).toBeDefined();
        expect(metadata.alternates.canonical).toBe(`https://aiprodzone.com/articles/${article.id}`);

        // التحقق من ترويسات OpenGraph و Twitter للمشاركة الاجتماعية
        expect(metadata.openGraph).toBeDefined();
        expect(metadata.openGraph.url).toBe(`https://aiprodzone.com/articles/${article.id}`);
        expect(metadata.openGraph.title).toBe(titleStr);
        expect(metadata.twitter).toBeDefined();
        expect(metadata.twitter.title).toBe(titleStr);
      }
    });

    it('يتعامل generateMetadata بأمان مع معرفات المقالات غير الموجودة', async () => {
      const metadata = await generateArticleMetadata({ params: { id: 'non-existent-article' } });
      expect(metadata).toBeDefined();
      expect(metadata.title).toContain('المقال غير موجود');
    });

    it('يتحقق من رندر Server Component للمقال وتضمينه لـ h1 ومخطط JSON-LD الكامل', () => {
      const firstArticle = INITIAL_ARTICLES[0];
      const html = renderToStaticMarkup(<ArticlePage params={{ id: firstArticle.id }} />);

      // التحقق من وجود العنوان الرئيسي في HTML الابتدائي الخام
      expect(html).toContain(firstArticle.title);
      expect(html).toContain('<h1');

      // التحقق من حقن مخطط JSON-LD الكامل (TechArticle + BreadcrumbList)
      expect(html).toContain('application/ld+json');
      expect(html).toContain('TechArticle');
      expect(html).toContain('BreadcrumbList');
      expect(html).toContain(`https://aiprodzone.com/articles/${firstArticle.id}`);
    });
  });

  // =========================================================================
  // 2. اختبارات توليد مسارات وميتا المسارات الأكاديمية (app/tracks/[id]/page.tsx)
  // =========================================================================
  describe('2. اختبارات توليد مسارات وميتا المسارات الأكاديمية الثابتة (app/tracks/[id])', () => {
    it('يولد generateStaticParams مسارات ثابتة لجميع المسارات الـ 73 بدقة', () => {
      const params = generateTrackStaticParams();
      expect(Array.isArray(params)).toBe(true);
      expect(params.length).toBe(73);

      const ids = params.map((p) => p.id);
      expect(new Set(ids).size).toBe(73);

      INITIAL_COURSES.forEach((course) => {
        expect(ids).toContain(course.id);
      });
    });

    it('يولد generateMetadata بيانات ميتا وعنوان و canonical لكل مسار من الـ 73 مساراً', async () => {
      for (const course of INITIAL_COURSES) {
        const metadata = await generateTrackMetadata({ params: { id: course.id } });
        expect(metadata).toBeDefined();
        const titleStr = typeof metadata.title === 'object' && metadata.title !== null ? metadata.title.absolute || metadata.title.default : String(metadata.title);
        expect(titleStr).toContain(course.title);
        expect(titleStr).toContain('AIProdZone');
        expect(metadata.description).toBeTruthy();

        // التحقق من الرابط الدائم النظيف للمسار (Canonical)
        expect(metadata.alternates).toBeDefined();
        expect(metadata.alternates.canonical).toBe(`https://aiprodzone.com/tracks/${course.id}`);

        // التحقق من ترويسات OpenGraph و Twitter للمشاركة الاجتماعية
        expect(metadata.openGraph).toBeDefined();
        expect(metadata.openGraph.url).toBe(`https://aiprodzone.com/tracks/${course.id}`);
        expect(metadata.openGraph.title).toBe(titleStr);
        expect(metadata.twitter).toBeDefined();
      }
    });

    it('يتعامل generateMetadata بأمان مع معرفات المسارات غير الموجودة', async () => {
      const metadata = await generateTrackMetadata({ params: { id: 'non-existent-track' } });
      expect(metadata).toBeDefined();
      expect(metadata.title).toContain('المسار غير موجود');
    });

    it('يتحقق من رندر Server Component للمسار وتضمينه لـ h1 ومخطط Course JSON-LD', () => {
      const firstCourse = INITIAL_COURSES[0];
      const html = renderToStaticMarkup(<TrackPage params={{ id: firstCourse.id }} />);

      // التحقق من وجود عنوان المسار في HTML الابتدائي
      expect(html).toContain(firstCourse.title);
      expect(html).toContain('<h1');

      // التحقق من حقن مخطط JSON-LD للمسار (Course + ItemList + BreadcrumbList)
      expect(html).toContain('application/ld+json');
      expect(html).toContain('Course');
      expect(html).toContain('ItemList');
      expect(html).toContain(`https://aiprodzone.com/tracks/${firstCourse.id}`);
    });
  });

  // =========================================================================
  // 3. اختبارات صفحة مجلة المقالات المستقلة (app/articles/page.tsx)
  // =========================================================================
  describe('3. اختبارات صفحة مجلة المقالات المستقلة (app/articles)', () => {
    it('تحتوي صفحة المقالات على بيانات ميتا و canonical مستقل ونظيف', () => {
      expect(articlesHubMetadata).toBeDefined();
      expect(articlesHubMetadata.title).toContain('المقالات التقنية');
      expect(articlesHubMetadata.alternates?.canonical).toBe('https://aiprodzone.com/articles');
    });

    it('ترندر صفحة المقالات فهرساً دلالياً لجميع المقالات الـ 18', () => {
      const html = renderToStaticMarkup(<ArticlesHubPage />);
      expect(html).toContain('المقالات التقنية والتحليلات المعمارية');
      expect(html).toContain('<h1');

      INITIAL_ARTICLES.forEach((article) => {
        expect(html).toContain(article.title);
        expect(html).toContain(`/articles/${article.id}`);
      });
    });
  });
});
