import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { CURATED_AI_TOOLS } from '../src/data/tools.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { INITIAL_ARTICLES } from '../src/data/articles.js';
import { getCleanYouTubeEmbedUrl } from '../src/lib/youtube.js';

describe('المرحلة الثالثة: مشغل الفيديو وقائمة الدروس وشريط المحاضرين وقارئ المقالات', () => {
  const watchFilePath = path.resolve(process.cwd(), 'src/views/Watch.jsx');
  const watchFileContent = fs.readFileSync(watchFilePath, 'utf-8');

  const youtubePlayerPath = path.resolve(process.cwd(), 'src/components/YouTubePlayer.jsx');
  const youtubePlayerContent = fs.readFileSync(youtubePlayerPath, 'utf-8');

  const headerPath = path.resolve(process.cwd(), 'src/components/Header.jsx');
  const headerContent = fs.readFileSync(headerPath, 'utf-8');

  const articlesPath = path.resolve(process.cwd(), 'src/views/Articles.jsx');
  const articlesContent = fs.readFileSync(articlesPath, 'utf-8');

  const toolsPath = path.resolve(process.cwd(), 'src/views/Tools.jsx');
  const toolsContent = fs.readFileSync(toolsPath, 'utf-8');

  describe('1. تجربة مشغل الفيديو المثالية على الهاتف والحاسوب (Sticky Mobile Player & Desktop Cinema Layout)', () => {
    it('يتضمن حاوية تثبيت مشغل الفيديو على شاشات الهاتف بنمط sticky top-0 z-30 shadow-md', () => {
      expect(watchFileContent).toContain('sticky top-0 z-30 shadow-md');
      expect(watchFileContent).toContain('isStickyMobile');
      expect(watchFileContent).toContain('aspect-video');
    });

    it('يحافظ مشغل YouTubePlayer الصارم على نسبة العرض إلى الارتفاع aspect-video w-full وعزل no-cookie', () => {
      expect(youtubePlayerContent).toContain('aspect-video w-full');
      expect(youtubePlayerContent).toContain('getCleanYouTubeEmbedUrl');
      const embedUrl = getCleanYouTubeEmbedUrl('wHIdCNIQHpo', {});
      expect(embedUrl).toContain('https://www.youtube-nocookie.com/embed/wHIdCNIQHpo');
      expect(embedUrl).toContain('enablejsapi=1');
    });

    it('يتضمن زر وضع التركيز / السينما (Focus / Theater Mode) بجانب أدوات التحكم على الحاسوب', () => {
      expect(watchFileContent).toContain('isFocusMode');
      expect(watchFileContent).toContain('وضع التركيز / السينما');
      expect(watchFileContent).toContain('إنهاء وضع السينما');
      expect(watchFileContent).toContain('Maximize2');
      expect(watchFileContent).toContain('Minimize2');
    });

    it('يوسع المشغل إلى 12 عموداً ويطوي القائمة الجانبية عند تفعيل وضع السينما، ويدعم مفتاح Esc', () => {
      expect(watchFileContent).toContain("isFocusMode ? 'lg:col-span-12' : 'lg:col-span-8'");
      expect(watchFileContent).toContain("isFocusMode ? 'hidden' : 'lg:col-span-4'");
      expect(watchFileContent).toContain("e.key === 'Escape'");
    });

    it('يضبط شريط التنقل العلوي Header في صفحة المشاهدة ليتيح تثبيت المشغل في top-0 بسلاسة على الهاتف', () => {
      expect(headerContent).toContain("view === 'watch' ? 'relative lg:sticky' : 'sticky'");
    });

    it('يضمن ظهور زر "أضف شرحاً" الدائم وعدم انحشاره أو اختفائه عبر تجاوب ذكي في شريط الهيدر', () => {
      expect(headerContent).toContain('aria-label="أضف شرحاً"');
      expect(headerContent).toContain('hidden xl:flex');
      expect(headerContent).toContain('xl:hidden');
      expect(headerContent).toContain('max-w-[1440px]');
    });
  });

  describe('2. شريط التبديل بين المحاضرين (Multi-Instructor Switcher) وقائمة الدروس', () => {
    it('يدعم شريط التبديل بين المحاضرين التمرير الأفقي السلس على الهاتف overflow-x-auto flex-nowrap gap-2 pb-1', () => {
      expect(watchFileContent).toContain('overflow-x-auto flex-nowrap pb-1');
      expect(watchFileContent).toContain('shrink-0 whitespace-nowrap');
    });

    it('يميز المحاضر النشط حالياً بتحديد بصري ring-2 ring-[#14B8A6] bg-[#14B8A6]/10 ونسبة التقدم المحفوظة', () => {
      expect(watchFileContent).toContain('ring-2 ring-[#14B8A6] bg-[#14B8A6]/10');
      expect(watchFileContent).toContain('instProgressPct');
    });

    it('يعزل عناوين الدروس في قائمة التشغيل باتجاه dir="rtl" سليم لمنع انعكاس الكلمات الإنجليزية', () => {
      expect(watchFileContent).toContain('dir="rtl"');
      expect(watchFileContent).toContain('[unicode-bidi:plaintext]');
    });

    it('يميز الدرس قيد التشغيل حالياً بصرياً ويتمركز تلقائياً داخل القائمة عبر scrollIntoView', () => {
      expect(watchFileContent).toContain('scrollIntoView');
      expect(watchFileContent).toContain("block: 'nearest'");
      expect(watchFileContent).toContain("behavior: 'smooth'");
      expect(watchFileContent).toContain('activeLessonItemRef');
    });
  });

  describe('3. ضبط الجداول والأكواد داخل قارئ المقالات وصفحات مقارنة الأدوات على الهاتف', () => {
    it('يحاط كل جدول داخل المقالات بحاوية تمرير أفقي مستجيبة w-full overflow-x-auto rounded-xl border مع مؤشر بصري للهاتف', () => {
      expect(articlesContent).toContain('w-full overflow-x-auto rounded-xl border');
      expect(articlesContent).toContain('اسحب أفقياً لتصفح كامل أعمدة الجدول');
      expect(articlesContent).toContain('اسحب أفقياً لتصفح كامل أعمدة المصفوفة');
    });

    it('يعزل كتل الأكواد البرمجية pre code باتجاه dir="ltr" text-left overflow-x-auto لمنع انعكاس الأقواس', () => {
      expect(articlesContent).toContain('dir="ltr" className="text-left overflow-x-auto');
      expect(articlesContent).toContain('<code dir="ltr" className="text-left font-mono');
    });

    it('تحتوي صفحة Curated AI Tools على جدول مقارنة مستجيب مع مؤشر بصري وأوامر CLI معزولة', () => {
      expect(toolsContent).toContain('w-full overflow-x-auto rounded-xl border');
      expect(toolsContent).toContain('اسحب أفقياً لتصفح كامل جدول المقارنة');
      expect(toolsContent).toContain('dir="ltr" className="text-left overflow-x-auto font-mono text-[11px] text-emerald-400"');
      expect(CURATED_AI_TOOLS.length).toBe(8);
      expect(CURATED_AI_TOOLS.every((t) => typeof t.command === 'string' && t.command.length > 0)).toBe(true);
    });
  });
});
