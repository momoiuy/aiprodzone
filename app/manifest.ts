import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/**
 * معيار تطبيق الويب التقدمي (PWA Web App Manifest) لمنصة AIProdZone
 * متوافق مع Next.js 14 App Router ويوفر قابلية التثبيت الفوري (Standalone)
 * مع دعم اتجاه الكتابة من اليمين إلى اليسار (RTL) واللغة العربية بالكامل
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية',
    short_name: 'AIProdZone',
    description:
      'منصة عربية مجانية متخصصة في ترتيب وتنقيح أعمق مسارات يوتيوب والكتب التقنية بهندسة أكاديمية صارمة وبدون إعلانات.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090D16',
    theme_color: '#14B8A6',
    dir: 'rtl',
    lang: 'ar',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon'
      },
      {
        src: '/brand-banner.png',
        sizes: '1200x630',
        type: 'image/png'
      }
    ]
  };
}
