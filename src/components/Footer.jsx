'use client';

import React from 'react';
import {
  Layers,
  GraduationCap,
  Newspaper,
  Wrench,
  BookOpen,
  Shield,
  ArrowUp,
  Sparkles,
  ExternalLink,
  Heart,
  Lock,
  Tv
} from 'lucide-react';
import Logo from './Logo';
import { ACADEMIC_DOMAINS } from '../data/categories';
import { LEGAL_PAGES_LIST } from '../data/legal-pages';
import { INITIAL_ARTICLES } from '../data/articles';
import { INITIAL_COURSES } from '../data/courses';
import { EBOOK_GUIDES } from '../data/ebooks';
import { useLibrary } from '../context/LibraryContext';

// Props: { onNavigate?: (view: string, options?: any) => void, onOpenLegal?: (tab: string) => void, onSelectCategory?: (cat: string) => void }
export default function Footer({ onNavigate = null, onOpenLegal = null, onSelectCategory = null } = {}) {
  let coursesCount = INITIAL_COURSES.length;
  let ebooksCount = EBOOK_GUIDES.length;
  let articlesCount = INITIAL_ARTICLES.length;
  let domainsCount = ACADEMIC_DOMAINS.length;

  try {
    const library = useLibrary();
    if (library) {
      if (Array.isArray(library.courses)) coursesCount = library.courses.length;
      if (Array.isArray(library.ebooksList)) ebooksCount = library.ebooksList.length;
      if (Array.isArray(library.articlesList)) articlesCount = library.articlesList.length;
      if (Array.isArray(library.categoriesList)) domainsCount = ACADEMIC_DOMAINS.length;
    }
  } catch (err) {
    // استخدام البيانات التأسيسية كبديل آمن عند الرندر خارج موفر السياق
  }

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickNav = (viewName, options = {}) => {
    if (onNavigate) {
      onNavigate(viewName, options);
    } else if (typeof window !== 'undefined') {
      if (viewName === 'courses') window.location.href = '/';
      else if (viewName === 'articles') window.location.href = '/articles';
      else window.location.href = `/?view=${viewName}`;
    }
  };

  const handleLegalClick = (tabId) => {
    if (onOpenLegal) {
      onOpenLegal(tabId);
    } else if (onNavigate) {
      onNavigate('legal', { legalPage: tabId });
    } else if (typeof window !== 'undefined') {
      window.location.href = `/?view=legal&tab=${tabId}`;
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    } else if (onNavigate) {
      onNavigate('courses', { cat: categoryName });
    } else if (typeof window !== 'undefined') {
      window.location.href = `/?cat=${encodeURIComponent(categoryName)}`;
    }
  };

  const quickLinks = [
    {
      id: 'courses',
      label: 'الشروحات والدورات الفردية',
      icon: Layers,
      onClick: () => handleQuickNav('courses', { keepSearch: false })
    },
    {
      id: 'roadmaps',
      label: 'المسارات الأكاديمية المتكاملة',
      icon: GraduationCap,
      onClick: () => handleQuickNav('courses', { displayMode: 'grouped' })
    },
    {
      id: 'articles',
      label: 'المجلة والمقالات التقنية',
      icon: Newspaper,
      onClick: () => handleQuickNav('articles')
    },
    {
      id: 'tools',
      label: 'مقارنة الأدوات البرمجية والذكية',
      icon: Wrench,
      onClick: () => handleQuickNav('tools')
    },
    {
      id: 'ebooks',
      label: 'مكتبة الكتب والأدلة الرقمية',
      icon: BookOpen,
      onClick: () => handleQuickNav('ebooks')
    },
    {
      id: 'admin',
      label: 'لوحة التحكم وإدارة الفهرس',
      icon: Shield,
      isExternalHref: '/admin'
    }
  ];

  return (
    <footer
      dir="ltr"
      className="w-full mt-auto border-t border-border bg-surface-2/95 text-text transition-colors duration-300"
    >
      {/* شبكة الأعمدة الأربعة الرئيسية */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 text-right">
          
          {/* العمود الأول: الهوية، النبذة والإحصائيات الحية (4 أعمدة في الشاشات الكبيرة) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-end">
              <Logo
                onClick={() => handleQuickNav('courses')}
                showSubtitle={true}
              />
            </div>

            <p className="text-xs sm:text-[13px] leading-relaxed text-text-muted">
              دليل أكاديمي عربي مفتوح ومجاني بالكامل، يُعنى بتنقية المحتوى التعليمي التقني من الشوائب وفهرسة أعمق الشروحات المرئية والكتب الرقمية وفق معايير الجودة الصارمة وبمعمارية الصفر إعلانات.
            </p>

            {/* شريط الإحصائيات الحية الفاخر */}
            <div className="p-3.5 rounded-2xl bg-surface border border-border/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-text-heading border-b border-border/60 pb-2">
                <span className="flex items-center gap-1.5 text-accent">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>إحصائيات المنصة الحية</span>
                </span>
                <span className="text-text-muted">نوفمبر 2026</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center" dir="rtl">
                <div className="p-2 rounded-xl bg-surface-2 border border-slate-200/80 dark:border-slate-800">
                  <span className="block text-sm font-black text-teal-700 dark:text-teal-400">{domainsCount} قطاعات</span>
                  <span className="text-[10px] font-bold text-text-muted">مجالات أكاديمية</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-2 border border-slate-200/80 dark:border-slate-800">
                  <span className="block text-sm font-black text-teal-700 dark:text-teal-400">{coursesCount} مساراً</span>
                  <span className="text-[10px] font-bold text-text-muted">شروحات متقدمة</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-2 border border-slate-200/80 dark:border-slate-800">
                  <span className="block text-sm font-black text-teal-700 dark:text-teal-400">{ebooksCount} كتاباً</span>
                  <span className="text-[10px] font-bold text-text-muted">أدلة ومراجع رقمية</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-2 border border-slate-200/80 dark:border-slate-800">
                  <span className="block text-sm font-black text-teal-700 dark:text-teal-400">{articlesCount} مقالاً</span>
                  <span className="text-[10px] font-bold text-text-muted">دراسات وتجارب</span>
                </div>
              </div>
            </div>
          </div>

          {/* العمود الثاني: أقسام المنصة السريعة (2 إلى 3 أعمدة) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black text-text-heading border-r-2 border-accent pr-2.5">
              أقسام المنصة السريعة
            </h3>
            <ul className="space-y-2 text-xs font-bold text-text-muted">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                if (link.isExternalHref) {
                  return (
                    <li key={link.id}>
                      <a
                        href={link.isExternalHref}
                        className="flex items-center justify-end gap-2 py-1 hover:text-accent transition-colors group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-accent shrink-0" />
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={link.onClick}
                      className="w-full flex items-center justify-end gap-2 py-1 hover:text-accent transition-colors group text-right"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                      <Icon className="w-3.5 h-3.5 text-text-muted group-hover:text-accent shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* العمود الثالث: القطاعات الأكاديمية الثمانية (3 أعمدة) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black text-text-heading border-r-2 border-accent pr-2.5">
              القطاعات الأكاديمية (8)
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 text-xs font-bold text-text-muted">
              {ACADEMIC_DOMAINS.map((domain) => (
                <li key={domain.id}>
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(domain.name)}
                    className="w-full flex items-center justify-end gap-2 py-1 text-right hover:text-accent transition-colors group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform truncate">{domain.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 group-hover:bg-accent shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الرابع: الشؤون القانونية والتواصل (3 أعمدة) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black text-text-heading border-r-2 border-accent pr-2.5">
              الشؤون القانونية والتواصل
            </h3>
            <ul className="space-y-2 text-xs font-bold text-text-muted">
              {LEGAL_PAGES_LIST.map((page) => (
                <li key={page.id}>
                  <button
                    type="button"
                    onClick={() => handleLegalClick(page.id)}
                    className="w-full flex items-center justify-end gap-2 py-1 text-right hover:text-accent transition-colors group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">{page.title}</span>
                    <span className="text-[10px] text-accent font-extrabold group-hover:text-text-heading">
                      ←
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-surface border border-border/70 text-[11px] leading-relaxed text-text-muted text-right space-y-1">
                <div className="flex items-center gap-1.5 justify-end font-extrabold text-accent">
                  <span>حماية الخصوصية 100%</span>
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <p>
                  لا نستخدم أي خوادم لتتبع المستخدمين؛ تقدمك محفوظ محلياً بالكامل.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* الشريط السفلي الفاخر: حقوق النشر وإشعار يوتيوب المعتمد الخالي من الكوكيز */}
      <div className="border-t border-border/80 bg-surface/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-right text-[11px] sm:text-xs text-text-muted">
          
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span className="font-extrabold text-text-heading">
              © {new Date().getFullYear()} AIProdZone
            </span>
            <span>—</span>
            <span>جميع الحقوق محفوظة لرواد التعلم الذاتي والتقني العربي.</span>
          </div>

          <div className="flex items-center gap-1.5 justify-center text-text-muted max-w-xl">
            <Tv className="w-3.5 h-3.5 text-accent shrink-0 hidden sm:inline" />
            <span className="leading-relaxed">
              يتم تضمين الشروحات المرئية عبر مشغل YouTube IFrame الرسمي المعزز للخصوصية (<span className="font-mono text-accent">youtube-nocookie.com</span>) لحفظ خصوصية المتعلم وكامل حقوق المشاهدات للقنوات الأصلية.
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-border hover:border-accent text-text-heading font-extrabold transition-all text-xs"
            aria-label="العودة لأعلى الصفحة"
          >
            <span>للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5 text-accent" />
          </button>
        </div>
      </div>
    </footer>
  );
}
