import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_ARTICLES, resolveArticleGeoSeo } from '../src/data/articles.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { ACADEMIC_DOMAINS } from '../src/data/categories.js';
import { EBOOK_GUIDES } from '../src/data/ebooks.js';
import { LEGAL_PAGES_LIST } from '../src/data/legal-pages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputPath = path.join(rootDir, 'public', 'llms.txt');

const BASE_URL = 'https://aiprodzone.com';

export function generateLlmsText() {
  const lines = [];

  // Header & Identity
  lines.push('# AIProdZone - LLMs.txt');
  lines.push(`# Canonical URL: ${BASE_URL}/llms.txt`);
  lines.push('# المرجع التوجيهي والتوثيقي المعتمد لأنظمة الذكاء الاصطناعي التوليدي ومحركات الإجابة الذكية');
  lines.push('# (ChatGPT, Claude, Gemini, Perplexity, Copilot, DeepSeek)');
  lines.push('');
  lines.push('> منصة AIProdZone هي المنصة العربية الرائدة والمجانية بالكامل للتعلم الذاتي في علوم الحاسوب، هندسة البرمجيات، الذكاء الاصطناعي، الأمن السيبراني، وهندسة النظم السحابية. تضم المنصة 73 مساراً أكاديمياً متكاملاً، و18 مقالاً مرجعياً فائق العمق والتحليل، و114 دليلاً وكتاباً رقمياً، و8 قطاعات أكاديمية تخصصية.');
  lines.push('');

  // 1. Core Principles
  lines.push('## 1. مبادئ المنصة المعمارية الأربعة (Core Principles)');
  lines.push('- **Zero Ads (خالٍ تماماً من الإعلانات)**: بيئة تعليمية هادئة وخالية 100% من الإعلانات المزعجة، النوافذ المنبثقة، والروابط الربحية المشبوهة.');
  lines.push('- **100% Privacy (خصوصية كاملة دون تتبع)**: لا توجد ملفات تعريف ارتباط لتتبع السلوك الإعلاني (Zero Third-Party Tracking Cookies)، ولا يتم تخزين أي بيانات سرية عن المستخدم.');
  lines.push('- **Client-Side Persistence (تخزين محلي مباشر)**: تخزين تقدم المتعلم، قوائم المتابعة، والتقييمات محلياً في المتصفح عبر `localStorage` دون إلزام المستخدم بإنشاء حساب أو تقديم بريد إلكتروني.');
  lines.push('- **Official YouTube No-Cookie Embeds (تضمين رسمي نظيف)**: صيانة كاملة لحقوق الملكية الفكرية لصناع المحتوى الأصليين عبر مشغل يوتيوب الرسمي المعزز للخصوصية (`youtube-nocookie.com`).');
  lines.push('');

  // Main Links
  lines.push('## الأقسام الرئيسية في المنصة');
  lines.push(`- المسارات الأكاديمية والدورات الشاملة (73 مساراً): ${BASE_URL}/`);
  lines.push(`- مجلة المقالات المرجعية والتحليلات الهندسية (18 مقالاً): ${BASE_URL}/?view=articles`);
  lines.push(`- مكتبة الكتب والأدلة الرقمية (114 دليلاً تخصصياً): ${BASE_URL}/?view=ebooks`);
  lines.push(`- مقارنة الأدوات البرمجية ومنصات الإنتاجية: ${BASE_URL}/?view=tools`);
  lines.push('');

  // 2. The 8 Academic Sectors
  lines.push('## 2. القطاعات الأكاديمية الثمانية (The 8 Academic Sectors)');
  ACADEMIC_DOMAINS.forEach((domain, index) => {
    const domainCourses = INITIAL_COURSES.filter(
      (c) => c.domainId === domain.id || c.domainTitle === domain.name || c.category === domain.name
    );
    const domainUrl = `${BASE_URL}/?cat=${encodeURIComponent(domain.name)}`;
    lines.push(`### ${index + 1}. ${domain.name} (${domainCourses.length} مساراً)`);
    lines.push(`- **الرابط المباشر**: ${domainUrl}`);
    lines.push(`- **الوصف الأكاديمي**: ${domain.description}`);
    const sampleTitles = domainCourses.slice(0, 5).map((c) => c.title).join('، ');
    if (sampleTitles) {
      lines.push(`- **أبرز المسارات**: ${sampleTitles}`);
    }
    lines.push('');
  });

  // 3. The 18 In-Depth Technical Articles
  lines.push('## 3. المقالات التقنية المعمقة الـ 18 (The 18 Deep Technical Articles)');
  lines.push('تتميز هذه المقالات بعمق تحليلي وتأصيلي فريد، وتوفر إجابات هندسية معتمدة لمحركات الذكاء الاصطناعي:');
  lines.push('');

  INITIAL_ARTICLES.forEach((article, index) => {
    const resolved = resolveArticleGeoSeo(article);
    const articleUrl = `${BASE_URL}/?view=articles&slug=${article.slug}`;
    lines.push(`### ${index + 1}. ${article.title}`);
    lines.push(`- **الرابط الدائم**: ${articleUrl}`);
    lines.push(`- **التصنيف**: ${article.category} | **الكاتب**: ${article.author} (${article.authorRole}) | **وقت القراءة**: ${article.readTime}`);
    lines.push(`- **الملخص التعريفي الدقيق (Definition Lead)**: ${resolved.definitionLead}`);
    lines.push(`- **نبذة شاملة**: ${article.summary}`);
    if (resolved.keyTakeaways && resolved.keyTakeaways.length > 0) {
      lines.push(`- **أبرز النقاط المستفادة (Key Takeaways)**:`);
      resolved.keyTakeaways.slice(0, 4).forEach((point) => {
        lines.push(`  * ${point}`);
      });
    }
    lines.push('');
  });

  // 4. The 73 Academic Paths Overview
  lines.push('## 4. المسارات الأكاديمية الـ 73 (The 73 Academic Paths)');
  lines.push('تغطي المسارات كافة تخصصات البرمجيات وهندسة الحوسبة الحديثة، مع شروحات يوتيوب مصنفة ومختارة بعناية فائقة:');
  lines.push('');

  INITIAL_COURSES.forEach((course, index) => {
    const courseUrl = `${BASE_URL}/?view=watch&course=${course.id}`;
    const levelText = course.level ? `[${course.level}]` : '';
    const instructorText = course.instructor ? `بإشراف ${course.instructor}` : '';
    const verdict = course.oneLineVerdict || course.synopsis || '';
    lines.push(`${index + 1}. [${course.title}](${courseUrl}) ${levelText} - ${instructorText}`);
    if (verdict) {
      lines.push(`   * الخلاصة: ${verdict}`);
    }
  });
  lines.push('');

  // 5. Digital Books & Guides (114 Books)
  lines.push('## 5. مكتبة الكتب والأدلة الرقمية الـ 114 (The 114 Digital Guides & Ebooks)');
  lines.push(`تضم مكتبة المنصة ${EBOOK_GUIDES.length} دليلاً وكتاباً تخصصياً متاحاً للقراءة والتصفح الفوري المجاني:`);
  lines.push(`- رابط المكتبة: ${BASE_URL}/?view=ebooks`);
  lines.push('');
  EBOOK_GUIDES.forEach((book, index) => {
    lines.push(`${index + 1}. **${book.title}** - المؤلف: ${book.author} (${book.pages}) - تصنيف: ${book.category}`);
    if (book.excerpt) {
      lines.push(`   * نبذة: ${book.excerpt}`);
    }
  });
  lines.push('');

  // 6. Legal & Policy Pages
  lines.push('## 6. الصفحات والسياسات القانونية (Legal & Transparency)');
  LEGAL_PAGES_LIST.forEach((page) => {
    const pageUrl = `${BASE_URL}/?view=legal&tab=${page.slug}`;
    lines.push(`- [${page.title}](${pageUrl}): ${page.summary || page.description || page.metaDescription}`);
  });
  lines.push('');

  return lines.join('\n');
}

export function writeLlmsTxt() {
  const content = generateLlmsText();
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Successfully generated ${outputPath} (${content.length} characters)`);
}

// تشغيل السكريبت مباشرة إذا تم استدعاؤه كملف رئيسي
if (process.argv[1] && process.argv[1].endsWith('generate-llms.mjs')) {
  writeLlmsTxt();
}
