import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, CheckSquare, Bookmark, Sliders, Lightbulb, Clock } from 'lucide-react';
import { formatViews, getOverallScore } from '../lib/format';
import { toSeconds } from '../lib/youtube';
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

// Props: { course: object, onBack: () => void, onWatchCourse: (courseId: string) => void }
export default function Watch({ course, onBack, onWatchCourse }) {
  const { courses, watchlistIds, completedIds, userRatings, toggleWatchlist, toggleCompleted, submitUserRating } = useLibrary();

  const [playerPlaying, setPlayerPlaying] = useState(false);
  const [playerStartSeconds, setPlayerStartSeconds] = useState(0);
  const [playerReloadKey, setPlayerReloadKey] = useState(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [userVoteOpen, setUserVoteOpen] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [userScores, setUserScores] = useState(DEFAULT_SCORES);

  // حساب الدرس التالي في نفس القسم حسب orderIndex أو rankOrder
  const sameCategoryCourses = (courses || [])
    .filter((c) => c.category === course.category)
    .sort((a, b) => (a.orderIndex || a.rankOrder || 0) - (b.orderIndex || b.rankOrder || 0));
  const currentIdx = sameCategoryCourses.findIndex((c) => c.id === course.id);
  const nextLesson = currentIdx !== -1 && currentIdx < sameCategoryCourses.length - 1 ? sameCategoryCourses[currentIdx + 1] : null;

  const activeUserRating = userRatings[course.id];
  const canEditActiveRating = !activeUserRating || activeUserRating.editCount < 1;

  useEffect(() => {
    setPlayerPlaying(false);
    setPlayerStartSeconds(0);
    setPlayerReloadKey(0);
    setActiveChapterIdx(0);
    setUserVoteOpen(false);
    setVoteSuccess(false);
  }, [course.id]);

  useEffect(() => {
    setUserScores(userRatings[course.id]?.scores || DEFAULT_SCORES);
  }, [course.id, userRatings]);

  const handleStartFacade = () => {
    setActiveChapterIdx(0);
    setPlayerStartSeconds(0);
    setPlayerPlaying(true);
    setPlayerReloadKey((prev) => prev + 1);
  };

  const handleSelectChapter = (idx, timeStr) => {
    setActiveChapterIdx(idx);
    setPlayerStartSeconds(toSeconds(timeStr));
    setPlayerPlaying(true);
    setPlayerReloadKey((prev) => prev + 1);
  };

  const handleUserScoreSubmit = (e) => {
    e.preventDefault();
    if (!canEditActiveRating) return;
    if (submitUserRating(course.id, userScores)) {
      setVoteSuccess(true);
      setTimeout(() => { setVoteSuccess(false); setUserVoteOpen(false); }, 1100);
    }
  };

  return (
    <div className="space-y-6 animate-smooth">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={onBack} className="text-xs sm:text-sm">
          <ArrowLeft className="w-4 h-4 text-text-muted" />
          <span>العودة إلى فهرس الشروحات</span>
        </Button>
        <div className="flex items-center gap-2 text-xs">
          <Chip tone="accent">قسم: {course.category}</Chip>
          <Chip tone="neutral">{course.qualityBadge} #{course.rankOrder}</Chip>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Player
            course={course}
            playing={playerPlaying}
            startSeconds={playerStartSeconds}
            reloadKey={playerReloadKey}
            nextLesson={nextLesson}
            onStartFacade={handleStartFacade}
            onVideoEnd={(id) => {
              if (!completedIds.includes(id)) toggleCompleted(id);
            }}
            onNextLesson={(nextId) => onWatchCourse(nextId)}
          />

          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Chip tone="accent">{course.category}</Chip>
              <Chip tone="neutral">{course.level}</Chip>
              <span className="text-text-muted font-medium">• المدة: {course.runtime}</span>
              <span className="text-text-muted font-medium">
                • {course.viewsCount > 0 ? `${formatViews(course.viewsCount)} مشاهدة على يوتيوب` : 'جديد على المنصة'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight leading-snug text-text-heading">{course.title}</h1>
                <p className="text-xs sm:text-sm mt-1.5 flex items-center gap-1.5 text-text-muted">
                  <span>تقديم المحاضر:</span>
                  <strong className="font-extrabold text-text-heading">{course.instructor}</strong>
                  {course.verified && <CheckCircle2 className="w-4 h-4 text-accent" />}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {nextLesson && (
                  <Button
                    variant="primary"
                    onClick={() => onWatchCourse(nextLesson.id)}
                    className="py-2.5 px-3.5 bg-accent text-accent-ink"
                    title={`الانتقال إلى: ${nextLesson.title}`}
                  >
                    <span>الدرس التالي #{nextLesson.orderIndex || nextLesson.rankOrder}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                <Button variant={completedIds.includes(course.id) ? 'primary' : 'secondary'} onClick={() => toggleCompleted(course.id)} className="py-2.5">
                  <CheckSquare className="w-4 h-4" />
                  <span>{completedIds.includes(course.id) ? 'أكملت هذا الدرس ✓' : 'تحديد كمكتمل'}</span>
                </Button>
                <Button variant="secondary" onClick={(e) => toggleWatchlist(e, course.id)} className={`py-2.5 ${watchlistIds.includes(course.id) ? 'border-accent text-accent' : ''}`}>
                  <Bookmark className="w-4 h-4" />
                  <span>{watchlistIds.includes(course.id) ? 'محفوظ' : 'حفظ'}</span>
                </Button>
                <Button variant="primary" onClick={() => { if (activeUserRating) setUserScores(activeUserRating.scores); setUserVoteOpen(!userVoteOpen); }} className="px-4 py-2.5">
                  <Sliders className="w-4 h-4 text-accent-ink" />
                  <span>{!activeUserRating ? 'قيّم الشرح' : canEditActiveRating ? `تقييمي: ${activeUserRating.overall} (تعديل)` : `تقييمي: ${activeUserRating.overall}`}</span>
                </Button>
              </div>
            </div>

            {userVoteOpen && (
              <form onSubmit={handleUserScoreSubmit} className="p-4 rounded-xl border border-border bg-surface-2 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-text-heading">تقييمي الشخصي للشرح (يُحفظ محلياً ولا يغيّر التقييم العام)</span>
                  {voteSuccess ? (
                    <Chip tone="accent">✓ تم حفظ تقييمك الشخصي بنجاح!</Chip>
                  ) : activeUserRating ? (
                    <span className="text-xs font-bold text-text-muted">
                      {canEditActiveRating ? 'يمكنك تعديل تقييمك مرة واحدة فقط' : 'تم استنفاد التعديل المتاح (مسموح بالتعديل مرة واحدة)'}
                    </span>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {RATING_DIMS.map((dim) => (
                    <div key={dim.key} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold"><span className="text-text">{dim.label}</span><span className="text-accent">{userScores[dim.key]} / 10</span></div>
                      <input type="range" min="5.0" max="10.0" step="0.1" disabled={!canEditActiveRating} value={userScores[dim.key]} onChange={(e) => setUserScores({ ...userScores, [dim.key]: parseFloat(e.target.value) })} className="w-full accent-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-text-muted">متوسط تقييمي المحسوب: <strong className="text-accent">{getOverallScore(userScores)} / 10</strong></span>
                  {canEditActiveRating && <Button variant="primary" type="submit">{activeUserRating ? 'حفظ التعديل الأخير' : 'اعتماد تقييمي'}</Button>}
                </div>
              </form>
            )}

            <div className="p-4 rounded-xl border border-border bg-surface-2 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-text-heading">
                <Lightbulb className="w-4 h-4 text-accent" />
                <span>ماذا ستتعلم في هذا الشرح؟</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-text">{course.synopsis}</p>

              {course.timestamps && course.timestamps.length > 0 && (
                <div className="pt-2 border-t border-border space-y-2">
                  <div className="text-xs font-extrabold flex items-center gap-1.5 text-text-heading"><Clock className="w-3.5 h-3.5 text-text-muted" /><span>فهرس المحاور الزمنية داخل الفيديو:</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {course.timestamps.map((ts, idx) => {
                      const isActiveChapter = playerPlaying && activeChapterIdx === idx;
                      return (
                        <button
                          key={idx} type="button" onClick={() => handleSelectChapter(idx, ts.time)}
                          className={`p-2.5 rounded-lg border flex items-center gap-2.5 text-xs text-right transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${isActiveChapter ? 'bg-accent-soft border-accent text-text-heading font-bold' : 'bg-surface border-border text-text hover:border-accent'}`}
                        >
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] shrink-0 ${isActiveChapter ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-text-muted'}`}>{ts.time}</span>
                          <span className="truncate font-medium">{ts.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <ReviewBlock course={course} />
        </div>

        <div className="lg:col-span-4 space-y-5">
          <ScorePanel course={course} onOpenEditRating={() => { if (activeUserRating) setUserScores(activeUserRating.scores); setUserVoteOpen(true); }} />
          <TechStack course={course} onWatchCourse={onWatchCourse} />
        </div>
      </div>
    </div>
  );
}
