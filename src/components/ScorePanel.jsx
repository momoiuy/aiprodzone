import { Star } from 'lucide-react';
import { getOverallScore } from '../lib/format';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Chip from './Chip';
import Button from './Button';

// Props: { course: object, onOpenEditRating: () => void }
export default function ScorePanel({ course, onOpenEditRating }) {
  const { userRatings } = useLibrary();

  const activeUserRating = course?.id ? userRatings[course.id] : null;
  const canEditActiveRating = !activeUserRating || activeUserRating.editCount < 1;

  const scores = course?.scores || { depth: 9.8, practical: 9.7, freshness: 9.6, production: 9.6 };

  const dimensions = [
    { label: 'عمق الشرح والوضوح', val: scores.depth || 9.8 },
    { label: 'التطبيق العملي بدون حشو', val: scores.practical || 9.7 },
    { label: 'حداثة الأدوات المشروحة', val: scores.freshness || 9.6 },
    { label: 'جودة الصوت والمونتاج', val: scores.production || 9.6 }
  ];

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-[11px] font-bold text-text-muted mb-0.5">
            معيار الجودة التعليمية
          </span>
          <h3 className="text-base font-extrabold text-text-heading">تقييم AIProdZone</h3>
        </div>
        {/* Chip #1 (Accent): Primary Rating Score */}
        <Chip tone="accent" className="px-3 py-1.5 rounded-xl text-xl">
          <Star className="w-4 h-4 fill-current text-accent" />
          <span>{getOverallScore(course.scores)}</span>
        </Chip>
      </div>

      {activeUserRating && (
        <div className="p-3 rounded-xl border border-border bg-surface-2 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="font-extrabold block text-text-heading">تقييمي الشخصي المحفوظ</span>
            <span className="text-[11px] text-text-muted">
              {canEditActiveRating ? 'متاح للتعديل مرة واحدة' : 'تم التعديل (نهائي)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Chip #2 (Neutral): User's Saved Rating */}
            <Chip tone="neutral" className="px-2.5 py-1">
              ★ {activeUserRating.overall} / 10
            </Chip>
            {canEditActiveRating && (
              <Button variant="secondary" onClick={onOpenEditRating} className="px-2.5 py-1">
                تعديل
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3 pt-1">
        {dimensions.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-text-muted">{item.label}</span>
              <span className="text-text-heading">{item.val} / 10</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${item.val * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
