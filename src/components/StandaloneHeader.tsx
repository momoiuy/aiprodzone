'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Newspaper,
  BookOpen,
  Wrench,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import Logo from './Logo';

export interface StandaloneHeaderProps {
  current?: 'tracks' | 'articles' | 'ebooks' | 'tools';
}

export default function StandaloneHeader({ current }: StandaloneHeaderProps) {
  const { theme, toggleTheme } = useLibrary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      dir="ltr"
      className="sticky top-0 z-40 w-full border-b border-border/80 bg-surface/90 backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2" title="الرئيسية — AIProdZone">
          <Logo />
        </Link>

        {/* Desktop Navigation Links (RTL aligned labels) */}
        <nav className="hidden md:flex items-center gap-1.5" dir="rtl">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              current === 'tracks'
                ? 'bg-accent/15 text-accent-ink dark:text-accent font-black shadow-sm'
                : 'text-text hover:bg-surface-2 hover:text-text-heading'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-accent" />
            <span>المسارات الأكاديمية</span>
          </Link>

          <Link
            href="/articles"
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              current === 'articles'
                ? 'bg-accent/15 text-accent-ink dark:text-accent font-black shadow-sm'
                : 'text-text hover:bg-surface-2 hover:text-text-heading'
            }`}
          >
            <Newspaper className="w-4 h-4 text-accent" />
            <span>المقالات التقنية</span>
          </Link>

          <Link
            href="/books"
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              current === 'ebooks'
                ? 'bg-accent/15 text-accent-ink dark:text-accent font-black shadow-sm'
                : 'text-text hover:bg-surface-2 hover:text-text-heading'
            }`}
          >
            <BookOpen className="w-4 h-4 text-accent" />
            <span>الكتب والأدلة</span>
          </Link>

          <Link
            href="/tools"
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              current === 'tools'
                ? 'bg-accent/15 text-accent-ink dark:text-accent font-black shadow-sm'
                : 'text-text hover:bg-surface-2 hover:text-text-heading'
            }`}
          >
            <Wrench className="w-4 h-4 text-accent" />
            <span>مقارنة الأدوات</span>
          </Link>
        </nav>

        {/* Theme and Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="تبديل المظهر"
            className="p-2 rounded-xl border border-border bg-surface text-text hover:text-accent hover:border-accent transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="القائمة"
            className="md:hidden p-2 rounded-xl border border-border bg-surface text-text hover:text-accent transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-2" dir="rtl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-text hover:bg-surface-2"
          >
            <GraduationCap className="w-4 h-4 text-accent" />
            <span>المسارات الأكاديمية (73 مساراً)</span>
          </Link>
          <Link
            href="/articles"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-text hover:bg-surface-2"
          >
            <Newspaper className="w-4 h-4 text-accent" />
            <span>المقالات التقنية (18 مقالاً)</span>
          </Link>
          <Link
            href="/books"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-text hover:bg-surface-2"
          >
            <BookOpen className="w-4 h-4 text-accent" />
            <span>مكتبة الكتب والأدلة (114 دليلاً)</span>
          </Link>
          <Link
            href="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-text hover:bg-surface-2"
          >
            <Wrench className="w-4 h-4 text-accent" />
            <span>مقارنة الأدوات البرمجية</span>
          </Link>
        </div>
      )}
    </header>
  );
}
