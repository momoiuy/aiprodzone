// @ts-nocheck
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import BackupRestoreSection from '../src/components/BackupRestoreSection.jsx';
import { LibraryProvider } from '../src/context/LibraryContext.jsx';

describe('BackupRestoreSection Component (واجهة النسخ الاحتياطي في لوحة التحكم)', () => {
  it('يعرض القسم الأنيق بالعنوان الصحيح والشارات المطلوبة', () => {
    const html = renderToStaticMarkup(
      <LibraryProvider>
        <BackupRestoreSection />
      </LibraryProvider>
    );

    // التحقق من وجود العنوان الرئيسي كما هو مطلوب في التكليف
    expect(html).toContain('النسخ الاحتياطي ونقل التقدم (حفظ محلي 100%)');

    // التحقق من وجود زر تصدير بياناتي
    expect(html).toContain('تصدير بياناتي (JSON Backup)');

    // التحقق من وجود زر استيراد نسخة احتياطية
    expect(html).toContain('استيراد نسخة احتياطية');

    // التحقق من وجود شارات الأمان والتخزين المحلي
    expect(html).toContain('التخزين المحلي محصّن');
    expect(html).toContain('خصوصية تامة 0% سحابة');
  });

  it('يحتوي على مدخل اختيار ملفات JSON مخفي وآمن', () => {
    const html = renderToStaticMarkup(
      <LibraryProvider>
        <BackupRestoreSection />
      </LibraryProvider>
    );

    expect(html).toContain('type="file"');
    expect(html).toContain('.json');
  });
});
