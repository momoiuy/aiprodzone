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
      active: view === 'courses' && displayMode === 'roadmap',
      onClick: () => {
        setView('courses');
        setDisplayMode('roadmap');
      }
    },
    {
      id: 'tools-view',
      fullLabel: 'مقارنة الأدوات',
      shortLabel: 'الأدوات',
      icon: Wrench,
      active: view === 'tools',
      onClick: () => setView('tools')
    },
    {
      id: 'ebooks-view',
      fullLabel: 'الكتب والأدلة',
      shortLabel: 'الكتب',
      icon: BookOpen,
      active: view === 'ebooks',
      onClick: () => setView('ebooks')
    }
  ];

  return (
    <header dir="ltr" className="sticky top-0 z-40 w-full border-b border-border bg-bg/95 backdrop-blur-md">
      <div className="max-w-7xl w-full mx-auto px-2.5 sm:px-4 lg:px-5 xl:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 lg:gap-2 xl:gap-3">
        {/* الجانب الأيسر: الشعار أولاً ثم زر تصفح الأقسام */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Logo onClick={onResetHome} />

          <div className="hidden sm:block h-4 sm:h-5 w-px bg-border shrink-0" aria-hidden="true" />

          <Button
            variant="secondary"
            onClick={onOpenSidebar}
            className="h-8 sm:h-9 px-2 sm:px-2.5 xl:px-3 shrink-0 rounded-xl text-xs"
            title="تصفح كافة الأقسام التعليمية والمسارات"
            aria-label="تصفح الأقسام"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
            <span className="hidden min-[480px]:inline text-xs font-extrabold text-text-heading">
              الأقسام
            </span>
          </Button>
        </div>

        {/* الوسط: التبويبات المنهجية المركزية بتجاوب ذكي وجماليات دقيقة */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-0.5 xl:p-1 rounded-2xl bg-surface-2 border border-border shrink-0">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                className={`h-7 sm:h-8 px-1.5 xl:px-3 rounded-xl text-xs font-extrabold flex items-center gap-1 xl:gap-1.5 transition-all whitespace-nowrap border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
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
        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
          {/* حقل البحث الذكي مع شارة الاختصار ⌘K */}
          <div className="relative hidden md:block w-28 lg:w-28 xl:w-40 2xl:w-52 shrink-0 transition-all duration-300 focus-within:w-36 lg:focus-within:w-40 xl:focus-within:w-48 2xl:focus-within:w-60">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-2.5 sm:top-3 pointer-events-none text-text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'courses') setView('courses');
              }}
              placeholder="ابحث..."
              className="w-full h-8 sm:h-9 text-xs rounded-xl pl-8 sm:pl-9 pr-6 xl:pr-11 bg-surface-2 text-text placeholder:text-text-muted border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 sm:top-2.5 text-text-muted hover:text-text-heading"
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
            className="md:hidden w-8 h-8 sm:w-9 sm:h-9 p-0 shrink-0 rounded-xl"
            aria-label="بحث في الشروحات"
          >
            <Search className="w-3.5 h-3.5 text-text-muted" />
          </Button>

          {/* زر شروحاتي المحفوظة مع العداد الحي (يظهر من شاشات xl فما فوق لضمان أقصى مساحة حرة للمشرف والإضافة) */}
          <button
            type="button"
            onClick={() => setView('watchlist')}
            title="شروحاتي وقائمتي المحفوظة"
            aria-label="شروحاتي المحفوظة"
            className={`relative hidden xl:inline-flex h-8 sm:h-9 lg:h-10 px-2 sm:px-2.5 lg:px-3 rounded-xl border items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring shrink-0 ${
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

          {/* زر تبديل الثيم الأيقوني الأنيق */}
          <button
            type="button"
            onClick={toggleTheme}
            suppressHydrationWarning
            className="w-8 h-8 sm:w-9 sm:h-9 lg:h-10 lg:w-10 rounded-xl border border-border bg-surface-2 hover:border-accent text-text flex items-center justify-center shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title={theme === 'dark' ? 'التحويل للوضع النهاري (الفاتح)' : 'التحويل للوضع الليلي (الداكن)'}
            aria-label="تبديل الثيم"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-muted transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* زر لوحة التحكم للمشرف - تصميم فاخر ومميز بهوية زمردية بارزة دائماً */}
          <a
            href="/admin"
            className="h-8 sm:h-9 lg:h-10 px-2 sm:px-2.5 lg:px-3 rounded-xl border border-accent/40 bg-accent/10 hover:bg-accent/20 hover:border-accent text-accent text-xs font-extrabold inline-flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            title="لوحة تحكم المشرف (إدارة الأقسام والدروس والكتب)"
            aria-label="لوحة تحكم المشرف"
          >
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
            <span className="hidden md:inline whitespace-nowrap text-xs font-extrabold text-accent">
              لوحة التحكم
            </span>
          </a>

          {/* زر إضافة شرح جديد - زر الإجراء الأساسي البارز دائماً */}
          <Button
            variant="primary"
            onClick={onOpenSubmitModal}
            title="إضافة شرح جديد من يوتيوب"
            aria-label="أضف شرحاً"
            className="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-3.5 rounded-xl shrink-0 font-extrabold text-xs whitespace-nowrap bg-accent text-accent-ink shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0 text-accent-ink" />
            <span className="hidden min-[360px]:inline">
              <span className="hidden min-[480px]:inline">أضف </span>شرحاً
            </span>
          </Button>
        </div>
      </div>

      {/* حقل البحث المتجاوب للهواتف */}
      {mobileSearchOpen && (
        <div className="md:hidden px-3 pb-3 pt-1 border-t border-border/50 animate-smooth">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-muted pointer-events-none" />
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
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
