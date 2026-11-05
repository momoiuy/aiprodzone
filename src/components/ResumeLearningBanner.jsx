'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PlayCircle, ArrowUpRight, X, Clock, Sparkles } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { getLastActiveLesson } from '../lib/storage';

/**
 * شريط "استأنف تعلمك" الذكي فائق الخفة
 * @param {{ onWatchCourse?: (courseId: string, instructorId?: string) => void, className?: string }} props
 */
export default function ResumeLearningBanner({ onWatchCourse, className = '' }) {
  const { courses, completedLessons, completedIds } = useLibrary();
  const [dismissed, setDismissed] = useState(false);
  const [lastActive, setLastActive] = useState(() => getLastActiveLesson());

  useEffect(() => {
    // قراءة آخر درس مسجل عند التحميل وتحديث الحالة إن تغير
    const stored = getLastActiveLesson();
    if (stored) {
      setLastActive(stored);
    }
  }, []);

  // استنتاج بيانات الدرس قيد الدراسة من التخزين أو من سجل الدروس المكتملة
  const resumeData = useMemo(() => {
    if (dismissed) return null;

    // 1. إذا وجد درس نشط مسجل مسبقاً في التخزين
    if (lastActive && lastActive.courseId) {
      const course = courses.find((c) => c.id === lastActive.courseId);
      if (course && !completedIds.includes(course.id)) {
        const prefix = `${course.id}_`;
        const completedInThisCourse = Object.keys(completedLessons).filter(
          (k) => k.startsWith(prefix) && completedLessons[k]
        ).length;
        const totalLessons = course.lessonsCount || 20;
        const percent = totalLessons > 0 ? Math.min(99, Math.round((completedInThisCourse / totalLessons) * 100)) : 0;

        return {
          courseId: course.id,
          courseTitle: lastActive.courseTitle || course.title,
          instructorId: lastActive.instructorId || null,
          instructorName: lastActive.instructorName || course.instructor,
          lessonIndex: lastActive.lessonIndex || 1,
          lessonTitle: lastActive.lessonTitle || 'الدرس الأول',
          lessonDuration: lastActive.lessonDuration || '',
          percent,
          completedCount: completedInThisCourse,
          totalLessons
        };
      }
    }

    // 2. إذا لم يكن هناك درس مسجل صراحة، نفحص أول مسار بدأ به الطالب ولم يكمله
    const inProgressCourse = courses.find((course) => {
      if (completedIds.includes(course.id)) return false;
      const prefix = `${course.id}_`;
      const count = Object.keys(completedLessons).filter(
        (k) => k.startsWith(prefix) && completedLessons[k]
      ).length;
      return count > 0;
    });

    if (inProgressCourse) {
      const prefix = `${inProgressCourse.id}_`;
      const completedCount = Object.keys(completedLessons).filter(
        (k) => k.startsWith(prefix) && completedLessons[k]
      ).length;
      const primaryInst = inProgressCourse.instructors?.find((i) => i.role === 'أساسي') || inProgressCourse.instructors?.[0];
      const totalLessons = inProgressCourse.lessonsCount || primaryInst?.lessons?.length || 20;
      const percent = Math.min(99, Math.round((completedCount / totalLessons) * 100));

      return {
        courseId: inProgressCourse.id,
        courseTitle: inProgressCourse.title,
        instructorId: primaryInst?.id || null,
        instructorName: inProgressCourse.instructor,
        lessonIndex: completedCount + 1,
        lessonTitle: `الدرس ${completedCount + 1}`,
        lessonDuration: '',
        percent,
        completedCount,
        totalLessons
      };
    }

    return null;
  }, [dismissed, lastActive, courses, completedLessons, completedIds]);

  if (!resumeData) return null;

  const handleContinue = () => {
    if (typeof onWatchCourse === 'function') {
      onWatchCourse(resumeData.courseId, resumeData.instructorId);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/tracks/${resumeData.courseId}`;
    }
  };

  return (
    <div
      dir="rtl"
      role="region"
      aria-label="استأنف تعلمك"
      className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-l from-teal-950/40 via-surface to-surface border border-teal-500/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-right animate-smooth ${className}`}
    >
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
          <PlayCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-black text-teal-700 dark:text-teal-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>▶️ استأنف من حيث توقفت</span>
            </span>
            <span className="text-text-muted">•</span>
            <span className="font-bold text-text-heading truncate max-w-[280px] sm:max-w-md">
              {resumeData.courseTitle}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted font-medium">
            <span>
              آخر درس: <strong className="text-text-heading">الدرس #{resumeData.lessonIndex}: {resumeData.lessonTitle}</strong>
            </span>
            {resumeData.instructorName && (
              <>
                <span>•</span>
                <span>المحاضر: {resumeData.instructorName}</span>
              </>
            )}
            <span>•</span>
            <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
              إنجاز {resumeData.percent}%
            </span>
          </div>

          {/* شريط التقدم المرئي المصغر */}
          <div className="w-full max-w-md h-1.5 rounded-full bg-surface-2 overflow-hidden border border-border/60 mt-1">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, resumeData.percent)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
        <button
          type="button"
          onClick={handleContinue}
          className="px-4 py-2 rounded-xl text-xs font-black text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
        >
          <span>استكمال الدرس فوراً</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-text-heading hover:bg-surface-2 transition-colors"
          title="إخفاء الشريط مؤقتاً"
          aria-label="إخفاء"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
