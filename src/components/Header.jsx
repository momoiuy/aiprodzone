import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Layers,
  GraduationCap,
  Wrench,
  BookOpen,
  Newspaper,
  Bookmark,
  Search,
  X,
  Sun,
  Moon,
  Plus,
  Shield
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import Logo from './Logo';
import Button from './Button';

// Props: { view: string, setView: (v: string) => void, displayMode: string, setDisplayMode: (m: string) => void, searchQuery: string, setSearchQuery: (q: string) => void, onOpenSidebar: () => void, onOpenSubmitModal: () => void, onResetHome: () => void }
export default function Header({
  view,
  setView,
  displayMode,
  setDisplayMode,
  searchQuery,
  setSearchQuery,
  onOpenSidebar,
  onOpenSubmitModal,
  onResetHome
}) {
  const { theme, toggleTheme, watchlistIds, mounted } = useLibrary();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  // اختصار لوحة المفاتيح العالمي للبحث السريع (⌘K أو Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navTabs = [
    {
      id: 'grid-view',
      fullLabel: 'فهرس الشروحات',
      shortLabel: 'الشروحات',
      icon: Layers,
      active: view === 'courses' && displayMode === 'grid',
      onClick: () => {
        setView('courses');
        setDisplayMode('grid');
      }
    },
    {
      id: 'roadmap-view',
      fullLabel: 'مسارات التعلم',
      shortLabel: 'المسارات',
      icon: GraduationCap,
      active: view === 'courses' && (displayMode === 'roadmap' || displayMode === 'grouped'),
      onClick: () => {
        setView('courses');
        setDisplayMode('grouped');
      }
    },
    {
      id: 'articles-view',
      fullLabel: 'المقالات التقنية',
      shortLabel: 'المقالات',
      icon: Newspaper,
      active: view === 'articles',
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/articles';
        } else {
          setView('articles');
        }
      }
    },
    {
      id: 'tools-view',
      fullLabel: 'مقارنة الأدوات',
      shortLabel: 'الأدوات',
      icon: Wrench,
      active: view === 'tools',
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/tools';
        } else {
          setView('tools');
        }
      }
    },
    {
      id: 'ebooks-view',
      fullLabel: 'الكتب والأدلة',
      shortLabel: 'الكتب',
      icon: BookOpen,
      active: view === 'ebooks',
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/books';
        } else {
          setView('ebooks');
        }
      }
    }
  ];

  return (
    <header
      dir="ltr"
      className={`${
        view === 'watch' ? 'relative lg:sticky' : 'sticky'
      } top-0 z-40 w-full border-b border-border bg-bg/95 backdrop-blur-md overflow-x-clip`}
    >
      <div className="max-w-7xl w-full mx-auto px-2.5 sm:px-4 lg:px-5 xl:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 lg:gap-2 xl:gap-3">
        {/* الجانب الأيسر: الشعار أولاً ثم زر تصفح الأقسام */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Logo onClick={onResetHome} className="h-10 flex items-center shrink-0" />

          <div className="hidden sm:block h-4 sm:h-5 w-px bg-border shrink-0" aria-hidden="true" />

          <Button
            variant="secondary"
            onClick={onOpenSidebar}
            className="h-10 min-h-[40px] min-w-[40px] sm:h-9 sm:min-h-0 sm:min-w-0 px-2 sm:px-2.5 xl:px-3 shrink-0 rounded-xl text-xs whitespace-nowrap"
            title="تصفح كافة الأقسام التعليمية والمسارات"
            aria-label="تصفح الأقسام"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
            <span className="hidden min-[480px]:inline text-xs font-extrabold text-text-heading">
              الأقسام
            </span>
          </Button>
        </div>

        {/* الوسط: التبويبات المنهجية المركزية للحاسوب بتجاوب ذكي وجماليات دقيقة */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-0.5 xl:p-1 rounded-2xl bg-surface-2 border border-border shrink-0">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                className={`h-8 xl:h-8.5 px-2 xl:px-3 rounded-xl text-xs font-extrabold flex items-center gap-1 xl:gap-1.5 transition-all whitespace-nowrap shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                  tab.active
                    ? 'bg-accent-soft text-text-heading border-accent shadow-sm'
                    : 'bg-transparent text-text-muted border-transparent hover:text-text-heading hover:border-accent/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${tab.active ? 'text-accent' : 'text-text-muted'}`} />
                <span>
                  <span className="hidden 2xl:inline">{tab.fullLabel}</span>
                  <span className="2xl:hidden">{tab.shortLabel}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* الجانب الأيمن: أدوات البحث والمحفوظات والثيم ولوحة التحكم والإضافة */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* حقل البحث الذكي مع شارة الاختصار Ctrl+K */}
          <div className="relative hidden md:block w-28 lg:w-32 xl:w-44 2xl:w-52 shrink-0 transition-all duration-300 focus-within:w-36 lg:focus-within:w-40 xl:focus-within:w-52 2xl:focus-within:w-60">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'courses') setView('courses');
              }}
              placeholder="ابحث..."
              className="w-full h-9 sm:h-9 text-xs rounded-xl pl-8 sm:pl-9 pr-6 xl:pr-14 bg-surface-2 text-text placeholder:text-text-muted border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-heading"
                aria-label="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden xl:inline-flex items-center absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-border bg-surface text-[10px] font-mono text-text-muted pointer-events-none select-none">
                Ctrl+K
              </kbd>
            )}
          </div>

          {/* زر فتح البحث في الهواتف بمساحة لمس مريحة min-h-[40px] min-w-[40px] */}
          <Button
            variant="secondary"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden w-10 h-10 min-w-[40px] min-h-[40px] p-0 shrink-0 rounded-xl flex items-center justify-center"
            aria-label="بحث في الشروحات"
          >
            <Search className="w-4 h-4 text-text-muted" />
          </Button>

          {/* زر شروحاتي المحفوظة مع العداد الحي */}
          <button
            type="button"
            onClick={() => setView('watchlist')}
            title="شروحاتي وقائمتي المحفوظة"
            aria-label="شروحاتي المحفوظة"
            className={`relative hidden xl:inline-flex h-9 lg:h-9.5 px-2.5 lg:px-3 rounded-xl border items-center gap-1.5 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring shrink-0 ${
              view === 'watchlist'
                ? 'bg-accent-soft text-text-heading border-accent shadow-sm'
                : 'bg-surface-2 text-text border-border hover:border-accent hover:text-text-heading'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${view === 'watchlist' ? 'text-accent fill-accent/20' : 'text-text-muted'}`} />
            <span className="hidden 2xl:inline text-xs font-bold">المحفوظات</span>
            {watchlistIds.length > 0 && (
              <span
                suppressHydrationWarning
                className="px-1.5 py-0.2 rounded-full bg-accent text-accent-ink text-[10px] font-extrabold shrink-0"
              >
                {watchlistIds.length}
              </span>
            )}
          </button>

          {/* زر تبديل الثيم بمساحة لمس مريحة min-h-[40px] min-w-[40px] */}
          <button
            type="button"
            onClick={toggleTheme}
            suppressHydrationWarning
            className="w-10 h-10 min-w-[40px] min-h-[40px] sm:w-9 sm:h-9 sm:min-w-0 sm:min-h-0 lg:h-9.5 lg:w-9.5 rounded-xl border border-border bg-surface-2 hover:border-accent text-text flex items-center justify-center shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title={mounted && theme === 'light' ? 'التحويل للوضع الليلي (الداكن)' : 'التحويل للوضع النهاري (الفاتح)'}
            aria-label="تبديل الثيم"
          >
            {mounted && theme === 'light' ? (
              <Moon className="w-4 h-4 text-text-muted transition-transform duration-300 hover:-rotate-12" />
            ) : (
              <Sun className="w-4 h-4 text-accent transition-transform duration-300 hover:rotate-45" />
            )}
          </button>

          {/* زر لوحة التحكم للمشرف - تصميم فاخر وهوية زمردية بارزة */}
          <a
            href="/admin"
            className="h-10 min-h-[40px] min-w-[40px] sm:h-9 sm:min-h-0 sm:min-w-0 lg:h-9.5 px-2.5 sm:px-2.5 lg:px-3 rounded-xl border border-accent/40 bg-accent/10 hover:bg-accent/20 hover:border-accent text-teal-700 dark:text-teal-400 text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title="لوحة تحكم المشرف (إدارة الأقسام والدروس والكتب)"
            aria-label="لوحة تحكم المشرف"
          >
            <Shield className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
            <span className="hidden md:inline whitespace-nowrap text-xs font-extrabold text-teal-700 dark:text-teal-400">
              لوحة التحكم
            </span>
          </a>

          {/* زر إضافة شرح جديد - زر الإجراء الأساسي البارز دائماً */}
          <Button
            variant="primary"
            onClick={onOpenSubmitModal}
            title="إضافة شرح جديد من يوتيوب"
            aria-label="أضف شرحاً"
            className="h-10 min-h-[40px] min-w-[40px] sm:h-9 sm:min-h-0 sm:min-w-0 lg:h-9.5 px-2.5 sm:px-3 lg:px-3.5 rounded-xl shrink-0 font-extrabold text-xs whitespace-nowrap bg-accent text-accent-ink shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4 stroke-[2.5] shrink-0 text-accent-ink" />
            <span className="hidden min-[360px]:inline">
              <span className="hidden min-[480px]:inline">أضف </span>شرحاً
            </span>
          </Button>
        </div>
      </div>

      {/* شريط التنقل السريع للأقسام الخمسة الأساسية على الهاتف والأجهزة اللوحية (أقل من lg) */}
      <div className="lg:hidden w-full border-t border-border/60 bg-surface-2/70 backdrop-blur-md px-2 sm:px-4 py-1.5 overflow-x-auto no-scrollbar touch-pan-x">
        <nav
          aria-label="أقسام المنصة الأساسية للهاتف"
          className="flex items-center gap-1 sm:gap-1.5 min-w-max mx-auto justify-start sm:justify-center"
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={`mobile-${tab.id}`}
                type="button"
                onClick={tab.onClick}
                className={`min-h-[40px] px-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring active:scale-95 ${
                  tab.active
                    ? 'bg-accent-soft text-text-heading border-accent shadow-xs'
                    : 'bg-surface text-text-muted border-border/80 hover:text-text-heading hover:border-accent/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${tab.active ? 'text-accent' : 'text-text-muted'}`} />
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* حقل البحث المتجاوب للهواتف */}
      {mobileSearchOpen && (
        <div className="md:hidden px-3 pb-3 pt-1 border-t border-border/50 animate-smooth w-full max-w-full overflow-hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'courses') setView('courses');
              }}
              placeholder="ابحث في الشروحات، الأدوات، الكتب..."
              className="w-full min-h-[40px] h-10 text-xs rounded-xl pl-9 pr-9 bg-surface-2 text-text placeholder:text-text-muted border border-border focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-text-muted hover:text-text-heading"
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
