import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { INITIAL_ARTICLES } from '../src/data/articles';
import { INITIAL_COURSES } from '../src/data/courses';
import { EBOOK_GUIDES } from '../src/data/ebooks';
import { CURATED_AI_TOOLS } from '../src/data/tools';
import { LEGAL_PAGES_LIST } from '../src/data/legal-pages';
import ArticlePage, {
  generateStaticParams as generateArticleStaticParams,
  generateMetadata as generateArticleMetadata
} from '../app/articles/[id]/page';
import TrackPage, {
  generateStaticParams as generateTrackStaticParams,
  generateMetadata as generateTrackMetadata
} from '../app/tracks/[id]/page';
import ArticlesHubPage, { metadata as articlesHubMetadata } from '../app/articles/page';
import BooksPage, { metadata as booksMetadata } from '../app/books/page';
import ToolsPage, { metadata as toolsMetadata } from '../app/tools/page';
import GovernancePage, {
  generateStaticParams as generateGovernanceStaticParams,
  generateMetadata as generateGovernanceMetadata
} from '../app/governance/[slug]/page';

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

  // =========================================================================
  // 4. اختبارات صفحة مكتبة الكتب والأدلة المستقلة (app/books/page.tsx)
  // =========================================================================
  describe('4. اختبارات صفحة مكتبة الكتب والأدلة المستقلة (app/books)', () => {
    it('تحتوي صفحة الكتب على بيانات ميتا كاملة ورابط canonical نظيف (/books)', () => {
      expect(booksMetadata).toBeDefined();
      const titleStr = typeof booksMetadata.title === 'object' && booksMetadata.title !== null ? booksMetadata.title.absolute || booksMetadata.title.default : String(booksMetadata.title);
      expect(titleStr).toContain('مكتبة الكتب والأدلة الرقمية');
      expect(titleStr).toContain('114');
      expect(booksMetadata.alternates?.canonical).toBe('https://aiprodzone.com/books');
      expect(booksMetadata.openGraph?.url).toBe('https://aiprodzone.com/books');
    });

    it('ترندر صفحة الكتب مخطط CollectionPage و ItemList JSON-LD وفهرس الـ 114 كتاباً في HTML', () => {
      const html = renderToStaticMarkup(<BooksPage />);
      expect(html).toContain('المكتبة السحابية الشاملة للأدلة والكتب التقنية');
      expect(html).toContain('<h1');
      expect(html).toContain('CollectionPage');
      expect(html).toContain('ItemList');
      expect(html).toContain('BreadcrumbList');
      expect(html).toContain('https://aiprodzone.com/books');

      // التحقق من أن عدد الكتب المدرجة في البيانات 114
      expect(EBOOK_GUIDES.length).toBe(114);
      // التأكد من وجود عينات من الكتب في الرندر الثابت
      expect(html).toContain(EBOOK_GUIDES[0].title);
      expect(html).toContain(EBOOK_GUIDES[10].title);
      expect(html).toContain(EBOOK_GUIDES[50].title);
    });
  });

  // =========================================================================
  // 5. اختبارات صفحة مقارنة الأدوات الذكية المستقلة (app/tools/page.tsx)
  // =========================================================================
  describe('5. اختبارات صفحة مقارنة الأدوات الذكية المستقلة (app/tools)', () => {
    it('تحتوي صفحة الأدوات على بيانات ميتا دقيقة ورابط canonical نظيف (/tools)', () => {
      expect(toolsMetadata).toBeDefined();
      const titleStr = typeof toolsMetadata.title === 'object' && toolsMetadata.title !== null ? toolsMetadata.title.absolute || toolsMetadata.title.default : String(toolsMetadata.title);
      expect(titleStr).toContain('أفضل أدوات الذكاء الاصطناعي والبرمجة');
      expect(toolsMetadata.alternates?.canonical).toBe('https://aiprodzone.com/tools');
      expect(toolsMetadata.openGraph?.url).toBe('https://aiprodzone.com/tools');
    });

    it('ترندر صفحة الأدوات جدول مقارنة هندسي ومخطط ItemList JSON-LD في HTML', () => {
      const html = renderToStaticMarkup(<ToolsPage />);
      expect(html).toContain('مقارنة أدوات الذكاء الاصطناعي وهندسة البرمجيات');
      expect(html).toContain('<h1');
      expect(html).toContain('ItemList');
      expect(html).toContain('BreadcrumbList');
      expect(html).toContain('https://aiprodzone.com/tools');

      // التحقق من وجود الأدوات المنسقة في المحتوى
      expect(CURATED_AI_TOOLS.length).toBeGreaterThanOrEqual(8);
      CURATED_AI_TOOLS.forEach((tool) => {
        expect(html).toContain(tool.name);
      });
    });
  });

  // =========================================================================
  // 6. اختبارات مسارات الحوكمة والسياسات الخمس (app/governance/[slug]/page.tsx)
  // =========================================================================
  describe('6. اختبارات مسارات الحوكمة والسياسات الخمس (app/governance/[slug])', () => {
    it('يولد generateStaticParams مسارات لجميع الصفحات التنظيمية الخمس بدقة', () => {
      const params = generateGovernanceStaticParams();
      expect(Array.isArray(params)).toBe(true);
      expect(params.length).toBe(5);

      const slugs = params.map((p) => p.slug);
      expect(slugs).toContain('about');
      expect(slugs).toContain('privacy');
      expect(slugs).toContain('terms');
      expect(slugs).toContain('copyright');
      expect(slugs).toContain('contact');
    });

    it('يولد generateMetadata بيانات ميتا وعنوان و canonical لكل صفحة حوكمة', async () => {
      for (const legalPage of LEGAL_PAGES_LIST) {
        const metadata = await generateGovernanceMetadata({ params: { slug: legalPage.slug } });
        expect(metadata).toBeDefined();
        const titleStr = typeof metadata.title === 'object' && metadata.title !== null ? metadata.title.absolute || metadata.title.default : String(metadata.title);
        expect(titleStr).toContain(legalPage.title);
        expect(titleStr).toContain('AIProdZone');
        expect(metadata.alternates?.canonical).toBe(`https://aiprodzone.com/governance/${legalPage.slug}`);
        expect(metadata.openGraph?.url).toBe(`https://aiprodzone.com/governance/${legalPage.slug}`);
      }
    });

    it('يتعامل generateMetadata بأمان مع slugs غير موجودة', async () => {
      const metadata = await generateGovernanceMetadata({ params: { slug: 'unknown-policy' } });
      expect(metadata).toBeDefined();
      expect(metadata.title).toContain('غير موجودة');
    });

    it('يرندر GovernancePage محتوى الصفحة وشارات E-E-A-T ومخطط JSON-LD المناسب', () => {
      for (const legalPage of LEGAL_PAGES_LIST) {
        const html = renderToStaticMarkup(<GovernancePage params={{ slug: legalPage.slug }} />);
        expect(html).toContain(legalPage.title);
        expect(html).toContain('<h1');
        expect(html).toContain('application/ld+json');
        expect(html).toContain(`https://aiprodzone.com/governance/${legalPage.slug}`);
      }

      // التحقق من وجود معايير التقييم ومنهجية الجودة الأكاديمية E-E-A-T في صفحة "من نحن ومنهجية التقييم"
      const aboutHtml = renderToStaticMarkup(<GovernancePage params={{ slug: 'about' }} />);
      expect(aboutHtml).toContain('معايير التقييم الأربعة الصارمة');
      expect(aboutHtml).toContain('Evaluation Methodology');
    });
  });
});
