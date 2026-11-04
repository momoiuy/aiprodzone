import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import manifest, { dynamic as manifestDynamic } from '../app/manifest.ts';
import nextConfig from '../next.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Production Deployment, DevSecOps & PWA Manifest Tests (المرحلة النهائية للإنتاج)', () => {
  // =========================================================================
  // 1. فحص إعدادات الأمان والأداء في next.config.mjs
  // =========================================================================
  describe('1. فحص إعدادات الأمان والأداء في next.config.mjs', () => {
    it('يتحقق من تفعيل الوضع الصارم والضغط وإخفاء ترويسة Next.js', () => {
      expect(nextConfig.reactStrictMode).toBe(true);
      expect(nextConfig.poweredByHeader).toBe(false);
      expect(nextConfig.compress).toBe(true);
    });

    it('يتحقق من ضبط unoptimized: true لمنع استهلاك حصة معالجة الصور المجانية على Vercel', () => {
      expect(nextConfig.images).toBeDefined();
      expect(nextConfig.images.unoptimized).toBe(true);
    });

    it('يتحقق من وجود دالة headers وتطبيق ترويسات الأمان الصارمة على /(.*)', async () => {
      expect(typeof nextConfig.headers).toBe('function');
      const routeHeadersList = await nextConfig.headers();
      expect(Array.isArray(routeHeadersList)).toBe(true);

      const allRoutesConfig = routeHeadersList.find((item) => item.source === '/(.*)');
      expect(allRoutesConfig).toBeDefined();

      const headerMap = {};
      allRoutesConfig.headers.forEach((h) => {
        headerMap[h.key] = h.value;
      });

      // 1. X-Content-Type-Options
      expect(headerMap['X-Content-Type-Options']).toBe('nosniff');

      // 2. X-Frame-Options
      expect(headerMap['X-Frame-Options']).toBe('SAMEORIGIN');

      // 3. Referrer-Policy
      expect(headerMap['Referrer-Policy']).toBe('strict-origin-when-cross-origin');

      // 4. Permissions-Policy
      expect(headerMap['Permissions-Policy']).toBe(
        'camera=(), microphone=(), geolocation=(), interest-cohort=()'
      );

      // 5. Content-Security-Policy
      const csp = headerMap['Content-Security-Policy'];
      expect(csp).toBeDefined();

      // التحقق من السماح بنطاقات يوتيوب الرسمية لمشغل الفيديو الخالي من الكوكيز
      expect(csp).toContain('https://www.youtube-nocookie.com');
      expect(csp).toContain('https://www.youtube.com');
      expect(csp).toContain('https://i.ytimg.com');
      expect(csp).toContain('https://s.ytimg.com');

      // التحقق من السماح بخطوط جوجل
      expect(csp).toContain('https://fonts.googleapis.com');
      expect(csp).toContain('https://fonts.gstatic.com');

      // التحقق من حماية frame-ancestors لمنع Clickjacking
      expect(csp).toContain("frame-ancestors 'self'");
    });

    it('يتحقق من دالة redirects وتحويل روابط المتجر الرقمي القديمة (فبراير 2026) بتحويل دائم 301', async () => {
      expect(typeof nextConfig.redirects).toBe('function');
      const redirects = await nextConfig.redirects();
      expect(Array.isArray(redirects)).toBe(true);

      const legacyShop = redirects.find((r) => r.source === '/shop');
      expect(legacyShop).toBeDefined();
      expect(legacyShop.destination).toBe('/');
      expect(legacyShop.permanent).toBe(true);

      const legacyStore = redirects.find((r) => r.source === '/store');
      expect(legacyStore).toBeDefined();
      expect(legacyStore.destination).toBe('/');
      expect(legacyStore.permanent).toBe(true);

      const legacyProducts = redirects.find((r) => r.source === '/products');
      expect(legacyProducts).toBeDefined();
      expect(legacyProducts.destination).toBe('/');
      expect(legacyProducts.permanent).toBe(true);

      const legacyCart = redirects.find((r) => r.source === '/cart');
      expect(legacyCart).toBeDefined();
      expect(legacyCart.destination).toBe('/');
      expect(legacyCart.permanent).toBe(true);

      const legacyCheckout = redirects.find((r) => r.source === '/checkout');
      expect(legacyCheckout).toBeDefined();
      expect(legacyCheckout.destination).toBe('/');
      expect(legacyCheckout.permanent).toBe(true);

      const legacyOffers = redirects.find((r) => r.source === '/offers');
      expect(legacyOffers).toBeDefined();
      expect(legacyOffers.destination).toBe('/');
      expect(legacyOffers.permanent).toBe(true);

      const legacyBlog = redirects.find((r) => r.source === '/blog');
      expect(legacyBlog).toBeDefined();
      expect(['/articles', '/?view=articles']).toContain(legacyBlog.destination);
      expect(legacyBlog.permanent).toBe(true);

      const legacyPosts = redirects.find((r) => r.source === '/posts');
      expect(legacyPosts).toBeDefined();
      expect(['/articles', '/?view=articles']).toContain(legacyPosts.destination);
      expect(legacyPosts.permanent).toBe(true);

      const legacyEbooks = redirects.find((r) => r.source === '/ebooks');
      expect(legacyEbooks).toBeDefined();
      expect(legacyEbooks.destination).toBe('/?view=ebooks');
      expect(legacyEbooks.permanent).toBe(true);
    });
  });

  // =========================================================================
  // 2. فحص ملف vercel.json وضمان عدم استهلاك الحصص وتخزين CDN
  // =========================================================================
  describe('2. فحص ملف vercel.json وضمان عدم استهلاك الحصص والتخزين المؤقت', () => {
    const vercelConfigPath = path.join(rootDir, 'vercel.json');

    it('يتحقق من وجود ملف vercel.json وسلامة بنيته البرمجية', () => {
      expect(fs.existsSync(vercelConfigPath)).toBe(true);
      const raw = fs.readFileSync(vercelConfigPath, 'utf8');
      const config = JSON.parse(raw);

      expect(config.framework).toBe('nextjs');
      expect(config.buildCommand).toBe('npm run build');

      // التأكد من عدم وجود أي دوال مجدولة (Cron Jobs) تستهلك حصص باقة Hobby
      expect(config.crons).toBeUndefined();
    });

    it('يتحقق من ضبط ترويسات Cache-Control للملفات الثابتة في vercel.json', () => {
      const raw = fs.readFileSync(vercelConfigPath, 'utf8');
      const config = JSON.parse(raw);

      expect(Array.isArray(config.headers)).toBe(true);

      const llmsHeader = config.headers.find((h) => h.source === '/llms.txt');
      expect(llmsHeader).toBeDefined();
      expect(llmsHeader.headers[0].key).toBe('Cache-Control');
      expect(llmsHeader.headers[0].value).toContain('public');
      expect(llmsHeader.headers[0].value).toContain('s-maxage');

      const sitemapHeader = config.headers.find((h) => h.source === '/sitemap.xml');
      expect(sitemapHeader).toBeDefined();
      expect(sitemapHeader.headers[0].key).toBe('Cache-Control');
      expect(sitemapHeader.headers[0].value).toContain('public');
    });
  });

  // =========================================================================
  // 3. فحص ملف تطبيق الويب التقدمي القياسي (app/manifest.ts)
  // =========================================================================
  describe('3. فحص ملف تطبيق الويب التقدمي القياسي (app/manifest.ts)', () => {
    it('يتحقق من تحديد البناء الثابت (force-static) لملف المانيفست', () => {
      expect(manifestDynamic).toBe('force-static');
    });

    it('يتحقق من مطابقة معايير PWA المحددة بدقة كاملة', () => {
      const m = manifest();

      expect(m.name).toBe('AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية');
      expect(m.short_name).toBe('AIProdZone');
      expect(m.dir).toBe('rtl');
      expect(m.lang).toBe('ar');
      expect(m.display).toBe('standalone');
      expect(m.background_color).toBe('#090D16');
      expect(m.theme_color).toBe('#14B8A6');
      expect(m.start_url).toBe('/');

      // التحقق من وجود الأيقونات
      expect(Array.isArray(m.icons)).toBe(true);
      expect(m.icons.length).toBeGreaterThanOrEqual(1);
    });
  });

  // =========================================================================
  // 4. فحص آلية تطهير كاش المتصفح القديم وإلغاء Service Worker لنسخة فبراير 2026
  // =========================================================================
  describe('4. فحص آلية تطهير كاش المتصفح القديم وإلغاء Service Worker لنسخة فبراير 2026', () => {
    it('يتحقق من وجود سكربت التطهير التلقائي لمرة واحدة بالمفتاح aiprodzone_purge_legacy_2026_11', () => {
      const layoutPath = path.join(rootDir, 'app', 'layout.tsx');
      expect(fs.existsSync(layoutPath)).toBe(true);
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');

      expect(layoutContent).toContain('aiprodzone_purge_legacy_2026_11');
      expect(layoutContent).toContain('serviceWorker');
      expect(layoutContent).toContain('unregister');
      expect(layoutContent).toContain('caches');
      expect(layoutContent).toContain('delete');
    });
  });
});
