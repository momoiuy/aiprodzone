import { GraduationCap, Star, CheckSquare, Bookmark } from 'lucide-react';
import { getOverallScore } from '../lib/format';
import { handleThumbnailError } from '../lib/youtube';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Chip from './Chip';
import Button from './Button';

// Props: { groups: Array<{ category: string, items: Array<object>, totalCount: number, completedCount: number }>, onWatchCourse: (courseId: string) => void }
export default function RoadmapPath({ groups, onWatchCourse }) {
  const { watchlistIds, completedIds, toggleWatchlist, toggleCompleted } = useLibrary();

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.category} className="space-y-4">
          <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-5 h-5 text-accent" />
              <h2 className="text-base sm:text-lg font-extrabold text-text-heading">
                مسار {group.category}
              </h2>
            </div>
            <Chip tone="accent" className="px-3 py-1 rounded-xl text-xs">
              {group.completedCount} من {group.totalCount} مكتمل
            </Chip>
          </Card>

          <div className="relative pr-6 sm:pr-8 space-y-4">
            <div
              aria-hidden="true"
              className="absolute right-[11px] sm:right-[15px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent via-accent/40 to-transparent rounded-full"
            />

            {group.items.map((course) => {
              const isDone = completedIds.includes(course.id);
              const isSaved = watchlistIds.includes(course.id);
              const overallScore = getOverallScore(course.scores);
              return (
                <Card
                  key={course.id}
                  interactive
                  onClick={() => onWatchCourse(course.id)}
                  className="relative group p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-5"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -right-[18px] sm:-right-[22px] top-8 w-3 h-3 rounded-full border-2 border-accent ${
                      isDone ? 'bg-accent' : 'bg-bg'
                    }`}
                  />

                  <div className="flex items-center gap-3 md:flex-col md:items-center md:justify-center md:w-20 shrink-0">
                    {/* Chip #1 (Accent): Step Rank Badge */}
                    <Chip tone="accent" className="w-11 h-11 rounded-2xl text-sm justify-center">
                      #{course.rankOrder}
                    </Chip>
                    <span className="text-[11px] font-bold text-text-muted">
                      المرحلة {course.rankOrder}
                    </span>
                  </div>

                  <div className="relative w-full md:w-60 aspect-video rounded-xl overflow-hidden bg-surface-2 shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      loading="lazy"
                      decoding="async"
                      onError={handleThumbnailError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/85 text-white font-mono text-[10px]">
                      {course.runtime}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      {/* Chip #2 (Neutral): Quality Badge */}
                      <Chip tone="neutral">{course.qualityBadge}</Chip>
                      <span className="font-bold text-text-muted">
                        {course.category} • {course.level}
                      </span>
                      <span className="font-extrabold inline-flex items-center gap-1 text-text-heading">
                        <Star className="w-3.5 h-3.5 fill-current text-accent" />
                        {overallScore}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-text-heading">
                      {course.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {course.oneLineVerdict}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                        <span className="font-bold">المحاضر: {course.instructor}</span>
                        <span>•</span>
                        <span className="font-mono">{course.toolsSummary}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={isDone ? 'primary' : 'secondary'}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompleted(course.id);
                          }}
                          className="px-3 py-1.5"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span>{isDone ? 'مكتمل ✓' : 'تحديد كمكتمل'}</span>
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={(e) => toggleWatchlist(e, course.id)}
                          className={`p-2 ${isSaved ? 'border-accent text-accent' : ''}`}
                          title="حفظ في قائمتي"
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
