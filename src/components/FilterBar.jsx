import { TOOL_FILTERS } from '../data/tools';
import { useLibrary } from '../context/LibraryContext';
import CategoryPills from './CategoryPills';
import Card from './Card';
import Chip from './Chip';
import Button from './Button';

const CATEGORY_HINTS = {
  'صناعة الفيديو':
    'ابدأ بالدرس #1 لإتقان توليد المشاهد بـ Veo 3، ثم انتقل للدرس #2 لتثبيت الشخصيات، والدرس #3 لإنتاج الفيديوهات الطويلة.',
  برمجة:
    'ابدأ بالدرس #1 لفهم المنطق البرمجي، ثم الدرس #2 لإتقان بايثون عملياً، والدرس #3 للبرمجة بأدوات الذكاء الاصطناعي.',
  'ذكاء اصطناعي':
    'ابدأ بالدرس #1 لتأسيس هندسة الأوامر، ثم الدرس #2 لبناء المساعدات الذكية، والدرس #3 لمقارنة النماذج الكبرى.',
  'كتب إلكترونية':
    'ابدأ بالدرس #1 لتأليف وتصميم كتابك عبر Canva، ثم الدرس #2 للنشر على أمازون KDP، والدرس #3 لبيع المنتجات الرقمية.',
  أدوات: 'شروحات تطبيقية لأقوى أدوات الذكاء الاصطناعي والبرمجة المجانية لعام 2026.',
  رائج: 'الشروحات الأعلى طلباً وتقييماً من مجتمع المتعلمين هذا الأسبوع.',
  'دورات جديدة': 'أحدث الشروحات والورش العملية المضافة والمحدثة لعام 2026.',
  'الربح من الإنترنت': 'مسارات عملية حقيقية لبناء دخل من صناعة الفيديو، الكتب الإلكترونية، والبرمجة.'
};

const selectClass =
  'block w-full sm:w-auto text-xs font-bold rounded-xl px-3 py-2 bg-surface text-text border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring cursor-pointer transition-colors';

// Props: { selectedTool: string, onSelectTool: (tool: string) => void, sortBy: string, onSelectSort: (sort: string) => void, onNavigateView: (view: string) => void }
export default function FilterBar({
  selectedTool,
  onSelectTool,
  sortBy,
  onSelectSort,
  onNavigateView
}) {
  const { selectedCategory, setSelectedCategory: onSelectCategory } = useLibrary();

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        <CategoryPills />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 shrink-0 w-full lg:w-auto">
          <select
            value={selectedTool}
            onChange={(e) => onSelectTool(e.target.value)}
            aria-label="فلتر الأدوات والتقنيات"
            className={selectClass}
          >
            {TOOL_FILTERS.map((tool) => (
              <option key={tool} value={tool} className="bg-surface text-text">
                {tool}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            aria-label="ترتيب الشروحات"
            className={selectClass}
          >
            <option value="rank" className="bg-surface text-text">الترتيب المنهجي (من الأفضل #1)</option>
            <option value="rating" className="bg-surface text-text">★ الأعلى تقييماً</option>
            <option value="views" className="bg-surface text-text">الأكثر مشاهدة</option>
          </select>
        </div>
      </div>

      {selectedCategory !== 'الكل' && (
        <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Chip tone="accent">مسار {selectedCategory}</Chip>
              <span className="text-xs font-bold text-text-muted">
                مرتب بدقة من المستوى التأسيسي (#1) حتى الاحتراف (#3)
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium pt-1 text-text">
              {CATEGORY_HINTS[selectedCategory] || ''}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedCategory === 'كتب إلكترونية' && (
              <Button variant="primary" onClick={() => onNavigateView('ebooks')}>
                قراءة الملخصات النصية
              </Button>
            )}
            {selectedCategory === 'أدوات' && (
              <Button variant="primary" onClick={() => onNavigateView('tools')}>
                فتح جدول مقارنة الأدوات
              </Button>
            )}
            <Button variant="ghost" onClick={() => onSelectCategory('الكل')}>
              عرض الكل
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
