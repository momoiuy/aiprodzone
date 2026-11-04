'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Share2, ArrowRight, CheckCircle2, Copy } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export interface ArticleInteractiveBarProps {
  articleId: string;
  articleSlug: string;
  articleTitle: string;
}

export default function ArticleInteractiveBar({
  articleId,
  articleSlug,
  articleTitle
}: ArticleInteractiveBarProps) {
  const library = useLibrary() as any;
  const bookmarkedArticleIds: string[] = library?.bookmarkedArticleIds || [];
  const toggleBookmarkArticle = library?.toggleBookmarkArticle;
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const isBookmarked = Array.isArray(bookmarkedArticleIds) && bookmarkedArticleIds.includes(articleId);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setReadingProgress(100);
        return;
      }
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `https://aiprodzone.com/articles/${articleId}`;
      navigator.clipboard?.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {});
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: articleTitle,
          text: `${articleTitle} — دليل مرجعي من منصة AIProdZone`,
          url: `https://aiprodzone.com/articles/${articleId}`
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <>
      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 transition-all duration-150 ease-out origin-right"
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-valuenow={readingProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Article Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-2xl bg-surface border border-border/80 shadow-sm" dir="rtl">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-text hover:text-accent hover:bg-surface-2 transition-all border border-border"
        >
          <ArrowRight className="w-4 h-4 text-accent" />
          <span>العودة إلى مجلة المقالات</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (typeof toggleBookmarkArticle === 'function') {
                toggleBookmarkArticle(articleId);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isBookmarked
                ? 'bg-accent/15 text-accent-ink dark:text-accent border-accent/40'
                : 'bg-surface-2 text-text border-border hover:border-accent/40'
            }`}
            title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ المقال للقراءة لاحقاً'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-accent' : ''}`} />
            <span>{isBookmarked ? 'محفوظ في مكتبتك' : 'حفظ في المفضلة'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-surface-2 text-text border border-border hover:border-accent/40"
            title="نسخ الرابط الدائم"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-black">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-text-muted" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-surface-2 text-text border border-border hover:border-accent/40"
            title="مشاركة المقال"
          >
            <Share2 className="w-3.5 h-3.5 text-text-muted" />
            <span>مشاركة</span>
          </button>
        </div>
      </div>
    </>
  );
}
