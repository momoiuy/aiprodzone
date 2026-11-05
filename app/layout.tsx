import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-cairo'
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter'
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiprodzone.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية والذكاء الاصطناعي وعلوم الحاسوب',
    template: '%s | AIProdZone — الدليل الأكاديمي العربي'
  },
  description:
    'منصة أكاديمية عربية مجانية 100% وبلا إعلانات تضم 73 مساراً تعليمياً متعدد المحاضرين، 114 كتاباً ودليلاً برمجياً، و18 مقالاً هندسياً معمقاً في البرمجة، الذكاء الاصطناعي، والأمن السيبراني.',
  verification: {
    google: 'a77f8eb75e2ad942'
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png' }
    ],
    shortcut: '/icon.svg',
    apple: '/icon'
  },
  openGraph: {
    title: 'AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية والذكاء الاصطناعي وعلوم الحاسوب',
    description:
      'منصة أكاديمية عربية مجانية 100% وبلا إعلانات تضم 73 مساراً تعليمياً متعدد المحاضرين، 114 كتاباً ودليلاً برمجياً، و18 مقالاً هندسياً معمقاً في البرمجة، الذكاء الاصطناعي، والأمن السيبراني.',
    url: siteUrl,
    siteName: 'AIProdZone',
    locale: 'ar_AR',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'AIProdZone — الدليل الأكاديمي العربي'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIProdZone — الدليل الأكاديمي العربي للمسارات التقنية والذكاء الاصطناعي وعلوم الحاسوب',
    description:
      'منصة أكاديمية عربية مجانية 100% وبلا إعلانات تضم 73 مساراً تعليمياً متعدد المحاضرين، 114 كتاباً ودليلاً برمجياً، و18 مقالاً هندسياً معمقاً في البرمجة، الذكاء الاصطناعي، والأمن السيبراني.',
    images: [`${siteUrl}/opengraph-image`]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
};

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="ar" dir="ltr" data-theme="dark" suppressHydrationWarning className={`${cairo.variable} ${inter.variable} overflow-x-hidden w-full max-w-full`}>
      <head>
        <script
          id="purge-legacy-2026"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='aiprodzone_purge_legacy_2026_11';if(typeof window!=='undefined'&&!localStorage.getItem(k)){if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(r){for(var i=0;i<r.length;i++){r[i].unregister();}}).catch(function(){});}if('caches' in window){caches.keys().then(function(names){for(var j=0;j<names.length;j++){caches.delete(names[j]);}}).catch(function(){});}localStorage.setItem(k,'true');}}catch(e){}})();`
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-arabic antialiased bg-bg text-text overflow-x-hidden w-full max-w-full">{children}</body>
    </html>
  );
}
