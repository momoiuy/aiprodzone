import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';
import { ArticleCollectionJsonLd } from '../src/components/ArticleJsonLd';
import { INITIAL_ARTICLES } from '../src/data/articles';

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiprodzone.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'AIProdZone — دورات وكتب إلكترونية مجانية',
  description:
    'منصة عربية مجانية متخصصة في ترتيب وتنقيح أعمق شروحات يوتيوب والكتب الإلكترونية في مجالات البرمجة، الذكاء الاصطناعي، صناعة الفيديو، والربح من الإنترنت.',
  openGraph: {
    title: 'AIProdZone — دورات وكتب إلكترونية مجانية',
    description:
      'منصة عربية مجانية متخصصة في ترتيب وتنقيح أعمق شروحات يوتيوب والكتب الإلكترونية في مجالات البرمجة، الذكاء الاصطناعي، صناعة الفيديو، والربح من الإنترنت.',
    url: siteUrl,
    siteName: 'AIProdZone',
    locale: 'ar_AR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIProdZone — دورات وكتب إلكترونية مجانية',
    description:
      'منصة عربية مجانية متخصصة في ترتيب وتنقيح أعمق شروحات يوتيوب والكتب الإلكترونية في مجالات البرمجة، الذكاء الاصطناعي، صناعة الفيديو، والربح من الإنترنت.'
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
        <ArticleCollectionJsonLd articles={INITIAL_ARTICLES} />
      </head>
      <body suppressHydrationWarning className="font-arabic antialiased bg-bg text-text overflow-x-hidden w-full max-w-full">{children}</body>
    </html>
  );
}
