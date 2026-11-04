'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Layers,
  GraduationCap,
  BookOpen,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Video,
  ArrowRight,
  Sun,
  Moon,
  Newspaper,
  Search
} from 'lucide-react';
import { LibraryProvider, useLibrary } from '@/src/context/LibraryContext';
import { INITIAL_COURSES } from '@/src/data/courses';
import { EBOOK_GUIDES } from '@/src/data/ebooks';
import { INITIAL_ARTICLES } from '@/src/data/articles';
import { parseYouTubeUrl, handleThumbnailError } from '@/src/lib/youtube';
import { ARTICLE_CATEGORIES } from '@/src/data/articles';
import Card from '@/src/components/Card';
import Chip from '@/src/components/Chip';
import Button from '@/src/components/Button';
import Logo from '@/src/components/Logo';
import BackupRestoreSection from '@/src/components/BackupRestoreSection';

function AdminDashboardContent() {
  const libraryContext = useLibrary() as any;
  const {
    theme,
    toggleTheme,
    mounted,
    categories = [],
    courses = [],
    ebooks = [],
    articles = [],
    addCourse,
    updateCourse,
    deleteCourse,
    reorderCourse,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategory,
    addEbook,
    updateEbook,
    deleteEbook,
    reorderEbook,
    addArticle,
    updateArticle,
    deleteArticle,
    resetToSeedData
  } = libraryContext;

  const [activeTab, setActiveTab] = useState<'lessons' | 'sections' | 'ebooks' | 'articles'>('lessons');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const totalArticles = articles.length;

  // حالة تحرير وإضافة المقالات التقنية
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    subtitle: '',
    category: ARTICLE_CATEGORIES[1] || 'الويب والبرمجة',
    author: 'م. سيف الرحمن الهاشمي',
    authorRole: 'كبير مهندسي البرمجيات والذكاء الاصطناعي',
    readTime: '8 دقائق قراءة',
    featured: false,
    summary: '',
    keyTakeawaysText: '',
    tagsText: '',
    relatedCourseIdsText: '',
    sectionsText: ''
  });

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim()) return;

    const tags = articleForm.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const keyTakeaways = articleForm.keyTakeawaysText
      .split('\n')
      .map((k) => k.trim())
      .filter(Boolean);

    const relatedCourseIds = articleForm.relatedCourseIdsText
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    const rawSections = articleForm.sectionsText.trim();
    const sections = rawSections
      ? rawSections.split('\n\n').map((secBlock, idx) => {
          const lines = secBlock.split('\n');
          const heading = lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : `الفصل ${idx + 1}`;
          const body = lines.slice(lines[0].startsWith('#') ? 1 : 0).join('\n').trim();
          return { heading, body: body || heading };
        })
      : editingArticle?.sections || [
          { heading: '1. مقدمة المحور', body: articleForm.summary }
        ];

    const articlePayload = {
      title: articleForm.title.trim(),
      subtitle: articleForm.subtitle.trim(),
      category: articleForm.category,
      author: articleForm.author.trim(),
      authorRole: articleForm.authorRole.trim(),
      readTime: articleForm.readTime.trim(),
      featured: articleForm.featured,
      summary: articleForm.summary.trim(),
      tags,
      keyTakeaways,
      relatedCourseIds,
      sections
    };

    if (editingArticle) {
      updateArticle(editingArticle.id, articlePayload);
    } else {
      addArticle({
        ...articlePayload,
        slug: articleForm.title.trim().toLowerCase().replace(/\s+/g, '-')
      });
    }

    setShowAddArticleModal(false);
    setEditingArticle(null);
  };
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('الكل');

  // حالة إضافة درس جديد مع الجلب التلقائي من يوتيوب
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [ytUrl, setYtUrl] = useState('');
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState('');
  const [courseForm, setCourseForm] = useState({
    title: '',
    instructor: '',
    category: categories?.[0]?.name || 'صناعة الأفلام والفيديو السينمائي (AI Filmmaking)',
    orderIndex: 1,
    level: 'المستوى التأسيسي (مبتدئ)',
    qualityBadge: 'مضاف حديثاً ★',
    primaryTool: 'Kling & Runway',
    runtime: '15:00',
    synopsis: '',
    videoId: '',
    thumbnail: ''
  });

  // حالة تحرير الأقسام
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    shortName: '',
    description: '',
    badge: 'جديد'
  });

  // حالة تحرير الكتب
  const [showAddEbookModal, setShowAddEbookModal] = useState(false);
  const [editingEbook, setEditingEbook] = useState<any>(null);
  const [ebookForm, setEbookForm] = useState({
    title: '',
    category: categories?.[0]?.name || '',
    author: 'فريق AIProdZone',
    pages: '40 صفحة مركزة',
    downloadUrl: '',
    remoteCoverUrl: '',
    provider: '',
    excerpt: '',
    content: ''
  });

  // حالة إعادة التحقق وإفراغ كاش Vercel
  const [revalidating, setRevalidating] = useState(false);
  const [revalidateStatus, setRevalidateStatus] = useState<string | null>(null);

  // دالة الجلب التلقائي لبيانات يوتيوب فور لصق الرابط
  const handleFetchYoutubeMeta = async (url: string) => {
    setYtUrl(url);
    setYtError('');
    const extractedId = parseYouTubeUrl(url);
    if (!extractedId) {
      if (url.trim().length > 10) {
        setYtError('رابط يوتيوب غير صالح');
      }
      return;
    }

    setYtLoading(true);
    try {
      const res = await fetch(`/api/youtube/metadata?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        setCourseForm((prev) => ({
          ...prev,
          videoId: data.videoId,
          title: data.title || prev.title,
          instructor: data.author_name || prev.instructor,
          thumbnail: data.thumbnail
        }));
      } else {
        const err = await res.json().catch(() => ({}));
        setYtError(err.error || 'تعذر جلب بيانات يوتيوب');
      }
    } catch {
      setYtError('فشل الاتصال بنقطة الجلب التلقائي');
    } finally {
      setYtLoading(false);
    }
  };

  // استدعاء إعادة التحقق الفوري على Vercel
  const handleRevalidateVercel = async () => {
    setRevalidating(true);
    setRevalidateStatus(null);
    try {
      const res = await fetch('/api/revalidate', { method: 'POST' });
      if (res.ok) {
        setRevalidateStatus('✓ تم تحديث وإفراغ كاش Vercel بنجاح (revalidatePath)');
      } else {
        setRevalidateStatus('❌ تعذر إفراغ الكاش');
      }
    } catch {
      setRevalidateStatus('❌ خطأ في الاتصال بالخادم');
    } finally {
      setRevalidating(false);
      setTimeout(() => setRevalidateStatus(null), 4000);
    }
  };

  // حفظ أو تعديل دورة
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.videoId.trim()) {
      setYtError('يرجى التأكد من إدخال الرابط والعنوان بشكل صحيح');
      return;
    }

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        title: courseForm.title,
        instructor: courseForm.instructor,
        category: courseForm.category,
        orderIndex: Number(courseForm.orderIndex),
        rankOrder: Number(courseForm.orderIndex),
        level: courseForm.level,
        primaryTool: courseForm.primaryTool,
        runtime: courseForm.runtime,
        synopsis: courseForm.synopsis,
        youtubeId: courseForm.videoId,
        youtubeVideoId: courseForm.videoId,
        thumbnail: courseForm.thumbnail || `https://i.ytimg.com/vi/${courseForm.videoId}/maxresdefault.jpg`
      });
      setEditingCourse(null);
    } else {
      addCourse({
        title: courseForm.title,
        instructor: courseForm.instructor,
        category: courseForm.category,
        orderIndex: Number(courseForm.orderIndex),
        rankOrder: Number(courseForm.orderIndex),
        level: courseForm.level,
        qualityBadge: courseForm.qualityBadge,
        primaryTool: courseForm.primaryTool,
        runtime: courseForm.runtime,
        synopsis: courseForm.synopsis,
        youtubeId: courseForm.videoId,
        youtubeVideoId: courseForm.videoId,
        thumbnail: courseForm.thumbnail || `https://i.ytimg.com/vi/${courseForm.videoId}/maxresdefault.jpg`,
        viewsCount: 0,
        year: '2026',
        trending: true,
        isNewCourse: true,
        isToolGuide: true,
        scores: { depth: 9.6, practical: 9.7, freshness: 9.8, production: 9.5 },
        techStack: [
          { role: 'الأداة الرئيسية', name: courseForm.primaryTool },
          { role: 'القسم التعليمي', name: courseForm.category }
        ],
        oneLineVerdict: 'درس جديد مضاف عبر لوحة التحكم ومراجع بدقة.',
        review: {
          verdictBox: 'تمت إضافة هذا الدرس وتصنيفه للمسار التعليمي المعني.',
          strengths: 'تطبيق مباشر وأدوات حديثة.',
          limitations: 'ينصح بالتطبيق العملي المتزامن.',
          deepAnalysis: 'إضافة قيّمة لمحتوى المنصة.'
        },
        comments: []
      });
    }

    setShowAddCourseModal(false);
    setYtUrl('');
  };

  // تصفية الدروس المعروضة
  const filteredCourses = (courses as any[]).filter((c: any) => {
    if (selectedSectionFilter === 'الكل') return true;
    return c.category === selectedSectionFilter;
  });

  return (
    <div dir="ltr" className="min-h-screen w-full max-w-full overflow-x-hidden bg-bg text-text font-arabic antialiased pb-12 transition-colors duration-300">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-bg/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo onClick={() => {}} />
            </Link>
            <div className="h-5 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
              <Shield className="w-4 h-4" />
              <span>لوحة التحكم الفورية (/admin)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleRevalidateVercel}
              disabled={revalidating}
              className="text-xs py-2 px-3 flex items-center gap-1.5"
              title="إعادة بناء وتحديث كاش Vercel فوراً"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${revalidating ? 'animate-spin text-accent' : 'text-text-muted'}`} />
              <span className="hidden sm:inline">إفراغ كاش Vercel</span>
            </Button>

            <Button
              variant="secondary"
              onClick={toggleTheme}
              className="w-9 h-9 p-0 shrink-0"
              aria-label="تبديل المظهر"
            >
              {mounted && theme === 'light' ? <Moon className="w-4 h-4 text-text-muted" /> : <Sun className="w-4 h-4 text-text-muted" />}
            </Button>

            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-accent text-accent-ink hover:opacity-90 inline-flex items-center gap-1.5 transition-opacity"
            >
              <span>معاينة المنصة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* إشعار حالة Revalidate */}
        {revalidateStatus && (
          <div className="p-3.5 rounded-xl border border-accent bg-accent-soft text-text-heading text-xs font-bold flex items-center justify-between animate-smooth">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>{revalidateStatus}</span>
            </div>
            <Chip tone="accent">تحديث لحظي</Chip>
          </div>
        )}

        {/* إحصائيات سريعة للبيانات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-text-muted font-bold">الأقسام التعليمية الحالية</span>
              <h3 className="text-2xl font-black text-text-heading">{categories.length} أقسام</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-text-muted font-bold">الدروس وشروحات يوتيوب</span>
              <h3 className="text-2xl font-black text-text-heading">{courses.length} درساً حقيقياً</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-text-muted font-bold">الكتب والأدلة المرافقة</span>
              <h3 className="text-2xl font-black text-text-heading">{ebooks.length} دليلاً إلكترونياً</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-text-muted font-bold">المقالات التقنية والأكاديمية</span>
              <h3 className="text-2xl font-black text-text-heading">{articles.length} مقالات</h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* قسم النسخ الاحتياطي ونقل التقدم للمتعلم والمشرف */}
        <BackupRestoreSection />

        {/* أزرار التبويب */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-surface-2 border border-border">
            <button
              type="button"
              onClick={() => setActiveTab('lessons')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'lessons'
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>إدارة الدروس والفيديوهات ({courses.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'sections'
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>إدارة الأقسام الـ 10 ({categories.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ebooks')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'ebooks'
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>الكتب والأدلة المرافقة ({ebooks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'articles'
                  ? 'bg-accent text-accent-ink shadow-sm'
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>إدارة المقالات التقنية ({articles.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة البيانات إلى بيانات الـ 10 أقسام الأصلية؟')) {
                  resetToSeedData();
                  handleRevalidateVercel();
                }
              }}
              className="text-xs py-2 px-3 text-text-muted hover:text-red-400"
              title="إعادة تعيين إلى بيانات الـ 10 أقسام المغذاة الأصلية"
            >
              إعادة التعيين للأصل (Seed)
            </Button>
          </div>
        </div>

        {/* ==================== تبويب 1: إدارة الدروس والفيديوهات ==================== */}
        {activeTab === 'lessons' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-text-muted">تصفية حسب القسم:</span>
                <select
                  value={selectedSectionFilter}
                  onChange={(e) => setSelectedSectionFilter(e.target.value)}
                  className="text-xs font-bold rounded-xl px-3 py-2 bg-surface text-text border border-border focus:border-accent"
                >
                  <option value="الكل">جميع الأقسام ({courses.length})</option>
                  {(categories as any[]).map((c: any) => (
                    <option key={c.id || c.name} value={c.name}>
                      #{c.orderIndex} - {c.shortName || c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({
                    title: '',
                    instructor: '',
                    category: selectedSectionFilter !== 'الكل' ? selectedSectionFilter : (categories?.[0]?.name || ''),
                    orderIndex: courses.length + 1,
                    level: 'المستوى التأسيسي (مبتدئ)',
                    qualityBadge: 'مضاف حديثاً ★',
                    primaryTool: 'Kling & Runway',
                    runtime: '15:00',
                    synopsis: '',
                    videoId: '',
                    thumbnail: ''
                  });
                  setYtUrl('');
                  setShowAddCourseModal(true);
                }}
                className="py-2.5 px-4 text-xs font-extrabold flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>إضافة درس جديد مع الجلب التلقائي</span>
              </Button>
            </div>

            {/* جدول / قائمة الدروس */}
            <div className="space-y-3">
              {(filteredCourses as any[]).map((course: any) => {
                const vid = course.youtubeVideoId || course.youtubeId;
                return (
                  <Card key={course.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* أزرار الترتيب لأعلى وأسفل */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => reorderCourse(course.id, 'up')}
                          className="w-7 h-7 rounded-lg border border-border bg-surface-2 hover:border-accent flex items-center justify-center transition-colors text-text-muted hover:text-text-heading"
                          title="تحريك لأعلى"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-mono font-extrabold text-accent">
                          #{course.orderIndex || course.rankOrder || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => reorderCourse(course.id, 'down')}
                          className="w-7 h-7 rounded-lg border border-border bg-surface-2 hover:border-accent flex items-center justify-center transition-colors text-text-muted hover:text-text-heading"
                          title="تحريك لأسفل"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* الصورة المصغرة */}
                      <div className="relative w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-surface-2 shrink-0 border border-border">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          onError={handleThumbnailError}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[9px]">
                          {course.runtime}
                        </span>
                      </div>

                      {/* التفاصيل */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <Chip tone="accent">الترتيب #{course.orderIndex || course.rankOrder}</Chip>
                          <Chip tone="neutral">{course.category}</Chip>
                          <span className="text-text-muted font-bold font-mono">ID: {vid}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-text-heading line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-[11px] text-text-muted">
                          المحاضر: <strong className="text-text">{course.instructor}</strong> • المستوى: {course.level}
                        </p>
                      </div>
                    </div>

                    {/* الإجراءات */}
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      <a
                        href={`https://www.youtube.com/watch?v=${vid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl border border-border bg-surface-2 hover:border-accent text-text-muted hover:text-text-heading"
                        title="فتح في يوتيوب"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingCourse(course);
                          setCourseForm({
                            title: course.title,
                            instructor: course.instructor,
                            category: course.category,
                            orderIndex: course.orderIndex || course.rankOrder || 1,
                            level: course.level,
                            qualityBadge: course.qualityBadge || 'معتمد',
                            primaryTool: course.primaryTool || '',
                            runtime: course.runtime || '15:00',
                            synopsis: course.synopsis || '',
                            videoId: vid,
                            thumbnail: course.thumbnail
                          });
                          setYtUrl(`https://www.youtube.com/watch?v=${vid}`);
                          setShowAddCourseModal(true);
                        }}
                        className="py-1.5 px-3 text-xs"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف الدرس "${course.title}"؟`)) {
                            deleteCourse(course.id);
                          }
                        }}
                        className="py-1.5 px-2.5 text-xs text-red-400 hover:bg-red-500/10"
                        title="حذف الدرس"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== تبويب 2: إدارة الأقسام الـ 10 ==================== */}
        {activeTab === 'sections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-text-heading">
                  الأقسام التعليمية الرائدة مرتبة من 1 إلى {categories.length}
                </h3>
                <p className="text-xs text-text-muted">
                  يمكنك تحريك الأقسام لأعلى أو لأسفل، وتعديل أسمائها وربط الدروس والكتب بها.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({
                    name: '',
                    shortName: '',
                    description: '',
                    badge: `المرتبة #${categories.length + 1}`
                  });
                  setShowAddCategoryModal(true);
                }}
                className="py-2 px-3 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قسم جديد</span>
              </Button>
            </div>

            <div className="space-y-3">
              {[...(categories as any[])]
                .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                .map((cat: any) => {
                  const lessonsCount = (courses as any[]).filter((c: any) => c.category === cat.name).length;
                  return (
                    <Card key={cat.id || cat.name} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* أزرار الترتيب */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => reorderCategory(cat.id, 'up')}
                            className="w-7 h-7 rounded-lg border border-border bg-surface-2 hover:border-accent flex items-center justify-center text-text-muted hover:text-text-heading"
                            title="تحريك للأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-extrabold text-accent">
                            #{cat.orderIndex}
                          </span>
                          <button
                            type="button"
                            onClick={() => reorderCategory(cat.id, 'down')}
                            className="w-7 h-7 rounded-lg border border-border bg-surface-2 hover:border-accent flex items-center justify-center text-text-muted hover:text-text-heading"
                            title="تحريك للأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Chip tone="accent">الترتيب #{cat.orderIndex}</Chip>
                            <span className="text-xs font-extrabold text-text-heading">{cat.name}</span>
                          </div>
                          <p className="text-xs text-text-muted line-clamp-1">{cat.description}</p>
                          <div className="text-[11px] text-text-muted flex items-center gap-2 font-medium">
                            <span>عدد الدروس: <strong className="text-accent">{lessonsCount}</strong></span>
                            <span>•</span>
                            <span>الكتاب المرافق: {cat.ebookTitle || 'تم تعيين دليل رسمي'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryForm({
                              name: cat.name,
                              shortName: cat.shortName || cat.name,
                              description: cat.description || '',
                              badge: cat.badge || ''
                            });
                            setShowAddCategoryModal(true);
                          }}
                          className="py-1.5 px-3 text-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف قسم "${cat.name}"؟`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="py-1.5 px-2.5 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}

        {/* ==================== تبويب 3: الكتب والأدلة المرافقة ==================== */}
        {activeTab === 'ebooks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-text-heading">
                  الكتب الإلكترونية والأدلة التطبيقية المرافقة للأقسام الـ 10
                </h3>
                <p className="text-xs text-text-muted">
                  لكل قسم تعليمي كتاب تطبيقي مرافق يقدم الملخصات والقوالب والأوامر الجاهزة.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  setEditingEbook(null);
                  setEbookForm({
                    title: '',
                    category: categories?.[0]?.name || '',
                    author: 'فريق AIProdZone',
                    pages: '40 صفحة مركزة',
                    downloadUrl: '',
                    remoteCoverUrl: '',
                    provider: '',
                    excerpt: '',
                    content: ''
                  });
                  setShowAddEbookModal(true);
                }}
                className="py-2 px-3 text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة كتاب إلكتروني</span>
              </Button>
            </div>

            <div className="space-y-3">
              {[...(ebooks as any[])]
                .sort((a: any, b: any) => (a.sectionOrder || 0) - (b.sectionOrder || 0))
                .map((eb: any) => (
                  <Card key={eb.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => reorderEbook(eb.id, 'up')}
                          className="w-7 h-7 rounded-lg border border-border bg-surface-2 hover:border-accent flex items-center justify-center text-text-muted hover:text-text-heading"
                          title="تحريك للأعلى"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-extrabold text-accent">
                          #{eb.sectionOrder || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => reorderEbook(eb.id, 'down')}
                          className="w-7 h-7 rounded-lg border border-border bg-surface-2 hover:border-accent flex items-center justify-center text-text-muted hover:text-text-heading"
                          title="تحريك للأسفل"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip tone="accent">دليل القسم #{eb.sectionOrder}</Chip>
                          {eb.provider && <Chip tone="warning">{eb.provider}</Chip>}
                          {eb.category && <Chip tone="neutral">{eb.category}</Chip>}
                          <span className="text-xs text-text-muted">{eb.pages}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-text-heading">
                          {eb.title}
                        </h4>
                        <p className="text-xs text-text-muted line-clamp-1">{eb.excerpt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {eb.downloadUrl && (
                        <a
                          href={eb.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-border bg-surface-2 hover:border-accent text-accent transition-colors"
                          title="رابط التحميل المباشر"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditingEbook(eb);
                          setEbookForm({
                            title: eb.title,
                            category: eb.category || '',
                            author: eb.author || 'فريق AIProdZone',
                            pages: eb.pages || '40 صفحة مركزة',
                            downloadUrl: eb.downloadUrl || '',
                            remoteCoverUrl: eb.remoteCoverUrl || '',
                            provider: eb.provider || '',
                            excerpt: eb.excerpt || '',
                            content: eb.content || ''
                          });
                          setShowAddEbookModal(true);
                        }}
                        className="py-1.5 px-3 text-xs"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          if (window.confirm(`هل أنت متأكد من حذف الكتاب "${eb.title}"؟`)) {
                            deleteEbook(eb.id);
                          }
                        }}
                        className="py-1.5 px-2.5 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* نافذة مودال: إضافة / تعديل درس مع الجلب التلقائي الذكي */}
      {showAddCourseModal && (
        <div
          onClick={() => setShowAddCourseModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-smooth"
        >
          <Card
            onClick={(e: any) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[92vh] overflow-y-auto no-scrollbar p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <Chip tone="accent">نظام الجلب والتضمين النظيف</Chip>
                <h3 className="text-base sm:text-lg font-extrabold text-text-heading mt-1">
                  {editingCourse ? 'تعديل بيانات الدرس' : 'إضافة درس يوتيوب جديد (Auto-Fetch)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCourseModal(false)}
                className="text-text-muted hover:text-text-heading text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5">
              {/* حقل رابط يوتيوب والجلب التلقائي */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-heading">
                    رابط فيديو يوتيوب (Auto-Fetch بمجرد اللصق) *
                  </label>
                  {ytLoading && (
                    <span className="text-[11px] font-bold text-accent flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      جاري الاتصال بـ oEmbed...
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={ytUrl}
                    onChange={(e) => handleFetchYoutubeMeta(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={ytLoading}
                    onClick={() => handleFetchYoutubeMeta(ytUrl)}
                    className="shrink-0 text-xs px-3"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>جلب تلقائي</span>
                  </Button>
                </div>
                {ytError && <p className="text-[11px] text-red-400 font-bold">{ytError}</p>}
              </div>

              {/* معاينة الصورة المصغرة ومعرّف الفيديو */}
              {courseForm.videoId && (
                <div className="p-3 rounded-xl border border-border bg-surface flex items-center gap-3">
                  <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-border">
                    <img
                      src={`https://i.ytimg.com/vi/${courseForm.videoId}/maxresdefault.jpg`}
                      onError={handleThumbnailError}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <span className="text-[10px] text-accent font-extrabold">تم التحقق من معرّف يوتيوب:</span>
                    <p className="font-mono font-bold text-text-heading">{courseForm.videoId}</p>
                    <p className="text-[10px] text-text-muted">رابط التضمين النظيف: youtube-nocookie.com/embed/{courseForm.videoId}</p>
                  </div>
                </div>
              )}

              {/* عنوان الدرس */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-heading">عنوان الدرس / الشرح *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="عنوان الشرح..."
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-heading">اسم القناة / المحاضر</label>
                  <input
                    type="text"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-heading">القسم التعليمي</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                  >
                    {(categories as any[]).map((c: any) => (
                      <option key={c.id || c.name} value={c.name} className="bg-surface text-text">
                        #{c.orderIndex} - {c.shortName || c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-heading">الترتيب داخل القسم (orderIndex)</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={courseForm.orderIndex}
                    onChange={(e) => setCourseForm({ ...courseForm, orderIndex: Number(e.target.value) })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-heading">مدة الشرح</label>
                  <input
                    type="text"
                    value={courseForm.runtime}
                    onChange={(e) => setCourseForm({ ...courseForm, runtime: e.target.value })}
                    placeholder="15:30"
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-heading">المستوى التعليمي</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                  >
                    <option value="المستوى التأسيسي (مبتدئ)">تأسيسي (مبتدئ)</option>
                    <option value="المستوى التطبيقي (متوسط)">تطبيقي (متوسط)</option>
                    <option value="المستوى المتقدم (احترافي)">متقدم (احترافي)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-heading">ملخص الدرس وما سيتعلمه الطالب</label>
                <textarea
                  rows={3}
                  value={courseForm.synopsis}
                  onChange={(e) => setCourseForm({ ...courseForm, synopsis: e.target.value })}
                  placeholder="نبذة مركزة..."
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="ghost" onClick={() => setShowAddCourseModal(false)}>
                  إلغاء
                </Button>
                <Button variant="primary" type="submit" className="px-5">
                  {editingCourse ? 'حفظ التعديلات' : 'إضافة الدرس للمنصة'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* نافذة مودال: إضافة / تعديل قسم */}
      {showAddCategoryModal && (
        <div
          onClick={() => setShowAddCategoryModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-smooth"
        >
          <Card
            onClick={(e: any) => e.stopPropagation()}
            className="w-full max-w-lg p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-extrabold text-text-heading">
                {editingCategory ? 'تعديل القسم' : 'إضافة قسم تعليمي جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="text-text-muted hover:text-text-heading"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                if (!categoryForm.name.trim()) return;
                if (editingCategory) {
                  updateCategory(editingCategory.id, categoryForm);
                } else {
                  addCategory(categoryForm);
                }
                setShowAddCategoryModal(false);
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-heading">الاسم الكامل للقسم *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="مثال: هندسة النماذج الذكية..."
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-heading">الاسم المختصر (للأزرار والقوائم)</label>
                <input
                  type="text"
                  value={categoryForm.shortName}
                  onChange={(e) => setCategoryForm({ ...categoryForm, shortName: e.target.value })}
                  placeholder="مثال: هندسة النماذج"
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-heading">وصف القسم</label>
                <textarea
                  rows={3}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="ghost" onClick={() => setShowAddCategoryModal(false)}>إلغاء</Button>
                <Button variant="primary" type="submit">حفظ القسم</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* نافذة مودال: إضافة / تعديل كتاب */}
      {showAddEbookModal && (
        <div
          onClick={() => setShowAddEbookModal(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-smooth"
        >
          <Card
            onClick={(e: any) => e.stopPropagation()}
            className="w-full max-w-lg p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-extrabold text-text-heading">
                {editingEbook ? 'تعديل الكتاب الإلكتروني' : 'إضافة كتاب إلكتروني مرافق'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddEbookModal(false)}
                className="text-text-muted hover:text-text-heading"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                if (!ebookForm.title.trim()) return;
                if (editingEbook) {
                  updateEbook(editingEbook.id, ebookForm);
                } else {
                  addEbook(ebookForm);
                }
                setShowAddEbookModal(false);
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-heading">عنوان الكتاب أو الدليل التطبيقي *</label>
                <input
                  type="text"
                  required
                  value={ebookForm.title}
                  onChange={(e) => setEbookForm({ ...ebookForm, title: e.target.value })}
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-heading">القسم المرتبط</label>
                  <select
                    value={ebookForm.category}
                    onChange={(e) => setEbookForm({ ...ebookForm, category: e.target.value })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                  >
                    {(categories as any[]).map((c: any) => (
                      <option key={c.id || c.name} value={c.name} className="bg-surface text-text">
                        #{c.orderIndex} - {c.shortName || c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-heading">عدد الصفحات</label>
                  <input
                    type="text"
                    value={ebookForm.pages}
                    onChange={(e) => setEbookForm({ ...ebookForm, pages: e.target.value })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-heading">رابط التحميل السحابي (اختياري للكتب السحابية)</label>
                  <input
                    type="url"
                    placeholder="https://mega.nz/... أو Google Drive أو MediaFire"
                    value={ebookForm.downloadUrl}
                    onChange={(e) => setEbookForm({ ...ebookForm, downloadUrl: e.target.value })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-heading">مزود السحابة (مثال: Mega.nz / Google Drive)</label>
                  <input
                    type="text"
                    placeholder="Mega.nz, MediaFire..."
                    value={ebookForm.provider}
                    onChange={(e) => setEbookForm({ ...ebookForm, provider: e.target.value })}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-heading">رابط صورة الغلاف عن بُعد (Zero Weight CDN Cover)</label>
                <input
                  type="url"
                  placeholder="https://... رابط صورة الغلاف الخارجية"
                  value={ebookForm.remoteCoverUrl}
                  onChange={(e) => setEbookForm({ ...ebookForm, remoteCoverUrl: e.target.value })}
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-heading">نبذة مختصرة (تظهر في البطاقة)</label>
                <textarea
                  rows={2}
                  value={ebookForm.excerpt}
                  onChange={(e) => setEbookForm({ ...ebookForm, excerpt: e.target.value })}
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-heading">محتوى وفصول الكتاب</label>
                <textarea
                  rows={4}
                  value={ebookForm.content}
                  onChange={(e) => setEbookForm({ ...ebookForm, content: e.target.value })}
                  className="w-full text-xs rounded-xl px-3.5 py-2.5 border border-border bg-surface-2 text-text focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="ghost" onClick={() => setShowAddEbookModal(false)}>إلغاء</Button>
                <Button variant="primary" type="submit">حفظ الكتاب</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <LibraryProvider
      initialCourses={INITIAL_COURSES}
      initialEbooks={EBOOK_GUIDES}
      initialArticles={INITIAL_ARTICLES}
    >
      <AdminDashboardContent />
    </LibraryProvider>
  );
}
