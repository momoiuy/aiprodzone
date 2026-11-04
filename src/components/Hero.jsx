import { Award, Play } from 'lucide-react';
import { HERO_LUXURY_BG } from '../data/courses';
import { handleThumbnailError } from '../lib/youtube';
import Card from './Card';
import Chip from './Chip';
import Button from './Button';

// Props: { course: object, onWatchCourse: (courseId: string) => void }
export default function Hero({ course, onWatchCourse }) {
  if (!course) return null;

  return (
    <Card
      interactive
      onClick={() => onWatchCourse(course.id)}
      className="group relative rounded-3xl overflow-hidden min-h-[200px] sm:min-h-[230px] lg:min-h-[260px] flex items-center bg-surface-2 border border-border hover:border-accent/60 transition-all duration-300"
    >
      <img
        src={HERO_LUXURY_BG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none opacity-30 dark:opacity-45 transition-transform duration-1000 group-hover:scale-105"
      />

      {/* غلاف الدورة وصورة المحاضر بتدرج وانتقال ناعم يمنع التداخل */}
      <div
        className="absolute inset-y-0 right-0 w-full sm:w-[56%] md:w-[50%] lg:w-[46%] pointer-events-none select-none overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(to left, rgba(0,0,0,1) 22%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.25) 82%, rgba(0,0,0,0) 100%)',
          maskImage:
            'linear-gradient(to left, rgba(0,0,0,1) 22%, rgba(0,0,0,0.85) 52%, rgba(0,0,0,0.25) 82%, rgba(0,0,0,0) 100%)'
        }}
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          decoding="async"
          onError={handleThumbnailError}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 opacity-65 sm:opacity-90 dark:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-2 via-accent-soft/30 to-transparent" />
      </div>

      {/* طبقة حماية التباين اللوني للنص العربي في كلا الوضعين النهاري والليلي وعلى شاشات الهاتف */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-surface-2 via-surface-2/95 to-surface-2/65 sm:bg-gradient-to-r sm:from-surface-2 sm:via-surface-2/95 sm:to-transparent"
        aria-hidden="true"
      />

      {/* محتوى البانر: المسافات المتجاوبة p-4 sm:p-6 lg:p-8 */}
      <div className="relative z-10 w-full p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="max-w-xl lg:max-w-2xl space-y-2.5 sm:space-y-3.5">
          <div className="inline-flex items-center gap-2">
            <Chip tone="accent" className="px-3 py-1 rounded-full backdrop-blur-md shadow-xs">
              <Award className="w-3.5 h-3.5 text-accent" />
              <span>{course.category}</span>
            </Chip>
            {course.isNewCourse && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-accent/20 text-accent border border-accent/30">
                جديد 2026
              </span>
            )}
          </div>

          <h1
            dir="rtl"
            className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug sm:leading-snug lg:leading-tight text-text-heading drop-shadow-sm [unicode-bidi:plaintext] text-right"
          >
            {course.title}
          </h1>

          <div className="pt-1">
            <span className="inline-flex items-center gap-2 min-h-[40px] px-4 sm:px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md bg-accent text-accent-ink transition-transform duration-200 group-hover:scale-105 active:scale-95">
              <Play className="w-4 h-4 fill-current text-accent-ink" />
              <span>ابدأ الدرس الآن ◀</span>
            </span>
          </div>
        </div>

        {/* زر التشغيل الدائري الجمالي للشاشات الأكبر - معزول عن النص لمنع أي تداخل */}
        <div className="hidden sm:flex items-center justify-center pr-2 lg:pr-6 shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-surface/90 backdrop-blur-md border border-border group-hover:border-accent flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-accent" />
          </div>
        </div>
      </div>
    </Card>
  );
}
