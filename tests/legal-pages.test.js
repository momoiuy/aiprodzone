import { describe, it, expect } from 'vitest';
import {
  LEGAL_PAGES,
  LEGAL_PAGE_IDS,
  LEGAL_PAGES_LIST,
  CONTACT_STORAGE_KEY,
  getLegalPage
} from '../src/data/legal-pages.js';
import { ACADEMIC_DOMAINS } from '../src/data/categories.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { EBOOK_GUIDES } from '../src/data/ebooks.js';
import Footer from '../src/components/Footer.jsx';
import LegalView from '../src/views/LegalView.jsx';

describe('AIProdZone Legal & Institutional Pages Comprehensive Tests (المرحلة 9)', () => {

  describe('أ. التحقق من اكتمال وهيكلة الصفحات القانونية الخمس (src/data/legal-pages.js)', () => {
    it('يحتوي على المعرفات الرسمية الخمسة الكاملة دون أي نقص', () => {
      expect(LEGAL_PAGE_IDS.ABOUT).toBe('about');
      expect(LEGAL_PAGE_IDS.PRIVACY).toBe('privacy');
      expect(LEGAL_PAGE_IDS.TERMS).toBe('terms');
      expect(LEGAL_PAGE_IDS.COPYRIGHT).toBe('copyright');
      expect(LEGAL_PAGE_IDS.CONTACT).toBe('contact');
    });

    it('يحتوي قاموس LEGAL_PAGES على الصفحات الخمس وتطابق قائمة LEGAL_PAGES_LIST', () => {
      const pageKeys = Object.keys(LEGAL_PAGES);
      expect(pageKeys.length).toBe(5);
      expect(pageKeys).toContain('about');
      expect(pageKeys).toContain('privacy');
      expect(pageKeys).toContain('terms');
      expect(pageKeys).toContain('copyright');
      expect(pageKeys).toContain('contact');

      expect(LEGAL_PAGES_LIST.length).toBe(5);
      const listIds = LEGAL_PAGES_LIST.map((p) => p.id);
      expect(listIds).toEqual(['about', 'privacy', 'terms', 'copyright', 'contact']);
    });

    it('دالة getLegalPage تُعيد الصفحة الصحيحة وتعود تلقائياً لصفحة about عند تمرير معرّف غير صالح', () => {
      expect(getLegalPage('privacy').id).toBe('privacy');
      expect(getLegalPage('copyright').id).toBe('copyright');
      expect(getLegalPage('unknown_slug').id).toBe('about');
      expect(getLegalPage(null).id).toBe('about');
    });

    it('تحتوي كل صفحة قانونية على الحقول الأساسية: id, title, subtitle, lastUpdated, summary', () => {
      LEGAL_PAGES_LIST.forEach((page) => {
        expect(page.id).toBeTruthy();
        expect(page.title).toBeTruthy();
        expect(page.subtitle).toBeTruthy();
        expect(page.lastUpdated).toBeTruthy();
        expect(page.summary).toBeTruthy();
        expect(page.summary.length).toBeGreaterThan(40);
      });
    });
  });

  describe('ب. التحقق الدقيق من محتوى صفحة "من نحن ومنهجية التقييم" (about)', () => {
    const aboutPage = LEGAL_PAGES[LEGAL_PAGE_IDS.ABOUT];

    it('تُعرّف المنصة كدليل أكاديمي عربي مجاني يصنف أعمق المسارات', () => {
      expect(aboutPage.title).toContain('من نحن');
      expect(aboutPage.summary).toContain('دليل أكاديمي عربي');
      expect(aboutPage.summary).toContain('أعمق الشروحات');
    });

    it('تتضمن إحصائيات المنصة الحية المتطابقة مع واقع البيانات', () => {
      expect(aboutPage.stats).toBeDefined();
      expect(aboutPage.stats.length).toBe(4);
      const statsMap = Object.fromEntries(aboutPage.stats.map((s) => [s.value, s.label]));
      expect(statsMap['8']).toBeDefined(); // 8 قطاعات
      expect(statsMap['73']).toBeDefined(); // 73 مساراً
      expect(statsMap['114']).toBeDefined(); // 114 كتاباً
    });

    it('تتضمن معايير التقييم الأربعة الصارمة بكافة تفاصيلها وتسمياتها', () => {
      const criteriaSection = aboutPage.sections.find((s) => s.id === 'criteria');
      expect(criteriaSection).toBeDefined();
      expect(criteriaSection.items.length).toBe(4);

      const [c1, c2, c3, c4] = criteriaSection.items;
      expect(c1.number).toBe('01');
      expect(c1.title).toContain('عمق الشرح');
      expect(c2.number).toBe('02');
      expect(c2.title).toContain('التطبيق العملي');
      expect(c3.number).toBe('03');
      expect(c3.title).toContain('حداثة المحتوى');
      expect(c4.number).toBe('04');
      expect(c4.title).toContain('جودة الإنتاج');
    });

    it('تتضمن معمارية الصفر إعلانات مزعجة والتصميم الخالي من التشتيت', () => {
      const zeroAdsSection = aboutPage.sections.find((s) => s.id === 'zero-ads');
      expect(zeroAdsSection).toBeDefined();
      const allText = zeroAdsSection.paragraphs.join(' ');
      expect(allText).toContain('الصفر إعلانات');
      expect(allText).toContain('الهدوء المعرفي');
    });
  });

  describe('ج. التحقق من سياسة الخصوصية وحماية البيانات (privacy)', () => {
    const privacyPage = LEGAL_PAGES[LEGAL_PAGE_IDS.PRIVACY];

    it('تؤكد الالتزام التام بحماية خصوصية المتعلم بنسبة 100%', () => {
      expect(privacyPage.badge).toContain('100%');
      expect(privacyPage.summary).toContain('الخصوصية');
      expect(privacyPage.summary).toContain('التخزين المحلي');
    });

    it('تشرح بدقة كيفية عمل التخزين المحلي (localStorage) لحفظ التقدم والمحفوظات محلياً', () => {
      const storageSection = privacyPage.sections.find((s) => s.id === 'local-storage');
      expect(storageSection).toBeDefined();
      const text = storageSection.paragraphs.join(' ');
      expect(text).toContain('localStorage');
      expect(text).toContain('تقدمك');
      expect(text).toContain('قائمتي المحفوظة');
      expect(text).toContain('متصفحك');
    });

    it('توضح استخدام نطاق يوتيوب المعزز للخصوصية youtube-nocookie.com', () => {
      const ytSection = privacyPage.sections.find((s) => s.id === 'youtube-nocookie');
      expect(ytSection).toBeDefined();
      const text = ytSection.paragraphs.join(' ');
      expect(text).toContain('youtube-nocookie.com');
      expect(text).toContain('ملفات تعريف ارتباط');
    });

    it('تضمن حق المستخدم الكامل في حذف وتطهير بياناته محلياً', () => {
      const controlSection = privacyPage.sections.find((s) => s.id === 'data-control');
      expect(controlSection).toBeDefined();
      expect(controlSection.paragraphs.join(' ')).toContain('حذف');
    });
  });

  describe('د. التحقق من شروط وأحكام الاستخدام (terms)', () => {
    const termsPage = LEGAL_PAGES[LEGAL_PAGE_IDS.TERMS];

    it('تتضمن بنود الاستخدام التعليمي الشخصي غير التجاري', () => {
      const usageSection = termsPage.sections.find((s) => s.id === 'usage-scope');
      expect(usageSection).toBeDefined();
      const text = usageSection.paragraphs.join(' ');
      expect(text).toContain('غير التجاري');
      expect(text).toContain('الشخصي');
    });

    it('تحدد ضوابط المشاركات والتعليقات والمقترحات والامتناع عن الإساءة والسبام', () => {
      const conductSection = termsPage.sections.find((s) => s.id === 'community-conduct');
      expect(conductSection).toBeDefined();
      const text = conductSection.paragraphs.join(' ');
      expect(text).toContain('المحاضرين');
      expect(text).toContain('ترويجي');
    });

    it('تتضمن إخلاء المسؤولية وحدود الضمانات الأكاديمية والتقنية', () => {
      const disclaimerSection = termsPage.sections.find((s) => s.id === 'disclaimer');
      expect(disclaimerSection).toBeDefined();
      expect(disclaimerSection.paragraphs.join(' ')).toContain('المسؤولية');
    });
  });

  describe('هـ. التحقق من حقوق الملكية الفكرية وسياسة DMCA (copyright)', () => {
    const copyrightPage = LEGAL_PAGES[LEGAL_PAGE_IDS.COPYRIGHT];

    it('تؤكد اعتماد التضمين الرسمي عبر واجهة YouTube Official IFrame Player API', () => {
      const apiSection = copyrightPage.sections.find((s) => s.id === 'youtube-api-policy');
      expect(apiSection).toBeDefined();
      const text = apiSection.paragraphs.join(' ');
      expect(text).toContain('YouTube');
      expect(text).toContain('IFrame');
      expect(text).toContain('القنوات الرسمية');
    });

    it('تضمن حفظ 100% من المشاهدات والاشتراكات وعوائد الإعلانات للقنوات الأصلية للمحاضرين', () => {
      const apiSection = copyrightPage.sections.find((s) => s.id === 'youtube-api-policy');
      const text = apiSection.paragraphs.join(' ');
      expect(text).toContain('حفظ كامل المشاهدات');
      expect(text).toContain('العداد الرسمي');
      expect(text).toContain('إيرادات');
    });

    it('توضح أن روابط الكتب الرقمية والأدلة للأغراض التعليمية والمرجعية', () => {
      const booksSection = copyrightPage.sections.find((s) => s.id === 'books-policy');
      expect(booksSection).toBeDefined();
      expect(booksSection.paragraphs.join(' ')).toContain('التعليمية');
    });

    it('تتضمن آلية رسمية واضحة لإشعار الإزالة DMCA مع مهلة استجابة 24-48 ساعة', () => {
      const dmcaSection = copyrightPage.sections.find((s) => s.id === 'takedown-procedure');
      expect(dmcaSection).toBeDefined();
      const text = dmcaSection.paragraphs.join(' ');
      expect(text).toContain('DMCA');
      expect(text).toContain('24 إلى 48 ساعة');
      expect(text).toContain('إثبات ملكيتك');
    });
  });

  describe('و. التحقق من صفحة اتصل بنا وقسم الأسئلة الشائعة (contact)', () => {
    const contactPage = LEGAL_PAGES[LEGAL_PAGE_IDS.CONTACT];

    it('يحتوي قسم الأسئلة الشائعة على 6 استفسارات شاملة على الأقل', () => {
      expect(Array.isArray(contactPage.faqs)).toBe(true);
      expect(contactPage.faqs.length).toBeGreaterThanOrEqual(6);
    });

    it('يجيب على استفسار تتبع التقدم المحلي وميزة تعدد المحاضرين Multi-Instructor', () => {
      const questions = contactPage.faqs.map((f) => f.question);
      expect(questions.some((q) => q.includes('أتابع تقدمي'))).toBe(true);
      expect(questions.some((q) => q.includes('أبدّل بين المحاضرين'))).toBe(true);
    });

    it('يجيب على استفسار مجانية المحتوى بالكامل واقتراح دورة جديدة', () => {
      const questions = contactPage.faqs.map((f) => f.question);
      expect(questions.some((q) => q.includes('مجانية بالكامل'))).toBe(true);
      expect(questions.some((q) => q.includes('أقترح دورة جديدة'))).toBe(true);
    });

    it('يحتوي على قنوات التواصل الرسمية وتصنيفات نموذج المراسلة ومفتاح التخزين', () => {
      expect(contactPage.contactInfo.email).toBe('contact@aiprodzone.com');
      expect(contactPage.contactInfo.dmcaEmail).toBe('dmca@aiprodzone.com');
      expect(contactPage.contactInfo.responseTime).toContain('24 - 48');

      expect(contactPage.categories.length).toBe(4);
      const catIds = contactPage.categories.map((c) => c.id);
      expect(catIds).toContain('general');
      expect(catIds).toContain('suggestion');
      expect(catIds).toContain('dmca');
      expect(catIds).toContain('technical');

      expect(CONTACT_STORAGE_KEY).toBe('aiprodzone_contact_messages');
    });
  });

  describe('ز. التحقق من تكامل الفوتر (Footer) والقطاعات الأكاديمية الثمانية', () => {
    it('يُصدّر مكون Footer بنجاح وهو دالة React صالحة', () => {
      expect(Footer).toBeDefined();
      expect(typeof Footer).toBe('function');
    });

    it('يُصدّر مكون LegalView بنجاح وهو دالة React صالحة', () => {
      expect(LegalView).toBeDefined();
      expect(typeof LegalView).toBe('function');
    });

    it('القطاعات الأكاديمية الثمانية متطابقة بالكامل مع ACADEMIC_DOMAINS', () => {
      expect(ACADEMIC_DOMAINS.length).toBe(8);
      const domainNames = ACADEMIC_DOMAINS.map((d) => d.name);
      expect(domainNames).toContain('الويب والبرمجة');
      expect(domainNames).toContain('علوم الحاسوب');
      expect(domainNames).toContain('الذكاء الاصطناعي وعلم البيانات');
      expect(domainNames).toContain('الشبكات والأمن السيبراني');
    });

    it('يتطابق إجمالي المسارات والكتب في المنصة مع الأرقام المعلنة في الفوتر', () => {
      expect(INITIAL_COURSES.length).toBe(73);
      expect(EBOOK_GUIDES.length).toBe(114);
      expect(ACADEMIC_DOMAINS.length).toBe(8);
    });
  });

});
