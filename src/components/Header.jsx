import { useState } from 'react';
import { Menu, Layers, GraduationCap, Wrench, Bookmark, Search, X, Sun, Moon, Plus, Shield } from 'lucide-react';
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

  const navTabs = [
    {
      id: 'grid-view',
      label: 'فهرس الشروحات',
      icon: Layers,
      active: view === 'courses' && displayMode === 'grid',
      onClick: () => { setView('courses'); setDisplayMode('grid'); }
    },
    {
      id: 'roadmap-view',
      label: 'مسارات التعلم',
      icon: GraduationCap,
      active: view === 'courses' && displayMode === 'roadmap',
      onClick: () => { setView('courses'); setDisplayMode('roadmap'); }
    },
    {
      id: 'tools-view',
      label: 'مقارنة الأدوات',
      icon: Wrench,
      active: view === 'tools',
      onClick: () => setView('tools')
    },
    {
      id: 'watchlist-view',
      label: `محفوظاتي (${watchlistIds.length})`,
      icon: Bookmark,
      active: view === 'watchlist',
      onClick: () => setView('watchlist')
    }
  ];

  return (
    <header dir="ltr" className="sticky top-0 z-40 w-full border-b border-border bg-bg/95 backdrop-blur-md">
      <div className="max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-[68px] flex items-center justify-between gap-1.5 sm:gap-3">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
          <Button
            variant="secondary"
            onClick={onOpenSidebar}
            className="h-9 sm:h-10 px-2 sm:px-3 shrink-0"
            title="فتح القائمة العلوية (أدوات، رائج، دورات جديدة، الربح من الإنترنت)"
            aria-label="فتح القائمة العلوية"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted" />
            <span className="hidden min-[400px]:inline text-[11px] sm:text-xs font-extrabold text-text-heading">
              القائمة
            </span>
          </Button>
          <Logo onClick={onResetHome} />
        </div>

        <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-surface-2 border border-border">
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
                <span suppressHydrationWarning>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="relative hidden lg:block w-52 xl:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 pointer-events-none text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'courses') setView('courses');
              }}
              placeholder="ابحث عن شرح، Veo 3، بايثون..."
              className="w-full h-10 text-xs rounded-xl pl-9 pr-7 bg-surface-2 text-text placeholder:text-text-muted border border-border hover:border-accent focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-3 text-text-muted hover:text-text-heading"
                aria-label="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="secondary"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 p-0 shrink-0"
            aria-label="بحث في الشروحات"
          >
            <Search className="w-4 h-4 text-text-muted" />
          </Button>

          <Button
            variant="secondary"
            onClick={toggleTheme}
            suppressHydrationWarning
            className="w-9 h-9 sm:w-auto sm:h-10 p-0 sm:px-3 shrink-0"
            title={theme === 'dark' ? 'التبديل إلى الوضع النهاري الدافئ' : 'التبديل إلى الوضع الليلي المريح'}
            aria-label="تبديل مظهر الموقع"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 shrink-0 text-text-muted" />
                <span suppressHydrationWarning className="hidden sm:inline">نهاري</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 shrink-0 text-text-muted" />
                <span suppressHydrationWarning className="hidden sm:inline">ليلي</span>
              </>
            )}
          </Button>

          <a
            href="/admin"
            className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border border-border bg-surface-2 hover:border-accent text-text text-xs font-bold inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring shrink-0"
            title="لوحة تحكم المشرف (إدارة الأقسام والدروس والكتب)"
          >
            <Shield className="w-4 h-4 text-accent shrink-0" />
            <span className="hidden min-[500px]:inline">لوحة التحكم</span>
          </a>

          <Button
            variant="primary"
            onClick={onOpenSubmitModal}
            title="إضافة شرح جديد"
            className="h-9 sm:h-10 px-2.5 sm:px-3.5 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5] shrink-0 text-accent-ink" />
            <span className="hidden sm:inline">أضف شرحاً</span>
          </Button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="lg:hidden px-3 pb-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-text-muted" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'courses') setView('courses');
              }}
              placeholder="ابحث عن صناعة الفيديو، بايثون، ChatGPT، كتب إلكترونية..."
              className="w-full h-9 text-xs rounded-xl pl-10 pr-9 bg-surface-2 text-text placeholder:text-text-muted border border-border focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
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
