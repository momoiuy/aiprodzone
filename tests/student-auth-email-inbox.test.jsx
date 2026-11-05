// @ts-nocheck
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  STUDENT_STORAGE_KEY,
  generateSyncKey,
  encodePortableSyncCode,
  decodePortableSyncCode,
  getSavedStudentProfile,
  saveStudentProfileToStorage,
  clearStudentProfileFromStorage
} from '../src/lib/student-auth';

import {
  OWNER_EMAIL_STORAGE_KEY,
  WEB3FORMS_KEY_STORAGE_KEY,
  INBOX_STORAGE_KEY,
  DEFAULT_OWNER_EMAIL,
  NOTIFICATION_TYPES,
  getOwnerEmail,
  setOwnerEmail,
  getWeb3FormsKey,
  setWeb3FormsKey,
  getInboxMessages,
  saveInboxMessage,
  deleteInboxMessage,
  clearInboxMessages,
  getInboxStats,
  exportInboxToCsv,
  sendEmailNotification,
  testEmailNotification
} from '../src/lib/email-service';

import Header from '../src/components/Header';
import StudentProfileHub from '../src/components/StudentProfileHub';
import StudentAuthModal from '../src/components/StudentAuthModal';
import ContactFormSection from '../src/components/ContactFormSection';
import { LibraryProvider } from '../src/context/LibraryContext';
import { POST as contactApiHandler } from '../app/api/contact/route';

describe('AIProdZone Student Registration & Zero-Overhead Email System Tests', () => {
  let mockStorage = {};

  const storageMock = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(mockStorage, k) ? mockStorage[k] : null),
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { mockStorage = {}; }
  };

  beforeEach(() => {
    mockStorage = {};
    globalThis.localStorage = storageMock;
    globalThis.window = {
      localStorage: storageMock,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. اختبارات نظام تسجيل حساب المتعلم الأكاديمي وكود المزامنة المحمول Base64
  // =========================================================================
  describe('1. نظام حساب المتعلم الأكاديمي والترميز المحمول فائق الخفة (Zero-Overhead)', () => {
    it('يولد مفتاح مزامنة محمول بشري القراءة بصيغة APZ-XXXX-XXXX', () => {
      const key = generateSyncKey();
      expect(key).toMatch(/^APZ-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    });

    it('يحفظ ويسترجع الملف الشخصي للمتعلم بدقة وأمان في التخزين المحلي', () => {
      expect(getSavedStudentProfile()).toBeNull();

      const profile = {
        id: 'student-test-123',
        name: 'م. سيف الرحمن الهاشمي',
        email: 'sayf@aiprodzone.com',
        preferredSectorId: 'ai-data-science',
        preferredSectorTitle: 'الذكاء الاصطناعي وعلم البيانات',
        registeredAt: new Date().toISOString(),
        syncKey: generateSyncKey()
      };

      const saved = saveStudentProfileToStorage(profile);
      expect(saved).toBe(true);

      const retrieved = getSavedStudentProfile();
      expect(retrieved).not.toBeNull();
      expect(retrieved.name).toBe('م. سيف الرحمن الهاشمي');
      expect(retrieved.email).toBe('sayf@aiprodzone.com');

      clearStudentProfileFromStorage();
      expect(getSavedStudentProfile()).toBeNull();
    });

    it('يشفر كود المزامنة المحمول بـ Base64 بأمان تام للأحرف العربية ويفك تشفيره دون أي تشويه', () => {
      const profile = {
        id: 'student-999',
        name: 'د. طارق محمود',
        email: 'tarek@example.org',
        preferredSectorId: 'computer-science',
        preferredSectorTitle: 'علوم الحاسوب',
        registeredAt: '2026-11-05T12:00:00.000Z',
        syncKey: 'APZ-TRK9-9999'
      };

      const progressData = {
        watchlistIds: ['course-1', 'course-2'],
        completedIds: ['course-1'],
        completedLessons: { 'course-1_inst-1_0': true, 'course-1_inst-1_1': true },
        userRatings: { 'course-1': { overall: 9.8 } },
        customComments: { 'course-1': [{ text: 'شرح ممتاز جداً' }] }
      };

      const syncCode = encodePortableSyncCode(profile, progressData);
      expect(typeof syncCode).toBe('string');
      expect(syncCode.length).toBeGreaterThan(20);

      const decoded = decodePortableSyncCode(syncCode);
      expect(decoded.valid).toBe(true);
      expect(decoded.payload.profile.name).toBe('د. طارق محمود');
      expect(decoded.payload.profile.email).toBe('tarek@example.org');
      expect(decoded.payload.profile.preferredSectorTitle).toBe('علوم الحاسوب');
      expect(decoded.payload.progress.watchlistIds).toEqual(['course-1', 'course-2']);
      expect(decoded.payload.progress.completedIds).toEqual(['course-1']);
      expect(decoded.payload.progress.completedLessons['course-1_inst-1_0']).toBe(true);
    });

    it('يتعامل بمرونة وأمان مع الأكواد التالفة أو غير الصالحة', () => {
      expect(decodePortableSyncCode('')).toEqual({ valid: false, error: 'كود المزامنة فارغ أو غير صالح' });
      expect(decodePortableSyncCode('abc')).toEqual({ valid: false, error: 'كود المزامنة قصير جداً' });
      expect(decodePortableSyncCode('invalid-base64-random-string-xyz').valid).toBe(false);
    });
  });

  // =========================================================================
  // 2. اختبارات واجهة المستخدم (Header & ProfileHub) وزر الزمردي #14B8A6
  // =========================================================================
  describe('2. واجهات المستخدم للهيدر ومحفظة الطالب (UI Presentation)', () => {
    it('يعرض الهيدر زر إنشاء حساب أكاديمي مجاني #14B8A6 ورابط حسابي ومحفظتي للزائر', () => {
      const html = renderToStaticMarkup(
        <LibraryProvider>
          <Header
            view="courses"
            setView={() => {}}
            displayMode="grid"
            setDisplayMode={() => {}}
            searchQuery=""
            setSearchQuery={() => {}}
            onOpenSidebar={() => {}}
            onOpenSubmitModal={() => {}}
            onResetHome={() => {}}
          />
        </LibraryProvider>
      );

      // وجود الزر الزمردي
      expect(html).toContain('إنشاء حساب أكاديمي مجاني ✨');
      expect(html).toContain('background-color:#14B8A6');

      // الحفاظ على رابط حسابي ومحفظتي للتوافق الصارم
      expect(html).toContain('حسابي ومحفظتي');
      expect(html).toContain('/profile');
    });

    it('تعرض محفظة الطالب بطاقة التسجيل الأكاديمي الفوري بالزر الزمردي عند عدم تسجيل الدخول', () => {
      const html = renderToStaticMarkup(
        <LibraryProvider>
          <StudentProfileHub />
        </LibraryProvider>
      );

      expect(html).toContain('إنشاء حساب أكاديمي مجاني ✨');
      expect(html).toContain('background-color:#14B8A6');
      expect(html).toContain('استعادة حساب سابق 🔄');
      expect(html).toContain('محفظتي وحسابي التعليمي الخاص');
      expect(html).toContain('النسخ الاحتياطي ونقل التقدم (تصدير / استيراد JSON Backup)');
    });

    it('يحتوي مودال التسجيل StudentAuthModal على كافة الحقول المطلوبة وأزرار التبديل', () => {
      const html = renderToStaticMarkup(
        <LibraryProvider>
          <StudentAuthModal isOpen={true} onClose={() => {}} initialMode="register" />
        </LibraryProvider>
      );

      expect(html).toContain('إنشاء حساب أكاديمي مجاني');
      expect(html).toContain('الاسم الكامل (لإصدار شهادات الإتمام باسمك)');
      expect(html).toContain('البريد الإلكتروني (للتحديثات الأكاديمية واستعادة الحساب)');
      expect(html).toContain('القطاع الأكاديمي المفضل (لتخصيص توصياتك)');
      expect(html).toContain('استعادة حساب 🔄');
    });

    it('يحتوي مكون ContactFormSection على نموذج تذاكر التواصل وتصنيفاتها الأربعة', () => {
      const html = renderToStaticMarkup(
        <LibraryProvider>
          <ContactFormSection />
        </LibraryProvider>
      );

      expect(html).toContain('أرسل تذكرتك أو استفسارك الأكاديمي');
      expect(html).toContain('الاسم الكامل');
      expect(html).toContain('البريد الإلكتروني للرد');
      expect(html).toContain('تصنيف التذكرة');
      expect(html).toContain('استفسار عام حول المسارات الأكاديمية');
      expect(html).toContain('إرسال التذكرة الآن ✉️');
    });
  });

  // =========================================================================
  // 3. اختبارات نظام البريد وصندوق الوارد وتصدير CSV
  // =========================================================================
  describe('3. نظام الإشعارات البريدية المجانية وصندوق الوارد وإدارته (Email Service & Inbox)', () => {
    it('يتيح قراءة وتعديل بريد المالك الرسمي واستعادته بنجاح', () => {
      expect(getOwnerEmail()).toBe(DEFAULT_OWNER_EMAIL);

      setOwnerEmail('founder@aiprodzone.com');
      expect(getOwnerEmail()).toBe('founder@aiprodzone.com');

      // تجاهل القيم غير الصالحة
      setOwnerEmail('not-an-email');
      expect(getOwnerEmail()).toBe('founder@aiprodzone.com');
    });

    it('يحفظ الرسائل الواردة محلياً ويفرزها ويحسب إحصائياتها بدقة', () => {
      expect(getInboxMessages()).toEqual([]);

      saveInboxMessage({
        type: NOTIFICATION_TYPES.STUDENT_REGISTRATION,
        senderName: 'محمد أحمد',
        senderEmail: 'mohamed@test.com',
        subject: 'طالب جديد',
        details: { track: 'الويب والبرمجة' }
      });

      saveInboxMessage({
        type: NOTIFICATION_TYPES.CONTACT_TICKET,
        senderName: 'سارة خالد',
        senderEmail: 'sara@test.com',
        subject: 'استفسار شهادة',
        details: { question: 'متى تصدر الشهادة؟' }
      });

      saveInboxMessage({
        type: NOTIFICATION_TYPES.COURSE_SUGGESTION,
        senderName: 'ياسين علي',
        senderEmail: 'yassine@test.com',
        subject: 'كورس Next.js 14',
        details: { youtube: 'https://youtube.com/watch?v=12345678901' }
      });

      const messages = getInboxMessages();
      expect(messages.length).toBe(3);

      const stats = getInboxStats(messages);
      expect(stats.total).toBe(3);
      expect(stats.students).toBe(1);
      expect(stats.tickets).toBe(1);
      expect(stats.suggestions).toBe(1);

      deleteInboxMessage(messages[0].id);
      expect(getInboxMessages().length).toBe(2);

      clearInboxMessages();
      expect(getInboxMessages().length).toBe(0);
    });

    it('يصدر صندوق الوارد إلى ملف CSV صالح بترميز UTF-8 مع BOM لبرامج الجداول (Excel)', () => {
      saveInboxMessage({
        type: NOTIFICATION_TYPES.STUDENT_REGISTRATION,
        senderName: 'أحمد محمود',
        senderEmail: 'ahmed@example.com',
        subject: 'تسجيل طالب جديد',
        details: { القطاع: 'الذكاء الاصطناعي' }
      });

      const csv = exportInboxToCsv();
      // وجود BOM في بداية الملف لمنع تشوه العربية
      expect(csv.charCodeAt(0)).toBe(0xFEFF);
      expect(csv).toContain('المعرف');
      expect(csv).toContain('أحمد محمود');
      expect(csv).toContain('ahmed@example.com');
      expect(csv).toContain('الذكاء الاصطناعي');
    });

    it('ينفذ sendEmailNotification ويحفظ الرسالة محلياً فوراً حتى لو فشل الخادم الخارجي', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network offline'));

      const res = await sendEmailNotification({
        type: NOTIFICATION_TYPES.CONTACT_TICKET,
        subject: 'فحص تجريبي للشبكة',
        senderName: 'فاحص النظام',
        senderEmail: 'tester@test.com',
        details: { test: true }
      });

      expect(res.success).toBe(true);
      expect(res.messageId).toBeTruthy();

      const messages = getInboxMessages();
      expect(messages.some((m) => m.id === res.messageId)).toBe(true);
    });
  });

  // =========================================================================
  // 4. اختبار مسار الخادم الداخلي /api/contact لمعالجة الإرسال البريدي
  // =========================================================================
  describe('4. نقطة النهاية الخلفية /api/contact (Next.js Route Handler)', () => {
    it('تستقبل طلب الإرسال وتتعامل معه بأمان تام مع إرجاع 200 وحالة التسليم', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: 'true' })
      });

      const mockReq = {
        json: async () => ({
          targetEmail: 'owner@aiprodzone.com',
          type: 'contact_ticket',
          subject: 'رسالة اختبار من Vitest',
          senderName: 'مختبر آلي',
          senderEmail: 'testbot@example.com',
          details: { message: 'مرحبا من الاختبار' }
        })
      };

      const res = await contactApiHandler(mockReq);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.ok).toBe(true);
      expect(json.destEmail).toBe('owner@aiprodzone.com');
    });
  });
});
