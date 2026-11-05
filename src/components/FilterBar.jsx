'use client';

import { useMemo } from 'react';
import {
  Search,
  X,
  RotateCcw,
  LayoutGrid,
  FolderTree,
  SlidersHorizontal,
  Sparkles,
  BookOpen,
  Filter,
  Compass
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import CategoryPills from './CategoryPills';
import Card from './Card';
import Chip from './Chip';
import Button from './Button';

const CATEGORY_HINTS = {
  'الويب والبرمجة': 'مسار متكامل يبدأ من أساسيات تطوير الويب والواجهات الأمامية حتى بناء التطبيقات المعقدة الحديثة.',
  'لغات وتطبيقات وألعاب': 'شروحات عميقة للغات البرمجة الشائعة، بناء تطبيقات الهواتف الذكية ومحركات الألعاب.',
  'علوم الحاسوب': 'الأسس النظرية والأكاديمية: الخوارزميات، هياكل البيانات، هندسة البرمجيات وأنظمة التشغيل.',
  'قواعد البيانات والخلفية': 'بناء المعماريات الخلفية الصلبة، قواعد البيانات SQL و NoSQL وإدارة الخوادم والـ APIs.',
  'DevOps والسحابة والهندسة': 'الممارسات الهندسية الحديثة، الحوسبة السحابية، CI/CD وأتمتة النشر عبر Docker و Kubernetes.',
  'الذكاء الاصطناعي وعلم البيانات': 'رحلة تعلم الآلة، التعلم العميق، تحليل البيانات والأنظمة الذكية والتوليدية.',
  'الشبكات والأمن السيبراني': 'هندسة الشبكات والشهادات المهنية المعتمدة وأساسيات واحتراف الأمن السيبراني واختبار الاختراق.',
  'الأعمال واللغات': 'إدارة المشاريع والمنتجات، ريادة الأعمال التقنية واللغات الأساسية للتواصل المهني والعالمي.',
  أدوات: 'شروحات تطبيقية لأقوى أدوات الذكاء الاصطناعي والبرمجة المجانية لعام 2026.',
  رائج: 'الشروحات الأعلى طلباً وتقييماً من مجتمع المتعلمين هذا الأسبوع.',
  'دورات جديدة': 'أحدث الشروحات والورش العملية المضافة والمحدثة لعام 2026.',
  'الربح من الإنترنت': 'مسارات عملية حقيقية لبناء دخل من صناعة الفيديو، الكتب الإلكترونية، والبرمجة.'
};

const selectClass =
  'text-xs font-bold rounded-xl px-3 py-2 bg-surface text-text border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring cursor-pointer transition-colors';

export default function FilterBar({
  selectedSubFilter = 'الكل',
  onSelectSubFilter,
  sortBy,
  onSelectSort,
  searchQuery = '',
  setSearchQuery,
  displayMode = 'grid',
  setDisplayMode,
  onResetAll,
  onNavigateView,
  onOpenPathFinder
}) {
  const { selectedCategory, setSelectedCategory, courses } = useLibrary();

  // استخراج التخصصات والمواد الفرعية التابعة للقطاع المختار
  const subFilters = useMemo(() => {
    if (selectedCategory === 'الكل') return [];

    const domainCourses = (courses || []).filter(
      (c) => c.category === selectedCategory || c.domainTitle === selectedCategory
    );

    const subs = new Set();
    domainCourses.forEach((c) => {
      if (c.title) {
        // اختصار اسم المادة للعرض كفلتر فرعي أنيق
        const shortTitle = c.title
          .replace(/^دورة\s+|^شهادة\s+|^دبلومة\s+|^مسار\s+|^أساسيات\s+/i, '')
          .split('–')[0]
          .split('-')[0]
          .trim();
        subs.add(shortTitle);
      }
      if (c.examCode) {
        subs.add(c.examCode);
      }
    });

    return Array.from(subs);
  }, [selectedCategory, courses]);

  const hasActiveFilters =
    selectedCategory !== 'الكل' ||
    (selectedSubFilter && selectedSubFilter !== 'الكل') ||
    Boolean(searchQuery?.trim());

  return (
    <div className="space-y-3 pt-1">
      {/* المستوى الأول: هندسة متجاوبة - صف البحث والفرز أولاً في الهاتف يليه شريط القطاعات */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
        {/* أدوات البحث السريع والترتيب وطريقة العرض */}
        <div className="order-1 lg:order-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 shrink-0 w-full lg:w-auto">
          {/* حقل البحث اللحظي */}
          <div className="relative min-w-0 flex-1 sm:w-52 md:w-60 lg:w-56 xl:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في المواد والمحاضرين..."
              aria-label="بحث لحظي في الدورات"
              className="w-full min-h-[40px] h-10 text-xs font-medium rounded-xl pl-8 pr-8 py-2 bg-surface text-text border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring placeholder:text-text-muted transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 min-w-[28px] min-h-[28px] flex items-center justify-center text-text-muted hover:text-accent focus-visible:outline-none"
                aria-label="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* الترتيب بما في ذلك الترتيب الأبجدي */}
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              aria-label="ترتيب الشروحات"
              className="min-h-[40px] h-10 text-xs font-bold rounded-xl px-3 bg-surface text-text border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring cursor-pointer transition-colors flex-1 sm:flex-initial"
            >
              <option value="rank" className="bg-surface text-text">الترتيب المنهجي (من #1)</option>
              <option value="alpha" className="bg-surface text-text">الترتيب الأبجدي (أ - ي)</option>
              <option value="rating" className="bg-surface text-text">★ الأعلى تقييماً</option>
              <option value="views" className="bg-surface text-text">الأكثر مشاهدة</option>
            </select>

            {/* مستشار المسارات الذكي */}
            {onOpenPathFinder && (
              <button
                type="button"
                onClick={onOpenPathFinder}
                title="مستشار المسارات: من أين أبدأ؟"
                className="min-h-[40px] px-3 sm:px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-teal-500/15 hover:bg-teal-500/25 text-teal-800 dark:text-teal-300 border border-teal-500/40 shadow-sm shrink-0 active:scale-95"
              >
                <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400 stroke-[2.2]" />
                <span className="hidden sm:inline">🧭 مستشار المسارات: من أين أبدأ؟</span>
                <span className="sm:hidden">🧭 من أين أبدأ؟</span>
              </button>
            )}

            {/* أزرار التبديل بين عرض الشبكة والمضغوط */}
            {setDisplayMode && (
              <div className="flex items-center rounded-xl border border-border bg-surface p-0.5 min-h-[40px] h-10 shrink-0" role="group" aria-label="طريقة العرض">
                <button
                  type="button"
                  onClick={() => setDisplayMode('grid')}
                  title="عرض الشبكة (Grid)"
                  aria-label="عرض الشبكة"
                  className={`min-h-[36px] px-2.5 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    displayMode === 'grid'
                      ? 'bg-accent text-accent-ink shadow-sm'
                      : 'text-text-muted hover:text-text-heading'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                  <span className="inline text-xs font-extrabold">شبكة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayMode('grouped')}
                  title="عرض الدليل المصنف (Grouped)"
                  aria-label="عرض الدليل المصنف"
                  className={`min-h-[36px] px-2.5 sm:px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    displayMode === 'grouped'
                      ? 'bg-accent text-accent-ink shadow-sm'
                      : 'text-text-muted hover:text-text-heading'
                  }`}
                >
                  <FolderTree className="w-3.5 h-3.5 shrink-0" />
                  <span className="inline text-xs font-extrabold">مضغوط</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* شريط أزرار القطاعات الـ 8 في شريط تمرير أفقي ناعم باللمس */}
        <div className="order-2 lg:order-1 flex-1 min-w-0 w-full lg:w-auto">
          <CategoryPills />
        </div>
      </div>

      {/* المستوى الثاني: شريط الفلاتر الفرعي للمواد/التخصصات داخل القطاع المحدد */}
      {selectedCategory !== 'الكل' && (
        <Card className="p-3.5 sm:p-4 space-y-3 bg-surface/80 border-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="accent">قطاع {selectedCategory}</Chip>
                <span className="text-xs text-text-muted font-medium">
                  {CATEGORY_HINTS[selectedCategory] || 'تصفح مسارات ومواد هذا القطاع بدقة ومنهجية.'}
                </span>
              </div>
            </div>

            {/* أزرار سريعة للأدوات والكتب */}
            <div className="flex items-center gap-2 shrink-0">
              {selectedCategory === 'كتب إلكترونية' && (
                <Button variant="primary" onClick={() => onNavigateView('ebooks')} className="text-xs">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>المكتبة الرقمية</span>
                </Button>
              )}
              {selectedCategory === 'أدوات' && (
                <Button variant="primary" onClick={() => onNavigateView('tools')} className="text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مقارنة الأدوات</span>
                </Button>
              )}
            </div>
          </div>

          {/* شرائح التخصصات الفرعية داخل القطاع + زر التصفير */}
          {subFilters.length > 0 && (
            <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x pb-1 sm:pb-0 flex-1 min-w-0">
                <span className="text-xs font-extrabold text-text-muted flex items-center gap-1 ml-1 shrink-0 whitespace-nowrap">
                  <Filter className="w-3 h-3 text-accent" />
                  <span>المواد والتخصصات:</span>
                </span>

                <button
                  type="button"
                  onClick={() => onSelectSubFilter && onSelectSubFilter('الكل')}
                  className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-extrabold transition-colors border shrink-0 whitespace-nowrap ${
                    selectedSubFilter === 'الكل'
                      ? 'bg-accent text-accent-ink border-accent'
                      : 'bg-surface-2 text-text-muted border-border hover:border-accent hover:text-text-heading'
                  }`}
                >
                  كافة مواد القطاع
                </button>

                {subFilters.map((sub) => {
                  const active = selectedSubFilter === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => onSelectSubFilter && onSelectSubFilter(sub)}
                      className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors border shrink-0 whitespace-nowrap ${
                        active
                          ? 'bg-accent text-accent-ink border-accent'
                          : 'bg-surface-2 text-text-muted border-border hover:border-accent hover:text-text-heading'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>

              {/* شارة الفلتر النشط وزر [تصفير] سريع */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={onResetAll}
                  className="inline-flex items-center gap-1 min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-extrabold text-accent bg-accent/10 border border-accent/30 hover:bg-accent hover:text-accent-ink transition-colors shrink-0 whitespace-nowrap"
                  title="إلغاء الفلترة والعودة لكافة الشروحات"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>[تصفير]</span>
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* شارة الفلتر النشط العام عند وجود بحث أو فلترة مفعلة */}
      {selectedCategory === 'الكل' && hasActiveFilters && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface border border-border text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-text-muted">الفلتر النشط:</span>
            {searchQuery && (
              <span className="px-2 py-0.5 rounded-md bg-accent/15 text-accent font-bold">
                البحث: &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1 font-bold text-accent hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة ضبط [تصفير]</span>
          </button>
        </div>
      )}
    </div>
  );
}
