import { useRef } from 'react';
import {
  Layers,
  Code2,
  Cpu,
  BookOpen,
  Video,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Image,
  UserCheck,
  Music,
  Bot,
  Database
} from 'lucide-react';
import { TOP_DROPDOWN_DATA } from '../data/courses';
import { useLibrary } from '../context/LibraryContext';
import Button from './Button';

const ICON_MAP = {
  الكل: Layers,
  'صناعة الأفلام والفيديو السينمائي (AI Filmmaking)': Video,
  'هندسة الأوامر والتلقين المتقدم (Prompt Engineering)': Cpu,
  'إنتاج الإعلانات التجارية بالذكاء الاصطناعي (AI Commercials & Ads)': Sparkles,
  'الأفلام الكرتونية والقصص التعليمية المتحركة (AI Animation)': Video,
  'توليد الصور الاحترافية وسير عمل ComfyUI & Flux': Image,
  'الأفاتار المتحدث واستنساخ الصوت (AI Avatars & Voice Cloning)': UserCheck,
  'صناعة الموسيقى والهندسة الصوتية بالذكاء الاصطناعي (AI Audio & Suno)': Music,
  'الوكلاء الأذكياء والأتمتة بدون كود (AI Agents & n8n Automation)': Bot,
  'البرمجة بالذكاء الاصطناعي وبناء التطبيقات (Vibe Coding & AI Dev)': Code2,
  'النماذج المحلية وأنظمة المعرفة الذكية (Local AI & RAG Systems)': Database
};

export default function CategoryPills({
  selectedCategory: selectedCategoryProp,
  onSelectCategory: onSelectCategoryProp
}) {
  const { selectedCategory: ctxCategory, setSelectedCategory: ctxSetCategory, categories } = useLibrary();
  const selectedCategory = selectedCategoryProp !== undefined ? selectedCategoryProp : ctxCategory;
  const onSelectCategory = onSelectCategoryProp || ctxSetCategory;
  const pillsScrollRef = useRef(null);

  const scrollCategoryPills = (direction) => {
    if (!pillsScrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    pillsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const sortedCategories = [...(categories || [])].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <div className="relative flex-1 flex items-center min-w-0">
      <Button
        variant="secondary"
        onClick={() => scrollCategoryPills('left')}
        className="hidden sm:flex w-8 h-8 p-0 rounded-lg shrink-0 mr-1.5"
        aria-label="تمرير لليسار"
      >
        <ChevronLeft className="w-4 h-4 text-text-muted" />
      </Button>

      <div
        ref={pillsScrollRef}
        className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth touch-pan-x"
      >
        {/* زر الكل */}
        <button
          type="button"
          onClick={() => onSelectCategory('الكل')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-[13px] font-extrabold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
            selectedCategory === 'الكل'
              ? 'bg-accent-soft text-text-heading border-accent shadow-sm'
              : 'bg-surface text-text-muted border-border hover:border-accent hover:text-text-heading'
          }`}
        >
          <Layers className={`w-3.5 h-3.5 shrink-0 ${selectedCategory === 'الكل' ? 'text-accent' : 'text-text-muted'}`} />
          <span>الكل</span>
        </button>

        {/* الأقسام العشرة مرتبة */}
        {sortedCategories.map((cat) => {
          const catName = cat.name;
          const displayLabel = cat.shortName || catName;
          const Icon = ICON_MAP[catName] || Sparkles;
          const active = selectedCategory === catName;
          return (
            <button
              key={cat.id || catName}
              type="button"
              onClick={() => onSelectCategory(catName)}
              title={catName}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-extrabold whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                active
                  ? 'bg-accent-soft text-text-heading border-accent shadow-sm'
                  : 'bg-surface text-text-muted border-border hover:border-accent hover:text-text-heading'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-accent' : 'text-text-muted'}`} />
              <span>{displayLabel}</span>
            </button>
          );
        })}

        {TOP_DROPDOWN_DATA.some((i) => i.id === selectedCategory) && (
          <button
            type="button"
            onClick={() => onSelectCategory('الكل')}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-extrabold whitespace-nowrap border border-accent bg-accent-soft text-text-heading flex items-center gap-1.5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <span>قسم: {selectedCategory}</span>
            <X className="w-3.5 h-3.5 text-accent" />
          </button>
        )}
      </div>

      <Button
        variant="secondary"
        onClick={() => scrollCategoryPills('right')}
        className="hidden sm:flex w-8 h-8 p-0 rounded-lg shrink-0 ml-1.5"
        aria-label="تمرير لليمين"
      >
        <ChevronRight className="w-4 h-4 text-text-muted" />
      </Button>
    </div>
  );
}
