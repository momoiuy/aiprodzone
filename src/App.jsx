'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { INITIAL_COURSES_SUMMARY } from './data/courses-summary';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import dynamic from 'next/dynamic';
import Header from './components/Header';
import Home from './views/Home';

const Sidebar = dynamic(() => import('./components/Sidebar'), { ssr: false });
const BottomNav = dynamic(() => import('./components/BottomNav'), { ssr: false });
const Footer = dynamic(() => import('./components/Footer'), { ssr: false });
const SubmitModal = dynamic(() => import('./components/SubmitModal'), { ssr: false });
const BrandModal = dynamic(() => import('./components/BrandModal'), { ssr: false });
const Watch = dynamic(() => import('./views/Watch'), { ssr: false });
const Ebooks = dynamic(() => import('./views/Ebooks'), { ssr: false });
const Tools = dynamic(() => import('./views/Tools'), { ssr: false });
const Articles = dynamic(() => import('./views/Articles'), { ssr: false });
const LegalView = dynamic(() => import('./views/LegalView'), { ssr: false });
const StudentProfileHub = dynamic(() => import('./components/StudentProfileHub'), { ssr: false });

// Props: {} (تخطيط وتنقل المنصة الداخلي مع مزامنة الروابط وزر الرجوع)
function AppShell() {
  const { courses, selectedCategory, setSelectedCategory } = useLibrary();

  const [view, setView] = useState('courses');
  const [legalTab, setLegalTab] = useState('about');
  const [displayMode, setDisplayMode] = useState('grid');
  const [activeCourseId, setActiveCourseId] = useState(INITIAL_COURSES_SUMMARY[0]?.id || null);
  const [activeInstructorId, setActiveInstructorId] = useState(null);
  const [activeArticleSlug, setActiveArticleSlug] = useState(null);
  const [activeEbook, setActiveEbook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);

  const activeCourse = useMemo(
    () => courses.find((c) => c.id === activeCourseId) || courses[0] || null,
    [courses, activeCourseId]
  );

  // مزامنة حالة التطبيق مع رابط المتصفح وسجل التنقل (Back / Forward)
  const navigateView = useCallback(
    (newView, options = {}) => {
      setView(newView);
      const { courseId, instructorId, cat, legalPage, replace = false } = options;
      if (courseId) setActiveCourseId(courseId);
      if (instructorId) setActiveInstructorId(instructorId);
      if (cat) setSelectedCategory(cat);
      if (legalPage) setLegalTab(legalPage);

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (newView === 'courses' && !cat && !options.keepSearch) {
          url.search = '';
        } else {
          url.searchParams.set('view', newView);
          if (newView === 'watch' && (courseId || activeCourseId)) {
            url.searchParams.set('course', courseId || activeCourseId);
            if (instructorId || activeInstructorId) {
              url.searchParams.set('inst', instructorId || activeInstructorId);
            }
          } else {
            url.searchParams.delete('course');
            url.searchParams.delete('inst');
          }
          if (cat && cat !== 'الكل') {
            url.searchParams.set('cat', cat);
          } else if (!cat && newView === 'courses') {
            url.searchParams.delete('cat');
          }
          if (newView === 'legal') {
            const pageToSet = legalPage || legalTab || 'about';
            url.searchParams.set('tab', pageToSet);
          } else {
            url.searchParams.delete('tab');
          }
        }
        if (replace) {
          window.history.replaceState({ view: newView, courseId, instructorId, cat, legalPage }, '', url.toString());
        } else {
          window.history.pushState({ view: newView, courseId, instructorId, cat, legalPage }, '', url.toString());
        }
        if (!options.noScroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    [activeCourseId, activeInstructorId, legalTab, setSelectedCategory]
  );

  // قراءة المعاملات الأولية من الرابط والاستماع لأزرار الرجوع/التقدم في المتصفح
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const initialView = params.get('view');
    const initialCourseId = params.get('course');
    const initialCat = params.get('cat');
    const initialTab = params.get('tab');
    const initialSlug = params.get('slug') || params.get('article');

    if (initialSlug) {
      setView('articles');
      setActiveArticleSlug(initialSlug);
    } else if (initialView && ['courses', 'watch', 'ebooks', 'tools', 'watchlist', 'articles', 'legal', 'profile'].includes(initialView)) {
      setView(initialView);
    }
    if (initialTab && ['about', 'privacy', 'terms', 'copyright', 'contact'].includes(initialTab)) {
      setLegalTab(initialTab);
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
      const ptab = p.get('tab') || 'about';
      const pSlug = p.get('slug') || p.get('article');
      setView(pv);
      if (pcId) setActiveCourseId(pcId);
      if (pSlug) setActiveArticleSlug(pSlug);
      setSelectedCategory(pcat);
      setLegalTab(ptab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setSelectedCategory]);

  const handleSelectFilter = (categoryName) => {
    navigateView('courses', { cat: categoryName });
    setSidebarOpen(false);
  };

  const openCourseWatch = (courseId, instructorId = null) => {
    if (instructorId) setActiveInstructorId(instructorId);
    navigateView('watch', { courseId, instructorId });
  };

  const handleResetHome = () => {
    navigateView('courses');
    setSelectedCategory('الكل');
    setDisplayMode('grid');
    setActiveEbook(null);
  };

  return (
    <div
      dir="ltr"
      className="min-h-screen w-full max-w-full overflow-x-hidden bg-bg text-text font-arabic antialiased transition-colors duration-300 flex flex-col pb-[calc(7rem+env(safe-area-inset-bottom,0px))] md:pb-8 selection:bg-accent selection:text-accent-ink"
    >
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        view={view}
        setView={(v) => navigateView(v)}
        selectedCategory={selectedCategory}
        onSelectFilter={handleSelectFilter}
        onOpenBrandModal={() => setBrandModalOpen(true)}
        onOpenLegal={(pageId) => {
          setLegalTab(pageId || 'about');
          navigateView('legal', { legalPage: pageId || 'about' });
        }}
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
            setDisplayMode={setDisplayMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onWatchCourse={openCourseWatch}
          />
        )}

        {view === 'watch' && activeCourse && (
          <Watch
            course={activeCourse}
            initialInstructorId={activeInstructorId}
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

        {view === 'articles' && (
          <Articles
            onWatchCourse={openCourseWatch}
            initialArticleSlug={activeArticleSlug}
          />
        )}

        {view === 'tools' && <Tools onSelectCategory={handleSelectFilter} />}

        {view === 'legal' && (
          <LegalView
            initialTab={legalTab}
            onTabChange={(tab) => {
              setLegalTab(tab);
              navigateView('legal', { legalPage: tab, keepSearch: true, replace: true, noScroll: true });
            }}
            onBackToCourses={() => navigateView('courses')}
            onSelectCategory={handleSelectFilter}
          />
        )}

        {view === 'profile' && (
          <StudentProfileHub onWatchCourse={openCourseWatch} />
        )}
      </main>

      <Footer
        onNavigate={(v, opts) => navigateView(v, opts)}
        onOpenLegal={(pageId) => {
          setLegalTab(pageId || 'about');
          navigateView('legal', { legalPage: pageId || 'about' });
        }}
        onSelectCategory={handleSelectFilter}
      />

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
    <LibraryProvider initialCourses={INITIAL_COURSES_SUMMARY}>
      <AppShell />
    </LibraryProvider>
  );
}
