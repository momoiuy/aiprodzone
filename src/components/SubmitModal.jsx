import { useState, useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { parseYouTubeUrl } from '../lib/youtube';
import { useLibrary } from '../context/LibraryContext';
import Card from './Card';
import Chip from './Chip';
import Button from './Button';

const fieldClass =
  'w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text placeholder:text-text-muted focus:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring';

// Props: { isOpen: boolean, onClose: () => void, onCourseCreated: (courseId: string) => void }
export default function SubmitModal({ isOpen, onClose, onCourseCreated }) {
  const { addCourse, categories } = useLibrary();

  const [ytInput, setYtInput] = useState('');
  const [ytError, setYtError] = useState('');
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState(
    categories?.[0]?.name || 'صناعة الأفلام والفيديو السينمائي (AI Filmmaking)'
  );
  const [newCourseLevel, setNewCourseLevel] = useState('المستوى التأسيسي (مبتدئ)');
  const [newCourseTool, setNewCourseTool] = useState('أداة ذكاء اصطناعي');
  const [newCourseSynopsis, setNewCourseSynopsis] = useState('');

  useEffect(() => {
    if (categories?.length > 0 && !categories.some(c => c.name === newCourseCategory)) {
      setNewCourseCategory(categories[0].name);
    }
  }, [categories, newCourseCategory]);

  if (!isOpen) return null;

  const fetchMetadata = async (url) => {
    const targetUrl = url || ytInput;
    const vId = parseYouTubeUrl(targetUrl);
    if (!vId) {
      setYtError('يرجى إدخال رابط يوتيوب صالح أولاً');
      return;
    }
    setFetchingMeta(true);
    setYtError('');
    try {
      const res = await fetch(`/api/youtube/metadata?url=${encodeURIComponent(targetUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) setNewCourseTitle(data.title);
        if (data.author_name) setNewCourseInstructor(data.author_name);
      } else {
        const err = await res.json().catch(() => ({}));
        setYtError(err.error || 'تعذر جلب البيانات من يوتيوب');
      }
    } catch {
      setYtError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleUrlChange = (val) => {
    setYtInput(val);
    setYtError('');
    const vId = parseYouTubeUrl(val);
    if (vId && val.length > 15) {
      fetchMetadata(val);
    }
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const ytId = extractYouTubeId(ytInput);
    if (!ytId) {
      setYtError('رابط يوتيوب غير صالح. يرجى إدخال رابط صحيح (watch?v= أو youtu.be أو embed أو shorts أو live).');
      return;
    }
    setYtError('');

    const createdId = 'custom-' + Date.now();
    addCourse({
      id: createdId,
      youtubeId: ytId,
      title: newCourseTitle.trim(),
      instructor: newCourseInstructor.trim() || 'محاضر معتمد في AIProdZone',
      verified: true,
      runtime: '14:36',
      viewsCount: 0,
      year: '2026',
      category: newCourseCategory,
      level: newCourseLevel,
      qualityBadge: 'مضاف حديثاً ★',
      trending: true,
      isNewCourse: true,
      isToolGuide: true,
      isMonetization: newCourseCategory === 'كتب إلكترونية',
      primaryTool: newCourseTool,
      toolsSummary: `${newCourseTool} • تطبيق عملي`,
      featured: false,
      thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      scores: { depth: 9.5, practical: 9.6, freshness: 9.8, production: 9.3 },
      techStack: [
        { role: 'الأداة الرئيسية المشروحة', name: newCourseTool },
        { role: 'منهجية التعلم', name: newCourseLevel }
      ],
      oneLineVerdict: 'شرح مضاف حديثاً إلى فهرس AIProdZone بعد مراجعة جودته وترتيبه ضمن المسار التعليمي.',
      synopsis: newCourseSynopsis.trim() || 'درس تطبيقي منتقى بعناية من يوتيوب ومصنف ضمن مسارات التعلم المجانية على منصة AIProdZone.',
      timestamps: [
        { time: '00:00', label: 'مقدمة الدرس واستعراض النتيجة النهائية' },
        { time: '03:15', label: 'الدخول إلى الأداة وشرح الواجهة خطوة بخطوة' },
        { time: '08:40', label: 'التطبيق العملي وتصدير المشروع النهائي' }
      ],
      review: {
        verdictBox: 'تمت إضافة هذا الشرح وتصنيفه ضمن مسارات AIProdZone ليقدم خطوات عملية مباشرة خالية من الحشو.',
        strengths: 'وضوح في الشرح وتطبيق مباشر أمام المشاهد.',
        limitations: 'ينصح بتطبيق الخطوات بالتوازي مع المشاهدة.',
        deepAnalysis: 'يعتبر هذا الشرح إضافة قوية لمسار التعلم، حيث يربط بين الفهم النظري والتطبيق الفوري باستخدام أحدث الأدوات المجانية.'
      },
      promptBlueprint: 'قم بتطبيق الخطوات المشروحة في الفيديو مع تخصيص الأمر التالي لمشروعك: [حدد الهدف + الأداة + شكل المخرج النهائي].',
      comments: []
    });

    setYtInput('');
    setYtError('');
    setNewCourseTitle('');
    onClose();
    onCourseCreated(createdId);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 animate-smooth"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="w-[calc(100vw-1.5rem)] sm:w-full sm:max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <Chip tone="accent" className="mb-1">إدارة محتوى المنصة</Chip>
            <h2 className="text-lg font-extrabold text-text-heading">إضافة شرح أو دورة جديدة من يوتيوب</h2>
          </div>
          <Button variant="ghost" onClick={onClose} className="p-1.5">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleCreateCourse} className="space-y-3.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-heading">رابط فيديو يوتيوب (يتم الجلب التلقائي فور اللصق)</label>
              {fetchingMeta && (
                <span className="text-[11px] font-bold text-accent flex items-center gap-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  جاري جلب العنوان والقناة...
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                dir="ltr"
                value={ytInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`${fieldClass} flex-1 ${ytError ? 'border-red-400' : ''}`}
              />
              <Button
                variant="secondary"
                type="button"
                disabled={fetchingMeta}
                onClick={() => fetchMetadata(ytInput)}
                className="shrink-0 flex items-center gap-1.5"
              >
                {fetchingMeta ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-accent" />}
                <span>جلب ذكي</span>
              </Button>
            </div>
            {ytError && <p className="text-[11px] font-bold text-red-400 pt-1" role="alert">{ytError}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-heading">عنوان الشرح *</label>
              <input
                type="text"
                required
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                placeholder="مثال: شرح عمل فيديو بالذكاء الاصطناعي..."
                className={fieldClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-heading">اسم القناة / المحاضر</label>
              <input
                type="text"
                value={newCourseInstructor}
                onChange={(e) => setNewCourseInstructor(e.target.value)}
                placeholder="مثال: قناة تريكات التقنية"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-heading">المجال الأكاديمي (من الأقسام الـ 8)</label>
              <select value={newCourseCategory} onChange={(e) => setNewCourseCategory(e.target.value)} className={fieldClass}>
                {(categories || []).map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name} className="bg-surface text-text">
                    #{cat.orderIndex} - {cat.shortName || cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-heading">المستوى في المسار</label>
              <select value={newCourseLevel} onChange={(e) => setNewCourseLevel(e.target.value)} className={fieldClass}>
                {['المستوى التأسيسي (مبتدئ)', 'المستوى التطبيقي (متوسط)', 'المستوى المتقدم (احترافي)'].map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-surface text-text">{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-heading">ملخص الشرح ولماذا تم اختياره</label>
            <textarea
              rows={3}
              value={newCourseSynopsis}
              onChange={(e) => setNewCourseSynopsis(e.target.value)}
              placeholder="اكتب نبذة مختصرة عن أهم النقاط والأدوات المشروحة في الفيديو..."
              className={`${fieldClass} p-3`}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">إلغاء</Button>
            <Button variant="primary" type="submit" className="w-full sm:w-auto px-5">نشر في AIProdZone</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
