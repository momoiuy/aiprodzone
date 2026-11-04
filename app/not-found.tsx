import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  GraduationCap,
  Newspaper,
  BookOpen,
  Wrench,
  Home,
  ArrowLeft,
  Sparkles,
  Layers
} from 'lucide-react';
import { LibraryProvider } from '../src/context/LibraryContext';
import StandaloneHeader from '../src/components/StandaloneHeader';
import Footer from '../src/components/Footer';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة (404) | AIProdZone — الدليل الأكاديمي العربي',
  description:
    'عذراً، الرابط المطلوب غير موجود أو تم نقله إلى الدليل الأكاديمي الجديد لمنصة AIProdZone.',
  robots: {
    index: false,
    follow: true
  }
};

export default function NotFound() {
  const quickNavCards = [
    {
      title: 'فهرس الشروحات والدورات',
      desc: '73 مساراً تعليمياً وتطبيقياً يغطي مختلف لغات البرمجة والذكاء الاصطناعي.',
      href: '/',
      icon: Layers,
      badge: '73 مساراً'
    },
    {
      title: 'المسارات الأكاديمية المتكاملة',
      desc: 'خرائط طريق تعليمية مجمعة للانتقال من الصفر إلى الاحتراف المتقدم.',
      href: '/?display=grouped',
      icon: GraduationCap,
      badge: 'خرائط طريق'
    },
    {
      title: 'مجلة المقالات التقنية',
      desc: '18 مقالاً هندسياً معمقاً ومقارنات معمارية في علوم الحاسوب والأمن السيبراني.',
      href: '/articles',
      icon: Newspaper,
      badge: '18 مقالاً'
    },
    {
      title: 'مكتبة الكتب والأدلة الرقمية',
      desc: '114 كتاباً ودليلاً تطبيقياً سحابياً مجانياً 100% بروابط مباشرة ونظيفة.',
      href: '/books',
      icon: BookOpen,
      badge: '114 دليلاً'
    },
    {
      title: 'مقارنة الأدوات البرمجية والذكية',
      desc: 'دليل منهجي ومقارنة لأقوى أدوات الذكاء الاصطناعي ومحررات الأكواد الحديثة.',
      href: '/tools',
      icon: Wrench,
      badge: 'دليل 2026'
    }
  ];

  return (
    <LibraryProvider>
      <div
        dir="ltr"
        className="min-h-screen bg-bg text-text font-arabic antialiased flex flex-col selection:bg-accent selection:text-accent-ink"
      >
        <StandaloneHeader />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10" dir="rtl">
          {/* ترويسة الخطأ الأكاديمية الفاخرة */}
          <section className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 text-accent-ink dark:text-accent text-xs font-bold">
              <Compass className="w-4 h-4 text-accent animate-spin-slow" />
              <span>خطأ 404 • الرابط غير متوفر أو تم نقله</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-text-heading tracking-tight leading-tight">
              الصفحة المطلوبة غير موجودة
            </h1>

            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              عذراً، يبدو أن الرابط الذي طلبته قديم أو تم نقله ضمن الترقية المعمارية الشاملة لمنصة{' '}
              <strong className="text-text font-bold">AIProdZone</strong> إلى الدليل الأكاديمي الجديد لعام 2026.
              جميع الموارد التعليمية متوفرة ومجانية 100% في الأقسام الحية أدناه:
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-accent-ink font-black text-sm hover:opacity-90 transition-opacity shadow-md shadow-accent/10"
              >
                <Home className="w-4 h-4" />
                <span>العودة إلى الصفحة الرئيسية</span>
              </Link>
            </div>
          </section>

          {/* شبكة الأقسام الحية للتوجيه المباشر */}
          <section aria-label="أقسام المنصة الحية" className="space-y-4">
            <h2 className="text-sm font-black text-text-muted uppercase tracking-wider text-right border-r-2 border-accent pr-2.5">
              استكشف أقسام المنصة الرسمية المتاحة:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {quickNavCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={idx}
                    href={card.href}
                    className="group rounded-2xl bg-surface border border-border p-4 sm:p-5 flex flex-col justify-between hover:border-accent hover:shadow-lg transition-all duration-300 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-2 text-text-muted text-[11px] font-bold group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                        {card.badge}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-right">
                      <h3 className="text-sm sm:text-base font-bold text-text-heading group-hover:text-accent transition-colors leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                        {card.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-end text-xs font-bold text-accent pt-1">
                      <span className="flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                        <span>انتقل الآن</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </LibraryProvider>
  );
}
