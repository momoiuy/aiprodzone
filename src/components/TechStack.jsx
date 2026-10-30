import { Cpu } from 'lucide-react';
import { getOverallScore } from '../lib/format';
import { handleThumbnailError } from '../lib/youtube';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Chip from './Chip';

// Props: { course: object, onWatchCourse: (courseId: string) => void }
export default function TechStack({ course, onWatchCourse }) {
  const { courses } = useLibrary();

  const sameTrackCourses = courses
    .filter((c) => c.category === course.category)
    .sort((a, b) => a.rankOrder - b.rankOrder);

  return (
    <>
      <Card className="p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-text-muted" />
          <h3 className="text-sm font-extrabold text-text-heading">
            الأدوات والتقنيات المستخدمة في الشرح
          </h3>
        </div>
        <div className="space-y-2">
          {course.techStack.map((t, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-border bg-surface-2 flex items-center justify-between text-xs"
            >
              <span className="text-text-muted">{t.role}</span>
              <span className="font-mono font-extrabold text-text-heading" dir="ltr">
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-text-heading">
            ترتيب مسار «{course.category}»
          </h3>
          <Chip tone="neutral">من الأفضل</Chip>
        </div>
        <div className="space-y-3">
          {sameTrackCourses.map((item) => {
            const isCurrent = item.id === course.id;
            return (
              <div
                key={item.id}
                onClick={() => onWatchCourse(item.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-accent-soft border-accent text-text-heading'
                    : 'bg-surface-2 border-border hover:border-accent'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg font-extrabold text-xs flex items-center justify-center shrink-0 border ${
                    isCurrent
                      ? 'bg-accent text-accent-ink border-transparent'
                      : 'bg-surface text-text-muted border-border'
                  }`}
                >
                  #{item.rankOrder}
                </span>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  onError={handleThumbnailError}
                  className="w-20 h-12 rounded-lg object-cover shrink-0 bg-surface-2"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-extrabold truncate text-text-heading">
                    {item.title}
                  </h4>
                  <p className="text-[10px] truncate mt-0.5 text-text-muted">
                    {item.level} • <span className="text-accent font-bold">★ {getOverallScore(item.scores)}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
