import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'fs';
import path from 'path';

import { INITIAL_COURSES } from '../src/data/courses.js';
import { EBOOK_GUIDES } from '../src/data/ebooks.js';
import { INITIAL_ARTICLES } from '../src/data/articles.js';
import { ACADEMIC_DOMAINS } from '../src/data/categories.js';

import { LibraryProvider } from '../src/context/LibraryContext.jsx';
import Footer from '../src/components/Footer.jsx';
import CourseCard from '../src/components/CourseCard.jsx';
import Card from '../src/components/Card.jsx';
import Chip from '../src/components/Chip.jsx';
import SubmitModal from '../src/components/SubmitModal.jsx';
import BrandModal from '../src/components/BrandModal.jsx';
import Sidebar from '../src/components/Sidebar.jsx';

describe('المرحلة الرابعة: هندسة الجودة وإمكانية الوصول والتوافق الشامل (QA, A11y & Responsiveness Audit)', () => {
  // =========================================================================
  // 1. فحص اكتمال بيانات المسارات (73) والكتب (114) والمقالات (18)
  // =========================================================================
  describe('1. فحص اكتمال ونزاهة البيانات الأكاديمية (Data Integrity & Card Safety)', () => {
    it('يتحقق من اكتمال جميع المسارات الـ 73 بدون أي حقل فارغ يسبب كسراً في البطاقات', () => {
      expect(INITIAL_COURSES.length).toBe(73);

      INITIAL_COURSES.forEach((course, idx) => {
        // الحقول الأساسية الإلزامية لكل مسار
        expect(course.id, `المسار #${idx} يفتقد إلى id`).toBeTruthy();
        expect(course.title, `المسار ${course.id} يفتقد إلى title`).toBeTruthy();
        expect(course.category, `المسار ${course.id} يفتقد إلى category`).toBeTruthy();
        expect(course.level, `المسار ${course.id} يفتقد إلى level`).toBeTruthy();
        expect(course.runtime, `المسار ${course.id} يفتقد إلى runtime`).toBeTruthy();
        expect(typeof course.viewsCount, `المسار ${course.id} يحتاج إلى viewsCount كرقم`).toBe('number');

        // درجات التقييم الأربعة المنهجية
        expect(course.scores, `المسار ${course.id} يفتقد كائن scores`).toBeDefined();
        expect(course.scores.depth).toBeGreaterThanOrEqual(8);
        expect(course.scores.practical).toBeGreaterThanOrEqual(8);
        expect(course.scores.freshness).toBeGreaterThanOrEqual(8);
        expect(course.scores.production).toBeGreaterThanOrEqual(8);

        // قائمة المحاضرين المعتمدين
        expect(Array.isArray(course.instructors), `المسار ${course.id} يجب أن يحتوي مصفوفة instructors`).toBe(true);
        expect(course.instructors.length, `المسار ${course.id} يجب أن يحتوي محاضراً واحداً على الأقل`).toBeGreaterThanOrEqual(1);

        // التحقق من بيانات المحاضر الأساسي
        const primaryInst = course.instructors.find((i) => i.role === 'أساسي') || course.instructors[0];
        expect(primaryInst.id).toBeTruthy();
        expect(primaryInst.name).toBeTruthy();
        expect(primaryInst.durationText).toBeTruthy();
        expect(primaryInst.lessonsCount || primaryInst.lessons?.length).toBeGreaterThan(0);
      });
    });

    it('يتحقق من اكتمال جميع الكتب والأدلة الرقمية الـ 114 ببيانات سليمة ومكتملة', () => {
      expect(EBOOK_GUIDES.length).toBe(114);

      EBOOK_GUIDES.forEach((ebook, idx) => {
        expect(ebook.id, `الكتاب #${idx} يفتقد إلى id`).toBeTruthy();
        expect(ebook.title, `الكتاب ${ebook.id} يفتقد إلى title`).toBeTruthy();
        expect(ebook.category || ebook.categoryName, `الكتاب ${ebook.id} يفتقد التصنيف`).toBeTruthy();
        expect(ebook.excerpt || ebook.content, `الكتاب ${ebook.id} يفتقد النبذة أو المحتوى`).toBeTruthy();
        expect(ebook.pages || ebook.fileType, `الكتاب ${ebook.id} يفتقد عدد الصفحات أو نوع الملف`).toBeTruthy();
      });
    });

    it('يتحقق من اكتمال جميع المقالات التقنية الـ 18 بكامل الأقسام والوسوم والجغرافيا', () => {
      expect(INITIAL_ARTICLES.length).toBe(18);

      INITIAL_ARTICLES.forEach((article, idx) => {
        expect(article.id, `المقال #${idx} يفتقد id`).toBeTruthy();
        expect(article.title, `المقال ${article.id} يفتقد title`).toBeTruthy();
        expect(article.slug, `المقال ${article.id} يفتقد slug`).toBeTruthy();
        expect(article.category, `المقال ${article.id} يفتقد category`).toBeTruthy();
        expect(article.summary, `المقال ${article.id} يفتقد summary`).toBeTruthy();
        expect(article.author, `المقال ${article.id} يفتقد author`).toBeTruthy();
        expect(article.readTime, `المقال ${article.id} يفتقد readTime`).toBeTruthy();

        // فصول ومحتوى المقال
        expect(Array.isArray(article.sections), `المقال ${article.id} يفتقد مصفوفة sections`).toBe(true);
        expect(article.sections.length, `المقال ${article.id} يجب أن يحتوي فصلاً واحداً على الأقل`).toBeGreaterThanOrEqual(1);
        article.sections.forEach((sec, sIdx) => {
          expect(sec.heading, `المقال ${article.id} الفصل #${sIdx} يفتقد heading`).toBeTruthy();
          expect(sec.body, `المقال ${article.id} الفصل #${sIdx} يفتقد body`).toBeTruthy();
        });
      });
    });
  });

  // =========================================================================
  // 2. فحص الأرقام الإحصائية الحية في الفوتر ومطابقتها للمصفوفات
  // =========================================================================
  describe('2. فحص الأرقام الإحصائية الحية في الفوتر (Live Real-Time Stats & Contrast)', () => {
    it('يعرض الفوتر الأرقام الإحصائية الحية المطابقة بدقة لطول المصفوفات الفعلي', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          LibraryProvider,
          null,
          React.createElement(Footer, {})
        )
      );

      // يجب أن تظهر أرقام المنصة الأربعة بدقة تامة
      expect(html).toContain(`${ACADEMIC_DOMAINS.length} قطاعات`);
      expect(html).toContain(`${INITIAL_COURSES.length} مساراً`);
      expect(html).toContain(`${EBOOK_GUIDES.length} كتاباً`);
      expect(html).toContain(`${INITIAL_ARTICLES.length} مقالاً`);

      // التحقق من أرقام المرحلة: 8 قطاعات، 73 مساراً، 114 كتاباً، 18 مقالاً
      expect(html).toContain('8 قطاعات');
      expect(html).toContain('73 مساراً');
      expect(html).toContain('114 كتاباً');
      expect(html).toContain('18 مقالاً');
    });

    it('يستخدم الفوتر درجات التباين الزمردي العميقة المطابقة لمعايير WCAG AA للأرقام الإحصائية', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          LibraryProvider,
          null,
          React.createElement(Footer, {})
        )
      );

      // تأكيد وجود فئة التباين المحسنة text-teal-700 dark:text-teal-400
      expect(html).toContain('text-teal-700 dark:text-teal-400');
      expect(html).toContain('border-slate-200/80 dark:border-slate-800');
    });
  });

  // =========================================================================
  // 3. فحص خصائص الاحتواء (Containment & Truncation) واتجاه النصوص للبطاقات
  // =========================================================================
  describe('3. فحص خصائص الاحتواء والاتجاه في البطاقات الرئيسية (Card Containment & Typography)', () => {
    it('ترسم بطاقة CourseCard عناوينها وأزرارها بخصائص الاحتواء الصارمة (truncate / line-clamp-2)', () => {
      const sampleCourse = INITIAL_COURSES[0];
      const html = renderToStaticMarkup(
        React.createElement(
          LibraryProvider,
          null,
          React.createElement(CourseCard, { course: sampleCourse, onWatchCourse: () => {} })
        )
      );

      // احتواء العنوان مع dir="rtl" و line-clamp-2
      expect(html).toContain('line-clamp-2');
      expect(html).toContain('dir="rtl"');
      expect(html).toContain('[unicode-bidi:plaintext]');

      // احتواء زر الإجراء مع truncate و min-w-0 و max-w-full
      expect(html).toContain('truncate');
      expect(html).toContain('max-w-full');
      expect(html).toContain('overflow-hidden');

      // تباين الزر الزمردي في الوضع النهاري والليلي
      expect(html).toContain('text-teal-700 dark:text-teal-400');
    });

    it('يضمن مكون Card حدوداً نظيفة وبارزة في الوضع النهاري والليلي (border-slate-200/80 dark:border-slate-800)', () => {
      const html = renderToStaticMarkup(
        React.createElement(Card, { className: 'test-card' }, 'محتوى البطاقة')
      );

      expect(html).toContain('border-slate-200/80 dark:border-slate-800');
      expect(html).toContain('rounded-2xl');
      expect(html).toContain('bg-surface');
    });

    it('يضمن مكون Chip تبايناً لونياً زمردياً فائق الوضوح (text-teal-700 dark:text-teal-400)', () => {
      const accentChip = renderToStaticMarkup(
        React.createElement(Chip, { tone: 'accent' }, 'شارة زمردية')
      );
      expect(accentChip).toContain('text-teal-700 dark:text-teal-400');
      expect(accentChip).toContain('bg-accent-soft');

      const neutralChip = renderToStaticMarkup(
        React.createElement(Chip, { tone: 'neutral' }, 'شارة محايدة')
      );
      expect(neutralChip).toContain('border-slate-200/80 dark:border-slate-800');
      expect(neutralChip).toContain('text-text-muted');
    });
  });

  // =========================================================================
  // 4. ضمان صفر انزياح أفقي على الهواتف (Zero Horizontal Scroll Guarantee)
  // =========================================================================
  describe('4. ضمان صفر انزياح أفقي على الهواتف (Zero Horizontal Scroll Guarantee)', () => {
    it('يحتوي ملف app/layout.tsx على overflow-x-hidden على مستوى الجذر والجسم', () => {
      const layoutContent = fs.readFileSync(path.resolve(process.cwd(), 'app/layout.tsx'), 'utf-8');
      expect(layoutContent).toContain('overflow-x-hidden');
      expect(layoutContent).toContain('w-full max-w-full');
    });

    it('يحتوي ملف app/globals.css على overflow-x: hidden وقاعدة .no-scrollbar المساعدة', () => {
      const cssContent = fs.readFileSync(path.resolve(process.cwd(), 'app/globals.css'), 'utf-8');
      expect(cssContent).toContain('overflow-x: hidden');
      expect(cssContent).toContain('.no-scrollbar');
      expect(cssContent).toContain('scrollbar-width: none !important');
      expect(cssContent).toContain('display: none !important');
    });

    it('يحتوي ملف src/App.jsx على overflow-x-hidden على الحاوية الرئيسية', () => {
      const appContent = fs.readFileSync(path.resolve(process.cwd(), 'src/App.jsx'), 'utf-8');
      expect(appContent).toContain('overflow-x-hidden');
    });

    it('يضمن احتواء النوافذ المنبثقة SubmitModal و BrandModal لشاشات الهاتف الصغير بدقة (w-[calc(100vw-1.5rem)])', () => {
      const submitModalContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/SubmitModal.jsx'), 'utf-8');
      expect(submitModalContent).toContain('w-[calc(100vw-1.5rem)]');
      expect(submitModalContent).toContain('max-h-[90vh]');
      expect(submitModalContent).toContain('overflow-y-auto');

      const brandModalContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/BrandModal.jsx'), 'utf-8');
      expect(brandModalContent).toContain('w-[calc(100vw-1.5rem)]');
      expect(brandModalContent).toContain('max-h-[90vh]');
      expect(brandModalContent).toContain('overflow-y-auto');
    });

    it('يضمن احتواء القائمة الجانبية Sidebar لشاشات الهاتف دون خروج عن الحواف', () => {
      const sidebarContent = fs.readFileSync(path.resolve(process.cwd(), 'src/components/Sidebar.jsx'), 'utf-8');
      expect(sidebarContent).toContain('max-w-[calc(100vw-1.5rem)]');
      expect(sidebarContent).toContain('overflow-y-auto');
    });

    it('يحتوي tailwind.config.ts على دعم data-theme="dark" لمطابقة محدد الوضع الليلي', () => {
      const tailwindContent = fs.readFileSync(path.resolve(process.cwd(), 'tailwind.config.ts'), 'utf-8');
      expect(tailwindContent).toContain("darkMode: ['class', '[data-theme=\"dark\"]']");
    });
  });
});
