import { describe, it, expect, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Cairo: () => ({ variable: '--font-cairo' }),
  Inter: () => ({ variable: '--font-inter' })
}));
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_ARTICLES, ARTICLE_CATEGORIES, resolveArticleGeoSeo } from '../src/data/articles.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { ACADEMIC_DOMAINS } from '../src/data/categories.js';
import { EBOOK_GUIDES } from '../src/data/ebooks.js';
import { LEGAL_PAGES_LIST } from '../src/data/legal-pages.js';
import { buildArticleSchema } from '../src/components/ArticleJsonLd';
import sitemap, { dynamic as sitemapDynamic } from '../app/sitemap';
import robots, { dynamic as robotsDynamic } from '../app/robots';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('AIProdZone Technical SEO & Generative Engine Optimization (GEO) Tests', () => {
  const BASE_URL = 'https://aiprodzone.com';

  describe('1. التحقق من اكتمال وجودة بيانات المقالات وسلامة SEO/GEO', () => {
    it('يتحقق من وجود 18 مقالاً تقنياً مرجعياً فائق العمق', () => {
      expect(INITIAL_ARTICLES).toBeDefined();
      expect(INITIAL_ARTICLES.length).toBe(18);
    });

    it('يتحقق من أن جميع المقالات تمتلك معرفات (id) و (slug) فريدة وغير مكررة', () => {
      const ids = INITIAL_ARTICLES.map((a) => a.id);
      const slugs = INITIAL_ARTICLES.map((a) => a.slug);

      expect(new Set(ids).size).toBe(18);
      expect(new Set(slugs).size).toBe(18);

      INITIAL_ARTICLES.forEach((article) => {
        expect(article.id).toBeTruthy();
        expect(typeof article.id).toBe('string');
        expect(article.id.trim()).not.toBe('');

        expect(article.slug).toBeTruthy();
        expect(typeof article.slug).toBe('string');
        expect(article.slug.trim()).not.toBe('');
        // التأكد من أن slug بتنسيق URL صالح دون مسافات
        expect(article.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });

    it('يتحقق من أن جميع المقالات تمتلك عناوين غير فارغة، تصنيفات صحيحة، وبيانات نشر سليمة', () => {
      const allowedCategories = new Set(ARTICLE_CATEGORIES);

      INITIAL_ARTICLES.forEach((article) => {
        expect(article.title).toBeTruthy();
        expect(article.title.trim().length).toBeGreaterThan(10);

        expect(article.subtitle).toBeTruthy();
        expect(article.subtitle.trim().length).toBeGreaterThan(10);

        expect(article.category).toBeTruthy();
        expect(allowedCategories.has(article.category)).toBe(true);

        expect(article.author).toBeTruthy();
        expect(article.authorRole).toBeTruthy();
        expect(article.publishedAt).toBeTruthy();
        expect(article.readTime).toMatch(/دقائق قراءة/);

        expect(article.summary).toBeTruthy();
        expect(article.summary.length).toBeGreaterThan(50);
      });
    });

    it('يتحقق من سلامة بيانات GEO التعريفي (definitionLead) المخصص لمحركات الإجابة التوليدية', () => {
      INITIAL_ARTICLES.forEach((article) => {
        const resolved = resolveArticleGeoSeo(article);
        expect(resolved).toBeDefined();
        expect(resolved.definitionLead).toBeTruthy();
        expect(typeof resolved.definitionLead).toBe('string');
        // التأكد من أن التعريف عميق وواضح (أكثر من 40 حرفاً)
        expect(resolved.definitionLead.length).toBeGreaterThan(40);
        expect(Array.isArray(resolved.keyTakeaways)).toBe(true);
        expect(resolved.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      });
    });

    it('يتحقق من صحة توليد مخطط البيانات المهيكلة المزدوجة JSON-LD TechArticle لكل مقال', () => {
      INITIAL_ARTICLES.forEach((article) => {
        const schema = buildArticleSchema(article);
        expect(schema).toBeDefined();
        expect(schema['@context']).toBe('https://schema.org');
        expect(Array.isArray(schema['@graph'])).toBe(true);

        const techArticleNode = schema['@graph'].find((n) => n['@type'] === 'TechArticle');
        expect(techArticleNode).toBeDefined();
        expect(techArticleNode.url).toBe(`${BASE_URL}/?view=articles&slug=${article.slug}`);
        expect(techArticleNode.headline).toBe(article.title);
        expect(techArticleNode.inLanguage).toBe('ar');
        expect(techArticleNode.publisher.name).toBe('AIProdZone');

        const breadcrumbNode = schema['@graph'].find((n) => n['@type'] === 'BreadcrumbList');
        expect(breadcrumbNode).toBeDefined();
        expect(breadcrumbNode.itemListElement.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('2. التحقق من مولد خريطة الموقع الثابتة (app/sitemap.ts)', () => {
    it('يتحقق من أن خريطة الموقع محددة للبناء الثابت (force-static)', () => {
      expect(sitemapDynamic).toBe('force-static');
    });

    it('يولد خريطة موقع تحتوي على كافة الصفحات الرئيسية، المسارات (73)، المقالات (18)، والصفحات القانونية (5)', () => {
      const items = sitemap();
      expect(Array.isArray(items)).toBe(true);

      // 4 رئيسية + 8 قطاعات + 18 مقالات + 73 مسارات + 5 قانونية = 108 عناصر
      expect(items.length).toBe(108);

      const urls = items.map((i) => i.url);
      const urlSet = new Set(urls);
      expect(urlSet.size).toBe(items.length); // عدم وجود أي تكرار
    });

    it('يتحقق من تضمين الروابط الأساسية بالأولويات المناسبة', () => {
      const items = sitemap();
      const home = items.find((i) => i.url === BASE_URL);
      expect(home).toBeDefined();
      expect(home.priority).toBe(1.0);
      expect(home.changeFrequency).toBe('daily');

      const articlesHub = items.find((i) => i.url === `${BASE_URL}/articles` || i.url === `${BASE_URL}/?view=articles`);
      expect(articlesHub).toBeDefined();
      expect(articlesHub.priority).toBe(0.95);

      const ebooksHub = items.find((i) => i.url === `${BASE_URL}/books` || i.url === `${BASE_URL}/?view=ebooks`);
      expect(ebooksHub).toBeDefined();
      expect(ebooksHub.priority).toBe(0.85);

      const toolsHub = items.find((i) => i.url === `${BASE_URL}/tools` || i.url === `${BASE_URL}/?view=tools`);
      expect(toolsHub).toBeDefined();
      expect(toolsHub.priority).toBe(0.8);
    });

    it('يتحقق من تضمين جميع المسارات الأكاديمية الـ 73', () => {
      const items = sitemap();
      INITIAL_COURSES.forEach((course) => {
        const expectedCleanUrl = `${BASE_URL}/tracks/${course.id}`;
        const expectedLegacyUrl = `${BASE_URL}/?view=watch&course=${course.id}`;
        const found = items.find((i) => i.url === expectedCleanUrl || i.url === expectedLegacyUrl);
        expect(found, `المسار ${course.id} غير مدرج في خريطة الموقع`).toBeDefined();
        expect(found.priority).toBeGreaterThanOrEqual(0.8);
      });
    });

    it('يتحقق من تضمين جميع المقالات الـ 18', () => {
      const items = sitemap();
      INITIAL_ARTICLES.forEach((article) => {
        const expectedCleanUrl = `${BASE_URL}/articles/${article.id}`;
        const expectedLegacyUrl = `${BASE_URL}/?view=articles&slug=${article.slug}`;
        const found = items.find((i) => i.url === expectedCleanUrl || i.url === expectedLegacyUrl);
        expect(found, `المقال ${article.slug} غير مدرج في خريطة الموقع`).toBeDefined();
        expect(found.priority).toBeGreaterThanOrEqual(0.9);
      });
    });

    it('يتحقق من تضمين جميع الصفحات القانونية الـ 5', () => {
      const items = sitemap();
      LEGAL_PAGES_LIST.forEach((page) => {
        const expectedCleanUrl = `${BASE_URL}/governance/${page.slug}`;
        const expectedLegacyUrl = `${BASE_URL}/?view=legal&tab=${page.slug}`;
        const found = items.find((i) => i.url === expectedCleanUrl || i.url === expectedLegacyUrl);
        expect(found, `الصفحة القانونية ${page.slug} غير مدرجة في خريطة الموقع`).toBeDefined();
        expect(found.priority).toBe(0.5);
      });
    });
  });

  describe('3. التحقق من ملف التوجيه والزحف (app/robots.ts)', () => {
    it('يتحقق من أن ملف robots محدد للبناء الثابت (force-static)', () => {
      expect(robotsDynamic).toBe('force-static');
    });

    it('يتحقق من إتاحة الموقع لعناكب الذكاء الاصطناعي ومحركات البحث المحددة', () => {
      const robotsConfig = robots();
      expect(robotsConfig).toBeDefined();
      expect(robotsConfig.sitemap).toBe(`${BASE_URL}/sitemap.xml`);

      const mainRule = robotsConfig.rules[0];
      expect(mainRule).toBeDefined();
      expect(mainRule.allow).toBe('/');
      expect(mainRule.disallow).toContain('/api/');
      expect(mainRule.disallow).toContain('/admin');

      const expectedBots = [
        'Googlebot',
        'Bingbot',
        'GPTBot',
        'OAI-SearchBot',
        'ChatGPT-User',
        'Google-Extended',
        'ClaudeBot',
        'PerplexityBot'
      ];

      const agentList = Array.isArray(mainRule.userAgent)
        ? mainRule.userAgent
        : [mainRule.userAgent];

      expectedBots.forEach((bot) => {
        expect(agentList).toContain(bot);
      });
    });
  });

  describe('4. التحقق من معيار التوثيق لمحركات الإجابة التوليدية (/public/llms.txt)', () => {
    const llmsPath = path.join(rootDir, 'public', 'llms.txt');

    it('يتحقق من وجود ملف llms.txt على القرص بحجم ملائم ومحتوى ثري', () => {
      expect(fs.existsSync(llmsPath)).toBe(true);
      const content = fs.readFileSync(llmsPath, 'utf8');
      expect(content.length).toBeGreaterThan(10000);
    });

    it('يتحقق من احتواء llms.txt على هوية المنصة والمبادئ الأربعة الأساسية', () => {
      const content = fs.readFileSync(llmsPath, 'utf8');
      expect(content).toContain('AIProdZone');
      expect(content).toContain('Zero Ads');
      expect(content).toContain('100% Privacy');
      expect(content).toContain('Client-Side Persistence');
      expect(content).toContain('Official YouTube No-Cookie Embeds');
    });

    it('يتحقق من احتواء llms.txt على ملخص القطاعات الأكاديمية الـ 8', () => {
      const content = fs.readFileSync(llmsPath, 'utf8');
      ACADEMIC_DOMAINS.forEach((domain) => {
        expect(content).toContain(domain.name);
      });
    });

    it('يتحقق من احتواء llms.txt على جميع المقالات الـ 18 وروابطها وتعريفاتها', () => {
      const content = fs.readFileSync(llmsPath, 'utf8');
      INITIAL_ARTICLES.forEach((article) => {
        const resolved = resolveArticleGeoSeo(article);
        expect(content).toContain(article.title);
        expect(content).toContain(article.slug);
        expect(content).toContain(resolved.definitionLead);
      });
    });

    it('يتحقق من إشارة llms.txt إلى المسارات الأكاديمية الـ 73 والكتب الـ 114', () => {
      const content = fs.readFileSync(llmsPath, 'utf8');
      expect(content).toContain('73 مساراً');
      expect(content).toContain('114');
    });

    it('يتحقق من إشارة llms.txt بوضوح إلى رابط الموسوعة الكاملة llms-full.txt في أوله', () => {
      const content = fs.readFileSync(llmsPath, 'utf8');
      expect(content).toContain('Full Detailed Documentation: https://aiprodzone.com/llms-full.txt');
    });

    it('يتحقق من وجود الموسوعة الكاملة llms-full.txt بحجم أكبر من 80KB', () => {
      const fullLlmsPath = path.join(rootDir, 'public', 'llms-full.txt');
      expect(fs.existsSync(fullLlmsPath)).toBe(true);
      const fullContent = fs.readFileSync(fullLlmsPath, 'utf8');
      expect(fullContent.length).toBeGreaterThan(80000);
      expect(fullContent).toContain('AIProdZone - LLMs Full Documentation');
      expect(fullContent).toContain('https://aiprodzone.com/llms-full.txt');
    });
  });

  describe('5. التحقق من حماية مسار /admin من الفهرسة في محركات البحث', () => {
    it('يتحقق من إعدادات robots في app/admin/layout.tsx لمنع الفهرسة والتخزين المؤقت', async () => {
      const adminLayoutModule = await import('../app/admin/layout');
      expect(adminLayoutModule.metadata).toBeDefined();
      expect(adminLayoutModule.metadata.robots).toEqual({
        index: false,
        follow: false,
        nocache: true
      });
    });
  });

  describe('6. التحقق من ترقية الهوية النصية وبيانات الميتا الرئيسية (app/layout.tsx)', () => {
    it('يتحقق من مطابقة العنوان الرئيسي والأكاديمي والوصف الجديد لمنصة AIProdZone', async () => {
      const layoutModule = await import('../app/layout');
      expect(layoutModule.metadata).toBeDefined();
      expect(layoutModule.metadata.title).toEqual({
        default: 'AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية والذكاء الاصطناعي وعلوم الحاسوب',
        template: '%s | AIProdZone — الدليل الأكاديمي العربي'
      });
      const expectedDesc = 'منصة أكاديمية عربية مجانية 100% وبلا إعلانات تضم 73 مساراً تعليمياً متعدد المحاضرين، 114 كتاباً ودليلاً برمجياً، و18 مقالاً هندسياً معمقاً في البرمجة، الذكاء الاصطناعي، والأمن السيبراني.';
      expect(layoutModule.metadata.description).toBe(expectedDesc);
      expect(layoutModule.metadata.openGraph?.title).toBe('AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية والذكاء الاصطناعي وعلوم الحاسوب');
      expect(layoutModule.metadata.openGraph?.description).toBe(expectedDesc);
      expect(layoutModule.metadata.twitter?.title).toBe('AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية والذكاء الاصطناعي وعلوم الحاسوب');
      expect(layoutModule.metadata.twitter?.description).toBe(expectedDesc);
    });
  });
});
