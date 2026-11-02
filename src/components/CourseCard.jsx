import { Bookmark, Star, Play, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { formatViews, getOverallScore } from '../lib/format';
import { handleThumbnailError } from '../lib/youtube';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Chip from './Chip';

// Props: { course: object, onWatchCourse: (courseId: string) => void }
export default function CourseCard({ course, onWatchCourse }) {
  const { watchlistIds, completedIds, toggleWatchlist } = useLibrary();

  const isSaved = watchlistIds.includes(course.id);
  const isDone = completedIds.includes(course.id);
  const overallScore = getOverallScore(course.scores);
  const formattedViews = formatViews(course.viewsCount);

  return (
    <Card
      as="article"
      interactive
      onClick={() => onWatchCourse(course.id)}
      className="group overflow-hidden flex flex-col hover:-translate-y-0.5"
    >
      <div className="relative aspect-video overflow-hidden bg-surface-2">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          decoding="async"
          onError={handleThumbnailError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 opacity-85" />

        {/* Chip #1 (Neutral): Rank & Quality Badge */}
        <Chip
          tone="neutral"
          className="absolute top-2.5 right-2.5 bg-surface/90 backdrop-blur-md text-[10px] font-extrabold"
        >
          <span className="text-text-heading">#{course.rankOrder}</span>
          <span>{course.qualityBadge}</span>
        </Chip>

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => toggleWatchlist(e, course.id)}
            title={isSaved ? 'إزالة من المحفوظات' : 'حفظ في قائمتي'}
            aria-label={isSaved ? 'إزالة من المحفوظات' : 'حفظ في قائمتي'}
            className={`w-8 h-8 rounded-lg backdrop-blur-md border transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
              isSaved
                ? 'bg-accent-soft text-accent border-accent'
                : 'bg-surface/85 text-text-muted border-border hover:border-accent hover:text-text-heading'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Primary Data Metric: Rating */}
          <span className="px-2 py-0.5 rounded-lg bg-surface/90 backdrop-blur-md text-text-heading font-extrabold text-xs inline-flex items-center gap-1 border border-border">
            <Star className="w-3 h-3 fill-current text-accent" />
            <span>{overallScore}</span>
          </span>
        </div>

        {/* Plain Text Metadata Overlays (Not Chips) */}
        <span className="absolute bottom-2 right-2.5 text-white/95 font-bold text-[10px] drop-shadow">
          {course.level}
        </span>

        <span className="absolute bottom-2 left-2.5 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[10px]">
          {course.runtime}
        </span>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
          <div className="w-11 h-11 rounded-full bg-accent text-accent-ink flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 fill-current" />
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            {/* Chip #2 (Accent): Category */}
            <Chip tone="accent">{course.category}</Chip>
            <span className="font-bold text-text-muted">
              {course.viewsCount > 0 ? `${formattedViews} مشاهدة` : formattedViews}
            </span>
          </div>

          <h2 className="font-extrabold text-sm sm:text-[15px] leading-snug text-text-heading line-clamp-2">
            {course.title}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="font-bold truncate">{course.instructor}</span>
            {course.verified && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-accent" />}
          </div>

          <p className="text-xs text-text-muted line-clamp-2 pt-0.5 leading-relaxed">
            {course.oneLineVerdict}
          </p>
        </div>

        <div className="pt-2.5 border-t border-border flex items-center justify-between gap-2 text-[11px]">
          <span className="font-mono font-semibold text-text-muted truncate max-w-[62%]">
            {course.toolsSummary}
          </span>
          <span className="font-extrabold inline-flex items-center gap-1 shrink-0 text-text-heading group-hover:text-accent transition-colors">
            <span>{isDone ? 'مكتمل ✓' : 'ابدأ الشرح'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
          </span>
        </div>
      </div>
    </Card>
  );
}
