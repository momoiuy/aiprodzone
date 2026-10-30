import { Menu, X, Home, Wrench, Flame, Sparkles, DollarSign, FileText, Bookmark, Award, Plus, Shield } from 'lucide-react';
import { TOP_DROPDOWN_DATA } from '../data/courses';
import { useLibrary } from '../context/LibraryContext';
import Logo from './Logo';
import Button from './Button';
import Chip from './Chip';

const DROPDOWN_ICONS = {
  أدوات: Wrench,
  رائج: Flame,
  'دورات جديدة': Sparkles,
  'الربح من الإنترنت': DollarSign
};

// Props: { isOpen: boolean, onClose: () => void, view: string, setView: (v: string) => void, selectedCategory: string, onSelectFilter: (cat: string) => void, onOpenBrandModal: () => void, onOpenSubmitModal: () => void, onOpenEbooks: () => void }
export default function Sidebar({
  isOpen,
  onClose,
  view,
  setView,
  selectedCategory,
  onSelectFilter,
  onOpenBrandModal,
  onOpenSubmitModal,
  onOpenEbooks
}) {
  const { courses, watchlistIds, completedIds } = useLibrary();

  const itemBase =
    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring';
  const itemActive = 'bg-accent-soft text-text-heading border-accent shadow-sm';
  const itemInactive = 'bg-surface text-text border-border hover:border-accent hover:text-text-heading';

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] transition-opacity" />
      )}

      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-[288px] border-l border-border bg-surface-2 text-text flex flex-col justify-between transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <Button variant="secondary" onClick={onClose} className="w-9 h-9 p-0" aria-label="إغلاق القائمة">
              <Menu className="w-4 h-4 text-text-muted" />
            </Button>
            <Logo onClick={() => onSelectFilter('الكل')} />
          </div>
          <Button variant="ghost" onClick={onClose} className="w-8 h-8 p-0" aria-label="إغلاق">
            <X className="w-4 h-4 text-text-muted" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-5">
          <div className="space-y-1.5">
            <div className="px-3 py-1 text-[11px] font-extrabold tracking-wider uppercase text-text-muted flex items-center justify-between">
              <span>أقسام القائمة العلوية</span>
              <span>★</span>
            </div>

            <button
              type="button"
              onClick={() => onSelectFilter('الكل')}
              className={`${itemBase} ${selectedCategory === 'الكل' && view === 'courses' ? itemActive : itemInactive}`}
            >
              <div className="flex items-center gap-3">
                <Home className={`w-[18px] h-[18px] shrink-0 ${selectedCategory === 'الكل' && view === 'courses' ? 'text-accent' : 'text-text-muted'}`} />
                <span>الصفحة الرئيسية (كل الشروحات)</span>
              </div>
            </button>

            {TOP_DROPDOWN_DATA.map((item) => {
              const Icon = DROPDOWN_ICONS[item.id] || Sparkles;
              const isActive = selectedCategory === item.id && view === 'courses';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectFilter(item.id)}
                  className={`${itemBase} ${isActive ? itemActive : itemInactive}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  <Chip tone="neutral" className="text-[10px]">{item.badge}</Chip>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border space-y-1.5">
            <div className="px-3 py-1 text-[11px] font-extrabold tracking-wider uppercase text-text-muted">
              المراجع التفاعلية والمكتبة
            </div>

            <button
              type="button"
              onClick={() => { setView('tools'); onClose(); }}
              className={`${itemBase} ${view === 'tools' ? itemActive : itemInactive}`}
            >
              <div className="flex items-center gap-3">
                <Wrench className={`w-[18px] h-[18px] ${view === 'tools' ? 'text-accent' : 'text-text-muted'}`} />
                <span>جدول مقارنة الأدوات الذكية</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { onOpenEbooks(); onClose(); }}
              className={`${itemBase} ${view === 'ebooks' ? itemActive : itemInactive}`}
            >
              <div className="flex items-center gap-3">
                <FileText className={`w-[18px] h-[18px] ${view === 'ebooks' ? 'text-accent' : 'text-text-muted'}`} />
                <span>ملخصات الكتب القابلة للقراءة</span>
              </div>
              <Chip tone="neutral" className="text-[10px]">مجاناً</Chip>
            </button>

            <button
              type="button"
              onClick={() => { setView('watchlist'); onClose(); }}
              className={`${itemBase} ${view === 'watchlist' ? itemActive : itemInactive}`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className={`w-[18px] h-[18px] ${view === 'watchlist' ? 'text-accent' : 'text-text-muted'}`} />
                <span>قائمتي المحفوظة</span>
              </div>
              <Chip tone={watchlistIds.length > 0 ? 'accent' : 'neutral'} className="text-[10px]">
                {watchlistIds.length}
              </Chip>
            </button>

            <a
              href="/admin"
              className={`${itemBase} ${itemInactive}`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-[18px] h-[18px] text-accent" />
                <span>لوحة التحكم والإدارة (/admin)</span>
              </div>
              <Chip tone="accent" className="text-[10px]">إدارة</Chip>
            </a>

            <button
              type="button"
              onClick={() => { onOpenBrandModal(); onClose(); }}
              className={`${itemBase} ${itemInactive}`}
            >
              <div className="flex items-center gap-3">
                <Award className="w-[18px] h-[18px] text-text-muted" />
                <span>عن هوية AIProdZone</span>
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-border space-y-3 shrink-0">
          <div className="p-3 rounded-xl border border-border bg-surface text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold">
              <span>تقدمك في المسارات</span>
              <span className="text-[11px] font-extrabold text-accent">
                {completedIds.length} / {courses.length} مكتمل
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{
                  width: `${courses.length > 0 ? Math.min(100, Math.round((completedIds.length / courses.length) * 100)) : 0}%`
                }}
              />
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => { onClose(); onOpenSubmitModal(); }}
            className="w-full py-2.5 px-4 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5] text-accent-ink" />
            <span>إضافة شرح من يوتيوب</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
