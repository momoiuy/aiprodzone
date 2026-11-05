'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Bookmark,
  ChevronRight,
  ChevronLeft,
  FolderTree,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { getOverallScore } from '../lib/format';
import { matchesSmartSearch } from '../lib/search';
import { useLibrary } from '../context/LibraryContext';
import { INITIAL_COURSES_SUMMARY } from '../data/courses-summary';
import FilterBar from '../components/FilterBar';
import CourseCard from '../components/CourseCard';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Button from '../components/Button';

const HeroArticleCarousel = dynamic(() => import('../components/HeroArticleCarousel'), {
  loading: () => (
    <div
      dir="rtl"
      className="rounded-3xl min-h-[280px] sm:min-h-[300px] lg:min-h-[320px] bg-surface-2 animate-pulse border border-border"
    />
  )
});

const ResumeLearningBanner = dynamic(() => import('../components/ResumeLearningBanner'), { ssr: false });
const PathFinderModal = dynamic(() => import('../components/PathFinderModal'), { ssr: false });

const ITEMS_PER_PAGE = 12;

// Props: { view: string, setView: (v: string) => void, displayMode: string, setDisplayMode?: (m: string) => void, searchQuery: string, setSearchQuery: (q: string) => void, onWatchCourse: (id: string, instructorId?: string) => void }
export default function Home({
  view,
  setView,
  displayMode = 'grid',
  setDisplayMode,
  searchQuery,
  setSearchQuery,
  onWatchCourse
}) {
  const {
    courses: rawCourses,
    categories = [],
    selectedCategory = 'الكل',
    setSelectedCategory = (() => {}),
    watchlistIds = [],
    completedIds = []
  } = useLibrary();
  const courses = Array.isArray(rawCourses) && rawCourses.length > 0 ? rawCourses : INITIAL_COURSES_SUMMARY;

  const [selectedSubFilter, setSelectedSubFilter] = useState('الكل');
  const [selectedTool, setSelectedTool] = useState('كل الأدوات والتقنيات');
  const [sortBy, setSortBy] = useState('rank');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPathFinderModal, setShowPathFinderModal] = useState(false);

  // إعادة ضبط الصفحة الأولى وفلتر التخصص الفرعي عند تغيير القطاع أو البحث
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubFilter, searchQuery, sortBy]);

  useEffect(() => {
    setSelectedSubFilter('الكل');
  }, [selectedCategory]);

  const featuredCourse = useMemo(
    () => courses.find((c) => c.featured) || courses[0],
    [courses]
  );

  // التصفية والترتيب الشامل
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        if (view === 'watchlist' && !watchlistIds.includes(course.id)) return false;

        // فلترة القطاع الرئيسي (المستوى 1)
        let matchesCategory = true;
        if (selectedCategory === 'الكل') matchesCategory = true;
        else if (selectedCategory === 'رائج') matchesCategory = course.trending;
        else if (selectedCategory === 'دورات جديدة') matchesCategory = course.isNewCourse;
        else if (selectedCategory === 'أدوات') matchesCategory = course.isToolGuide;
        else if (selectedCategory === 'الربح من الإنترنت') matchesCategory = course.isMonetization;
        else {
          matchesCategory =
            course.category === selectedCategory ||
            course.domainTitle === selectedCategory ||
            course.domainId === selectedCategory;
        }

        // فلترة التخصص/المادة الفرعية (المستوى 2) مع التطبيع
        let matchesSubFilter = true;
        if (selectedSubFilter && selectedSubFilter !== 'الكل') {
          const subText = [
            course.title,
            course.examCode,
            course.toolsSummary,
            ...(Array.isArray(course.techStack) ? course.techStack : [])
          ].filter(Boolean).join(' ');
          matchesSubFilter = matchesSmartSearch(subText, selectedSubFilter);
        }

        // فلترة الأدوات القديمة إن وجدت
        const matchesTool =
          selectedTool === 'كل الأدوات والتقنيات' ||
          matchesSmartSearch([course.primaryTool, course.toolsSummary].filter(Boolean).join(' '), selectedTool);

        // البحث اللحظي الشامل مع التطبيع الذكي للعربية والإنجليزية
        const searchableText = [
          course.title,
          course.instructor,
          ...(course.instructors ? course.instructors.map((inst) => inst.name) : []),
          ...(course.instructors ? course.instructors.map((inst) => inst.note) : []),
          course.examCode,
          course.toolsSummary,
          course.primaryTool,
          course.category,
          course.domainTitle,
          course.methodologyNote,
          course.oneLineVerdict,
          course.synopsis,
          ...(Array.isArray(course.techStack) ? course.techStack : [])
        ]
          .filter(Boolean)
          .join(' ');

        const matchesSearch = matchesSmartSearch(searchableText, searchQuery);

        return matchesCategory && matchesSubFilter && matchesTool && matchesSearch;
      })
      .sort((a, b) => {
        const overallA = getOverallScore(a.scores);
        const overallB = getOverallScore(b.scores);
        if (sortBy === 'rank') {
          if (a.rankOrder !== b.rankOrder) return a.rankOrder - b.rankOrder;
          return overallB - overallA;
        }
        if (sortBy === 'rating') return overallB - overallA;
        if (sortBy === 'alpha') return (a.title || '').localeCompare(b.title || '', 'ar');
        return b.viewsCount - a.viewsCount;
      });
  }, [
    courses,
    view,
    watchlistIds,
    selectedCategory,
    selectedSubFilter,
    selectedTool,
    searchQuery,
    sortBy
  ]);

  // تقسيم الصفحات (12 بطاقة لكل صفحة)
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE));
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  // توليد أرقام الصفحات بنمط نافذة ذكية تمنع الخروج خارج شاشة الهاتف (360px)
  const paginationItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage, '...', totalPages];
  }, [totalPages, currentPage]);

  // تجميع المواد لعرض الدليل المصنف (Grouped View)
  const groupedCourses = useMemo(() => {
    const categoryOrder = (categories || []).map((c) => c.name);
    const map = new Map();

    for (const course of filteredCourses) {
      const catKey = course.domainTitle || course.category || 'أخرى';
      const list = map.get(catKey) || [];
      list.push(course);
      map.set(catKey, list);
    }

    const sortedCats = Array.from(map.keys()).sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

    return sortedCats.map((catName) => {
      const items = map.get(catName) || [];
      const totalInDomain = courses.filter(
        (c) => (c.domainTitle || c.category) === catName
      ).length;
      const completedInDomain = courses.filter(
        (c) => (c.domainTitle || c.category) === catName && completedIds.includes(c.id)
      ).length;

      return {
        categoryName: catName,
        items,
        totalCount: totalInDomain,
        completedCount: completedInDomain
      };
    });
  }, [filteredCourses, courses, categories, completedIds]);

  const resetAllFilters = () => {
    setSelectedCategory('الكل');
    setSelectedSubFilter('الكل');
    setSelectedTool('كل الأدوات والتقنيات');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-smooth">
      {/* شريط قائمة المحفوظات */}
      {view === 'watchlist' && (
        <Card className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface border-border shadow-sm">
          <div className="flex items-center gap-3">
            <Bookmark className="w-5 h-5 text-accent" />
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-text-heading">
                قائمة الشروحات والدورات المحفوظة
              </h1>
              <p className="text-xs text-text-muted">
                لديك {watchlistIds.length} شروحات محفوظة للعودة إليها وإكمال دراستها
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => setView('courses')} className="self-start sm:self-auto text-xs">
            العودة لكل الشروحات
          </Button>
        </Card>
      )}

      {/* قسم الهيرو الترحيبي: عارض المقالات التقنية الـ 18 الدوّار كل 10 ثوانٍ */}
      {view === 'courses' &&
        !searchQuery &&
        selectedCategory === 'الكل' &&
        selectedSubFilter === 'الكل' && (
          <HeroArticleCarousel
            setView={setView}
            onViewAllArticles={() => setView('articles')}
          />
        )}

      {/* شريط استأنف تعلمك الذكي من حيث توقفت */}
      <ResumeLearningBanner onWatchCourse={onWatchCourse} />

      {/* شريط التصنيف ثنائي المستوى (2-Tier Navigation Bar) */}
      <FilterBar
        selectedSubFilter={selectedSubFilter}
        onSelectSubFilter={setSelectedSubFilter}
        selectedTool={selectedTool}
        onSelectTool={setSelectedTool}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        onResetAll={resetAllFilters}
        onNavigateView={setView}
        onOpenPathFinder={() => setShowPathFinderModal(true)}
      />

      {/* محتوى الشروحات والدورات */}
      {filteredCourses.length === 0 ? (
        view === 'watchlist' && watchlistIds.length === 0 ? (
          <Card className="p-12 rounded-3xl text-center space-y-3 bg-surface border-border">
            <p className="text-base font-bold text-text-heading">
              قائمة محفوظاتك فارغة حالياً. احفظ الدروس والشروحات التي تهمك للعودة إليها في أي وقت.
            </p>
            <Button variant="primary" onClick={() => setView('courses')}>
              تصفّح الشروحات
            </Button>
          </Card>
        ) : searchQuery.trim() !== '' ? (
          <Card className="p-12 rounded-3xl text-center space-y-3 bg-surface border-border">
            <p className="text-base font-bold text-text-heading">
              لا توجد شروحات مطابقة لكلمة البحث «{searchQuery.trim()}».
            </p>
            <Button variant="primary" onClick={resetAllFilters}>
              إعادة ضبط الفلاتر [تصفير]
            </Button>
          </Card>
        ) : (
          <Card className="p-12 rounded-3xl text-center space-y-3 bg-surface border-border">
            <p className="text-base font-bold text-text-heading">
              لا توجد شروحات مطابقة لخيارات الفلترة الحالية.
            </p>
            <Button variant="primary" onClick={resetAllFilters}>
              إعادة ضبط الفلاتر [تصفير]
            </Button>
          </Card>
        )
      ) : displayMode === 'grouped' ? (
        /* عرض الدليل المصنف (Grouped View) */
        <div className="space-y-8 animate-smooth">
          {groupedCourses.map((group) => (
            <div key={group.categoryName} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border">
                <div className="flex items-center gap-2" dir="rtl">
                  <FolderTree className="w-5 h-5 text-accent shrink-0" />
                  <h2 dir="rtl" className="text-base sm:text-lg font-black text-text-heading [unicode-bidi:plaintext] text-right">
                    {group.categoryName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent shrink-0">
                    {group.items.length} مسارات
                  </span>
                </div>

                <div className="text-xs text-text-muted font-bold font-mono">
                  {group.completedCount} من {group.totalCount} مادة مكتملة
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 xl:gap-6">
                {group.items.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onWatchCourse={onWatchCourse}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* عرض الشبكة (Grid View) مع تقسيم الصفحات (12 بطاقة لكل صفحة) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 xl:gap-6">
            {paginatedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onWatchCourse={onWatchCourse}
              />
            ))}
          </div>

          {/* وحدة التحكم بتقسيم الصفحات (Responsive Pagination Controls) */}
          <div className="pt-4 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-text-muted font-bold font-mono text-center sm:text-right">
              عرض {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length)} من أصل{' '}
              {filteredCourses.length} مساراً تعليمياً
            </span>

            {totalPages > 1 && (
              <div
                className="flex items-center gap-1 sm:gap-1.5 max-w-full justify-center overflow-x-auto no-scrollbar py-0.5"
                role="navigation"
                aria-label="تنقل الصفحات"
              >
                <Button
                  variant="secondary"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className="min-h-[36px] sm:min-h-[32px] py-1.5 px-2.5 sm:px-3 text-xs font-bold shrink-0"
                  aria-label="الصفحة السابقة"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>السابق</span>
                </Button>

                {paginationItems.map((item, idx) => {
                  if (item === '...') {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="w-5 sm:w-7 h-8 flex items-center justify-center text-text-muted font-mono font-bold select-none text-xs shrink-0"
                      >
                        ...
                      </span>
                    );
                  }

                  const pageNum = item;
                  const isActive = currentPage === pageNum;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 320, behavior: 'smooth' });
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`min-w-[32px] sm:min-w-[34px] h-8 sm:h-8.5 px-2 rounded-xl text-xs font-mono font-bold transition-all border shrink-0 flex items-center justify-center ${
                        isActive
                          ? 'bg-accent text-accent-ink border-accent font-black shadow-sm'
                          : 'bg-surface text-text border-border hover:border-accent hover:text-text-heading'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <Button
                  variant="secondary"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className="min-h-[36px] sm:min-h-[32px] py-1.5 px-2.5 sm:px-3 text-xs font-bold shrink-0"
                  aria-label="الصفحة التالية"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* نافذة مستشار المسارات الذكي */}
      <PathFinderModal
        isOpen={showPathFinderModal}
        onClose={() => setShowPathFinderModal(false)}
        onWatchCourse={onWatchCourse}
      />
    </div>
  );
}
