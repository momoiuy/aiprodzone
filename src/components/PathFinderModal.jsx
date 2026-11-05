'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  BookOpen,
  FileText,
  Clock,
  Layers,
  GraduationCap,
  PlayCircle,
  X,
  RotateCcw
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { HERO_ARTICLES_SUMMARY } from '../data/articles-summary';
import { TRACK_GUIDES } from '../data/ebooks';
import Button from './Button';
import Card from './Card';
import Chip from './Chip';

const LEVELS = [
  {
    id: 'beginner',
    title: 'مبتدئ من الصفر',
    desc: 'لا أمتلك أي خلفية برمجية سابقة وأريد نقطة انطلاق واضحة ومبسطة خطوة بخطوة.',
    icon: '🌱'
  },
  {
    id: 'intermediate',
    title: 'لدي أساسيات البرمجة',
    desc: 'أفهم المتغيرات والشروط والحلقات، وأريد الانتقال لبناء مشاريع حقيقية متكاملة.',
    icon: '⚡'
  },
  {
    id: 'advanced',
    title: 'متقدم أبحث عن التخصص',
    desc: 'لدي خبرة وأبحث عن المعماريات المعقدة، النظم السحابية، والشهادات المهنية المعتمدة.',
    icon: '🚀'
  }
];

const FIELDS = [
  {
    id: 'ai-data-science',
    title: 'الذكاء الاصطناعي وعلم البيانات',
    domainId: 'ai-data-science',
    categoryName: 'الذكاء الاصطناعي وعلم البيانات',
    desc: 'تعلم الآلة، هندسة الأوامر، النماذج التوليدية، وتحليل البيانات الضخمة.',
    icon: '🧠'
  },
  {
    id: 'web-programming',
    title: 'تطوير الويب والتطبيقات',
    domainId: 'web-programming',
    categoryName: 'الويب والبرمجة',
    desc: 'تطوير الواجهات الحديثة (React/Next.js) والأنظمة الخلفية والـ APIs المتكاملة.',
    icon: '💻'
  },
  {
    id: 'networking-cybersecurity',
    title: 'الأمن السيبراني والشبكات',
    domainId: 'networking-cybersecurity',
    categoryName: 'الشبكات والأمن السيبراني',
    desc: 'هندسة الشبكات الدولية (CCNA)، اختبار الاختراق، وحماية النظم من الهجمات.',
    icon: '🛡️'
  },
  {
    id: 'devops-cloud',
    title: 'هندسة السحابة وDevOps',
    domainId: 'devops-cloud',
    categoryName: 'DevOps والسحابة والهندسة',
    desc: 'الحوسبة السحابية (AWS/Azure)، الحاويات Docker، وخطوط النشر المؤتمتة CI/CD.',
    icon: '☁️'
  },
  {
    id: 'computer-science',
    title: 'علوم الحاسوب والخوارزميات',
    domainId: 'computer-science',
    categoryName: 'علوم الحاسوب',
    desc: 'الأسس الأكاديمية: الخوارزميات، هياكل البيانات، هندسة البرمجيات وأنظمة التشغيل.',
    icon: '⚙️'
  }
];

const COMMITMENTS = [
  {
    id: 'light',
    title: 'أقل من 5 ساعات أسبوعياً',
    desc: 'وتيرة مرنة وهادئة تناسب الموظفين والطلاب المشغولين.',
    icon: '☕'
  },
  {
    id: 'balanced',
    title: '5 إلى 12 ساعة أسبوعياً',
    desc: 'الوتيرة الأكاديمية المثالية لتحقيق تقدم ملحوظ في شهرين.',
    icon: '🎯'
  },
  {
    id: 'intensive',
    title: 'أكثر من 15 ساعة أسبوعياً',
    desc: 'معسكر تدريبي مكثف للانتقال السريع لسوق العمل والاحتراف.',
    icon: '🔥'
  }
];

/**
 * خوارزمية توصية ذكية فائقة الخفة بدون أي حمل حوسبي زائد (Zero-Overhead Path Recommendation)
 * @param {object} answers
 * @param {any[]} allCourses
 * @returns {{ courses: any[], book: any, article: any }}
 */
export function getRecommendedPath(answers, allCourses = []) {
  const { level = 'beginner', fieldId = 'web-programming', commitment = 'balanced' } = answers;
  const fieldObj = FIELDS.find((f) => f.id === fieldId) || FIELDS[0];

  // تصفية مسارات هذا المجال بدقة
  const domainCourses = allCourses.filter(
    (c) =>
      c.domainId === fieldObj.domainId ||
      c.category === fieldObj.categoryName ||
      c.domainTitle === fieldObj.categoryName
  );

  // فرز المسارات حسب المستوى المختار
  let sortedDomainCourses = [...domainCourses];
  if (level === 'beginner') {
    sortedDomainCourses.sort((a, b) => (a.rankOrder || a.orderIndex || 0) - (b.rankOrder || b.orderIndex || 0));
  } else if (level === 'intermediate') {
    // نفضل المسارات ذات الرتب المتوسطة أو المتقدمة
    sortedDomainCourses.sort((a, b) => {
      const isAdvancedA = (a.level || '').includes('متقدم') || (a.level || '').includes('شامل');
      const isAdvancedB = (b.level || '').includes('متقدم') || (b.level || '').includes('شامل');
      if (isAdvancedA && !isAdvancedB) return -1;
      if (!isAdvancedA && isAdvancedB) return 1;
      return (b.rankOrder || 0) - (a.rankOrder || 0);
    });
  } else {
    // متقدم: نختار المسارات المتخصصة والشهادات
    sortedDomainCourses.sort((a, b) => {
      const hasExamA = Boolean(a.examCode);
      const hasExamB = Boolean(b.examCode);
      if (hasExamA && !hasExamB) return -1;
      if (!hasExamA && hasExamB) return 1;
      return (b.rankOrder || 0) - (a.rankOrder || 0);
    });
  }

  // أفضل 3 مسارات تدريجية
  const topCourses = sortedDomainCourses.slice(0, 3);
  if (topCourses.length < 3) {
    // استكمال من المسارات العامة إن لزم
    const fallbackCourses = allCourses.filter((c) => !topCourses.some((tc) => tc.id === c.id));
    topCourses.push(...fallbackCourses.slice(0, 3 - topCourses.length));
  }

  // أفضل كتاب تأسيسي مرافق
  const matchingBook =
    TRACK_GUIDES.find(
      (b) =>
        b.category?.includes(fieldObj.categoryName) ||
        b.title?.includes(fieldObj.title) ||
        b.content?.includes(fieldObj.title)
    ) || TRACK_GUIDES[0];

  // أفضل مقال مرجعي مرافق
  const matchingArticle =
    HERO_ARTICLES_SUMMARY.find(
      (a) =>
        a.category === fieldObj.categoryName ||
        a.title?.includes(fieldObj.title) ||
        (a.tags && a.tags.some((t) => fieldObj.title.includes(t)))
    ) || HERO_ARTICLES_SUMMARY[0];

  return {
    field: fieldObj,
    courses: topCourses,
    book: matchingBook,
    article: matchingArticle
  };
}

/**
 * نافذة مستشار المسارات الأكاديمي الذكي في 3 خطوات
 * @param {{ isOpen: boolean, onClose: () => void, onWatchCourse?: (courseId: string) => void }} props
 */
export default function PathFinderModal({ isOpen, onClose, onWatchCourse = null }) {
  const { courses } = useLibrary();

  const [step, setStep] = useState(1);
  const [level, setLevel] = useState('beginner');
  const [fieldId, setFieldId] = useState('web-programming');
  const [commitment, setCommitment] = useState('balanced');

  const recommendation = useMemo(() => {
    if (step !== 4) return null;
    return getRecommendedPath({ level, fieldId, commitment }, courses || []);
  }, [step, level, fieldId, commitment, courses]);

  const handleReset = () => {
    setStep(1);
    setLevel('beginner');
    setFieldId('web-programming');
    setCommitment('balanced');
  };

  const handleStartCourse = (courseId) => {
    if (typeof onWatchCourse === 'function') {
      onWatchCourse(courseId);
      onClose();
    } else if (typeof window !== 'undefined') {
      window.location.href = `/tracks/${courseId}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pathfinder-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-smooth"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl bg-surface border border-teal-500/40 shadow-2xl p-4 sm:p-6 space-y-6"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* شريط الرأس مع مؤشر الخطوات الثلاث */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
            </div>
            <div>
              <h2 id="pathfinder-modal-title" className="text-base sm:text-lg font-black text-text-heading flex items-center gap-2">
                <span>مستشار المسارات: من أين أبدأ؟</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-400 text-[10px] font-black">
                  ذكاء أكاديمي 🧭
                </span>
              </h2>
              <p className="text-xs text-text-muted">
                3 أسئلة بسيطة لبناء خطتك الأكاديمية المخصصة في ثوانٍ معدودة.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-muted hover:text-text-heading hover:bg-surface-2 transition-all"
            aria-label="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* مؤشر تقدم الخطوات (1 -> 2 -> 3 -> النتيجة) */}
        <div className="flex items-center justify-between max-w-md mx-auto px-4">
          {[1, 2, 3].map((s) => {
            const isPassed = step > s;
            const isCurrent = step === s;
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPassed
                        ? 'bg-teal-500 text-teal-950 font-black'
                        : isCurrent
                        ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border-2 border-teal-500 font-black shadow-sm'
                        : 'bg-surface-2 text-text-muted border border-border'
                    }`}
                  >
                    {isPassed ? '✓' : s}
                  </div>
                  <span className="text-[10px] font-bold text-text-muted">
                    {s === 1 ? 'المستوى' : s === 2 ? 'المجال' : 'الوقت'}
                  </span>
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                      step > s ? 'bg-teal-500' : 'bg-surface-2'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ===================== الخطوة 1: المستوى التقني الحالي ===================== */}
        {step === 1 && (
          <div className="space-y-4 animate-smooth">
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-teal-700 dark:text-teal-400">الخطوة 1 من 3</span>
              <h3 className="text-base sm:text-lg font-black text-text-heading">
                ما هو مستواك التقني والبرمجي الحالي؟
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                اختر النقطة التي تصف حالتك بدقة لنحدد نقطة البداية المثالية لك.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto pt-2">
              {LEVELS.map((item) => {
                const isSelected = level === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLevel(item.id)}
                    className={`p-4 rounded-2xl text-right border transition-all flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500/40 shadow-sm'
                        : 'bg-surface-2/60 border-border hover:border-teal-500/40 hover:bg-surface-2'
                    }`}
                  >
                    <span className="text-2xl shrink-0 p-1">{item.icon}</span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-text-heading">
                          {item.title}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-teal-500 text-teal-950 text-xs font-black flex items-center justify-center">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-3">
              <Button
                variant="primary"
                onClick={() => setStep(2)}
                className="py-2.5 px-6 rounded-xl text-xs sm:text-sm font-black bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 shadow-sm"
              >
                <span>المتابعة للمجال</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ===================== الخطوة 2: المجال المنشود ===================== */}
        {step === 2 && (
          <div className="space-y-4 animate-smooth">
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-teal-700 dark:text-teal-400">الخطوة 2 من 3</span>
              <h3 className="text-base sm:text-lg font-black text-text-heading">
                ما هو المجال الذي تطمح لاحترافه والتخصص فيه؟
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                اختر المسار المهني الأقرب لطموحك واهتمامك المستقبلي.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-2">
              {FIELDS.map((item) => {
                const isSelected = fieldId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFieldId(item.id)}
                    className={`p-3.5 rounded-2xl text-right border transition-all flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500/40 shadow-sm'
                        : 'bg-surface-2/60 border-border hover:border-teal-500/40 hover:bg-surface-2'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-black text-text-heading truncate">
                          {item.title}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-teal-500 text-teal-950 text-[10px] font-black flex items-center justify-center shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted leading-snug line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                className="py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>السابق</span>
              </Button>

              <Button
                variant="primary"
                onClick={() => setStep(3)}
                className="py-2.5 px-6 rounded-xl text-xs sm:text-sm font-black bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 shadow-sm"
              >
                <span>المتابعة لساعات التعلم</span>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ===================== الخطوة 3: الساعات الأسبوعية ===================== */}
        {step === 3 && (
          <div className="space-y-4 animate-smooth">
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-teal-700 dark:text-teal-400">الخطوة 3 من 3</span>
              <h3 className="text-base sm:text-lg font-black text-text-heading">
                كم ساعة تستطيع تخصيصها للتعلم والتطبيق أسبوعياً؟
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                سنقوم بحساب وتيرة إنجاز المسار بما يتلاءم تماماً مع وقتك.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto pt-2">
              {COMMITMENTS.map((item) => {
                const isSelected = commitment === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCommitment(item.id)}
                    className={`p-4 rounded-2xl text-right border transition-all flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-500 ring-1 ring-teal-500/40 shadow-sm'
                        : 'bg-surface-2/60 border-border hover:border-teal-500/40 hover:bg-surface-2'
                    }`}
                  >
                    <span className="text-2xl shrink-0 p-1">{item.icon}</span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-text-heading">
                          {item.title}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-teal-500 text-teal-950 text-xs font-black flex items-center justify-center">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3">
              <Button
                variant="secondary"
                onClick={() => setStep(2)}
                className="py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>السابق</span>
              </Button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-2.5 px-6 rounded-xl text-xs sm:text-sm font-black bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all text-white flex items-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>عرض خارطة طريقي الموصى بها ✨</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== الخطوة 4: النتيجة والتوصيات المرتبة تدريجياً ===================== */}
        {step === 4 && recommendation && (
          <div className="space-y-6 animate-smooth">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-l from-teal-950/40 via-surface to-surface border border-teal-500/40 text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-400 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>خارطة طريقك الأكاديمية المقترحة لعام 2026</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-text-heading">
                المسار الموصى به لاحتراف: {recommendation.field.title}
              </h3>
              <p className="text-xs text-text-muted max-w-lg mx-auto">
                تم ترتيب المسارات الثلاثة التالية تدريجياً من التأسيس إلى الاحتراف وفقاً لمستواك وساعاتك المتاحة.
              </p>
            </div>

            {/* المسارات الثلاثة المرتبة تدريجياً */}
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-text-heading flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>أفضل 3 مسارات تعليمية متدرجة:</span>
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {recommendation.courses.map((course, idx) => (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl border border-border bg-surface-2 hover:border-teal-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-teal-500 text-teal-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                        #{idx + 1}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <Chip tone="accent">
                            {idx === 0 ? 'المسار التأسيسي' : idx === 1 ? 'المسار التطبيقي' : 'مسار التخصص المتقدم'}
                          </Chip>
                          <span className="text-text-muted font-bold">
                            المحاضر: {course.instructor}
                          </span>
                          {course.runtime && (
                            <span className="text-text-muted font-mono">• {course.runtime}</span>
                          )}
                        </div>

                        <h5 className="text-sm font-black text-text-heading group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                          {course.title}
                        </h5>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartCourse(course.id)}
                      className="px-4 py-2 rounded-xl text-xs font-black text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>بدء هذا المسار</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* الكتاب والمقال المرجعي المرافقان */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* أفضل كتاب تأسيسي مرافق */}
              {recommendation.book && (
                <div className="p-4 rounded-2xl border border-border bg-surface space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-teal-700 dark:text-teal-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>الكتاب التأسيسي المرافق</span>
                    </span>
                    <h5 className="text-xs font-black text-text-heading line-clamp-2">
                      {recommendation.book.title}
                    </h5>
                    <p className="text-[11px] text-text-muted line-clamp-2">
                      {recommendation.book.excerpt || recommendation.book.content}
                    </p>
                  </div>

                  <Link
                    href={`/books?read=${recommendation.book.id}`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-2 border border-border text-xs font-bold text-text-heading hover:border-teal-500 transition-colors"
                  >
                    <span>تصفح الدليل الأكاديمي 📖</span>
                  </Link>
                </div>
              )}

              {/* أفضل مقال مرجعي مرافق */}
              {recommendation.article && (
                <div className="p-4 rounded-2xl border border-border bg-surface space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-teal-700 dark:text-teal-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>المقال المرجعي المرافق</span>
                    </span>
                    <h5 className="text-xs font-black text-text-heading line-clamp-2">
                      {recommendation.article.title}
                    </h5>
                    <p className="text-[11px] text-text-muted line-clamp-2">
                      {recommendation.article.definitionLead || recommendation.article.summary}
                    </p>
                  </div>

                  <Link
                    href={`/articles/${recommendation.article.id}`}
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-2 border border-border text-xs font-bold text-text-heading hover:border-teal-500 transition-colors"
                  >
                    <span>قراءة المقال المرجعي 📄</span>
                  </Link>
                </div>
              )}
            </div>

            {/* زر إعادة الاستشارة والإغلاق */}
            <div className="flex items-center justify-between border-t border-border/80 pt-3">
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-xs py-2 px-3 flex items-center gap-1.5 text-text-muted hover:text-text-heading"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الاستشارة 🔄</span>
              </Button>

              <Button
                variant="secondary"
                onClick={onClose}
                className="text-xs py-2 px-5 font-bold"
              >
                <span>إغلاق النافذة</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
