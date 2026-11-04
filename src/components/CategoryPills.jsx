import { useRef } from 'react';
import {
  Layers,
  Code2,
  Smartphone,
  Cpu,
  Database,
  Cloud,
  Brain,
  Shield,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles
} from 'lucide-react';
import { TOP_DROPDOWN_DATA } from '../data/courses';
import { useLibrary } from '../context/LibraryContext';
import Button from './Button';

const ICON_MAP = {
  الكل: Layers,
  'الويب والبرمجة': Code2,
  'لغات وتطبيقات وألعاب': Smartphone,
  'علوم الحاسوب': Cpu,
  'قواعد البيانات والخلفية': Database,
  'DevOps والسحابة والهندسة': Cloud,
  'الذكاء الاصطناعي وعلم البيانات': Brain,
  'الشبكات والأمن السيبراني': Shield,
  'الأعمال واللغات': Briefcase
};

export default function CategoryPills({
  selectedCategory: selectedCategoryProp,
  onSelectCategory: onSelectCategoryProp
}) {
  const { selectedCategory: ctxCategory, setSelectedCategory: ctxSetCategory, categories, courses } = useLibrary();
  const selectedCategory = selectedCategoryProp !== undefined ? selectedCategoryProp : ctxCategory;
  const onSelectCategory = onSelectCategoryProp || ctxSetCategory;
  const pillsScrollRef = useRef(null);

  const scrollCategoryPills = (direction) => {
    if (!pillsScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    pillsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const sortedCategories = [...(categories || [])].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  const totalCoursesCount = courses ? courses.length : 0;

  return (
    <div className="relative flex-1 flex items-center min-w-0 w-full">
      <Button
        variant="secondary"
        onClick={() => scrollCategoryPills('left')}
        className="hidden md:flex w-8 h-8 min-w-[32px] p-0 rounded-lg shrink-0 mr-1.5 shadow-sm items-center justify-center"
        aria-label="تمرير لليسار"
      >
        <ChevronLeft className="w-4 h-4 text-text-muted" />
      </Button>

      <div
        ref={pillsScrollRef}
        className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto snap-x snap-mandatory pb-1.5 pt-0.5 no-scrollbar scroll-smooth touch-pan-x"
      >
        {/* زر الكل مع العداد الكلي */}
        <button
          type="button"
          onClick={() => onSelectCategory('الكل')}
          className={`shrink-0 whitespace-nowrap snap-start min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-extrabold transition-all duration-200 border flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
            selectedCategory === 'الكل'
              ? 'bg-accent/15 text-text-heading border-accent shadow-sm'
              : 'bg-surface text-text-muted border-border hover:border-accent hover:text-text-heading'
          }`}
        >
          <Layers className={`w-3.5 h-3.5 shrink-0 ${selectedCategory === 'الكل' ? 'text-accent' : 'text-text-muted'}`} />
          <span>الكل</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold leading-none ${
              selectedCategory === 'الكل'
                ? 'bg-accent text-accent-ink'
                : 'bg-surface-2 text-text-muted border border-border/80'
            }`}
          >
            {totalCoursesCount}
          </span>
        </button>

        {/* القطاعات الثمانية الكبرى مع عدادات الدورات */}
        {sortedCategories.map((cat) => {
          const catName = cat.name;
          const displayLabel = cat.shortName || catName;
          const Icon = ICON_MAP[catName] || Sparkles;
          const active = selectedCategory === catName;
          const count = (courses || []).filter(
            (c) => c.category === catName || c.domainTitle === catName || c.domainId === cat.id
          ).length;

          return (
            <button
              key={cat.id || catName}
              type="button"
              onClick={() => onSelectCategory(catName)}
              title={`${catName} (${count} مادة)`}
              className={`shrink-0 whitespace-nowrap snap-start min-h-[40px] px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-extrabold transition-all duration-200 border flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                active
                  ? 'bg-accent/15 text-text-heading border-accent shadow-sm'
                  : 'bg-surface text-text-muted border-border hover:border-accent hover:text-text-heading'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-accent' : 'text-text-muted'}`} />
              <span>{displayLabel}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold leading-none ${
                  active
                    ? 'bg-accent text-accent-ink'
                    : 'bg-surface-2 text-text-muted border border-border/80'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {TOP_DROPDOWN_DATA.some((i) => i.id === selectedCategory) && (
          <button
            type="button"
            onClick={() => onSelectCategory('الكل')}
            className="shrink-0 whitespace-nowrap snap-start min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-extrabold border border-accent bg-accent/15 text-text-heading flex items-center gap-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <span>قسم: {selectedCategory}</span>
            <X className="w-3.5 h-3.5 text-accent" />
          </button>
        )}
      </div>

      <Button
        variant="secondary"
        onClick={() => scrollCategoryPills('right')}
        className="hidden md:flex w-8 h-8 min-w-[32px] p-0 rounded-lg shrink-0 ml-1.5 shadow-sm items-center justify-center"
        aria-label="تمرير لليمين"
      >
        <ChevronRight className="w-4 h-4 text-text-muted" />
      </Button>
    </div>
  );
}
