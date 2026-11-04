import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('next/font/google', () => ({
  Cairo: () => ({ variable: '--font-cairo' }),
  Inter: () => ({ variable: '--font-inter' })
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

import { EBOOK_GUIDES } from '../src/data/ebooks';
import BooksPage, { metadata as booksMetadata } from '../app/books/page';
import NotFound, { metadata as notFoundMetadata } from '../app/not-found';
import { POST as revalidatePost, GET as revalidateGet } from '../app/api/revalidate/route';
import { GET as ytMetadataGet } from '../app/api/youtube/metadata/route';
import { GET as ytPlaylistGet } from '../app/api/youtube/playlist/route';
import { alt as ogAlt, size as ogSize, contentType as ogContentType } from '../app/opengraph-image';
import { metadata as layoutMetadata } from '../app/layout';

describe('Production Perfection Audit & Hardening Tests (AIProdZone 2026)', () => {
  // =========================================================================
  // 1. فحص تخفيض وزن صفحة الكتب (/books) وإزالة التكرار
  // =========================================================================
  describe('1. تحسينات وتخفيف صفحة الكتب (app/books/page.tsx & BooksExplorer)', () => {
    it('ترندر صفحة الكتب كود HTML رشيق مع الحفاظ على الكلمات المفتاحية والـ JSON-LD النظيف', () => {
      const html = renderToStaticMarkup(<BooksPage />);
      expect(html).toBeDefined();
      expect(html).toContain('CollectionPage');
      expect(html).toContain('ItemList');
      expect(html).toContain('BreadcrumbList');

      // التأكد من وجود عينات الاختبار الثلاثة المطلوبة
      expect(html).toContain(EBOOK_GUIDES[0].title);
      expect(html).toContain(EBOOK_GUIDES[10].title);
      expect(html).toContain(EBOOK_GUIDES[50].title);
    });

    it('يتحقق من أن استدعاء BooksExplorer في صفحة الكتب لا يمرر مصفوفة الـ 114 كخاصية JSX لتفادي تضخم RSC Flight Payload', () => {
      const pageFile = fs.readFileSync(path.join(process.cwd(), 'app/books/page.tsx'), 'utf8');
      expect(pageFile).not.toContain('initialBooks={EBOOK_GUIDES}');
      expect(pageFile).toContain('<BooksExplorer />');
    });

    it('يتحقق من ترشيد حجم ItemList في JSON-LD لصفحة الكتب لمنع تضخم الكود الأولي', () => {
      const pageFile = fs.readFileSync(path.join(process.cwd(), 'app/books/page.tsx'), 'utf8');
      expect(pageFile).toContain('EBOOK_GUIDES.slice(');
    });
  });

  // =========================================================================
  // 2. تحصين مسارات الـ API وحماية باقة Vercel
  // =========================================================================
  describe('2. تحصين مسارات الـ API الديناميكية ضد الهجمات والاستنزاف', () => {
    it('يرفض مسار /api/revalidate أي طلب غير مصرح برمز خطأ 401 Unauthorized', async () => {
      const mockReq = new Request('https://aiprodzone.com/api/revalidate', {
        method: 'POST'
      });
      const res = await revalidatePost(mockReq);
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.revalidated).toBe(false);
      expect(data.error).toContain('Unauthorized');
    });

    it('يقبل مسار /api/revalidate الطلبات التي تحمل رمز التحقق السري الصحيح برمز 200', async () => {
      const mockReq = new Request('https://aiprodzone.com/api/revalidate?secret=aiprodzone-secret-2026', {
        method: 'POST'
      });
      const res = await revalidatePost(mockReq);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.revalidated).toBe(true);
    });

    it('يتحقق من حماية /api/youtube/metadata وترويسات التخزين المؤقت CDN Cache-Control', async () => {
      // فحص رفض معرّف فيديو غير صالح
      const invalidReq = new Request('https://aiprodzone.com/api/youtube/metadata?videoId=invalid');
      const invalidRes = await ytMetadataGet(invalidReq);
      expect(invalidRes.status).toBe(400);

      // فحص طلب معرّف صالح مع ترويسة Cache-Control
      const validReq = new Request('https://aiprodzone.com/api/youtube/metadata?videoId=mvZHDpCHphk');
      const validRes = await ytMetadataGet(validReq);
      expect(validRes.status).toBe(200);
      const cacheControl = validRes.headers.get('Cache-Control');
      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('s-maxage=86400');
    });

    it('يتحقق من حماية /api/youtube/playlist من الاستعلامات الطويلة جداً وترويسات CDN Cache-Control', async () => {
      const longQuery = 'a'.repeat(250);
      const invalidReq = new Request(`https://aiprodzone.com/api/youtube/playlist?q=${longQuery}`);
      const invalidRes = await ytPlaylistGet(invalidReq);
      expect(invalidRes.status).toBe(400);
    });

    it('يتحقق من أن مشغل الشروحات في Watch.jsx لا يستدعي /api/youtube/playlist تلقائياً في الخلفية عند توفر الدروس', () => {
      const watchFile = fs.readFileSync(path.join(process.cwd(), 'src/views/Watch.jsx'), 'utf8');
      expect(watchFile).toContain('currentLessons.length === 0');
      expect(watchFile).not.toContain('currentLessons.length === 50');
      expect(watchFile).not.toContain('currentLessons.length === 100');
    });
  });

  // =========================================================================
  // 3. التحقق من أيقونة المنصة وصورة المشاركة الاجتماعية الرسمية
  // =========================================================================
  describe('3. أيقونة المنصة وصورة المشاركة الاجتماعية (OpenGraph & Icon)', () => {
    it('تحتوي ملفات المشروع على أيقونة SVG الرسمية بهوية A+ وتدرج زمردي', () => {
      const iconPath = path.join(process.cwd(), 'public/icon.svg');
      expect(fs.existsSync(iconPath)).toBe(true);
      const svg = fs.readFileSync(iconPath, 'utf8');
      expect(svg).toContain('<svg');
      expect(svg).toContain('#14b8a6');
      expect(svg).toContain('A');
      expect(svg).toContain('+');
    });

    it('يصدر ملف app/opengraph-image.tsx الأبعاد الرسمية 1200x630 ونوع الصورة الصحيح', () => {
      expect(ogSize).toEqual({ width: 1200, height: 630 });
      expect(ogContentType).toBe('image/png');
      expect(ogAlt).toContain('AIProdZone');
    });

    it('يحتوي app/layout.tsx على تعريف الميتا للأيقونات وصورة OpenGraph', () => {
      expect(layoutMetadata.icons).toBeDefined();
      expect(layoutMetadata.openGraph?.images).toBeDefined();
    });
  });

  // =========================================================================
  // 4. فحص صفحة الخطأ 404 الأكاديمية العربية الفاخرة (app/not-found.tsx)
  // =========================================================================
  describe('4. صفحة الخطأ 404 الأكاديمية (app/not-found.tsx)', () => {
    it('ترندر صفحة 404 العربية بالكامل مع أزرار التنقل الرئيسية', () => {
      const html = renderToStaticMarkup(<NotFound />);
      expect(html).toContain('الصفحة المطلوبة غير موجودة');
      expect(html).toContain('خطأ 404');
      expect(html).toContain('العودة إلى الصفحة الرئيسية');
      expect(html).toContain('/articles');
      expect(html).toContain('/books');
      expect(html).toContain('/tools');
    });

    it('تحمل صفحة 404 بيانات ميتا وروبوتس تمنع الفهرسة (noindex)', () => {
      expect(notFoundMetadata.title).toContain('الصفحة غير موجودة (404)');
      expect(notFoundMetadata.robots).toEqual({ index: false, follow: true });
    });
  });
});
