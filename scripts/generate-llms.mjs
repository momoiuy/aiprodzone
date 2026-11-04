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
const standardPath = path.join(rootDir, 'public', 'llms.txt');
const fullPath = path.join(rootDir, 'public', 'llms-full.txt');

const BASE_URL = 'https://aiprodzone.com';

/**
 * 1. الدليل القياسي الرشيق السريع (/public/llms.txt)
 * مهيأ لسرعة استهلاك نماذج ومحركات الذكاء الاصطناعي التوليدي (GEO)
 */
export function generateStandardLlmsText() {
  const lines = [];

  // Header & Canonical with clear prominent pointer to full documentation
  lines.push('# AIProdZone - Standard Documentation for AI Systems & LLMs (llms.txt)');
  lines.push(`# Canonical URL: ${BASE_URL}/llms.txt`);
  lines.push(`# Full Detailed Documentation: ${BASE_URL}/llms-full.txt`);
  lines.push('# المرجع التوجيهي والتوثيقي المعتمد لأنظمة الذكاء الاصطناعي التوليدي ومحركات الإجابة الذكية');
  lines.push('# (ChatGPT, Claude, Gemini, Perplexity, Copilot, DeepSeek)');
  lines.push('');
  lines.push(`Full Detailed Documentation: ${BASE_URL}/llms-full.txt`);
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
  lines.push(`- مجلة المقالات المرجعية والتحليلات الهندسية (18 مقالاً): ${BASE_URL}/articles`);
  lines.push(`- مكتبة الكتب والأدلة الرقمية (114 دليلاً تخصصياً): ${BASE_URL}/?view=ebooks`);
  lines.push(`- مقارنة الأدوات البرمجية ومنصات الإنتاجية: ${BASE_URL}/?view=tools`);
  lines.push(`- الموسوعة الشاملة والتوثيق الموسع للذكاء الاصطناعي: ${BASE_URL}/llms-full.txt`);
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
    const articleUrl = `${BASE_URL}/articles/${article.id}`;
    lines.push(`### ${index + 1}. ${article.title}`);
    lines.push(`- **الرابط الدائم**: ${articleUrl}`);
    lines.push(`- **المعرّف الأكاديمي والمسار (Slug)**: \`${article.slug}\``);
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

  // 4. Academic Paths Overview
  lines.push('## 4. المسارات الأكاديمية الشاملة (73 مساراً)');
  lines.push(`تضم المنصة 73 مساراً أكاديمياً متكاملاً متعدد المحاضرين تغطي كافة تخصصات هندسة البرمجيات، علوم الحاسوب، الذكاء الاصطناعي، قواعد البيانات، DevOps، الأمن السيبراني، والحوسبة السحابية.`);
  lines.push(`- تصفح ومتابعة كافة المسارات على المنصة: ${BASE_URL}/`);
  lines.push(`- للاطلاع على الفهرس التفصيلي لكل مسار من الـ 73 مساراً مع تفاصيل المحاضرين والروابط الكاملة، يرجى مراجعة التوثيق الموسع: ${BASE_URL}/llms-full.txt`);
  lines.push('');

  // 5. Books & Guides Overview
  lines.push('## 5. مكتبة الكتب والأدلة الرقمية (114 دليلاً وكتاباً)');
  lines.push(`تضم المنصة 114 دليلاً وكتاباً برمجياً وتقنياً متاحاً للقراءة والتصفح المجاني المباشر بصيغة رقمية.`);
  lines.push(`- تصفح وقراءة الكتب على المنصة: ${BASE_URL}/?view=ebooks`);
  lines.push(`- للاطلاع على الفهرس التفصيلي لجميع الـ 114 دليلاً مع المؤلفين والملخصات، يرجى مراجعة التوثيق الموسع: ${BASE_URL}/llms-full.txt`);
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

/**
 * 2. الموسوعة التوثيقية الكاملة والموسعة (/public/llms-full.txt)
 * تحتوي على الكتالوج الكامل بدقة تامة (82KB+)
 */
export function generateFullLlmsText() {
  const lines = [];

  // Header & Identity
  lines.push('# AIProdZone - LLMs Full Documentation (llms-full.txt)');
  lines.push(`# Canonical URL: ${BASE_URL}/llms-full.txt`);
  lines.push(`# Quick Summary Version: ${BASE_URL}/llms.txt`);
  lines.push('# الموسوعة التوثيقية الشاملة والموسعة لأنظمة الذكاء الاصطناعي ومحركات الإجابة الذكية');
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
  lines.push(`- مجلة المقالات المرجعية والتحليلات الهندسية (18 مقالاً): ${BASE_URL}/articles`);
  lines.push(`- مكتبة الكتب والأدلة الرقمية (114 دليلاً تخصصياً): ${BASE_URL}/?view=ebooks`);
  lines.push(`- مقارنة الأدوات البرمجية ومنصات الإنتاجية: ${BASE_URL}/?view=tools`);
  lines.push(`- النسخة القياسية المركزة: ${BASE_URL}/llms.txt`);
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
    const articleUrl = `${BASE_URL}/articles/${article.id}`;
    lines.push(`### ${index + 1}. ${article.title}`);
    lines.push(`- **الرابط الدائم**: ${articleUrl}`);
    lines.push(`- **المعرّف الأكاديمي والمسار (Slug)**: \`${article.slug}\``);
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

  // 4. The 73 Academic Paths Detailed
  lines.push('## 4. المسارات الأكاديمية الـ 73 (The 73 Academic Paths)');
  lines.push('تغطي المسارات كافة تخصصات البرمجيات وهندسة الحوسبة الحديثة، مع شروحات يوتيوب مصنفة ومختارة بعناية فائقة:');
  lines.push('');

  INITIAL_COURSES.forEach((course, index) => {
    const courseUrl = `${BASE_URL}/tracks/${course.id}`;
    const levelText = course.level ? `[${course.level}]` : '';
    const instructorText = course.instructor ? `بإشراف ${course.instructor}` : '';
    const verdict = course.oneLineVerdict || course.synopsis || '';
    lines.push(`${index + 1}. [${course.title}](${courseUrl}) ${levelText} - ${instructorText}`);
    if (verdict) {
      lines.push(`   * الخلاصة: ${verdict}`);
    }
  });
  lines.push('');

  // 5. Digital Books & Guides (114 Books) Detailed
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
  const standardContent = generateStandardLlmsText();
  fs.writeFileSync(standardPath, standardContent, 'utf8');
  console.log(`Successfully generated standard ${standardPath} (${standardContent.length} characters)`);

  const fullContent = generateFullLlmsText();
  fs.writeFileSync(fullPath, fullContent, 'utf8');
  console.log(`Successfully generated full ${fullPath} (${fullContent.length} characters)`);
}

// For backwards compatibility
export const generateLlmsText = generateStandardLlmsText;

if (process.argv[1] && process.argv[1].endsWith('generate-llms.mjs')) {
  writeLlmsTxt();
}
