// هيكل ومخطط بيانات الدليل الأكاديمي الشامل لعام 2026 (Academic Tracks & Courses Schema)
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
          (lessonsCount > 0 ? `${lessonsCount} درساً` : '10 ساعات تدريبية');

        return {
          id: inst.id || `inst-${idx + 1}`,
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
            title: lesson.title || `درس ${lIdx + 1}`,
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
    thumbnail: data.thumbnail || (firstLesson?.videoId ? `https://i.ytimg.com/vi/${firstLesson.videoId}/hqdefault.jpg` : ''),
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
    promptBlueprint: data.promptBlueprint || `خطة تطبيق عملية لدراسة مسار: ${data.title}\n1. متابعة الدرس وتدوين الملاحظات البرمجية والعملية.\n2. تنفيذ التحدي العملي ومحاكاة المعامل والتأكد من صحة النتائج.\n3. الانتقال للدرس التالي وتثبيت المفاهيم المكتسبة.`,
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
      if (!inst.id) errors.push(`المحاضر #${idx + 1}: حقل id مفقود`);
      if (!inst.name) errors.push(`المحاضر #${idx + 1}: حقل name مفقود`);
      if (!INSTRUCTOR_ROLES.includes(inst.role)) {
        errors.push(`المحاضر #${idx + 1}: دور غير صالح (${inst.role}). الأدوار المتاحة: ${INSTRUCTOR_ROLES.join(', ')}`);
      }
      if (!INSTRUCTOR_LANGUAGES.includes(inst.language)) {
        errors.push(`المحاضر #${idx + 1}: لغة غير صالحة (${inst.language}). اللغات المتاحة: ${INSTRUCTOR_LANGUAGES.join(', ')}`);
      }
      if (typeof inst.verified !== 'boolean') {
        errors.push(`المحاضر #${idx + 1}: حقل verified يجب أن يكون boolean`);
      }
      if (typeof inst.lessonsCount !== 'number') {
        errors.push(`المحاضر #${idx + 1}: حقل lessonsCount يجب أن يكون رقماً`);
      }
      if (typeof inst.durationText !== 'string') {
        errors.push(`المحاضر #${idx + 1}: حقل durationText يجب أن يكون نصاً`);
      }
      if (!Array.isArray(inst.lessons)) {
        errors.push(`المحاضر #${idx + 1}: حقل lessons يجب أن يكون مصفوفة`);
      } else {
        inst.lessons.forEach((l, lIdx) => {
          if (typeof l.index !== 'number') errors.push(`المحاضر #${idx + 1} - الدرس #${lIdx + 1}: حقل index يجب أن يكون رقماً`);
          if (typeof l.videoId !== 'string') errors.push(`المحاضر #${idx + 1} - الدرس #${lIdx + 1}: حقل videoId يجب أن يكون نصاً`);
          if (typeof l.title !== 'string') errors.push(`المحاضر #${idx + 1} - الدرس #${lIdx + 1}: حقل title يجب أن يكون نصاً`);
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
  // 1. قطاع الويب والبرمجة - دورة بايثون الشاملة من الصفر حتى الاحتراف الكامل
  createCourseTrack({
      "id": "python-masterclass",
      "title": "دورة بايثون الشاملة من الصفر حتى الاحتراف الكامل",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "المرتبة #1",
      "methodologyNote": "يُنصح بدراسة المسار الأساسي (152 درساً) مع كتابة الأكواد والتطبيق على التمارين العملية.",
      "rankOrder": 1,
      "orderIndex": 1,
      "featured": true,
      "viewsCount": 1420000,
      "toolsSummary": "Python 3.12, OOP, Algorithms, Data Structures, Automation",
      "techStack": [
          "Python",
          "OOP",
          "Data Structures",
          "Scripting",
          "Automation"
      ],
      "instructors": [
          {
              "id": "inst-osama-elzero",
              "name": "أسامة محمد (الزيرو - Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 152,
              "durationText": "26 ساعة تدريبية",
              "note": "دورة بايثون المعتمدة والشاملة من الصفر مع التطبيقات والمشاريع (152 درسًا ✔)",
              "playlistId": "PLDoPjvoNmBAyE_gei5d18qkfIe-Z8mocs"
          },
          {
              "id": "inst-islam-codezilla",
              "name": "إسلام هشام (كودزيلا - Codezilla)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 48,
              "durationText": "18 ساعة تدريبية",
              "note": "شرح تطبيقي مبسط وسريع لبايثون مع بناء مشاريع وألعاب كلاسيكية",
              "playlistId": "PLuXY3ddo_8nzrO74UeZQVZOb5-wIS6krJ"
          },
          {
              "id": "inst-abdelrahman-gamal-python",
              "name": "عبدالرحمن جمال (Abdelrahman Gamal)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 53,
              "durationText": "20 ساعة تدريبية",
              "note": "دورة شاملة ومفصلة من الصفر حتى المفاهيم المتقدمة والتطبيقات (53 درسًا ✔)",
              "playlistId": "PLknwEmKsW8OsG8dnisr_-2WGyx7lpgGEE"
          }
      ]
  }),
  // 2. قطاع الويب والبرمجة - دورة جافاسكربت الحديثة الشاملة (JavaScript ES6+)
  createCourseTrack({
      "id": "javascript-masterclass",
      "title": "دورة جافاسكربت الحديثة الشاملة (JavaScript ES6+)",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "المرتبة #1",
      "methodologyNote": "العمود الفقري لتطوير الويب؛ مسار الزيرو يغطي أدق التفاصيل مع التحديات البرمجية.",
      "rankOrder": 2,
      "orderIndex": 2,
      "featured": true,
      "viewsCount": 1850000,
      "toolsSummary": "JavaScript ES6+, DOM, BOM, Async/Await, OOP, Fetch API",
      "techStack": [
          "JavaScript",
          "ES6",
          "DOM",
          "BOM",
          "Async",
          "OOP"
      ],
      "instructors": [
          {
              "id": "inst-elzero-js",
              "name": "أسامة محمد (Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 188,
              "durationText": "35 ساعة تدريبية",
              "note": "أضخم كورس عربي شامل لجافاسكربت من الصفر حتى أدق تفاصيل ES6+ و DOM (≈188 درسًا ✔)",
              "playlistId": "PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv"
          },
          {
              "id": "inst-abdelrahman-gamal-js",
              "name": "عبدالرحمن جمال (Abdelrahman Gamal)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 81,
              "durationText": "16 ساعة تدريبية",
              "note": "شرح مركز وعملي مع تطبيقات ومشاريع حقيقية للواجهات التفاعلية (80 درسًا ✔)",
              "playlistId": "PLknwEmKsW8OuTqUDaFRBiAViDZ5uI3VcE"
          },
          {
              "id": "inst-elzanaty-js",
              "name": "محمد الزناتي (Mohammed Elzanaty)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 15,
              "durationText": "8 ساعات تدريبية",
              "note": "دورة تفاعلية حديثة تركز على مفاهيم جافاسكربت المعمارية وأحدث ممارسات السوق",
              "playlistId": "PLLWuK602vNiVnYxkrT7qbFSictc9nJeiX"
          }
      ]
  }),
  // 3. قطاع الويب والبرمجة - تطوير واجهات الويب التأسيسي والتفاعلي HTML5 & CSS3
  createCourseTrack({
      "id": "html-css-masterclass",
      "title": "تطوير واجهات الويب التأسيسي والتفاعلي HTML5 & CSS3",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "تأسيس إلزامي",
      "methodologyNote": "حجر الأساس لكل مطور ويب؛ يشمل إتقان هيكلة المستندات والتنسيق المتقدم.",
      "rankOrder": 3,
      "orderIndex": 3,
      "featured": false,
      "viewsCount": 950000,
      "toolsSummary": "HTML5, CSS3, Flexbox, CSS Grid, Responsive Design",
      "techStack": [
          "HTML5",
          "CSS3",
          "Flexbox",
          "CSS Grid",
          "Responsive"
      ],
      "instructors": [
          {
              "id": "inst-elzero-html",
              "name": "أسامة محمد (Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 37,
              "durationText": "6 ساعات تدريبية",
              "note": "دورة HTML5 التأسيسية الشاملة والمحدثة وفق أحدث معايير الويب (HTML وحده 37 درسًا ✔)",
              "playlistId": "PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji"
          },
          {
              "id": "inst-tarmeez-html-css",
              "name": "أكاديمية ترميز (Tarmeez)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 12,
              "durationText": "5 ساعات تدريبية",
              "note": "شرح مبسط ومركز لأساسيات بناء الصفحات وتنسيقها",
              "playlistId": "PLYyqC4bNbCIdES52srHE6xTiIgvgMkBWu"
          },
          {
              "id": "inst-octucode-html",
              "name": "إبراهيم عادل (OctuCode)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 17,
              "durationText": "6 ساعات تدريبية",
              "note": "منهجية تفاعلية بصرية لتعلم لغات الويب التأسيسية خطوة بخطوة",
              "playlistId": "PLoP3S2S1qTfCVIETOGwaK3lyaL3UKu403"
          }
      ]
  }),
  // 4. قطاع الويب والبرمجة - تصميم المواقع المتجاوبة بإطار العمل Bootstrap 5
  createCourseTrack({
      "id": "bootstrap-masterclass",
      "title": "تصميم المواقع المتجاوبة بإطار العمل Bootstrap 5",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "إطار واجهات",
      "methodologyNote": "تعلم بناء مواقع سريعة التجاوب باستخدام نظام الشبكات والمكونات الجاهزة.",
      "rankOrder": 4,
      "orderIndex": 4,
      "featured": false,
      "viewsCount": 520000,
      "toolsSummary": "Bootstrap 5, Responsive Grid, UI Components, Utility Classes",
      "techStack": [
          "Bootstrap 5",
          "CSS",
          "Responsive Web",
          "Flexbox"
      ],
      "instructors": [
          {
              "id": "inst-elzero-bootstrap",
              "name": "أسامة محمد (Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 25,
              "durationText": "5 ساعات تدريبية",
              "note": "شرح مفصل لمكونات ونظام شبكة Bootstrap 5 لبناء قوالب متجاوبة",
              "playlistId": "PLDoPjvoNmBAyvm7f--dc6XqkpfDcen_vQ"
          },
          {
              "id": "inst-abdelrahman-gamal-bootstrap",
              "name": "عبدالرحمن جمال (Abdelrahman Gamal)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 26,
              "durationText": "5 ساعات تدريبية",
              "note": "دورة تطبيقية لبناء مواقع حقيقية بواسطة Bootstrap 5",
              "playlistId": "PLknwEmKsW8OscL9GvjxwL7RYbcwwdIitk"
          },
          {
              "id": "inst-ag-coding-bootstrap",
              "name": "أحمد جمال (Ag Coding)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 17,
              "durationText": "4 ساعات تدريبية",
              "note": "شرح عملي سريع لبناء صفحات عصرية متجاوبة",
              "playlistId": "PLnD96kXp-_pMJp3stPetkN76AJ2mmeah7"
          }
      ]
  }),
  // 5. قطاع الويب والبرمجة - احتراف تصميم الواجهات الحديثة بإطار العمل Tailwind CSS
  createCourseTrack({
      "id": "tailwind-css-masterclass",
      "title": "احتراف تصميم الواجهات الحديثة بإطار العمل Tailwind CSS",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "الأكثر طلباً",
      "methodologyNote": "إطار العمل المفضل عالمياً للواجهات؛ سرعة تطوير قصوى بدون مغادرة ملف الـ HTML/JSX.",
      "rankOrder": 5,
      "orderIndex": 5,
      "featured": true,
      "viewsCount": 460000,
      "toolsSummary": "Tailwind CSS 3, Utility-first, JIT Engine, Responsive Layouts",
      "techStack": [
          "Tailwind CSS",
          "CSS3",
          "Responsive UI",
          "Modern Frontend"
      ],
      "instructors": [
          {
              "id": "inst-ag-coding-tailwind",
              "name": "أحمد جمال (Ag Coding)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 15,
              "durationText": "5 ساعات تدريبية",
              "note": "كورس شامل ومحدث لاحتراف Tailwind CSS وبناء مشاريع كاملة",
              "playlistId": "PLnD96kXp-_pMR9cBUmvsz_kIIt9bv2UIP"
          }
      ]
  }),
  // 6. قطاع الويب والبرمجة - احتراف معالجة وتنسيق CSS المتقدم بواسطة Sass (SCSS)
  createCourseTrack({
      "id": "sass-masterclass",
      "title": "احتراف معالجة وتنسيق CSS المتقدم بواسطة Sass (SCSS)",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "أدوات تنسيق",
      "methodologyNote": "تنظيم وإعادة استخدام أكواد CSS للمشاريع الضخمة والمتوسطة.",
      "rankOrder": 6,
      "orderIndex": 6,
      "featured": false,
      "viewsCount": 380000,
      "toolsSummary": "Sass, SCSS, Mixins, Variables, Nesting, Inheritance",
      "techStack": [
          "Sass",
          "SCSS",
          "CSS Preprocessor",
          "Modular CSS"
      ],
      "instructors": [
          {
              "id": "inst-elzero-sass",
              "name": "أسامة محمد (Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 19,
              "durationText": "4 ساعات تدريبية",
              "note": "الدورة الرسمية الشاملة لتعلم Sass/SCSS بالتفصيل (19 درسًا ✔)",
              "playlistId": "PLDoPjvoNmBAzlpyFHOaB3b-eubmF0TAV2"
          }
      ]
  }),
  // 7. قطاع الويب والبرمجة - التعامل مع عناصر DOM وحركات الواجهة بواسطة مكتبة jQuery
  createCourseTrack({
      "id": "jquery-masterclass",
      "title": "التعامل مع عناصر DOM وحركات الواجهة بواسطة مكتبة jQuery",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "مكتبة واجهات",
      "methodologyNote": "مكتبة تاريخية هامة لفهم تطبيقات الويب الكلاسيكية وتسهيل التعامل مع DOM.",
      "rankOrder": 7,
      "orderIndex": 7,
      "featured": false,
      "viewsCount": 320000,
      "toolsSummary": "jQuery 3, DOM Manipulation, AJAX, Animations, Effects",
      "techStack": [
          "jQuery",
          "JavaScript",
          "DOM",
          "AJAX"
      ],
      "instructors": [
          {
              "id": "inst-elzero-jquery",
              "name": "أسامة محمد (Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 45,
              "durationText": "7 ساعات تدريبية",
              "note": "شرح كامل وشامل لكل دوال وتطبيقات ومؤثرات مكتبة jQuery",
              "playlistId": "PLDoPjvoNmBAwXDFEEpc8TT6MFbDAC5XNB"
          },
          {
              "id": "inst-mobarmg-jquery",
              "name": "مبرمج - معهد تكنولوجيا المعلومات (Mobarmg ITI)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 14,
              "durationText": "4 ساعات تدريبية",
              "note": "منهج أكاديمي رصين من معهد ITI يشرح مبادئ واستخدامات المكتبة",
              "playlistId": "PLzCpl3aBwaY5CmY-9Td8GhlLnq9GuJmpB"
          },
          {
              "id": "inst-hassouna-jquery",
              "name": "أحمد حسونة (Hassouna Academy)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 89,
              "durationText": "12 ساعة تدريبية",
              "note": "سلسلة تفصيلية تغطي جميع الجوانب العملية والتطبيقية لـ jQuery",
              "playlistId": "PLHIfW1KZRIfll3ObMFi02Ry7oRU3MJVRG"
          }
      ]
  }),
  // 8. قطاع الويب والبرمجة - إتقان كتابة الشيفرات الموجهة وتأمين الأنواع مع TypeScript
  createCourseTrack({
      "id": "typescript-masterclass",
      "title": "إتقان كتابة الشيفرات الموجهة وتأمين الأنواع مع TypeScript",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "أساسي للواجهات",
      "methodologyNote": "تأمين الشيفرات البرمجية ومنع أخطاء وقت التشغيل قبل الانتقال لأطر العمل.",
      "rankOrder": 8,
      "orderIndex": 8,
      "featured": true,
      "viewsCount": 580000,
      "toolsSummary": "TypeScript 5, Generics, Interfaces, Types, Decorators",
      "techStack": [
          "TypeScript",
          "JavaScript",
          "Static Typing",
          "OOP",
          "Generics"
      ],
      "instructors": [
          {
              "id": "inst-elzero-typescript",
              "name": "أسامة محمد (Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 38,
              "durationText": "7 ساعات تدريبية",
              "note": "الدورة المعتمدة لاحتراف TypeScript من الصفر حتى المفاهيم المتقدمة (38 درسًا ✔)",
              "playlistId": "PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ"
          },
          {
              "id": "inst-programming-solutions-ts",
              "name": "Programming Solutions",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 23,
              "durationText": "5 ساعات تدريبية",
              "note": "شرح تطبيقي لأساسيات ومفاهيم TypeScript مع الأمثلة",
              "playlistId": "PLFRm7nYIypQF618y6D_JO4d8vrj988wJf"
          },
          {
              "id": "inst-hussein-alrubaye-ts",
              "name": "د. حسين الربيعي (Hussein Al Rubaye)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 16,
              "durationText": "4 ساعات تدريبية",
              "note": "مقدمة أكاديمية وعملية لـ TypeScript واستخداماتها",
              "playlistId": "PLF8OvnCBlEY27rEmxg4F86iFljMXyCmk1"
          }
      ]
  }),
  // 9. قطاع الويب والبرمجة - بناء وتطوير تطبيقات الواجهات الأمامية التفاعلية بواسطة React.js
  createCourseTrack({
      "id": "react-masterclass",
      "title": "بناء وتطوير تطبيقات الواجهات الأمامية التفاعلية بواسطة React.js",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "المرتبة #1",
      "methodologyNote": "المكتبة الأكثر طلباً في سوق العمل؛ يفضل دراستها بعد جافاسكربت مباشرة.",
      "rankOrder": 9,
      "orderIndex": 9,
      "featured": true,
      "viewsCount": 1250000,
      "toolsSummary": "React 19, Hooks, Redux Toolkit, React Router, Context API",
      "techStack": [
          "React",
          "Hooks",
          "Redux",
          "Router",
          "SPA",
          "JavaScript"
      ],
      "instructors": [
          {
              "id": "inst-algorithm-react",
              "name": "أكاديمية خوارزمية (Algorithm Academy)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 81,
              "durationText": "20 ساعة تدريبية",
              "note": "دورة احترافية متكاملة لـ React من الصفر إلى المشاريع المتقدمة",
              "playlistId": "PLfDx4cQoUNObRCqeYOws_JK_CCGCmQv_l"
          },
          {
              "id": "inst-unique-coderz-react",
              "name": "Unique Coderz Academy",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 64,
              "durationText": "18 ساعة تدريبية",
              "note": "شرح معماري عميق لمفاهيم React وإدارة الحالة المتقدمة",
              "playlistId": "PLtFbQRDJ11kEjXWZmwkOV-vfXmrEEsuEW"
          },
          {
              "id": "inst-kimz-codes-react",
              "name": "كيمز كودز (kimz codes)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 36,
              "durationText": "10 ساعات تدريبية",
              "note": "تطبيقات عملية ومشاريع عصرية متسلسلة باستخدام React",
              "playlistId": "PLejc1JbD4ZFSaQIFNstRIrbm_fqb12Q59"
          }
      ]
  }),
  // 10. قطاع الويب والبرمجة - تطوير تطبيقات الويب أحادية الصفحة الحديثة بواسطة Vue.js
  createCourseTrack({
      "id": "vue-masterclass",
      "title": "تطوير تطبيقات الويب أحادية الصفحة الحديثة بواسطة Vue.js",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "إطار متطور",
      "methodologyNote": "إطار عمل سلس وسهل التعلم يتميز ببنية نظيفة وإنتاجية عالية.",
      "rankOrder": 10,
      "orderIndex": 10,
      "featured": false,
      "viewsCount": 420000,
      "toolsSummary": "Vue.js 3, Composition API, Pinia, Vue Router, Vite",
      "techStack": [
          "Vue.js",
          "Composition API",
          "Pinia",
          "Vite",
          "Vue Router"
      ],
      "instructors": [
          {
              "id": "inst-elzero-vue",
              "name": "أسامة محمد (Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 38,
              "durationText": "8 ساعات تدريبية",
              "note": "دورة شاملة ومفصلة لتعلم Vue.js ومفاهيمها التأسيسية",
              "playlistId": "PLDoPjvoNmBAxr5AqK3Yz4DWYKVSmIFziw"
          },
          {
              "id": "inst-algorithm-vue",
              "name": "أكاديمية خوارزمية (Algorithm Academy)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 33,
              "durationText": "8 ساعات تدريبية",
              "note": "شرح تطبيقي حديث لـ Vue 3 مع الـ Composition API",
              "playlistId": "PLfDx4cQoUNObtw2FtE4_eX_k9yCf-Fcd3"
          }
      ]
  }),
  // 11. قطاع الويب والبرمجة - بناء الأنظمة المؤسسية وتطبيقات الشركات بواسطة Angular
  createCourseTrack({
      "id": "angular-masterclass",
      "title": "بناء الأنظمة المؤسسية وتطبيقات الشركات بواسطة Angular",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "أنظمة مؤسسية",
      "methodologyNote": "إطار عمل متكامل مدعوم من Google؛ مخصص للمشاريع المؤسسية الضخمة.",
      "rankOrder": 11,
      "orderIndex": 11,
      "featured": false,
      "viewsCount": 480000,
      "toolsSummary": "Angular, TypeScript, RxJS, Dependency Injection, Services",
      "techStack": [
          "Angular",
          "TypeScript",
          "RxJS",
          "Enterprise",
          "Components"
      ],
      "instructors": [
          {
              "id": "inst-kmr-script-angular",
              "name": "م. خليل السعيد (KMR Script)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 39,
              "durationText": "12 ساعة تدريبية",
              "note": "دورة تطبيقية شاملة لـ Angular باللغة العربية مع بناء مشاريع متكاملة",
              "playlistId": "PLL2zWZTDFZzh2WEmc3fH_O4y4N05ZCqB2"
          },
          {
              "id": "inst-codezone-angular",
              "name": "كود زون (codeZone)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 9,
              "durationText": "4 ساعات تدريبية",
              "note": "شرح مركز ومكثف لأساسيات Angular والمفاهيم الجوهرية",
              "playlistId": "PLQtNtS-WfRa8piCgv_buHpthEBXHaw0ss"
          },
          {
              "id": "inst-mobarmg-angular",
              "name": "مبرمج - معهد تكنولوجيا المعلومات (Mobarmg ITI)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 25,
              "durationText": "8 ساعات تدريبية",
              "note": "منهج أكاديمي احترافي من معهد ITI لتأهيل مطوري الواجهات المؤسسية",
              "playlistId": "PLzCpl3aBwaY7eOwGMlps70dTYs2TSsgj1"
          }
      ]
  }),
  // 12. قطاع الويب والبرمجة - بناء خوادم الويب وخدمات الـ APIs المتطورة بواسطة Node.js & Express
  createCourseTrack({
      "id": "nodejs-masterclass",
      "title": "بناء خوادم الويب وخدمات الـ APIs المتطورة بواسطة Node.js & Express",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "المرتبة #1 خلفية",
      "methodologyNote": "المدخل الأساسي للمطورين لاستخدام جافاسكربت في بناء الخوادم الخلفية.",
      "rankOrder": 12,
      "orderIndex": 12,
      "featured": true,
      "viewsCount": 890000,
      "toolsSummary": "Node.js, Express.js, RESTful APIs, MongoDB, JWT Auth",
      "techStack": [
          "Node.js",
          "Express",
          "JavaScript",
          "REST APIs",
          "Backend"
      ],
      "instructors": [
          {
              "id": "inst-emam-academy-nodejs",
              "name": "أحمد إمام (Emam Academy)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 64,
              "durationText": "18 ساعة تدريبية",
              "note": "أشمل مسار عملي لبناء RESTful APIs ومعمارية الخوادم بواسطة Node.js",
              "playlistId": "PLGhZWewM_75LQf3KvHo6HHSclmDyDazl7"
          },
          {
              "id": "inst-algorithm-nodejs",
              "name": "أكاديمية خوارزمية (Algorithm Academy)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 57,
              "durationText": "15 ساعة تدريبية",
              "note": "دورة احترافية تغطي المفاهيم الأساسية والمتقدمة وقواعد البيانات",
              "playlistId": "PLfDx4cQoUNOa3EiUpjO04DVxEE9Ox12ta"
          },
          {
              "id": "inst-takharif-nodejs",
              "name": "تخاريف مبرمج (Takharif Mobarmg)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 32,
              "durationText": "9 ساعات تدريبية",
              "note": "شرح تطبيقي مبسط وعميق لبناء مشاريع واقعية بالـ Node",
              "playlistId": "PLkzDzmo9y3VG_pByjuxE7uuLYvmWgfBub"
          }
      ]
  }),
  // 13. قطاع الويب والبرمجة - هندسة وتطوير الخوادم المؤسسية القابلة للتوسع بواسطة Nest.js
  createCourseTrack({
      "id": "nestjs-masterclass",
      "title": "هندسة وتطوير الخوادم المؤسسية القابلة للتوسع بواسطة Nest.js",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "معمارية مؤسسية",
      "methodologyNote": "إطار العمل القياسي لبناء معمارية خوادم احترافية مطابقة لأحدث ممارسات السوق.",
      "rankOrder": 13,
      "orderIndex": 13,
      "featured": false,
      "viewsCount": 340000,
      "toolsSummary": "Nest.js, TypeScript, Microservices, TypeORM, Swagger, Clean Architecture",
      "techStack": [
          "Nest.js",
          "TypeScript",
          "Microservices",
          "TypeORM",
          "Clean Architecture"
      ],
      "instructors": [
          {
              "id": "inst-tarmeez-nestjs",
              "name": "أكاديمية ترميز (Tarmeez)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 18,
              "durationText": "6 ساعات تدريبية",
              "note": "شرح رائع لأساسيات Nest.js والمعمارية المنظمة للخوادم",
              "playlistId": "PLYyqC4bNbCIdlMvge1ZG-jJlQtjHHZQWl"
          },
          {
              "id": "inst-index-academy-nestjs",
              "name": "Index Academy",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 13,
              "durationText": "5 ساعات تدريبية",
              "note": "دورة تطبيقية لبناء خدمات وواجهات برمجية متقدمة بواسطة Nest.js",
              "playlistId": "PLDQ11FgmbqQP1aaCCiU74LzebvZjY_S4G"
          },
          {
              "id": "inst-mahmoud-abdullah-nestjs",
              "name": "محمود عبدالله (Mahmoud Abdullah)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 49,
              "durationText": "14 ساعة تدريبية",
              "note": "شرح معماري وتطبيقي مفصل لبناء أنظمة وواجهات برمجية كاملة",
              "playlistId": "PLOldSEMXUdZsFAEJwxYkE83dhm1ZkWEOL"
          }
      ]
  }),
  // 14. قطاع الويب والبرمجة - تطوير تطبيقات Vue الشاملة مع التصيير من جهة الخادم Nuxt.js
  createCourseTrack({
      "id": "nuxtjs-masterclass",
      "title": "تطوير تطبيقات Vue الشاملة مع التصيير من جهة الخادم Nuxt.js",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "SSR واجهات",
      "methodologyNote": "التطوير المتكامل لتطبيقات Vue مع تحسين محركات البحث SEO والأداء الفائق.",
      "rankOrder": 14,
      "orderIndex": 14,
      "featured": false,
      "viewsCount": 220000,
      "toolsSummary": "Nuxt 3, Vue 3, SSR, Nitro Engine, SEO, Fullstack Vue",
      "techStack": [
          "Nuxt.js",
          "Vue.js",
          "SSR",
          "SEO",
          "Nitro"
      ],
      "instructors": [
          {
              "id": "inst-mahmoud-zohdi-nuxt",
              "name": "محمود زهدي (Mahmoud Zohdi)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 29,
              "durationText": "7 ساعات تدريبية",
              "note": "دورة كاملة وحديثة لشرح إطار العمل Nuxt 3 وبناء تطبيقات SSR احترافية",
              "playlistId": "PLLXntwspGdhCBdax1ZJTEX6Gg5vCwOSUL"
          }
      ]
  }),
  // 15. قطاع الويب والبرمجة - البرمجة بلغة PHP وتطوير الواجهات الخلفية (PHP 8 Bootcamp)
  createCourseTrack({
      "id": "php-masterclass",
      "title": "البرمجة بلغة PHP وتطوير الواجهات الخلفية (PHP 8 Bootcamp)",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "الأكثر انتشاراً",
      "methodologyNote": "اللغة التي تشغل أكثر من 75% من مواقع الإنترنت؛ دورة الزيرو تعتبر المرجع العربي الأول.",
      "rankOrder": 15,
      "orderIndex": 15,
      "featured": false,
      "viewsCount": 1100000,
      "toolsSummary": "PHP 8, OOP, MySQL, PDO, Sessions, MVC Pattern",
      "techStack": [
          "PHP",
          "OOP",
          "MySQL",
          "PDO",
          "MVC",
          "Backend"
      ],
      "instructors": [
          {
              "id": "inst-elzero-php",
              "name": "أسامة محمد (Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 105,
              "durationText": "24 ساعة تدريبية",
              "note": "معسكر PHP 8 الكامل: من الأساسيات إلى البرمجة كائنية التوجه وتطبيقات الويب (PHP Bootcamp، 105 دروس ✔)",
              "playlistId": "PLDoPjvoNmBAy41u35AqJUrI-H83DObUDq"
          },
          {
              "id": "inst-mora-soft-php",
              "name": "مورا سوفت (Mora Soft)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 23,
              "durationText": "8 ساعات تدريبية",
              "note": "شرح تطبيقي لـ PHP مع قواعد البيانات وربط المشاريع",
              "playlistId": "PLftLUHfDSiZ7pKXkpGCoZATm5rF6msj5A"
          }
      ]
  }),
  // 16. قطاع الويب والبرمجة - احتراف إطار العمل الأقوى لتطبيقات الويب Laravel 10/11
  createCourseTrack({
      "id": "laravel-masterclass",
      "title": "احتراف إطار العمل الأقوى لتطبيقات الويب Laravel 10/11",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "المرتبة #1 PHP",
      "methodologyNote": "الإطار الأكثر استخداماً في الشرق الأوسط والعالم لتطبيقات الويب الضخمة.",
      "rankOrder": 16,
      "orderIndex": 16,
      "featured": true,
      "viewsCount": 780000,
      "toolsSummary": "Laravel, Eloquent ORM, Blade, Migrations, REST APIs, Sanctum",
      "techStack": [
          "Laravel",
          "PHP",
          "Eloquent",
          "MVC",
          "Authentication",
          "APIs"
      ],
      "instructors": [
          {
              "id": "inst-professional-code-laravel",
              "name": "بروفيشنال كود (Professional Code)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 51,
              "durationText": "16 ساعة تدريبية",
              "note": "دورة شاملة ومحدثة لبناء تطبيقات ويب متكاملة وإدارة قواعد البيانات بواسطة Laravel",
              "playlistId": "PL6XRLlEsQ_7Xy0fwWHhmo5H_RCI1RbtqG"
          },
          {
              "id": "inst-mora-soft-laravel",
              "name": "مورا سوفت (Mora Soft)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 39,
              "durationText": "12 ساعة تدريبية",
              "note": "سلسلة احترافية لبناء تطبيقات عملية من الصفر",
              "playlistId": "PLftLUHfDSiZ4GfPZxaFDsA7ejUzD7SpWa"
          },
          {
              "id": "inst-mohammed-mustafa-laravel",
              "name": "محمد مصطفى (Mohammed Mustafa)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 38,
              "durationText": "10 ساعات تدريبية",
              "note": "شرح تطبيقي مبسط لمفاهيم Laravel وبناء REST APIs",
              "playlistId": "PLd4ZH7drWj7DAt5osYlsya3sscPoERtGC"
          }
      ]
  }),
  // 17. قطاع الويب والبرمجة - تطوير تطبيقات الويب السريعة والآمنة بواسطة بايثون Django
  createCourseTrack({
      "id": "django-masterclass",
      "title": "تطوير تطبيقات الويب السريعة والآمنة بواسطة بايثون Django",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "إطار بايثون",
      "methodologyNote": "إطار العمل المفضل لتطوير تطبيقات بايثون السريعة بفضل لوحة التحكم المدمجة والأمان العالي.",
      "rankOrder": 17,
      "orderIndex": 17,
      "featured": false,
      "viewsCount": 650000,
      "toolsSummary": "Django 5, Python, ORM, Django REST Framework, Admin Panel",
      "techStack": [
          "Django",
          "Python",
          "ORM",
          "DRF",
          "PostgreSQL",
          "Backend"
      ],
      "instructors": [
          {
              "id": "inst-abdelrahman-gamal-django",
              "name": "عبدالرحمن جمال (Abdelrahman Gamal)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 39,
              "durationText": "14 ساعة تدريبية",
              "note": "دورة احترافية شاملة من الصفر حتى بناء مواقع ومتاجر إلكترونية متكاملة بـ Django",
              "playlistId": "PLknwEmKsW8OtK_n48UOuYGxJPbSFrICxm"
          },
          {
              "id": "inst-oloom-django",
              "name": "شبكة علوم (Oloom Network)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 53,
              "durationText": "16 ساعة تدريبية",
              "note": "سلسلة تفصيلية تغطي بناء مشاريع ويب متكاملة وقواعد البيانات",
              "playlistId": "PLTcPeoMjkuCxoyflbe4AuNWMZWulKVbr4"
          },
          {
              "id": "inst-elsafy-django",
              "name": "الصافي حجازي (Elsafy Hegazy)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 25,
              "durationText": "8 ساعات تدريبية",
              "note": "شرح تطبيقي وعملي لبناء خدمات ويب بواسطة بايثون ودجانجو",
              "playlistId": "PLdZYzC8fohEKjuYyvITqYc2vL0lAWRvhs"
          }
      ]
  }),
  // 18. قطاع الويب والبرمجة - بناء خوادم وتطبيقات الويب المصغرة والمرنة بواسطة Python Flask
  createCourseTrack({
      "id": "flask-masterclass",
      "title": "بناء خوادم وتطبيقات الويب المصغرة والمرنة بواسطة Python Flask",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "مايكرو سيرفيس",
      "methodologyNote": "إطار عمل خفيف ومرن ممتاز لبناء الـ Microservices وتطبيقات الذكاء الاصطناعي.",
      "rankOrder": 18,
      "orderIndex": 18,
      "featured": false,
      "viewsCount": 280000,
      "toolsSummary": "Flask, Jinja2, SQLAlchemy, REST APIs, Microservices",
      "techStack": [
          "Flask",
          "Python",
          "Jinja2",
          "SQLAlchemy",
          "Microservices"
      ],
      "instructors": [
          {
              "id": "inst-algorithm-flask",
              "name": "أكاديمية خوارزمية (Algorithm Academy)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 28,
              "durationText": "7 ساعات تدريبية",
              "note": "دورة شاملة ومفصلة لتعلم Flask وبناء تطبيقات وواجهات برمجية خفيفة وسريعة",
              "playlistId": "PLfDx4cQoUNObFOYvkcNQG8arJX95TRE47"
          }
      ]
  }),
  // 19. قطاع الويب والبرمجة - البرمجة الشيئية وهندسة التطبيقات بلغة جافا Java SE (4 مستويات)
  createCourseTrack({
      "id": "java-masterclass",
      "title": "البرمجة الشيئية وهندسة التطبيقات بلغة جافا Java SE (4 مستويات)",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "الأقوى مؤسسياً",
      "methodologyNote": "العملاق المؤسسي؛ مسار د. محمد شوشان يغطي 4 مستويات كاملة مع مشروع ختامي.",
      "rankOrder": 19,
      "orderIndex": 19,
      "featured": false,
      "viewsCount": 1350000,
      "toolsSummary": "Java SE, OOP, Collections, Multithreading, Streams API, Final Project",
      "techStack": [
          "Java",
          "OOP",
          "Collections",
          "Streams",
          "Multithreading",
          "Desktop & Backend"
      ],
      "instructors": [
          {
              "id": "inst-shoushan-java",
              "name": "د. محمد شوشان (Mohamed Shoushan)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 74,
              "durationText": "28 ساعة تدريبية",
              "note": "المسار الأكاديمي الشامل لجافا: 4 مستويات متدرجة، OOP، مع مشروع تخرج ختامي كامل (4 مستويات ومشروع ختامي)",
              "playlistId": "PLnzqK5HvcpwTgEDztQ8y4K4-VoeoK1QCG"
          },
          {
              "id": "inst-adel-nasim-java",
              "name": "عادل نسيم (Adel Nasim)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 34,
              "durationText": "10 ساعات تدريبية",
              "note": "شرح تأسيسي واضح ومبسط لمفاهيم جافا والبرمجة الشيئية",
              "playlistId": "PLCInYL3l2AajYlZGzU_LVrHdoouf8W6ZN"
          },
          {
              "id": "inst-eldesouki-java",
              "name": "د. محمد الدسوقي (Mohamed El Desouki)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 102,
              "durationText": "32 ساعة تدريبية",
              "note": "سلسلة جامعية رصينة تغطي لغة جافا وهياكل البيانات والبرمجة كائنية التوجه",
              "playlistId": "PL1DUmTEdeA6K7rdxKiWJq6JIxTvHalY8f"
          }
      ]
  }),
  // 20. قطاع الويب والبرمجة - أساسيات واحتراف لغة البرمجة سي شارب C# والبرمجة كائنية التوجه
  createCourseTrack({
      "id": "csharp-masterclass",
      "title": "أساسيات واحتراف لغة البرمجة سي شارب C# والبرمجة كائنية التوجه",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "نظام مايكروسوفت",
      "methodologyNote": "اللغة الأساسية لبيئة عمل .NET وتطبيقات المؤسسات والألعاب بواسطة Unity.",
      "rankOrder": 20,
      "orderIndex": 20,
      "featured": false,
      "viewsCount": 920000,
      "toolsSummary": "C# 12, .NET Core, OOP, LINQ, Async/Await, Generics",
      "techStack": [
          "C#",
          ".NET",
          "OOP",
          "LINQ",
          "Data Structures"
      ],
      "instructors": [
          {
              "id": "inst-codographia-csharp",
              "name": "كودوغرافيا (Codographia)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 40,
              "durationText": "12 ساعة تدريبية",
              "note": "الدورة الحديثة والمتكاملة لاحتراف لغة C# والبرمجة الكائنية وفق أحدث معايير .NET",
              "playlistId": "PLX1bW_GeBRhCU9l7examhVrARmXHHRrLR"
          },
          {
              "id": "inst-passionate-coders-csharp",
              "name": "Passionate Coders",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 34,
              "durationText": "11 ساعة تدريبية",
              "note": "شرح معماري وتطبيقي عميق للمفاهيم المتقدمة في لغة C#",
              "playlistId": "PLsV97AQt78NT0H8J71qe7edwRpAirfqOI"
          },
          {
              "id": "inst-shoushan-csharp",
              "name": "د. محمد شوشان (Mohamed Shoushan)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 42,
              "durationText": "14 ساعة تدريبية",
              "note": "منهج أكاديمي متسلسل يشرح أساسيات ومفاهيم لغة C# بدقة وتفصيل",
              "playlistId": "PLnzqK5HvcpwQLsXXXxx_mX3WvUEgGM0iA"
          }
      ]
  }),
  // 21. قطاع الويب والبرمجة - بناء تطبيقات وأنظمة الويب المتكاملة بواسطة ASP.NET Core & Web APIs
  createCourseTrack({
      "id": "aspnet-masterclass",
      "title": "بناء تطبيقات وأنظمة الويب المتكاملة بواسطة ASP.NET Core & Web APIs",
      "domainId": "web-programming",
      "domainTitle": "الويب والبرمجة",
      "badge": "المرتبة #1 .NET",
      "methodologyNote": "بيئة العمل القياسية في القطاع المصرفي والحكومي والشركات الكبرى.",
      "rankOrder": 21,
      "orderIndex": 21,
      "featured": true,
      "viewsCount": 840000,
      "toolsSummary": "ASP.NET Core 8, Web API, Entity Framework Core, Identity, Repository Pattern",
      "techStack": [
          "ASP.NET Core",
          "C#",
          "EF Core",
          "Web API",
          "SQL Server",
          "JWT"
      ],
      "instructors": [
          {
              "id": "inst-khalid-essaadani-aspnet",
              "name": "خالد السعداني (Khalid Essaadani)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 38,
              "durationText": "18 ساعة تدريبية",
              "note": "المسار العملي الأشهر عربياً لبناء مشاريع ويب واقعية باستخدام ASP.NET Core و EF Core",
              "playlistId": "PLwj1YcMhLRN1zbN2olMzvIBXP06FIwoes"
          },
          {
              "id": "inst-codographia-aspnet",
              "name": "كودوغرافيا (Codographia)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 34,
              "durationText": "14 ساعة تدريبية",
              "note": "شرح حديث ومعماري متطور لبناء Web APIs احترافية بواسطة .NET",
              "playlistId": "PLX1bW_GeBRhAjpkPCTpKXJoFGe2ZpYGUC"
          },
          {
              "id": "inst-passionate-coders-aspnet",
              "name": "Passionate Coders",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 52,
              "durationText": "20 ساعة تدريبية",
              "note": "تغطية تفصيلية متعمقة لهندسة البرمجيات وبناء الخدمات الخلفية بـ ASP.NET",
              "playlistId": "PLsV97AQt78NQ8E7cEqovH0zLYRJgJahGh"
          }
      ]
  }),
  // 22. قطاع لغات وتطبيقات وألعاب - احتراف البرمجة بلغة C++ والبرمجة الموجهة وإدارة الذاكرة
  createCourseTrack({
      "id": "cpp-masterclass",
      "title": "احتراف البرمجة بلغة C++ والبرمجة الموجهة وإدارة الذاكرة",
      "domainId": "languages-apps",
      "domainTitle": "لغات وتطبيقات وألعاب",
      "badge": "المرتبة #1 أداء",
      "methodologyNote": "أساس البرمجة التنافسية وهندسة النظم ومحركات الألعاب؛ تتطلب صبراً وفهماً دقيقاً للذاكرة.",
      "rankOrder": 1,
      "orderIndex": 22,
      "featured": true,
      "viewsCount": 1100000,
      "toolsSummary": "C++20, Pointers, Memory Management, OOP, STL, Data Structures",
      "techStack": [
          "C++",
          "OOP",
          "Pointers",
          "STL",
          "Algorithms",
          "Memory Management"
      ],
      "instructors": [
          {
              "id": "inst-adel-nasim-cpp",
              "name": "عادل نسيم (Adel Nasim)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 75,
              "durationText": "22 ساعة تدريبية",
              "note": "الشرح العربي الأكثر وضوحاً وتنظيماً لمنهج C++ والبرمجة الكائنية وهياكل البيانات",
              "playlistId": "PLCInYL3l2AajFAiw4s1U4QbGszcQ-rAb3"
          },
          {
              "id": "inst-eldesouki-cpp",
              "name": "د. محمد الدسوقي (Mohamed El Desouki)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 56,
              "durationText": "18 ساعة تدريبية",
              "note": "سلسلة جامعية تأسيسية رصينة تشرح مفاهيم C++ بالتفصيل وبناء الخوارزميات",
              "playlistId": "PL1DUmTEdeA6IUD9Gt5rZlQfbZyAWXd-oD"
          },
          {
              "id": "inst-elzero-cpp",
              "name": "أسامة محمد (Elzero Web School)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 116,
              "durationText": "26 ساعة تدريبية",
              "note": "دورة كاملة ومفصلة من الصفر مع التمارين العملية والتحديات البرمجية المكثفة",
              "playlistId": "PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS"
          }
      ]
  }),
  // 23. قطاع لغات وتطبيقات وألعاب - أساسيات البرمجة منخفضة المستوى والتعامل مع العتاد بلغة C
  createCourseTrack({
      "id": "c-programming-masterclass",
      "title": "أساسيات البرمجة منخفضة المستوى والتعامل مع العتاد بلغة C",
      "domainId": "languages-apps",
      "domainTitle": "لغات وتطبيقات وألعاب",
      "badge": "تأسيس صلب",
      "methodologyNote": "أم اللغات البرمجية؛ تمنح المطور فهماً عميقاً لكيفية عمل المعالج والذاكرة وأنظمة التشغيل.",
      "rankOrder": 2,
      "orderIndex": 23,
      "featured": false,
      "viewsCount": 450000,
      "toolsSummary": "C Standard, Pointers, Memory Allocation, Bitwise, Structures",
      "techStack": [
          "C",
          "Pointers",
          "Memory Management",
          "Low-level",
          "Embedded Systems"
      ],
      "instructors": [
          {
              "id": "inst-ahmed-sallam-c",
              "name": "م. أحمد سلام (Ahmed Sallam)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 50,
              "durationText": "15 ساعة تدريبية",
              "note": "شرح أكاديمي وهندسي متميز للغة C والأنظمة المدمجة مع محاكاة الذاكرة",
              "playlistId": "PLMm8EjqH1EFXI8wByY0umF_DQON2S9uws"
          },
          {
              "id": "inst-fci-c",
              "name": "FCI-Career-Build",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 23,
              "durationText": "8 ساعات تدريبية",
              "note": "منهج تأسيسي لطلاب كليات الحاسبات والمعلومات لتعلم مفاهيم لغة C",
              "playlistId": "PLEBRPBUkZ4mb6lVqSLRQ7mvSFRcoR7-XV"
          }
      ]
  }),
  // 24. قطاع لغات وتطبيقات وألعاب - أمان الذاكرة والأداء الفائق مع لغة البرمجة الحديثة Rust
  createCourseTrack({
      "id": "rust-masterclass",
      "title": "أمان الذاكرة والأداء الفائق مع لغة البرمجة الحديثة Rust",
      "domainId": "languages-apps",
      "domainTitle": "لغات وتطبيقات وألعاب",
      "badge": "المستقبل",
      "methodologyNote": "اللغة الأكثر حباً بين المطورين عالمياً؛ مسار المهندس أحمد فرغل بقائمتيه يوفر التدرج الأمثل.",
      "rankOrder": 3,
      "orderIndex": 24,
      "featured": true,
      "viewsCount": 310000,
      "toolsSummary": "Rust, Ownership, Borrow Checker, Concurrency, Cargo, WebAssembly",
      "techStack": [
          "Rust",
          "Memory Safety",
          "Concurrency",
          "Systems Programming",
          "Cargo"
      ],
      "instructors": [
          {
              "id": "inst-farghal-rust-1",
              "name": "أحمد فرغل (Rust للغلابة)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 25,
              "durationText": "8 ساعات تدريبية",
              "note": "دورة التأسيس الأساسية: شرح مفاهيم الـ Ownership والـ Borrowing والمفاهيم الجوهرية للغة Rust",
              "playlistId": "PLald6EODoOJU0GMuYHlkS9MLhTPE7HiaT"
          },
          {
              "id": "inst-farghal-rust-2",
              "name": "أحمد فرغل (Rust and chill)",
              "role": "مكمل",
              "language": "AR",
              "verified": true,
              "lessonsCount": 23,
              "durationText": "7 ساعات تدريبية",
              "note": "السلسلة المكملة: تطبيقات وتحديات برمجية ومناقشات معمارية متقدمة في Rust",
              "playlistId": "PLald6EODoOJWcSXfix8tgr5aVS76IU11M"
          }
      ]
  }),
  // 25. قطاع لغات وتطبيقات وألعاب - تعلم لغة دارت Dart من الصفر لتطوير تطبيقات الموبايل والويب
  createCourseTrack({
      "id": "dart-masterclass",
      "title": "تعلم لغة دارت Dart من الصفر لتطوير تطبيقات الموبايل والويب",
      "domainId": "languages-apps",
      "domainTitle": "لغات وتطبيقات وألعاب",
      "badge": "تأسيس Flutter",
      "methodologyNote": "المتطلب الإجباري قبل البدء بتطوير تطبيقات Flutter لضمان كتابة أكواد نظيفة.",
      "rankOrder": 4,
      "orderIndex": 25,
      "featured": false,
      "viewsCount": 410000,
      "toolsSummary": "Dart 3, OOP, Asynchronous Programming, Null Safety, Streams",
      "techStack": [
          "Dart",
          "OOP",
          "Null Safety",
          "Async/Await",
          "Streams",
          "Flutter Engine"
      ],
      "instructors": [
          {
              "id": "inst-asem-saafan-dart",
              "name": "عاصم سعفان (Asem Saafan)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 32,
              "durationText": "9 ساعات تدريبية",
              "note": "الدورة التأسيسية الأفضل عربياً لتعلم دارت والبرمجة الكائنية والأمان ضد القيم الفارغة",
              "playlistId": "PLMDrOnfT8EAj6Yjdki9OCLSwqdBs4xhQz"
          }
      ]
  }),
  // 26. قطاع لغات وتطبيقات وألعاب - تطوير تطبيقات الموبايل الهجينة للأندرويد وiOS بواسطة Flutter & Dart
  createCourseTrack({
      "id": "flutter-mobile-mastery",
      "title": "تطوير تطبيقات الموبايل الهجينة للأندرويد وiOS بواسطة Flutter & Dart",
      "domainId": "languages-apps",
      "domainTitle": "لغات وتطبيقات وألعاب",
      "badge": "المرتبة #1 موبايل",
      "methodologyNote": "المسار المفضل عربياً وعالمياً لبناء تطبيقات أندرويد و iOS من قاعدة شيفرة واحدة.",
      "rankOrder": 5,
      "orderIndex": 26,
      "featured": true,
      "viewsCount": 1480000,
      "toolsSummary": "Flutter 3, Dart, Bloc, Provider, REST APIs, Firebase, Clean Architecture",
      "techStack": [
          "Flutter",
          "Dart",
          "Bloc",
          "State Management",
          "Cross-Platform",
          "Mobile Apps"
      ],
      "instructors": [
          {
              "id": "inst-tarek-alabd-flutter",
              "name": "طارق العبد (Tarek Alabd)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 65,
              "durationText": "24 ساعة تدريبية",
              "note": "المسار العملي الأشهر عربياً لاحتراف Flutter وبناء تطبيقات ومشاريع حقيقية متكاملة",
              "playlistId": "PL0vtyWBHY2NXQ9PxbZV8ixhIRirs8WCt_"
          },
          {
              "id": "inst-omar-ahmed-flutter",
              "name": "عمر أحمد (Omar Ahmed)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 47,
              "durationText": "16 ساعة تدريبية",
              "note": "شرح معماري متقدم لإدارة الحالة بواسطة BLoC وبناء مشاريع واقعية عصرية",
              "playlistId": "PLwWuxCLlF_ucnfkI-_yNRCOTI-yJa5N-a"
          },
          {
              "id": "inst-scholar-tech-flutter",
              "name": "سكولار تك (Scholar Tech)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 26,
              "durationText": "10 ساعات تدريبية",
              "note": "دورة تطبيقية مركزة لتصميم واجهات مستخدم متميزة وربط البيانات",
              "playlistId": "PLGVaNq6mHinjCPki-3xraQdGWKVz7PhgI"
          }
      ]
  }),
  // 27. قطاع لغات وتطبيقات وألعاب - تطوير تطبيقات الآيفون والآيباد بلغة سويفت SwiftUI & iOS
  createCourseTrack({
      "id": "ios-swift-masterclass",
      "title": "تطوير تطبيقات الآيفون والآيباد بلغة سويفت SwiftUI & iOS",
      "domainId": "languages-apps",
      "domainTitle": "لغات وتطبيقات وألعاب",
      "badge": "تطوير آبل",
      "methodologyNote": "التطوير الأصيل (Native) لبيئة آبل بواسطة سويفت لإنتاج تطبيقات ذات سلاسة وجودة فائقة.",
      "rankOrder": 6,
      "orderIndex": 27,
      "featured": false,
      "viewsCount": 360000,
      "toolsSummary": "Swift 5, SwiftUI, Xcode, CoreData, Combine, iOS 17/18",
      "techStack": [
          "Swift",
          "SwiftUI",
          "iOS",
          "Xcode",
          "Mobile Development",
          "Apple"
      ],
      "instructors": [
          {
              "id": "inst-bambarmg-ios",
              "name": "بامبرمج (Bambarmg)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 26,
              "durationText": "10 ساعات تدريبية",
              "note": "دورة احترافية متكاملة لتعلم تطوير تطبيقات iOS بلغة Swift وبناء تطبيقات عملية في Xcode",
              "playlistId": "PLQaOY10EEc8bNbEBMyiJU1I-GIgs1LQfj"
          }
      ]
  }),
  // 28. قطاع لغات وتطبيقات وألعاب - صناعة وتطوير ألعاب 2D و3D بواسطة محرك الألعاب المفتوح Godot
  createCourseTrack({
      "id": "godot-game-engine-masterclass",
      "title": "صناعة وتطوير ألعاب 2D و3D بواسطة محرك الألعاب المفتوح Godot",
      "domainId": "languages-apps",
      "domainTitle": "لغات وتطبيقات وألعاب",
      "badge": "محرك ألعاب حر",
      "methodologyNote": "محرك ألعاب مجاني ومفتوح المصدر خفيف الوزن وسريع التعلم ويحظى بانتشار هائل.",
      "rankOrder": 7,
      "orderIndex": 28,
      "featured": true,
      "viewsCount": 420000,
      "toolsSummary": "Godot Engine 4, GDScript, 2D Physics, 3D Rendering, Shaders",
      "techStack": [
          "Godot",
          "GDScript",
          "Game Development",
          "2D Games",
          "3D Games",
          "Physics"
      ],
      "instructors": [
          {
              "id": "inst-ahmed-monis-godot",
              "name": "أحمد مؤنس (Ahmed Mo’nis)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 44,
              "durationText": "12 ساعة تدريبية",
              "note": "سلسلة شاملة ومميزة لاحتراف صناعة الألعاب بمحرك Godot من الصفر حتى النشر",
              "playlistId": "PLqBd9au_wtU3eX7mLVuLLOt9sfbDWlJsq"
          },
          {
              "id": "inst-spritesheet-godot",
              "name": "سبرايت شيت (SpriteSheet)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 33,
              "durationText": "9 ساعات تدريبية",
              "note": "شرح تطبيقي لصناعة ألعاب ثنائية الأبعاد والفيزياء وتحريك الشخصيات في Godot",
              "playlistId": "PLXUEZFpQn01Hp06m0MxlMzj8x5Y2n9Dek"
          },
          {
              "id": "inst-whales-state-godot",
              "name": "Whales State",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 22,
              "durationText": "6 ساعات تدريبية",
              "note": "دروس عملية لبناء آليات الألعاب المتقدمة والأنظمة التفاعلية في Godot",
              "playlistId": "PLU8IixMdsBbmpMmYpgSCkemhqlLpTJAnJ"
          }
      ]
  }),
  // 29. قطاع لغات وتطبيقات وألعاب - تصميم وتطوير ألعاب الفيديو ثنائية وثلاثية الأبعاد بواسطة Unity & C#
  createCourseTrack({
      "id": "unity-game-engine-masterclass",
      "title": "تصميم وتطوير ألعاب الفيديو ثنائية وثلاثية الأبعاد بواسطة Unity & C#",
      "domainId": "languages-apps",
      "domainTitle": "لغات وتطبيقات وألعاب",
      "badge": "المرتبة #1 ألعاب",
      "methodologyNote": "المحرك الأوسع انتشاراً عالمياً لصناعة ألعاب الموبايل والحاسوب؛ مسار طورني يشمل شروحات 2D و 3D.",
      "rankOrder": 8,
      "orderIndex": 29,
      "featured": true,
      "viewsCount": 880000,
      "toolsSummary": "Unity 2023, C#, 2D Physics, 3D Worlds, Animations, Audio, UI",
      "techStack": [
          "Unity",
          "C#",
          "Game Development",
          "2D Games",
          "3D Games",
          "Physics"
      ],
      "instructors": [
          {
              "id": "inst-6wrni-unity-2d",
              "name": "طورني - ألعاب ثنائية الأبعاد (6wrni 2D)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 18,
              "durationText": "6 ساعات تدريبية",
              "note": "دورة تأسيسية رائعة لصناعة أول لعبة 2D متكاملة بالفيزياء والتحكم في Unity",
              "playlistId": "PLltZRmsFXWnLp98IIM1CISQYWowq87YSp"
          },
          {
              "id": "inst-6wrni-unity-3d",
              "name": "طورني - ألعاب ثلاثية الأبعاد (6wrni 3D)",
              "role": "مكمل",
              "language": "AR",
              "verified": true,
              "lessonsCount": 21,
              "durationText": "8 ساعات تدريبية",
              "note": "سلسلة متقدمة مكملة لبناء العوالم والإضاءة والشخصيات في بيئة Unity ثلاثية الأبعاد",
              "playlistId": "PLltZRmsFXWnKk5F3_ltKWKq6lZLveotIF"
          }
      ]
  }),
  // 30. قطاع علوم الحاسوب - الخوارزميات وحل المسائل البرمجية (Algorithms & Problem Solving)
  createCourseTrack({
      "id": "algorithms-masterclass",
      "title": "الخوارزميات وحل المسائل البرمجية (Algorithms & Problem Solving)",
      "domainId": "computer-science",
      "domainTitle": "علوم الحاسوب",
      "badge": "المرتبة #1 خوارزميات",
      "methodologyNote": "المسار التأسيسي لفهم منطق الخوارزميات، تحليل التعقيد الزمني والمكاني Big-O، وحل مسائل المقابلات التقنية.",
      "rankOrder": 1,
      "orderIndex": 30,
      "featured": true,
      "viewsCount": 520000,
      "toolsSummary": "Algorithms, Big-O, Sorting, Searching, Recursion, Dynamic Programming",
      "techStack": [
          "Algorithms",
          "Data Structures",
          "Problem Solving",
          "Big-O",
          "LeetCode"
      ],
      "instructors": [
          {
              "id": "inst-hardcode-algo",
              "name": "محمود سامي (Hard-Code)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 15,
              "durationText": "8 ساعات تدريبية",
              "note": "شرح مبسط وتطبيقي لأهم خوارزميات الترتيب والبحث والتعقيد الزمني (15 درساً مرتباً ✔)",
              "playlistId": "PLwCMLs3sjOY6KH-8c9F-lMWn-r02hyoV_"
          },
          {
              "id": "inst-adel-nasim-algo",
              "name": "عادل نسيم (Adel Nasim)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 37,
              "durationText": "16 ساعة تدريبية",
              "note": "دورة شاملة ومفصلة في تحليل الخوارزميات وتراكيب البيانات المتقدمة مع تمارين C++ العملية",
              "playlistId": "PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp"
          },
          {
              "id": "inst-desouki-algo",
              "name": "د. محمد الدسوقي (Mohamed El Desouki)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 14,
              "durationText": "10 ساعات تدريبية",
              "note": "المنهج الأكاديمي الجامعي لشرح خوارزميات البيانات والبحث والترتيب بأسلوب عميق ومتقن",
              "playlistId": "PL1DUmTEdeA6JlommmGP5wicYLxX5PVCQt"
          }
      ]
  }),
  // 31. قطاع علوم الحاسوب - هياكل وتراكيب البيانات المتقدمة (Data Structures Course)
  createCourseTrack({
      "id": "data-structures-masterclass",
      "title": "هياكل وتراكيب البيانات المتقدمة (Data Structures Course)",
      "domainId": "computer-science",
      "domainTitle": "علوم الحاسوب",
      "badge": "المرتبة #1 هياكل بيانات",
      "methodologyNote": "فهم متعمق لكيفية تنظيم الذاكرة والتعامل مع Arrays, Linked Lists, Stacks, Queues, Trees, Graphs.",
      "rankOrder": 2,
      "orderIndex": 31,
      "featured": true,
      "viewsCount": 480000,
      "toolsSummary": "Arrays, Linked Lists, Stacks, Queues, Binary Trees, Graphs, Hash Tables",
      "techStack": [
          "Data Structures",
          "C++",
          "Memory",
          "Trees",
          "Graphs"
      ],
      "instructors": [
          {
              "id": "inst-adel-nasim-ds",
              "name": "عادل نسيم (Adel Nasim)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 37,
              "durationText": "16 ساعة تدريبية",
              "note": "الكورس المرجعي العربي الأشهر لشرح وتطبيق تراكيب البيانات بلغة C++ من الصفر حتى الاحتراف",
              "playlistId": "PLCInYL3l2AajqOUW_2SwjWeMwf4vL4RSp"
          },
          {
              "id": "inst-hardcode-ds",
              "name": "محمود سامي (Hard-Code)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 31,
              "durationText": "12 ساعة تدريبية",
              "note": "دورة عملية رائعة تبسط هياكل البيانات والتطبيقات البرمجية الواقعية خطوة بخطوة",
              "playlistId": "PLwCMLs3sjOY4UQq4vXgGPwGLVX1Y5faaS"
          },
          {
              "id": "inst-nehal-elsamoly-ds",
              "name": "نهال السامولي (Nehal Elsamoly)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 11,
              "durationText": "6 ساعات تدريبية",
              "note": "شرح متميز ومبسط لهياكل البيانات التأسيسية وأهم المفاهيم للطلاب والمبتدئين",
              "playlistId": "PLIxq078xdGdZWUXwumK9lbEn3kKwKLTwx"
          }
      ]
  }),
  // 32. قطاع علوم الحاسوب - لغة التجميع والبرمجة منخفضة المستوى x86 Assembly Language
  createCourseTrack({
      "id": "assembly-masterclass",
      "title": "لغة التجميع والبرمجة منخفضة المستوى x86 Assembly Language",
      "domainId": "computer-science",
      "domainTitle": "علوم الحاسوب",
      "badge": "منخفض المستوى",
      "methodologyNote": "الغوص في أعماق المعالج (CPU Registers, Memory Addressing, Stack Frame) وكتابة كود الأسمبلي المباشر.",
      "rankOrder": 3,
      "orderIndex": 32,
      "featured": false,
      "viewsCount": 260000,
      "toolsSummary": "x86, 8086, Registers, Assembly, Low-Level, Debugging, Emulator",
      "techStack": [
          "Assembly",
          "x86",
          "Microprocessors",
          "Low-Level"
      ],
      "instructors": [
          {
              "id": "inst-ahmed-sallam-assembly",
              "name": "أحمد سلام (Ahmed Sallam)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 30,
              "durationText": "14 ساعة تدريبية",
              "note": "شرح أكاديمي دقيق ومفصل للغة التجميع x86 ومعمارية المعالجات والتعامل مع المسجلات",
              "playlistId": "PLMm8EjqH1EFVodghdDWaAuHkHqj-nJ0bN"
          },
          {
              "id": "inst-sherif-ezzat-assembly",
              "name": "شريف عزت (Sherif Ezzat)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 46,
              "durationText": "18 ساعة تدريبية",
              "note": "دورة معالج 8086 وتطبيقات لغة الأسمبلي العملية والتحكم في العتاد والذاكرة",
              "playlistId": "PLi0-RQZxQ8Fmwopq43StX61igOvXbFMQv"
          }
      ]
  }),
  // 33. قطاع علوم الحاسوب - تنظيم وبناء ومعمارية الحاسب (Computer Architecture)
  createCourseTrack({
      "id": "computer-architecture-masterclass",
      "title": "تنظيم وبناء ومعمارية الحاسب (Computer Architecture)",
      "domainId": "computer-science",
      "domainTitle": "علوم الحاسوب",
      "badge": "عتاد وأنظمة",
      "methodologyNote": "دراسة الدوائر المنطقية ووحدات المعالجة المركزية، خطوط النقل، مسار البيانات، وهيكلية الذاكرة المخبأة Cache.",
      "rankOrder": 4,
      "orderIndex": 33,
      "featured": false,
      "viewsCount": 240000,
      "toolsSummary": "ALU, Control Unit, Pipelining, Caching, Instruction Set Architecture (ISA)",
      "techStack": [
          "Computer Architecture",
          "Hardware",
          "Pipelining",
          "ISA"
      ],
      "instructors": [
          {
              "id": "inst-ahmed-sallam-ca",
              "name": "أحمد سلام (Ahmed Sallam)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 27,
              "durationText": "12 ساعة تدريبية",
              "note": "المسار الأكاديمي الشامل لتنظيم وبناء الحاسب وتصميم وحدات المعالجة والذاكرة (27 درساً مرتباً ✔)",
              "playlistId": "PLMm8EjqH1EFVEVWSiBdCoBEJHffjHUScZ"
          }
      ]
  }),
  // 34. قطاع علوم الحاسوب - هندسة ونظم التشغيل المعاصرة (Operating Systems Concepts)
  createCourseTrack({
      "id": "operating-systems-masterclass",
      "title": "هندسة ونظم التشغيل المعاصرة (Operating Systems Concepts)",
      "domainId": "computer-science",
      "domainTitle": "علوم الحاسوب",
      "badge": "المرتبة #1 أنظمة",
      "methodologyNote": "إتقان مفاهيم العمليات Processes، الخيوط Threads، الجدولة CPU Scheduling، التزامن والمزامنة وإدارة الذاكرة.",
      "rankOrder": 5,
      "orderIndex": 34,
      "featured": true,
      "viewsCount": 390000,
      "toolsSummary": "Processes, Threads, Semaphores, Deadlocks, Paging, Virtual Memory",
      "techStack": [
          "Operating Systems",
          "Concurrency",
          "Memory Management",
          "Kernel"
      ],
      "instructors": [
          {
              "id": "inst-ahmed-sallam-os",
              "name": "أحمد سلام (Ahmed Sallam)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 28,
              "durationText": "14 ساعة تدريبية",
              "note": "شرح أكاديمي متميز ومترابط لكتاب نظم التشغيل المعتمد عالمياً ونظريات إدارة العمليات",
              "playlistId": "PLMm8EjqH1EFV-jECqtMxeVMDoVkV_kJDY"
          },
          {
              "id": "inst-ahmed-hagag-os",
              "name": "د. أحمد حجاج (Dr. Ahmed Hagag)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 21,
              "durationText": "10 ساعات تدريبية",
              "note": "محاضرات جامعية قيمة ومفصلة لشرح نظم التشغيل وحل المسائل العملية والجدولة",
              "playlistId": "PLxIvc-MGOs6ib0oK1z9C46DeKd9rRcSMY"
          },
          {
              "id": "inst-mohamed-alsayed-os",
              "name": "محمد السيد (SoftwareTube / Mohamed Alnaqid)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 60,
              "durationText": "25 ساعة تدريبية",
              "note": "شرح موسع لكتاب Dinosaur Book مع تفصيل دقيق لجميع فصول نظم التشغيل الحديثة (60 درساً ✔)",
              "playlistId": "PLTr1xN4uMK5seRz6IO7Am9Zp2UKdnzO_n"
          }
      ]
  }),
  // 35. قطاع علوم الحاسوب - إدارة وتشغيل خوادم وأنظمة لينكس (Linux System Administration)
  createCourseTrack({
      "id": "linux-system-masterclass",
      "title": "إدارة وتشغيل خوادم وأنظمة لينكس (Linux System Administration)",
      "domainId": "computer-science",
      "domainTitle": "علوم الحاسوب",
      "badge": "نظام التشغيل القياسي",
      "methodologyNote": "إتقان سطر الأوامر Bash، أذونات الملفات، إدارة العمليات والخدمات، والشبكات في نظام لينكس.",
      "rankOrder": 6,
      "orderIndex": 35,
      "featured": false,
      "viewsCount": 310000,
      "toolsSummary": "Bash, Terminal, Permissions, Systemd, Package Managers, Networking, SSH",
      "techStack": [
          "Linux",
          "Ubuntu",
          "Bash",
          "System Administration",
          "Terminal"
      ],
      "instructors": [
          {
              "id": "inst-anahr-linux",
              "name": "أنس النهر (anaHr)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 12,
              "durationText": "6 ساعات تدريبية",
              "note": "سلسلة مميزة واحترافية لتعلم نظام لينكس وسطر الأوامر وإدارة الخوادم (12 درساً مرتباً ✔)",
              "playlistId": "PL8pYI62gCNsWTppELEUCpforC4avEiLox"
          }
      ]
  }),
  // 36. قطاع علوم الحاسوب - البرمجة المنطقية والذكاء الاصطناعي بلغة برولوج (Prolog Logic Programming)
  createCourseTrack({
      "id": "prolog-programming-masterclass",
      "title": "البرمجة المنطقية والذكاء الاصطناعي بلغة برولوج (Prolog Logic Programming)",
      "domainId": "computer-science",
      "domainTitle": "علوم الحاسوب",
      "badge": "برمجة منطقية",
      "methodologyNote": "فهم نمط البرمجة التصريحية وبناء قواعد المعرفة والقواعد المنطقية والاستدلال في الذكاء الاصطناعي.",
      "rankOrder": 7,
      "orderIndex": 36,
      "featured": false,
      "viewsCount": 180000,
      "toolsSummary": "Prolog, Knowledge Bases, Facts, Rules, Inference, Logic Programming",
      "techStack": [
          "Prolog",
          "Logic Programming",
          "AI",
          "Inference"
      ],
      "instructors": [
          {
              "id": "inst-ahmed-sallam-prolog",
              "name": "أحمد سلام (Ahmed Sallam)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 26,
              "durationText": "10 ساعات تدريبية",
              "note": "الكورس العربي الأكمل والأوضح في البرمجة المنطقية بلغة Prolog وتطبيقات الذكاء الاصطناعي (26 درساً ✔)",
              "playlistId": "PLMm8EjqH1EFW9Faldu6D6Uh2j1EWWaTYe"
          }
      ]
  }),
  // 37. قطاع علوم الحاسوب - مقدمة علوم الحاسوب لجامعة هارفارد بالعربي (CS50 in Arabic)
  createCourseTrack({
      "id": "cs50-arabic-masterclass",
      "title": "مقدمة علوم الحاسوب لجامعة هارفارد بالعربي (CS50 in Arabic)",
      "domainId": "computer-science",
      "domainTitle": "علوم الحاسوب",
      "badge": "المرتبة #1 مدخل الحاسوب",
      "examCode": "CS50x Harvard",
      "methodologyNote": "المدخل الأسطوري لعلوم الحاسوب وبناء التفكير الخوارزمي، يبدأ من الصفر وصولاً إلى C وبايثون وتطوير الويب.",
      "rankOrder": 8,
      "orderIndex": 37,
      "featured": true,
      "viewsCount": 950000,
      "toolsSummary": "C, Python, SQL, Memory, Pointers, Algorithms, Web Development",
      "techStack": [
          "CS50",
          "Computer Science",
          "C",
          "Python",
          "Algorithms"
      ],
      "instructors": [
          {
              "id": "inst-kmr-cs50",
              "name": "كيه إم آر (KMR Script)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 15,
              "durationText": "12 ساعة تدريبية",
              "note": "شرح ممتع وعصري ومبسط لأهم مفاهيم كورس هارفارد CS50 بالعربي مع التطبيق البرمجي",
              "playlistId": "PLL2zWZTDFZzibJ49gBM2owqCzda8meSNj"
          },
          {
              "id": "inst-rasha-abdeen-cs50",
              "name": "رشا عابدين (Coders Camp - Rasha Abdeen)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 123,
              "durationText": "40 ساعة تدريبية",
              "note": "موسوعة عربية كاملة وتفصيلية تغطي محاضرات ومسائل وتطبيقات منهج هارفارد CS50 كاملاً (123 درساً ✔)",
              "playlistId": "PLnrlZUDQofUv7JE4QIahAyztrQU9bnJmd"
          },
          {
              "id": "inst-abdelrahman-gamal-cs50",
              "name": "عبدالرحمن جمال (Abdelrahman Gamal)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 82,
              "durationText": "24 ساعة تدريبية",
              "note": "شرح تطبيقي سلس وتفاعلي لكورس CS50 مع حل المسائل ومساعدة المبتدئين خطوة بخطوة (82 درساً ✔)",
              "playlistId": "PLknwEmKsW8OvMsFbU9zo8oJCprAsgc4LO"
          }
      ]
  }),
  // 38. قطاع قواعد البيانات والخلفية - المفاهيم النظرية ونظم إدارة قواعد البيانات (Database Systems Concepts)
  createCourseTrack({
      "id": "database-theory-masterclass",
      "title": "المفاهيم النظرية ونظم إدارة قواعد البيانات (Database Systems Concepts)",
      "domainId": "databases-backend",
      "domainTitle": "قواعد البيانات والخلفية",
      "badge": "المرتبة #1 نظري",
      "methodologyNote": "تأسيس أكاديمي لا غنى عنه في تصميم المخططات ERD، العلاقات، التفكيك والتوحيد Normalization، وقواعد البيانات العلائقية.",
      "rankOrder": 1,
      "orderIndex": 38,
      "featured": true,
      "viewsCount": 410000,
      "toolsSummary": "ERD, Relational Model, Normalization, Relational Algebra, Functional Dependencies",
      "techStack": [
          "Database Design",
          "ERD",
          "Normalization",
          "Relational Model"
      ],
      "instructors": [
          {
              "id": "inst-desouki-db-theory",
              "name": "د. محمد الدسوقي (Mohamed El Desouki)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 40,
              "durationText": "20 ساعة تدريبية",
              "note": "المرجع الجامعي العربي الأقوى لمقرر قواعد البيانات النظري وتصميم ERD والـ Normalization (40 درساً ✔)",
              "playlistId": "PL37D52B7714788190"
          },
          {
              "id": "inst-kmr-db-theory",
              "name": "كيه إم آر (KMR Script)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 13,
              "durationText": "6 ساعات تدريبية",
              "note": "شرح عصري ومكثف لأساسيات قواعد البيانات وهندسة النظم الخلفية (13 درساً مرتباً ✔)",
              "playlistId": "PLL2zWZTDFZzhXQ1bcYlO3PtN4MsLiG-gy"
          }
      ]
  }),
  // 39. قطاع قواعد البيانات والخلفية - لغة الاستعلامات البنيوية وقواعد البيانات المترابطة (SQL & MySQL Mastery)
  createCourseTrack({
      "id": "sql-masterclass",
      "title": "لغة الاستعلامات البنيوية وقواعد البيانات المترابطة (SQL & MySQL Mastery)",
      "domainId": "databases-backend",
      "domainTitle": "قواعد البيانات والخلفية",
      "badge": "المرتبة #1 استعلامات",
      "methodologyNote": "كتابة استعلامات SQL المتقدمة، الفهارس، المعاملات، الروابط Joins، وتصميم قواعد البيانات الإنتاجية.",
      "rankOrder": 2,
      "orderIndex": 39,
      "featured": true,
      "viewsCount": 890000,
      "toolsSummary": "SQL, MySQL, Joins, Aggregations, Subqueries, Indexes, Transactions",
      "techStack": [
          "SQL",
          "MySQL",
          "Database",
          "Queries",
          "RDBMS"
      ],
      "instructors": [
          {
              "id": "inst-elzero-mysql",
              "name": "أسامة محمد (الزيرو - Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 51,
              "durationText": "12 ساعة تدريبية",
              "note": "دورة MySQL الاحترافية الشاملة مع التطبيقات العملية والاستعلامات المتقدمة (51 درساً مرتباً ✔)",
              "playlistId": "PLDoPjvoNmBAz6DT8SzQ1CODJTH-NIA7R9"
          },
          {
              "id": "inst-desouki-sql",
              "name": "د. محمد الدسوقي (Mohamed El Desouki)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 55,
              "durationText": "22 ساعة تدريبية",
              "note": "مقرر SQL العملي التطبيقي الشامل من الصفر حتى إتقان إدارة الخوادم وقواعد البيانات (55 درساً ✔)",
              "playlistId": "PL85D9FC9DFD6B9484"
          },
          {
              "id": "inst-thenewbaghdad-sql",
              "name": "حسين الربيعي (TheNewBaghdad)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 37,
              "durationText": "10 ساعات تدريبية",
              "note": "بناء قواعد البيانات بكفاءة عالية وتطبيق استعلامات MySQL خطوة بخطوة (37 درساً مرتباً ✔)",
              "playlistId": "PLF8OvnCBlEY25O_Ql0CrgQUAc5NVYkWF2"
          }
      ]
  }),
  // 40. قطاع قواعد البيانات والخلفية - قواعد البيانات غير العلائقية وتطوير الوثائق MongoDB (NoSQL Database)
  createCourseTrack({
      "id": "mongodb-masterclass",
      "title": "قواعد البيانات غير العلائقية وتطوير الوثائق MongoDB (NoSQL Database)",
      "domainId": "databases-backend",
      "domainTitle": "قواعد البيانات والخلفية",
      "badge": "NoSQL #1",
      "methodologyNote": "التعامل مع قواعد بيانات الوثائق BSON/JSON، عمليات CRUD، خطوط التجميع Aggregation Framework، وتكامل خوادم الويب.",
      "rankOrder": 3,
      "orderIndex": 40,
      "featured": false,
      "viewsCount": 340000,
      "toolsSummary": "MongoDB, NoSQL, BSON, Aggregations, Indexing, Atlas, Mongoose",
      "techStack": [
          "MongoDB",
          "NoSQL",
          "Database",
          "Backend",
          "Mongoose"
      ],
      "instructors": [
          {
              "id": "inst-algorithm-academy-mongo",
              "name": "أسامة جيدري (Algorithm Academy)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 10,
              "durationText": "4 ساعات تدريبية",
              "note": "دورة ممتازة وعملية لتعلم MongoDB وتطبيقات NoSQL مع بيئة Node.js (10 دروس مرتبة ✔)",
              "playlistId": "PLfDx4cQoUNObp1ujQRNooNiadKdlflevM"
          },
          {
              "id": "inst-emam-academy-mongo",
              "name": "محمد إمام (Emam Academy)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 12,
              "durationText": "5 ساعات تدريبية",
              "note": "شرح تطبيقي لـ MongoDB والربط مع خوادم Express وبناء الـ RESTful APIs (12 درساً ✔)",
              "playlistId": "PLGhZWewM_75IILJm_1QDq0yPLbLQz_TCb"
          },
          {
              "id": "inst-thenewbaghdad-mongo",
              "name": "حسين الربيعي (TheNewBaghdad)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 11,
              "durationText": "4 ساعات تدريبية",
              "note": "شرح مبسّط لقواعد بيانات الوثائق MongoDB وتطبيق الاستعلامات الأساسية (11 درساً مرتباً ✔)",
              "playlistId": "PLF8OvnCBlEY1sdUym7Cnb5Xc3d7HXLjqf"
          }
      ]
  }),
  // 41. قطاع قواعد البيانات والخلفية - التخزين المؤقت في الذاكرة وهيكلة البيانات السريعة مع Redis (In-Memory Data Store)
  createCourseTrack({
      "id": "redis-masterclass",
      "title": "التخزين المؤقت في الذاكرة وهيكلة البيانات السريعة مع Redis (In-Memory Data Store)",
      "domainId": "databases-backend",
      "domainTitle": "قواعد البيانات والخلفية",
      "badge": "أداء فائق",
      "methodologyNote": "تسريع استجابة الخوادم، التخزين المؤقت Caching، نشر الرسائل Pub/Sub، وهندسة العناقيد Redis Cluster.",
      "rankOrder": 4,
      "orderIndex": 41,
      "featured": false,
      "viewsCount": 290000,
      "toolsSummary": "Redis, In-Memory, Key-Value, Pub/Sub, Caching, Persistence, Cluster",
      "techStack": [
          "Redis",
          "Caching",
          "In-Memory",
          "High Performance",
          "PubSub"
      ],
      "instructors": [
          {
              "id": "inst-anjrini-redis",
              "name": "إسماعيل عنجريني (Ismail Anjrini)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 68,
              "durationText": "24 ساعة تدريبية",
              "note": "الموسوعة العربية الأضخم والأعمق لتقنية Redis بالعربي مع هندسة البيانات المتقدمة (68 درساً مرتباً ✔)",
              "playlistId": "PLZd2bo_SbAm_ijqLfnx94qkmytbWjUQ-h"
          }
      ]
  }),
  // 42. قطاع قواعد البيانات والخلفية - محرك البحث والتحليلات الضخمة وحزمة ELK Stack & Elasticsearch
  createCourseTrack({
      "id": "elastic-elk-masterclass",
      "title": "محرك البحث والتحليلات الضخمة وحزمة ELK Stack & Elasticsearch",
      "domainId": "databases-backend",
      "domainTitle": "قواعد البيانات والخلفية",
      "badge": "محرك بحث متقدم",
      "methodologyNote": "البحث النصي الكامل Full-Text Search، فهرسة السجلات Logs، وتحليل البيانات اللحظية عبر حزمة ELK.",
      "rankOrder": 5,
      "orderIndex": 42,
      "featured": false,
      "viewsCount": 220000,
      "toolsSummary": "Elasticsearch, Logstash, Kibana, Beats, Shards, Replicas, Full-Text Search",
      "techStack": [
          "Elasticsearch",
          "ELK Stack",
          "Kibana",
          "Log Analysis",
          "Search"
      ],
      "instructors": [
          {
              "id": "inst-anjrini-elastic",
              "name": "إسماعيل عنجريني (Ismail Anjrini)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 8,
              "durationText": "5 ساعات تدريبية",
              "note": "شرح تطبيقي لحزمة ELK Stack وتثبيت وضبط محرك Elasticsearch والفهارس (8 دروس مرتبة ✔)",
              "playlistId": "PLahnTWf-ROoXRZQp4iWrzkRfTjrPjSw3W"
          }
      ]
  }),
  // 43. قطاع قواعد البيانات والخلفية - وسائط الرسائل والمعمارية غير المتزامنة بواسطة RabbitMQ (Message Broker)
  createCourseTrack({
      "id": "rabbitmq-masterclass",
      "title": "وسائط الرسائل والمعمارية غير المتزامنة بواسطة RabbitMQ (Message Broker)",
      "domainId": "databases-backend",
      "domainTitle": "قواعد البيانات والخلفية",
      "badge": "معمارية متزامنة",
      "methodologyNote": "إتقان بروتوكول AMQP، أنماط التبادل Exchanges، طوابير الرسائل Queues، والاتصال غير المتزامن بين الخوادم.",
      "rankOrder": 6,
      "orderIndex": 43,
      "featured": false,
      "viewsCount": 260000,
      "toolsSummary": "RabbitMQ, AMQP, Exchanges, Queues, Routing, Asynchronous Messaging, Microservices",
      "techStack": [
          "RabbitMQ",
          "Message Broker",
          "AMQP",
          "Async",
          "Event-Driven"
      ],
      "instructors": [
          {
              "id": "inst-anjrini-rabbitmq",
              "name": "إسماعيل عنجريني (Ismail Anjrini)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 44,
              "durationText": "18 ساعة تدريبية",
              "note": "الدورة العربية المتكاملة والأشمل لنظام وسائط الرسائل RabbitMQ وبناء النظم الموزعة (44 درساً مرتباً ✔)",
              "playlistId": "PLZd2bo_SbAm9uJ2J5ryEOZV7ojLwGkATc"
          }
      ]
  }),
  // 44. قطاع DevOps والسحابة والهندسة - إدارة الإصدارات والعمل الجماعي البرمجي باستخدام Git & GitHub
  createCourseTrack({
      "id": "git-github-masterclass",
      "title": "إدارة الإصدارات والعمل الجماعي البرمجي باستخدام Git & GitHub",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "المرتبة #1 إدارة شيفرات",
      "methodologyNote": "التحكم بالإصدارات، الفروع Branches، الدمج Merge، الـ Pull Requests، وحل النزاعات البرمجية بكفاءة.",
      "rankOrder": 1,
      "orderIndex": 44,
      "featured": true,
      "viewsCount": 780000,
      "toolsSummary": "Git, GitHub, Branching, Merging, Rebase, Pull Requests, Workflows",
      "techStack": [
          "Git",
          "GitHub",
          "Version Control",
          "DevOps",
          "Collaboration"
      ],
      "instructors": [
          {
              "id": "inst-elzero-git",
              "name": "أسامة محمد (الزيرو - Elzero Web School)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 32,
              "durationText": "7 ساعات تدريبية",
              "note": "دورة Git و GitHub الأشهر عربياً مع التطبيق العملي وإدارة الفروع والمستودعات (32 درساً مرتباً ✔)",
              "playlistId": "PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF"
          },
          {
              "id": "inst-khalid-elshafie-git",
              "name": "خالد الشافعي (Khalid Elshafie - abolkog)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 8,
              "durationText": "4 ساعات تدريبية",
              "note": "شرح تطبيقي مكثف ومباشر لأساسيات Git وسير العمل الجماعي على GitHub (8 دروس مرتبة ✔)",
              "playlistId": "PL_aOZuct6oAogr4UMkWddU7leOXw0QKJS"
          },
          {
              "id": "inst-tarmeez-git",
              "name": "أكاديمية ترميز (Tarmeez Academy)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 13,
              "durationText": "5 ساعات تدريبية",
              "note": "الدورة الأساسية في Git للمطورين بأسلوب ميسر وتطبيقات شائعة (13 درساً مرتباً ✔)",
              "playlistId": "PLYyqC4bNbCIeCHLTRtwdLpQvle_zIavZ-"
          }
      ]
  }),
  // 45. قطاع DevOps والسحابة والهندسة - تقنيات الحاويات وعزل البيئات البرمجية بواسطة Docker (Containers in Depth)
  createCourseTrack({
      "id": "docker-masterclass",
      "title": "تقنيات الحاويات وعزل البيئات البرمجية بواسطة Docker (Containers in Depth)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "المرتبة #1 حاويات",
      "methodologyNote": "بناء ملفات Dockerfile، إدارة الصور والحاويات، شبكات الدوكر، والتكامل عبر Docker Compose.",
      "rankOrder": 2,
      "orderIndex": 45,
      "featured": true,
      "viewsCount": 650000,
      "toolsSummary": "Docker, Dockerfile, Docker Compose, Images, Containers, Volumes, Networks",
      "techStack": [
          "Docker",
          "DevOps",
          "Containers",
          "Microservices",
          "Linux"
      ],
      "instructors": [
          {
              "id": "inst-codographia-docker",
              "name": "كودوغرافيا (Codographia)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 37,
              "durationText": "14 ساعة تدريبية",
              "note": "سلسلة احترافية شاملة ومبوبة لشرح دوكر من الصفر وحتى مفاهيم الإنتاج الحقيقية (37 درساً مرتباً ✔)",
              "playlistId": "PLX1bW_GeBRhDkTf_jbdvBbkHs2LCWVeXZ"
          },
          {
              "id": "inst-tresmerge-docker",
              "name": "تريسميرج (Tresmerge)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 28,
              "durationText": "11 ساعة تدريبية",
              "note": "دورة تطبيقية عملية باللغة العربية لشرح دوكر والحاويات بالتفصيل (28 درساً مرتباً ✔)",
              "playlistId": "PLzNfs-3kBUJnY7Cy1XovLaAkgfjim05RR"
          },
          {
              "id": "inst-ahmed-sami-docker",
              "name": "أحمد سامي (Ahmed Sami - بالعربي Big Data)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 77,
              "durationText": "28 ساعة تدريبية",
              "note": "مسار DevOps والحاويات الشامل وشرح دوكر وكوبرنيتس الميداني بالتفصيل (77 درساً مرتباً ✔)",
              "playlistId": "PLJK0gWS0uZDYdUuQBJLhUakQ_09qWMSb_"
          }
      ]
  }),
  // 46. قطاع DevOps والسحابة والهندسة - إدارة وتنسيق عناقيد الحاويات على مستوى الإنتاج بواسطة Kubernetes (K8s)
  createCourseTrack({
      "id": "kubernetes-masterclass",
      "title": "إدارة وتنسيق عناقيد الحاويات على مستوى الإنتاج بواسطة Kubernetes (K8s)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "المرتبة #1 كوبرنيتس",
      "methodologyNote": "إدارة Pods, Deployments, Services, Ingress, التوسع التلقائي Auto-scaling، ونشر الأنظمة السحابية المعقدة.",
      "rankOrder": 3,
      "orderIndex": 46,
      "featured": true,
      "viewsCount": 430000,
      "toolsSummary": "Kubernetes, Pods, Deployments, Services, Helm, Ingress, ConfigMaps, Secrets",
      "techStack": [
          "Kubernetes",
          "K8s",
          "Cloud Native",
          "DevOps",
          "Containers"
      ],
      "instructors": [
          {
              "id": "inst-codographia-k8s",
              "name": "كودوغرافيا (Codographia)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 39,
              "durationText": "16 ساعة تدريبية",
              "note": "الدورة العربية الأقوى والأشمل لشرح كوبرنيتس بالعربي وتطبيقات الـ Orchestration (39 درساً مرتباً ✔)",
              "playlistId": "PLX1bW_GeBRhDCHijCrMO5F-oHg52rRBpl"
          },
          {
              "id": "inst-ahmed-elemam-k8s",
              "name": "أحمد الإمام (Ahmed Elemam)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 12,
              "durationText": "6 ساعات تدريبية",
              "note": "شرح متقدم لمنهجيات GitOps وإدارة كوبرنيتس في الإنتاج (12 درساً مرتباً ✔)",
              "playlistId": "PLTRDUPO2OmInz2Fo41zwnoR1IArx70Hig"
          }
      ]
  }),
  // 47. قطاع DevOps والسحابة والهندسة - البنية التحتية كشيفرة برمجية وأتمتة السحابة عبر Terraform (IaC)
  createCourseTrack({
      "id": "terraform-iac-masterclass",
      "title": "البنية التحتية كشيفرة برمجية وأتمتة السحابة عبر Terraform (IaC)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "أتمتة بنية تحتية",
      "methodologyNote": "بناء وتعديل وإدارة الموارد السحابية تلقائياً باستخدام لغة HCL والتحكم بالبنية التحتية البرمجية.",
      "rankOrder": 4,
      "orderIndex": 47,
      "featured": false,
      "viewsCount": 280000,
      "toolsSummary": "Terraform, HCL, Providers, State Management, Modules, IaC, Multi-Cloud",
      "techStack": [
          "Terraform",
          "IaC",
          "DevOps",
          "Cloud Automation",
          "AWS"
      ],
      "instructors": [
          {
              "id": "inst-codographia-terraform",
              "name": "كودوغرافيا (Codographia)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 11,
              "durationText": "5 ساعات تدريبية",
              "note": "كورس Terraform بالعربي لشرح مفاهيم Infrastructure as Code والتطبيق العملي (11 درساً مرتباً ✔)",
              "playlistId": "PLX1bW_GeBRhBIT9-Nyt4_osatqokaN8ae"
          }
      ]
  }),
  // 48. قطاع DevOps والسحابة والهندسة - الحوسبة السحابية وخدمات البنية التحتية Google Cloud Platform (GCP)
  createCourseTrack({
      "id": "google-cloud-gcp-masterclass",
      "title": "الحوسبة السحابية وخدمات البنية التحتية Google Cloud Platform (GCP)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "سحابة جوجل",
      "methodologyNote": "التعامل مع Compute Engine, Cloud Run, GKE, Cloud Storage, VPC ومفاهيم إدارة الموارد على سحابة جوجل.",
      "rankOrder": 5,
      "orderIndex": 48,
      "featured": false,
      "viewsCount": 360000,
      "toolsSummary": "GCP, Compute Engine, GKE, Cloud Run, BigQuery, IAM, Cloud Storage",
      "techStack": [
          "Google Cloud",
          "GCP",
          "Cloud Computing",
          "Kubernetes",
          "DevOps"
      ],
      "instructors": [
          {
              "id": "inst-anjrini-gcp",
              "name": "إسماعيل عنجريني (Ismail Anjrini)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 75,
              "durationText": "26 ساعة تدريبية",
              "note": "أضخم وأشمل مسار عربي في الحوسبة السحابية لسحابة جوجل (GCP بالعربي) بمشاريع واقعية (75 درساً مرتباً ✔)",
              "playlistId": "PLZd2bo_SbAm-JJyJ5kJA02rcOXnyfqIWO"
          }
      ]
  }),
  // 49. قطاع DevOps والسحابة والهندسة - شهادة وهندسة الحلول السحابية المعتمدة Amazon Web Services (AWS SAA)
  createCourseTrack({
      "id": "aws-cloud-masterclass",
      "title": "شهادة وهندسة الحلول السحابية المعتمدة Amazon Web Services (AWS SAA)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "المرتبة #1 سحابة أمازون",
      "examCode": "AWS SAA-C03",
      "methodologyNote": "تصميم البنى التحتية عالية التوافر ومحاكاة الخدمات الأساسية EC2, S3, RDS, VPC, Lambda, IAM.",
      "rankOrder": 6,
      "orderIndex": 49,
      "featured": true,
      "viewsCount": 560000,
      "toolsSummary": "AWS, EC2, S3, VPC, IAM, RDS, CloudFront, Route53, Lambda",
      "techStack": [
          "AWS",
          "Cloud Computing",
          "Solutions Architect",
          "Serverless"
      ],
      "instructors": [
          {
              "id": "inst-free4arab-aws",
              "name": "محمد عدي (Free4arab)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 56,
              "durationText": "25 ساعة تدريبية",
              "note": "الشرح العربي المرجعي لشهادة مهندس الحلول السحابية المعتمد AWS Solutions Architect (56 درساً مرتباً ✔)",
              "playlistId": "PLLlr6jKKdyK0ZbS1lSWOLipuiXWJZhEHG"
          },
          {
              "id": "inst-aws-riyadh-group",
              "name": "مجموعة مستخدمي أمازون بالرياض (AWS Riyadh User Group)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 18,
              "durationText": "12 ساعة تدريبية",
              "note": "كورس تفاعلي شامل لشرح منهج AWS SAA-C02 مع م. عيسى أبو شريف ومعامل عملية (18 درساً مرتباً ✔)",
              "playlistId": "PLOoZRfEtk6kWSM_l9xMjDh-_MJXl03-pf"
          }
      ]
  }),
  // 50. قطاع DevOps والسحابة والهندسة - هندسة ومعمارية النظم الموزعة والخدمات المصغرة (Microservices Architecture)
  createCourseTrack({
      "id": "microservices-architecture-masterclass",
      "title": "هندسة ومعمارية النظم الموزعة والخدمات المصغرة (Microservices Architecture)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "معمارية أنظمة",
      "methodologyNote": "تصميم الخدمات المستقلة، أنماط الاتصال Sync/Async، بوابات الـ API Gateway، وتحديات الاتساق والتوسع.",
      "rankOrder": 7,
      "orderIndex": 50,
      "featured": true,
      "viewsCount": 420000,
      "toolsSummary": "Microservices, API Gateway, Service Discovery, Event-Driven, Distributed Tracing",
      "techStack": [
          "Microservices",
          "System Design",
          "Distributed Systems",
          "Software Architecture"
      ],
      "instructors": [
          {
              "id": "inst-anjrini-microservices",
              "name": "إسماعيل عنجريني (Ismail Anjrini)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 9,
              "durationText": "5 ساعات تدريبية",
              "note": "سلسلة Microservice بالعربي وشرح أنماط المعمارية الموزعة والتكامل بين الخدمات (9 دروس مرتبة ✔)",
              "playlistId": "PLZd2bo_SbAm-LKJ_x_OuOZtuwEFqbJ5B7"
          },
          {
              "id": "inst-mahmoud-youssef-arch",
              "name": "محمود يوسف (Mahmoud Youssef)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 10,
              "durationText": "6 ساعات تدريبية",
              "note": "أساسيات تصميم النظم الموزعة System Design ودراسات الحالة الواقعية للأنظمة الضخمة (10 دروس مرتبة ✔)",
              "playlistId": "PLZafHDYyxnk6S9bweaJ_KYuYqituwyXjl"
          },
          {
              "id": "inst-arch-talks-micro",
              "name": "هندسة البرمجيات (Software Architecture Talks)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 40,
              "durationText": "18 ساعة تدريبية",
              "note": "شرح معمق ومناقشات تقنية غنية حول معمارية المايكروسيرفيس بالعربي (40 درساً مرتباً ✔)",
              "playlistId": "PLgAqrVq84PDdfiDow3YVsgc1q34JD415Z"
          }
      ]
  }),
  // 51. قطاع DevOps والسحابة والهندسة - مبادئ التصميم النظيف وأنماط التصميم المعمارية (SOLID Principles & Design Patterns)
  createCourseTrack({
      "id": "design-patterns-solid-masterclass",
      "title": "مبادئ التصميم النظيف وأنماط التصميم المعمارية (SOLID Principles & Design Patterns)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "المرتبة #1 كود نظيف",
      "methodologyNote": "كتابة شيفرات برمجية قابلة للصيانة والتوسع عبر مبادئ SOLID وأنماط Gang of Four (Creational, Structural, Behavioral).",
      "rankOrder": 8,
      "orderIndex": 51,
      "featured": true,
      "viewsCount": 510000,
      "toolsSummary": "SOLID, Factory, Singleton, Observer, Strategy, Adapter, Clean Architecture",
      "techStack": [
          "Design Patterns",
          "SOLID",
          "Clean Code",
          "OOP",
          "Software Engineering"
      ],
      "instructors": [
          {
              "id": "inst-mohammed-reda-solid",
              "name": "محمد رضا (Mohammed Reda)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 19,
              "durationText": "8 ساعات تدريبية",
              "note": "شرح تفصيلي رائع لمبادئ SOLID بالعربي مع أمثلة برمجية واقعية وإعادة هيكلة الكود (19 درساً مرتباً ✔)",
              "playlistId": "PLnqAlQ9hFYdflFSS4NigVB7aSoYPNwHTL"
          },
          {
              "id": "inst-omar-ahmed-solid",
              "name": "عمر أحمد (Omar Ahmed)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 6,
              "durationText": "3 ساعات تدريبية",
              "note": "شرح موجز ومركّز لكل مبدأ من مبادئ SOLID باللغة العربية (6 دروس مرتبة ✔)",
              "playlistId": "PLwWuxCLlF_uevri_OpofVLXkRRFnZ7TSV"
          },
          {
              "id": "inst-passionate-coders-dp",
              "name": "محمد المهدي (Passionate Coders)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 16,
              "durationText": "8 ساعات تدريبية",
              "note": "شرح عميق ومتقن لأنماط التصميم المعمارية Design Patterns وتطبيقاتها الاحترافية (16 درساً مرتباً ✔)",
              "playlistId": "PLsV97AQt78NTrqUAZM562JbR3ljX19JFR"
          }
      ]
  }),
  // 52. قطاع DevOps والسحابة والهندسة - أساسيات ومنهجيات فحص وضمان جودة البرمجيات (Software Testing & QA)
  createCourseTrack({
      "id": "software-testing-qa-masterclass",
      "title": "أساسيات ومنهجيات فحص وضمان جودة البرمجيات (Software Testing & QA)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "جودة واختبار",
      "methodologyNote": "مفاهيم الاختبار اليدوي والمؤتمت، Unit Testing, Integration Testing, دورة حياة فحص البرمجيات STLC، وإعداد تقارير الأخطاء.",
      "rankOrder": 9,
      "orderIndex": 52,
      "featured": false,
      "viewsCount": 320000,
      "toolsSummary": "Manual Testing, Automation, STLC, Test Cases, Bug Reporting, Jira, Postman",
      "techStack": [
          "Software Testing",
          "QA",
          "STLC",
          "Test Automation",
          "Quality Assurance"
      ],
      "instructors": [
          {
              "id": "inst-tresmerge-testing",
              "name": "تريسميرج (Tresmerge)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 24,
              "durationText": "10 ساعات تدريبية",
              "note": "كورس اختبار البرمجيات الكامل بالعربي وتغطية كافة مفاهيم ومراحل الـ QA (24 درساً مرتباً ✔)",
              "playlistId": "PLzNfs-3kBUJllCa8_6pLYDMnIlg6Lfvu4"
          }
      ]
  }),
  // 53. قطاع DevOps والسحابة والهندسة - احتراف التعبيرات النمطية والتحليل النصي (Regular Expressions - RegEx)
  createCourseTrack({
      "id": "regex-masterclass",
      "title": "احتراف التعبيرات النمطية والتحليل النصي (Regular Expressions - RegEx)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "مهارة فائقة",
      "methodologyNote": "إتقان مطابقة النصوص، التحقق من صحة المدخلات، استخراج الأنماط، وتطبيق RegEx عبر مختلف لغات البرمجة.",
      "rankOrder": 10,
      "orderIndex": 53,
      "featured": false,
      "viewsCount": 210000,
      "toolsSummary": "RegEx, Pattern Matching, Metacharacters, Quantifiers, Lookahead, Groups",
      "techStack": [
          "RegEx",
          "Pattern Matching",
          "Parsing",
          "String Manipulation"
      ],
      "instructors": [
          {
              "id": "inst-alfaham-regex",
              "name": "عبدالله الفحام (Abdallah Alfaham)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 7,
              "durationText": "3 ساعات تدريبية",
              "note": "دورة مكثفة وسريعة لاحتراف التعابير النظامية Regular Expressions بالأمثلة (7 دروس مرتبة ✔)",
              "playlistId": "PLBPdtL8DZBZISjop48YSJ82FF-2uIhe-f"
          },
          {
              "id": "inst-hardcode-regex",
              "name": "محمود سامي (Hard-Code)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 24,
              "durationText": "8 ساعات تدريبية",
              "note": "شرح مفصل وتطبيقي للتعابير النمطية خطوة بخطوة حتى الاحتراف (24 درساً مرتباً ✔)",
              "playlistId": "PLwCMLs3sjOY4aVMg7hgQGHyQBZnHgFjJk"
          },
          {
              "id": "inst-naw-regex",
              "name": "تعلم مع ناو (Learn With Naw)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 25,
              "durationText": "8 ساعات تدريبية",
              "note": "سلسلة شاملة وتطبيقية لشرح التعابير النمطية REGEX بالعربي (25 درساً مرتباً ✔)",
              "playlistId": "PLt0HRIA9i35v2W3JFiCIeUMC4GoD9titN"
          }
      ]
  }),
  // 54. قطاع DevOps والسحابة والهندسة - البرمجة الإحصائية وتحليل واستكشاف البيانات بلغة R (R Programming)
  createCourseTrack({
      "id": "r-programming-masterclass",
      "title": "البرمجة الإحصائية وتحليل واستكشاف البيانات بلغة R (R Programming)",
      "domainId": "devops-cloud",
      "domainTitle": "DevOps والسحابة والهندسة",
      "badge": "إحصاء وتحليل بيانات",
      "methodologyNote": "المعالجة الإحصائية، الرسوم البيانية المتقدمة، وتحليل مجموعات البيانات العلمية والتجريبية بلغة R.",
      "rankOrder": 11,
      "orderIndex": 54,
      "featured": false,
      "viewsCount": 250000,
      "toolsSummary": "R, RStudio, ggplot2, Data Wrangling, Statistical Analysis, Data Frames",
      "techStack": [
          "R",
          "RStudio",
          "Statistics",
          "Data Science",
          "Data Analysis"
      ],
      "instructors": [
          {
              "id": "inst-desouki-r",
              "name": "د. محمد الدسوقي (Mohamed El Desouki)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 20,
              "durationText": "10 ساعات تدريبية",
              "note": "كورس لغة R للمبتدئين بالعربي مع التطبيق الإحصائي وتحليل البيانات (20 درساً مرتباً ✔)",
              "playlistId": "PL1DUmTEdeA6LKTMW3wrlT3GiFMCL_r_Sn"
          }
      ]
  }),
  // 55. قطاع الذكاء الاصطناعي وعلم البيانات - الذكاء الاصطناعي وتعلم الآلة Machine Learning
  createCourseTrack({
      "id": "machine-learning-data-science",
      "title": "الذكاء الاصطناعي وتعلم الآلة Machine Learning",
      "domainId": "ai-data-science",
      "domainTitle": "الذكاء الاصطناعي وعلم البيانات",
      "badge": "المجال #6",
      "methodologyNote": "مسار تعليمي متكامل في خوارزميات تعلم الآلة والنماذج التنبؤية من الصفر حتى الاحتراف.",
      "rankOrder": 1,
      "orderIndex": 55,
      "featured": true,
      "viewsCount": 890000,
      "toolsSummary": "Scikit-Learn, Python, Supervised & Unsupervised Learning",
      "techStack": [
          "Python",
          "Scikit-Learn",
          "Math",
          "ML Algorithms"
      ],
      "instructors": [
          {
              "id": "inst-hesham-asem-ml",
              "name": "هشام عاصم (Hesham Asem)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 68,
              "durationText": "45 ساعة تدريبية",
              "note": "12 قسمًا، قسم بايثون وحده 100 درس ✔",
              "playlistId": "PL6-3IRz2XF5Ua2KG_Fl3lbZ-kKi3-Np0_"
          },
          {
              "id": "inst-khaled-mostafa-ml",
              "name": "Dr. Khaled Mostafa Elsayed",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 13,
              "durationText": "24 ساعة تدريبية",
              "note": "مسار أكاديمي جامعي متقدم من جامعة زويل Zewail CSAI",
              "playlistId": "PL5JZLxl_tFCcgAv9x2eXeX0_2TLRMnHUg"
          },
          {
              "id": "inst-elgouhary-ai-ml",
              "name": "Elgouhary AI",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 47,
              "durationText": "18 ساعة تدريبية",
              "note": "47 درسًا ✔ — كورس تعلم الآلة بالعربي التطبيقي الشامل",
              "playlistId": "PLtsZ69x5q-X9j44MdSX-NGuOhGXOY0aqH"
          }
      ]
  }),
  // 56. قطاع الذكاء الاصطناعي وعلم البيانات - التعلم العميق والشبكات العصبية Deep Learning & Neural Networks
  createCourseTrack({
      "id": "deep-learning-neural-networks",
      "title": "التعلم العميق والشبكات العصبية Deep Learning & Neural Networks",
      "domainId": "ai-data-science",
      "domainTitle": "الذكاء الاصطناعي وعلم البيانات",
      "badge": "مستوى متقدم",
      "methodologyNote": "هندسة الشبكات العصبية الاصطناعية العميقة وتطبيقات الرؤية ومعالجة البيانات المعقدة.",
      "rankOrder": 2,
      "orderIndex": 56,
      "featured": true,
      "viewsCount": 780000,
      "toolsSummary": "PyTorch, TensorFlow, CNNs, RNNs, Backpropagation",
      "techStack": [
          "Deep Learning",
          "PyTorch",
          "TensorFlow",
          "Neural Networks"
      ],
      "instructors": [
          {
              "id": "inst-hesham-asem-dl",
              "name": "هشام عاصم (Hesham Asem)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 25,
              "durationText": "35 ساعة تدريبية",
              "note": "5 دورات تخصصية في التعلم العميق والشبكات العصبية والرؤية الحاسوبية",
              "playlistId": "PL6-3IRz2XF5X-lzMZdmkvGAx1a3kIm7_I"
          },
          {
              "id": "inst-khaled-mostafa-dl",
              "name": "Dr. Khaled Mostafa Elsayed",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 12,
              "durationText": "22 ساعة تدريبية",
              "note": "شرح أكاديمي عميق لأحدث أبحاث التعلم العميق بجامعة زويل Zewail",
              "playlistId": "PL5JZLxl_tFCcmulUU7suv9DkAFrOTm34w"
          }
      ]
  }),
  // 57. قطاع الذكاء الاصطناعي وعلم البيانات - معالجة اللغات الطبيعية وتحليل النصوص Natural Language Processing (NLP)
  createCourseTrack({
      "id": "natural-language-processing-nlp",
      "title": "معالجة اللغات الطبيعية وتحليل النصوص Natural Language Processing (NLP)",
      "domainId": "ai-data-science",
      "domainTitle": "الذكاء الاصطناعي وعلم البيانات",
      "badge": "تخصصي حديث",
      "methodologyNote": "معالجة النصوص العربية والإنجليزية، تضمين الكلمات ونماذج المحولات والمحادثة الذكية.",
      "rankOrder": 3,
      "orderIndex": 57,
      "featured": false,
      "viewsCount": 620000,
      "toolsSummary": "HuggingFace, Transformers, NLTK, Word2Vec",
      "techStack": [
          "NLP",
          "Transformers",
          "HuggingFace",
          "BERT"
      ],
      "instructors": [
          {
              "id": "inst-hesham-asem-nlp",
              "name": "هشام عاصم (Hesham Asem)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 25,
              "durationText": "28 ساعة تدريبية",
              "note": "8 أجزاء كاملة لمعالجة اللغات الطبيعية وتحليل النصوص",
              "playlistId": "PL6-3IRz2XF5WYpWu6Y8T3firJLflZ3Ufi"
          },
          {
              "id": "inst-khaled-mostafa-nlp-transformers",
              "name": "Dr. Khaled Mostafa Elsayed (Transformers)",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 8,
              "durationText": "16 ساعة تدريبية",
              "note": "معمارية المحولات Transformers وهندسة النماذج اللغوية الحديثة",
              "playlistId": "PL5JZLxl_tFCd-ixMkn_CJPQhhQRFhZXjY"
          }
      ]
  }),
  // 58. قطاع الذكاء الاصطناعي وعلم البيانات - علم واستكشاف وتحليل البيانات Data Science & Advanced Analytics
  createCourseTrack({
      "id": "data-science-python-analysis",
      "title": "علم واستكشاف وتحليل البيانات Data Science & Advanced Analytics",
      "domainId": "ai-data-science",
      "domainTitle": "الذكاء الاصطناعي وعلم البيانات",
      "badge": "مسار عملي",
      "methodologyNote": "تنقيب واستكشاف البيانات وتطبيق التحليلات الإحصائية وبناء لوحات القيادة التنبؤية.",
      "rankOrder": 4,
      "orderIndex": 58,
      "featured": false,
      "viewsCount": 710000,
      "toolsSummary": "Pandas, NumPy, KNIME, Orange, EDA",
      "techStack": [
          "Data Science",
          "Pandas",
          "EDA",
          "Analytics"
      ],
      "instructors": [
          {
              "id": "inst-hussam-hourani-ds",
              "name": "حسام الحوراني (Hussam Hourani)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 88,
              "durationText": "30 ساعة تدريبية",
              "note": "مسار متكامل في علم وتنقيب البيانات والذكاء الاصطناعي مع التطبيقات العملية",
              "playlistId": "PLYW0LRZ3ePo6IYDS2K5IhmuP5qY3dmI9e"
          }
      ]
  }),
  // 59. قطاع الذكاء الاصطناعي وعلم البيانات - أخبار ومستجدات الذكاء الاصطناعي الأسبوعية AI Weekly News & Trends
  createCourseTrack({
      "id": "ai-news-weekly-updates",
      "title": "أخبار ومستجدات الذكاء الاصطناعي الأسبوعية AI Weekly News & Trends",
      "domainId": "ai-data-science",
      "domainTitle": "الذكاء الاصطناعي وعلم البيانات",
      "badge": "محدث أسبوعياً",
      "methodologyNote": "سلسلة دورية تغطي أحدث تطورات الذكاء الاصطناعي التوليدي، إعلانات الشركات، والأدوات الإنتاجية.",
      "rankOrder": 5,
      "orderIndex": 59,
      "featured": false,
      "viewsCount": 540000,
      "toolsSummary": "AI News, LLMs, GenAI Updates, Industry Insights",
      "techStack": [
          "AI Trends",
          "GenAI",
          "ChatGPT",
          "Gemini"
      ],
      "instructors": [
          {
              "id": "inst-ahmed-alsenosy-ai-news",
              "name": "Dr. Ahmed Al-Senosy",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 26,
              "durationText": "سلسلة دورية متجددة",
              "note": "سلسلة أسبوعية مؤكدة لتغطية أحدث أدوات ونماذج الذكاء الاصطناعي وتطبيقات الأعمال",
              "playlistId": "PLUaOSLOIQPE13ciswpqfWQC5qzLePXQjx"
          }
      ]
  }),
  // 60. قطاع الذكاء الاصطناعي وعلم البيانات - أتمتة الأعمال وسير العمل بواسطة n8n والذكاء الاصطناعي Workflows & AI Agents
  createCourseTrack({
      "id": "n8n-automation-workflows",
      "title": "أتمتة الأعمال وسير العمل بواسطة n8n والذكاء الاصطناعي Workflows & AI Agents",
      "domainId": "ai-data-science",
      "domainTitle": "الذكاء الاصطناعي وعلم البيانات",
      "badge": "أتمتة وإنتاجية",
      "methodologyNote": "بناء تدفقات عمل آلية متطورة وربط الأنظمة البرمجية بنماذج الذكاء الاصطناعي بدون برمجة معقدة.",
      "rankOrder": 6,
      "orderIndex": 60,
      "featured": true,
      "viewsCount": 680000,
      "toolsSummary": "n8n, Webhooks, APIs, AI Automation, Workflow Nodes",
      "techStack": [
          "n8n",
          "Automation",
          "Webhooks",
          "AI Agents"
      ],
      "instructors": [
          {
              "id": "inst-n8n-in-arabic",
              "name": "n8n بالعربي (Kariim Nabiil)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 26,
              "durationText": "14 ساعة تدريبية",
              "note": "شرح شامل ومبسط لأتمتة المهام وبناء الوكلاء الأذكياء عبر منصة n8n",
              "playlistId": "PLLHIYYlcgk6KN58UnPm8q1btNHLDJlYto"
          },
          {
              "id": "inst-arabic-ai-n8n",
              "name": "ذكاء اصطناعي عربي",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 10,
              "durationText": "8 ساعات تدريبية",
              "note": "تطبيقات وتكاملات عملية لربط n8n بالذكاء الاصطناعي وأتمتة المشاريع",
              "playlistId": "PLvmpljk9TE2vSdI6w5kb2ZIXQdWTiqLwF"
          }
      ]
  }),
  // 61. قطاع الذكاء الاصطناعي وعلم البيانات - توليد وصناعة الفيديو والرسوم بالذكاء الاصطناعي AI Video Creation (Veo 3)
  createCourseTrack({
      "id": "ai-video-generation",
      "title": "توليد وصناعة الفيديو والرسوم بالذكاء الاصطناعي AI Video Creation (Veo 3)",
      "domainId": "ai-data-science",
      "domainTitle": "الذكاء الاصطناعي وعلم البيانات",
      "badge": "جديد 2026",
      "methodologyNote": "صناعة المشاهد والفيديوهات الكاملة باستخدام أحدث نماذج توليد الفيديو مثل Veo 3 وتقنيات الإخراج.",
      "rankOrder": 7,
      "orderIndex": 61,
      "featured": false,
      "viewsCount": 750000,
      "toolsSummary": "Google Veo 3, Runway Gen-3, Flow, AI Filmmaking",
      "techStack": [
          "Veo 3",
          "Runway",
          "Video AI",
          "Flow"
      ],
      "instructors": [
          {
              "id": "inst-zeyad-info-ai-video",
              "name": "زياد للمعلوماتيه (Zeyad Info)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 9,
              "durationText": "10 ساعات تدريبية",
              "note": "شروحات عملية مكثفة لأداة Veo 3 وأحدث أدوات توليد الفيديو الطويل والمؤثرات (من مايو 2025)",
              "playlistId": "PLygv9a61oO1MTO6Xd6-pC1VD5830NgR5T"
          }
      ]
  }),
  // 62. قطاع الذكاء الاصطناعي وعلم البيانات - الذكاء الاصطناعي العام ودليل أقوى الأدوات الإنتاجية General AI Tools Mastery
  createCourseTrack({
      "id": "general-ai-tools-mastery",
      "title": "الذكاء الاصطناعي العام ودليل أقوى الأدوات الإنتاجية General AI Tools Mastery",
      "domainId": "ai-data-science",
      "domainTitle": "الذكاء الاصطناعي وعلم البيانات",
      "badge": "دليل شامل",
      "methodologyNote": "دليل شامل لاستخدام وتوظيف أدوات الذكاء الاصطناعي التوليدي في العمل اليومي والكتابة والتصميم والبحث.",
      "rankOrder": 8,
      "orderIndex": 62,
      "featured": false,
      "viewsCount": 820000,
      "toolsSummary": "ChatGPT, Claude, Midjourney, Perplexity, AI Productivity",
      "techStack": [
          "AI Tools",
          "Prompt Engineering",
          "Productivity"
      ],
      "instructors": [
          {
              "id": "inst-ai-arabic-official",
              "name": "الذكاء الاصطناعي بالعربية (@AI_Arabic1)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 20,
              "durationText": "12 ساعة تدريبية",
              "note": "دليل شامل وتطبيقي لأقوى أدوات ومنصات الذكاء الاصطناعي التوليدي والإنتاجية",
              "playlistId": "PLlSkOgnexmrpCDErACdUn8pQtU-SijUeX"
          }
      ]
  }),
  // 63. قطاع الشبكات والأمن السيبراني - شهادة سيسكو الرسمية لإدارة الشبكات Cisco CCNA 200-301
  createCourseTrack({
      "id": "cisco-ccna-200-301",
      "title": "شهادة سيسكو الرسمية لإدارة الشبكات Cisco CCNA 200-301",
      "domainId": "networking-cybersecurity",
      "domainTitle": "الشبكات والأمن السيبراني",
      "badge": "شهادة دولية #1",
      "examCode": "CCNA 200-301",
      "methodologyNote": "كلها تشرح امتحان CCNA 200-301 — مرتبة حسب شرط المئة درس والساعات",
      "rankOrder": 1,
      "orderIndex": 63,
      "featured": true,
      "viewsCount": 950000,
      "toolsSummary": "Cisco Packet Tracer, IPv4/IPv6, Routing, Switching, OSPF",
      "techStack": [
          "CCNA",
          "Cisco",
          "Packet Tracer",
          "Networking"
      ],
      "instructors": [
          {
              "id": "inst-ahmed-salama-ccna",
              "name": "Ahmed Salama Academy",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 126,
              "durationText": "120 درسًا، 14س 55د ✔",
              "note": "120 درسًا، 14س 55د ✔ — الدروس قصيرة نسبيًا، فهي الأخف زمنًا.",
              "playlistId": "PL7Gr36YWMQJfudBhButGVU-bCPpEP29f0"
          },
          {
              "id": "inst-shahinaz-elkasrawy-ccna",
              "name": "Eng. Shahinaz Elkasrawy",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 114,
              "durationText": "103–114 درسًا، حوالي 26 ساعة ✔",
              "note": "103–114 درسًا، حوالي 26 ساعة ✔ — الأنسب لمن يريد عددًا كبيرًا مع عمق متوسط.",
              "playlistId": "PLZRbfAPIQNh_etXgCDAmF7-939z7uGe0P"
          },
          {
              "id": "inst-abeer-hosni-ccna",
              "name": "Abeer Hosni",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 83,
              "durationText": "82–83 درسًا، 57–60 ساعة ✔",
              "note": "82–83 درسًا، 57–60 ساعة ✔ — الأعمق والأشمل في الساعات.",
              "playlistId": "PLped9VG7STA-SnQv4X9lauBZGH4rW8ICF"
          },
          {
              "id": "inst-ahmed-nazmy-ccna",
              "name": "Ahmed Nazmy",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 45,
              "durationText": "50 درسًا، 26 ساعة ✔",
              "note": "50 درسًا، 26 ساعة ✔ — له أكبر عدد دارسين على Teracourses (+3400).",
              "playlistId": "PL77yNtB4-LjnN2FU3h1v5hIJOHZfW9ugq"
          },
          {
              "id": "inst-ahmed-hassan-ccna",
              "name": "Helper For Training - Ahmed Hassan",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 49,
              "durationText": "49 درسًا، 24 ساعة ✔",
              "note": "49 درسًا، 24 ساعة ✔.",
              "playlistId": "PLoP_aS_FoPQfCHLDULY7wmjz3Qgp5f7il"
          },
          {
              "id": "inst-jeremy-it-lab-ccna",
              "name": "Jeremy's IT Lab",
              "role": "بديل معتمد",
              "language": "EN",
              "verified": true,
              "lessonsCount": 126,
              "durationText": "126 درسًا، 58 ساعة ✔",
              "note": "126 درسًا، 58 ساعة ✔.",
              "playlistId": "PLxbwE86jKRgMpuZuLBivzlM8s2Dk5lXBQ"
          },
          {
              "id": "inst-keith-barker-ccna",
              "name": "Keith Barker",
              "role": "بديل معتمد",
              "language": "EN",
              "verified": true,
              "lessonsCount": 182,
              "durationText": "182 درسًا، 118 ساعة ✔",
              "note": "182 درسًا، 118 ساعة ✔.",
              "playlistId": "PLQQoSBmrXmrysEaVNia7KVwf85qATIi1V"
          }
      ]
  }),
  // 64. قطاع الشبكات والأمن السيبراني - أساسيات واحتراف الأمن السيبراني CompTIA Security+
  createCourseTrack({
      "id": "comptia-security-plus",
      "title": "أساسيات واحتراف الأمن السيبراني CompTIA Security+",
      "domainId": "networking-cybersecurity",
      "domainTitle": "الشبكات والأمن السيبراني",
      "badge": "شهادة دولية معتمدة",
      "examCode": "SY0-701 / SY0-601",
      "methodologyNote": "المسار التأسيسي الأشمل والأعلى طلباً دولياً في مفاهيم أمن المعلومات وحماية الشبكات والأنظمة.",
      "rankOrder": 2,
      "orderIndex": 64,
      "featured": true,
      "viewsCount": 880000,
      "toolsSummary": "Security Fundamentals, Threat Management, Cryptography, Identity",
      "techStack": [
          "Security+",
          "CompTIA",
          "Cybersecurity",
          "Cryptography"
      ],
      "instructors": [
          {
              "id": "inst-hassan-saleh-secplus",
              "name": "FREE4ARAB Information Technology - م. حسن صالح",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 155,
              "durationText": "155 درسًا، 76س 38د ✔",
              "note": "155 درسًا، 76س 38د ✔ — الوحيدة الطويلة بالعربية.",
              "playlistId": "PLLlr6jKKdyK3C22AuU70h5xWe0ePmsbT7"
          },
          {
              "id": "inst-netriders-academy-secplus",
              "name": "Netriders Academy",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 52,
              "durationText": "52 درسًا، 34س 43د ✔",
              "note": "52 درسًا، 34س 43د ✔ — تنبيه: الشرح على نسخة SY0-601 والامتحان الحالي SY0-701.",
              "playlistId": "PLky4bd7_03m8o1NB0j96OsxZs0KcKlgMO"
          },
          {
              "id": "inst-altechnologya-secplus",
              "name": "Altechnologya",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 28,
              "durationText": "28 درسًا، 2س 51د ✔",
              "note": "28 درسًا، 2س 51د ✔ — مدخل سريع لا أكثر.",
              "playlistId": "PLgIQibkrZYz2ILJG4WLv_CT8zUgicRcwV"
          },
          {
              "id": "inst-professor-messer-secplus",
              "name": "Professor Messer",
              "role": "بديل معتمد",
              "language": "EN",
              "verified": true,
              "lessonsCount": 121,
              "durationText": "177 درسًا، 21 ساعة ✔",
              "note": "177 درسًا، 21 ساعة ✔.",
              "playlistId": "PLG49S3nxzAnl4QDVqK-hOnoqcSKEIDDuv"
          }
      ]
  }),
  // 65. قطاع الشبكات والأمن السيبراني - اختبار اختراق المواقع وتطبيقات الويب Web Penetration Testing
  createCourseTrack({
      "id": "web-penetration-testing",
      "title": "اختبار اختراق المواقع وتطبيقات الويب Web Penetration Testing",
      "domainId": "networking-cybersecurity",
      "domainTitle": "الشبكات والأمن السيبراني",
      "badge": "مسار عملي تخصصي",
      "methodologyNote": "اكتشاف واستغلال ثغرات الويب المتقدمة وفق OWASP Top 10 والتطبيق العملي على منصات التحديات.",
      "rankOrder": 3,
      "orderIndex": 65,
      "featured": false,
      "viewsCount": 760000,
      "toolsSummary": "Burp Suite, OWASP ZAP, SQLMap, Web Vulnerabilities",
      "techStack": [
          "Burp Suite",
          "Web Pentest",
          "OWASP",
          "XSS",
          "SQLi"
      ],
      "instructors": [
          {
              "id": "inst-ebrahem-web-pentest",
              "name": "Ebrahem",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 48,
              "durationText": "48 درسًا، 18س 7د ✔",
              "note": "48 درسًا، 18س 7د ✔.",
              "playlistId": "PLv7cogHXoVhXvHPzIl1dWtBiYUAL8baHj"
          },
          {
              "id": "inst-cyber-guy-web-pentest",
              "name": "Cyber Guy",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 36,
              "durationText": "36 درسًا، 14س 35د ✔",
              "note": "36 درسًا، 14س 35د ✔.",
              "playlistId": "PLDRMxi70CdSBHODkNy87kqqGUSnl0ASxg"
          },
          {
              "id": "inst-hassan-saad-web-pentest",
              "name": "Hassan Saad",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 33,
              "durationText": "33 درسًا، 11س 57د ✔",
              "note": "33 درسًا، 11س 57د ✔.",
              "playlistId": "PLtr9ezc61PUb3iQMlvnicIC3BIra2BZId"
          },
          {
              "id": "inst-motasem-hamdan-web-pentest",
              "name": "Motasem Hamdan",
              "role": "بديل معتمد",
              "language": "EN",
              "verified": true,
              "lessonsCount": 190,
              "durationText": "111 درسًا، 26 ساعة ✔",
              "note": "111 درسًا، 26 ساعة ✔ — شروحات لتحديات وليست منهجًا مرتبًا.",
              "playlistId": "PLNvdtq6oHX8U"
          }
      ]
  }),
  // 66. قطاع الشبكات والأمن السيبراني - شهادة الاختراق الأخلاقي المعتمد Certified Ethical Hacker (CEH)
  createCourseTrack({
      "id": "certified-ethical-hacker-ceh",
      "title": "شهادة الاختراق الأخلاقي المعتمد Certified Ethical Hacker (CEH)",
      "domainId": "networking-cybersecurity",
      "domainTitle": "الشبكات والأمن السيبراني",
      "badge": "شهادة دولية #2",
      "examCode": "CEH v12",
      "methodologyNote": "منهجية الفحص والاستطلاع والهجوم الأخلاقي لاكتشاف نقاط الضعف وتأمين الثغرات المؤسسية.",
      "rankOrder": 4,
      "orderIndex": 66,
      "featured": false,
      "viewsCount": 810000,
      "toolsSummary": "Kali Linux, Metasploit, Nmap, Wireshark, Exploitation",
      "techStack": [
          "CEH",
          "Kali Linux",
          "Metasploit",
          "Nmap"
      ],
      "instructors": [
          {
              "id": "inst-mahmoud-atef-ceh",
              "name": "FREE4ARAB - م. محمود عاطف",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 32,
              "durationText": "32 درسًا، 16س 42د ✔",
              "note": "32 درسًا، 16س 42د ✔.",
              "playlistId": "PLLlr6jKKdyK39fb-fpv4l_1OKiZG0-p8d"
          },
          {
              "id": "inst-elbashmobarmeg-ceh",
              "name": "الباشمبرمج",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 33,
              "durationText": "33 درسًا، 7س 27د ✔",
              "note": "33 درسًا، 7س 27د ✔.",
              "playlistId": "PL8WMeMsGLndd6k07bHJkhTEpSaseMOfLq"
          },
          {
              "id": "inst-isecur1ty-ceh",
              "name": "iSecur1ty",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 26,
              "durationText": "26 درسًا، 6س 12د ✔",
              "note": "26 درسًا، 6س 12د ✔.",
              "playlistId": "PLqi7yZF-SFcZrof7LTDqrZhJt2KuEQFx2"
          }
      ]
  }),
  // 67. قطاع الأعمال واللغات - ذكاء الأعمال وتحليل وتصوير البيانات التفاعلي بواسطة Power BI
  createCourseTrack({
      "id": "power-bi-data-analysis",
      "title": "ذكاء الأعمال وتحليل وتصوير البيانات التفاعلي بواسطة Power BI",
      "domainId": "business-languages",
      "domainTitle": "الأعمال واللغات",
      "badge": "المجال #8",
      "methodologyNote": "بناء تقارير الأعمال التفاعلية، نمذجة الجداول والعلاقات، واحتراف صياغة دوال DAX المتقدمة.",
      "rankOrder": 1,
      "orderIndex": 67,
      "featured": true,
      "viewsCount": 840000,
      "toolsSummary": "Power BI, DAX, Power Query, Data Modeling, Dashboards",
      "techStack": [
          "Power BI",
          "DAX",
          "Power Query",
          "Business Intelligence"
      ],
      "instructors": [
          {
              "id": "inst-fouad-zawadi-pbi",
              "name": "Fouad Zawadi",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 73,
              "durationText": "73 فيديو ✔",
              "note": "«تعلّم باور بي أي من الألف إلى الياء»، 73 فيديو ✔، تغطي تشكيل البيانات والعلاقات وDAX",
              "playlistId": "PL-qR2lCbzf-qKcSx6v7IVz30G5A711xKA"
          },
          {
              "id": "inst-almunthir-saffan-pbi",
              "name": "المنذر سفان",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 38,
              "durationText": "20 ساعة تدريبية",
              "note": "شرح تطبيقي وإداري شامل لتقارير ولوحات معلومات Power BI",
              "playlistId": "PLof3yw6ZFPFjQKcrPGlSXz3qGuL93MQme"
          },
          {
              "id": "inst-khaled-shaaban-dax",
              "name": "Khaled Shaaban (Learn Excel & Power BI)",
              "role": "مكمل",
              "language": "AR",
              "verified": true,
              "lessonsCount": 19,
              "durationText": "8 فيديوهات مكملة في DAX ✔",
              "note": "8 فيديوهات مكملة في DAX ✔ — احتراف دوال التحليل والمقاييس",
              "playlistId": "PLX7gALGQvxQPB7S-hvlY-oIR0ZFTqKbnu"
          },
          {
              "id": "inst-dr-abdelrahman-pbi-pq",
              "name": "Learn With Dr Abdelrahman",
              "role": "مكمل",
              "language": "AR",
              "verified": true,
              "lessonsCount": 11,
              "durationText": "11 فيديو في Power BI وPower Query ✔",
              "note": "11 فيديو في Power BI وPower Query ✔",
              "playlistId": "PLZZaSsse59uYoSeU2gpx0899POZJL9Ze9"
          }
      ]
  }),
  // 68. قطاع الأعمال واللغات - احتراف مايكروسوفت إكسل الشامل والتطبيقي Microsoft Excel Mastery
  createCourseTrack({
      "id": "excel-comprehensive-mastery",
      "title": "احتراف مايكروسوفت إكسل الشامل والتطبيقي Microsoft Excel Mastery",
      "domainId": "business-languages",
      "domainTitle": "الأعمال واللغات",
      "badge": "الأساس المكتبي الأول",
      "methodologyNote": "الدليل المتكامل لبرنامج إكسل من الدوال الأساسية حتى التحليل المتقدم والجداول المحورية والأتمتة.",
      "rankOrder": 2,
      "orderIndex": 68,
      "featured": true,
      "viewsCount": 910000,
      "toolsSummary": "Microsoft Excel, PivotTables, Formulas, VLOOKUP, XLOOKUP",
      "techStack": [
          "Excel",
          "Spreadsheets",
          "Formulas",
          "Data Analysis"
      ],
      "instructors": [
          {
              "id": "inst-mohamed-al-assaal-excel",
              "name": "Mohamed Al Assaal",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 67,
              "durationText": "67 درسًا، 11س 39د ✔",
              "note": "67 درسًا، 11س 39د ✔",
              "playlistId": "PLXlHqMRg9lAYiiutr-Ou0J1uU20T-5a4-"
          },
          {
              "id": "inst-3alemneup-excel",
              "name": "علمني اب",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 76,
              "durationText": "76 درسًا، 11س 9د ✔",
              "note": "76 درسًا، 11س 9د ✔",
              "playlistId": "PLHEPOEqjBpoXTLxPvUBbiTtgPKZLM0UdI"
          },
          {
              "id": "inst-almunthir-saffan-excel",
              "name": "المنذر سفان",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 46,
              "durationText": "47–50 درسًا",
              "note": "47–50 درسًا — احتراف برنامج الإكسل حتى الإتقان",
              "playlistId": "PLof3yw6ZFPFjik6ifGwXs68DLS60OPHYM"
          }
      ]
  }),
  // 69. قطاع الأعمال واللغات - الإكسل المحاسبي وتصميم الأنظمة المالية Accounting Excel & Financial Systems
  createCourseTrack({
      "id": "accounting-excel-erp",
      "title": "الإكسل المحاسبي وتصميم الأنظمة المالية Accounting Excel & Financial Systems",
      "domainId": "business-languages",
      "domainTitle": "الأعمال واللغات",
      "badge": "تطبيقي مالي",
      "methodologyNote": "تصميم اليومية الأمريكية، ميزان المراجعة، القوائم المالية، والربط مع أنظمة إدارة الموارد ERP.",
      "rankOrder": 3,
      "orderIndex": 69,
      "featured": false,
      "viewsCount": 630000,
      "toolsSummary": "Financial Excel, Balance Sheet, Ledger, ERP Accounting",
      "techStack": [
          "Accounting",
          "Financial Modeling",
          "Excel",
          "ERP"
      ],
      "instructors": [
          {
              "id": "inst-e-accounting-erp-excel",
              "name": "E-Accounting & ERP",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 17,
              "durationText": "17 درسًا ✔",
              "note": "17 درسًا ✔ — Excel for Accounting الإكسيل المحاسبي وتطبيقات المحاسبة العملية",
              "playlistId": "PLNUk9qMoRCS-okWHL5wFErCW8gTrJjbry"
          }
      ]
  }),
  // 70. قطاع الأعمال واللغات - تحسين محركات البحث وتصدر نتائج جوجل Search Engine Optimization (SEO)
  createCourseTrack({
      "id": "seo-search-engine-optimization",
      "title": "تحسين محركات البحث وتصدر نتائج جوجل Search Engine Optimization (SEO)",
      "domainId": "business-languages",
      "domainTitle": "الأعمال واللغات",
      "badge": "تسويق رقمي",
      "methodologyNote": "السيو الداخلي والخارجي، الكلمات المفتاحية، وبناء الروابط الخلفية وتصدر نتائج محركات البحث.",
      "rankOrder": 4,
      "orderIndex": 70,
      "featured": false,
      "viewsCount": 720000,
      "toolsSummary": "SEO, On-Page, Off-Page, Keyword Research, Technical SEO",
      "techStack": [
          "SEO",
          "Google Search",
          "Digital Marketing",
          "Keywords"
      ],
      "instructors": [
          {
              "id": "inst-e-marketing-lovers-seo",
              "name": "E-Marketing Lovers",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 34,
              "durationText": "34 درسًا ✔",
              "note": "34 درسًا ✔ — كورس السيو المتكامل من الصفر",
              "playlistId": "PLZyF0PRK2oMQ_NHLO79hkN_la45Q700RF"
          },
          {
              "id": "inst-shaimaa-elmahdy-seo",
              "name": "شيماء المهدي",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 32,
              "durationText": "32 درسًا",
              "note": "شرح تطبيقي حديث لتحسين محركات البحث وتحديثات خوارزميات جوجل",
              "playlistId": "PLHAAJ2zG7Uzn6F5hd-YLHtZrwlNuAPSNt"
          },
          {
              "id": "inst-teracourses-seo",
              "name": "كورس Teracourses",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 32,
              "durationText": "32 درسًا",
              "note": "32 درسًا — مسار السيو المعتمد للمسوقين ورواد الأعمال",
              "playlistId": "PL92kQtqBVlOMMatUyitVRnTXidPd11lRb"
          }
      ]
  }),
  // 71. قطاع الأعمال واللغات - اللغة الإنجليزية الشاملة والتواصل المهني English for Tech & Remote Work
  createCourseTrack({
      "id": "english-for-software-engineers",
      "title": "اللغة الإنجليزية الشاملة والتواصل المهني English for Tech & Remote Work",
      "domainId": "business-languages",
      "domainTitle": "الأعمال واللغات",
      "badge": "مهارة عالمية",
      "methodologyNote": "تطوير القواعد والمحادثة والاستماع والمصطلحات المهنية لبيئات العمل الدولية والعمل عن بُعد.",
      "rankOrder": 5,
      "orderIndex": 71,
      "featured": true,
      "viewsCount": 940000,
      "toolsSummary": "Grammar, Speaking, Listening, Business English, Vocabulary",
      "techStack": [
          "English",
          "Communication",
          "Business English",
          "Grammar"
      ],
      "instructors": [
          {
              "id": "inst-zamericanenglish",
              "name": "ZAmericanEnglish",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 24,
              "durationText": "24 درسًا تأسيسيًا",
              "note": "الكورس الشامل لتعلم اللغة الإنجليزية من الصفر وتأسيس القواعد",
              "playlistId": "PLp22-4PivYmLBmV2wctgqyyRlIs1MhmNr"
          },
          {
              "id": "inst-learn-english-with-ehab",
              "name": "Learn English with Ehab",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 48,
              "durationText": "48 درسًا عمليًا",
              "note": "دروس تطبيقية لتعلم المحادثة الإنجليزية والتواصل من المستوى المبتدئ",
              "playlistId": "PLjcu8DN2DuL4TWptae2RlFQoS9p0nKyMb"
          },
          {
              "id": "inst-bbc-learning-english",
              "name": "BBC Learning English",
              "role": "بديل معتمد",
              "language": "EN",
              "verified": true,
              "lessonsCount": 67,
              "durationText": "67 درسًا",
              "note": "سلسلة English at Work والمحادثات اليومية الموثقة من هيئة الإذاعة البريطانية",
              "playlistId": "PLcetZ6gSk969oGvAI0e4_PgVnlGbm64bp"
          }
      ]
  }),
  // 72. قطاع الأعمال واللغات - تعلم اللغة الفرنسية من الصفر حتى الإتقان French Language Mastery (A1-B2)
  createCourseTrack({
      "id": "french-language-mastery",
      "title": "تعلم اللغة الفرنسية من الصفر حتى الإتقان French Language Mastery (A1-B2)",
      "domainId": "business-languages",
      "domainTitle": "الأعمال واللغات",
      "badge": "لغات حية",
      "methodologyNote": "تأسيس شامل في قواعد ومحادثات ونطق اللغة الفرنسية خطوة بخطوة وفق الإطار الأوروبي المشترك.",
      "rankOrder": 6,
      "orderIndex": 72,
      "featured": false,
      "viewsCount": 710000,
      "toolsSummary": "French Grammar, DELF A1/A2, Pronunciation, Conversation",
      "techStack": [
          "French",
          "Languages",
          "DELF",
          "Grammar"
      ],
      "instructors": [
          {
              "id": "inst-faransawy-french",
              "name": "«فرنساوي» (Frenchawy)",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 71,
              "durationText": "75 درسًا ✔",
              "note": "75 درسًا ✔ — كورس اللغة الفرنسية الشامل التأسيسي والمحادثات",
              "playlistId": "PLW0eXp-s-kGCEEQA-At45KOCamEyz8Fq9"
          },
          {
              "id": "inst-la-langue-francaise",
              "name": "La langue française",
              "role": "بديل معتمد",
              "language": "AR",
              "verified": true,
              "lessonsCount": 63,
              "durationText": "63 درسًا",
              "note": "تعلم نطق وقواعد ومحادثة اللغة الفرنسية خطوة بخطوة",
              "playlistId": "PL8tN7PSHumdSN2EAP5-ui59iBPysTYFl6"
          },
          {
              "id": "inst-innerfrench",
              "name": "InnerFrench",
              "role": "بديل معتمد",
              "language": "EN",
              "verified": true,
              "lessonsCount": 110,
              "durationText": "110 درسًا",
              "note": "Intermediate and Conversational Natural French with Hugo Cotton",
              "playlistId": "PLTSnwH2OTrraNHXkLHP8G96dpxwNSd85C"
          }
      ]
  }),
  // 73. قطاع الأعمال واللغات - تعلم اللغة الألمانية واجتياز المستويات الدولية German Language (A1-B1)
  createCourseTrack({
      "id": "german-language-mastery",
      "title": "تعلم اللغة الألمانية واجتياز المستويات الدولية German Language (A1-B1)",
      "domainId": "business-languages",
      "domainTitle": "الأعمال واللغات",
      "badge": "لغات حية",
      "methodologyNote": "تأسيس متكامل للمستويات الدولية في اللغة الألمانية، النطق السليم، والقواعد والمحادثات الواقعية.",
      "rankOrder": 7,
      "orderIndex": 73,
      "featured": false,
      "viewsCount": 690000,
      "toolsSummary": "German A1/A2, Goethe Zertifikat, Grammar, Real German Conversations",
      "techStack": [
          "German",
          "Deutsch",
          "Languages",
          "Goethe"
      ],
      "instructors": [
          {
              "id": "inst-deutsch-mit-hend",
              "name": "Deutsch mit Hend",
              "role": "أساسي",
              "language": "AR",
              "verified": true,
              "lessonsCount": 26,
              "durationText": "26 درسًا",
              "note": "كورس اللغة الألمانية الشامل والتأسيس المتكامل للمستويات الدولية A1",
              "playlistId": "PLkMQi7_Jt8pt4A2C-ZhoRHKt0AGVkVg9w"
          },
          {
              "id": "inst-easy-german",
              "name": "Easy German",
              "role": "بديل معتمد",
              "language": "EN",
              "verified": true,
              "lessonsCount": 64,
              "durationText": "64 درسًا",
              "note": "Learn German from the Streets - Real Life Conversations & Street Interviews",
              "playlistId": "PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg"
          },
          {
              "id": "inst-get-germanized",
              "name": "Get Germanized",
              "role": "بديل معتمد",
              "language": "EN",
              "verified": true,
              "lessonsCount": 48,
              "durationText": "48 درسًا",
              "note": "German Made Easy: Beginner's Lessons and Practical Vocabulary",
              "playlistId": "PLvr84R8yDNJZxVFRhIAdv-UGEj2KOA86n"
          }
      ]
  })
];
