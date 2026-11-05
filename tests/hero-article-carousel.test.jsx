// @ts-nocheck
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import HeroArticleCarousel, {
  useArticleCarousel,
  ArticleCarouselController,
  ROTATION_INTERVAL_MS
} from '../src/components/HeroArticleCarousel.jsx';
import { HERO_ARTICLES_SUMMARY } from '../src/data/articles-summary.js';
import { INITIAL_ARTICLES } from '../src/data/articles.js';

describe('HeroArticleCarousel & Zero-Overhead Animation Tests (العارض الدوّار للمقالات التقنية)', () => {
  // =========================================================================
  // 1. فحص التخطيط الأكاديمي RTL والمكونات البصرية والهندسية (Academic RTL Layout)
  // =========================================================================
  describe('1. التحقق من التخطيط الأكاديمي الأصيل والشارات والبيانات المرجعية (Academic RTL Layout)', () => {
    it('يعرض البانر المقال المرجعي الأول بنجاح مع كافة عناصره الأكاديمية والشارات', () => {
      const html = renderToStaticMarkup(
        React.createElement(HeroArticleCarousel, { articles: HERO_ARTICLES_SUMMARY })
      );

      const firstArticle = HERO_ARTICLES_SUMMARY[0];

      // التحقق من اتجاه RTL الأصيل
      expect(html).toContain('dir="rtl"');
      expect(html).toContain('role="region"');
      expect(html).toContain('aria-roledescription="carousel"');

      // 1. الشارة المضيئة
      expect(html).toContain('✨ مقال مرجعي • تحديث 2026');

      // 2. شارة القطاع الأكاديمي
      expect(html).toContain(firstArticle.category);

      // 3. وقت القراءة المقدر
      expect(html).toContain(firstArticle.readTime);

      // 4. عداد ترتيب المقال (مقال 1 من 18)
      expect(html).toContain(`مقال 1 من ${HERO_ARTICLES_SUMMARY.length}`);

      // 5. عنوان المقال <h2>
      expect(html).toContain(firstArticle.title);
      expect(html).toContain('<h2');

      // 6. الملخص التعريفي
      expect(html).toContain(firstArticle.definitionLead || firstArticle.summary);

      // 7. الكاتب والصفة الأكاديمية
      expect(html).toContain(firstArticle.author);
      expect(html).toContain(firstArticle.authorRole);

      // 8. الزر الأساسي الزمردي وزر تصفح كل المقالات
      expect(html).toContain('اقرأ المقال كاملاً');
      expect(html).toContain(`/articles/${firstArticle.id}`);
      expect(html).toContain(`تصفح كل المقالات (${HERO_ARTICLES_SUMMARY.length})`);
    });

    it('يحتوي على اللوحة البصرية الهندسية اليسرى مع أهم محاور المقال ورسوم SVG المتجهة', () => {
      const html = renderToStaticMarkup(
        React.createElement(HeroArticleCarousel, { articles: HERO_ARTICLES_SUMMARY })
      );

      // التحقق من وجود بطاقة الزجاج والحدود الزمردية
      expect(html).toContain('backdrop-blur-md');
      expect(html).toContain('border-teal-500/20');
      expect(html).toContain('أهم محاور المقال:');

      // التحقق من إدراج المكون البصري المتجهي ArticleCoverGraphic بدون أخطاء
      expect(html).toContain('<svg');
      expect(html).toContain('viewBox="0 0 600 300"');
    });

    it('يتضمن نقاط التنقل الـ 18 المرقمة (Pagination Dots) وأزرار السابق والتالي', () => {
      const html = renderToStaticMarkup(
        React.createElement(HeroArticleCarousel, { articles: HERO_ARTICLES_SUMMARY })
      );

      // أزرار السابق والتالي
      expect(html).toContain('aria-label="المقال السابق"');
      expect(html).toContain('aria-label="المقال التالي"');
      expect(html).toContain('السابق');
      expect(html).toContain('التالي');

      // نقاط التنقل الـ 18
      expect(html).toContain('role="tablist"');
      expect(html).toContain('aria-label="مؤشرات المقالات"');
      HERO_ARTICLES_SUMMARY.forEach((art, idx) => {
        const encodedTitle = art.title.replace(/&/g, '&amp;');
        expect(html).toContain(`aria-label="مقال ${idx + 1}: ${encodedTitle}"`);
      });
    });

    it('يحتوي على شريط التقدم الزمردي الرفيع جداً (#14B8A6) في أسفل الحاوية', () => {
      const html = renderToStaticMarkup(
        React.createElement(HeroArticleCarousel, { articles: HERO_ARTICLES_SUMMARY })
      );

      expect(html).toContain('bg-[#14B8A6]');
      expect(html).toContain('animate-hero-progress');
    });

    it('يضمن انعدام الانزياح البصري (CLS = 0) عبر تثبيت الارتفاع الأدنى للحاوية', () => {
      const html = renderToStaticMarkup(
        React.createElement(HeroArticleCarousel, { articles: HERO_ARTICLES_SUMMARY })
      );

      // تثبيت الارتفاع الأدنى يمنع اهتزاز البطاقات السفلية أثناء تبدل المقالات
      expect(html).toContain('min-h-[280px]');
      expect(html).toContain('line-clamp-2');
    });

    it('يضمن صفر استهلاك للصور الخارجية الثقيلة على Vercel (0 Image Requests & No PNG/JPG)', () => {
      const html = renderToStaticMarkup(
        React.createElement(HeroArticleCarousel, { articles: HERO_ARTICLES_SUMMARY })
      );

      // لا يحتوي البانر على أي وسوم <img> خارجية أو خلفيات jpg/png
      expect(html).not.toContain('<img');
      expect(html).not.toContain('.png');
      expect(html).not.toContain('.jpg');
      expect(html).not.toContain('.jpeg');
      expect(html).not.toContain('https://i.ytimg.com');
    });

    it('يتضمن جميع المقالات التقنية الـ 18 بالترتيب الدقيق دون أي نقص', () => {
      expect(HERO_ARTICLES_SUMMARY.length).toBe(18);
      expect(INITIAL_ARTICLES.length).toBe(18);

      // التأكد من تطابق المعرفات والعناوين
      HERO_ARTICLES_SUMMARY.forEach((summaryArt, idx) => {
        expect(summaryArt.id).toBe(INITIAL_ARTICLES[idx].id);
        expect(summaryArt.title).toBe(INITIAL_ARTICLES[idx].title);
        expect(summaryArt.category).toBe(INITIAL_ARTICLES[idx].category);
      });
    });
  });

  // =========================================================================
  // 2. فحص المؤقت الذكي كل 10 ثوانٍ والإيقاف المؤقت عند تمرير الفأرة (Zero-CPU Waste)
  // =========================================================================
  describe('2. التحقق من التبديل التلقائي كل 10 ثوانٍ وإدارة المؤقت الذكي (10,000ms & Hover Pause)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('ثابت التبديل التلقائي مضبوط على 10,000ms بالضبط (10 ثوانٍ)', () => {
      expect(ROTATION_INTERVAL_MS).toBe(10000);
    });

    it('يتبدل المقال تلقائياً إلى المقال التالي بعد مرور 10 ثوانٍ بالضبط (vi.advanceTimersByTime(10000))', () => {
      const onIndexChange = vi.fn();
      const controller = new ArticleCarouselController({
        articles: HERO_ARTICLES_SUMMARY,
        interval: 10000,
        onIndexChange
      });

      expect(controller.currentIndex).toBe(0);
      expect(controller.currentArticle.id).toBe(HERO_ARTICLES_SUMMARY[0].id);

      // تقديم الوقت بمقدار 10 ثوانٍ (10,000ms)
      vi.advanceTimersByTime(10000);

      expect(controller.currentIndex).toBe(1);
      expect(controller.currentArticle.id).toBe(HERO_ARTICLES_SUMMARY[1].id);
      expect(onIndexChange).toHaveBeenCalledWith(1, HERO_ARTICLES_SUMMARY[1]);

      // تقديم الوقت 10 ثوانٍ إضافية
      vi.advanceTimersByTime(10000);

      expect(controller.currentIndex).toBe(2);
      expect(controller.currentArticle.id).toBe(HERO_ARTICLES_SUMMARY[2].id);

      controller.destroy();
    });

    it('يتوقف المؤقت مؤقتاً عند وضع مؤشر الفأرة (fireEvent.mouseEnter) ولا يتبدل المقال مهما مر الوقت', () => {
      const onIndexChange = vi.fn();
      const controller = new ArticleCarouselController({
        articles: HERO_ARTICLES_SUMMARY,
        interval: 10000,
        onIndexChange
      });

      // إنشاء محاكي أحداث الفأرة (fireEvent)
      const fireEvent = {
        mouseEnter: (ctrl) => ctrl.pause(),
        mouseLeave: (ctrl) => ctrl.resume()
      };

      expect(controller.currentIndex).toBe(0);

      // محاكاة وضع مؤشر الفأرة فوق البانر
      fireEvent.mouseEnter(controller);
      expect(controller.isPaused).toBe(true);

      // تقديم الوقت بمقدار 10 ثوانٍ ثم 20 ثانية أثناء توقف المؤقت
      vi.advanceTimersByTime(10000);
      vi.advanceTimersByTime(20000);

      // يجب أن يظل المقال الأول معروضاً دون أي تبديل أثناء التوقف المؤقت
      expect(controller.currentIndex).toBe(0);
      expect(onIndexChange).not.toHaveBeenCalled();

      // محاكاة مغادرة مؤشر الفأرة لاستئناف الدوران
      fireEvent.mouseLeave(controller);
      expect(controller.isPaused).toBe(false);

      // تقديم الوقت بمقدار 10 ثوانٍ بعد الاستئناف
      vi.advanceTimersByTime(10000);

      expect(controller.currentIndex).toBe(1);
      expect(controller.currentArticle.id).toBe(HERO_ARTICLES_SUMMARY[1].id);

      controller.destroy();
    });

    it('يدعم التنقل اليدوي الفوري بالسابق والتالي وتحديد رقم المقال مباشرة', () => {
      const controller = new ArticleCarouselController({
        articles: HERO_ARTICLES_SUMMARY,
        interval: 10000
      });

      expect(controller.currentIndex).toBe(0);

      // التنقل للمقال التالي
      controller.next();
      expect(controller.currentIndex).toBe(1);

      // التنقل لمقال محدد مباشرة (مثلاً المقال العاشر)
      controller.goTo(9);
      expect(controller.currentIndex).toBe(9);
      expect(controller.currentArticle.id).toBe(HERO_ARTICLES_SUMMARY[9].id);

      // التنقل للمقال السابق
      controller.prev();
      expect(controller.currentIndex).toBe(8);

      controller.destroy();
    });

    it('يعود تلقائياً إلى المقال الأول بعد اكتمال المقالات الـ 18 (Seamless Infinite Loop)', () => {
      const controller = new ArticleCarouselController({
        articles: HERO_ARTICLES_SUMMARY,
        interval: 10000
      });

      // الانتقال إلى آخر مقال (المقال 18 - الفهرس 17)
      controller.goTo(17);
      expect(controller.currentIndex).toBe(17);

      // مرور 10 ثوانٍ
      vi.advanceTimersByTime(10000);

      // يجب أن يلتف بسلاسة إلى الفهرس 0
      expect(controller.currentIndex).toBe(0);
      expect(controller.currentArticle.id).toBe(HERO_ARTICLES_SUMMARY[0].id);

      controller.destroy();
    });
  });
});
