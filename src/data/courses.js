// بيانات الدورات والأقسام التعليمية الـ 10 للذكاء الاصطناعي لعام 2026
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

export const INITIAL_COURSES = [
  // ==================== القسم 1: صناعة الأفلام والفيديو السينمائي (AI Filmmaking) ====================
  {
    id: "ai-film-curious-refuge",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "wHIdCNIQHpo",
    youtubeVideoId: "wHIdCNIQHpo",
    verified: true,
    runtime: "18:42",
    viewsCount: 385000,
    year: "2026",
    title: "كيف تصنع فيلماً احترافياً بالذكاء الاصطناعي خطوة بخطوة (Curious Refuge)",
    instructor: "Curious Refuge",
    category: "صناعة الأفلام والفيديو السينمائي (AI Filmmaking)",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "الأفضل للإخراج المتكامل",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: false,
    primaryTool: "Curious Refuge AI Film Workflow",
    toolsSummary: "Kling • Midjourney • ElevenLabs • Premiere Pro",
    featured: true,
    thumbnail: "https://i.ytimg.com/vi/wHIdCNIQHpo/maxresdefault.jpg",
    scores: { depth: 9.8, practical: 9.7, freshness: 9.9, production: 9.8 },
    techStack: [
      { role: "توليد المشاهد السينمائية", name: "Runway Gen-3 / Kling" },
      { role: "تصميم القصة ولوحات المشاهد", name: "Midjourney v6.1" },
      { role: "المؤثرات الصوتية والدبلجة", name: "ElevenLabs Studio" }
    ],
    oneLineVerdict: "الدليل العالمي الأوضح عربياً وعالمياً لإنتاج فيلم روائي سينمائي كامل بالذكاء الاصطناعي من الألف إلى الياء.",
    synopsis: "يأخذك الشرح خطوة بخطوة في رحلة كتابة القصة، تخطيط لوحات المشاهد (Storyboard)، توليد اللقطات السينمائية بزوايا تصوير احترافية، ودمج الأصوات والمونتاج في عمل فني متكامل.",
    timestamps: [
      { time: "00:00", label: "مقدمة صناعة الأفلام وفكرة العمل الفني" },
      { time: "03:15", label: "كتابة السيناريو وبناء لوحة المشاهد" },
      { time: "08:40", label: "توليد اللقطات السينمائية وتوحيد الإضاءة" },
      { time: "14:10", label: "المؤثرات الصوتية وتصدير الفيلم النهائي" }
    ],
    review: {
      verdictBox: "تحفة إرشادية لا غنى عنها لكل صانع أفلام يريد دخول عصر الإنتاج السينمائي بالذكاء الاصطناعي.",
      strengths: "منهجية إخراجية هوليوودية وتطبيق واقعي على فيلم حقيقي.",
      limitations: "يتطلب صبراً في تجربة توليد اللقطات للوصول لأفضل زاوية.",
      deepAnalysis: "يركز الشرح على التكوين البصري واللغة السينمائية بدلاً من مجرد كتابة أوامر عشوائية."
    },
    promptBlueprint: "Cinematic 35mm film still, dramatic chiaroscuro lighting, anamorphic lens flare, photorealistic color grading --ar 16:9",
    comments: []
  },
  {
    id: "kling-filmmaking-crux",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "PzOH1v5GaW0",
    youtubeVideoId: "PzOH1v5GaW0",
    verified: true,
    runtime: "15:20",
    viewsCount: 195000,
    year: "2026",
    title: "الدليل العملي لصناعة فيديو سينمائي عبر Kling AI 4.0 (FILM CRUX)",
    instructor: "FILM CRUX",
    category: "صناعة الأفلام والفيديو السينمائي (AI Filmmaking)",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "أقوى تحكم في الكاميرا",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: false,
    primaryTool: "Kling AI 4.0",
    toolsSummary: "Kling AI • Camera Motion • Elements Tracking",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/PzOH1v5GaW0/maxresdefault.jpg",
    scores: { depth: 9.6, practical: 9.8, freshness: 9.7, production: 9.6 },
    techStack: [
      { role: "محرك الفيديو الأساسي", name: "Kling AI 4.0" },
      { role: "التحكم في زوايا الكاميرا", name: "Camera Motion Controls" }
    ],
    oneLineVerdict: "شرح عملي عميق لكيفية ترويض نموذج Kling AI والتحكم الدقيق بحركة الكاميرا وعناصر المشهد.",
    synopsis: "المرحلة الثانية في مسار الإخراج السينمائي: كيفية استخدام ميزات Kling AI المتقدمة كالتحكم بالمسارات الحركية وتفادي أخطاء التشوه الفيزيائي.",
    timestamps: [
      { time: "00:00", label: "مقدمة عن قدرات Kling AI 4.0" },
      { time: "04:30", label: "أوامر حركة الكاميرا (Pan, Tilt, Zoom)" },
      { time: "09:50", label: "تثبيت الشخصية والبيئة المحيطة" }
    ],
    review: {
      verdictBox: "الشرح الأكثر تخصصاً للمخرجين الذين يحتاجون لحركات كاميرا معقدة وسلسة.",
      strengths: "أمثلة تطبيقية واضحة ومقارنة حية لسرعات الحركة.",
      limitations: "يحتاج إلى خطة مدفوعة للاستفادة من أقصى جودة ودقة.",
      deepAnalysis: "يمتاز Kling بالواقعية الفيزيائية لحركة السوائل والأقمشة والشعر مقارنة بالمنافسين."
    },
    promptBlueprint: "Cinematic camera dolly forward, slow motion, shallow depth of field, mist and dust particles in atmospheric volumetric light.",
    comments: []
  },
  {
    id: "runway-vs-kling-refuge",
    orderIndex: 3,
    rankOrder: 3,
    youtubeId: "Rj_o3vXZmZU",
    youtubeVideoId: "Rj_o3vXZmZU",
    verified: true,
    runtime: "14:15",
    viewsCount: 240000,
    year: "2026",
    title: "مقارنة شاملة وتطبيق عملي: Runway 4.5 مقابل Kling 2.6 (Curious Refuge)",
    instructor: "Curious Refuge",
    category: "صناعة الأفلام والفيديو السينمائي (AI Filmmaking)",
    level: "المستوى المتقدم (احترافي)",
    qualityBadge: "مقارنة المحترفين الكبرى",
    trending: false,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: false,
    primaryTool: "Runway & Kling",
    toolsSummary: "Runway Gen-3 • Kling AI • Motion Brush",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/Rj_o3vXZmZU/maxresdefault.jpg",
    scores: { depth: 9.7, practical: 9.5, freshness: 9.9, production: 9.7 },
    techStack: [
      { role: "المقارنة الأساسية", name: "Runway vs Kling" },
      { role: "أدوات التحرير التفاعلي", name: "Motion Brush & Multi-Camera" }
    ],
    oneLineVerdict: "مقارنة نقدية وعملية بالغة الدقة توضح لك متى تختار Runway ومتى تتجه إلى Kling لكل لقطة.",
    synopsis: "المرحلة الثالثة: مقارنة وجهاً لوجه لنفس المشهد عبر المنصتين لتحليل دقة تعابير الوجوه، حركة الإضاءة، وسرعة الاستجابة للأوامر.",
    timestamps: [
      { time: "00:00", label: "منهجية المقارنة والمعايير" },
      { time: "05:10", label: "اختبار المشاهد الإنسانية وتعابير الوجه" },
      { time: "10:30", label: "اختبار البيئات الواسعة والانفجارات والمؤثرات" }
    ],
    review: {
      verdictBox: "تختصر عليك مئات الدولارات من الاشتراكات العشوائية بتوضيح نقاط قوة كل منصة.",
      strengths: "اختبارات متطابقة لنفس الأوامر وتوثيق النتائج بشفافية.",
      limitations: "تحديثات النماذج سريعة ولكن المبادئ التوجيهية تظل ثابتة.",
      deepAnalysis: "Runway يتفوق في التحكم والـ Motion Brush بينما Kling يتفوق في الواقعية وتفاصيل البشرة."
    },
    promptBlueprint: "Medium close-up portrait of a veteran astronaut, weathered helmet reflecting distant nebula, cinematic lighting, 8k resolution.",
    comments: []
  },

  // ==================== القسم 2: هندسة الأوامر والتلقين المتقدم (Prompt Engineering) ====================
  {
    id: "prompt-foundations-walid",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "2_3WuekEg4s",
    youtubeVideoId: "2_3WuekEg4s",
    verified: true,
    runtime: "22:23",
    viewsCount: 379000,
    year: "2026",
    title: "أساسيات هندسة أوامر الذكاء الاصطناعي من الصفر (وليد طه)",
    instructor: "وليد طه",
    category: "هندسة الأوامر والتلقين المتقدم (Prompt Engineering)",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "الأفضل للبدء من الصفر",
    trending: true,
    isNewCourse: false,
    isToolGuide: true,
    isMonetization: false,
    primaryTool: "ChatGPT & Claude",
    toolsSummary: "ChatGPT • Claude • Gemini • Prompt Frameworks",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/2_3WuekEg4s/maxresdefault.jpg",
    scores: { depth: 9.8, practical: 9.7, freshness: 9.6, production: 9.7 },
    techStack: [
      { role: "النماذج اللغوية الكبرى", name: "ChatGPT-4o & Claude" },
      { role: "هيكلة الأوامر", name: "Role-Task-Context-Format" }
    ],
    oneLineVerdict: "الشرح العربي الأعمق والأكثر تنظيماً لفهم كيف تتحدث مع نماذج الذكاء الاصطناعي لتحصل على نتائج احترافية.",
    synopsis: "الخطوة الأولى في مسار هندسة الأوامر: تعلم القواعد العلمية للتلقين وكيف تنتقل من الأسئلة العشوائية إلى الأوامر المركبة التي تمنحك مخرجات كالخبراء.",
    timestamps: [
      { time: "00:00", label: "كيف تفهم النماذج اللغوية كلامك؟" },
      { time: "06:10", label: "العناصر الخمسة للأمر المتكامل" },
      { time: "14:20", label: "أمثلة مقارنة قبل وبعد تحسين الأمر" }
    ],
    review: {
      verdictBox: "أساس لا غنى عنه لأي مستخدم للذكاء الاصطناعي سواء في الكتابة أو البرمجة.",
      strengths: "أمثلة مقارنة توضح الفرق الهائل في النتيجة.",
      limitations: "يركز على النماذج النصية بشكل أساسي.",
      deepAnalysis: "إتقان صياغة السياق (Context) وتحديد الدور (Persona) يختصر 80% من وقت إعادة التعديل."
    },
    promptBlueprint: "الدور: خبير استراتيجي في [المجال] | المهمة: صياغة خطة عمل تنفيذية | السياق: [الجمهور والهدف] | التنسيق: جدول خطوات متسلسل.",
    comments: []
  },
  {
    id: "google-prompt-tina",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "p09yRj47kNM",
    youtubeVideoId: "p09yRj47kNM",
    verified: true,
    runtime: "20:45",
    viewsCount: 520000,
    year: "2026",
    title: "ملخص كورس جوجل لهندسة الأوامر (9 ساعات في 20 دقيقة - Tina Huang)",
    instructor: "Tina Huang",
    category: "هندسة الأوامر والتلقين المتقدم (Prompt Engineering)",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "ملخص أكاديمي مكثف",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: false,
    primaryTool: "Google AI & Gemini",
    toolsSummary: "Few-Shot • Chain of Thought • Zero-Shot • ReAct",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/p09yRj47kNM/maxresdefault.jpg",
    scores: { depth: 9.9, practical: 9.6, freshness: 9.8, production: 9.9 },
    techStack: [
      { role: "المرجع الأكاديمي", name: "Google Prompt Engineering Course" },
      { role: "التقنيات المشروحة", name: "Few-Shot & Chain-of-Thought" }
    ],
    oneLineVerdict: "خلاصة كورس جوجل الرسمي لمدة 9 ساعات مقطرة في 20 دقيقة مكثفة تغطي أحدث تقنيات التلقين المعتمدة عالمياً.",
    synopsis: "المرحلة الثانية: استعراض مفاهيم Few-Shot Learning، وتقنية Chain of Thought (سلسلة التفكير)، وكيفية توجيه النماذج لحل المعضلات المنطقية المعقدة.",
    timestamps: [
      { time: "00:00", label: "نظرة عامة على كورس جوجل" },
      { time: "05:15", label: "تقنية Few-Shot بالأمثلة العملية" },
      { time: "11:40", label: "تقنية Chain-of-Thought لحل المسائل المعقدة" },
      { time: "16:50", label: "تجنب الهلوسة وضبط دقة المخرجات" }
    ],
    review: {
      verdictBox: "أفضل استثمار لوقتك إذا أردت استيعاب المفاهيم الأكاديمية لجوجل في جلسة واحدة.",
      strengths: "تركيز شديد وخالٍ تماماً من الحشو مع رسوم بيانية توضيحية.",
      limitations: "الشرح بالإنجليزية ولكن المصطلحات سهلة ومباشرة.",
      deepAnalysis: "فهم الفرق بين Zero-shot و Few-shot هو الفارق الجوهري بين المستخدم العادي والمحترف."
    },
    promptBlueprint: "Solve this step-by-step showing your reasoning chain: [Problem description]. Format output as: 1. Reasoning 2. Final Conclusion.",
    comments: []
  },
  {
    id: "prompt-skills-2026-tina",
    orderIndex: 3,
    rankOrder: 3,
    youtubeId: "tu4rU4YD1Jk",
    youtubeVideoId: "tu4rU4YD1Jk",
    verified: true,
    runtime: "16:30",
    viewsCount: 310000,
    year: "2026",
    title: "أهم مهارات الذكاء الاصطناعي والتلقين المطلوبة في 2026 (Tina Huang)",
    instructor: "Tina Huang",
    category: "هندسة الأوامر والتلقين المتقدم (Prompt Engineering)",
    level: "المستوى المتقدم (احترافي)",
    qualityBadge: "استراتيجية المستقبل وسوق العمل",
    trending: false,
    isNewCourse: true,
    isToolGuide: false,
    isMonetization: true,
    primaryTool: "AI Workforce Skills",
    toolsSummary: "Context Engineering • System Prompts • AI Architecture",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/tu4rU4YD1Jk/maxresdefault.jpg",
    scores: { depth: 9.5, practical: 9.4, freshness: 9.9, production: 9.6 },
    techStack: [
      { role: "مهارة المستقبل الأولى", name: "Context Engineering" },
      { role: "أتمتة سير العمل", name: "AI Agent Orchestration" }
    ],
    oneLineVerdict: "دليل استراتيجي يوضح كيف تحولت هندسة الأوامر من مجرد كتابة جمل إلى هندسة السياق وبناء المنتجات في 2026.",
    synopsis: "المرحلة الثالثة: تحليل التغيرات في سوق العمل التقني وكيف يؤدي الجمع بين هندسة الأوامر والأتمتة إلى مضاعفة قيمتك الوظيفية والإنتاجية.",
    timestamps: [
      { time: "00:00", label: "كيف تطورت هندسة الأوامر في 2026؟" },
      { time: "05:20", label: "من Prompting إلى Context Engineering" },
      { time: "11:00", label: "بناء ملف أعمال يعكس قدرتك على توظيف الذكاء الاصطناعي" }
    ],
    review: {
      verdictBox: "رؤية مستقبلية من واقع وادي السيليكون لكل من يريد الحفاظ على تفوقه المهني.",
      strengths: "نصائح مهنية واقعية وربط المهارة بفرص العمل الحقيقية.",
      limitations: "توجيه مهني أكثر من كونه درساً برمجياً مباشراً.",
      deepAnalysis: "المستقبل ليس لمن يحفظ نصوص الأوامر، بل لمن يجيد بناء سياق غني متكامل للنماذج الذكية."
    },
    promptBlueprint: "Analyze the provided project requirements document and draft a comprehensive architecture specification including edge cases and constraints.",
    comments: []
  },

  // ==================== القسم 3: إنتاج الإعلانات التجارية بالذكاء الاصطناعي (AI Commercials & Ads) ====================
  {
    id: "ai-commercial-nour",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "XOzPJ37EQUk",
    youtubeVideoId: "XOzPJ37EQUk",
    verified: true,
    runtime: "19:50",
    viewsCount: 280000,
    year: "2026",
    title: "صناعة إعلان احترافي بالذكاء الاصطناعي من الصفر — شرح كل خطوة (Nour Design)",
    instructor: "Nour Design",
    category: "إنتاج الإعلانات التجارية بالذكاء الاصطناعي (AI Commercials & Ads)",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "شرح شامل خطوة بخطوة",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "AI Ads Workflow",
    toolsSummary: "Midjourney • Kling • CapCut • ElevenLabs",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/XOzPJ37EQUk/maxresdefault.jpg",
    scores: { depth: 9.7, practical: 9.8, freshness: 9.6, production: 9.7 },
    techStack: [
      { role: "توليد صور المنتجات", name: "Midjourney v6.1" },
      { role: "تحريك إعلانات المنتجات", name: "Kling AI 4.0" },
      { role: "المونتاج والتأثيرات", name: "CapCut Desktop" }
    ],
    oneLineVerdict: "أشمل درس عربي عملي لصناعة إعلان تلفزيوني تجاري لمنتج من الفكرة حتى الفيديو النهائي الجاهز للبث.",
    synopsis: "تعلم كيفية أخذ أي منتج حقيقي وتوليد لقطات إعلانية سينمائية ثلاثية الأبعاد له، مع تحريك بخار السوائل، وزوايا الإضاءة التجارية، والمونتاج الإيقاعي السريع.",
    timestamps: [
      { time: "00:00", label: "فكرة الإعلان التجاري والخطاف البصري" },
      { time: "04:45", label: "توليد صور المنتج بزوايا إعلانية جذابة" },
      { time: "10:15", label: "تحريك المشهد عبر Kling وإضافة الواقعية" },
      { time: "15:30", label: "المونتاج الصوتي وإخراج الإعلان النهائي" }
    ],
    review: {
      verdictBox: "درس مثالي لأصحاب المتاجر والمصممين الذين يريدون توفير آلاف الدولارات في جلسات تصوير المنتجات.",
      strengths: "أسلوب شرح سلس وتطبيق أمام الكاميرا دون تخطي أي خطوة.",
      limitations: "يحتاج إلى تدريب على عزل خلفية المنتج ودمجها بانسجام.",
      deepAnalysis: "الإعلانات التجارية بالذكاء الاصطناعي تعتمد على الإضاءة العاكسة والـ Macro Shots المقربة للمنتجات."
    },
    promptBlueprint: "Luxury perfume bottle splashing water droplets, dark background, commercial studio lighting, 8k product photography.",
    comments: []
  },
  {
    id: "ai-ads-arabic-hadi",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "M1dj8B8FLAw",
    youtubeVideoId: "M1dj8B8FLAw",
    verified: true,
    runtime: "12:15",
    viewsCount: 165000,
    year: "2026",
    title: "طريقتي المجانية لعمل إعلانات احترافية ناطقة بالعربية (هادي راعي)",
    instructor: "هادي راعي",
    category: "إنتاج الإعلانات التجارية بالذكاء الاصطناعي (AI Commercials & Ads)",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "طريقة مجانية وسريعة",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "Free AI Ad Tools",
    toolsSummary: "أدوات مجانية • دوبلاج عربي • إعلانات سوشيال ميديا",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/M1dj8B8FLAw/maxresdefault.jpg",
    scores: { depth: 9.4, practical: 9.7, freshness: 9.5, production: 9.4 },
    techStack: [
      { role: "كتابة السكريبت الإعلاني", name: "ChatGPT Arabic" },
      { role: "توليد التعليق الصوتي العربي", name: "ElevenLabs Arabic Voice" }
    ],
    oneLineVerdict: "طريقة مجربة لصناعة إعلانات تيك توك وإنستغرام ريلز للمنتجات بالصوت العربي الطبيعي وبدون تكلفة استوديو.",
    synopsis: "المرحلة الثانية في مسار الإعلانات: كيف تستخدم الأدوات المجانية لكتابة نص إعلاني يركز على مشكلة العميل والحل، وتوليد فيديو مقنع بصوت عربي واقعي.",
    timestamps: [
      { time: "00:00", label: "سر نجاح إعلانات الفيديو القصيرة" },
      { time: "03:20", label: "كتابة سكريبت إعلاني بأسلوب AIDA" },
      { time: "07:15", label: "توليد المشاهد والتعليق الصوتي مجاناً" }
    ],
    review: {
      verdictBox: "كنز حقيقي لأصحاب المشاريع الصغيرة والمبتدئين في دروبشيبينغ والتجارة الإلكترونية.",
      strengths: "بدائل مجانية لكل خطوة مع التركيز على السوق العربي.",
      limitations: "الفيديوهات المنتجة مخصصة للسوشيال ميديا وليست للتلفزيون.",
      deepAnalysis: "استخدام لهجة عربية بيضاء مفهومة يرفع نسبة التفاعل والتحويل مقارنة بالفصحى الجامدة."
    },
    promptBlueprint: "اكتب لي سكريبت إعلاني مدته 30 ثانية لـ [المنتج] يعتمد صيغة المشكلة والحل ويختم بدعوة واضحة للشراء.",
    comments: []
  },
  {
    id: "kling-product-commercials-dan",
    orderIndex: 3,
    rankOrder: 3,
    youtubeId: "P7pH_1zFKbE",
    youtubeVideoId: "P7pH_1zFKbE",
    verified: true,
    runtime: "14:40",
    viewsCount: 130000,
    year: "2026",
    title: "صناعة إعلانات سينمائية للمنتجات باستخدام Kling AI (Dan Kieft)",
    instructor: "Dan Kieft",
    category: "إنتاج الإعلانات التجارية بالذكاء الاصطناعي (AI Commercials & Ads)",
    level: "المستوى المتقدم (احترافي)",
    qualityBadge: "إخراج سينمائي للمنتجات",
    trending: false,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "Kling AI Commercials",
    toolsSummary: "Kling AI • Product Rendering • Lighting Physics",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/P7pH_1zFKbE/maxresdefault.jpg",
    scores: { depth: 9.6, practical: 9.5, freshness: 9.8, production: 9.7 },
    techStack: [
      { role: "محرك تحريك المنتجات", name: "Kling AI Video" },
      { role: "معالجة الألوان والإضاءة", name: "DaVinci Resolve" }
    ],
    oneLineVerdict: "شرح عالمي راقٍ لإنتاج لقطات منتجات سينمائية تحاكي إعلانات شركات السيارات والمشروبات العالمية.",
    synopsis: "المرحلة الثالثة: تقنيات متقدمة لدمج المنتجات الحقيقية في بيئات مولدة ثلاثية الأبعاد مع حركة كاميرا دائرية (Orbit) وانعكاسات ضوئية فائقة الدقة.",
    timestamps: [
      { time: "00:00", label: "مفهوم اللقطة السينمائية للمنتج" },
      { time: "04:15", label: "هندسة أمر Kling الخاص بالمنتجات" },
      { time: "09:30", label: "تعديل الإضاءة والظلال في المونتاج" }
    ],
    review: {
      verdictBox: "ينقلك من مستوى الهواة إلى الإخراج الاحترافي للعلامات التجارية الكبرى.",
      strengths: "اهتمام غير مسبوق بتفاصيل انعكاس الضوء على الأسطح الزجاجية والمعدنية.",
      limitations: "يتطلب برنامج مونتاج شبه احترافي مثل DaVinci Resolve.",
      deepAnalysis: "السر يكمن في دمج صورة ثابتة للمنتج الحقيقي (Image-to-Video) لتفادي أي تغيير في شعار الماركة."
    },
    promptBlueprint: "360 orbit camera around a sleek matte black beverage can, glowing neon rim lights, dramatic dark background, 4k.",
    comments: []
  },

  // ==================== القسم 4: الأفلام الكرتونية والقصص التعليمية المتحركة (AI Animation) ====================
  {
    id: "ai-animation-infology",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "5KLjmEZEzEA",
    youtubeVideoId: "5KLjmEZEzEA",
    verified: true,
    runtime: "28:10",
    viewsCount: 410000,
    year: "2026",
    title: "كورس كامل لإنتاج أفلام الذكاء الاصطناعي التعليمية الناطقة بالعربية (Infology)",
    instructor: "Infology",
    category: "الأفلام الكرتونية والقصص التعليمية المتحركة (AI Animation)",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "الدورة المتكاملة لصناع المحتوى",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "AI Animation Suite",
    toolsSummary: "أنيميشن • قصص للأطفال • دوبلاج عربي • CapCut",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/5KLjmEZEzEA/maxresdefault.jpg",
    scores: { depth: 9.8, practical: 9.7, freshness: 9.6, production: 9.8 },
    techStack: [
      { role: "توليد الشخصيات الكرتونية", name: "Midjourney 3D Pixar Style" },
      { role: "التحريك الصوتي السلس", name: "D-ID / Hedra" },
      { role: "الأصوات العربية للقصص", name: "ElevenLabs Voice Lab" }
    ],
    oneLineVerdict: "الدورة الأضخم والأجود لإنتاج قصص وأفلام تعليمية وكرتونية ناطقة بالعربية لقنوات يوتيوب الأطفال والتعليم.",
    synopsis: "تعلم من الألف إلى الياء كيف تصنع قصة متحركة ذات مغزى: من الفكرة وسيناريو القصة، توليد خلفيات ثلاثية الأبعاد بأسلوب بيكسار، تحريك حركة الشفاه، وحتى المونتاج والمؤثرات.",
    timestamps: [
      { time: "00:00", label: "مقدمة كورس الرسوم المتحركة" },
      { time: "06:10", label: "توليد الشخصيات وخلفيات البيئة" },
      { time: "14:30", label: "تحريك الشخصيات ومزامنة حركة الفم" },
      { time: "22:00", label: "إضافة الأصوات والمونتاج التفاعلي" }
    ],
    review: {
      verdictBox: "مرجع تأسيسي ممتاز لكل من يخطط لبناء قناة يوتيوب للقصص أو محتوى الأطفال بأسلوب آسر.",
      strengths: "تغطية كاملة من القصة حتى النشر مع نصائح للربح من يوتيوب.",
      limitations: "الكورس مدته نصف ساعة ويتطلب تدريباً عملياً متواصلاً.",
      deepAnalysis: "أسلوب الرسوم ثلاثية الأبعاد المبهجة (3D Pixar Style) يحقق أعلى نسب مشاهدة واحتفاظ بالجمهور."
    },
    promptBlueprint: "Cute friendly cartoon fox character, wearing explorer backpack, Pixar animation style, vibrantly lit forest background --ar 16:9",
    comments: []
  },
  {
    id: "ai-cartoon-tech-tricks",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "fz96x6g1Pwo",
    youtubeVideoId: "fz96x6g1Pwo",
    verified: true,
    runtime: "13:39",
    viewsCount: 88000,
    year: "2026",
    title: "عمل فيلم كرتون بالذكاء الاصطناعي مجاناً من الفكرة إلى فيديو كامل (Tech Tricks)",
    instructor: "تريكات | Tech Tricks",
    category: "الأفلام الكرتونية والقصص التعليمية المتحركة (AI Animation)",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "حل ثبات الشخصيات",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "Kling & Midjourney",
    toolsSummary: "Kling AI • Midjourney • ثبات الملامح • CapCut",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/fz96x6g1Pwo/maxresdefault.jpg",
    scores: { depth: 9.6, practical: 9.6, freshness: 9.5, production: 9.4 },
    techStack: [
      { role: "تثبيت ملامح الشخصية", name: "Seed & Character Sheet" },
      { role: "تحريك المقاطع الكرتونية", name: "Kling AI Image2Video" }
    ],
    oneLineVerdict: "الدليل الأوضح لحل المشكلة الأكبر في أفلام الكرتون: كيف تحافظ على نفس ملامح البطل في كافة لقطات الفيلم.",
    synopsis: "المرحلة الثانية في مسار الكرتون: استخدام ميزات تثبيت الملامح (Character Consistency) لإنتاج مشاهد متتالية يظهر فيها نفس البطل الكرتوني بملابس وتعابير مختلفة.",
    timestamps: [
      { time: "00:00", label: "عقدة تغير ملامح الشخصية وكيف نحلها" },
      { time: "03:45", label: "إنشاء ورقة الشخصية (Character Reference)" },
      { time: "08:10", label: "تحريك المشاهد في Kling AI دون فقدان الهوية" }
    ],
    review: {
      verdictBox: "يحل العقبة التقنية الأكثر إحباطاً لصناع المحتوى الكرتوني.",
      strengths: "حلول عملية وبدائل مجانية قابلة للتطبيق فوراً.",
      limitations: "يحتاج دقة في اختيار الصور المرجعية للبطل.",
      deepAnalysis: "الاعتماد على صورة مرجعية واحدة بزاوية أمامية وجانبية يضمن ثبات الشخصية بنسبة 95%."
    },
    promptBlueprint: "Character sheet of a young detective boy, multiple poses and facial expressions, flat colors, clean white background.",
    comments: []
  },

  // ==================== القسم 5: توليد الصور الاحترافية وسير عمل ComfyUI & Flux ====================
  {
    id: "ai-image-nour-design",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "wgZZ3wqiSq0",
    youtubeVideoId: "wgZZ3wqiSq0",
    verified: true,
    runtime: "21:10",
    viewsCount: 310000,
    year: "2026",
    title: "دليلك الشامل لتعلم التصميم وتوليد الصور بالذكاء الاصطناعي (Nour Design)",
    instructor: "Nour Design",
    category: "توليد الصور الاحترافية وسير عمل ComfyUI & Flux",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "الأفضل للبدء في توليد الصور",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: false,
    primaryTool: "AI Image Design",
    toolsSummary: "Midjourney • Leonardo • Flux • تكوين الكادر",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/wgZZ3wqiSq0/maxresdefault.jpg",
    scores: { depth: 9.8, practical: 9.8, freshness: 9.7, production: 9.7 },
    techStack: [
      { role: "النماذج الأساسية", name: "Midjourney & Flux" },
      { role: "أسرار التكوين الفني", name: "Lighting, Lenses & Composition" }
    ],
    oneLineVerdict: "المدخل الذهبي لفهم أساسيات الإضاءة والعدسات والتكوين الفني للحصول على صور احترافية خارقة للواقعية.",
    synopsis: "تعلم القواعد الفوتوغرافية الحقيقية التي تفهمها نماذج الذكاء الاصطناعي: نوع العدسة (85mm, 35mm)، مصادر الإضاءة، طابع الألوان، وكيف تتجنب التشوهات تماماً.",
    timestamps: [
      { time: "00:00", label: "مفهوم التوليد الاحترافي للصور" },
      { time: "05:30", label: "أوامر العدسات والزوايا الفوتوغرافية" },
      { time: "11:15", label: "التحكم في مصادر الإضاءة والظلال" },
      { time: "17:00", label: "تعديل التفاصيل وإزالة التشوهات" }
    ],
    review: {
      verdictBox: "يحولك من مجرد شخص يكتب كلمات عشوائية إلى فنان رقمي يوجه النموذج بوعي كامل.",
      strengths: "أساس علمي فوتوغرافي متين مدعوم بمقارنات بصرية.",
      limitations: "يركز على التأسيس ويُتبع بالشرح المتخصص لـ ComfyUI.",
      deepAnalysis: "الأمر المكتوب بلغة المصورين المحترفين يعطي نتائج تفوق الأوامر العامة بـ 10 أضعاف."
    },
    promptBlueprint: "Portrait photograph, natural morning sunlight through sheer curtains, 85mm f/1.4 lens, catchlight in eyes, ultra-realistic skin texture.",
    comments: []
  },
  {
    id: "flux-comfyui-pixaroma",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "ntxxhO9H3bY",
    youtubeVideoId: "ntxxhO9H3bY",
    verified: true,
    runtime: "17:45",
    viewsCount: 175000,
    year: "2026",
    title: "شرح التوليد والتعديل الاحترافي عبر Flux 3 Klein في ComfyUI (Pixaroma)",
    instructor: "Pixaroma",
    category: "توليد الصور الاحترافية وسير عمل ComfyUI & Flux",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "شرح عملي لنموذج Flux و ComfyUI",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: false,
    primaryTool: "Flux & ComfyUI",
    toolsSummary: "Flux.1 • ComfyUI • Inpainting • LoRA",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/ntxxhO9H3bY/maxresdefault.jpg",
    scores: { depth: 9.7, practical: 9.6, freshness: 9.9, production: 9.6 },
    techStack: [
      { role: "محرك الصور الثوري", name: "Flux.1 [dev] / Klein" },
      { role: "بيئة العقد البصرية", name: "ComfyUI Local / Cloud" }
    ],
    oneLineVerdict: "شرح مبسط وذكي لربط أقوى نموذج صور في العالم Flux داخل واجهة العقد ComfyUI والتحكم بكل بكسل.",
    synopsis: "المرحلة الثانية: كيف تثبت وتشغل نموذج Flux داخل ComfyUI، واستخدام تقنيات التعديل الجزئي (Inpainting) وتغيير الملابس والملامح بدقة لا مثيل لها.",
    timestamps: [
      { time: "00:00", label: "لماذا يتفوق Flux على كافة المنافسين؟" },
      { time: "04:20", label: "بناء أول Workflow في ComfyUI لـ Flux" },
      { time: "10:10", label: "التعديل الموضعي وإعادة التوليد بدقة" }
    ],
    review: {
      verdictBox: "دليل عملي مباشر لتشغيل أقوى منظومة توليد صور مفتوحة المصدر.",
      strengths: "ملفات Workflow جاهزة للتحميل وشرح خطوة بخطوة للعقد.",
      limitations: "يتطلب بطاقة رسوميات جيدة (VRAM 8GB+) للتشغيل المحلي، أو سحابة مجانية.",
      deepAnalysis: "Flux يقدم أفضل رسم للأيدي والنصوص الإنجليزية داخل الصور بدون أي منافس."
    },
    promptBlueprint: "A coffee cup on a rustic wooden table with the text 'AI PROD ZONE' written in clean latte art foam.",
    comments: []
  },
  {
    id: "comfyui-50-templates-pixaroma",
    orderIndex: 3,
    rankOrder: 3,
    youtubeId: "zrW3yO0_tlU",
    youtubeVideoId: "zrW3yO0_tlU",
    verified: true,
    runtime: "24:30",
    viewsCount: 210000,
    year: "2026",
    title: "أكثر من 50 قالب عمل جاهز لتوليد الصور في ComfyUI (Pixaroma)",
    instructor: "Pixaroma",
    category: "توليد الصور الاحترافية وسير عمل ComfyUI & Flux",
    level: "المستوى المتقدم (احترافي)",
    qualityBadge: "مكتبة القوالب الاحترافية",
    trending: false,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "ComfyUI Workflows",
    toolsSummary: "50+ Workflows • ControlNet • FaceID • Upscaling",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/zrW3yO0_tlU/maxresdefault.jpg",
    scores: { depth: 9.8, practical: 9.9, freshness: 9.8, production: 9.5 },
    techStack: [
      { role: "قوالب العمل الجاهزة", name: "50+ ComfyUI JSON Workflows" },
      { role: "أدوات التكبير الفائق", name: "Ultimate SD Upscale & SUPIR" }
    ],
    oneLineVerdict: "كنز حقيقي من قوالب العمل الجاهزة للتحميل والاستخدام الفوري لتكبير الصور وتبديل الوجوه وتثبيت الأوضاع.",
    synopsis: "المرحلة الثالثة: استعراض شامل لأكثر من 50 سير عمل متقدم يشمل Face Swap، وتكبير الصور بدقة 8K، وتطبيق ControlNet للتحكم بالوضعيات والخطوط.",
    timestamps: [
      { time: "00:00", label: "كيفية استيراد القوالب في ComfyUI بنقرة واحدة" },
      { time: "06:15", label: "قوالب تكبير الصور الفائق (Upscaling)" },
      { time: "14:40", label: "قوالب تثبيت الوجوه والشخصيات التجارية" },
      { time: "20:10", label: "قوالب تصميم المنتجات والإعلانات" }
    ],
    review: {
      verdictBox: "يختصر عليك أشهراً من المحاولة والخطأ في بناء العقد المعقدة بنفسك.",
      strengths: "قيمة عملية فورية عبر روابط تحميل مباشرة لجميع ملفات العمل.",
      limitations: "يحتاج إلى تثبيت الإضافات المفقودة عبر ComfyUI Manager.",
      deepAnalysis: "الاعتماد على قوالب مجربة ومحسنة يرفع سرعة التوليد ويقلل استهلاك الذاكرة."
    },
    promptBlueprint: "Load JSON workflow -> drag and drop into ComfyUI canvas -> auto-install missing nodes via Manager.",
    comments: []
  },

  // ==================== القسم 6: الأفاتار المتحدث واستنساخ الصوت (AI Avatars & Voice Cloning) ====================
  {
    id: "elevenlabs-avatar-official",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "nJGSQxqB59s",
    youtubeVideoId: "nJGSQxqB59s",
    verified: true,
    runtime: "11:20",
    viewsCount: 490000,
    year: "2026",
    title: "صناعة أفاتار واقعي يطابق شكلك وصوتك 100% (ElevenLabs Official)",
    instructor: "ElevenLabs Official",
    category: "الأفاتار المتحدث واستنساخ الصوت (AI Avatars & Voice Cloning)",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "الدليل الرسمي المباشر",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "ElevenLabs Avatars",
    toolsSummary: "ElevenLabs • استنساخ الصوت • Lip Sync • تفاعل فوري",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/nJGSQxqB59s/maxresdefault.jpg",
    scores: { depth: 9.8, practical: 9.7, freshness: 9.9, production: 9.8 },
    techStack: [
      { role: "استنساخ الصوت الاحترافي", name: "ElevenLabs Voice Cloning" },
      { role: "الأفاتار البصري التفاعلي", name: "ElevenLabs Conversational AI" }
    ],
    oneLineVerdict: "الشرح الرسمي لأحدث منظومة لاستنساخ الصوت البشري بدقة المشاعر وصناعة أفاتار متحدث واقعي للغاية.",
    synopsis: "تعلم الطريقة القياسية لتدريب النموذج الصوتي على نبرة صوتك بمقطع مدته دقيقة واحدة فقط، مع مزامنة حركة الشفاه وتعديل نبرات الحزن والفرح والجدية.",
    timestamps: [
      { time: "00:00", label: "مقدمة استنساخ الصوت والأفاتار" },
      { time: "03:10", label: "تسجيل العينة الصوتية ومعايير النقاء" },
      { time: "07:30", label: "توليد الحوار ومزامنة حركة الفم" }
    ],
    review: {
      verdictBox: "المرجع الرسمي الأوثق لتقنية التعليق الصوتي الأكثر واقعية في العالم.",
      strengths: "دقة استنساخ لا يمكن تمييزها عن الصوت البشري الحقيقي.",
      limitations: "الاستنساخ الفوري الاحترافي يتطلب تفعيل الاشتراك الأساسي.",
      deepAnalysis: "ElevenLabs تتفوق على الجميع في نقل أنفاس المتحدث والوقفات الطبيعية بين الجمل."
    },
    promptBlueprint: "Voice settings: Stability: 0.65, Similarity: 0.85, Style Exaggeration: 0.20, Speaker Boost: True.",
    comments: []
  },
  {
    id: "voice-cloning-heygen-julia",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "Zc2PwPuKK5c",
    youtubeVideoId: "Zc2PwPuKK5c",
    verified: true,
    runtime: "16:50",
    viewsCount: 220000,
    year: "2026",
    title: "الدليل الكامل لاستنساخ الصوت والشخصية عبر HeyGen و ElevenLabs (Julia McCoy)",
    instructor: "Julia McCoy",
    category: "الأفاتار المتحدث واستنساخ الصوت (AI Avatars & Voice Cloning)",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "بناء التوأم الرقمي المتكامل",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "HeyGen & ElevenLabs",
    toolsSummary: "HeyGen • ElevenLabs • التوأم الرقمي • القنوات الآلية",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/Zc2PwPuKK5c/maxresdefault.jpg",
    scores: { depth: 9.6, practical: 9.6, freshness: 9.7, production: 9.6 },
    techStack: [
      { role: "منصة الأفاتار الكاملة", name: "HeyGen Interactive Avatar" },
      { role: "معالجة الصوت متعدد اللغات", name: "ElevenLabs Dubbing" }
    ],
    oneLineVerdict: "كيف تبني توأمك الرقمي (Digital Twin) ليقدم الفيديوهات والمحاضرات بدلاً منك بـ 40 لغة بنقرة زر.",
    synopsis: "المرحلة الثانية: تصوير فيديو مرجعي لمدة دقيقتين ورفعه إلى HeyGen لإنشاء نسخة رقمية مطابقة لملامحك ولغة جسدك، قادرة على قراءة أي نص بصوتك.",
    timestamps: [
      { time: "00:00", label: "مفهوم التوأم الرقمي وفوائده للإنتاجية" },
      { time: "04:40", label: "إرشادات الإضاءة والتصوير لـ HeyGen" },
      { time: "11:20", label: "الترجمة والدبلجة لعدة لغات تلقائياً" }
    ],
    review: {
      verdictBox: "الحل النهائي لمن يريد تقديم محتوى يومي بدون قضاء ساعات أمام الكاميرا والإضاءة.",
      strengths: "تطبيق عملي واقعي لصانعة محتوى تدير شركتها بالتوأم الرقمي.",
      limitations: "يتطلب تصوير الفيديو المرجعي بكاميرا جيدة وخلفية ثابتة.",
      deepAnalysis: "الأفاتار الرقمي يوفر 90% من وقت تصوير الشروحات التعليمية المتكررة."
    },
    promptBlueprint: "Record 2-minute clean 4k footage looking directly at the camera, speaking naturally with varied expressions.",
    comments: []
  },

  // ==================== القسم 7: صناعة الموسيقى والهندسة الصوتية بالذكاء الاصطناعي (AI Audio & Suno) ====================
  {
    id: "suno-ai-chillpanic",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "LzJK1xaIxnY",
    youtubeVideoId: "LzJK1xaIxnY",
    verified: true,
    runtime: "15:10",
    viewsCount: 340000,
    year: "2026",
    title: "الدليل الشامل للمبتدئين في صناعة الصوتيات والموسيقى عبر Suno AI (ChillPanic)",
    instructor: "ChillPanic",
    category: "صناعة الموسيقى والهندسة الصوتية بالذكاء الاصطناعي (AI Audio & Suno)",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "أفضل شرح للمبتدئين في Suno",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "Suno AI v4",
    toolsSummary: "Suno AI • وسوم الهيكلة • مؤثرات صوتية • موسيقى حرة",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/LzJK1xaIxnY/maxresdefault.jpg",
    scores: { depth: 9.7, practical: 9.8, freshness: 9.9, production: 9.6 },
    techStack: [
      { role: "محرك الموسيقى الذكي", name: "Suno AI v4 / v3.5" },
      { role: "هيكلة الأغاني", name: "[Verse] [Chorus] [Bridge] Prompts" }
    ],
    oneLineVerdict: "أمتع وأسهل شرح لتوليد أغانٍ ومقطوعات موسيقية سينمائية كاملة بالكلمات والألحان عبر Suno مجاناً.",
    synopsis: "تعلم كيف تكتب كلمات الأغنية أو تطلب من الذكاء الاصطناعي تأليفها، واستخدام وسوم التوزيع الموسيقي لاختيار الآلات (بيانو، عود، غيتار كهربائي) ومعدل الإيقاع (BPM).",
    timestamps: [
      { time: "00:00", label: "مقدمة ثورة صناعة الموسيقى بالذكاء الاصطناعي" },
      { time: "03:50", label: "كتابة الأوامر الموسيقية وتحديد نوع اللحن" },
      { time: "09:10", label: "هيكلة الفواصل الموسيقية والصولو" },
      { time: "12:40", label: "تصدير الملفات الصوتية بجودة استوديو" }
    ],
    review: {
      verdictBox: "مدخل رائع لصناع الأفلام والبودكاست للحصول على موسيقى أصلية خالية من حقوق الملكية.",
      strengths: "أمثلة حية لأنماط مختلفة: سينمائي، لو-فاي، هيب هوب، وأوركسترا.",
      limitations: "توليد الموسيقى يحتاج لتجربة عدة تنويعات لاختيار اللحن الأجمل.",
      deepAnalysis: "Suno v4 أصبح قادراً على ضبط مخارج الحروف والتحكم بالطبقات الصوتية بدقة استثنائية."
    },
    promptBlueprint: "[Genre: Cinematic Orchestral] [Mood: Inspiring, Epic] [Instruments: French Horns, Strings, Heavy Drums, Piano build-up]",
    comments: []
  },
  {
    id: "suno-pro-structure-isa",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "5gDfWueciHA",
    youtubeVideoId: "5gDfWueciHA",
    verified: true,
    runtime: "18:25",
    viewsCount: 180000,
    year: "2026",
    title: "كيف تستخدم Suno AI كالمحترفين — شرح متقدم للهيكلة الصوتية (Isa does AI)",
    instructor: "Isa does AI",
    category: "صناعة الموسيقى والهندسة الصوتية بالذكاء الاصطناعي (AI Audio & Suno)",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "هندسة الأوامر الصوتية الاحترافية",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "Advanced Suno Prompts",
    toolsSummary: "Meta Tags • Voice Stems • Extend Feature • Remaster",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/5gDfWueciHA/maxresdefault.jpg",
    scores: { depth: 9.8, practical: 9.7, freshness: 9.8, production: 9.7 },
    techStack: [
      { role: "أوامر التحكم الصوتي المتقدمة", name: "Suno Meta Tags & Audio Extensions" },
      { role: "فصل التراكات الصوتية", name: "Stem Separation (Vocals / Instruments)" }
    ],
    oneLineVerdict: "شرح متقدم لكافة وسوم التوجيه الصوتي (Meta Tags) وتقنية تمديد اللحن وفصل صوت المغني عن الآلات.",
    synopsis: "المرحلة الثانية في مسار الصوت: إتقان وسوم [Drop]، [Bassline]، [Whisper]، [Outro Fade-out]، واستخدام خاصية التمديد (Extend) لبناء سيمفونية كاملة مدتها أكثر من 5 دقائق.",
    timestamps: [
      { time: "00:00", label: "أسرار ما وراء الكواليس في Suno" },
      { time: "05:15", label: "قاموس الـ Meta Tags الأكثر تأثيراً" },
      { time: "11:30", label: "طريقة تمديد المقطع وإتقان قفلة الأغنية" }
    ],
    review: {
      verdictBox: "ينقلك من التوليد العشوائي إلى التوزيع الموسيقي المنظم كمهندسي الصوت المحترفين.",
      strengths: "شرح معمق لكيفية التحكم في دراما اللحن وتصاعد النغمات.",
      limitations: "يحتاج إلى معرفة بسيطة بمصطلحات الموسيقى لتحقيق أقصى استفادة.",
      deepAnalysis: "التحكم في وسوم البناء والقفلة يمنع الأغنية من التكرار الرتيب أو الانقطاع المفاجئ."
    },
    promptBlueprint: "[Intro: Soft Piano] [Verse 1: Acoustic Guitar, Soft Vocals] [Chorus: Huge Drums, Strings swell, Powerful harmony] [Outro: Fade out]",
    comments: []
  },

  // ==================== القسم 8: الوكلاء الأذكياء والأتمتة بدون كود (AI Agents & n8n Automation) ====================
  {
    id: "n8n-agents-nate-herk",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "Ey18PDiaAYI",
    youtubeVideoId: "Ey18PDiaAYI",
    verified: true,
    runtime: "35:40",
    viewsCount: 580000,
    year: "2026",
    title: "كورس شامل لبناء وأتمتة وكلاء الذكاء الاصطناعي عبر n8n بدون كود (Nate Herk)",
    instructor: "Nate Herk",
    category: "الوكلاء الأذكياء والأتمتة بدون كود (AI Agents & n8n Automation)",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "الدورة العملية الأقوى في n8n",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "n8n & AI Agents",
    toolsSummary: "n8n • AI Agent Node • Webhooks • Telegram Bot",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/Ey18PDiaAYI/maxresdefault.jpg",
    scores: { depth: 9.9, practical: 9.9, freshness: 9.9, production: 9.8 },
    techStack: [
      { role: "منصة الأتمتة المفتوحة", name: "n8n Self-Hosted / Cloud" },
      { role: "عقدة الوكيل الذكي", name: "LangChain AI Agent Node" },
      { role: "قاعدة المعرفة والأدوات", name: "OpenAI / Claude API + Tools" }
    ],
    oneLineVerdict: "الدورة العملية الأقوى عالمياً لتعلم كيفية بناء وكيل ذكي ينفذ المهام نيابة عنك عبر n8n ويرد على العملاء في تيليجرام.",
    synopsis: "تعلم من الصفر بنية وكيل الذكاء الاصطناعي (AI Agent): كيف تزوده بذاكرة (Memory)، وتربطه بأدوات خارجية (Tools) كالبحث على جوجل وقراءة الجداول، وتنشر بوت أتمتة كامل.",
    timestamps: [
      { time: "00:00", label: "مفهوم وكيل الذكاء الاصطناعي ولماذا n8n هو الأفضل" },
      { time: "08:15", label: "شرح مكونات AI Agent Node والذاكرة" },
      { time: "18:30", label: "ربط الأدوات (Google Search, Calculator, Database)" },
      { time: "28:00", label: "بناء ونشر بوت تيليجرام تفاعلي متكامل" }
    ],
    review: {
      verdictBox: "الدورة الأكثر فائدة لأي شخص يريد أتمتة أعماله وتقديم خدمات الوكلاء الذكية للشركات.",
      strengths: "بناء مشروع حقيقي شغال 100% أمام المشاهد وتوفير ملفات التدفق (JSON).",
      limitations: "يتطلب مفتاح API لأحد النماذج اللغوية مثل OpenAI أو Claude.",
      deepAnalysis: "n8n يمنحك حرية كاملة ويوفر آلاف الدولارات مقارنة بـ Zapier و Make."
    },
    promptBlueprint: "You are an autonomous operations assistant. Use the search tool to verify facts before answering, and log all queries to the database.",
    comments: []
  },
  {
    id: "ai-automation-roadmap-nate",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "Fqeo8q8-nJg",
    youtubeVideoId: "Fqeo8q8-nJg",
    verified: true,
    runtime: "19:15",
    viewsCount: 290000,
    year: "2026",
    title: "خارطة طريق تعلم أتمتة الذكاء الاصطناعي من الصفر في 2026 (Nate Herk)",
    instructor: "Nate Herk",
    category: "الوكلاء الأذكياء والأتمتة بدون كود (AI Agents & n8n Automation)",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "خارطة طريق الوكالات والأتمتة",
    trending: true,
    isNewCourse: true,
    isToolGuide: false,
    isMonetization: true,
    primaryTool: "AI Automation Roadmap",
    toolsSummary: "خارطة طريق • AAA Agency • بيع خدمات الأتمتة",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/Fqeo8q8-nJg/maxresdefault.jpg",
    scores: { depth: 9.7, practical: 9.6, freshness: 9.9, production: 9.7 },
    techStack: [
      { role: "مسار التأسيس", name: "APIs, Webhooks & JSON" },
      { role: "نموذج العمل الربحي", name: "AI Automation Agency (AAA)" }
    ],
    oneLineVerdict: "خارطة طريق واضحة ومباشرة لكيفية تأسيس مهارات الأتمتة وتقديم خدمات الوكلاء للشركات وتحقيق دخل شهري مستدام.",
    synopsis: "المرحلة الثانية في مسار الأتمتة: كيف تنتقل من بناء مشاريع بسيطة إلى تصميم حلول متكاملة لإدارة علاقات العملاء (CRM)، الرد على رسائل المبيعات، وتوليد الفواتير آلياً.",
    timestamps: [
      { time: "00:00", label: "لماذا تعتبر الأتمتة المهارة الأكثر طلباً في 2026؟" },
      { time: "05:20", label: "المهارات الثلاث التي يجب أن تتقنها بالترتيب" },
      { time: "12:10", label: "كيف تسعّر خدمات الأتمتة وتجد أول عميل لك" }
    ],
    review: {
      verdictBox: "المرشد المهني الأفضل لكل من يفكر في إنشاء وكالة أتمتة بالذكاء الاصطناعي (AAA).",
      strengths: "تحديد الأولويات بدقة وتجنب التشتت بين مئات الأدوات الجديدة.",
      limitations: "تركيز استراتيجي وتجاري أكثر من كتابة الإعدادات السطرية.",
      deepAnalysis: "الشركات لا تشتري ذكاءً اصطناعياً مجرداً؛ هي تشتري حلولاً توفر وقت موظفيها وتخفض التكاليف."
    },
    promptBlueprint: "Audit this company's lead intake workflow and identify 3 high-impact automation bottlenecks that can be solved via AI agents.",
    comments: []
  },

  // ==================== القسم 9: البرمجة بالذكاء الاصطناعي وبناء التطبيقات (Vibe Coding & AI Dev) ====================
  {
    id: "vibe-coding-matt-pocock",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "-QFHIoCo-Ko",
    youtubeVideoId: "-QFHIoCo-Ko",
    verified: true,
    runtime: "17:35",
    viewsCount: 460000,
    year: "2026",
    title: "سير العمل الاحترافي للبرمجة بمساعدة وكلاء الذكاء الاصطناعي (Matt Pocock)",
    instructor: "Matt Pocock",
    category: "البرمجة بالذكاء الاصطناعي وبناء التطبيقات (Vibe Coding & AI Dev)",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "أقوى منهجية لبرمجة Vibe Coding",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: false,
    primaryTool: "Cursor & Claude 3.7",
    toolsSummary: "Cursor • Claude 3.7 • Vibe Coding • TypeScript",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/-QFHIoCo-Ko/maxresdefault.jpg",
    scores: { depth: 9.9, practical: 9.8, freshness: 9.9, production: 9.8 },
    techStack: [
      { role: "محرر الأكواد الذكي", name: "Cursor AI IDE" },
      { role: "نموذج التفكير البرمجي", name: "Claude 3.7 Sonnet (Thinking)" },
      { role: "إدارة السياق وملفات القواعد", name: ".cursorrules & System Prompts" }
    ],
    oneLineVerdict: "الشرح الأعمق لكيفية توجيه مساعدي البرمجة الذكية لبناء كود نظيف وتطبيقات سريعة بدون أخطاء متكررة.",
    synopsis: "تعلم المنهجية الصحيحة لـ Vibe Coding: كيف تعد ملفات القواعد (.cursorrules)، وتقسيم المشاكل إلى خطوات صغيرة، ومراجعة كود الذكاء الاصطناعي لضمان الأمان والأداء العالي.",
    timestamps: [
      { time: "00:00", label: "ما هو Vibe Coding وكيف تمارسه باحتراف؟" },
      { time: "04:30", label: "إعداد بيئة Cursor وملفات القواعد الصارمة" },
      { time: "10:15", label: "استراتيجية التفكير المتسلسل وإصلاح الـ Bugs" }
    ],
    review: {
      verdictBox: "يغير طريقتك في البرمجة للأبد ويضاعف سرعتك الإنتاجية 5 أضعاف على الأقل.",
      strengths: "مبني على خبرة مبرمج تيب سكريبت عالمي ويشرح الممارسات الصحيحة.",
      limitations: "يتطلب إلماماً بأساسيات تطوير الويب لفهم المخرجات ومراجعتها.",
      deepAnalysis: "الفارق بين مبرمج الذكاء الاصطناعي الناجح والفاشل هو جودة السياق الذي يوفره للنموذج."
    },
    promptBlueprint: "Read codebase rules in .cursorrules. Write modular TypeScript code with strict type safety and zero any types.",
    comments: []
  },
  {
    id: "vibe-coding-full-guide",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "KO_vCL1ZhpI",
    youtubeVideoId: "KO_vCL1ZhpI",
    verified: true,
    runtime: "22:15",
    viewsCount: 380000,
    year: "2026",
    title: "الدليل الكامل للبرمجة بالذكاء الاصطناعي Vibe Coding من الفكرة للتطبيق",
    instructor: "Vibe Coding Guide",
    category: "البرمجة بالذكاء الاصطناعي وبناء التطبيقات (Vibe Coding & AI Dev)",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "من الصفر حتى النشر على Vercel",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "Next.js & Vercel",
    toolsSummary: "Next.js 14 • Tailwind CSS • Vercel Deployment • Git",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/KO_vCL1ZhpI/maxresdefault.jpg",
    scores: { depth: 9.7, practical: 9.8, freshness: 9.9, production: 9.7 },
    techStack: [
      { role: "إطار العمل العصري", name: "Next.js 14 (App Router)" },
      { role: "منصة الاستضافة العالمية", name: "Vercel Cloud" },
      { role: "تنسيق الواجهات التفاعلية", name: "Tailwind CSS & Lucide Icons" }
    ],
    oneLineVerdict: "تطبيق عملي كامل لبناء موقع ويب متجاوب مع الوضع الداكن ونشره مجاناً على Vercel بنقرة زر.",
    synopsis: "المرحلة الثانية: رحلة بناء تطبيق كامل من الفكرة وتصميم الواجهات، اختبار الكود، وربط المشروع مع GitHub و Vercel للنشر المباشر.",
    timestamps: [
      { time: "00:00", label: "تحديد فكرة التطبيق وهيكلة المشروع" },
      { time: "06:10", label: "بناء المكونات التفاعلية بنظام Next.js" },
      { time: "14:30", label: "النشر على Vercel وربط النطاق المخصص" }
    ],
    review: {
      verdictBox: "الدليل المثالي لمن يريد تحويل أفكاره إلى منتجات برمجية حية يراها العالم.",
      strengths: "تطبيق واقعي شامل مع التركيز على النشر السحابي في Vercel.",
      limitations: "يحتاج حساب GitHub مجاني لمزامنة الكود.",
      deepAnalysis: "الجمع بين Next.js و Vercel يوفر أفضل تجربة أداء وسرعة فائقة للصفحات (Lighthouse 100%)."
    },
    promptBlueprint: "Create a responsive Next.js 14 App Router layout with dark/light mode toggle and Tailwind CSS styling.",
    comments: []
  },

  // ==================== القسم 10: النماذج المحلية وأنظمة المعرفة الذكية (Local AI & RAG Systems) ====================
  {
    id: "local-ai-agents-cole",
    orderIndex: 1,
    rankOrder: 1,
    youtubeId: "mNcXue7X8H0",
    youtubeVideoId: "mNcXue7X8H0",
    verified: true,
    runtime: "25:30",
    viewsCount: 395000,
    year: "2026",
    title: "الدليل الشامل لتشغيل الذكاء الاصطناعي محلياً وبناء الوكلاء (Cole Medin)",
    instructor: "Cole Medin",
    category: "النماذج المحلية وأنظمة المعرفة الذكية (Local AI & RAG Systems)",
    level: "المستوى التأسيسي (مبتدئ)",
    qualityBadge: "الدليل الأفضل لتشغيل الذكاء الاصطناعي محلياً",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: false,
    primaryTool: "Ollama & Local LLMs",
    toolsSummary: "Ollama • Llama 3 • DeepSeek • خصوصية 100%",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/mNcXue7X8H0/maxresdefault.jpg",
    scores: { depth: 9.8, practical: 9.8, freshness: 9.9, production: 9.8 },
    techStack: [
      { role: "محرك التشغيل المحلي", name: "Ollama / LM Studio" },
      { role: "النماذج المفتوحة", name: "Llama 3.3 & DeepSeek-R1" },
      { role: "الخصوصية والأمان", name: "100% Offline & Private" }
    ],
    oneLineVerdict: "كيف تشغل أقوى نماذج الذكاء الاصطناعي على حاسوبك الخاص مجاناً بدون إنترنت وبخصوصية تامة لبياناتك.",
    synopsis: "تعلم تثبيت Ollama، وتحميل نماذج Llama 3 و DeepSeek-R1 المشفرة كمياً، واستخدامها في الدردشة وتحليل الملفات السرية بدون إرسال أي معلومة لسيرفرات خارجية.",
    timestamps: [
      { time: "00:00", label: "لماذا يجب أن تتعلم تشغيل الذكاء الاصطناعي محلياً؟" },
      { time: "05:10", label: "تثبيت Ollama واختيار النموذج المناسب لعتاد جهازك" },
      { time: "12:45", label: "ربط النماذج المحلية بمحررات الأكواد وواجهات الويب" }
    ],
    review: {
      verdictBox: "أساس حاسم للشركات والباحثين الذين يتعاملون مع بيانات حساسة لا يمكن رفعها للسحابة.",
      strengths: "شرح تقني دقيق ومفهوم لمعايير تكميم النماذج (Quantization).",
      limitations: "سرعة التوليد تعتمد على مواصفات المعالج والذاكرة في جهازك.",
      deepAnalysis: "النماذج مفتوحة المصدر أصبحت تنافس ChatGPT-4o في معظم المهام اليومية مع صفر تكلفة."
    },
    promptBlueprint: "ollama run deepseek-r1:8b # تشغيل نموذج التفكير المنطقي مفتوح المصدر محلياً بأمر واحد",
    comments: []
  },
  {
    id: "rag-systems-cole-medin",
    orderIndex: 2,
    rankOrder: 2,
    youtubeId: "tLMViADvSNE",
    youtubeVideoId: "tLMViADvSNE",
    verified: true,
    runtime: "13:20",
    viewsCount: 310000,
    year: "2026",
    title: "شرح جميع استراتيجيات RAG وبناء قواعد المعرفة الذكية في 13 دقيقة (Cole Medin)",
    instructor: "Cole Medin",
    category: "النماذج المحلية وأنظمة المعرفة الذكية (Local AI & RAG Systems)",
    level: "المستوى التطبيقي (متوسط)",
    qualityBadge: "أشمل ملخص لمعمارية RAG",
    trending: true,
    isNewCourse: true,
    isToolGuide: true,
    isMonetization: true,
    primaryTool: "RAG & Vector DBs",
    toolsSummary: "RAG • Vector Embeddings • Semantic Search • Hybrid Search",
    featured: false,
    thumbnail: "https://i.ytimg.com/vi/tLMViADvSNE/maxresdefault.jpg",
    scores: { depth: 9.9, practical: 9.6, freshness: 9.9, production: 9.9 },
    techStack: [
      { role: "معمارية الاسترجاع", name: "Retrieval-Augmented Generation (RAG)" },
      { role: "قواعد البيانات الشعاعية", name: "ChromaDB / Pinecone / pgvector" },
      { role: "التضمين الدلالي", name: "Text Embeddings & Chunking" }
    ],
    oneLineVerdict: "الشرح الهندسي الأوضح والأسرع لفهم كيف تجعل الذكاء الاصطناعي يبحث في كتبك وملفاتك ويجيب بدقة 100%.",
    synopsis: "المرحلة الثانية في مسار الأنظمة الذكية: فك لغز أنظمة RAG، استراتيجيات تقسيم النصوص (Chunking)، التضمين الشعاعي، والبحث الهجين (Hybrid Search) لتفادي الهلوسة.",
    timestamps: [
      { time: "00:00", label: "ما هو RAG ولماذا يغير شكل قواعد البيانات؟" },
      { time: "04:15", label: "خطوات التضمين والبحث الشعاعي (Vector Search)" },
      { time: "09:30", label: "أفضل استراتيجيات تفادي الأخطاء واسترجاع الإجابات الدقيقة" }
    ],
    review: {
      verdictBox: "13 دقيقة تلخص ما تدرسه في مساقات جامعية كاملة حول أنظمة المعرفة الذكية.",
      strengths: "رسوم توضيحية فائقة الوضوح تكشف المسار الدقيق لتدفق البيانات.",
      limitations: "مركز جداً ويتطلب تركيزاً لاستيعاب كافة المفاهيم الهندسية.",
      deepAnalysis: "RAG هو العمود الفقري لأي شات بوت للشركات يريد الإجابة فقط من واقع وثائق المؤسسة."
    },
    promptBlueprint: "Given the retrieved context: [Context Documents], answer the query: [User Question]. If not found in context, state: 'Information not in database'.",
    comments: []
  }
];
