// تعريفات أنواع بيانات المقالات الأكاديمية والتقنية لمنصة AIProdZone
// متوافقة بنسبة 100% مع معايير السيو (SEO) وتحسين محركات الإجابة التوليدية (GEO 2026)

export interface ArticleComparisonTable {
  headers: string[];
  rows: string[][];
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface ArticleCallout {
  type?: 'info' | 'warning' | 'tip';
  title?: string;
  text: string;
}

export interface ArticleSection {
  heading: string;
  body: string;
  table?: ArticleComparisonTable;
  callout?: ArticleCallout;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
  summary: string;
  keyTakeaways: string[];
  sections: ArticleSection[];
  relatedCourseIds: string[];

  // -------------------------------------------------------------
  // الحقول الاختيارية الجديدة الخاصة بـ GEO & SEO لعام 2026
  // (جميعها اختيارية ? وتدعم قيماً افتراضية ذكية تلقائية)
  // -------------------------------------------------------------

  /** جملة تعريفية حاسمة ومستقلة في بداية المقال تقتبسها محركات الذكاء الاصطناعي مباشرة (Definition Lead) */
  definitionLead?: string;

  /** خلاصة تنفيذية في أول المقال (3-4 نقاط سريعة) */
  quickTakeaways?: string[];

  /** جدول مقارنة مهيكل داخل المقال لنماذج LLMs والمقارنات السريعة */
  comparisonTable?: ArticleComparisonTable;

  /** قسم أسئلة شائعة حوارية في نهاية المقال بصيغة ما يبحث عنه المستخدم */
  faqs?: ArticleFaq[];

  /** قائمة الكلمات المفتاحية القوية (عربية وإنجليزية) للسيو ومحركات الإجابة */
  seoKeywords?: string[];

  /** تاريخ آخر تحديث للمقال (مثال: '2026-11') */
  lastUpdated?: string;
}
