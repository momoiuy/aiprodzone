'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Star,
  Play,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Award,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { formatViews, getOverallScore } from '../lib/format';
import { handleThumbnailError, handleThumbnailLoad } from '../lib/youtube';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Chip from './Chip';

// Props: { course: object, onWatchCourse: (courseId: string, instructorId?: string) => void }
export default function CourseCard({ course, onWatchCourse }) {
  const { watchlistIds, completedIds, toggleWatchlist, studentProfile } = useLibrary();

  const isPreferredSector = Boolean(
    studentProfile &&
    (course.domainId === studentProfile.preferredSectorId ||
     course.category === studentProfile.preferredSectorTitle ||
     course.domainTitle === studentProfile.preferredSectorTitle)
  );

  // المحاضرون المعتمدون
  const instructors = course.instructors && course.instructors.length > 0
    ? course.instructors
    : [
        {
          id: 'inst-default',
          name: course.instructor || 'محاضر معتمد',
          role: 'أساسي',
          language: 'AR',
          verified: course.verified ?? true,
          lessonsCount: course.lessonsCount || 24,
          durationText: course.runtime || '20 ساعة',
          lessons: []
        }
      ];

  const primaryInstructor = instructors.find((i) => i.role === 'أساسي') || instructors[0];
  const [activeInstructorId, setActiveInstructorId] = useState(primaryInstructor.id);

  const selectedInstructor =
    instructors.find((i) => i.id === activeInstructorId) || primaryInstructor;

  const isSaved = watchlistIds.includes(course.id);
  const isDone = completedIds.includes(course.id);
  const overallScore = getOverallScore(course.scores);
  const formattedViews = formatViews(course.viewsCount);

  // صورة المعاينة (تفضيل أول فيديو للمحاضر المحدد بدقة hqdefault المضمونة 100% لتجنب صور 404 الرمادية)
  const firstVideoId = selectedInstructor.lessons?.[0]?.videoId || selectedInstructor.firstVideoId;
  const currentThumbnail = firstVideoId
    ? `https://i.ytimg.com/vi/${firstVideoId}/hqdefault.jpg`
    : (course.thumbnail || `https://i.ytimg.com/vi/${course.youtubeId || 'wHIdCNIQHpo'}/hqdefault.jpg`);

  const handleCardClick = () => {
    if (typeof onWatchCourse === 'function') {
      onWatchCourse(course.id, selectedInstructor.id);
    }
  };

  const handleInstructorPillClick = (e, instId) => {
    e.stopPropagation();
    // إذا كان هو المحاضر النشط حالياً، افتح فوراً صفحة المشاهدة
    if (instId === activeInstructorId) {
      if (typeof onWatchCourse === 'function') {
        onWatchCourse(course.id, instId);
      }
    } else {
      // إذا كان محاضراً آخر، قم بتحديده وتحديث الصورة والبيانات
      setActiveInstructorId(instId);
    }
  };

  return (
    <Card
      as="article"
      interactive
      onClick={handleCardClick}
      className="group overflow-hidden flex flex-col h-full justify-between hover:-translate-y-1 transition-all duration-300 border-border hover:border-accent/60 bg-surface shadow-sm hover:shadow-md"
    >
      {/* 1. الصورة المصغرة والشارات المتقدمة (Thumbnail Overlay) */}
      <div className="relative aspect-video overflow-hidden bg-surface-2 select-none shrink-0">
        <img
          src={currentThumbnail}
          alt={course.title}
          loading="lazy"
          decoding="async"
          onLoad={handleThumbnailLoad}
          onError={handleThumbnailError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-90" />

        {/* تموضع الشارات العلوي المحكم (flex items-start justify-between gap-2) لمنع أي تداخل */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-start justify-between gap-2 z-10 pointer-events-none">
          {/* الوسم الأيمن محدد بـ max-w-[62%] truncate */}
          <div className="flex flex-wrap items-center gap-1.5 max-w-[62%] min-w-0">
            <span className="px-2 py-0.5 rounded-lg bg-surface/90 backdrop-blur-md text-[10px] font-extrabold text-text-heading border border-border truncate shadow-sm">
              #{course.orderIndex || course.rankOrder} {course.badge || course.qualityBadge}
            </span>

            {isPreferredSector && (
              <span className="px-2 py-0.5 rounded-lg bg-teal-500 text-teal-950 font-black text-[10px] tracking-tight shrink-0 shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>⭐ مقترح لتخصصك</span>
              </span>
            )}

            {course.examCode && (
              <span className="px-1.5 py-0.5 rounded-md bg-accent text-accent-ink text-[10px] font-mono font-black tracking-tight shrink-0 shadow-sm flex items-center gap-1">
                <Award className="w-2.5 h-2.5" />
                <span>{course.examCode}</span>
              </span>
            )}
          </div>

          {/* الجانب الأيسر: زر الحفظ في المفضلة + شارة التقييم */}
          <div className="flex items-center gap-1.5 shrink-0 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => toggleWatchlist(e, course.id)}
              title={isSaved ? 'إزالة من المحفوظات' : 'حفظ في قائمتي'}
              aria-label={isSaved ? 'إزالة من المحفوظات' : 'حفظ في قائمتي'}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg backdrop-blur-md border transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                isSaved
                  ? 'bg-accent text-accent-ink border-accent shadow-sm'
                  : 'bg-surface/85 text-text-muted border-border hover:border-accent hover:text-text-heading'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            <span className="px-2 py-0.5 rounded-lg bg-surface/90 backdrop-blur-md text-text-heading font-extrabold text-xs inline-flex items-center gap-1 border border-border shadow-sm">
              <Star className="w-3 h-3 fill-current text-accent" />
              <span className="font-mono">{overallScore}</span>
            </span>
          </div>
        </div>

        {/* التسميات السفلية فوق الصورة */}
        <span className="absolute bottom-2 right-2.5 text-white/95 font-bold text-[10px] drop-shadow" dir="rtl">
          {course.level || 'مسار تأسيسي وشامل'}
        </span>

        <span className="absolute bottom-2 left-2.5 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] border border-white/10">
          {selectedInstructor.durationText || course.runtime}
        </span>

        {/* أيقونة التشغيل عند التحويم */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-12 h-12 rounded-full bg-accent text-accent-ink flex items-center justify-center shadow-2xl scale-95 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* 2. بيانات وتفاصيل البطاقة (Card Body) */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* الجزء العلوي: القطاع، العنوان، الإحصائيات والملاحظة */}
        <div className="space-y-2">
          {/* القطاع وعدد المشاهدات */}
          <div className="flex items-center justify-between text-[11px]">
            <Chip tone="accent">{course.domainTitle || course.category}</Chip>
            <span className="font-bold text-text-muted font-mono text-xs">
              {course.viewsCount > 0 ? `${formattedViews} مشاهدة` : formattedViews}
            </span>
          </div>

          {/* اسم المادة مع dir="rtl" و [unicode-bidi:plaintext] و line-clamp-2 */}
          <h2
            dir="rtl"
            className="font-extrabold text-sm sm:text-[15px] leading-snug text-text-heading line-clamp-2 group-hover:text-accent transition-colors [unicode-bidi:plaintext] text-right"
          >
            {course.title}
          </h2>

          {/* شارة عدد الدروس والساعات للمحاضر المختار (مثل: "152 درساً ✔ • 26 ساعة") */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-xs text-text font-bold" dir="rtl">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="font-extrabold">
              {selectedInstructor.lessonsCount || selectedInstructor.lessons?.length || 0} درساً ✔
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-text-muted font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-text-muted" />
              <span>{selectedInstructor.durationText || course.runtime}</span>
            </span>
          </div>

          {/* الملاحظة المنهجية إن وجدت */}
          {course.methodologyNote && (
            <p
              dir="rtl"
              className="text-xs text-text-muted line-clamp-2 leading-relaxed bg-surface-2/60 p-2 rounded-xl border border-border/50 flex items-start gap-1.5 text-right [unicode-bidi:plaintext]"
            >
              <Lightbulb className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
              <span className="[unicode-bidi:plaintext]">{course.methodologyNote}</span>
            </p>
          )}
        </div>

        {/* الجزء السفلي مدفوع بـ mt-auto لتوحيد الارتفاع عبر كافة البطاقات المجاورة */}
        <div className="mt-auto pt-3 space-y-3">
          {/* قسم المحاضرون المعتمدون (Instructor Pills Layout) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-text-muted block text-right" dir="rtl">
              المحاضرون المعتمدون:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-end items-center max-w-full">
              {instructors.map((inst) => {
                const isSelected = inst.id === selectedInstructor.id;
                const isPrimary = inst.role === 'أساسي';
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={(e) => handleInstructorPillClick(e, inst.id)}
                    title={
                      isSelected
                        ? `مشاهدة شروحات ${inst.name} الآن مباشرة`
                        : `تحديد شروحات ${inst.name} (${inst.lessonsCount || inst.lessons?.length || 0} درساً)`
                    }
                    className={`max-w-full px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-text-heading ring-1 ring-accent shadow-sm'
                        : 'bg-surface-2 border-border text-text-muted hover:border-accent hover:text-text-heading'
                    }`}
                  >
                    {isSelected ? (
                      <Play className="w-2.5 h-2.5 fill-current text-accent shrink-0" />
                    ) : isPrimary ? (
                      <Star className="w-3 h-3 fill-current text-accent shrink-0" />
                    ) : null}
                    <span dir="rtl" className="truncate max-w-full [unicode-bidi:plaintext]">
                      {inst.name}
                    </span>
                    {inst.language && inst.language !== 'AR' && (
                      <span className="text-[9px] font-mono px-1 rounded bg-surface border border-border text-text-muted shrink-0">
                        {inst.language}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. ذيل البطاقة والأدوات وزر مشاهدة دروس المحاضر النشط (CTA Button Overflow Fix) */}
          <div className="pt-2.5 border-t border-border space-y-2">
            {(course.toolsSummary || course.primaryTool || course.domainTitle) && (
              <div className="flex items-center justify-between text-[11px] text-text-muted">
                <span className="font-mono font-semibold truncate max-w-full text-right" dir="rtl">
                  {course.toolsSummary || course.primaryTool || course.domainTitle}
                </span>
              </div>
            )}

            <Link
              href={`/tracks/${course.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (typeof onWatchCourse === 'function') {
                  e.preventDefault();
                  onWatchCourse(course.id, selectedInstructor.id);
                }
              }}
              title={`عرض دروس ${selectedInstructor.name} (${selectedInstructor.lessonsCount || selectedInstructor.lessons?.length || 0} درساً)`}
              className="w-full max-w-full overflow-hidden px-3 py-2.5 flex items-center justify-between gap-2 rounded-xl bg-accent/10 border border-accent/30 text-teal-700 dark:text-teal-400 hover:bg-accent hover:text-accent-ink group-hover:bg-accent group-hover:text-accent-ink transition-all cursor-pointer shadow-xs text-xs"
            >
              <span
                dir="rtl"
                className="truncate text-xs sm:text-sm font-semibold min-w-0 flex-1 text-right [unicode-bidi:plaintext]"
              >
                {isDone
                  ? 'مكتمل ✓'
                  : `عرض دروس ${selectedInstructor.name} (${selectedInstructor.lessonsCount || selectedInstructor.lessons?.length || 0} درساً)`}
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
