'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { INITIAL_COURSES } from './data/courses';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import SubmitModal from './components/SubmitModal';
import BrandModal from './components/BrandModal';
import Home from './views/Home';
import Watch from './views/Watch';
import Ebooks from './views/Ebooks';
import Tools from './views/Tools';

// Props: {} (تخطيط وتنقل المنصة الداخلي مع مزامنة الروابط وزر الرجوع)
function AppShell() {
  const { courses, selectedCategory, setSelectedCategory } = useLibrary();

  const [view, setView] = useState('courses');
  const [displayMode, setDisplayMode] = useState('grid');
  const [activeCourseId, setActiveCourseId] = useState(INITIAL_COURSES[0].id);
  const [activeEbook, setActiveEbook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);

  const activeCourse = useMemo(
    () => courses.find((c) => c.id === activeCourseId) || courses[0],
    [courses, activeCourseId]
  );

  // مزامنة حالة التطبيق مع رابط المتصفح وسجل التنقل (Back / Forward)
  const navigateView = useCallback(
    (newView, options = {}) => {
      setView(newView);
      const { courseId, cat, replace = false } = options;
      if (courseId) setActiveCourseId(courseId);
      if (cat) setSelectedCategory(cat);

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (newView === 'courses' && !cat && !options.keepSearch) {
          url.search = '';
        } else {
          url.searchParams.set('view', newView);
          if (newView === 'watch' && (courseId || activeCourseId)) {
            url.searchParams.set('course', courseId || activeCourseId);
          } else {
            url.searchParams.delete('course');
          }
          if (cat && cat !== 'الكل') {
            url.searchParams.set('cat', cat);
          } else if (!cat && newView === 'courses') {
            url.searchParams.delete('cat');
          }
        }
        if (replace) {
          window.history.replaceState({ view: newView, courseId, cat }, '', url.toString());
        } else {
          window.history.pushState({ view: newView, courseId, cat }, '', url.toString());
        }
        if (!options.noScroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    [activeCourseId, setSelectedCategory]
  );

  // قراءة المعاملات الأولية من الرابط والاستماع لأزرار الرجوع/التقدم في المتصفح
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const initialView = params.get('view');
    const initialCourseId = params.get('course');
    const initialCat = params.get('cat');

    if (initialView && ['courses', 'watch', 'ebooks', 'tools', 'watchlist'].includes(initialView)) {
      setView(initialView);
    }
    if (initialCourseId) {
      setActiveCourseId(initialCourseId);
    }
    if (initialCat) {
      setSelectedCategory(initialCat);
    }

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const pv = p.get('view') || 'courses';
      const pcId = p.get('course');
      const pcat = p.get('cat') || 'الكل';
      setView(pv);
      if (pcId) setActiveCourseId(pcId);
      setSelectedCategory(pcat);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setSelectedCategory]);

  const handleSelectFilter = (categoryName) => {
    navigateView('courses', { cat: categoryName });
    setSidebarOpen(false);
  };

  const openCourseWatch = (courseId) => {
    navigateView('watch', { courseId });
  };

  const handleResetHome = () => {
    navigateView('courses');
    setSelectedCategory('الكل');
    setDisplayMode('grid');
    setActiveEbook(null);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full overflow-x-clip bg-bg text-text font-arabic antialiased transition-colors duration-300 flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 selection:bg-accent selection:text-accent-ink"
    >
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        view={view}
        setView={(v) => navigateView(v)}
        selectedCategory={selectedCategory}
        onSelectFilter={handleSelectFilter}
        onOpenBrandModal={() => setBrandModalOpen(true)}
        onOpenSubmitModal={() => setSubmitModalOpen(true)}
        onOpenEbooks={() => {
          navigateView('ebooks');
          setActiveEbook(null);
        }}
      />

      <Header
        view={view}
        setView={(v) => navigateView(v)}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenSubmitModal={() => setSubmitModalOpen(true)}
        onResetHome={handleResetHome}
      />

      <main className="flex-1 max-w-7xl w-full min-w-0 mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {(view === 'courses' || view === 'watchlist') && (
          <Home
            view={view}
            setView={(v) => navigateView(v)}
            displayMode={displayMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onWatchCourse={openCourseWatch}
          />
        )}

        {view === 'watch' && activeCourse && (
          <Watch
            course={activeCourse}
            onBack={() => navigateView('courses')}
            onWatchCourse={openCourseWatch}
          />
        )}

        {view === 'ebooks' && (
          <Ebooks
            activeEbook={activeEbook}
            setActiveEbook={setActiveEbook}
            onSelectCategory={handleSelectFilter}
          />
        )}

        {view === 'tools' && <Tools onSelectCategory={handleSelectFilter} />}
      </main>

      <SubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onCourseCreated={openCourseWatch}
      />

      <BrandModal isOpen={brandModalOpen} onClose={() => setBrandModalOpen(false)} />

      <BottomNav
        view={view}
        setView={(v) => navigateView(v)}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
      />
    </div>
  );
}

// Props: {} (المكوّن الجذري للتركيب والتنقل فقط)
export default function App() {
  return (
    <LibraryProvider>
      <AppShell />
    </LibraryProvider>
  );
}
