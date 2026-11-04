'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  CheckSquare,
  Bookmark,
  Sliders,
  Lightbulb,
  Clock,
  Play,
  Search,
  X,
  Star,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { formatViews, getOverallScore } from '../lib/format';
import { useLibrary } from '../context/LibraryContext';
import Player from '../components/Player';
import ReviewBlock from '../components/ReviewBlock';
import ScorePanel from '../components/ScorePanel';
import TechStack from '../components/TechStack';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';

const RATING_DIMS = [
  { key: 'depth', label: 'عمق الشرح والوضوح' },
  { key: 'practical', label: 'التطبيق العملي المباشر' },
  { key: 'freshness', label: 'حداثة الأدوات والواجهات' },
  { key: 'production', label: 'جودة الصوت والمونتاج' }
];
const DEFAULT_SCORES = { depth: 9.6, practical: 9.5, freshness: 9.5, production: 9.4 };

// Props: { course: object, initialInstructorId?: string, onBack: () => void, onWatchCourse: (courseId: string, instructorId?: string) => void }
export default function Watch({
  course,
  initialInstructorId = null,
  onBack,
  onWatchCourse
}) {
  const {
    courses,
    watchlistIds,
    completedIds,
    userRatings,
    toggleWatchlist,
    toggleCompleted,
    submitUserRating,
    toggleLessonCompleted,
    isLessonCompleted,
    getInstructorCompletedLessonsCount,
    updateCourse
  } = useLibrary();

  // كاش محلي للدروس المسترجعة من يوتيوب بالخلفية
  const [dynamicLessonsMap, setDynamicLessonsMap] = useState({});
  const [isFetchingPlaylist, setIsFetchingPlaylist] = useState(false);
  const fetchedPlaylistsRef = useRef(new Set());

  // إعداد المحاضرين وقائمة الدروس
  const instructors = useMemo(() => {
    if (course?.instructors && course.instructors.length > 0) {
      return course.instructors;
    }
    return [
      {
        id: 'inst-default',
        name: course?.instructor || 'محاضر معتمد',
        role: 'أساسي',
        language: 'AR',
        verified: course?.verified ?? true,
        lessonsCount: course?.lessonsCount || 24,
        durationText: course?.runtime || '20 ساعة',
        note: course?.methodologyNote || '',
        playlistId: course?.youtubeId || '',
        lessons: [
          { index: 1, videoId: course?.youtubeVideoId || course?.youtubeId || 'wHIdCNIQHpo', title: course?.title || 'الدرس الأول', duration: course?.runtime || '25:00' }
        ]
      }
    ];
  }, [course]);

  const primaryInstructor = instructors.find((i) => i.role === 'أساسي') || instructors[0];
  const [activeInstructorId, setActiveInstructorId] = useState(
    initialInstructorId && instructors.some((i) => i.id === initialInstructorId)
      ? initialInstructorId
      : primaryInstructor.id
  );

  const activeInstructor =
    instructors.find((i) => i.id === activeInstructorId) || primaryInstructor;

  const [activeLessonIndex, setActiveLessonIndex] = useState(1);
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  const [playerPlaying, setPlayerPlaying] = useState(false);
  const [playerStartSeconds, setPlayerStartSeconds] = useState(0);
  const [playerReloadKey, setPlayerReloadKey] = useState(0);

  // وضع التركيز والسينما وتثبيت المشغل على الهاتف
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isStickyMobile, setIsStickyMobile] = useState(true);
  const activeLessonItemRef = useRef(null);

  // الخروج من وضع السينما عند الضغط على زر Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // تمرير تلقائي وسلس لتمييز وتوسيط الدرس النشط داخل قائمة الدروس
  useEffect(() => {
    if (activeLessonItemRef.current) {
      activeLessonItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [activeLessonIndex, activeInstructorId]);

  const [userVoteOpen, setUserVoteOpen] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [userScores, setUserScores] = useState(DEFAULT_SCORES);

  // تحديث المحاضر إذا تغير initialInstructorId أو المسار
  useEffect(() => {
    if (initialInstructorId && instructors.some((i) => i.id === initialInstructorId)) {
      setActiveInstructorId(initialInstructorId);
    } else if (primaryInstructor) {
      setActiveInstructorId(primaryInstructor.id);
    }
    setActiveLessonIndex(1);
    setPlayerPlaying(false);
    setLessonSearchQuery('');
  }, [course?.id, initialInstructorId, instructors, primaryInstructor]);

  const courseId = course?.id;
  const activeUserRating = courseId ? userRatings[courseId] : null;
  const canEditActiveRating = !activeUserRating || activeUserRating.editCount < 1;

  useEffect(() => {
    if (!courseId) return;
    setUserScores(userRatings[courseId]?.scores || DEFAULT_SCORES);
  }, [courseId, userRatings]);

  // خطاف ذكي يتحقق تلقائياً عند فتح أي محاضر:
  // إذا كان لديه playlistId صالحة، وكان عدد الدروس أقل من المتوقع أو مقتطعاً، يجلب كامل القائمة في الخلفية
  useEffect(() => {
    if (!activeInstructor?.id || !activeInstructor?.playlistId) return;

    const playlistId = activeInstructor.playlistId.trim();
    if (!playlistId || playlistId.length < 10) return;

    const currentLessons = dynamicLessonsMap[activeInstructor.id] || activeInstructor.lessons || [];
    const expectedCount = activeInstructor.lessonsCount || 0;

    // شرط التحقق من الاقتطاع أو النقص
    const isTruncated =
      (expectedCount > 0 && currentLessons.length < expectedCount) ||
      currentLessons.length === 50 ||
      currentLessons.length === 100 ||
      (currentLessons.length < 50 && expectedCount > currentLessons.length);

    const fetchKey = `${course?.id || ''}_${activeInstructor.id}_${playlistId}`;
    if (!isTruncated || fetchedPlaylistsRef.current.has(fetchKey)) {
      return;
    }

    let isCancelled = false;
    fetchedPlaylistsRef.current.add(fetchKey);
    setIsFetchingPlaylist(true);

    const fetchRemainingLessons = async () => {
      try {
        const response = await fetch(`/api/youtube/playlist?list=${encodeURIComponent(playlistId)}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (isCancelled) return;

        if (data?.success && Array.isArray(data.videos) && data.videos.length > 0) {
          const fetchedVideos = data.videos.map((v, i) => {
            const existing = currentLessons[i] || currentLessons.find((l) => l.videoId === v.videoId);
            return {
              ...existing,
              index: i + 1,
              videoId: v.videoId,
              title: v.title || existing?.title || `الدرس ${i + 1}`,
              duration: v.duration || existing?.duration || '25:00',
              thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
            };
          });

          // اعتماد القائمة المحدثة إذا كانت كاملة ومرتبة
          if (fetchedVideos.length >= currentLessons.length) {
            setDynamicLessonsMap((prev) => ({
              ...prev,
              [activeInstructor.id]: fetchedVideos
            }));

            if (typeof updateCourse === 'function' && course?.id) {
              const updatedInstructors = (course.instructors || []).map((inst) => {
                if (inst.id === activeInstructor.id) {
                  return {
                    ...inst,
                    lessonsCount: Math.max(inst.lessonsCount || 0, fetchedVideos.length),
                    lessons: fetchedVideos
                  };
                }
                return inst;
              });
              updateCourse(course.id, { instructors: updatedInstructors });
            }
          }
        }
      } catch (err) {
        console.warn('تنبيه أثناء استكمال قائمة الفيديوهات بالخلفية:', err);
      } finally {
        if (!isCancelled) {
          setIsFetchingPlaylist(false);
        }
      }
    };

    fetchRemainingLessons();

    return () => {
      isCancelled = true;
    };
  }, [
    activeInstructor?.id,
    activeInstructor?.playlistId,
    activeInstructor?.lessonsCount,
    activeInstructor?.lessons,
    course?.id,
    course?.instructors,
    dynamicLessonsMap,
    updateCourse
  ]);

  // قائمة دروس المحاضر المختار (مع تفضيل القائمة المسترجعة ديناميكياً من يوتيوب)
  const instructorLessons = useMemo(() => {
    const dynamicLessons = dynamicLessonsMap[activeInstructor?.id];
    if (dynamicLessons && dynamicLessons.length > 0) {
      return dynamicLessons;
    }
    if (activeInstructor?.lessons && activeInstructor.lessons.length > 0) {
      return activeInstructor.lessons;
    }
    return [
      {
        index: 1,
        videoId: course?.youtubeVideoId || course?.youtubeId || 'wHIdCNIQHpo',
        title: `${course?.title || 'الدرس الأول'} - ${activeInstructor.name}`,
        duration: activeInstructor.durationText || '25:00'
      }
    ];
  }, [activeInstructor, course, dynamicLessonsMap]);

  // البحث والتصفية داخل قائمة الدروس
  const filteredLessons = useMemo(() => {
    const q = lessonSearchQuery.trim().toLowerCase();
    if (!q) return instructorLessons;
    return instructorLessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        String(l.index).includes(q) ||
        (l.duration && l.duration.toLowerCase().includes(q))
    );
  }, [instructorLessons, lessonSearchQuery]);

  // الدرس الحالي
  const currentLesson =
    instructorLessons.find((l) => l.index === activeLessonIndex) ||
    instructorLessons[0];

  const currentLessonIdx = instructorLessons.findIndex(
    (l) => l.index === currentLesson.index
  );
  const prevLesson = currentLessonIdx > 0 ? instructorLessons[currentLessonIdx - 1] : null;
  const nextLesson =
    currentLessonIdx < instructorLessons.length - 1
      ? instructorLessons[currentLessonIdx + 1]
      : null;

  // إحصائيات إكمال الدروس لهذا المحاضر
  const completedLessonsCount = getInstructorCompletedLessonsCount(
    course?.id,
    activeInstructor.id
  );
  const completionPercentage =
    instructorLessons.length > 0
      ? Math.round((completedLessonsCount / instructorLessons.length) * 100)
      : 0;

  const handleSelectLesson = (lessonIndex, startSec = 0) => {
    setActiveLessonIndex(lessonIndex);
    setPlayerStartSeconds(startSec);
    setPlayerPlaying(true);
    setPlayerReloadKey((prev) => prev + 1);
  };

  const handleLessonVideoEnd = () => {
    if (course?.id && activeInstructor?.id && currentLesson?.index) {
      if (!isLessonCompleted(course.id, activeInstructor.id, currentLesson.index)) {
        toggleLessonCompleted(course.id, activeInstructor.id, currentLesson.index);
      }
    }
  };

  const handleUserScoreSubmit = (e) => {
    e.preventDefault();
    if (!course || !canEditActiveRating) return;
    if (submitUserRating(course.id, userScores)) {
      setVoteSuccess(true);
      setTimeout(() => {
        setVoteSuccess(false);
        setUserVoteOpen(false);
      }, 1100);
    }
  };

  if (!course) {
    return (
      <div className="py-12 text-center space-y-3">
        <p className="text-base font-bold text-text-heading">لم يتم العثور على المسار المطلوب.</p>
        <Button variant="secondary" onClick={onBack}>
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  const isCurrentLessonDone = isLessonCompleted(
    course.id,
    activeInstructor.id,
    currentLesson.index
  );

  return (
    <div className="space-y-6 animate-smooth">
      {/* 1. الشريط العلوي: زر الرجوع ومعلومات المسار */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-border/60">
        <Button variant="secondary" onClick={onBack} className="text-xs sm:text-sm">
          <ArrowLeft className="w-4 h-4 text-text-muted" />
          <span>العودة إلى فهرس الشروحات</span>
        </Button>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Chip tone="accent">قطاع: {course.domainTitle || course.category}</Chip>
          {course.examCode && (
            <span className="px-2 py-0.5 rounded-lg bg-accent text-accent-ink font-mono font-black text-xs shadow-sm flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>{course.examCode}</span>
            </span>
          )}
          <Chip tone="neutral">#{course.orderIndex || course.rankOrder} {course.badge || course.qualityBadge}</Chip>
        </div>
      </div>

      {/* 2. أزرار تبديل أعلى المشغل للتنقل بين المحاضرين لنفس المادة */}
      <Card className="p-4 sm:p-5 bg-surface border-border shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-xs font-extrabold text-text-heading flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>المحاضرون المعتمدون لهذه المادة (تبديل فوري لقائمة الدروس بضغطة واحدة):</span>
            </span>
            <p className="text-xs text-text-muted">
              اختر المحاضر المفضل لديك لمشاهدة دورته وفهرس دروسه الكامل المحدث.
            </p>
          </div>

          <div className="text-xs text-text-muted font-bold font-mono">
            {completedLessonsCount} من {instructorLessons.length} درساً مكتمل ({completionPercentage}%)
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 overflow-x-auto flex-nowrap pb-1 no-scrollbar sm:flex-wrap">
          {instructors.map((inst) => {
            const isActive = inst.id === activeInstructor.id;
            const isPrimary = inst.role === 'أساسي';
            const instLessonsCount =
              dynamicLessonsMap[inst.id]?.length || inst.lessonsCount || inst.lessons?.length || 0;
            const instCompletedCount = getInstructorCompletedLessonsCount(course?.id, inst.id);
            const instProgressPct =
              instLessonsCount > 0 ? Math.round((instCompletedCount / instLessonsCount) * 100) : 0;

            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => {
                  setActiveInstructorId(inst.id);
                  setActiveLessonIndex(1);
                  setPlayerPlaying(false);
                  setLessonSearchQuery('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all flex items-center gap-2 border shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                  isActive
                    ? 'ring-2 ring-[#14B8A6] bg-[#14B8A6]/10 border-[#14B8A6] text-text-heading font-black shadow-sm'
                    : 'bg-surface-2 border-border text-text hover:border-[#14B8A6]/50 hover:text-text-heading'
                }`}
              >
                {isPrimary && (
                  <Star
                    className={`w-3.5 h-3.5 fill-current ${
                      isActive ? 'text-[#14B8A6]' : 'text-accent'
                    }`}
                  />
                )}
                <span>{inst.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isActive
                      ? 'bg-[#14B8A6]/20 text-[#14B8A6] font-bold'
                      : 'bg-surface text-text-muted border border-border'
                  }`}
                >
                  {instLessonsCount} درساً
                </span>
                {instProgressPct > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${
                      isActive
                        ? 'bg-[#14B8A6] text-[#06211E]'
                        : 'bg-[#14B8A6]/20 text-[#14B8A6]'
                    }`}
                    title={`نسبة التقدم المحفوظة: ${instProgressPct}%`}
                  >
                    {instProgressPct}%
                  </span>
                )}
                {inst.language && (
                  <span
                    className={`px-1 rounded text-[9px] font-mono ${
                      isActive
                        ? 'bg-[#14B8A6]/20 text-[#14B8A6]'
                        : 'bg-surface text-text-muted border border-border'
                    }`}
                  >
                    {inst.language}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. تخطيط العرض الرئيسي: المشغل في جانب، وقائمة الدروس في جانب (مع دعم وضع السينما والشاشة الموسعة) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* العمود الأكبر / المشغل والبيانات */}
        <div className={`${isFocusMode ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-5 transition-all duration-300`}>
          {/* إشعار وتنبيه وضع السينما الموسع عند التفعيل على الحاسوب */}
          {isFocusMode && (
            <div className="hidden lg:flex items-center justify-between p-3.5 rounded-2xl bg-accent/10 border border-accent/30 text-xs text-text-heading animate-smooth shadow-sm">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-accent shrink-0" />
                <span className="font-bold">
                  أنت الآن في وضع التركيز والسينما الأكاديمي (الشاشة الموسعة) — تم إخفاء القائمة الجانبية مؤقتاً لتجربة مشاهدة مريحة وهادئة بدون أي تشتيت.
                </span>
              </div>
              <Button
                variant="secondary"
                onClick={() => setIsFocusMode(false)}
                className="text-xs py-1 px-3 shrink-0"
              >
                <Minimize2 className="w-3.5 h-3.5 text-accent" />
                <span>العودة للعرض العادي (Esc)</span>
              </Button>
            </div>
          )}

          {/* مشغل الفيديو بنمط Lite Facade مع دعم التثبيت الذكي على الهاتف (Sticky Mobile Player) */}
          <div
            className={`transition-all duration-300 w-full ${
              isStickyMobile
                ? 'sticky top-0 z-30 shadow-md bg-surface/95 backdrop-blur-md -mx-3 px-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 py-2 sm:py-2.5 lg:py-0'
                : ''
            } lg:static`}
          >
            {/* شريط معلومات وتثبيت ذكي أعلى المشغل في شاشات الهاتف */}
            <div className="lg:hidden flex items-center justify-between pb-1.5 text-[11px] text-text-muted">
              <div className="flex items-center gap-1.5 font-bold text-text-heading min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse shrink-0" />
                <span className="truncate">#{currentLesson.index}: {currentLesson.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsStickyMobile((prev) => !prev)}
                className="px-2 py-0.5 rounded text-[10px] font-bold border border-border bg-surface-2 shrink-0 text-text-muted hover:text-text-heading transition-colors"
                title={isStickyMobile ? 'إلغاء تثبيت المشغل في الأعلى' : 'تثبيت المشغل في أعلى الشاشة أثناء التمرير'}
              >
                {isStickyMobile ? 'إلغاء التثبيت ✕' : 'تثبيت بالأعلى 📌'}
              </button>
            </div>

            <div className="w-full aspect-video">
              <Player
              course={course}
              videoId={currentLesson.videoId}
              playlistId={activeInstructor.playlistId || null}
              playlistIndex={currentLessonIdx}
              lessonTitle={`الدرس #${currentLesson.index}: ${currentLesson.title}`}
              thumbnail={
                currentLesson.videoId
                  ? `https://i.ytimg.com/vi/${currentLesson.videoId}/hqdefault.jpg`
                  : (course.thumbnail || `https://i.ytimg.com/vi/${course.youtubeId || 'wHIdCNIQHpo'}/hqdefault.jpg`)
              }
              playing={playerPlaying}
              startSeconds={playerStartSeconds}
              reloadKey={playerReloadKey}
              nextLesson={nextLesson}
              isFocusMode={isFocusMode}
              onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
              onStartFacade={() => setPlayerPlaying(true)}
              onVideoEnd={handleLessonVideoEnd}
              onNextLesson={(nl) => handleSelectLesson(nl.index)}
            />
            </div>
          </div>

          {/* شريط التحكم والتنقل السريع بين الدروس */}
          <Card className="p-3.5 sm:p-4 bg-surface flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                disabled={!prevLesson}
                onClick={() => prevLesson && handleSelectLesson(prevLesson.index)}
                className="py-1.5 px-3 text-xs font-bold"
                title={prevLesson ? `الدرس السابق: ${prevLesson.title}` : 'لا يوجد درس سابق'}
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <span>الدرس السابق</span>
              </Button>

              <Button
                variant="primary"
                disabled={!nextLesson}
                onClick={() => nextLesson && handleSelectLesson(nextLesson.index)}
                className="py-1.5 px-3 text-xs font-bold"
                title={nextLesson ? `الدرس التالي: ${nextLesson.title}` : 'نهاية الدورة'}
              >
                <span>الدرس التالي</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* زر وضع التركيز / السينما للشاشات الكبيرة (Focus / Theater Mode) */}
              <Button
                variant={isFocusMode ? 'primary' : 'secondary'}
                onClick={() => setIsFocusMode((prev) => !prev)}
                className="hidden lg:inline-flex py-1.5 px-3 text-xs font-bold items-center gap-1.5"
                title={
                  isFocusMode
                    ? 'الخروج من وضع السينما والتركيز وإظهار القائمة الجانبية (Esc)'
                    : 'وضع التركيز / السينما (تكبير الشاشة وإخفاء القائمة الجانبية مؤقتاً لمشاهدة أكاديمية هادئة)'
                }
              >
                {isFocusMode ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-accent-ink" />
                    <span>إنهاء وضع السينما</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-accent" />
                    <span>وضع التركيز / السينما</span>
                  </>
                )}
              </Button>

              <Button
                variant={isCurrentLessonDone ? 'primary' : 'secondary'}
                onClick={() =>
                  toggleLessonCompleted(
                    course.id,
                    activeInstructor.id,
                    currentLesson.index
                  )
                }
                className="py-1.5 px-3 text-xs font-bold"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>
                  {isCurrentLessonDone ? 'أكملت هذا الدرس ✔' : 'وضع علامة مكتمل'}
                </span>
              </Button>

              <Button
                variant="secondary"
                onClick={(e) => toggleWatchlist(e, course.id)}
                className={`py-1.5 px-3 text-xs font-bold ${
                  watchlistIds.includes(course.id) ? 'border-accent text-accent' : ''
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{watchlistIds.includes(course.id) ? 'محفوظ' : 'حفظ'}</span>
              </Button>
            </div>
          </Card>

          {/* معلومات وتوجيهات المادة والمحاضر */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Chip tone="accent">{course.domainTitle || course.category}</Chip>
                <span className="text-text-muted font-bold font-mono">
                  الدرس #{currentLesson.index} من {instructorLessons.length}
                </span>
                {currentLesson.duration && (
                  <span className="text-text-muted font-mono">• المدة: {currentLesson.duration}</span>
                )}
              </div>

              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight leading-snug text-text-heading mt-2">
                {currentLesson.title}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted mt-2">
                <span>المحاضر:</span>
                <strong className="text-text-heading font-extrabold">
                  {activeInstructor.name}
                </strong>
                {activeInstructor.verified && (
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                )}
                <span className="text-text-muted">({activeInstructor.durationText || course.runtime})</span>
              </div>
            </div>

            {/* الملاحظة المنهجية وتوجيه المحاضر إن وجدا */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {course.methodologyNote && (
                <div className="p-3.5 rounded-xl border border-border bg-surface-2/60 space-y-1">
                  <span className="text-xs font-extrabold text-text-heading flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-accent" />
                    <span>نصيحة المنهج الأكاديمي:</span>
                  </span>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {course.methodologyNote}
                  </p>
                </div>
              )}

              {activeInstructor.note && (
                <div className="p-3.5 rounded-xl border border-border bg-surface-2/60 space-y-1">
                  <span className="text-xs font-extrabold text-text-heading flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-accent" />
                    <span>توجيه المحاضر ({activeInstructor.name}):</span>
                  </span>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {activeInstructor.note}
                  </p>
                </div>
              )}
            </div>

            {/* نموذج تقييم الدورة */}
            {userVoteOpen && (
              <form onSubmit={handleUserScoreSubmit} className="p-4 rounded-xl border border-border bg-surface-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-text-heading">
                    تقييمي الشخصي للشرح (يُحفظ محلياً ولا يغيّر التقييم العام)
                  </span>
                  {voteSuccess ? (
                    <Chip tone="accent">✓ تم حفظ تقييمك الشخصي بنجاح!</Chip>
                  ) : activeUserRating ? (
                    <span className="text-xs font-bold text-text-muted">
                      {canEditActiveRating ? 'يمكنك تعديل تقييمك مرة واحدة فقط' : 'تم استنفاد التعديل المتاح'}
                    </span>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {RATING_DIMS.map((dim) => (
                    <div key={dim.key} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-text">{dim.label}</span>
                        <span className="text-accent">{userScores[dim.key]} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="5.0"
                        max="10.0"
                        step="0.1"
                        disabled={!canEditActiveRating}
                        value={userScores[dim.key]}
                        onChange={(e) =>
                          setUserScores({ ...userScores, [dim.key]: parseFloat(e.target.value) })
                        }
                        className="w-full accent-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-text-muted">
                    متوسط تقييمي: <strong className="text-accent">{getOverallScore(userScores)} / 10</strong>
                  </span>
                  {canEditActiveRating && (
                    <Button variant="primary" type="submit">
                      {activeUserRating ? 'حفظ التعديل الأخير' : 'اعتماد تقييمي'}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </Card>

          {/* المراجعات والتعليقات */}
          <ReviewBlock course={course} />
        </div>

        {/* العمود الأيسر: الفهرس الكامل المرتب لدروس الدورة (Ordered Curriculum Playlist) */}
        <div className={`${isFocusMode ? 'hidden' : 'lg:col-span-4'} space-y-5 transition-all duration-300`}>
          <Card className="overflow-hidden border-border bg-surface shadow-md flex flex-col max-h-[820px]">
            {/* رأس الفهرس وشريط التقدم */}
            <div className="p-4 border-b border-border bg-surface space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-text-heading flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-accent" />
                    <span>فهرس دروس الدورة</span>
                  </h2>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    شرح: {activeInstructor.name} ({instructorLessons.length} درساً)
                  </p>
                </div>

                <span className="text-xs font-mono font-extrabold text-accent bg-accent/10 px-2 py-1 rounded-lg">
                  {completionPercentage}% مكتمل
                </span>
              </div>

              {/* شريط التقدم المرئي */}
              <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden border border-border">
                <div
                  className="bg-accent h-full transition-all duration-500 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              {/* حقل البحث السريع داخل دروس الدورة */}
              <div className="relative">
                <input
                  type="text"
                  value={lessonSearchQuery}
                  onChange={(e) => setLessonSearchQuery(e.target.value)}
                  placeholder="بحث في دروس الدورة أو رقم الدرس..."
                  aria-label="بحث داخل الدروس"
                  className="w-full text-xs font-medium rounded-xl pl-8 pr-8 py-2 bg-surface-2 text-text border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring placeholder:text-text-muted transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {lessonSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setLessonSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent"
                    aria-label="مسح البحث"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* قائمة الدروس المرتبة ذات التمرير السلس */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/60 p-2 space-y-1">
              {filteredLessons.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">
                  لا توجد دروس مطابقة لكلمة البحث &quot;{lessonSearchQuery}&quot;
                </div>
              ) : (
                filteredLessons.map((lesson) => {
                  const isCurrent = lesson.index === currentLesson.index;
                  const isDone = isLessonCompleted(
                    course.id,
                    activeInstructor.id,
                    lesson.index
                  );

                  return (
                    <div
                      key={lesson.index}
                      ref={isCurrent ? activeLessonItemRef : null}
                      onClick={() => handleSelectLesson(lesson.index)}
                      className={`group p-2.5 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer transition-all border ${
                        isCurrent
                          ? 'bg-[#14B8A6]/15 border-[#14B8A6] ring-1 ring-[#14B8A6]/40 shadow-sm'
                          : 'bg-surface hover:bg-surface-2 border-transparent hover:border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* مؤشر التشغيل أو رقم الدرس */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                            isCurrent
                              ? 'bg-accent text-accent-ink shadow-sm'
                              : 'bg-surface-2 text-text-muted group-hover:text-text-heading'
                          }`}
                        >
                          {isCurrent && playerPlaying ? (
                            <Play className="w-3.5 h-3.5 fill-current animate-pulse text-accent-ink" />
                          ) : (
                            lesson.index
                          )}
                        </div>

                        {/* عنوان الدرس ومدته مع عزل اتجاه سليم dir="rtl" */}
                        <div className="min-w-0 flex-1 text-right" dir="rtl">
                          <p
                            dir="rtl"
                            className={`text-xs font-bold leading-snug line-clamp-2 transition-colors [unicode-bidi:plaintext] text-right ${
                              isCurrent ? 'text-text-heading font-black' : 'text-text'
                            }`}
                          >
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <span
                              className="text-[10px] text-text-muted font-mono flex items-center gap-1 mt-0.5 justify-start"
                              dir="rtl"
                            >
                              <Clock className="w-2.5 h-2.5 shrink-0" />
                              <span dir="ltr">{lesson.duration}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* زر علامة مكتمل الفوري */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLessonCompleted(
                            course.id,
                            activeInstructor.id,
                            lesson.index
                          );
                        }}
                        title={isDone ? 'إلغاء الإكمال' : 'تحديد كمكتمل'}
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all border ${
                          isDone
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                            : 'border-border/80 text-transparent hover:text-text-muted hover:border-accent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* شارة تحميل صغيرة وأنيقة في أسفل فهرس الدروس أثناء جلب بقية الدروس في الخلفية */}
            {isFetchingPlaylist && (
              <div
                data-testid="playlist-loading-badge"
                className="py-2.5 px-3 bg-accent/10 border-t border-accent/20 flex items-center justify-center gap-2 text-xs font-bold text-accent animate-pulse"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-accent" />
                <span>جاري استكمال واستيراد قائمة الدروس الكاملة من يوتيوب...</span>
              </div>
            )}
          </Card>

          {/* لوحة التقييم وحزم التقنيات */}
          <ScorePanel
            course={course}
            onOpenEditRating={() => {
              if (activeUserRating) setUserScores(activeUserRating.scores);
              setUserVoteOpen(true);
            }}
          />
          <TechStack course={course} onWatchCourse={onWatchCourse} />
        </div>
      </div>
    </div>
  );
}
