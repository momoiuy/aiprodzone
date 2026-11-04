import React from 'react';
import { Cpu } from 'lucide-react';
import { getOverallScore } from '../lib/format';
import { handleThumbnailError } from '../lib/youtube';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Chip from './Chip';

// Props: { course: object, onWatchCourse: (courseId: string) => void }
export default function TechStack({ course, onWatchCourse }) {
  const { courses } = useLibrary();

  const sameTrackCourses = (courses || [])
    .filter((c) => (c.domainTitle || c.category) === (course.domainTitle || course.category))
    .sort((a, b) => (a.orderIndex || a.rankOrder || 0) - (b.orderIndex || b.rankOrder || 0));

  const techItems = Array.isArray(course?.techStack)
    ? course.techStack.map((t) =>
        typeof t === 'string'
          ? { name: t, role: 'أداة وتقنية معتمدة' }
          : { name: t?.name || 'أداة', role: t?.role || 'تقنية معتمدة' }
      )
    : [];

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
          {techItems.length === 0 ? (
            <p className="text-xs text-text-muted">
              {course.toolsSummary || course.domainTitle || 'أدوات وتقنيات المسار الأكاديمي'}
            </p>
          ) : (
            techItems.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-border bg-surface-2 flex items-center justify-between text-xs"
              >
                <span className="text-text-muted">{t.role}</span>
                <span className="font-mono font-extrabold text-text-heading" dir="ltr">
                  {t.name}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="p-5 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-text-heading">
            مسارات قطاع «{course.domainTitle || course.category}»
          </h3>
          <Chip tone="neutral">المسار الأكاديمي</Chip>
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
                    ? 'bg-accent/15 border-accent text-text-heading ring-1 ring-accent'
                    : 'bg-surface-2 border-border hover:border-accent'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCurrent ? 'bg-accent text-accent-ink' : 'bg-surface text-text-muted'
                  }`}
                >
                  {item.orderIndex || item.rankOrder}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate text-text-heading">{item.title}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                    <span>{item.instructor}</span>
                    <span>•</span>
                    <span className="font-mono">★ {getOverallScore(item.scores)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
