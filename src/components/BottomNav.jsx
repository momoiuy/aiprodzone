import { Home, GraduationCap, Newspaper, Wrench, Bookmark } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

// Props: { view: string, setView: (v: string) => void, displayMode: string, setDisplayMode: (m: string) => void }
export default function BottomNav({ view, setView, displayMode, setDisplayMode }) {
  const { watchlistIds } = useLibrary();

  const isGridActive = view === 'courses' && displayMode === 'grid';
  const isRoadmapActive = view === 'courses' && (displayMode === 'roadmap' || displayMode === 'grouped');
  const isArticlesActive = view === 'articles';
  const isToolsActive = view === 'tools';
  const isWatchlistActive = view === 'watchlist';

  const navItems = [
    {
      id: 'grid',
      label: 'الشروحات',
      icon: Home,
      active: isGridActive,
      onClick: () => {
        setView('courses');
        setDisplayMode('grid');
      }
    },
    {
      id: 'roadmap',
      label: 'المسارات',
      icon: GraduationCap,
      active: isRoadmapActive,
      onClick: () => {
        setView('courses');
        setDisplayMode('grouped');
      }
    },
    {
      id: 'articles',
      label: 'المقالات',
      icon: Newspaper,
      active: isArticlesActive,
      onClick: () => setView('articles')
    },
    {
      id: 'tools',
      label: 'الأدوات',
      icon: Wrench,
      active: isToolsActive,
      onClick: () => setView('tools')
    },
    {
      id: 'watchlist',
      label: `محفوظاتي${watchlistIds.length > 0 ? ` (${watchlistIds.length})` : ''}`,
      icon: Bookmark,
      active: isWatchlistActive,
      onClick: () => setView('watchlist')
    }
  ];

  return (
    <nav
      aria-label="التنقل السفلي للهواتف"
      className="md:hidden fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-2.5 right-2.5 z-40 rounded-2xl border border-border bg-surface/95 shadow-2xl backdrop-blur-md px-1.5 py-1.5 flex items-center justify-around"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 min-h-[44px] py-1.5 px-1 rounded-xl text-[10px] font-extrabold transition-all select-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
              item.active
                ? 'bg-accent-soft border-accent text-text-heading shadow-sm'
                : 'bg-transparent border-transparent text-text-muted hover:text-text-heading'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-accent' : 'text-text-muted'}`} />
            <span suppressHydrationWarning className="truncate max-w-full">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
