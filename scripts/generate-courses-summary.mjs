import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function main() {
  const { INITIAL_COURSES } = await import('../src/data/courses.js');
  console.log(`Loaded ${INITIAL_COURSES.length} courses from courses.js`);

  const summaryCourses = INITIAL_COURSES.map((course) => {
    const primaryInstructor = course.instructors.find((i) => i.role === 'أساسي') || course.instructors[0] || null;
    const firstLesson = primaryInstructor?.lessons?.[0] || null;

    return {
      id: course.id,
      title: course.title,
      domainId: course.domainId,
      domainTitle: course.domainTitle,
      badge: course.badge || 'مسار معتمد',
      qualityBadge: course.qualityBadge || course.badge || 'الأفضل شمولاً',
      examCode: course.examCode || undefined,
      methodologyNote: course.methodologyNote || undefined,
      category: course.domainTitle,
      instructor: primaryInstructor ? primaryInstructor.name : (course.instructor || ''),
      verified: primaryInstructor ? primaryInstructor.verified : true,
      youtubeId: firstLesson?.videoId || primaryInstructor?.playlistId || course.youtubeId || 'wHIdCNIQHpo',
      youtubeVideoId: firstLesson?.videoId || primaryInstructor?.playlistId || course.youtubeVideoId || 'wHIdCNIQHpo',
      runtime: primaryInstructor?.durationText || course.runtime || '',
      viewsCount: Number(course.viewsCount || 0),
      level: course.level || 'مسار تأسيسي وشامل',
      rankOrder: Number(course.rankOrder || 1),
      orderIndex: Number(course.orderIndex || 1),
      featured: Boolean(course.featured),
      trending: Boolean(course.trending),
      isNewCourse: course.isNewCourse !== undefined ? Boolean(course.isNewCourse) : true,
      isToolGuide: Boolean(course.isToolGuide),
      isMonetization: Boolean(course.isMonetization),
      thumbnail: course.thumbnail || (firstLesson?.videoId ? `https://i.ytimg.com/vi/${firstLesson.videoId}/hqdefault.jpg` : ''),
      scores: course.scores || { depth: 9.8, practical: 9.7, freshness: 9.6, production: 9.6 },
      techStack: Array.isArray(course.techStack) ? course.techStack : [],
      oneLineVerdict: course.methodologyNote || course.oneLineVerdict || course.title,
      toolsSummary: course.toolsSummary || course.domainTitle,
      primaryTool: course.primaryTool || course.domainTitle,
      instructors: course.instructors.map((inst, idx) => ({
        id: inst.id || `inst-${idx + 1}`,
        name: inst.name || 'محاضر معتمد',
        role: inst.role || 'أساسي',
        language: inst.language || 'AR',
        verified: typeof inst.verified === 'boolean' ? inst.verified : true,
        lessonsCount: inst.lessonsCount || (inst.lessons ? inst.lessons.length : 0) || 0,
        durationText: inst.durationText || '',
        note: inst.note || '',
        playlistId: inst.playlistId || '',
        channelUrl: inst.channelUrl || '',
        firstVideoId: inst.lessons?.[0]?.videoId || '',
        lessons: []
      })),
      comments: []
    };
  });

  const content = `// بيانات بطاقات المسارات الأكاديمية الخفيفة لعام 2026 (Lightweight Courses Summary)
// مفصولة عن قوائم الفيديوهات التفصيلية (real-playlists.js) لتخفيض حزمة الصفحة الرئيسية First Load JS
import { SEED_CATEGORIES } from './categories.js';

export const HERO_LUXURY_BG = '/hero-bg.webp';

// أسماء الأقسام المعروضة في شريط التصنيفات السريع
export const VISIBLE_CATEGORY_IDS = [
  'الكل',
  ...SEED_CATEGORIES.map((c) => c.name)
];

export const TOP_DROPDOWN_DATA = [
  { id: 'أدوات', label: 'أدوات', subtitle: 'دليل وشروحات أقوى أدوات الذكاء الاصطناعي والبرمجة', badge: 'محدّث 2026' },
  { id: 'رائج', label: 'رائج', subtitle: 'الشروحات والدورات الأعلى مشاهدة وتقييماً هذا الأسبوع', badge: 'الأكثر طلباً' },
  { id: 'دورات جديدة', label: 'دورات جديدة', subtitle: 'أحدث الشروحات والمسارات المضافة لعام 2026', badge: 'جديد 2026' },
  { id: 'الربح من الإنترنت', label: 'الربح من الإنترنت', subtitle: 'طرق عملية مجربة لبناء دخل من منتجات الذكاء الاصطناعي', badge: 'مسار عملي' }
];

export const INSTRUCTOR_ROLES = ['أساسي', 'بديل معتمد', 'مكمل'];
export const INSTRUCTOR_LANGUAGES = ['AR', 'EN'];

export const INITIAL_COURSES_SUMMARY = ${JSON.stringify(summaryCourses, null, 2)};
`;

  const outputPath = path.join(rootDir, 'src', 'data', 'courses-summary.js');
  fs.writeFileSync(outputPath, content, 'utf-8');
  const stats = fs.statSync(outputPath);
  console.log(`Generated ${outputPath} (${(stats.size / 1024).toFixed(1)} KB) with ${summaryCourses.length} courses`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
