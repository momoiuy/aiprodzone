'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  GraduationCap,
  Bookmark,
  CheckCircle2,
  PlayCircle,
  Star,
  FileText,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Chip from './Chip';
import Button from './Button';
import BackupRestoreSection from './BackupRestoreSection';

/**
 * @param {{ onWatchCourse?: (courseId: string, instructorId?: string) => void }} props
 */
export default function StudentProfileHub({ onWatchCourse = null }) {
  const {
    courses = [],
    watchlistIds = [],
    completedIds = [],
    completedLessons = {},
    userRatings = {},
    customComments = {}
  } = useLibrary() || {};

  // إحصائيات تعلم الطالب الشخصية
  const completedLessonsCount = useMemo(() => {
    return Object.keys(completedLessons).filter((k) => completedLessons[k]).length;
  }, [completedLessons]);

  const customCommentsCount = useMemo(() => {
    return Object.values(customComments).reduce(
      (acc, list) => acc + (Array.isArray(list) ? list.length : 0),
      0
    );
  }, [customComments]);

  const userRatingsCount = useMemo(() => {
    return Object.keys(userRatings).length;
  }, [userRatings]);

  // استخراج المسارات التي يدرسها الطالب حالياً (In-Progress Tracks)
  const inProgressCourses = useMemo(() => {
    return courses
      .map((course) => {
        // حساب الدروس المكتملة في هذا المسار بالتحديد
        const prefix = `${course.id}_`;
        const completedInThisCourse = Object.keys(completedLessons).filter(
          (k) => k.startsWith(prefix) && completedLessons[k]
        ).length;

        const isMarkedCompleted = completedIds.includes(course.id);
        const isInWatchlist = watchlistIds.includes(course.id);

        // إجمالي الدروس للمحاضر الأساسي أو عبر كافة المحاضرين
        const primaryInst = course.instructors?.find((i) => i.role === 'أساسي') || course.instructors?.[0];
        const totalLessons = primaryInst?.lessons?.length || 10;

        const percent = isMarkedCompleted
          ? 100
          : totalLessons > 0
          ? Math.min(99, Math.round((completedInThisCourse / totalLessons) * 100))
          : 0;

        return {
          ...course,
          completedCount: completedInThisCourse,
          totalLessons,
          percent,
          isMarkedCompleted,
          isInWatchlist
        };
      })
      .filter((c) => {
        // قيد الدراسة: بدأ به الطالب ولم يكتمل بعد 100%، أو ضمن قائمة المحفوظات
        return (!c.isMarkedCompleted && c.completedCount > 0) || (c.isInWatchlist && !c.isMarkedCompleted);
      });
  }, [courses, completedLessons, completedIds, watchlistIds]);

  // المسارات المقترحة للمتعلم في حال لم يبدأ أي مسار بعد
  const recommendedStarterCourses = useMemo(() => {
    return courses.slice(0, 3);
  }, [courses]);

  const handleContinueCourse = (courseId) => {
    if (onWatchCourse) {
      onWatchCourse(courseId);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/tracks/${courseId}`;
    }
  };

  return (
    <div dir="ltr" className="w-full space-y-8 animate-smooth text-right">
      {/* بطاقة الترحيب وهوية المتعلم الشخصية */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6" dir="rtl">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-accent-ink dark:text-accent text-xs font-bold">
            <UserCheck className="w-4 h-4 text-accent" />
            <span>محفظتي وحسابي التعليمي الخاص</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-heading tracking-tight">
            لوحة متابعة تقدمك وإنجازاتك الأكاديمية
          </h1>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            مساحتك الخاصة لمتابعة دروسك المكتملة، استئناف المسارات التي تدرسها بنقرة واحدة، وإدارة النسخ الاحتياطي لمحفظتك المحلية بأمان تام وبدون أي خوادم تتبع.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-text-muted">
            <span className="flex items-center gap-1.5 text-accent">
              <ShieldCheck className="w-4 h-4" />
              <span>خصوصية 100% محفوظة بمتصفحك</span>
            </span>
            <span>•</span>
            <span>المنصة خالية من الإعلانات</span>
            <span>•</span>
            <span>نسخ احتياطي فوري JSON</span>
          </div>
        </div>

        {/* مؤشر الإنجاز الكلي */}
        <div className="p-4 rounded-2xl bg-surface-2 border border-border/80 flex flex-col items-center justify-center text-center min-w-[200px] shrink-0">
          <span className="text-xs font-bold text-text-muted mb-1">نسبة الإنجاز الأكاديمي</span>
          <div className="relative w-20 h-20 flex items-center justify-center my-1">
            <span className="text-2xl font-black text-teal-700 dark:text-teal-400">
              {courses.length > 0 ? Math.round((completedIds.length / courses.length) * 100) : 0}%
            </span>
          </div>
          <span className="text-[11px] font-extrabold text-accent">
            {completedIds.length} من أصل {courses.length} مساراً مكتملاً
          </span>
        </div>
      </div>

      {/* ================== شبكة إحصائيات التعلم الشخصية ================== */}
      <section className="space-y-3" dir="rtl">
        <h2 className="text-sm sm:text-base font-black text-text-heading flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>إحصائيات تعلمك الشخصية الحالية</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Card className="p-4 space-y-1">
            <span className="text-xs text-text-muted font-bold block">الدروس المكتملة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-text-heading">{completedLessonsCount}</span>
              <span className="text-xs text-text-muted font-bold">درساً</span>
            </div>
            <p className="text-[10px] text-text-muted">شوهدت وأُنجزت بنجاح</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-xs text-text-muted font-bold block">المسارات الكاملة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-teal-700 dark:text-teal-400">{completedIds.length}</span>
              <span className="text-xs text-text-muted font-bold">مساراً</span>
            </div>
            <p className="text-[10px] text-text-muted">إنجاز كامل 100%</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-xs text-text-muted font-bold block">قائمة المشاهدة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-text-heading">{watchlistIds.length}</span>
              <span className="text-xs text-text-muted font-bold">محفوظ</span>
            </div>
            <p className="text-[10px] text-text-muted">شروحات ومسارات محفوظة</p>
          </Card>

          <Card className="p-4 space-y-1">
            <span className="text-xs text-text-muted font-bold block">تقييماتك للمحتوى</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-text-heading">{userRatingsCount}</span>
              <span className="text-xs text-text-muted font-bold">تقييماً</span>
            </div>
            <p className="text-[10px] text-text-muted">ملاحظات جودة مسجلة</p>
          </Card>

          <Card className="p-4 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-xs text-text-muted font-bold block">ملاحظات وتذاكر</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-text-heading">{customCommentsCount}</span>
              <span className="text-xs text-text-muted font-bold">عنصراً</span>
            </div>
            <p className="text-[10px] text-text-muted">ملاحظات وتذاكر مضافة</p>
          </Card>
        </div>
      </section>

      {/* ================== المسارات التي يدرسها حالياً ليكملها بنقرة واحدة ================== */}
      <section className="space-y-4" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-black text-text-heading flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              <span>المسارات قيد الدراسة حالياً (إكمال بنقرة واحدة)</span>
            </h2>
            <p className="text-xs text-text-muted">
              استأنف تعلمك مباشرة من حيث توقفت في أي مسار أكاديمي دون إضاعة الوقت.
            </p>
          </div>

          <Link
            href="/"
            className="text-xs font-bold text-accent hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>استعراض كافة المسارات (73)</span>
            <span>←</span>
          </Link>
        </div>

        {inProgressCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressCourses.map((course) => (
              <Card
                key={course.id}
                className="p-4 rounded-2xl border border-border hover:border-accent transition-all duration-200 flex flex-col justify-between space-y-4 group bg-surface"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Chip tone="accent" className="text-[10px]">
                      {course.category || course.domainTitle}
                    </Chip>
                    <span className="text-[11px] font-bold text-text-muted">
                      {course.level || 'شامل'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-text-heading group-hover:text-accent transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 font-bold">
                      المحاضر: {course.instructor}
                    </p>
                  </div>

                  {/* شريط التقدم الفعلي في المسار */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="text-text-muted text-[11px]">
                        {course.completedCount} من {course.totalLessons} درساً مكتملاً
                      </span>
                      <span className="text-teal-700 dark:text-teal-400 font-black">
                        {course.percent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden border border-border/60">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, course.percent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* زر إكمال المسار بنقرة واحدة */}
                <Button
                  variant="primary"
                  onClick={() => handleContinueCourse(course.id)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 bg-accent text-accent-ink hover:opacity-90 active:scale-95 transition-all shadow-sm"
                  title="استكمال هذا المسار بنقرة واحدة"
                >
                  <PlayCircle className="w-4 h-4 stroke-[2.2] text-accent-ink" />
                  <span>متابعة المسار الآن بنقرة واحدة</span>
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          /* حالة خلو المسارات النشطة: دعوة للبدء بأحد المسارات المقترحة */
          <div className="p-6 sm:p-8 rounded-2xl border border-dashed border-border bg-surface-2/60 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
              <Compass className="w-6 h-6 text-accent" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-sm sm:text-base font-black text-text-heading">
                لم تبدأ في أي مسار بعد
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                ابدأ رحلتك الآن باختيار أحد المسارات الأكاديمية المقترحة، وسيتم حفظ تقدمك تلقائياً لحظة بلحظة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2 text-right">
              {recommendedStarterCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-border bg-surface hover:border-accent transition-all flex flex-col justify-between space-y-2.5"
                >
                  <div>
                    <span className="text-[10px] font-extrabold text-accent block mb-1">
                      {c.category}
                    </span>
                    <h4 className="text-xs font-black text-text-heading line-clamp-2">
                      {c.title}
                    </h4>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handleContinueCourse(c.id)}
                    className="w-full text-xs py-1.5 flex items-center justify-center gap-1.5"
                  >
                    <span>ابدأ المسار</span>
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================== قسم النسخ الاحتياطي ونقل التقدم ================== */}
      <section className="space-y-3" dir="rtl">
        <h2 className="text-base sm:text-lg font-black text-text-heading flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <span>النسخ الاحتياطي ونقل التقدم (تصدير / استيراد JSON Backup)</span>
        </h2>
        <BackupRestoreSection />
      </section>
    </div>
  );
}
