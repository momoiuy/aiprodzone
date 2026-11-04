'use client';

import { useState, useId, useMemo } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  FileText,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  Tv,
  Check
} from 'lucide-react';
import {
  LEGAL_PAGES,
  LEGAL_PAGE_IDS,
  LEGAL_PAGES_LIST,
  CONTACT_STORAGE_KEY
} from '../data/legal-pages';
import { getStorageItem, setStorageItem } from '../lib/storage';
import Card from '../components/Card';
import Button from '../components/Button';
import Chip from '../components/Chip';

const TAB_ICONS = {
  about: GraduationCap,
  privacy: ShieldCheck,
  terms: FileText,
  copyright: ShieldAlert,
  contact: HelpCircle
};

// Props: { initialTab?: string, onTabChange?: (tab: string) => void, onBackToCourses?: () => void, onSelectCategory?: (cat: string) => void }
export default function LegalView({
  initialTab = 'about',
  onTabChange,
  onBackToCourses,
  onSelectCategory
}) {
  const [activeTab, setActiveTab] = useState(
    LEGAL_PAGES[initialTab] ? initialTab : 'about'
  );

  // حالة نموذج الاتصال التفاعلي
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [formError, setFormError] = useState('');

  // حالة البحث والتوسيع في الأسئلة الشائعة FAQ
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIds, setOpenFaqIds] = useState(new Set(['faq-progress', 'faq-multi-instructor']));

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const currentPage = LEGAL_PAGES[activeTab] || LEGAL_PAGES.about;
  const ActiveIcon = TAB_ICONS[currentPage.id] || FileText;

  const toggleFaq = (id) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormError('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، والرسالة).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormError('يرجى إدخال بريد إلكتروني صالح للتواصل معك.');
      return;
    }

    const generatedTicket = `APZ-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newEntry = {
      id: generatedTicket,
      createdAt: new Date().toISOString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      category: formData.category,
      subject: formData.subject.trim() || 'بدون عنوان محدد',
      message: formData.message.trim(),
      status: 'received'
    };

    try {
      const existingList = getStorageItem(CONTACT_STORAGE_KEY, [], Array.isArray);
      const updatedList = [...existingList, newEntry];
      setStorageItem(CONTACT_STORAGE_KEY, updatedList);
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    setTicketId(generatedTicket);
    setFormSubmitted(true);
    setFormData({
      name: '',
      email: '',
      category: 'general',
      subject: '',
      message: ''
    });
  };

  const filteredFaqs = useMemo(() => {
    const contactPage = LEGAL_PAGES[LEGAL_PAGE_IDS.CONTACT];
    if (!contactPage || !contactPage.faqs) return [];
    if (!faqSearch.trim()) return contactPage.faqs;
    const q = faqSearch.toLowerCase().trim();
    return contactPage.faqs.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [faqSearch]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-smooth">
      {/* الترويسة العلوية وزر الرجوع */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1.5 text-right">
          <div className="flex items-center gap-2 justify-end">
            <Chip tone="accent">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>المركز القانوني والتنظيمي الرسمي</span>
            </Chip>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-text-heading">
            منظومة الحوكمة، الخصوصية وحقوق الملكية في AIProdZone
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-2xl">
            نصوص شفافة ومفصلة تضمن أعلى معايير الخصوصية الرقمية، الأمان الأكاديمي، واحترام الملكية الفكرية لصناع المحتوى.
          </p>
        </div>

        {onBackToCourses && (
          <Button
            variant="secondary"
            onClick={onBackToCourses}
            className="self-start sm:self-auto px-4 py-2.5 text-xs sm:text-sm shrink-0 gap-2 font-bold"
          >
            <span>العودة لتصفح الدورات</span>
            <ArrowRight className="w-4 h-4 text-accent" />
          </Button>
        )}
      </div>

      {/* شريط تبويبات التنقل السريع بين الصفحات الخمس */}
      <nav
        aria-label="قائمة التبويبات القانونية"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-sm border-b border-border/80"
      >
        {LEGAL_PAGES_LIST.map((page) => {
          const Icon = TAB_ICONS[page.id] || FileText;
          const isActive = activeTab === page.id;
          return (
            <button
              key={page.id}
              type="button"
              onClick={() => handleTabClick(page.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-accent-soft text-text-heading border-accent shadow-sm'
                  : 'bg-surface text-text-muted border-border hover:border-accent/40 hover:text-text-heading'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
              <span>{page.shortTitle}</span>
            </button>
          );
        })}
      </nav>

      {/* بطاقة رأس الصفحة الحالية */}
      <Card className="p-5 sm:p-7 space-y-4 bg-gradient-to-br from-surface via-surface to-surface-2 border-border/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-accent-soft text-accent flex items-center justify-center shrink-0 border border-accent/30 shadow-sm">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                {currentPage.badge}
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-text-heading">
                {currentPage.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-bold text-text-muted bg-surface-2 px-3 py-1.5 rounded-xl border border-border">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>آخر تحديث: {currentPage.lastUpdated}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-text-muted text-right">
          {currentPage.subtitle}
        </p>
        <div className="p-3.5 sm:p-4 rounded-xl bg-surface-2 border border-border text-xs sm:text-sm text-text leading-relaxed text-right">
          {currentPage.summary}
        </div>

        {/* إحصائيات صفحة "من نحن" */}
        {currentPage.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {currentPage.stats.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-surface border border-border text-center space-y-1"
              >
                <div className="text-base sm:text-xl font-extrabold text-accent">
                  {s.value}
                </div>
                <div className="text-[11px] font-bold text-text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* محتوى الصفحة رقم 1: من نحن ومنهجية التقييم */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          {currentPage.sections?.map((sec) => (
            <Card key={sec.id} className="p-5 sm:p-6 space-y-4">
              <h3 className="text-base sm:text-lg font-extrabold text-text-heading border-r-4 border-accent pr-3 text-right">
                {sec.heading}
              </h3>

              {sec.paragraphs?.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-xs sm:text-sm leading-relaxed text-text text-right"
                >
                  {p}
                </p>
              ))}

              {sec.description && (
                <p className="text-xs sm:text-sm leading-relaxed text-text-muted text-right">
                  {sec.description}
                </p>
              )}

              {/* عناصر المعايير الأربعة */}
              {sec.items && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {sec.items.map((item) => (
                    <div
                      key={item.number}
                      className="p-4 rounded-xl bg-surface-2 border border-border hover:border-accent/50 transition-all space-y-2 text-right"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-accent bg-accent-soft px-2.5 py-0.5 rounded-lg border border-accent/20">
                          المعيار {item.number}
                        </span>
                        <Award className="w-4 h-4 text-accent" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-text-heading">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs leading-relaxed text-text-muted">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* محتوى الصفحة رقم 2: سياسة الخصوصية وحماية البيانات */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          {currentPage.sections?.map((sec) => (
            <Card key={sec.id} className="p-5 sm:p-6 space-y-3.5">
              <h3 className="text-base sm:text-lg font-extrabold text-text-heading border-r-4 border-accent pr-3 text-right flex items-center justify-between">
                <span>{sec.heading}</span>
              </h3>

              {sec.paragraphs?.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-xs sm:text-sm leading-relaxed text-text text-right"
                >
                  {p}
                </p>
              ))}
            </Card>
          ))}
        </div>
      )}

      {/* محتوى الصفحة رقم 3: شروط وأحكام الاستخدام */}
      {activeTab === 'terms' && (
        <div className="space-y-6">
          {currentPage.sections?.map((sec) => (
            <Card key={sec.id} className="p-5 sm:p-6 space-y-3.5">
              <h3 className="text-base sm:text-lg font-extrabold text-text-heading border-r-4 border-accent pr-3 text-right">
                {sec.heading}
              </h3>

              {sec.paragraphs?.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-xs sm:text-sm leading-relaxed text-text text-right"
                >
                  {p}
                </p>
              ))}
            </Card>
          ))}
        </div>
      )}

      {/* محتوى الصفحة رقم 4: حقوق الملكية الفكرية وسياسة DMCA */}
      {activeTab === 'copyright' && (
        <div className="space-y-6">
          {currentPage.sections?.map((sec) => (
            <Card key={sec.id} className="p-5 sm:p-6 space-y-3.5">
              <h3 className="text-base sm:text-lg font-extrabold text-text-heading border-r-4 border-accent pr-3 text-right">
                {sec.heading}
              </h3>

              {sec.paragraphs?.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-xs sm:text-sm leading-relaxed text-text text-right"
                >
                  {p}
                </p>
              ))}
            </Card>
          ))}

          <Card className="p-5 sm:p-6 bg-accent-soft/20 border-accent/40 space-y-3 text-right">
            <div className="flex items-center gap-2 justify-end text-accent font-extrabold text-sm sm:text-base">
              <span>هل أنت صانع محتوى وترغب في تحديث أو إزالة دورتك؟</span>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-text">
              نحن نحترم رغبتك فوراً وندعم جهودك. يمكنك التوجه مباشرة إلى صفحة التواصل واختيار &quot;بلاغ حقوق ملكية فكرية&quot;، وسيقوم الفريق الأكاديمي بتنفيذ طلبك وإزالة الرابط خلال 24 ساعة دون أي تعقيدات.
            </p>
            <div className="pt-1">
              <Button
                variant="primary"
                onClick={() => handleTabClick('contact')}
                className="px-4 py-2 text-xs font-bold"
              >
                <span>الانتقال لنموذج البلاغات والمقترحات</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent-ink" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* محتوى الصفحة رقم 5: اتصل بنا والأسئلة الشائعة */}
      {activeTab === 'contact' && (
        <div className="space-y-8">
          {/* بطاقات قنوات التواصل الرسمية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 sm:p-5 space-y-2 text-right">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-text-heading">
                البريد الإلكتروني المباشر
              </h4>
              <p className="text-[11px] text-text-muted leading-relaxed">
                للاستفسارات العامة والملاحظات البيداغوجية:
              </p>
              <a
                href="mailto:contact@aiprodzone.com"
                className="text-xs font-extrabold text-accent hover:underline inline-block dir-ltr text-left"
              >
                contact@aiprodzone.com
              </a>
            </Card>

            <Card className="p-4 sm:p-5 space-y-2 text-right">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-text-heading">
                شؤون الملكية الفكرية وDMCA
              </h4>
              <p className="text-[11px] text-text-muted leading-relaxed">
                مخصص لأصحاب الحقوق وطلبات الإزالة والتحديث:
              </p>
              <a
                href="mailto:dmca@aiprodzone.com"
                className="text-xs font-extrabold text-accent hover:underline inline-block dir-ltr text-left"
              >
                dmca@aiprodzone.com
              </a>
            </Card>

            <Card className="p-4 sm:p-5 space-y-2 text-right">
              <div className="w-9 h-9 rounded-xl bg-accent-soft text-accent flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-text-heading">
                زمن الاستجابة وساعات العمل
              </h4>
              <p className="text-[11px] text-text-muted leading-relaxed">
                الاستجابة خلال 24 - 48 ساعة عمل.
              </p>
              <span className="text-[11px] font-bold text-text-heading block">
                الأحد - الخميس (9:00 ص - 6:00 م)
              </span>
            </Card>
          </div>

          {/* قسم الأسئلة الشائعة (FAQ) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Chip tone="accent">إجابات فورية</Chip>
                </div>
                <h3 className="text-base sm:text-xl font-extrabold text-text-heading">
                  الأسئلة الشائعة حول المنصة والتعلم
                </h3>
              </div>

              {/* حقل البحث في الأسئلة */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="ابحث في الأسئلة الشائعة..."
                  className="w-full h-9 pl-3 pr-8 rounded-xl bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
                />
                <Search className="w-4 h-4 text-text-muted absolute right-2.5 top-2.5" />
              </div>
            </div>

            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaqIds.has(faq.id);
                  return (
                    <Card
                      key={faq.id}
                      className="overflow-hidden border-border/80 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-right hover:bg-surface-2/60 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold text-text-heading flex-1">
                          {faq.question}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-text-muted border-t border-border/50 text-right bg-surface-2/20">
                          {faq.answer}
                        </div>
                      )}
                    </Card>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-text-muted border border-dashed border-border rounded-2xl">
                  لم يتم العثور على سؤال يطابق بحثك &quot;{faqSearch}&quot;. يمكنك كتابة استفسارك في النموذج أدناه.
                </div>
              )}
            </div>
          </div>

          {/* نموذج التواصل التفاعلي المتقدم */}
          <Card className="p-4 sm:p-7 space-y-5 border-slate-200/80 dark:border-slate-800 w-full max-w-[calc(100vw-1.5rem)] sm:max-w-full overflow-hidden mx-auto">
            <div className="border-b border-border pb-4 text-right space-y-1">
              <div className="flex items-center gap-2 justify-end">
                <Chip tone="accent">
                  <Send className="w-3.5 h-3.5 text-accent" />
                  <span>تواصل مباشر مع الإشراف الأكاديمي</span>
                </Chip>
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-text-heading">
                إرسال رسالة، مقترح مسار جديد، أو بلاغ ملكية فكرية
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                تُحفظ رسالتك محلياً بشكل فوري وتُحول للفريق المختص مع إصدار كود مرجعي فريد لمتابعتها.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-accent-soft/30 border border-accent text-right space-y-3 animate-smooth">
                <div className="flex items-center gap-2 text-accent font-extrabold text-base justify-end">
                  <span>تم استلام رسالتك بنجاح!</span>
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-text">
                  شكراً لتواصلك وحرصك على إثراء المحتوى الأكاديمي لمنصة AIProdZone. تم حفظ نسختك محلياً بنجاح، وسيقوم الفريق الأكاديمي بمراجعة مضمون طلبك في أقرب وقت.
                </p>
                <div className="p-3 bg-surface rounded-xl border border-border inline-block text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                  رمز المرجع الخاص بك: {ticketId}
                </div>
                <div>
                  <Button
                    variant="secondary"
                    onClick={() => setFormSubmitted(false)}
                    className="px-4 py-2 text-xs font-bold"
                  >
                    إرسال رسالة أخرى
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-right">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-text-heading">
                      الاسم الكريم <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: م. أحمد عبد الله"
                      className="w-full h-10 px-3 rounded-xl bg-surface-2 border border-border text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-text-heading">
                      البريد الإلكتروني <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full h-10 px-3 rounded-xl bg-surface-2 border border-border text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none text-left dir-ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-text-heading">
                      تصنيف الرسالة <span className="text-accent">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-surface-2 border border-border text-xs text-text focus:border-accent focus:outline-none"
                    >
                      <option value="general">استفسار عام أو سؤال بيداغوجي</option>
                      <option value="suggestion">اقتراح دورة أو مسار أو كتاب جديد</option>
                      <option value="dmca">بلاغ حقوق ملكية فكرية وإشعار إزالة (DMCA)</option>
                      <option value="technical">إبلاغ عن خطأ تقني أو رابط فيديو تالف</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-text-heading">
                      موضوع الرسالة
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="عنوان موجز لموضوعك"
                      className="w-full h-10 px-3 rounded-xl bg-surface-2 border border-border text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-text-heading">
                    تفاصيل الرسالة أو المقترح أو البلاغ <span className="text-accent">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب تفاصيل استفسارك أو الرابط المراد إضافته أو التبليغ عنه..."
                    className="w-full p-3 rounded-xl bg-surface-2 border border-border text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-text-muted">
                    🔒 خصوصيتك محمية 100%، لن تُشارك بياناتك مع أي طرف خارجي.
                  </p>

                  <Button
                    variant="primary"
                    type="submit"
                    className="px-6 py-2.5 text-xs sm:text-sm font-bold gap-2"
                  >
                    <span>إرسال وتوثيق الطلب</span>
                    <Send className="w-4 h-4 text-accent-ink" />
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
