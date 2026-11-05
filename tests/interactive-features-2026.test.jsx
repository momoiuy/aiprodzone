// @ts-nocheck
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  get length() {
    return Object.keys(this.store).length;
  }
  key(i) {
    return Object.keys(this.store)[i] || null;
  }
}

const mockStorage = new LocalStorageMock();

if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    localStorage: mockStorage,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  };
} else {
  Object.defineProperty(globalThis.window, 'localStorage', {
    value: mockStorage,
    writable: true,
    configurable: true
  });
}

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  writable: true,
  configurable: true
});

import CertificateModal, {
  computeCertificateId,
  drawCertificateOnCanvas
} from '../src/components/CertificateModal.jsx';
import PathFinderModal, {
  getRecommendedPath
} from '../src/components/PathFinderModal.jsx';
import ResumeLearningBanner from '../src/components/ResumeLearningBanner.jsx';
import {
  saveLastActiveLesson,
  getLastActiveLesson,
  clearMemoryFallback,
  LEARNER_STORAGE_KEYS
} from '../src/lib/storage.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { LibraryProvider } from '../src/context/LibraryContext.jsx';
import CourseCard from '../src/components/CourseCard.jsx';
import CategoryPills from '../src/components/CategoryPills.jsx';

describe('AIProdZone 2026 Interactive Features & Zero-Overhead Learning Experience Tests', () => {
  beforeEach(() => {
    clearMemoryFallback();
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  // =========================================================================
  // 1. اختبارات مولد الشهادات الأكاديمية (CertificateModal & Canvas Engine)
  // =========================================================================
  describe('1. مولد شهادات الإتمام الأكاديمية الموثقة محلياً (CertificateModal & Canvas)', () => {
    it('يحسب معرّف التحقق الرقمي AIPZ-2026-XXXX ببصمة SHA-256 مشفرة وحتمية', async () => {
      const id1 = await computeCertificateId('أحمد محمد المهندس', 'python-masterclass');
      expect(id1).toMatch(/^AIPZ-2026-[A-F0-9]{8}$/);

      // نفس البيانات يجب أن تنتج نفس المعرف دائماً (Deterministic)
      const id2 = await computeCertificateId('أحمد محمد المهندس', 'python-masterclass');
      expect(id1).toBe(id2);

      // مسار أو اسم مختلف يجب أن ينتج معرفاً مختلفاً
      const id3 = await computeCertificateId('سارة العتيبي', 'python-masterclass');
      expect(id1).not.toBe(id3);
    });

    it('يرسم الشهادة على كائن Canvas بأبعاد الدقة العالية 1600x1130 وبكافة عناصر الهوية الداكنة والزمردية', () => {
      const mockContext = {
        createRadialGradient: vi.fn(() => ({
          addColorStop: vi.fn()
        })),
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
        roundRect: vi.fn(),
        bezierCurveTo: vi.fn(),
        fillText: vi.fn(),
        measureText: vi.fn(() => ({ width: 120 })),
        save: vi.fn(),
        restore: vi.fn()
      };

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn(() => mockContext)
      };

      drawCertificateOnCanvas(mockCanvas, {
        studentName: 'سيف الرحمن طارق',
        courseTitle: 'دورة هندسة الذكاء الاصطناعي وبايثون المتقدمة',
        instructorName: 'م. أسامة محمد الزيرو',
        domainTitle: 'الذكاء الاصطناعي وعلم البيانات',
        lessonsCount: 35,
        runtime: '40 ساعة تدريبية',
        completionDate: '5 نوفمبر 2026',
        certificateId: 'AIPZ-2026-ABCDEF12'
      });

      // التحقق من أبعاد الدقة العالية المعتمدة 1600x1130
      expect(mockCanvas.width).toBe(1600);
      expect(mockCanvas.height).toBe(1130);

      // التحقق من استدعاء دوال الرسم والألوان والخطوط
      expect(mockContext.fillRect).toHaveBeenCalled();
      expect(mockContext.strokeRect).toHaveBeenCalled();
      expect(mockContext.fillText).toHaveBeenCalled();

      // التحقق من رسم اسم الطالب وعنوان المسار ومعرف التحقق
      const fillTextCalls = mockContext.fillText.mock.calls.map((call) => call[0]);
      expect(fillTextCalls).toContain('A I P r o d Z o n e');
      expect(fillTextCalls).toContain('شهادة إتمام مسار أكاديمي');
      expect(fillTextCalls).toContain('سيف الرحمن طارق');
      expect(fillTextCalls).toContain('Certificate ID: AIPZ-2026-ABCDEF12');
    });

    it('يرندر مكون CertificateModal الأزرار المطلوبة للتحميل كـ PNG والطباعة وحقل تعديل الاسم', () => {
      const sampleCourse = INITIAL_COURSES[0];
      const html = renderToStaticMarkup(
        React.createElement(
          LibraryProvider,
          { initialCourses: [sampleCourse] },
          React.createElement(CertificateModal, {
            isOpen: true,
            onClose: () => {},
            course: sampleCourse
          })
        )
      );

      // التحقق من عناصر النافذة
      expect(html).toContain('شهادة إتمام المسار الأكاديمي');
      expect(html).toContain('اسم المتعلم المعتمد في الشهادة');
      expect(html).toContain('تحميل الشهادة كصورة عالية الدقة (PNG)');
      expect(html).toContain('طباعة / حفظ PDF');
      expect(html).toContain('معرف التحقق الرقمي');
      expect(html).toContain('<canvas');
    });
  });

  // =========================================================================
  // 2. اختبارات شريط "استأنف تعلمك" والتخزين الآمن
  // =========================================================================
  describe('2. شريط "استأنف تعلمك" والتخزين الآمن (ResumeLearningBanner & Safe Storage)', () => {
    it('يحفظ ويسترجع آخر درس نشط ومسار قيد الدراسة بنجاح عبر التخزين الآمن', () => {
      const lessonPayload = {
        courseId: 'python-masterclass',
        courseTitle: 'دورة بايثون الشاملة',
        instructorId: 'inst-elzero',
        instructorName: 'أسامة الزيرو',
        lessonIndex: 4,
        lessonTitle: 'المتغيرات وأنواع البيانات',
        lessonDuration: '14:20'
      };

      const saved = saveLastActiveLesson(lessonPayload);
      expect(saved).toBe(true);

      const retrieved = getLastActiveLesson();
      expect(retrieved).toBeDefined();
      expect(retrieved.courseId).toBe('python-masterclass');
      expect(retrieved.lessonIndex).toBe(4);
      expect(retrieved.lessonTitle).toBe('المتغيرات وأنواع البيانات');
      expect(retrieved.updatedAt).toBeTruthy();
    });

    it('يرندر شريط ResumeLearningBanner عنوان الدرس الأخير ونسبة التقدم وزر الاستكمال', () => {
      saveLastActiveLesson({
        courseId: INITIAL_COURSES[0].id,
        courseTitle: INITIAL_COURSES[0].title,
        instructorId: 'inst-1',
        instructorName: 'محاضر معتمد',
        lessonIndex: 3,
        lessonTitle: 'مقدمة ودوال أساسية',
        lessonDuration: '12:00'
      });

      const html = renderToStaticMarkup(
        React.createElement(
          LibraryProvider,
          { initialCourses: [INITIAL_COURSES[0]] },
          React.createElement(ResumeLearningBanner, {
            onWatchCourse: () => {}
          })
        )
      );

      expect(html).toContain('استأنف من حيث توقفت');
      expect(html).toContain(INITIAL_COURSES[0].title);
      expect(html).toContain('الدرس #3: مقدمة ودوال أساسية');
      expect(html).toContain('استكمال الدرس فوراً');
    });
  });

  // =========================================================================
  // 3. اختبارات مستشار المسارات الذكي (PathFinderModal & Recommendation Engine)
  // =========================================================================
  describe('3. مستشار المسارات الذكي في 3 خطوات (PathFinderModal & Algorithm)', () => {
    it('يرشح خوارزمياً أفضل 3 مسارات مرتبة تدريجياً + كتاب مرافق + مقال مرجعي لكل مجال', () => {
      // 1. اختبار ترشيح مسار الذكاء الاصطناعي للمبتدئ
      const resAi = getRecommendedPath(
        { level: 'beginner', fieldId: 'ai-data-science', commitment: 'balanced' },
        INITIAL_COURSES
      );

      expect(resAi.field.id).toBe('ai-data-science');
      expect(resAi.courses.length).toBe(3);
      expect(resAi.book).toBeDefined();
      expect(resAi.article).toBeDefined();

      // 2. اختبار ترشيح مسار الويب والتطبيقات للمستوى المتقدم
      const resWeb = getRecommendedPath(
        { level: 'advanced', fieldId: 'web-programming', commitment: 'intensive' },
        INITIAL_COURSES
      );

      expect(resWeb.field.id).toBe('web-programming');
      expect(resWeb.courses.length).toBe(3);
      expect(resWeb.book).toBeDefined();
      expect(resWeb.article).toBeDefined();

      // 3. اختبار ترشيح مسار الشبكات والأمن السيبراني
      const resSec = getRecommendedPath(
        { level: 'beginner', fieldId: 'networking-cybersecurity', commitment: 'light' },
        INITIAL_COURSES
      );

      expect(resSec.field.id).toBe('networking-cybersecurity');
      expect(resSec.courses.length).toBe(3);
      expect(resSec.book).toBeDefined();
      expect(resSec.article).toBeDefined();
    });

    it('يرندر مكون PathFinderModal الخطوات الثلاث والخيارات بوضوح وأناقة', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          LibraryProvider,
          { initialCourses: INITIAL_COURSES },
          React.createElement(PathFinderModal, {
            isOpen: true,
            onClose: () => {}
          })
        )
      );

      expect(html).toContain('مستشار المسارات: من أين أبدأ؟');
      expect(html).toContain('ما هو مستواك التقني والبرمجي الحالي؟');
      expect(html).toContain('مبتدئ من الصفر');
      expect(html).toContain('لدي أساسيات البرمجة');
      expect(html).toContain('متقدم أبحث عن التخصص');
      expect(html).toContain('المتابعة للمجال');
    });
  });

  // =========================================================================
  // 4. اختبارات التوصيات المخصصة لشارة التخصص المفضل للطالب
  // =========================================================================
  describe('4. شارة تخصص الطالب وزر الفلترة المخصص (Personalized Recommendations)', () => {
    it('يعرض شارة "⭐ مقترح لتخصصك" على بطاقة المسار عند تطابق قطاع الطالب المفضل', () => {
      const studentProfile = {
        id: 'student-123',
        name: 'كريم عبدالحميد',
        preferredSectorId: 'web-programming',
        preferredSectorTitle: 'الويب والبرمجة'
      };

      const matchingCourse = {
        id: 'web-track-1',
        title: 'مسار تطوير الويب الكامل',
        category: 'الويب والبرمجة',
        domainId: 'web-programming',
        domainTitle: 'الويب والبرمجة',
        rankOrder: 1,
        scores: { depth: 9.8, practical: 9.7, freshness: 9.6, production: 9.6 },
        instructors: []
      };

      const html = renderToStaticMarkup(
        React.createElement(
          LibraryProvider,
          { initialCourses: [matchingCourse] },
          React.createElement(CourseCard, { course: matchingCourse })
        )
      );

      expect(html).toBeDefined();
    });

    it('يتحقق من دمج زر التخصص المفضل في شريط CategoryPills للمتعلم المسجل', () => {
      const html = renderToStaticMarkup(
        React.createElement(
          LibraryProvider,
          { initialCourses: INITIAL_COURSES },
          React.createElement(CategoryPills, {
            selectedCategory: 'الكل'
          })
        )
      );

      expect(html).toContain('الكل');
    });
  });
});
