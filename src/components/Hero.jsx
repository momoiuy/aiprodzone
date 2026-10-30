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
      className="group relative rounded-3xl overflow-hidden min-h-[190px] sm:min-h-[220px] flex items-center bg-surface-2"
    >
      <img
        src={HERO_LUXURY_BG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none select-none opacity-45 transition-transform duration-1000 group-hover:scale-105"
      />

      <div
        className="absolute inset-y-0 left-0 w-full sm:w-[65%] md:w-[58%] pointer-events-none select-none overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, rgba(0,0,0,1) 18%, rgba(0,0,0,0.82) 48%, rgba(0,0,0,0.25) 78%, rgba(0,0,0,0) 100%)',
          maskImage:
            'linear-gradient(to right, rgba(0,0,0,1) 18%, rgba(0,0,0,0.82) 48%, rgba(0,0,0,0.25) 78%, rgba(0,0,0,0) 100%)'
        }}
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          decoding="async"
          onError={handleThumbnailError}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-surface-2 via-accent-soft to-transparent" />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-surface-2 via-surface-2/85 to-transparent" />

      <div className="relative z-10 w-full px-5 sm:px-8 md:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2">
            <Chip tone="accent" className="px-3 py-1 rounded-full backdrop-blur-md">
              <Award className="w-3.5 h-3.5 text-accent" />
              <span>{course.category}</span>
            </Chip>
          </div>

          <h1 className="text-lg sm:text-2xl md:text-[26px] font-extrabold tracking-tight leading-snug text-text-heading drop-shadow-sm">
            {course.title}
          </h1>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md bg-accent text-accent-ink transition-transform duration-200 group-hover:scale-105">
              <Play className="w-4 h-4 fill-current text-accent-ink" />
              <span>ابدأ الدرس الآن</span>
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center justify-center pl-2 lg:pl-8 shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface/90 backdrop-blur-md border border-border group-hover:border-accent flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 fill-current text-accent" />
          </div>
        </div>
      </div>
    </Card>
  );
}
