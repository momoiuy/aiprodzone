import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Layers,
  GraduationCap,
  Wrench,
  BookOpen,
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
  const { theme, toggleTheme, watchlistIds } = useLibrary();
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
      label: 'فهرس الشروحات',
      icon: Layers,
      active: view === 'courses' && displayMode === 'grid',
      onClick: () => {
        setView('courses');
        setDisplayMode('grid');
      }
    },
    {
      id: 'roadmap-view',
      label: 'مسارات التعلم',
      icon: GraduationCap,
      active: view === 'courses' && displayMode === 'roadmap',
      onClick: () => {
        setView('courses');
        setDisplayMode('roadmap');
      }
    },
    {
      id: 'tools-view',
      label: 'مقارنة الأدوات',
      icon: Wrench,
      active: view === 'tools',
      onClick: () => setView('tools')
    },
    {
      id: 'ebooks-view',
      label: 'الكتب والأدلة',
      icon: BookOpen,
      active: view === 'ebooks',
      onClick: () => setView('ebooks')
    }
  ];

  return (
    <header dir="ltr" className="sticky top-0 z-40 w-full border-b border-border bg-bg/95 backdrop-blur-md">
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-[68px] flex items-center justify-between gap-2 sm:gap-4">
        {/* الجانب الأيسر: الشعار أولاً ثم زر تصفح الأقسام */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Logo onClick={onResetHome} />

          <div className="hidden sm:block h-5 w-px bg-border shrink-0" aria-hidden="true" />

          <Button
            variant="secondary"
            onClick={onOpenSidebar}
            className="h-9 sm:h-10 px-2.5 sm:px-3 shrink-0 rounded-xl"
            title="تصفح كافة الأقسام التعليمية والمسارات"
            aria-label="تصفح الأقسام"
          >
            <Menu className="w-4 h-4 text-accent shrink-0" />
            <span className="hidden min-[480px]:inline text-xs font-extrabold text-text-heading">
              الأقسام
            </span>
          </Button>
        </div>

        {/* الوسط: التبويبات المنهجية المركزية */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-surface-2 border border-border shrink-0">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                className={`h-8 px-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
                  tab.active
                    ? 'bg-accent-soft text-text-heading border-accent shadow-sm'
                    : 'bg-transparent text-text-muted border-transparent hover:text-text-heading hover:border-accent/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${tab.active ? 'text-accent' : 'text-text-muted'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* الجانب الأيمن: أدوات البحث والمحفوظات والثيم ولوحة التحكم والإضافة */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* حقل البحث الذكي مع شارة الاختصار ⌘K */}
          <div className="relative hidden md:block w-40 lg:w-48 xl:w-60 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-3 pointer-events-none text-text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'courses') setView('courses');
              }}
              placeholder="ابحث في المنصة..."
              className="w-full h-10 text-xs rounded-xl pl-9 pr-12 bg-surface-2 text-text placeholder:text-text-muted border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-3 text-text-muted hover:text-text-heading"
                aria-label="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden xl:inline-flex items-center absolute right-2.5 top-2.5 px-1.5 py-0.5 rounded border border-border bg-surface text-[10px] font-mono text-text-muted pointer-events-none select-none">
                ⌘K
              </kbd>
            )}
          </div>

          {/* زر فتح البحث في الهواتف */}
          <Button
            variant="secondary"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 p-0 shrink-0 rounded-xl"
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
            className={`relative h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring shrink-0 ${
              view === 'watchlist'
                ? 'bg-accent-soft text-text-heading border-accent shadow-sm'
                : 'bg-surface-2 text-text border-border hover:border-accent hover:text-text-heading'
            }`}
          >
            <Bookmark className={`w-4 h-4 shrink-0 ${view === 'watchlist' ? 'text-accent fill-accent/20' : 'text-text-muted'}`} />
            <span className="hidden xl:inline text-xs font-bold">المحفوظات</span>
            {watchlistIds.length > 0 && (
              <span
                suppressHydrationWarning
                className="px-1.5 py-0.2 rounded-full bg-accent text-accent-ink text-[10px] font-extrabold shrink-0"
              >
                {watchlistIds.length}
              </span>
            )}
          </button>

          {/* زر تبديل الثيم الأيقوني الأنيق */}
          <button
            type="button"
            onClick={toggleTheme}
            suppressHydrationWarning
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border bg-surface-2 hover:border-accent text-text flex items-center justify-center shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title={theme === 'dark' ? 'التحويل للوضع النهاري (الفاتح)' : 'التحويل للوضع الليلي (الداكن)'}
            aria-label="تبديل الثيم"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-accent transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-text-muted transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* زر لوحة التحكم للمشرف */}
          <a
            href="/admin"
            className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-border bg-surface-2 hover:border-accent text-text text-xs font-bold inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring shrink-0"
            title="لوحة تحكم المشرف (إدارة الأقسام والدروس والكتب)"
          >
            <Shield className="w-4 h-4 text-accent shrink-0" />
            <span className="hidden xl:inline whitespace-nowrap">لوحة التحكم</span>
          </a>

          {/* زر إضافة شرح جديد */}
          <Button
            variant="primary"
            onClick={onOpenSubmitModal}
            title="إضافة شرح جديد"
            className="h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl shrink-0 font-extrabold text-xs whitespace-nowrap bg-accent text-accent-ink shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 stroke-[2.5] shrink-0 text-accent-ink" />
            <span className="hidden sm:inline">أضف شرحاً</span>
          </Button>
        </div>
      </div>

      {/* حقل البحث المتجاوب للهواتف */}
      {mobileSearchOpen && (
        <div className="md:hidden px-3 pb-3 pt-1 border-t border-border/50 animate-smooth">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'courses') setView('courses');
              }}
              placeholder="ابحث في الشروحات، الأدوات، الكتب..."
              className="w-full h-9 text-xs rounded-xl pl-9 pr-9 bg-surface-2 text-text placeholder:text-text-muted border border-border focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-text-muted hover:text-text-heading"
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
