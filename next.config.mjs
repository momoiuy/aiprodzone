/** @type {import('next').NextConfig} */

// إعدادات Content Security Policy (CSP) الصارمة المعززة للأمان والخصوصية 100%
// مع السماح الكامل لمشغل يوتيوب الخالي من ملفات تعريف الارتباط وأصول جوجل
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com https://s.ytimg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://i.ytimg.com https://s.ytimg.com https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
  "connect-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://fonts.googleapis.com https://fonts.gstatic.com",
  "media-src 'self' https://*.googlevideo.com blob: data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'"
];

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  {
    key: 'Content-Security-Policy',
    value: cspDirectives.join('; ')
  }
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      // 1. تحويل روابط المتجر الرقمي القديمة (نسخة فبراير 2026) إلى الصفحة الرئيسية دائمياً (301)
      { source: '/shop', destination: '/', permanent: true },
      { source: '/shop/:path*', destination: '/', permanent: true },
      { source: '/store', destination: '/', permanent: true },
      { source: '/store/:path*', destination: '/', permanent: true },
      { source: '/products', destination: '/', permanent: true },
      { source: '/products/:path*', destination: '/', permanent: true },
      { source: '/cart', destination: '/', permanent: true },
      { source: '/cart/:path*', destination: '/', permanent: true },
      { source: '/checkout', destination: '/', permanent: true },
      { source: '/checkout/:path*', destination: '/', permanent: true },
      { source: '/offers', destination: '/', permanent: true },
      { source: '/offers/:path*', destination: '/', permanent: true },

      // 2. تحويل روابط المدونة والمقالات القديمة إلى قسم المقالات المعتمد (301)
      { source: '/blog', destination: '/?view=articles', permanent: true },
      { source: '/blog/:path*', destination: '/?view=articles', permanent: true },
      { source: '/posts', destination: '/?view=articles', permanent: true },
      { source: '/posts/:path*', destination: '/?view=articles', permanent: true },
      { source: '/articles', destination: '/?view=articles', permanent: true },

      // 3. تحويل روابط الكتب القديمة إلى قسم الكتب المعتمد (301)
      { source: '/ebooks', destination: '/?view=ebooks', permanent: true },
      { source: '/ebooks/:path*', destination: '/?view=ebooks', permanent: true },
      { source: '/books', destination: '/?view=ebooks', permanent: true },
      { source: '/books/:path*', destination: '/?view=ebooks', permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      },
      {
        source: '/llms.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
          }
        ]
      },
      {
        source: '/llms-full.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
          }
        ]
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
          }
        ]
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
