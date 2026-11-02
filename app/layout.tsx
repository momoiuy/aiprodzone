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

export const metadata: Metadata = {
  title: 'AIProdZone — دورات وكتب إلكترونية مجانية',
  description:
    'منصة عربية مجانية متخصصة في ترتيب وتنقيح أعمق شروحات يوتيوب والكتب الإلكترونية في مجالات البرمجة، الذكاء الاصطناعي، صناعة الفيديو، والربح من الإنترنت.'
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
    <html lang="ar" dir="ltr" data-theme="dark" suppressHydrationWarning className={`${cairo.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="font-arabic antialiased bg-bg text-text">{children}</body>
    </html>
  );
}
