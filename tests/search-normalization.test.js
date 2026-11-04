import { describe, it, expect } from 'vitest';
import { normalizeArabicSearch, matchesSmartSearch } from '../src/lib/search.js';
import { INITIAL_COURSES_SUMMARY, TOP_DROPDOWN_DATA, HERO_LUXURY_BG } from '../src/data/courses-summary.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { ACADEMIC_DOMAINS } from '../src/data/categories.js';

describe('Arabic Smart Normalization & Search Engine (ترقية محرك البحث العربي الذكي)', () => {
  describe('1. تطبيع الحروف العربية وتوحيد الهمزات والتاء المربوطة وإزالة التشكيل (normalizeArabicSearch)', () => {
    it('يوحد كافة صور الهمزات (أ، إ، آ، ٱ) إلى ألف مجردة (ا)', () => {
      expect(normalizeArabicSearch('أحمد')).toBe('احمد');
      expect(normalizeArabicSearch('إبراهيم')).toBe('ابراهيم');
      expect(normalizeArabicSearch('آلة')).toBe('اله'); // آ ➔ ا، ة ➔ ه
      expect(normalizeArabicSearch('ٱصطناعي')).toBe('اصطناعي');
      expect(normalizeArabicSearch('الذكاء الإصطناعي')).toBe('الذكاء الاصطناعي');
    });

    it('يوحد التاء المربوطة (ة) إلى هاء (ه)', () => {
      expect(normalizeArabicSearch('برمجة')).toBe('برمجه');
      expect(normalizeArabicSearch('هندسة')).toBe('هندسه');
      expect(normalizeArabicSearch('دورة')).toBe('دوره');
      expect(normalizeArabicSearch('قاعدة بيانات')).toBe('قاعده بيانات');
    });

    it('يوحد الألف المقصورة (ى) إلى ياء (ي)', () => {
      expect(normalizeArabicSearch('علي')).toBe('علي');
      expect(normalizeArabicSearch('على')).toBe('علي');
      expect(normalizeArabicSearch('مبتدئ')).toBe('مبتدئ');
      expect(normalizeArabicSearch('مبتدى')).toBe('مبتدي');
      expect(normalizeArabicSearch('مستوى')).toBe('مستوي');
    });

    it('يزيل التشكيل وحركات الإعراب والتطويل (Tashkeel, Harakat, Tatweel)', () => {
      expect(normalizeArabicSearch('بَايْثُون')).toBe('بايثون');
      expect(normalizeArabicSearch('ذَكَاءٌ اصْطِنَاعِيّ')).toBe('ذكاء اصطناعي');
      expect(normalizeArabicSearch('مُحَاضِرٌ')).toBe('محاضر');
      expect(normalizeArabicSearch('تـــــطـــــويـــــر')).toBe('تطوير'); // علامات التطويل
    });

    it('يحول الأحرف الإنجليزية إلى lowercase ويزيل المسافات الزائدة', () => {
      expect(normalizeArabicSearch('  Python  ')).toBe('python');
      expect(normalizeArabicSearch('JavaScript & TypeScript')).toBe('javascript & typescript');
      expect(normalizeArabicSearch('Docker & KUBERNETES')).toBe('docker & kubernetes');
    });

    it('يتعامل بأمان مع القيم الفارغة والمدخلات غير النصية', () => {
      expect(normalizeArabicSearch(null)).toBe('');
      expect(normalizeArabicSearch(undefined)).toBe('');
      expect(normalizeArabicSearch('')).toBe('');
      expect(normalizeArabicSearch(12345)).toBe('12345');
    });
  });

  describe('2. المطابقة الذكية للبحث السريع (matchesSmartSearch)', () => {
    const courseTitle = 'دورة بايثون الشاملة من الصفر حتى الاحتراف (Python Masterclass)';
    const instructorsText = 'أسامة محمد (الزيرو) إسلام هشام (كودزيلا - Codezilla) عبدالرحمن جمال';
    const aiCourseTitle = 'مسار الذكاء الاصطناعي وهندسة الأوامر المتقدمة (AI & Prompt Engineering)';

    it('يطابق البحث حتى لو اختلف رسم الهمزة ("ذكاء اصطناعي" و "إصطناعي")', () => {
      expect(matchesSmartSearch(aiCourseTitle, 'ذكاء اصطناعي')).toBe(true);
      expect(matchesSmartSearch(aiCourseTitle, 'إصطناعي')).toBe(true);
      expect(matchesSmartSearch(aiCourseTitle, 'اصطناعي')).toBe(true);
      expect(matchesSmartSearch(aiCourseTitle, 'الذكاء')).toBe(true);
    });

    it('يطابق أسماء المحاضرين بالهمزة وبدونها ("احمد" و "أحمد")', () => {
      expect(matchesSmartSearch(instructorsText, 'محمد')).toBe(true);
      expect(matchesSmartSearch(instructorsText, 'الزيرو')).toBe(true);
      expect(matchesSmartSearch(instructorsText, 'كودزيلا')).toBe(true);
      expect(matchesSmartSearch(instructorsText, 'Codezilla')).toBe(true);
      expect(matchesSmartSearch(instructorsText, 'عبدالرحمن')).toBe(true);
      expect(matchesSmartSearch('المحاضر أحمد ناصر', 'احمد')).toBe(true);
      expect(matchesSmartSearch('المحاضر احمد ناصر', 'أحمد')).toBe(true);
    });

    it('يطابق الكلمات الإنجليزية والعربية للتقنيات ("بايثون" و "python")', () => {
      expect(matchesSmartSearch(courseTitle, 'بايثون')).toBe(true);
      expect(matchesSmartSearch(courseTitle, 'python')).toBe(true);
      expect(matchesSmartSearch(courseTitle, 'PYTHON')).toBe(true);
      expect(matchesSmartSearch(courseTitle, 'Masterclass')).toBe(true);
    });

    it('يدعم البحث متعدد الكلمات (Multi-token Search) عبر مختلف الحقول', () => {
      const combined = `${courseTitle} ${instructorsText}`;
      expect(matchesSmartSearch(combined, 'بايثون الزيرو')).toBe(true);
      expect(matchesSmartSearch(combined, 'python codezilla')).toBe(true);
      expect(matchesSmartSearch(combined, 'بايثون احتراف')).toBe(true);
    });

    it('يعيد true إذا كان استعلام البحث فارغاً ويعيد false إذا لم يتطابق', () => {
      expect(matchesSmartSearch(courseTitle, '')).toBe(true);
      expect(matchesSmartSearch(courseTitle, '   ')).toBe(true);
      expect(matchesSmartSearch(courseTitle, 'لغة رست غير موجودة')).toBe(false);
    });
  });

  describe('3. سلامة بيانات بطاقات الصفحة الرئيسية الخفيفة (courses-summary.js)', () => {
    it('تحتوي INITIAL_COURSES_SUMMARY على 73 مساراً تعليمياً كاملاً دون نقص', () => {
      expect(INITIAL_COURSES_SUMMARY.length).toBe(73);
      expect(INITIAL_COURSES_SUMMARY.length).toBe(INITIAL_COURSES.length);
    });

    it('تغطي كافة القطاعات الأكاديمية الـ 8 دون أي معرّف مكرر', () => {
      const ids = INITIAL_COURSES_SUMMARY.map((c) => c.id);
      expect(new Set(ids).size).toBe(73);

      const domainIds = new Set(INITIAL_COURSES_SUMMARY.map((c) => c.domainId));
      expect(domainIds.size).toBe(8);
      ACADEMIC_DOMAINS.forEach((domain) => {
        expect(domainIds.has(domain.id)).toBe(true);
      });
    });

    it('تتضمن بيانات البطاقة العلوية الأساسية بدون شحن مصفوفات الفيديوهات الضخمة', () => {
      INITIAL_COURSES_SUMMARY.forEach((course) => {
        expect(course.id).toBeTruthy();
        expect(course.title).toBeTruthy();
        expect(course.domainId).toBeTruthy();
        expect(course.domainTitle).toBeTruthy();
        expect(course.instructor).toBeTruthy();
        expect(typeof course.viewsCount).toBe('number');
        expect(Array.isArray(course.instructors)).toBe(true);
        expect(course.instructors.length).toBeGreaterThan(0);

        // التحقق من خفة الحزمة: مصفوفات الدروس يجب أن تكون فارغة في ملخص الصفحة الرئيسية
        course.instructors.forEach((inst) => {
          expect(inst.id).toBeTruthy();
          expect(inst.name).toBeTruthy();
          expect(typeof inst.lessonsCount).toBe('number');
          expect(inst.lessonsCount).toBeGreaterThan(0);
          expect(Array.isArray(inst.lessons)).toBe(true);
          expect(inst.lessons.length).toBe(0); // مفصولة لتخفيض حزمة الصفحة الرئيسية!
        });
      });
    });

    it('تحتوي على الثوابت المشتركة TOP_DROPDOWN_DATA و HERO_LUXURY_BG', () => {
      expect(Array.isArray(TOP_DROPDOWN_DATA)).toBe(true);
      expect(TOP_DROPDOWN_DATA.length).toBe(4);
      expect(typeof HERO_LUXURY_BG).toBe('string');
      expect(HERO_LUXURY_BG).toContain('hero-bg');
    });
  });
});
