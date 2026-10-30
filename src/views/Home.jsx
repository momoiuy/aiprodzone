import { useState, useMemo } from 'react';
import { Bookmark } from 'lucide-react';
import { getOverallScore } from '../lib/format';
import { useLibrary } from '../context/LibraryContext';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import RoadmapPath from '../components/RoadmapPath';
import CourseCard from '../components/CourseCard';
import Card from '../components/Card';
import Button from '../components/Button';

// Props: { view: string, setView: (v: string) => void, displayMode: string, searchQuery: string, setSearchQuery: (q: string) => void, onWatchCourse: (id: string) => void }
export default function Home({
  view,
  setView,
  displayMode,
  searchQuery,
  setSearchQuery,
  onWatchCourse
}) {
  const { courses, categories, selectedCategory, setSelectedCategory, watchlistIds, completedIds } = useLibrary();

  const [selectedTool, setSelectedTool] = useState('كل الأدوات والتقنيات');
  const [sortBy, setSortBy] = useState('rank');

  const featuredCourse = useMemo(
    () => courses.find((c) => c.featured) || courses[0],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        if (view === 'watchlist' && !watchlistIds.includes(course.id)) return false;

        let matchesCategory = true;
        if (selectedCategory === 'الكل') matchesCategory = true;
        else if (selectedCategory === 'رائج') matchesCategory = course.trending;
        else if (selectedCategory === 'دورات جديدة') matchesCategory = course.isNewCourse;
        else if (selectedCategory === 'أدوات') matchesCategory = course.isToolGuide;
        else if (selectedCategory === 'الربح من الإنترنت') matchesCategory = course.isMonetization;
        else matchesCategory = course.category === selectedCategory;

        const matchesTool =
          selectedTool === 'كل الأدوات والتقنيات' ||
          course.primaryTool.toLowerCase().includes(selectedTool.toLowerCase()) ||
          course.toolsSummary.toLowerCase().includes(selectedTool.toLowerCase());

        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !q ||
          course.title.toLowerCase().includes(q) ||
          course.instructor.toLowerCase().includes(q) ||
          course.toolsSummary.toLowerCase().includes(q) ||
          course.category.toLowerCase().includes(q) ||
          course.oneLineVerdict.toLowerCase().includes(q);

        return matchesCategory && matchesTool && matchesSearch;
      })
      .sort((a, b) => {
        const overallA = getOverallScore(a.scores);
        const overallB = getOverallScore(b.scores);
        if (sortBy === 'rank') {
          if (a.rankOrder !== b.rankOrder) return a.rankOrder - b.rankOrder;
          return overallB - overallA;
        }
        if (sortBy === 'rating') return overallB - overallA;
        return b.viewsCount - a.viewsCount;
      });
  }, [courses, view, watchlistIds, selectedCategory, selectedTool, searchQuery, sortBy]);

  const roadmapGroups = useMemo(() => {
    const categoryOrder = (categories || []).map((c) => c.name);
    const map = new Map();
    for (const course of filteredCourses) {
      const list = map.get(course.category) || [];
      list.push(course);
      map.set(course.category, list);
    }
    const sortedCategories = Array.from(map.keys()).sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA === -1 && idxB === -1) return a.localeCompare(b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
    return sortedCategories.map((category) => {
      const items = (map.get(category) || []).slice().sort((a, b) => (a.orderIndex || a.rankOrder || 0) - (b.orderIndex || b.rankOrder || 0));
      const totalInCategory = courses.filter((c) => c.category === category);
      const completedInCategory = totalInCategory.filter((c) => completedIds.includes(c.id)).length;
      return {
        category,
        items,
        totalCount: totalInCategory.length,
        completedCount: completedInCategory
      };
    });
  }, [filteredCourses, courses, categories, completedIds]);

  const resetAllFilters = () => {
    setSelectedCategory('الكل');
    setSelectedTool('كل الأدوات والتقنيات');
    setSearchQuery('');
  };

  return (
    <div className="space-y-5 animate-smooth">
      {view === 'watchlist' && (
        <Card className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
          <Button variant="secondary" onClick={() => setView('courses')} className="self-start sm:self-auto">
            العودة لكل الشروحات
          </Button>
        </Card>
      )}

      {view === 'courses' && !searchQuery && selectedCategory === 'الكل' && selectedTool === 'كل الأدوات والتقنيات' && (
        <Hero course={featuredCourse} onWatchCourse={onWatchCourse} />
      )}

      <FilterBar
        selectedTool={selectedTool}
        onSelectTool={setSelectedTool}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        onNavigateView={setView}
      />

      {filteredCourses.length === 0 ? (
        view === 'watchlist' && watchlistIds.length === 0 ? (
          <Card className="p-12 rounded-3xl text-center space-y-3">
            <p className="text-base font-bold text-text-heading">
              قائمة محفوظاتك فارغة حالياً. احفظ الدروس والشروحات التي تهمك للعودة إليها في أي وقت.
            </p>
            <Button variant="primary" onClick={() => setView('courses')}>
              تصفّح الشروحات
            </Button>
          </Card>
        ) : searchQuery.trim() !== '' ? (
          <Card className="p-12 rounded-3xl text-center space-y-3">
            <p className="text-base font-bold text-text-heading">
              لا توجد شروحات مطابقة لكلمة البحث «{searchQuery.trim()}».
            </p>
            <Button variant="primary" onClick={resetAllFilters}>
              إعادة ضبط الفلاتر
            </Button>
          </Card>
        ) : (
          <Card className="p-12 rounded-3xl text-center space-y-3">
            <p className="text-base font-bold text-text-heading">
              لا توجد شروحات مطابقة لخيارات الفلترة الحالية.
            </p>
            <Button variant="primary" onClick={resetAllFilters}>
              إعادة ضبط الفلاتر
            </Button>
          </Card>
        )
      ) : displayMode === 'roadmap' ? (
        <RoadmapPath groups={roadmapGroups} onWatchCourse={onWatchCourse} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onWatchCourse={onWatchCourse} />
          ))}
        </div>
      )}
    </div>
  );
}
