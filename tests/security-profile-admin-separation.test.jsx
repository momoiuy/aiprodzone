// @ts-nocheck
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'fs';
import path from 'path';

import Header from '../src/components/Header.jsx';
import Footer from '../src/components/Footer.jsx';
import Sidebar from '../src/components/Sidebar.jsx';
import StandaloneHeader from '../src/components/StandaloneHeader.tsx';
import StudentProfileHub from '../src/components/StudentProfileHub.jsx';
import { LibraryProvider } from '../src/context/LibraryContext.jsx';
import {
  DEFAULT_ADMIN_PIN,
  ADMIN_STORAGE_KEYS,
  computeSha256,
  verifyAdminPin,
  setCustomAdminPin,
  resetAdminPinToDefault,
  hasCustomAdminPin,
  loginAdminSession,
  logoutAdminSession,
  isAdminAuthenticated
} from '../src/lib/adminAuth.js';

describe('AIProdZone Security & UI Architecture Separation Tests (الفصل الأمني الجذري)', () => {
  // محاكاة التخزين المحلي والجلسات للاختبارات
  let mockStorage = {};
  let mockSession = {};

  beforeEach(() => {
    mockStorage = {};
    mockSession = {};

    globalThis.localStorage = {
      getItem: (k) => mockStorage[k] || null,
      setItem: (k, v) => { mockStorage[k] = String(v); },
      removeItem: (k) => { delete mockStorage[k]; },
      clear: () => { mockStorage = {}; }
    };

    globalThis.sessionStorage = {
      getItem: (k) => mockSession[k] || null,
      setItem: (k, v) => { mockSession[k] = String(v); },
      removeItem: (k) => { delete mockSession[k]; },
      clear: () => { mockSession = {}; }
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. اختبارات إزالة مسار /admin من الواجهات العامة واستبداله بـ "حسابي ومحفظتي"
  // =========================================================================
  describe('1. فحص الهيدر، الفوتر، والشريط الجانبي (منع تسريب /admin للزوار)', () => {
    it('يتحقق من أن الهيدر يحتوي على زر "حسابي ومحفظتي" ولا يحتوي إطلاقاً على رابط /admin أو لوحة التحكم', () => {
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

      // التأكد من وجود هوية حسابي ومحفظتي
      expect(html).toContain('حسابي ومحفظتي');
      expect(html).toContain('/profile');

      // الحظر الصارم لأي ذكر لـ /admin أو لوحة التحكم في الهيدر
      expect(html).not.toContain('href="/admin"');
      expect(html).not.toContain('لوحة التحكم');
      expect(html).not.toContain('Vercel');
      expect(html).not.toContain('Seed');
    });

    it('يتحقق من أن الفوتر يحتوي على رابط "حسابي ومحفظتي التعليمية" وخالٍ تماماً من /admin ولوحة التحكم', () => {
      const html = renderToStaticMarkup(
        <LibraryProvider>
          <Footer />
        </LibraryProvider>
      );

      expect(html).toContain('حسابي ومحفظتي التعليمية');
      expect(html).toContain('/profile');

      expect(html).not.toContain('href="/admin"');
      expect(html).not.toContain('لوحة التحكم وإدارة الفهرس');
      expect(html).not.toContain('Vercel');
      expect(html).not.toContain('Seed');
    });

    it('يتحقق من أن الشريط الجانبي Sidebar يوجه المتعلم إلى /profile وخالٍ تماماً من /admin', () => {
      const html = renderToStaticMarkup(
        <LibraryProvider>
          <Sidebar
            isOpen={true}
            onClose={() => {}}
            view="courses"
            setView={() => {}}
            selectedCategory="الكل"
            onSelectFilter={() => {}}
            onOpenBrandModal={() => {}}
            onOpenLegal={() => {}}
            onOpenSubmitModal={() => {}}
            onOpenEbooks={() => {}}
          />
        </LibraryProvider>
      );

      expect(html).toContain('حسابي ومحفظتي التعليمية');
      expect(html).not.toContain('href="/admin"');
      expect(html).not.toContain('لوحة التحكم والإدارة (/admin)');
    });

    it('يتحقق من أن StandaloneHeader المعتمد في المقالات والكتب والأدوات يحتوي على "حسابي ومحفظتي"', () => {
      const html = renderToStaticMarkup(
        <LibraryProvider>
          <StandaloneHeader current="tools" />
        </LibraryProvider>
      );

      expect(html).toContain('حسابي ومحفظتي');
      expect(html).toContain('/profile');
      expect(html).not.toContain('/admin');
    });
  });

  // =========================================================================
  // 2. واجهة "محفظتي وحسابي التعليمي" المستقلة للطلاب (Student Profile & Hub)
  // =========================================================================
  describe('2. واجهة محفظتي وحسابي التعليمي الخاصة بالطلاب (Student Profile & Learning Hub)', () => {
    it('تعرض إحصائيات تعلم الطالب الشخصية وقسم النسخ الاحتياطي ومسارات المتابعة بنقرة واحدة', () => {
      const html = renderToStaticMarkup(
        <LibraryProvider>
          <StudentProfileHub />
        </LibraryProvider>
      );

      // الشارة والعناوين
      expect(html).toContain('محفظتي وحسابي التعليمي الخاص');
      expect(html).toContain('لوحة متابعة تقدمك وإنجازاتك الأكاديمية');

      // إحصائيات التعلم الخمس
      expect(html).toContain('الدروس المكتملة');
      expect(html).toContain('المسارات الكاملة');
      expect(html).toContain('قائمة المشاهدة');
      expect(html).toContain('تقييماتك للمحتوى');
      expect(html).toContain('ملاحظات وتذاكر');

      // قسم النسخ الاحتياطي
      expect(html).toContain('النسخ الاحتياطي ونقل التقدم (تصدير / استيراد JSON Backup)');
      expect(html).toContain('تصدير بياناتي (JSON Backup)');
      expect(html).toContain('استيراد نسخة احتياطية');

      // قسم المسارات قيد الدراسة والمتابعة بنقرة واحدة
      expect(html).toContain('المسارات قيد الدراسة حالياً (إكمال بنقرة واحدة)');
    });

    it('تضمن الحظر الجذري التام 100% لأي أدوات إدارة موقع داخل محفظة الطالب', () => {
      const html = renderToStaticMarkup(
        <LibraryProvider>
          <StudentProfileHub />
        </LibraryProvider>
      );

      // ممنوع منعاً باتاً ظهور هذه الكلمات أو الأزرار للطالب أو الزائر
      expect(html).not.toContain('Vercel');
      expect(html).not.toContain('إفراغ كاش');
      expect(html).not.toContain('Seed');
      expect(html).not.toContain('إعادة التعيين للأصل');
      expect(html).not.toContain('/admin');
      expect(html).not.toContain('إدارة الدروس');
      expect(html).not.toContain('إدارة الأقسام');
      expect(html).not.toContain('إدارة القطاعات');
      expect(html).not.toContain('إدارة المقالات');
      expect(html).not.toContain('حذف المسار');
      expect(html).not.toContain('تعديل المسار');
    });

    it('يتحقق من وجود ملف صفحة app/profile/page.tsx وإعدادات robots الخاصة لمنع الفهرسة', () => {
      const profilePagePath = path.resolve(process.cwd(), 'app/profile/page.tsx');
      expect(fs.existsSync(profilePagePath)).toBe(true);

      const content = fs.readFileSync(profilePagePath, 'utf8');
      expect(content).toContain('حسابي ومحفظتي التعليمية');
      expect(content).toContain('robots');
      expect(content).toContain('index: false');
    });
  });

  // =========================================================================
  // 3. بوابة حماية صفحة الإدارة /admin برمز المرور والـ SHA-256
  // =========================================================================
  describe('3. تأمين صفحة الإدارة /admin ببوابة قفل مشفرة (Admin Master PIN Gate)', () => {
    it('يطابق الرمز الافتراضي AIPROD-2026-OWNER ويدعم الحساب المشفر لـ SHA-256', async () => {
      expect(DEFAULT_ADMIN_PIN).toBe('AIPROD-2026-OWNER');

      const hash = await computeSha256('AIPROD-2026-OWNER');
      expect(hash).toBe('a6be4118479c1bfb471a17cbf8ad50e55a87d6db05ea451ce11fc4d9e62c8dd6');
    });

    it('يقبل الرمز الافتراضي الصحيح ويرفض الرموز الخاطئة في verifyAdminPin', async () => {
      const valid = await verifyAdminPin('AIPROD-2026-OWNER');
      expect(valid).toBe(true);

      const invalid = await verifyAdminPin('WRONG-PASSWORD-123');
      expect(invalid).toBe(false);

      const empty = await verifyAdminPin('');
      expect(empty).toBe(false);
    });

    it('يدعم تغيير رمز المرور وحفظه بالهاش SHA-256 محلياً وتحديث التحقق', async () => {
      const newPin = 'SUPER-SECRET-2027';
      const newHash = await setCustomAdminPin(newPin);
      expect(newHash.length).toBe(64);
      expect(hasCustomAdminPin()).toBe(true);

      // الآن الرمز الجديد مقبول
      const validNew = await verifyAdminPin(newPin);
      expect(validNew).toBe(true);

      // الرمز القديم أصبح مرفوضاً بعد التغيير
      const validOld = await verifyAdminPin('AIPROD-2026-OWNER');
      expect(validOld).toBe(false);

      // استعادة الرمز الافتراضي
      resetAdminPinToDefault();
      expect(hasCustomAdminPin()).toBe(false);
      expect(await verifyAdminPin('AIPROD-2026-OWNER')).toBe(true);
    });

    it('يدعم جلسات تسجيل الدخول والخروج للمشرف عبر sessionStorage', () => {
      expect(isAdminAuthenticated()).toBe(false);

      loginAdminSession();
      expect(isAdminAuthenticated()).toBe(true);

      logoutAdminSession();
      expect(isAdminAuthenticated()).toBe(false);
    });

    it('يتحقق من وجود بوابة القفل AdminAuthGate وزر تسجيل خروج المدير وإصلاح تسمية تبويب القطاعات (8)', () => {
      const adminPagePath = path.resolve(process.cwd(), 'app/admin/page.tsx');
      const content = fs.readFileSync(adminPagePath, 'utf8');

      // وجود بوابة القفل
      expect(content).toContain('function AdminAuthGate');
      expect(content).toContain('بوابة حماية مالك الموقع');
      expect(content).toContain('رمز الدخول السري للمالك');

      // وجود زر تسجيل خروج المدير
      expect(content).toContain('تسجيل خروج المدير 🔒');
      expect(content).toContain('logoutAdminSession');

      // وجود نافذة تغيير الرمز بـ SHA-256
      expect(content).toContain('تغيير رمز الدخول السري للمالك');
      expect(content).toContain('setCustomAdminPin');

      // تصحيح التسمية الخاطئة للتبويب الداخلي من 10 إلى القطاعات الأكاديمية (8)
      expect(content).toContain('إدارة القطاعات الأكاديمية ({categories.length})');
      expect(content).not.toContain('إدارة الأقسام الـ 10 ({categories.length})');
    });
  });
});
