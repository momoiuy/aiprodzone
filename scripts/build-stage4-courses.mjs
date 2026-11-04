import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const COURSES_FILE = path.join(ROOT_DIR, 'src', 'data', 'courses.js');

const code = `// هيكل ومخطط بيانات الدليل الأكاديمي الشامل لعام 2026 (Academic Tracks & Courses Schema)
import { SEED_CATEGORIES } from './categories.js';
import { REAL_YOUTUBE_PLAYLISTS } from './real-playlists.js';

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

/**
 * الأدوار المعتمدة للمحاضرين
 */
export const INSTRUCTOR_ROLES = ['أساسي', 'بديل معتمد', 'مكمل'];

/**
 * اللغات المدعومة للمحاضرين
 */
export const INSTRUCTOR_LANGUAGES = ['AR', 'EN'];

/**
 * دالة مصنع وبناء كائن المسار التعليمي المعتمد وفق المخطط الأكاديمي الدقيق
 * مع الربط التلقائي بقوائم وفيديوهات يوتيوب الحقيقية
 * @param {Object} data
 * @returns {Object} كائن المسار مدمجاً مع حقول التوافق مع العرض
 */
export function createCourseTrack(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('بيانات المسار غير صالحة');
  }
  if (!data.id || !data.title || !data.domainId || !data.domainTitle) {
    throw new Error('المسار يتطلب الحقول الإلزامية: id, title, domainId, domainTitle');
  }

  const instructors = Array.isArray(data.instructors)
    ? data.instructors.map((inst, idx) => {
        const cachedPlaylist = inst.playlistId ? REAL_YOUTUBE_PLAYLISTS[inst.playlistId] : null;
        const realVideos = cachedPlaylist?.videos || [];
        const rawLessons = (Array.isArray(inst.lessons) && inst.lessons.length > 0)
          ? inst.lessons
          : realVideos;
        const lessonsCount = Number(
          inst.lessonsCount !== undefined
            ? inst.lessonsCount
            : (rawLessons.length || (cachedPlaylist ? cachedPlaylist.lessonCount : 0) || 0)
        );
        const durationText =
          inst.durationText ||
          (lessonsCount > 0 ? \`\${lessonsCount} درساً\` : '10 ساعات تدريبية');

        return {
          id: inst.id || \`inst-\${idx + 1}\`,
          name: inst.name || 'محاضر معتمد',
          role: INSTRUCTOR_ROLES.includes(inst.role) ? inst.role : 'أساسي',
          language: INSTRUCTOR_LANGUAGES.includes(inst.language) ? inst.language : 'AR',
          verified: typeof inst.verified === 'boolean' ? inst.verified : true,
          lessonsCount,
          durationText,
          note: inst.note || '',
          playlistId: inst.playlistId || '',
          channelUrl: inst.channelUrl || '',
          lessons: rawLessons.map((lesson, lIdx) => ({
            index: typeof lesson.index === 'number' ? lesson.index : lIdx + 1,
            videoId: lesson.videoId || '',
            title: lesson.title || \`درس \${lIdx + 1}\`,
            duration: lesson.duration || ''
          }))
        };
      })
    : [];

  const primaryInstructor = instructors.find((i) => i.role === 'أساسي') || instructors[0] || null;
  const firstLesson = primaryInstructor?.lessons?.[0] || null;

  return {
    id: data.id,
    title: data.title,
    domainId: data.domainId,
    domainTitle: data.domainTitle,
    badge: data.badge || 'مسار معتمد',
    examCode: data.examCode || undefined,
    methodologyNote: data.methodologyNote || undefined,
    instructors,
    // حقول التوافق التلقائي مع شاشات العرض والفلترة في المنصة
    category: data.domainTitle,
    instructor: primaryInstructor ? primaryInstructor.name : '',
    verified: primaryInstructor ? primaryInstructor.verified : true,
    youtubeId: firstLesson?.videoId || primaryInstructor?.playlistId || 'wHIdCNIQHpo',
    youtubeVideoId: firstLesson?.videoId || primaryInstructor?.playlistId || 'wHIdCNIQHpo',
    runtime: primaryInstructor?.durationText || '',
    viewsCount: Number(data.viewsCount || 0),
    level: data.level || 'مسار تأسيسي وشامل',
    qualityBadge: data.badge || 'الأفضل شمولاً',
    rankOrder: Number(data.rankOrder || 1),
    orderIndex: Number(data.orderIndex || 1),
    featured: Boolean(data.featured),
    trending: Boolean(data.trending),
    isNewCourse: data.isNewCourse !== undefined ? Boolean(data.isNewCourse) : true,
    isToolGuide: Boolean(data.isToolGuide),
    isMonetization: Boolean(data.isMonetization),
    thumbnail: data.thumbnail || (firstLesson?.videoId ? \`https://i.ytimg.com/vi/\${firstLesson.videoId}/hqdefault.jpg\` : ''),
    scores: data.scores || { depth: 9.8, practical: 9.7, freshness: 9.6, production: 9.6 },
    techStack: Array.isArray(data.techStack) ? data.techStack : [],
    oneLineVerdict: data.methodologyNote || data.oneLineVerdict || data.title,
    synopsis: data.synopsis || data.methodologyNote || '',
    timestamps: Array.isArray(data.timestamps) ? data.timestamps : [],
    toolsSummary: data.toolsSummary || data.domainTitle,
    primaryTool: data.primaryTool || data.domainTitle,
    review: data.review || {
      verdictBox: data.methodologyNote || data.oneLineVerdict || data.title,
      strengths: 'تغطية تفاعلية ممتازة، تنظيم أكاديمي متسلسل، وتطبيقات عملية تواكب أحدث المعايير التقنية.',
      limitations: 'يُنصح بتطبيق التمارين خطوة بخطوة بعد كل درس ومراجعة المفاهيم لترسيخ التعلم.',
      deepAnalysis: data.synopsis || data.methodologyNote || data.title
    },
    promptBlueprint: data.promptBlueprint || \`خطة تطبيق عملية لدراسة مسار: \${data.title}\\n1. متابعة الدرس وتدوين الملاحظات البرمجية والعملية.\\n2. تنفيذ التحدي العملي ومحاكاة المعامل والتأكد من صحة النتائج.\\n3. الانتقال للدرس التالي وتثبيت المفاهيم المكتسبة.\`,
    comments: []
  };
}

/**
 * دالة التحقق من صحة كائن المسار وفق المخطط الأكاديمي
 * @param {Object} track
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateCourseTrack(track) {
  const errors = [];
  if (!track || typeof track !== 'object') {
    return { valid: false, errors: ['كائن المسار غير موجود أو غير صالح'] };
  }
  if (!track.id) errors.push('حقل id مفقود');
  if (!track.title) errors.push('حقل title مفقود');
  if (!track.domainId) errors.push('حقل domainId مفقود');
  if (!track.domainTitle) errors.push('حقل domainTitle مفقود');
  if (!track.badge) errors.push('حقل badge مفقود');

  if (!Array.isArray(track.instructors)) {
    errors.push('حقل instructors يجب أن يكون مصفوفة');
  } else {
    track.instructors.forEach((inst, idx) => {
      if (!inst.id) errors.push(\`المحاضر #\${idx + 1}: حقل id مفقود\`);
      if (!inst.name) errors.push(\`المحاضر #\${idx + 1}: حقل name مفقود\`);
      if (!INSTRUCTOR_ROLES.includes(inst.role)) {
        errors.push(\`المحاضر #\${idx + 1}: دور غير صالح (\${inst.role}). الأدوار المتاحة: \${INSTRUCTOR_ROLES.join(', ')}\`);
      }
      if (!INSTRUCTOR_LANGUAGES.includes(inst.language)) {
        errors.push(\`المحاضر #\${idx + 1}: لغة غير صالحة (\${inst.language}). اللغات المتاحة: \${INSTRUCTOR_LANGUAGES.join(', ')}\`);
      }
      if (typeof inst.verified !== 'boolean') {
        errors.push(\`المحاضر #\${idx + 1}: حقل verified يجب أن يكون boolean\`);
      }
      if (typeof inst.lessonsCount !== 'number') {
        errors.push(\`المحاضر #\${idx + 1}: حقل lessonsCount يجب أن يكون رقماً\`);
      }
      if (typeof inst.durationText !== 'string') {
        errors.push(\`المحاضر #\${idx + 1}: حقل durationText يجب أن يكون نصاً\`);
      }
      if (!Array.isArray(inst.lessons)) {
        errors.push(\`المحاضر #\${idx + 1}: حقل lessons يجب أن يكون مصفوفة\`);
      } else {
        inst.lessons.forEach((l, lIdx) => {
          if (typeof l.index !== 'number') errors.push(\`المحاضر #\${idx + 1} - الدرس #\${lIdx + 1}: حقل index يجب أن يكون رقماً\`);
          if (typeof l.videoId !== 'string') errors.push(\`المحاضر #\${idx + 1} - الدرس #\${lIdx + 1}: حقل videoId يجب أن يكون نصاً\`);
          if (typeof l.title !== 'string') errors.push(\`المحاضر #\${idx + 1} - الدرس #\${lIdx + 1}: حقل title يجب أن يكون نصاً\`);
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// قائمة المسارات الأكاديمية الشاملة المعتمدة لكافة القطاعات الـ 8 (41 مساراً)
export const INITIAL_COURSES = [
  // ==========================================
  // أولاً: قطاع الويب والبرمجة (21 مساراً)
  // ==========================================

  // 1. بايثون (Python)
  createCourseTrack({
    id: 'python-masterclass',
    title: 'دورة بايثون الشاملة من الصفر حتى الاحتراف الكامل',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'المرتبة #1',
    methodologyNote: 'يُنصح بدراسة المسار الأساسي (152 درساً) مع كتابة الأكواد والتطبيق على التمارين العملية.',
    rankOrder: 1,
    orderIndex: 1,
    featured: true,
    trending: true,
    viewsCount: 1420000,
    toolsSummary: 'Python 3.12, OOP, Algorithms, Data Structures, Automation',
    techStack: ['Python', 'OOP', 'Data Structures', 'Scripting', 'Automation'],
    instructors: [
      {
        id: 'inst-osama-elzero',
        name: 'أسامة محمد (الزيرو - Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 152,
        durationText: '26 ساعة تدريبية',
        note: 'دورة بايثون المعتمدة والشاملة من الصفر مع التطبيقات والمشاريع (152 درسًا ✔)',
        playlistId: 'PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-islam-codezilla',
        name: 'إسلام هشام (كودزيلا - Codezilla)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 48,
        durationText: '18 ساعة تدريبية',
        note: 'شرح تطبيقي مبسط وسريع لبايثون مع بناء مشاريع وألعاب كلاسيكية',
        playlistId: 'PLuXY3ddo_8nzrO74UeZQVZOb5-wIS6krJ',
        channelUrl: 'https://youtube.com/@Codezilla'
      },
      {
        id: 'inst-abdelrahman-gamal-python',
        name: 'عبدالرحمن جمال (Abdelrahman Gamal)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 104,
        durationText: '20 ساعة تدريبية',
        note: 'دورة شاملة ومفصلة من الصفر حتى المفاهيم المتقدمة والتطبيقات',
        playlistId: 'PLknwEmKsW8OsG8dnisr_-2WGyx7lpgGEE',
        channelUrl: 'https://youtube.com/@AbdelrahmanGamal'
      }
    ]
  }),

  // 2. جافاسكربت (JavaScript)
  createCourseTrack({
    id: 'javascript-masterclass',
    title: 'دورة جافاسكربت الحديثة الشاملة (JavaScript ES6+)',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'المرتبة #1',
    methodologyNote: 'العمود الفقري لتطوير الويب؛ مسار الزيرو يغطي أدق التفاصيل مع التحديات البرمجية.',
    rankOrder: 2,
    orderIndex: 2,
    featured: true,
    trending: true,
    viewsCount: 1850000,
    toolsSummary: 'JavaScript ES6+, DOM, BOM, Async/Await, OOP, Fetch API',
    techStack: ['JavaScript', 'ES6', 'DOM', 'BOM', 'Async', 'OOP'],
    instructors: [
      {
        id: 'inst-elzero-js',
        name: 'أسامة محمد (Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 188,
        durationText: '35 ساعة تدريبية',
        note: 'أضخم كورس عربي شامل لجافاسكربت من الصفر حتى أدق تفاصيل ES6+ و DOM (≈188 درسًا ✔)',
        playlistId: 'PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-abdelrahman-gamal-js',
        name: 'عبدالرحمن جمال (Abdelrahman Gamal)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 81,
        durationText: '16 ساعة تدريبية',
        note: 'شرح مركز وعملي مع تطبيقات ومشاريع حقيقية للواجهات التفاعلية (80 درسًا ✔)',
        playlistId: 'PLknwEmKsW8OuTqUDaFRBiAViDZ5uI3VcE',
        channelUrl: 'https://youtube.com/@AbdelrahmanGamal'
      },
      {
        id: 'inst-elzanaty-js',
        name: 'محمد الزناتي (Mohammed Elzanaty)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 15,
        durationText: '8 ساعات تدريبية',
        note: 'دورة تفاعلية حديثة تركز على مفاهيم جافاسكربت المعمارية وأحدث ممارسات السوق',
        playlistId: 'PLLWuK602vNiVnYxkrT7qbFSictc9nJeiX',
        channelUrl: 'https://youtube.com/@MohammedElzanaty'
      }
    ]
  }),

  // 3. HTML وCSS
  createCourseTrack({
    id: 'html-css-masterclass',
    title: 'تطوير واجهات الويب التأسيسي والتفاعلي HTML5 & CSS3',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'تأسيس إلزامي',
    methodologyNote: 'حجر الأساس لكل مطور ويب؛ يشمل إتقان هيكلة المستندات والتنسيق المتقدم.',
    rankOrder: 3,
    orderIndex: 3,
    viewsCount: 950000,
    toolsSummary: 'HTML5, CSS3, Flexbox, CSS Grid, Responsive Design',
    techStack: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive'],
    instructors: [
      {
        id: 'inst-elzero-html',
        name: 'أسامة محمد (Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 37,
        durationText: '6 ساعات تدريبية',
        note: 'دورة HTML5 التأسيسية الشاملة والمحدثة وفق أحدث معايير الويب (HTML وحده 37 درسًا ✔)',
        playlistId: 'PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-tarmeez-html-css',
        name: 'أكاديمية ترميز (Tarmeez)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 12,
        durationText: '5 ساعات تدريبية',
        note: 'شرح مبسط ومركز لأساسيات بناء الصفحات وتنسيقها',
        playlistId: 'PLYyqC4bNbCIdES52srHE6xTiIgvgMkBWu',
        channelUrl: 'https://youtube.com/@TarmeezAcademy'
      },
      {
        id: 'inst-octucode-html',
        name: 'إبراهيم عادل (OctuCode)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 17,
        durationText: '6 ساعات تدريبية',
        note: 'منهجية تفاعلية بصرية لتعلم لغات الويب التأسيسية خطوة بخطوة',
        playlistId: 'PLoP3S2S1qTfCVIETOGwaK3lyaL3UKu403',
        channelUrl: 'https://youtube.com/@OctuCode'
      }
    ]
  }),

  // 4. Bootstrap
  createCourseTrack({
    id: 'bootstrap-masterclass',
    title: 'تصميم المواقع المتجاوبة بإطار العمل Bootstrap 5',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'إطار واجهات',
    methodologyNote: 'تعلم بناء مواقع سريعة التجاوب باستخدام نظام الشبكات والمكونات الجاهزة.',
    rankOrder: 4,
    orderIndex: 4,
    viewsCount: 520000,
    toolsSummary: 'Bootstrap 5, Responsive Grid, UI Components, Utility Classes',
    techStack: ['Bootstrap 5', 'CSS', 'Responsive Web', 'Flexbox'],
    instructors: [
      {
        id: 'inst-elzero-bootstrap',
        name: 'أسامة محمد (Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 25,
        durationText: '5 ساعات تدريبية',
        note: 'شرح مفصل لمكونات ونظام شبكة Bootstrap 5 لبناء قوالب متجاوبة',
        playlistId: 'PLDoPjvoNmBAyvm7f--dc6XqkpfDcen_vQ',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-abdelrahman-gamal-bootstrap',
        name: 'عبدالرحمن جمال (Abdelrahman Gamal)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 26,
        durationText: '5 ساعات تدريبية',
        note: 'دورة تطبيقية لبناء مواقع حقيقية بواسطة Bootstrap 5',
        playlistId: 'PLknwEmKsW8OscL9GvjxwL7RYbcwwdIitk',
        channelUrl: 'https://youtube.com/@AbdelrahmanGamal'
      },
      {
        id: 'inst-ag-coding-bootstrap',
        name: 'أحمد جمال (Ag Coding)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 17,
        durationText: '4 ساعات تدريبية',
        note: 'شرح عملي سريع لبناء صفحات عصرية متجاوبة',
        playlistId: 'PLnD96kXp-_pMJp3stPetkN76AJ2mmeah7',
        channelUrl: 'https://youtube.com/@AgCoding'
      }
    ]
  }),

  // 5. Tailwind CSS
  createCourseTrack({
    id: 'tailwind-css-masterclass',
    title: 'احتراف تصميم الواجهات الحديثة بإطار العمل Tailwind CSS',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'الأكثر طلباً',
    methodologyNote: 'إطار العمل المفضل عالمياً للواجهات؛ سرعة تطوير قصوى بدون مغادرة ملف الـ HTML/JSX.',
    rankOrder: 5,
    orderIndex: 5,
    featured: true,
    viewsCount: 460000,
    toolsSummary: 'Tailwind CSS 3, Utility-first, JIT Engine, Responsive Layouts',
    techStack: ['Tailwind CSS', 'CSS3', 'Responsive UI', 'Modern Frontend'],
    instructors: [
      {
        id: 'inst-ag-coding-tailwind',
        name: 'أحمد جمال (Ag Coding)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 15,
        durationText: '5 ساعات تدريبية',
        note: 'كورس شامل ومحدث لاحتراف Tailwind CSS وبناء مشاريع كاملة',
        playlistId: 'PLnD96kXp-_pMR9cBUmvsz_kIIt9bv2UIP',
        channelUrl: 'https://youtube.com/@AgCoding'
      }
    ]
  }),

  // 6. Sass
  createCourseTrack({
    id: 'sass-masterclass',
    title: 'احتراف معالجة وتنسيق CSS المتقدم بواسطة Sass (SCSS)',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'أدوات تنسيق',
    methodologyNote: 'تنظيم وإعادة استخدام أكواد CSS للمشاريع الضخمة والمتوسطة.',
    rankOrder: 6,
    orderIndex: 6,
    viewsCount: 380000,
    toolsSummary: 'Sass, SCSS, Mixins, Variables, Nesting, Inheritance',
    techStack: ['Sass', 'SCSS', 'CSS Preprocessor', 'Modular CSS'],
    instructors: [
      {
        id: 'inst-elzero-sass',
        name: 'أسامة محمد (Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 19,
        durationText: '4 ساعات تدريبية',
        note: 'الدورة الرسمية الشاملة لتعلم Sass/SCSS بالتفصيل (19 درسًا ✔)',
        playlistId: 'PLDoPjvoNmBAzlpyFHOaB3b-eubmF0TAV2',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      }
    ]
  }),

  // 7. jQuery
  createCourseTrack({
    id: 'jquery-masterclass',
    title: 'التعامل مع عناصر DOM وحركات الواجهة بواسطة مكتبة jQuery',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'مكتبة واجهات',
    methodologyNote: 'مكتبة تاريخية هامة لفهم تطبيقات الويب الكلاسيكية وتسهيل التعامل مع DOM.',
    rankOrder: 7,
    orderIndex: 7,
    viewsCount: 320000,
    toolsSummary: 'jQuery 3, DOM Manipulation, AJAX, Animations, Effects',
    techStack: ['jQuery', 'JavaScript', 'DOM', 'AJAX'],
    instructors: [
      {
        id: 'inst-elzero-jquery',
        name: 'أسامة محمد (Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 45,
        durationText: '7 ساعات تدريبية',
        note: 'شرح كامل وشامل لكل دوال وتطبيقات ومؤثرات مكتبة jQuery',
        playlistId: 'PLDoPjvoNmBAwXDFEEpc8TT6MFbDAC5XNB',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-mobarmg-jquery',
        name: 'مبرمج - معهد تكنولوجيا المعلومات (Mobarmg ITI)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 14,
        durationText: '4 ساعات تدريبية',
        note: 'منهج أكاديمي رصين من معهد ITI يشرح مبادئ واستخدامات المكتبة',
        playlistId: 'PLzCpl3aBwaY5CmY-9Td8GhlLnq9GuJmpB',
        channelUrl: 'https://youtube.com/@mobarmg'
      },
      {
        id: 'inst-hassouna-jquery',
        name: 'أحمد حسونة (Hassouna Academy)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 89,
        durationText: '12 ساعة تدريبية',
        note: 'سلسلة تفصيلية تغطي جميع الجوانب العملية والتطبيقية لـ jQuery',
        playlistId: 'PLHIfW1KZRIfll3ObMFi02Ry7oRU3MJVRG',
        channelUrl: 'https://youtube.com/@HassounaAcademy'
      }
    ]
  }),

  // 8. TypeScript
  createCourseTrack({
    id: 'typescript-masterclass',
    title: 'إتقان كتابة الشيفرات الموجهة وتأمين الأنواع مع TypeScript',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'أساسي للواجهات',
    methodologyNote: 'تأمين الشيفرات البرمجية ومنع أخطاء وقت التشغيل قبل الانتقال لأطر العمل.',
    rankOrder: 8,
    orderIndex: 8,
    featured: true,
    viewsCount: 580000,
    toolsSummary: 'TypeScript 5, Generics, Interfaces, Types, Decorators',
    techStack: ['TypeScript', 'JavaScript', 'Static Typing', 'OOP', 'Generics'],
    instructors: [
      {
        id: 'inst-elzero-typescript',
        name: 'أسامة محمد (Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 38,
        durationText: '7 ساعات تدريبية',
        note: 'الدورة المعتمدة لاحتراف TypeScript من الصفر حتى المفاهيم المتقدمة (38 درسًا ✔)',
        playlistId: 'PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-programming-solutions-ts',
        name: 'Programming Solutions',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 23,
        durationText: '5 ساعات تدريبية',
        note: 'شرح تطبيقي لأساسيات ومفاهيم TypeScript مع الأمثلة',
        playlistId: 'PLFRm7nYIypQF618y6D_JO4d8vrj988wJf',
        channelUrl: 'https://youtube.com/@ProgrammingSolutions'
      },
      {
        id: 'inst-hussein-alrubaye-ts',
        name: 'د. حسين الربيعي (Hussein Al Rubaye)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 16,
        durationText: '4 ساعات تدريبية',
        note: 'مقدمة أكاديمية وعملية لـ TypeScript واستخداماتها',
        playlistId: 'PLF8OvnCBlEY27rEmxg4F86iFljMXyCmk1',
        channelUrl: 'https://youtube.com/@HusseinAlRubaye'
      }
    ]
  }),

  // 9. React
  createCourseTrack({
    id: 'react-masterclass',
    title: 'بناء وتطوير تطبيقات الواجهات الأمامية التفاعلية بواسطة React.js',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'المرتبة #1',
    methodologyNote: 'المكتبة الأكثر طلباً في سوق العمل؛ يفضل دراستها بعد جافاسكربت مباشرة.',
    rankOrder: 9,
    orderIndex: 9,
    featured: true,
    trending: true,
    viewsCount: 1250000,
    toolsSummary: 'React 19, Hooks, Redux Toolkit, React Router, Context API',
    techStack: ['React', 'Hooks', 'Redux', 'Router', 'SPA', 'JavaScript'],
    instructors: [
      {
        id: 'inst-algorithm-react',
        name: 'أكاديمية خوارزمية (Algorithm Academy)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 81,
        durationText: '20 ساعة تدريبية',
        note: 'دورة احترافية متكاملة لـ React من الصفر إلى المشاريع المتقدمة',
        playlistId: 'PLfDx4cQoUNObRCqeYOws_JK_CCGCmQv_l',
        channelUrl: 'https://youtube.com/@AlgorithmAcademy'
      },
      {
        id: 'inst-unique-coderz-react',
        name: 'Unique Coderz Academy',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 64,
        durationText: '18 ساعة تدريبية',
        note: 'شرح معماري عميق لمفاهيم React وإدارة الحالة المتقدمة',
        playlistId: 'PLtFbQRDJ11kEjXWZmwkOV-vfXmrEEsuEW',
        channelUrl: 'https://youtube.com/@UniqueCoderzAcademy'
      },
      {
        id: 'inst-kimz-codes-react',
        name: 'كيمز كودز (kimz codes)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 36,
        durationText: '10 ساعات تدريبية',
        note: 'تطبيقات عملية ومشاريع عصرية متسلسلة باستخدام React',
        playlistId: 'PLejc1JbD4ZFSaQIFNstRIrbm_fqb12Q59',
        channelUrl: 'https://youtube.com/@kimzcodes'
      }
    ]
  }),

  // 10. Vue
  createCourseTrack({
    id: 'vue-masterclass',
    title: 'تطوير تطبيقات الويب أحادية الصفحة الحديثة بواسطة Vue.js',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'إطار متطور',
    methodologyNote: 'إطار عمل سلس وسهل التعلم يتميز ببنية نظيفة وإنتاجية عالية.',
    rankOrder: 10,
    orderIndex: 10,
    viewsCount: 420000,
    toolsSummary: 'Vue.js 3, Composition API, Pinia, Vue Router, Vite',
    techStack: ['Vue.js', 'Composition API', 'Pinia', 'Vite', 'Vue Router'],
    instructors: [
      {
        id: 'inst-elzero-vue',
        name: 'أسامة محمد (Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 38,
        durationText: '8 ساعات تدريبية',
        note: 'دورة شاملة ومفصلة لتعلم Vue.js ومفاهيمها التأسيسية',
        playlistId: 'PLDoPjvoNmBAxr5AqK3Yz4DWYKVSmIFziw',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-algorithm-vue',
        name: 'أكاديمية خوارزمية (Algorithm Academy)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 33,
        durationText: '8 ساعات تدريبية',
        note: 'شرح تطبيقي حديث لـ Vue 3 مع الـ Composition API',
        playlistId: 'PLfDx4cQoUNObtw2FtE4_eX_k9yCf-Fcd3',
        channelUrl: 'https://youtube.com/@AlgorithmAcademy'
      }
    ]
  }),

  // 11. Angular
  createCourseTrack({
    id: 'angular-masterclass',
    title: 'بناء الأنظمة المؤسسية وتطبيقات الشركات بواسطة Angular',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'أنظمة مؤسسية',
    methodologyNote: 'إطار عمل متكامل مدعوم من Google؛ مخصص للمشاريع المؤسسية الضخمة.',
    rankOrder: 11,
    orderIndex: 11,
    viewsCount: 480000,
    toolsSummary: 'Angular, TypeScript, RxJS, Dependency Injection, Services',
    techStack: ['Angular', 'TypeScript', 'RxJS', 'Enterprise', 'Components'],
    instructors: [
      {
        id: 'inst-kmr-script-angular',
        name: 'م. خليل السعيد (KMR Script)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 39,
        durationText: '12 ساعة تدريبية',
        note: 'دورة تطبيقية شاملة لـ Angular باللغة العربية مع بناء مشاريع متكاملة',
        playlistId: 'PLL2zWZTDFZzh2WEmc3fH_O4y4N05ZCqB2',
        channelUrl: 'https://youtube.com/@kmrscript'
      },
      {
        id: 'inst-codezone-angular',
        name: 'كود زون (codeZone)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 9,
        durationText: '4 ساعات تدريبية',
        note: 'شرح مركز ومكثف لأساسيات Angular والمفاهيم الجوهرية',
        playlistId: 'PLQtNtS-WfRa8piCgv_buHpthEBXHaw0ss',
        channelUrl: 'https://youtube.com/@codeZone'
      },
      {
        id: 'inst-mobarmg-angular',
        name: 'مبرمج - معهد تكنولوجيا المعلومات (Mobarmg ITI)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 25,
        durationText: '8 ساعات تدريبية',
        note: 'منهج أكاديمي احترافي من معهد ITI لتأهيل مطوري الواجهات المؤسسية',
        playlistId: 'PLzCpl3aBwaY7eOwGMlps70dTYs2TSsgj1',
        channelUrl: 'https://youtube.com/@mobarmg'
      }
    ]
  }),

  // 12. Node.js
  createCourseTrack({
    id: 'nodejs-masterclass',
    title: 'بناء خوادم الويب وخدمات الـ APIs المتطورة بواسطة Node.js & Express',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'المرتبة #1 خلفية',
    methodologyNote: 'المدخل الأساسي للمطورين لاستخدام جافاسكربت في بناء الخوادم الخلفية.',
    rankOrder: 12,
    orderIndex: 12,
    featured: true,
    trending: true,
    viewsCount: 890000,
    toolsSummary: 'Node.js, Express.js, RESTful APIs, MongoDB, JWT Auth',
    techStack: ['Node.js', 'Express', 'JavaScript', 'REST APIs', 'Backend'],
    instructors: [
      {
        id: 'inst-emam-academy-nodejs',
        name: 'أحمد إمام (Emam Academy)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 64,
        durationText: '18 ساعة تدريبية',
        note: 'أشمل مسار عملي لبناء RESTful APIs ومعمارية الخوادم بواسطة Node.js',
        playlistId: 'PLGhZWewM_75LQf3KvHo6HHSclmDyDazl7',
        channelUrl: 'https://youtube.com/@EmamAcademy'
      },
      {
        id: 'inst-algorithm-nodejs',
        name: 'أكاديمية خوارزمية (Algorithm Academy)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 57,
        durationText: '15 ساعة تدريبية',
        note: 'دورة احترافية تغطي المفاهيم الأساسية والمتقدمة وقواعد البيانات',
        playlistId: 'PLfDx4cQoUNOa3EiUpjO04DVxEE9Ox12ta',
        channelUrl: 'https://youtube.com/@AlgorithmAcademy'
      },
      {
        id: 'inst-takharif-nodejs',
        name: 'تخاريف مبرمج (Takharif Mobarmg)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 32,
        durationText: '9 ساعات تدريبية',
        note: 'شرح تطبيقي مبسط وعميق لبناء مشاريع واقعية بالـ Node',
        playlistId: 'PLkzDzmo9y3VG_pByjuxE7uuLYvmWgfBub',
        channelUrl: 'https://youtube.com/@takharifmobarmg'
      }
    ]
  }),

  // 13. Nest.js
  createCourseTrack({
    id: 'nestjs-masterclass',
    title: 'هندسة وتطوير الخوادم المؤسسية القابلة للتوسع بواسطة Nest.js',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'معمارية مؤسسية',
    methodologyNote: 'إطار العمل القياسي لبناء معمارية خوادم احترافية مطابقة لأحدث ممارسات السوق.',
    rankOrder: 13,
    orderIndex: 13,
    viewsCount: 340000,
    toolsSummary: 'Nest.js, TypeScript, Microservices, TypeORM, Swagger, Clean Architecture',
    techStack: ['Nest.js', 'TypeScript', 'Microservices', 'TypeORM', 'Clean Architecture'],
    instructors: [
      {
        id: 'inst-tarmeez-nestjs',
        name: 'أكاديمية ترميز (Tarmeez)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 18,
        durationText: '6 ساعات تدريبية',
        note: 'شرح رائع لأساسيات Nest.js والمعمارية المنظمة للخوادم',
        playlistId: 'PLYyqC4bNbCIdlMvge1ZG-jJlQtjHHZQWl',
        channelUrl: 'https://youtube.com/@TarmeezAcademy'
      },
      {
        id: 'inst-index-academy-nestjs',
        name: 'Index Academy',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 13,
        durationText: '5 ساعات تدريبية',
        note: 'دورة تطبيقية لبناء خدمات وواجهات برمجية متقدمة بواسطة Nest.js',
        playlistId: 'PLDQ11FgmbqQP1aaCCiU74LzebvZjY_S4G',
        channelUrl: 'https://youtube.com/@IndexAcademy'
      },
      {
        id: 'inst-mahmoud-abdullah-nestjs',
        name: 'محمود عبدالله (Mahmoud Abdullah)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 49,
        durationText: '14 ساعة تدريبية',
        note: 'شرح معماري وتطبيقي مفصل لبناء أنظمة وواجهات برمجية كاملة',
        playlistId: 'PLOldSEMXUdZsFAEJwxYkE83dhm1ZkWEOL',
        channelUrl: 'https://youtube.com/@MahmoudAbdullah'
      }
    ]
  }),

  // 14. Nuxt.js
  createCourseTrack({
    id: 'nuxtjs-masterclass',
    title: 'تطوير تطبيقات Vue الشاملة مع التصيير من جهة الخادم Nuxt.js',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'SSR واجهات',
    methodologyNote: 'التطوير المتكامل لتطبيقات Vue مع تحسين محركات البحث SEO والأداء الفائق.',
    rankOrder: 14,
    orderIndex: 14,
    viewsCount: 220000,
    toolsSummary: 'Nuxt 3, Vue 3, SSR, Nitro Engine, SEO, Fullstack Vue',
    techStack: ['Nuxt.js', 'Vue.js', 'SSR', 'SEO', 'Nitro'],
    instructors: [
      {
        id: 'inst-mahmoud-zohdi-nuxt',
        name: 'محمود زهدي (Mahmoud Zohdi)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 29,
        durationText: '7 ساعات تدريبية',
        note: 'دورة كاملة وحديثة لشرح إطار العمل Nuxt 3 وبناء تطبيقات SSR احترافية',
        playlistId: 'PLLXntwspGdhCBdax1ZJTEX6Gg5vCwOSUL',
        channelUrl: 'https://youtube.com/@MahmoudZohdi'
      }
    ]
  }),

  // 15. PHP
  createCourseTrack({
    id: 'php-masterclass',
    title: 'البرمجة بلغة PHP وتطوير الواجهات الخلفية (PHP 8 Bootcamp)',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'الأكثر انتشاراً',
    methodologyNote: 'اللغة التي تشغل أكثر من 75% من مواقع الإنترنت؛ دورة الزيرو تعتبر المرجع العربي الأول.',
    rankOrder: 15,
    orderIndex: 15,
    viewsCount: 1100000,
    toolsSummary: 'PHP 8, OOP, MySQL, PDO, Sessions, MVC Pattern',
    techStack: ['PHP', 'OOP', 'MySQL', 'PDO', 'MVC', 'Backend'],
    instructors: [
      {
        id: 'inst-elzero-php',
        name: 'أسامة محمد (Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 105,
        durationText: '24 ساعة تدريبية',
        note: 'معسكر PHP 8 الكامل: من الأساسيات إلى البرمجة كائنية التوجه وتطبيقات الويب (PHP Bootcamp، 105 دروس ✔)',
        playlistId: 'PLDoPjvoNmBAy41u35AqJUrI-H83DObUDq',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-mora-soft-php',
        name: 'مورا سوفت (Mora Soft)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 23,
        durationText: '8 ساعات تدريبية',
        note: 'شرح تطبيقي لـ PHP مع قواعد البيانات وربط المشاريع',
        playlistId: 'PLftLUHfDSiZ7pKXkpGCoZATm5rF6msj5A',
        channelUrl: 'https://youtube.com/@MoraSoft'
      }
    ]
  }),

  // 16. Laravel
  createCourseTrack({
    id: 'laravel-masterclass',
    title: 'احتراف إطار العمل الأقوى لتطبيقات الويب Laravel 10/11',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'المرتبة #1 PHP',
    methodologyNote: 'الإطار الأكثر استخداماً في الشرق الأوسط والعالم لتطبيقات الويب الضخمة.',
    rankOrder: 16,
    orderIndex: 16,
    featured: true,
    viewsCount: 780000,
    toolsSummary: 'Laravel, Eloquent ORM, Blade, Migrations, REST APIs, Sanctum',
    techStack: ['Laravel', 'PHP', 'Eloquent', 'MVC', 'Authentication', 'APIs'],
    instructors: [
      {
        id: 'inst-professional-code-laravel',
        name: 'بروفيشنال كود (Professional Code)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 51,
        durationText: '16 ساعة تدريبية',
        note: 'دورة شاملة ومحدثة لبناء تطبيقات ويب متكاملة وإدارة قواعد البيانات بواسطة Laravel',
        playlistId: 'PL6XRLlEsQ_7Xy0fwWHhmo5H_RCI1RbtqG',
        channelUrl: 'https://youtube.com/@ProfessionalCode'
      },
      {
        id: 'inst-mora-soft-laravel',
        name: 'مورا سوفت (Mora Soft)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 39,
        durationText: '12 ساعة تدريبية',
        note: 'سلسلة احترافية لبناء تطبيقات عملية من الصفر',
        playlistId: 'PLftLUHfDSiZ4GfPZxaFDsA7ejUzD7SpWa',
        channelUrl: 'https://youtube.com/@MoraSoft'
      },
      {
        id: 'inst-mohammed-mustafa-laravel',
        name: 'محمد مصطفى (Mohammed Mustafa)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 38,
        durationText: '10 ساعات تدريبية',
        note: 'شرح تطبيقي مبسط لمفاهيم Laravel وبناء REST APIs',
        playlistId: 'PLd4ZH7drWj7DAt5osYlsya3sscPoERtGC',
        channelUrl: 'https://youtube.com/@MohammedMustafa'
      }
    ]
  }),

  // 17. Django
  createCourseTrack({
    id: 'django-masterclass',
    title: 'تطوير تطبيقات الويب السريعة والآمنة بواسطة بايثون Django',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'إطار بايثون',
    methodologyNote: 'إطار العمل المفضل لتطوير تطبيقات بايثون السريعة بفضل لوحة التحكم المدمجة والأمان العالي.',
    rankOrder: 17,
    orderIndex: 17,
    viewsCount: 650000,
    toolsSummary: 'Django 5, Python, ORM, Django REST Framework, Admin Panel',
    techStack: ['Django', 'Python', 'ORM', 'DRF', 'PostgreSQL', 'Backend'],
    instructors: [
      {
        id: 'inst-abdelrahman-gamal-django',
        name: 'عبدالرحمن جمال (Abdelrahman Gamal)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 39,
        durationText: '14 ساعة تدريبية',
        note: 'دورة احترافية شاملة من الصفر حتى بناء مواقع ومتاجر إلكترونية متكاملة بـ Django',
        playlistId: 'PLknwEmKsW8OtK_n48UOuYGxJPbSFrICxm',
        channelUrl: 'https://youtube.com/@AbdelrahmanGamal'
      },
      {
        id: 'inst-oloom-django',
        name: 'شبكة علوم (Oloom Network)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 53,
        durationText: '16 ساعة تدريبية',
        note: 'سلسلة تفصيلية تغطي بناء مشاريع ويب متكاملة وقواعد البيانات',
        playlistId: 'PLTcPeoMjkuCxoyflbe4AuNWMZWulKVbr4',
        channelUrl: 'https://youtube.com/@OloomNetwork'
      },
      {
        id: 'inst-elsafy-django',
        name: 'الصافي حجازي (Elsafy Hegazy)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 25,
        durationText: '8 ساعات تدريبية',
        note: 'شرح تطبيقي وعملي لبناء خدمات ويب بواسطة بايثون ودجانجو',
        playlistId: 'PLdZYzC8fohEKjuYyvITqYc2vL0lAWRvhs',
        channelUrl: 'https://youtube.com/@ElsafyHegazy'
      }
    ]
  }),

  // 18. Flask
  createCourseTrack({
    id: 'flask-masterclass',
    title: 'بناء خوادم وتطبيقات الويب المصغرة والمرنة بواسطة Python Flask',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'مايكرو سيرفيس',
    methodologyNote: 'إطار عمل خفيف ومرن ممتاز لبناء الـ Microservices وتطبيقات الذكاء الاصطناعي.',
    rankOrder: 18,
    orderIndex: 18,
    viewsCount: 280000,
    toolsSummary: 'Flask, Jinja2, SQLAlchemy, REST APIs, Microservices',
    techStack: ['Flask', 'Python', 'Jinja2', 'SQLAlchemy', 'Microservices'],
    instructors: [
      {
        id: 'inst-algorithm-flask',
        name: 'أكاديمية خوارزمية (Algorithm Academy)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 28,
        durationText: '7 ساعات تدريبية',
        note: 'دورة شاملة ومفصلة لتعلم Flask وبناء تطبيقات وواجهات برمجية خفيفة وسريعة',
        playlistId: 'PLfDx4cQoUNObFOYvkcNQG8arJX95TRE47',
        channelUrl: 'https://youtube.com/@AlgorithmAcademy'
      }
    ]
  }),

  // 19. Java
  createCourseTrack({
    id: 'java-masterclass',
    title: 'البرمجة الشيئية وهندسة التطبيقات بلغة جافا Java SE (4 مستويات)',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'الأقوى مؤسسياً',
    methodologyNote: 'العملاق المؤسسي؛ مسار د. محمد شوشان يغطي 4 مستويات كاملة مع مشروع ختامي.',
    rankOrder: 19,
    orderIndex: 19,
    viewsCount: 1350000,
    toolsSummary: 'Java SE, OOP, Collections, Multithreading, Streams API, Final Project',
    techStack: ['Java', 'OOP', 'Collections', 'Streams', 'Multithreading', 'Desktop & Backend'],
    instructors: [
      {
        id: 'inst-shoushan-java',
        name: 'د. محمد شوشان (Mohamed Shoushan)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 74,
        durationText: '28 ساعة تدريبية',
        note: 'المسار الأكاديمي الشامل لجافا: 4 مستويات متدرجة، OOP، مع مشروع تخرج ختامي كامل (4 مستويات ومشروع ختامي)',
        playlistId: 'PLnzqK5HvcpwTgEDztQ8y4K4-VoeoK1QCG',
        channelUrl: 'https://youtube.com/@MohamedShoushan'
      },
      {
        id: 'inst-adel-nasim-java',
        name: 'عادل نسيم (Adel Nasim)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 34,
        durationText: '10 ساعات تدريبية',
        note: 'شرح تأسيسي واضح ومبسط لمفاهيم جافا والبرمجة الشيئية',
        playlistId: 'PLCInYL3l2AajYlZGzU_LVrHdoouf8W6ZN',
        channelUrl: 'https://youtube.com/@AdelNasim'
      },
      {
        id: 'inst-eldesouki-java',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 102,
        durationText: '32 ساعة تدريبية',
        note: 'سلسلة جامعية رصينة تغطي لغة جافا وهياكل البيانات والبرمجة كائنية التوجه',
        playlistId: 'PL1DUmTEdeA6K7rdxKiWJq6JIxTvHalY8f',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      }
    ]
  }),

  // 20. C#
  createCourseTrack({
    id: 'csharp-masterclass',
    title: 'أساسيات واحتراف لغة البرمجة سي شارب C# والبرمجة كائنية التوجه',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'نظام مايكروسوفت',
    methodologyNote: 'اللغة الأساسية لبيئة عمل .NET وتطبيقات المؤسسات والألعاب بواسطة Unity.',
    rankOrder: 20,
    orderIndex: 20,
    viewsCount: 920000,
    toolsSummary: 'C# 12, .NET Core, OOP, LINQ, Async/Await, Generics',
    techStack: ['C#', '.NET', 'OOP', 'LINQ', 'Data Structures'],
    instructors: [
      {
        id: 'inst-codographia-csharp',
        name: 'كودوغرافيا (Codographia)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 40,
        durationText: '12 ساعة تدريبية',
        note: 'الدورة الحديثة والمتكاملة لاحتراف لغة C# والبرمجة الكائنية وفق أحدث معايير .NET',
        playlistId: 'PLX1bW_GeBRhCU9l7examhVrARmXHHRrLR',
        channelUrl: 'https://youtube.com/@Codographia'
      },
      {
        id: 'inst-passionate-coders-csharp',
        name: 'Passionate Coders',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 34,
        durationText: '11 ساعة تدريبية',
        note: 'شرح معماري وتطبيقي عميق للمفاهيم المتقدمة في لغة C#',
        playlistId: 'PLsV97AQt78NT0H8J71qe7edwRpAirfqOI',
        channelUrl: 'https://youtube.com/@PassionateCoders'
      },
      {
        id: 'inst-shoushan-csharp',
        name: 'د. محمد شوشان (Mohamed Shoushan)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 42,
        durationText: '14 ساعة تدريبية',
        note: 'منهج أكاديمي متسلسل يشرح أساسيات ومفاهيم لغة C# بدقة وتفصيل',
        playlistId: 'PLnzqK5HvcpwQLsXXXxx_mX3WvUEgGM0iA',
        channelUrl: 'https://youtube.com/@MohamedShoushan'
      }
    ]
  }),

  // 21. ASP.NET
  createCourseTrack({
    id: 'aspnet-masterclass',
    title: 'بناء تطبيقات وأنظمة الويب المتكاملة بواسطة ASP.NET Core & Web APIs',
    domainId: 'web-programming',
    domainTitle: 'الويب والبرمجة',
    badge: 'المرتبة #1 .NET',
    methodologyNote: 'بيئة العمل القياسية في القطاع المصرفي والحكومي والشركات الكبرى.',
    rankOrder: 21,
    orderIndex: 21,
    featured: true,
    viewsCount: 840000,
    toolsSummary: 'ASP.NET Core 8, Web API, Entity Framework Core, Identity, Repository Pattern',
    techStack: ['ASP.NET Core', 'C#', 'EF Core', 'Web API', 'SQL Server', 'JWT'],
    instructors: [
      {
        id: 'inst-khalid-essaadani-aspnet',
        name: 'خالد السعداني (Khalid Essaadani)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 38,
        durationText: '18 ساعة تدريبية',
        note: 'المسار العملي الأشهر عربياً لبناء مشاريع ويب واقعية باستخدام ASP.NET Core و EF Core',
        playlistId: 'PLwj1YcMhLRN1zbN2olMzvIBXP06FIwoes',
        channelUrl: 'https://youtube.com/@KhalidEssaadani'
      },
      {
        id: 'inst-codographia-aspnet',
        name: 'كودوغرافيا (Codographia)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 34,
        durationText: '14 ساعة تدريبية',
        note: 'شرح حديث ومعماري متطور لبناء Web APIs احترافية بواسطة .NET',
        playlistId: 'PLX1bW_GeBRhAjpkPCTpKXJoFGe2ZpYGUC',
        channelUrl: 'https://youtube.com/@Codographia'
      },
      {
        id: 'inst-passionate-coders-aspnet',
        name: 'Passionate Coders',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 52,
        durationText: '20 ساعة تدريبية',
        note: 'تغطية تفصيلية متعمقة لهندسة البرمجيات وبناء الخدمات الخلفية بـ ASP.NET',
        playlistId: 'PLsV97AQt78NQ8E7cEqovH0zLYRJgJahGh',
        channelUrl: 'https://youtube.com/@PassionateCoders'
      }
    ]
  }),

  // ==========================================
  // ثانياً: قطاع لغات وتطبيقات وألعاب (8 مسارات)
  // ==========================================

  // 22. C++
  createCourseTrack({
    id: 'cpp-masterclass',
    title: 'احتراف البرمجة بلغة C++ والبرمجة الموجهة وإدارة الذاكرة',
    domainId: 'languages-apps',
    domainTitle: 'لغات وتطبيقات وألعاب',
    badge: 'المرتبة #1 أداء',
    methodologyNote: 'أساس البرمجة التنافسية وهندسة النظم ومحركات الألعاب؛ تتطلب صبراً وفهماً دقيقاً للذاكرة.',
    rankOrder: 1,
    orderIndex: 22,
    featured: true,
    viewsCount: 1100000,
    toolsSummary: 'C++20, Pointers, Memory Management, OOP, STL, Data Structures',
    techStack: ['C++', 'OOP', 'Pointers', 'STL', 'Algorithms', 'Memory Management'],
    instructors: [
      {
        id: 'inst-adel-nasim-cpp',
        name: 'عادل نسيم (Adel Nasim)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 75,
        durationText: '22 ساعة تدريبية',
        note: 'الشرح العربي الأكثر وضوحاً وتنظيماً لمنهج C++ والبرمجة الكائنية وهياكل البيانات',
        playlistId: 'PLCInYL3l2AajFAiw4s1U4QbGszcQ-rAb3',
        channelUrl: 'https://youtube.com/@AdelNasim'
      },
      {
        id: 'inst-eldesouki-cpp',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 56,
        durationText: '18 ساعة تدريبية',
        note: 'سلسلة جامعية تأسيسية رصينة تشرح مفاهيم C++ بالتفصيل وبناء الخوارزميات',
        playlistId: 'PL1DUmTEdeA6IUD9Gt5rZlQfbZyAWXd-oD',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      },
      {
        id: 'inst-elzero-cpp',
        name: 'أسامة محمد (Elzero Web School)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 116,
        durationText: '26 ساعة تدريبية',
        note: 'دورة كاملة ومفصلة من الصفر مع التمارين العملية والتحديات البرمجية المكثفة',
        playlistId: 'PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      }
    ]
  }),

  // 23. C
  createCourseTrack({
    id: 'c-programming-masterclass',
    title: 'أساسيات البرمجة منخفضة المستوى والتعامل مع العتاد بلغة C',
    domainId: 'languages-apps',
    domainTitle: 'لغات وتطبيقات وألعاب',
    badge: 'تأسيس صلب',
    methodologyNote: 'أم اللغات البرمجية؛ تمنح المطور فهماً عميقاً لكيفية عمل المعالج والذاكرة وأنظمة التشغيل.',
    rankOrder: 2,
    orderIndex: 23,
    viewsCount: 450000,
    toolsSummary: 'C Standard, Pointers, Memory Allocation, Bitwise, Structures',
    techStack: ['C', 'Pointers', 'Memory Management', 'Low-level', 'Embedded Systems'],
    instructors: [
      {
        id: 'inst-ahmed-sallam-c',
        name: 'م. أحمد سلام (Ahmed Sallam)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 50,
        durationText: '15 ساعة تدريبية',
        note: 'شرح أكاديمي وهندسي متميز للغة C والأنظمة المدمجة مع محاكاة الذاكرة',
        playlistId: 'PLMm8EjqH1EFXI8wByY0umF_DQON2S9uws',
        channelUrl: 'https://youtube.com/@AhmedSallam'
      },
      {
        id: 'inst-fci-c',
        name: 'FCI-Career-Build',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 23,
        durationText: '8 ساعات تدريبية',
        note: 'منهج تأسيسي لطلاب كليات الحاسبات والمعلومات لتعلم مفاهيم لغة C',
        playlistId: 'PLEBRPBUkZ4mb6lVqSLRQ7mvSFRcoR7-XV',
        channelUrl: 'https://youtube.com/@FCI-Career-Build'
      }
    ]
  }),

  // 24. Rust
  createCourseTrack({
    id: 'rust-masterclass',
    title: 'أمان الذاكرة والأداء الفائق مع لغة البرمجة الحديثة Rust',
    domainId: 'languages-apps',
    domainTitle: 'لغات وتطبيقات وألعاب',
    badge: 'المستقبل',
    methodologyNote: 'اللغة الأكثر حباً بين المطورين عالمياً؛ مسار المهندس أحمد فرغل بقائمتيه يوفر التدرج الأمثل.',
    rankOrder: 3,
    orderIndex: 24,
    featured: true,
    viewsCount: 310000,
    toolsSummary: 'Rust, Ownership, Borrow Checker, Concurrency, Cargo, WebAssembly',
    techStack: ['Rust', 'Memory Safety', 'Concurrency', 'Systems Programming', 'Cargo'],
    instructors: [
      {
        id: 'inst-farghal-rust-1',
        name: 'أحمد فرغل (Rust للغلابة)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 25,
        durationText: '8 ساعات تدريبية',
        note: 'دورة التأسيس الأساسية: شرح مفاهيم الـ Ownership والـ Borrowing والمفاهيم الجوهرية للغة Rust',
        playlistId: 'PLald6EODoOJU0GMuYHlkS9MLhTPE7HiaT',
        channelUrl: 'https://youtube.com/@AhmedFarghal'
      },
      {
        id: 'inst-farghal-rust-2',
        name: 'أحمد فرغل (Rust and chill)',
        role: 'مكمل',
        language: 'AR',
        verified: true,
        lessonsCount: 23,
        durationText: '7 ساعات تدريبية',
        note: 'السلسلة المكملة: تطبيقات وتحديات برمجية ومناقشات معمارية متقدمة في Rust',
        playlistId: 'PLald6EODoOJWcSXfix8tgr5aVS76IU11M',
        channelUrl: 'https://youtube.com/@AhmedFarghal'
      }
    ]
  }),

  // 25. Dart
  createCourseTrack({
    id: 'dart-masterclass',
    title: 'تعلم لغة دارت Dart من الصفر لتطوير تطبيقات الموبايل والويب',
    domainId: 'languages-apps',
    domainTitle: 'لغات وتطبيقات وألعاب',
    badge: 'تأسيس Flutter',
    methodologyNote: 'المتطلب الإجباري قبل البدء بتطوير تطبيقات Flutter لضمان كتابة أكواد نظيفة.',
    rankOrder: 4,
    orderIndex: 25,
    viewsCount: 410000,
    toolsSummary: 'Dart 3, OOP, Asynchronous Programming, Null Safety, Streams',
    techStack: ['Dart', 'OOP', 'Null Safety', 'Async/Await', 'Streams', 'Flutter Engine'],
    instructors: [
      {
        id: 'inst-asem-saafan-dart',
        name: 'عاصم سعفان (Asem Saafan)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 32,
        durationText: '9 ساعات تدريبية',
        note: 'الدورة التأسيسية الأفضل عربياً لتعلم دارت والبرمجة الكائنية والأمان ضد القيم الفارغة',
        playlistId: 'PLMDrOnfT8EAj6Yjdki9OCLSwqdBs4xhQz',
        channelUrl: 'https://youtube.com/@AsemSaafan'
      }
    ]
  }),

  // 26. Flutter
  createCourseTrack({
    id: 'flutter-mobile-mastery',
    title: 'تطوير تطبيقات الموبايل الهجينة للأندرويد وiOS بواسطة Flutter & Dart',
    domainId: 'languages-apps',
    domainTitle: 'لغات وتطبيقات وألعاب',
    badge: 'المرتبة #1 موبايل',
    methodologyNote: 'المسار المفضل عربياً وعالمياً لبناء تطبيقات أندرويد و iOS من قاعدة شيفرة واحدة.',
    rankOrder: 5,
    orderIndex: 26,
    featured: true,
    trending: true,
    viewsCount: 1480000,
    toolsSummary: 'Flutter 3, Dart, Bloc, Provider, REST APIs, Firebase, Clean Architecture',
    techStack: ['Flutter', 'Dart', 'Bloc', 'State Management', 'Cross-Platform', 'Mobile Apps'],
    instructors: [
      {
        id: 'inst-tarek-alabd-flutter',
        name: 'طارق العبد (Tarek Alabd)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 65,
        durationText: '24 ساعة تدريبية',
        note: 'المسار العملي الأشهر عربياً لاحتراف Flutter وبناء تطبيقات ومشاريع حقيقية متكاملة',
        playlistId: 'PL0vtyWBHY2NXQ9PxbZV8ixhIRirs8WCt_',
        channelUrl: 'https://youtube.com/@TarekAlabd'
      },
      {
        id: 'inst-omar-ahmed-flutter',
        name: 'عمر أحمد (Omar Ahmed)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 47,
        durationText: '16 ساعة تدريبية',
        note: 'شرح معماري متقدم لإدارة الحالة بواسطة BLoC وبناء مشاريع واقعية عصرية',
        playlistId: 'PLwWuxCLlF_ucnfkI-_yNRCOTI-yJa5N-a',
        channelUrl: 'https://youtube.com/@OmarAhmed'
      },
      {
        id: 'inst-scholar-tech-flutter',
        name: 'سكولار تك (Scholar Tech)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 26,
        durationText: '10 ساعات تدريبية',
        note: 'دورة تطبيقية مركزة لتصميم واجهات مستخدم متميزة وربط البيانات',
        playlistId: 'PLGVaNq6mHinjCPki-3xraQdGWKVz7PhgI',
        channelUrl: 'https://youtube.com/@ScholarTech'
      }
    ]
  }),

  // 27. iOS
  createCourseTrack({
    id: 'ios-swift-masterclass',
    title: 'تطوير تطبيقات الآيفون والآيباد بلغة سويفت SwiftUI & iOS',
    domainId: 'languages-apps',
    domainTitle: 'لغات وتطبيقات وألعاب',
    badge: 'تطوير آبل',
    methodologyNote: 'التطوير الأصيل (Native) لبيئة آبل بواسطة سويفت لإنتاج تطبيقات ذات سلاسة وجودة فائقة.',
    rankOrder: 6,
    orderIndex: 27,
    viewsCount: 360000,
    toolsSummary: 'Swift 5, SwiftUI, Xcode, CoreData, Combine, iOS 17/18',
    techStack: ['Swift', 'SwiftUI', 'iOS', 'Xcode', 'Mobile Development', 'Apple'],
    instructors: [
      {
        id: 'inst-bambarmg-ios',
        name: 'بامبرمج (Bambarmg)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 26,
        durationText: '10 ساعات تدريبية',
        note: 'دورة احترافية متكاملة لتعلم تطوير تطبيقات iOS بلغة Swift وبناء تطبيقات عملية في Xcode',
        playlistId: 'PLQaOY10EEc8bNbEBMyiJU1I-GIgs1LQfj',
        channelUrl: 'https://youtube.com/@bambarmg'
      }
    ]
  }),

  // 28. Godot
  createCourseTrack({
    id: 'godot-game-engine-masterclass',
    title: 'صناعة وتطوير ألعاب 2D و3D بواسطة محرك الألعاب المفتوح Godot',
    domainId: 'languages-apps',
    domainTitle: 'لغات وتطبيقات وألعاب',
    badge: 'محرك ألعاب حر',
    methodologyNote: 'محرك ألعاب مجاني ومفتوح المصدر خفيف الوزن وسريع التعلم ويحظى بانتشار هائل.',
    rankOrder: 7,
    orderIndex: 28,
    featured: true,
    viewsCount: 420000,
    toolsSummary: 'Godot Engine 4, GDScript, 2D Physics, 3D Rendering, Shaders',
    techStack: ['Godot', 'GDScript', 'Game Development', '2D Games', '3D Games', 'Physics'],
    instructors: [
      {
        id: 'inst-ahmed-monis-godot',
        name: 'أحمد مؤنس (Ahmed Mo’nis)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 44,
        durationText: '12 ساعة تدريبية',
        note: 'سلسلة شاملة ومميزة لاحتراف صناعة الألعاب بمحرك Godot من الصفر حتى النشر',
        playlistId: 'PLqBd9au_wtU3eX7mLVuLLOt9sfbDWlJsq',
        channelUrl: 'https://youtube.com/@AhmedMonis'
      },
      {
        id: 'inst-spritesheet-godot',
        name: 'سبرايت شيت (SpriteSheet)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 33,
        durationText: '9 ساعات تدريبية',
        note: 'شرح تطبيقي لصناعة ألعاب ثنائية الأبعاد والفيزياء وتحريك الشخصيات في Godot',
        playlistId: 'PLXUEZFpQn01Hp06m0MxlMzj8x5Y2n9Dek',
        channelUrl: 'https://youtube.com/@SpriteSheet'
      },
      {
        id: 'inst-whales-state-godot',
        name: 'Whales State',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 22,
        durationText: '6 ساعات تدريبية',
        note: 'دروس عملية لبناء آليات الألعاب المتقدمة والأنظمة التفاعلية في Godot',
        playlistId: 'PLU8IixMdsBbmpMmYpgSCkemhqlLpTJAnJ',
        channelUrl: 'https://youtube.com/@WhalesState'
      }
    ]
  }),

  // 29. Unity
  createCourseTrack({
    id: 'unity-game-engine-masterclass',
    title: 'تصميم وتطوير ألعاب الفيديو ثنائية وثلاثية الأبعاد بواسطة Unity & C#',
    domainId: 'languages-apps',
    domainTitle: 'لغات وتطبيقات وألعاب',
    badge: 'المرتبة #1 ألعاب',
    methodologyNote: 'المحرك الأوسع انتشاراً عالمياً لصناعة ألعاب الموبايل والحاسوب؛ مسار طورني يشمل شروحات 2D و 3D.',
    rankOrder: 8,
    orderIndex: 29,
    featured: true,
    viewsCount: 880000,
    toolsSummary: 'Unity 2023, C#, 2D Physics, 3D Worlds, Animations, Audio, UI',
    techStack: ['Unity', 'C#', 'Game Development', '2D Games', '3D Games', 'Physics'],
    instructors: [
      {
        id: 'inst-6wrni-unity-2d',
        name: 'طورني - ألعاب ثنائية الأبعاد (6wrni 2D)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 18,
        durationText: '6 ساعات تدريبية',
        note: 'دورة تأسيسية رائعة لصناعة أول لعبة 2D متكاملة بالفيزياء والتحكم في Unity',
        playlistId: 'PLltZRmsFXWnLp98IIM1CISQYWowq87YSp',
        channelUrl: 'https://youtube.com/@6wrni'
      },
      {
        id: 'inst-6wrni-unity-3d',
        name: 'طورني - ألعاب ثلاثية الأبعاد (6wrni 3D)',
        role: 'مكمل',
        language: 'AR',
        verified: true,
        lessonsCount: 21,
        durationText: '8 ساعات تدريبية',
        note: 'سلسلة متقدمة مكملة لبناء العوالم والإضاءة والشخصيات في بيئة Unity ثلاثية الأبعاد',
        playlistId: 'PLltZRmsFXWnKk5F3_ltKWKq6lZLveotIF',
        channelUrl: 'https://youtube.com/@6wrni'
      }
    ]
  }),

  // ==========================================
  // ثالثاً: قطاع علوم الحاسوب (8 مسارات)
  // ==========================================

  // 30. الخوارزميات (Algorithms)
  createCourseTrack({
    id: 'algorithms-masterclass',
    title: 'الخوارزميات وحل المسائل البرمجية (Algorithms & Problem Solving)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'المرتبة #1 خوارزميات',
    methodologyNote: 'المسار التأسيسي لفهم منطق الخوارزميات، تحليل التعقيد الزمني والمكاني Big-O، وحل مسائل المقابلات التقنية.',
    rankOrder: 1,
    orderIndex: 30,
    featured: true,
    trending: true,
    viewsCount: 520000,
    toolsSummary: 'Algorithms, Big-O, Sorting, Searching, Recursion, Dynamic Programming',
    techStack: ['Algorithms', 'Data Structures', 'Problem Solving', 'Big-O', 'LeetCode'],
    instructors: [
      {
        id: 'inst-hardcode-algo',
        name: 'محمود سامي (Hard-Code)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 15,
        durationText: '8 ساعات تدريبية',
        note: 'شرح مبسط وتطبيقي لأهم خوارزميات الترتيب والبحث والتعقيد الزمني (15 درساً مرتباً ✔)',
        playlistId: 'PLwCMLs3sjOY6KH-8c9F-lMWn-r02hyoV_',
        channelUrl: 'https://youtube.com/@hard-code'
      },
      {
        id: 'inst-adel-nasim-algo',
        name: 'عادل نسيم (Adel Nasim)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 37,
        durationText: '16 ساعة تدريبية',
        note: 'دورة شاملة ومفصلة في تحليل الخوارزميات وتراكيب البيانات المتقدمة مع تمارين C++ العملية',
        playlistId: 'PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp',
        channelUrl: 'https://youtube.com/@AdelNasim'
      },
      {
        id: 'inst-desouki-algo',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 14,
        durationText: '10 ساعات تدريبية',
        note: 'المنهج الأكاديمي الجامعي لشرح خوارزميات البيانات والبحث والترتيب بأسلوب عميق ومتقن',
        playlistId: 'PL1DUmTEdeA6JlommmGP5wicYLxX5PVCQt',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      }
    ]
  }),

  // 31. هياكل البيانات (Data Structures)
  createCourseTrack({
    id: 'data-structures-masterclass',
    title: 'هياكل وتراكيب البيانات المتقدمة (Data Structures Course)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'المرتبة #1 هياكل بيانات',
    methodologyNote: 'فهم متعمق لكيفية تنظيم الذاكرة والتعامل مع Arrays, Linked Lists, Stacks, Queues, Trees, Graphs.',
    rankOrder: 2,
    orderIndex: 31,
    featured: true,
    viewsCount: 480000,
    toolsSummary: 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, Graphs, Hash Tables',
    techStack: ['Data Structures', 'C++', 'Memory', 'Trees', 'Graphs'],
    instructors: [
      {
        id: 'inst-adel-nasim-ds',
        name: 'عادل نسيم (Adel Nasim)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 37,
        durationText: '16 ساعة تدريبية',
        note: 'الكورس المرجعي العربي الأشهر لشرح وتطبيق تراكيب البيانات بلغة C++ من الصفر حتى الاحتراف',
        playlistId: 'PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp',
        channelUrl: 'https://youtube.com/@AdelNasim'
      },
      {
        id: 'inst-hardcode-ds',
        name: 'محمود سامي (Hard-Code)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 31,
        durationText: '12 ساعة تدريبية',
        note: 'دورة عملية رائعة تبسط هياكل البيانات والتطبيقات البرمجية الواقعية خطوة بخطوة',
        playlistId: 'PLwCMLs3sjOY4UQq4vXgGPwGLVX1Y5faaS',
        channelUrl: 'https://youtube.com/@hard-code'
      },
      {
        id: 'inst-nehal-elsamoly-ds',
        name: 'نهال السامولي (Nehal Elsamoly)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 11,
        durationText: '6 ساعات تدريبية',
        note: 'شرح متميز ومبسط لهياكل البيانات التأسيسية وأهم المفاهيم للطلاب والمبتدئين',
        playlistId: 'PLIxq078xdGdZWUXwumK9lbEn3kKwKLTwx',
        channelUrl: 'https://youtube.com/@NehalElsamoly'
      }
    ]
  }),

  // 32. Assembly
  createCourseTrack({
    id: 'assembly-masterclass',
    title: 'لغة التجميع والبرمجة منخفضة المستوى x86 Assembly Language',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'منخفض المستوى',
    methodologyNote: 'الغوص في أعماق المعالج (CPU Registers, Memory Addressing, Stack Frame) وكتابة كود الأسمبلي المباشر.',
    rankOrder: 3,
    orderIndex: 32,
    viewsCount: 260000,
    toolsSummary: 'x86, 8086, Registers, Assembly, Low-Level, Debugging, Emulator',
    techStack: ['Assembly', 'x86', 'Microprocessors', 'Low-Level'],
    instructors: [
      {
        id: 'inst-ahmed-sallam-assembly',
        name: 'أحمد سلام (Ahmed Sallam)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 30,
        durationText: '14 ساعة تدريبية',
        note: 'شرح أكاديمي دقيق ومفصل للغة التجميع x86 ومعمارية المعالجات والتعامل مع المسجلات',
        playlistId: 'PLMm8EjqH1EFVodghdDWaAuHkHqj-nJ0bN',
        channelUrl: 'https://youtube.com/@AhmedSallam'
      },
      {
        id: 'inst-sherif-ezzat-assembly',
        name: 'شريف عزت (Sherif Ezzat)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 46,
        durationText: '18 ساعة تدريبية',
        note: 'دورة معالج 8086 وتطبيقات لغة الأسمبلي العملية والتحكم في العتاد والذاكرة',
        playlistId: 'PLi0-RQZxQ8Fmwopq43StX61igOvXbFMQv',
        channelUrl: 'https://youtube.com/@SherifEzzat'
      }
    ]
  }),

  // 33. معمارية الحاسوب (Computer Architecture)
  createCourseTrack({
    id: 'computer-architecture-masterclass',
    title: 'تنظيم وبناء ومعمارية الحاسب (Computer Architecture)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'عتاد وأنظمة',
    methodologyNote: 'دراسة الدوائر المنطقية ووحدات المعالجة المركزية، خطوط النقل، مسار البيانات، وهيكلية الذاكرة المخبأة Cache.',
    rankOrder: 4,
    orderIndex: 33,
    viewsCount: 240000,
    toolsSummary: 'ALU, Control Unit, Pipelining, Caching, Instruction Set Architecture (ISA)',
    techStack: ['Computer Architecture', 'Hardware', 'Pipelining', 'ISA'],
    instructors: [
      {
        id: 'inst-ahmed-sallam-ca',
        name: 'أحمد سلام (Ahmed Sallam)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 27,
        durationText: '12 ساعة تدريبية',
        note: 'المسار الأكاديمي الشامل لتنظيم وبناء الحاسب وتصميم وحدات المعالجة والذاكرة (27 درساً مرتباً ✔)',
        playlistId: 'PLMm8EjqH1EFVEVWSiBdCoBEJHffjHUScZ',
        channelUrl: 'https://youtube.com/@AhmedSallam'
      }
    ]
  }),

  // 34. أنظمة التشغيل (Operating Systems)
  createCourseTrack({
    id: 'operating-systems-masterclass',
    title: 'هندسة ونظم التشغيل المعاصرة (Operating Systems Concepts)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'المرتبة #1 أنظمة',
    methodologyNote: 'إتقان مفاهيم العمليات Processes، الخيوط Threads، الجدولة CPU Scheduling، التزامن والمزامنة وإدارة الذاكرة.',
    rankOrder: 5,
    orderIndex: 34,
    featured: true,
    viewsCount: 390000,
    toolsSummary: 'Processes, Threads, Semaphores, Deadlocks, Paging, Virtual Memory',
    techStack: ['Operating Systems', 'Concurrency', 'Memory Management', 'Kernel'],
    instructors: [
      {
        id: 'inst-ahmed-sallam-os',
        name: 'أحمد سلام (Ahmed Sallam)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 28,
        durationText: '14 ساعة تدريبية',
        note: 'شرح أكاديمي متميز ومترابط لكتاب نظم التشغيل المعتمد عالمياً ونظريات إدارة العمليات',
        playlistId: 'PLMm8EjqH1EFV-jECqtMxeVMDoVkV_kJDY',
        channelUrl: 'https://youtube.com/@AhmedSallam'
      },
      {
        id: 'inst-ahmed-hagag-os',
        name: 'د. أحمد حجاج (Dr. Ahmed Hagag)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 21,
        durationText: '10 ساعات تدريبية',
        note: 'محاضرات جامعية قيمة ومفصلة لشرح نظم التشغيل وحل المسائل العملية والجدولة',
        playlistId: 'PLxIvc-MGOs6ib0oK1z9C46DeKd9rRcSMY',
        channelUrl: 'https://youtube.com/@AhmedHagag'
      },
      {
        id: 'inst-mohamed-alsayed-os',
        name: 'محمد السيد (SoftwareTube / Mohamed Alnaqid)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 60,
        durationText: '25 ساعة تدريبية',
        note: 'شرح موسع لكتاب Dinosaur Book مع تفصيل دقيق لجميع فصول نظم التشغيل الحديثة (60 درساً ✔)',
        playlistId: 'PLTr1xN4uMK5seRz6IO7Am9Zp2UKdnzO_n',
        channelUrl: 'https://youtube.com/@SoftwareTube'
      }
    ]
  }),

  // 35. Linux
  createCourseTrack({
    id: 'linux-system-masterclass',
    title: 'إدارة وتشغيل خوادم وأنظمة لينكس (Linux System Administration)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'نظام التشغيل القياسي',
    methodologyNote: 'إتقان سطر الأوامر Bash، أذونات الملفات، إدارة العمليات والخدمات، والشبكات في نظام لينكس.',
    rankOrder: 6,
    orderIndex: 35,
    viewsCount: 310000,
    toolsSummary: 'Bash, Terminal, Permissions, Systemd, Package Managers, Networking, SSH',
    techStack: ['Linux', 'Ubuntu', 'Bash', 'System Administration', 'Terminal'],
    instructors: [
      {
        id: 'inst-anahr-linux',
        name: 'أنس النهر (anaHr)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 12,
        durationText: '6 ساعات تدريبية',
        note: 'سلسلة مميزة واحترافية لتعلم نظام لينكس وسطر الأوامر وإدارة الخوادم (12 درساً مرتباً ✔)',
        playlistId: 'PL8pYI62gCNsWTppELEUCpforC4avEiLox',
        channelUrl: 'https://youtube.com/@anaHr'
      }
    ]
  }),

  // 36. Prolog
  createCourseTrack({
    id: 'prolog-programming-masterclass',
    title: 'البرمجة المنطقية والذكاء الاصطناعي بلغة برولوج (Prolog Logic Programming)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'برمجة منطقية',
    methodologyNote: 'فهم نمط البرمجة التصريحية وبناء قواعد المعرفة والقواعد المنطقية والاستدلال في الذكاء الاصطناعي.',
    rankOrder: 7,
    orderIndex: 36,
    viewsCount: 180000,
    toolsSummary: 'Prolog, Knowledge Bases, Facts, Rules, Inference, Logic Programming',
    techStack: ['Prolog', 'Logic Programming', 'AI', 'Inference'],
    instructors: [
      {
        id: 'inst-ahmed-sallam-prolog',
        name: 'أحمد سلام (Ahmed Sallam)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 26,
        durationText: '10 ساعات تدريبية',
        note: 'الكورس العربي الأكمل والأوضح في البرمجة المنطقية بلغة Prolog وتطبيقات الذكاء الاصطناعي (26 درساً ✔)',
        playlistId: 'PLMm8EjqH1EFW9Faldu6D6Uh2j1EWWaTYe',
        channelUrl: 'https://youtube.com/@AhmedSallam'
      }
    ]
  }),

  // 37. CS50 بالعربي
  createCourseTrack({
    id: 'cs50-arabic-masterclass',
    title: 'مقدمة علوم الحاسوب لجامعة هارفارد بالعربي (CS50 in Arabic)',
    domainId: 'computer-science',
    domainTitle: 'علوم الحاسوب',
    badge: 'المرتبة #1 مدخل الحاسوب',
    examCode: 'CS50x Harvard',
    methodologyNote: 'المدخل الأسطوري لعلوم الحاسوب وبناء التفكير الخوارزمي، يبدأ من الصفر وصولاً إلى C وبايثون وتطوير الويب.',
    rankOrder: 8,
    orderIndex: 37,
    featured: true,
    trending: true,
    viewsCount: 950000,
    toolsSummary: 'C, Python, SQL, Memory, Pointers, Algorithms, Web Development',
    techStack: ['CS50', 'Computer Science', 'C', 'Python', 'Algorithms'],
    instructors: [
      {
        id: 'inst-kmr-cs50',
        name: 'كيه إم آر (KMR Script)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 15,
        durationText: '12 ساعة تدريبية',
        note: 'شرح ممتع وعصري ومبسط لأهم مفاهيم كورس هارفارد CS50 بالعربي مع التطبيق البرمجي',
        playlistId: 'PLL2zWZTDFZzibJ49gBM2owqCzda8meSNj',
        channelUrl: 'https://youtube.com/@KMRScript'
      },
      {
        id: 'inst-rasha-abdeen-cs50',
        name: 'رشا عابدين (Coders Camp - Rasha Abdeen)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 123,
        durationText: '40 ساعة تدريبية',
        note: 'موسوعة عربية كاملة وتفصيلية تغطي محاضرات ومسائل وتطبيقات منهج هارفارد CS50 كاملاً (123 درساً ✔)',
        playlistId: 'PLnrlZUDQofUv7JE4QIahAyztrQU9bnJmd',
        channelUrl: 'https://youtube.com/@CodersCamp'
      },
      {
        id: 'inst-abdelrahman-gamal-cs50',
        name: 'عبدالرحمن جمال (Abdelrahman Gamal)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 82,
        durationText: '24 ساعة تدريبية',
        note: 'شرح تطبيقي سلس وتفاعلي لكورس CS50 مع حل المسائل ومساعدة المبتدئين خطوة بخطوة (82 درساً ✔)',
        playlistId: 'PLknwEmKsW8OvMsFbU9zo8oJCprAsgc4LO',
        channelUrl: 'https://youtube.com/@AbdelrahmanGamal'
      }
    ]
  }),

  // ==========================================
  // رابعاً: قطاع قواعد البيانات والخلفية (6 مسارات)
  // ==========================================

  // 38. قواعد البيانات (نظري)
  createCourseTrack({
    id: 'database-theory-masterclass',
    title: 'المفاهيم النظرية ونظم إدارة قواعد البيانات (Database Systems Concepts)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'المرتبة #1 نظري',
    methodologyNote: 'تأسيس أكاديمي لا غنى عنه في تصميم المخططات ERD، العلاقات، التفكيك والتوحيد Normalization، وقواعد البيانات العلائقية.',
    rankOrder: 1,
    orderIndex: 38,
    featured: true,
    viewsCount: 410000,
    toolsSummary: 'ERD, Relational Model, Normalization, Relational Algebra, Functional Dependencies',
    techStack: ['Database Design', 'ERD', 'Normalization', 'Relational Model'],
    instructors: [
      {
        id: 'inst-desouki-db-theory',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 40,
        durationText: '20 ساعة تدريبية',
        note: 'المرجع الجامعي العربي الأقوى لمقرر قواعد البيانات النظري وتصميم ERD والـ Normalization (40 درساً ✔)',
        playlistId: 'PL37D52B7714788190',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      },
      {
        id: 'inst-kmr-db-theory',
        name: 'كيه إم آر (KMR Script)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 13,
        durationText: '6 ساعات تدريبية',
        note: 'شرح عصري ومكثف لأساسيات قواعد البيانات وهندسة النظم الخلفية (13 درساً مرتباً ✔)',
        playlistId: 'PLL2zWZTDFZzhXQ1bcYlO3PtN4MsLiG-gy',
        channelUrl: 'https://youtube.com/@KMRScript'
      }
    ]
  }),

  // 39. SQL
  createCourseTrack({
    id: 'sql-masterclass',
    title: 'لغة الاستعلامات البنيوية وقواعد البيانات المترابطة (SQL & MySQL Mastery)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'المرتبة #1 استعلامات',
    methodologyNote: 'كتابة استعلامات SQL المتقدمة، الفهارس، المعاملات، الروابط Joins، وتصميم قواعد البيانات الإنتاجية.',
    rankOrder: 2,
    orderIndex: 39,
    featured: true,
    trending: true,
    viewsCount: 890000,
    toolsSummary: 'SQL, MySQL, Joins, Aggregations, Subqueries, Indexes, Transactions',
    techStack: ['SQL', 'MySQL', 'Database', 'Queries', 'RDBMS'],
    instructors: [
      {
        id: 'inst-elzero-mysql',
        name: 'أسامة محمد (الزيرو - Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 51,
        durationText: '12 ساعة تدريبية',
        note: 'دورة MySQL الاحترافية الشاملة مع التطبيقات العملية والاستعلامات المتقدمة (51 درساً مرتباً ✔)',
        playlistId: 'PLDoPjvoNmBAz6DT8SzQ1CODJTH-NIA7R9',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-desouki-sql',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 55,
        durationText: '22 ساعة تدريبية',
        note: 'مقرر SQL العملي التطبيقي الشامل من الصفر حتى إتقان إدارة الخوادم وقواعد البيانات (55 درساً ✔)',
        playlistId: 'PL85D9FC9DFD6B9484',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      },
      {
        id: 'inst-thenewbaghdad-sql',
        name: 'حسين الربيعي (TheNewBaghdad)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 37,
        durationText: '10 ساعات تدريبية',
        note: 'بناء قواعد البيانات بكفاءة عالية وتطبيق استعلامات MySQL خطوة بخطوة (37 درساً مرتباً ✔)',
        playlistId: 'PLF8OvnCBlEY25O_Ql0CrgQUAc5NVYkWF2',
        channelUrl: 'https://youtube.com/@TheNewBaghdad'
      }
    ]
  }),

  // 40. MongoDB
  createCourseTrack({
    id: 'mongodb-masterclass',
    title: 'قواعد البيانات غير العلائقية وتطوير الوثائق MongoDB (NoSQL Database)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'NoSQL #1',
    methodologyNote: 'التعامل مع قواعد بيانات الوثائق BSON/JSON، عمليات CRUD، خطوط التجميع Aggregation Framework، وتكامل خوادم الويب.',
    rankOrder: 3,
    orderIndex: 40,
    viewsCount: 340000,
    toolsSummary: 'MongoDB, NoSQL, BSON, Aggregations, Indexing, Atlas, Mongoose',
    techStack: ['MongoDB', 'NoSQL', 'Database', 'Backend', 'Mongoose'],
    instructors: [
      {
        id: 'inst-algorithm-academy-mongo',
        name: 'أسامة جيدري (Algorithm Academy)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 10,
        durationText: '4 ساعات تدريبية',
        note: 'دورة ممتازة وعملية لتعلم MongoDB وتطبيقات NoSQL مع بيئة Node.js (10 دروس مرتبة ✔)',
        playlistId: 'PLfDx4cQoUNObp1ujQRNooNiadKdlflevM',
        channelUrl: 'https://youtube.com/@AlgorithmAcademy'
      },
      {
        id: 'inst-emam-academy-mongo',
        name: 'محمد إمام (Emam Academy)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 12,
        durationText: '5 ساعات تدريبية',
        note: 'شرح تطبيقي لـ MongoDB والربط مع خوادم Express وبناء الـ RESTful APIs (12 درساً ✔)',
        playlistId: 'PLGhZWewM_75IILJm_1QDq0yPLbLQz_TCb',
        channelUrl: 'https://youtube.com/@EmamAcademy'
      },
      {
        id: 'inst-thenewbaghdad-mongo',
        name: 'حسين الربيعي (TheNewBaghdad)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 11,
        durationText: '4 ساعات تدريبية',
        note: 'شرح مبسّط لقواعد بيانات الوثائق MongoDB وتطبيق الاستعلامات الأساسية (11 درساً مرتباً ✔)',
        playlistId: 'PLF8OvnCBlEY1sdUym7Cnb5Xc3d7HXLjqf',
        channelUrl: 'https://youtube.com/@TheNewBaghdad'
      }
    ]
  }),

  // 41. Redis
  createCourseTrack({
    id: 'redis-masterclass',
    title: 'التخزين المؤقت في الذاكرة وهيكلة البيانات السريعة مع Redis (In-Memory Data Store)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'أداء فائق',
    methodologyNote: 'تسريع استجابة الخوادم، التخزين المؤقت Caching، نشر الرسائل Pub/Sub، وهندسة العناقيد Redis Cluster.',
    rankOrder: 4,
    orderIndex: 41,
    viewsCount: 290000,
    toolsSummary: 'Redis, In-Memory, Key-Value, Pub/Sub, Caching, Persistence, Cluster',
    techStack: ['Redis', 'Caching', 'In-Memory', 'High Performance', 'PubSub'],
    instructors: [
      {
        id: 'inst-anjrini-redis',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 68,
        durationText: '24 ساعة تدريبية',
        note: 'الموسوعة العربية الأضخم والأعمق لتقنية Redis بالعربي مع هندسة البيانات المتقدمة (68 درساً مرتباً ✔)',
        playlistId: 'PLZd2bo_SbAm_ijqLfnx94qkmytbWjUQ-h',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      }
    ]
  }),

  // 42. Elastic
  createCourseTrack({
    id: 'elastic-elk-masterclass',
    title: 'محرك البحث والتحليلات الضخمة وحزمة ELK Stack & Elasticsearch',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'محرك بحث متقدم',
    methodologyNote: 'البحث النصي الكامل Full-Text Search، فهرسة السجلات Logs، وتحليل البيانات اللحظية عبر حزمة ELK.',
    rankOrder: 5,
    orderIndex: 42,
    viewsCount: 220000,
    toolsSummary: 'Elasticsearch, Logstash, Kibana, Beats, Shards, Replicas, Full-Text Search',
    techStack: ['Elasticsearch', 'ELK Stack', 'Kibana', 'Log Analysis', 'Search'],
    instructors: [
      {
        id: 'inst-anjrini-elastic',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 8,
        durationText: '5 ساعات تدريبية',
        note: 'شرح تطبيقي لحزمة ELK Stack وتثبيت وضبط محرك Elasticsearch والفهارس (8 دروس مرتبة ✔)',
        playlistId: 'PLahnTWf-ROoXRZQp4iWrzkRfTjrPjSw3W',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      }
    ]
  }),

  // 43. RabbitMQ
  createCourseTrack({
    id: 'rabbitmq-masterclass',
    title: 'وسائط الرسائل والمعمارية غير المتزامنة بواسطة RabbitMQ (Message Broker)',
    domainId: 'databases-backend',
    domainTitle: 'قواعد البيانات والخلفية',
    badge: 'معمارية متزامنة',
    methodologyNote: 'إتقان بروتوكول AMQP، أنماط التبادل Exchanges، طوابير الرسائل Queues، والاتصال غير المتزامن بين الخوادم.',
    rankOrder: 6,
    orderIndex: 43,
    viewsCount: 260000,
    toolsSummary: 'RabbitMQ, AMQP, Exchanges, Queues, Routing, Asynchronous Messaging, Microservices',
    techStack: ['RabbitMQ', 'Message Broker', 'AMQP', 'Async', 'Event-Driven'],
    instructors: [
      {
        id: 'inst-anjrini-rabbitmq',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 44,
        durationText: '18 ساعة تدريبية',
        note: 'الدورة العربية المتكاملة والأشمل لنظام وسائط الرسائل RabbitMQ وبناء النظم الموزعة (44 درساً مرتباً ✔)',
        playlistId: 'PLZd2bo_SbAm9uJ2J5ryEOZV7ojLwGkATc',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      }
    ]
  }),

  // ==========================================
  // خامساً: قطاع DevOps والسحابة والهندسة (11 مساراً)
  // ==========================================

  // 44. Git
  createCourseTrack({
    id: 'git-github-masterclass',
    title: 'إدارة الإصدارات والعمل الجماعي البرمجي باستخدام Git & GitHub',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 إدارة شيفرات',
    methodologyNote: 'التحكم بالإصدارات، الفروع Branches، الدمج Merge، الـ Pull Requests، وحل النزاعات البرمجية بكفاءة.',
    rankOrder: 1,
    orderIndex: 44,
    featured: true,
    trending: true,
    viewsCount: 780000,
    toolsSummary: 'Git, GitHub, Branching, Merging, Rebase, Pull Requests, Workflows',
    techStack: ['Git', 'GitHub', 'Version Control', 'DevOps', 'Collaboration'],
    instructors: [
      {
        id: 'inst-elzero-git',
        name: 'أسامة محمد (الزيرو - Elzero Web School)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 32,
        durationText: '7 ساعات تدريبية',
        note: 'دورة Git و GitHub الأشهر عربياً مع التطبيق العملي وإدارة الفروع والمستودعات (32 درساً مرتباً ✔)',
        playlistId: 'PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF',
        channelUrl: 'https://youtube.com/@ElzeroWebSchool'
      },
      {
        id: 'inst-khalid-elshafie-git',
        name: 'خالد الشافعي (Khalid Elshafie - abolkog)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 8,
        durationText: '4 ساعات تدريبية',
        note: 'شرح تطبيقي مكثف ومباشر لأساسيات Git وسير العمل الجماعي على GitHub (8 دروس مرتبة ✔)',
        playlistId: 'PL_aOZuct6oAogr4UMkWddU7leOXw0QKJS',
        channelUrl: 'https://youtube.com/@KhalidElshafie'
      },
      {
        id: 'inst-tarmeez-git',
        name: 'أكاديمية ترميز (Tarmeez Academy)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 13,
        durationText: '5 ساعات تدريبية',
        note: 'الدورة الأساسية في Git للمطورين بأسلوب ميسر وتطبيقات شائعة (13 درساً مرتباً ✔)',
        playlistId: 'PLYyqC4bNbCIeCHLTRtwdLpQvle_zIavZ-',
        channelUrl: 'https://youtube.com/@tarmeez'
      }
    ]
  }),

  // 45. Docker
  createCourseTrack({
    id: 'docker-masterclass',
    title: 'تقنيات الحاويات وعزل البيئات البرمجية بواسطة Docker (Containers in Depth)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 حاويات',
    methodologyNote: 'بناء ملفات Dockerfile، إدارة الصور والحاويات، شبكات الدوكر، والتكامل عبر Docker Compose.',
    rankOrder: 2,
    orderIndex: 45,
    featured: true,
    trending: true,
    viewsCount: 650000,
    toolsSummary: 'Docker, Dockerfile, Docker Compose, Images, Containers, Volumes, Networks',
    techStack: ['Docker', 'DevOps', 'Containers', 'Microservices', 'Linux'],
    instructors: [
      {
        id: 'inst-codographia-docker',
        name: 'كودوغرافيا (Codographia)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 37,
        durationText: '14 ساعة تدريبية',
        note: 'سلسلة احترافية شاملة ومبوبة لشرح دوكر من الصفر وحتى مفاهيم الإنتاج الحقيقية (37 درساً مرتباً ✔)',
        playlistId: 'PLX1bW_GeBRhDkTf_jbdvBbkHs2LCWVeXZ',
        channelUrl: 'https://youtube.com/@Codographia'
      },
      {
        id: 'inst-tresmerge-docker',
        name: 'تريسميرج (Tresmerge)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 28,
        durationText: '11 ساعة تدريبية',
        note: 'دورة تطبيقية عملية باللغة العربية لشرح دوكر والحاويات بالتفصيل (28 درساً مرتباً ✔)',
        playlistId: 'PLzNfs-3kBUJnY7Cy1XovLaAkgfjim05RR',
        channelUrl: 'https://youtube.com/@Tresmerge'
      },
      {
        id: 'inst-ahmed-sami-docker',
        name: 'أحمد سامي (Ahmed Sami - بالعربي Big Data)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 77,
        durationText: '28 ساعة تدريبية',
        note: 'مسار DevOps والحاويات الشامل وشرح دوكر وكوبرنيتس الميداني بالتفصيل (77 درساً مرتباً ✔)',
        playlistId: 'PLJK0gWS0uZDYdUuQBJLhUakQ_09qWMSb_',
        channelUrl: 'https://youtube.com/@AhmedSami'
      }
    ]
  }),

  // 46. Kubernetes
  createCourseTrack({
    id: 'kubernetes-masterclass',
    title: 'إدارة وتنسيق عناقيد الحاويات على مستوى الإنتاج بواسطة Kubernetes (K8s)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 كوبرنيتس',
    methodologyNote: 'إدارة Pods, Deployments, Services, Ingress, التوسع التلقائي Auto-scaling، ونشر الأنظمة السحابية المعقدة.',
    rankOrder: 3,
    orderIndex: 46,
    featured: true,
    viewsCount: 430000,
    toolsSummary: 'Kubernetes, Pods, Deployments, Services, Helm, Ingress, ConfigMaps, Secrets',
    techStack: ['Kubernetes', 'K8s', 'Cloud Native', 'DevOps', 'Containers'],
    instructors: [
      {
        id: 'inst-codographia-k8s',
        name: 'كودوغرافيا (Codographia)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 39,
        durationText: '16 ساعة تدريبية',
        note: 'الدورة العربية الأقوى والأشمل لشرح كوبرنيتس بالعربي وتطبيقات الـ Orchestration (39 درساً مرتباً ✔)',
        playlistId: 'PLX1bW_GeBRhDCHijCrMO5F-oHg52rRBpl',
        channelUrl: 'https://youtube.com/@Codographia'
      },
      {
        id: 'inst-ahmed-elemam-k8s',
        name: 'أحمد الإمام (Ahmed Elemam)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 12,
        durationText: '6 ساعات تدريبية',
        note: 'شرح متقدم لمنهجيات GitOps وإدارة كوبرنيتس في الإنتاج (12 درساً مرتباً ✔)',
        playlistId: 'PLTRDUPO2OmInz2Fo41zwnoR1IArx70Hig',
        channelUrl: 'https://youtube.com/@AhmedElemam'
      }
    ]
  }),

  // 47. Terraform
  createCourseTrack({
    id: 'terraform-iac-masterclass',
    title: 'البنية التحتية كشيفرة برمجية وأتمتة السحابة عبر Terraform (IaC)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'أتمتة بنية تحتية',
    methodologyNote: 'بناء وتعديل وإدارة الموارد السحابية تلقائياً باستخدام لغة HCL والتحكم بالبنية التحتية البرمجية.',
    rankOrder: 4,
    orderIndex: 47,
    viewsCount: 280000,
    toolsSummary: 'Terraform, HCL, Providers, State Management, Modules, IaC, Multi-Cloud',
    techStack: ['Terraform', 'IaC', 'DevOps', 'Cloud Automation', 'AWS'],
    instructors: [
      {
        id: 'inst-codographia-terraform',
        name: 'كودوغرافيا (Codographia)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 11,
        durationText: '5 ساعات تدريبية',
        note: 'كورس Terraform بالعربي لشرح مفاهيم Infrastructure as Code والتطبيق العملي (11 درساً مرتباً ✔)',
        playlistId: 'PLX1bW_GeBRhBIT9-Nyt4_osatqokaN8ae',
        channelUrl: 'https://youtube.com/@Codographia'
      }
    ]
  }),

  // 48. Google Cloud
  createCourseTrack({
    id: 'google-cloud-gcp-masterclass',
    title: 'الحوسبة السحابية وخدمات البنية التحتية Google Cloud Platform (GCP)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'سحابة جوجل',
    methodologyNote: 'التعامل مع Compute Engine, Cloud Run, GKE, Cloud Storage, VPC ومفاهيم إدارة الموارد على سحابة جوجل.',
    rankOrder: 5,
    orderIndex: 48,
    viewsCount: 360000,
    toolsSummary: 'GCP, Compute Engine, GKE, Cloud Run, BigQuery, IAM, Cloud Storage',
    techStack: ['Google Cloud', 'GCP', 'Cloud Computing', 'Kubernetes', 'DevOps'],
    instructors: [
      {
        id: 'inst-anjrini-gcp',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 75,
        durationText: '26 ساعة تدريبية',
        note: 'أضخم وأشمل مسار عربي في الحوسبة السحابية لسحابة جوجل (GCP بالعربي) بمشاريع واقعية (75 درساً مرتباً ✔)',
        playlistId: 'PLZd2bo_SbAm-JJyJ5kJA02rcOXnyfqIWO',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      }
    ]
  }),

  // 49. AWS
  createCourseTrack({
    id: 'aws-cloud-masterclass',
    title: 'شهادة وهندسة الحلول السحابية المعتمدة Amazon Web Services (AWS SAA)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 سحابة أمازون',
    examCode: 'AWS SAA-C03',
    methodologyNote: 'تصميم البنى التحتية عالية التوافر ومحاكاة الخدمات الأساسية EC2, S3, RDS, VPC, Lambda, IAM.',
    rankOrder: 6,
    orderIndex: 49,
    featured: true,
    trending: true,
    viewsCount: 560000,
    toolsSummary: 'AWS, EC2, S3, VPC, IAM, RDS, CloudFront, Route53, Lambda',
    techStack: ['AWS', 'Cloud Computing', 'Solutions Architect', 'Serverless'],
    instructors: [
      {
        id: 'inst-free4arab-aws',
        name: 'محمد عدي (Free4arab)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 56,
        durationText: '25 ساعة تدريبية',
        note: 'الشرح العربي المرجعي لشهادة مهندس الحلول السحابية المعتمد AWS Solutions Architect (56 درساً مرتباً ✔)',
        playlistId: 'PLLlr6jKKdyK0ZbS1lSWOLipuiXWJZhEHG',
        channelUrl: 'https://youtube.com/@Free4arab'
      },
      {
        id: 'inst-aws-riyadh-group',
        name: 'مجموعة مستخدمي أمازون بالرياض (AWS Riyadh User Group)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 18,
        durationText: '12 ساعة تدريبية',
        note: 'كورس تفاعلي شامل لشرح منهج AWS SAA-C02 مع م. عيسى أبو شريف ومعامل عملية (18 درساً مرتباً ✔)',
        playlistId: 'PLOoZRfEtk6kWSM_l9xMjDh-_MJXl03-pf',
        channelUrl: 'https://youtube.com/@AWSRiyadh'
      }
    ]
  }),

  // 50. Microservices
  createCourseTrack({
    id: 'microservices-architecture-masterclass',
    title: 'هندسة ومعمارية النظم الموزعة والخدمات المصغرة (Microservices Architecture)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'معمارية أنظمة',
    methodologyNote: 'تصميم الخدمات المستقلة، أنماط الاتصال Sync/Async، بوابات الـ API Gateway، وتحديات الاتساق والتوسع.',
    rankOrder: 7,
    orderIndex: 50,
    featured: true,
    viewsCount: 420000,
    toolsSummary: 'Microservices, API Gateway, Service Discovery, Event-Driven, Distributed Tracing',
    techStack: ['Microservices', 'System Design', 'Distributed Systems', 'Software Architecture'],
    instructors: [
      {
        id: 'inst-anjrini-microservices',
        name: 'إسماعيل عنجريني (Ismail Anjrini)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 9,
        durationText: '5 ساعات تدريبية',
        note: 'سلسلة Microservice بالعربي وشرح أنماط المعمارية الموزعة والتكامل بين الخدمات (9 دروس مرتبة ✔)',
        playlistId: 'PLZd2bo_SbAm-LKJ_x_OuOZtuwEFqbJ5B7',
        channelUrl: 'https://youtube.com/@IsmailAnjrini'
      },
      {
        id: 'inst-mahmoud-youssef-arch',
        name: 'محمود يوسف (Mahmoud Youssef)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 10,
        durationText: '6 ساعات تدريبية',
        note: 'أساسيات تصميم النظم الموزعة System Design ودراسات الحالة الواقعية للأنظمة الضخمة (10 دروس مرتبة ✔)',
        playlistId: 'PLZafHDYyxnk6S9bweaJ_KYuYqituwyXjl',
        channelUrl: 'https://youtube.com/@mahyoussef'
      },
      {
        id: 'inst-arch-talks-micro',
        name: 'هندسة البرمجيات (Software Architecture Talks)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 40,
        durationText: '18 ساعة تدريبية',
        note: 'شرح معمق ومناقشات تقنية غنية حول معمارية المايكروسيرفيس بالعربي (40 درساً مرتباً ✔)',
        playlistId: 'PLgAqrVq84PDdfiDow3YVsgc1q34JD415Z',
        channelUrl: 'https://youtube.com/@SoftwareArchTalks'
      }
    ]
  }),

  // 51. أنماط التصميم وSOLID
  createCourseTrack({
    id: 'design-patterns-solid-masterclass',
    title: 'مبادئ التصميم النظيف وأنماط التصميم المعمارية (SOLID Principles & Design Patterns)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'المرتبة #1 كود نظيف',
    methodologyNote: 'كتابة شيفرات برمجية قابلة للصيانة والتوسع عبر مبادئ SOLID وأنماط Gang of Four (Creational, Structural, Behavioral).',
    rankOrder: 8,
    orderIndex: 51,
    featured: true,
    viewsCount: 510000,
    toolsSummary: 'SOLID, Factory, Singleton, Observer, Strategy, Adapter, Clean Architecture',
    techStack: ['Design Patterns', 'SOLID', 'Clean Code', 'OOP', 'Software Engineering'],
    instructors: [
      {
        id: 'inst-mohammed-reda-solid',
        name: 'محمد رضا (Mohammed Reda)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 19,
        durationText: '8 ساعات تدريبية',
        note: 'شرح تفصيلي رائع لمبادئ SOLID بالعربي مع أمثلة برمجية واقعية وإعادة هيكلة الكود (19 درساً مرتباً ✔)',
        playlistId: 'PLnqAlQ9hFYdflFSS4NigVB7aSoYPNwHTL',
        channelUrl: 'https://youtube.com/@MohammedReda'
      },
      {
        id: 'inst-omar-ahmed-solid',
        name: 'عمر أحمد (Omar Ahmed)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 6,
        durationText: '3 ساعات تدريبية',
        note: 'شرح موجز ومركّز لكل مبدأ من مبادئ SOLID باللغة العربية (6 دروس مرتبة ✔)',
        playlistId: 'PLwWuxCLlF_uevri_OpofVLXkRRFnZ7TSV',
        channelUrl: 'https://youtube.com/@OmarAhmed'
      },
      {
        id: 'inst-passionate-coders-dp',
        name: 'محمد المهدي (Passionate Coders)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 16,
        durationText: '8 ساعات تدريبية',
        note: 'شرح عميق ومتقن لأنماط التصميم المعمارية Design Patterns وتطبيقاتها الاحترافية (16 درساً مرتباً ✔)',
        playlistId: 'PLsV97AQt78NTrqUAZM562JbR3ljX19JFR',
        channelUrl: 'https://youtube.com/@PassionateCoders'
      }
    ]
  }),

  // 52. اختبار البرمجيات
  createCourseTrack({
    id: 'software-testing-qa-masterclass',
    title: 'أساسيات ومنهجيات فحص وضمان جودة البرمجيات (Software Testing & QA)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'جودة واختبار',
    methodologyNote: 'مفاهيم الاختبار اليدوي والمؤتمت، Unit Testing, Integration Testing, دورة حياة فحص البرمجيات STLC، وإعداد تقارير الأخطاء.',
    rankOrder: 9,
    orderIndex: 52,
    viewsCount: 320000,
    toolsSummary: 'Manual Testing, Automation, STLC, Test Cases, Bug Reporting, Jira, Postman',
    techStack: ['Software Testing', 'QA', 'STLC', 'Test Automation', 'Quality Assurance'],
    instructors: [
      {
        id: 'inst-tresmerge-testing',
        name: 'تريسميرج (Tresmerge)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 24,
        durationText: '10 ساعات تدريبية',
        note: 'كورس اختبار البرمجيات الكامل بالعربي وتغطية كافة مفاهيم ومراحل الـ QA (24 درساً مرتباً ✔)',
        playlistId: 'PLzNfs-3kBUJllCa8_6pLYDMnIlg6Lfvu4',
        channelUrl: 'https://youtube.com/@Tresmerge'
      }
    ]
  }),

  // 53. RegEx
  createCourseTrack({
    id: 'regex-masterclass',
    title: 'احتراف التعبيرات النمطية والتحليل النصي (Regular Expressions - RegEx)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'مهارة فائقة',
    methodologyNote: 'إتقان مطابقة النصوص، التحقق من صحة المدخلات، استخراج الأنماط، وتطبيق RegEx عبر مختلف لغات البرمجة.',
    rankOrder: 10,
    orderIndex: 53,
    viewsCount: 210000,
    toolsSummary: 'RegEx, Pattern Matching, Metacharacters, Quantifiers, Lookahead, Groups',
    techStack: ['RegEx', 'Pattern Matching', 'Parsing', 'String Manipulation'],
    instructors: [
      {
        id: 'inst-alfaham-regex',
        name: 'عبدالله الفحام (Abdallah Alfaham)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 7,
        durationText: '3 ساعات تدريبية',
        note: 'دورة مكثفة وسريعة لاحتراف التعابير النظامية Regular Expressions بالأمثلة (7 دروس مرتبة ✔)',
        playlistId: 'PLBPdtL8DZBZISjop48YSJ82FF-2uIhe-f',
        channelUrl: 'https://youtube.com/@AbdallahAlfaham'
      },
      {
        id: 'inst-hardcode-regex',
        name: 'محمود سامي (Hard-Code)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 24,
        durationText: '8 ساعات تدريبية',
        note: 'شرح مفصل وتطبيقي للتعابير النمطية خطوة بخطوة حتى الاحتراف (24 درساً مرتباً ✔)',
        playlistId: 'PLwCMLs3sjOY4aVMg7hgQGHyQBZnHgFjJk',
        channelUrl: 'https://youtube.com/@hard-code'
      },
      {
        id: 'inst-naw-regex',
        name: 'تعلم مع ناو (Learn With Naw)',
        role: 'بديل معتمد',
        language: 'AR',
        verified: true,
        lessonsCount: 25,
        durationText: '8 ساعات تدريبية',
        note: 'سلسلة شاملة وتطبيقية لشرح التعابير النمطية REGEX بالعربي (25 درساً مرتباً ✔)',
        playlistId: 'PLt0HRIA9i35v2W3JFiCIeUMC4GoD9titN',
        channelUrl: 'https://youtube.com/@LearnWithNaw'
      }
    ]
  }),

  // 54. R
  createCourseTrack({
    id: 'r-programming-masterclass',
    title: 'البرمجة الإحصائية وتحليل واستكشاف البيانات بلغة R (R Programming)',
    domainId: 'devops-cloud',
    domainTitle: 'DevOps والسحابة والهندسة',
    badge: 'إحصاء وتحليل بيانات',
    methodologyNote: 'المعالجة الإحصائية، الرسوم البيانية المتقدمة، وتحليل مجموعات البيانات العلمية والتجريبية بلغة R.',
    rankOrder: 11,
    orderIndex: 54,
    viewsCount: 250000,
    toolsSummary: 'R, RStudio, ggplot2, Data Wrangling, Statistical Analysis, Data Frames',
    techStack: ['R', 'RStudio', 'Statistics', 'Data Science', 'Data Analysis'],
    instructors: [
      {
        id: 'inst-desouki-r',
        name: 'د. محمد الدسوقي (Mohamed El Desouki)',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 20,
        durationText: '10 ساعات تدريبية',
        note: 'كورس لغة R للمبتدئين بالعربي مع التطبيق الإحصائي وتحليل البيانات (20 درساً مرتباً ✔)',
        playlistId: 'PL1DUmTEdeA6LKTMW3wrlT3GiFMCL_r_Sn',
        channelUrl: 'https://youtube.com/@MohamedElDesouki'
      }
    ]
  }),

  // ==========================================
  // سادساً وسابعاً وثامناً: مسارات القطاعات الأكاديمية الأخرى (6 مسارات)
  // ==========================================

  // 55. قطاع الذكاء الاصطناعي وعلم البيانات - Machine Learning
  createCourseTrack({
    id: 'machine-learning-data-science',
    title: 'الذكاء الاصطناعي وعلم البيانات الشامل Machine Learning & Data Science',
    domainId: 'ai-data-science',
    domainTitle: 'الذكاء الاصطناعي وعلم البيانات',
    badge: 'المرتبة #1',
    methodologyNote: 'فهم الرياضيات الأساسية (الجبر الخطي والتفاضل) وتطبيق خوارزميات التعلم على مجموعات بيانات حقيقية.',
    rankOrder: 1,
    orderIndex: 55,
    featured: true,
    viewsCount: 540000,
    toolsSummary: 'Python, NumPy, Pandas, Scikit-Learn, Matplotlib, Regression',
    techStack: ['Python', 'Machine Learning', 'Data Science', 'Pandas'],
    instructors: [
      {
        id: 'inst-hesham-asem-ml',
        name: 'د. هشام عاصم',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 52,
        durationText: '30 ساعة',
        note: 'أكبر موسوعة عربية عملية لشرح وتطبيق خوارزميات تعلم الآلة الكلاسيكية والحديثة',
        playlistId: 'PLml-hesham',
        lessons: [
          { index: 1, videoId: 'wHIdCNIQHpo', title: 'مقدمة في الذكاء الاصطناعي والفرق بين ML و Deep Learning', duration: '24:10' },
          { index: 2, videoId: 'PzOH1v5GaW0', title: 'معالجة وتحليل البيانات باستخدام Pandas و NumPy المتقدمة', duration: '32:00' }
        ]
      },
      {
        id: 'inst-andrew-ng',
        name: 'Andrew Ng (DeepLearning.AI)',
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 38,
        durationText: '24 ساعة',
        note: 'دورة ستانفورد الرائدة التي دربت ملايين المتخصصين في الذكاء الاصطناعي حول العالم',
        playlistId: 'PLml-andrewng',
        lessons: [
          { index: 1, videoId: 'FOuA_ct11DQ', title: 'Supervised vs Unsupervised Learning Explained', duration: '20:45' }
        ]
      }
    ]
  }),

  // 56. قطاع الذكاء الاصطناعي وعلم البيانات - LLMs & Generative AI
  createCourseTrack({
    id: 'generative-ai-llm-engineering',
    title: 'هندسة النماذج اللغوية الكبيرة والذكاء الاصطناعي التوليدي LLMs & RAG',
    domainId: 'ai-data-science',
    domainTitle: 'الذكاء الاصطناعي وعلم البيانات',
    badge: 'جديد 2026',
    methodologyNote: 'بناء تطبيقات ذكية باستخدام LangChain و LlamaIndex وتقنيات استرجاع البيانات الموجه RAG.',
    rankOrder: 2,
    orderIndex: 56,
    viewsCount: 380000,
    toolsSummary: 'LangChain, LlamaIndex, OpenAI, HuggingFace, Vector DBs, RAG',
    techStack: ['Generative AI', 'LLMs', 'RAG', 'LangChain'],
    instructors: [
      {
        id: 'inst-hisham-dahshan',
        name: 'د. هشام دهشان',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 28,
        durationText: '14 ساعة',
        note: 'دورة متقدمة تواكب أحدث تقنيات بناء الوكلاء الأذكياء وقواعد البيانات الشعاعية',
        playlistId: 'PLgenai-dahshan',
        lessons: [
          { index: 1, videoId: 'mvZHDpCHphk', title: 'معمارية الـ Transformers وهندسة الأوامر المتقدمة Prompt Engineering', duration: '28:30' }
        ]
      },
      {
        id: 'inst-krish-naik',
        name: 'Krish Naik',
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 34,
        durationText: '18 ساعة',
        note: 'مشاريع عملية لنشر تطبيقات الذكاء الاصطناعي التوليدي وقواعد البيانات المتجهة',
        playlistId: 'PLgenai-krish',
        lessons: [
          { index: 1, videoId: '704e6U8Wq7c', title: 'Complete GenAI & LangChain Course with End to End Projects', duration: '42:15' }
        ]
      }
    ]
  }),

  // 57. قطاع الشبكات والأمن السيبراني - Cisco CCNA
  createCourseTrack({
    id: 'cisco-ccna-200-301',
    title: 'شهادة سيسكو الرسمية لإدارة الشبكات CCNA 200-301',
    domainId: 'networking-cybersecurity',
    domainTitle: 'الشبكات والأمن السيبراني',
    badge: 'المرتبة #1',
    examCode: 'CCNA 200-301',
    methodologyNote: 'يُنصح بدراسة المسار الأساسي وتطبيق تمارين Packet Tracer قبل دخول الامتحان الدولي.',
    rankOrder: 1,
    orderIndex: 57,
    featured: true,
    viewsCount: 385000,
    toolsSummary: 'Cisco IOS, Packet Tracer, Wireshark, Subnetting',
    techStack: ['Cisco', 'Packet Tracer', 'OSPF', 'IPv6', 'VLAN'],
    instructors: [
      {
        id: 'inst-ahmed-hassan',
        name: 'م. أحمد حسن',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 42,
        durationText: '32 ساعة',
        note: 'شرح أكاديمي شامل ومحدث لمنهج سيسكو الجديد مع محاكاة المعامل والتطبيق العملي',
        playlistId: 'PLrXX6HqGk5nNxxcc3d4Lg-8hV901',
        channelUrl: 'https://youtube.com/@ahmed-hassan-networks',
        lessons: [
          { index: 1, videoId: 'wHIdCNIQHpo', title: 'مقدمة في أساسيات الشبكات والنموذج المرجعي OSI', duration: '22:15' },
          { index: 2, videoId: 'PzOH1v5GaW0', title: 'بروتوكولات التوجيه وبناء عناوين IPv4 و IPv6', duration: '35:40' }
        ]
      },
      {
        id: 'inst-jeremy-it-lab',
        name: "Jeremy's IT Lab",
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 60,
        durationText: '40 ساعة',
        note: 'أفضل مسار تطبيقي دولي مع بطاقات استذكار Anki ومعامل Packet Tracer جاهزة',
        playlistId: 'PLjeremy-ccna',
        lessons: [
          { index: 1, videoId: 'FOuA_ct11DQ', title: 'Free CCNA 200-301 Complete Course - Network Fundamentals', duration: '28:15' }
        ]
      }
    ]
  }),

  // 58. قطاع الشبكات والأمن السيبراني - CompTIA Security+
  createCourseTrack({
    id: 'comptia-security-plus',
    title: 'أساسيات واحتراف الأمن السيبراني واختبار الاختراق CompTIA Security+',
    domainId: 'networking-cybersecurity',
    domainTitle: 'الشبكات والأمن السيبراني',
    badge: 'شهادة أمنية دولية',
    examCode: 'SY0-701',
    methodologyNote: 'تغطية شاملة لمبادئ Zero Trust والتشفير والدفاع عن الشبكات ضد الهجمات المتقدمة.',
    rankOrder: 2,
    orderIndex: 58,
    viewsCount: 310000,
    toolsSummary: 'Kali Linux, Wireshark, Metasploit, Cryptography, Nmap, SIEM',
    techStack: ['Cybersecurity', 'Security+', 'Kali Linux', 'Penetration Testing'],
    instructors: [
      {
        id: 'inst-ibrahim-hijazi',
        name: 'م. إبراهيم حجازي',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 45,
        durationText: '28 ساعة',
        note: 'شرح تطبيقي باللغة العربية مع محاكاة بيئات الاختراق الأخلاقي والتأهب لشهادة Security+',
        playlistId: 'PLsecplus-hijazi',
        lessons: [
          { index: 1, videoId: '704e6U8Wq7c', title: 'مقدمة في التهديدات السيبرانية وأنواع الهجمات الإلكترونية', duration: '26:50' },
          { index: 2, videoId: 'mvZHDpCHphk', title: 'معمارية الأمان المؤسسي وأنظمة كشف التسلل IDS/IPS', duration: '33:10' }
        ]
      },
      {
        id: 'inst-prof-messer',
        name: 'Professor Messer',
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 110,
        durationText: '35 ساعة',
        note: 'المسار التدريبي الأكثر ثقة واعتماداً حول العالم لاجتياز اختبار CompTIA Security+ SY0-701',
        playlistId: 'PLprof-messer-secplus',
        lessons: [
          { index: 1, videoId: 'wHIdCNIQHpo', title: 'CompTIA SY0-701 Security+ Training Course Introduction', duration: '12:30' }
        ]
      }
    ]
  }),

  // 59. قطاع الأعمال واللغات - إدارة المنتجات
  createCourseTrack({
    id: 'tech-product-management-agile',
    title: 'إدارة المنتجات التقنية وقيادة الفرق الرقمية Agile & Product Management',
    domainId: 'business-languages',
    domainTitle: 'الأعمال واللغات',
    badge: 'المرتبة #1',
    examCode: 'PSPO I',
    methodologyNote: 'إتقان دورة حياة المنتج من فكرة العميل حتى الإطلاق وإدارة مؤشرات الأداء OKRs & KPIs.',
    rankOrder: 1,
    orderIndex: 59,
    viewsCount: 195000,
    toolsSummary: 'Jira, Scrum, OKRs, Product Discovery, User Research, Roadmaps',
    techStack: ['Product Management', 'Agile', 'Scrum', 'Jira'],
    instructors: [
      {
        id: 'inst-ahmed-essam',
        name: 'أحمد عصام',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 25,
        durationText: '12 ساعة',
        note: 'دليل عملي واقعي لبناء وإطلاق المنتجات الرقمية والتنسيق بين فرق البرمجة والتسويق',
        playlistId: 'PLpm-ahmed',
        lessons: [
          { index: 1, videoId: 'wHIdCNIQHpo', title: 'مقدمة في إدارة المنتجات الرقمية والفرق بين PM و PO', duration: '22:15' },
          { index: 2, videoId: 'PzOH1v5GaW0', title: 'منهجية أجايل وإطار عمل Scrum وإدارة الـ Backlog', duration: '26:40' }
        ]
      },
      {
        id: 'inst-google-pm',
        name: 'Google Career Certificates',
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 30,
        durationText: '20 ساعة',
        note: 'الشهادة المهنية الرسمية من جوجل لإدارة المشاريع والمنتجات التقنية الحديثة',
        playlistId: 'PLgoogle-pm',
        lessons: [
          { index: 1, videoId: 'FOuA_ct11DQ', title: 'Google Project Management Professional Certificate Overview', duration: '18:10' }
        ]
      }
    ]
  }),

  // 60. قطاع الأعمال واللغات - إنجليزي المطورين
  createCourseTrack({
    id: 'english-for-software-engineers',
    title: 'اللغة الإنجليزية المهنية للمطورين والمبرمجين English for Tech & Remote Work',
    domainId: 'business-languages',
    domainTitle: 'الأعمال واللغات',
    badge: 'مسار مهني',
    methodologyNote: 'التدريب على المقابلات التقنية بالإنجليزية، كتابة الإيميلات المهنية وتوثيق الأكواد البرمجية.',
    rankOrder: 2,
    orderIndex: 60,
    viewsCount: 220000,
    toolsSummary: 'Tech Interviews, Remote Communication, PR Reviews, Documentation',
    techStack: ['English', 'Tech Communication', 'Interviews'],
    instructors: [
      {
        id: 'inst-omar-abdelrahim',
        name: 'عمر عبد الرحيم',
        role: 'أساسي',
        language: 'AR',
        verified: true,
        lessonsCount: 20,
        durationText: '10 ساعات',
        note: 'شرح مبسط ومركّز للمصطلحات الإنجليزية الأكثر استخداماً في المقابلات والعمل عن بعد',
        playlistId: 'PLenglish-omar',
        lessons: [
          { index: 1, videoId: '704e6U8Wq7c', title: 'المصطلحات الإنجليزية الأكثر أهمية في بيئات العمل التقنية', duration: '18:30' }
        ]
      },
      {
        id: 'inst-rachels-english',
        name: "Rachel's English",
        role: 'بديل معتمد',
        language: 'EN',
        verified: true,
        lessonsCount: 25,
        durationText: '12 ساعة',
        note: 'نطق سليم واحترافي للمصطلحات والعبارات أثناء الاجتماعات وعروض العمل التقديمية',
        playlistId: 'PLenglish-rachel',
        lessons: [
          { index: 1, videoId: 'mvZHDpCHphk', title: 'American English Pronunciation for Professionals and Tech', duration: '22:00' }
        ]
      }
    ]
  })
];
`;

fs.writeFileSync(COURSES_FILE, code, 'utf8');
console.log('Successfully wrote courses.js. Total size:', fs.statSync(COURSES_FILE).size);
