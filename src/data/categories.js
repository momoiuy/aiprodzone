// قائمة الأقسام الـ 10 التعليمية الرائدة في الذكاء الاصطناعي مرتبة من 1 إلى 10
export const SEED_CATEGORIES = [
  {
    orderIndex: 1,
    id: 'ai-filmmaking',
    name: 'صناعة الأفلام والفيديو السينمائي (AI Filmmaking)',
    shortName: 'صناعة الأفلام والفيديو',
    description: 'إخراج الأفلام والمقاطع السينمائية باستخدام أحدث نماذج الفيديو Kling و Runway و Veo 3.',
    icon: 'Video',
    badge: 'المرتبة #1',
    ebookTitle: 'دليل الإخراج السينمائي والتحكم بالكاميرا في نماذج الفيديو الذكية (Runway & Kling & Veo)'
  },
  {
    orderIndex: 2,
    id: 'prompt-engineering',
    name: 'هندسة الأوامر والتلقين المتقدم (Prompt Engineering)',
    shortName: 'هندسة الأوامر والتلقين',
    description: 'احتراف أطر صياغة الأوامر وهندسة السياق للنماذج اللغوية ChatGPT و Claude و Gemini.',
    icon: 'Cpu',
    badge: 'المرتبة #2',
    ebookTitle: 'موسوعة قوالب التلقين الاحترافية وهندسة السياق (Prompt & Context Engineering Cheat Sheet)'
  },
  {
    orderIndex: 3,
    id: 'ai-commercials',
    name: 'إنتاج الإعلانات التجارية بالذكاء الاصطناعي (AI Commercials & Ads)',
    shortName: 'الإعلانات التجارية',
    description: 'صناعة إعلانات المنتجات والمقاطع التسويقية عالية التحويل ناطقة بالعربية.',
    icon: 'Sparkles',
    badge: 'المرتبة #3',
    ebookTitle: 'دليل صناعة الإعلانات التجارية ومقاطع المنتجات عالية التحويل بالذكاء الاصطناعي'
  },
  {
    orderIndex: 4,
    id: 'ai-animation',
    name: 'الأفلام الكرتونية والقصص التعليمية المتحركة (AI Animation)',
    shortName: 'الكرتون والرسوم المتحركة',
    description: 'إنتاج أفلام الأنيميشن والقصص المصورة مع ثبات ملامح الشخصيات والدوبلاج.',
    icon: 'PlayCircle',
    badge: 'المرتبة #4',
    ebookTitle: 'كتاب ثبات الشخصيات وتحريك القصص الكرتونية بالذكاء الاصطناعي'
  },
  {
    orderIndex: 5,
    id: 'comfyui-flux',
    name: 'توليد الصور الاحترافية وسير عمل ComfyUI & Flux',
    shortName: 'توليد الصور و ComfyUI',
    description: 'احتراف بناء تدفقات العمل المتقدمة في ComfyUI واستخدام نموذج Flux لتوليد صور واقعية.',
    icon: 'Image',
    badge: 'المرتبة #5',
    ebookTitle: 'الدليل المصور لإتقان Flux و ComfyUI وتصميم الصور الواقعية'
  },
  {
    orderIndex: 6,
    id: 'ai-avatars',
    name: 'الأفاتار المتحدث واستنساخ الصوت (AI Avatars & Voice Cloning)',
    shortName: 'الأفاتار واستنساخ الصوت',
    description: 'صناعة مقدمي البرامج الافتراضيين واستنساخ نبرة الصوت والمشاعر عبر ElevenLabs و HeyGen.',
    icon: 'UserCheck',
    badge: 'المرتبة #6',
    ebookTitle: 'دليل صناعة القنوات الآلية والأفاتار المتحدث والدبلجة الاحترافية'
  },
  {
    orderIndex: 7,
    id: 'ai-audio-suno',
    name: 'صناعة الموسيقى والهندسة الصوتية بالذكاء الاصطناعي (AI Audio & Suno)',
    shortName: 'الموسيقى والصوتيات',
    description: 'تأليف المقطوعات الموسيقية والمؤثرات الصوتية للأفلام والألعاب عبر Suno AI.',
    icon: 'Music',
    badge: 'المرتبة #7',
    ebookTitle: 'قاموس أوامر الهندسة الصوتية والمؤثرات السينمائية بالذكاء الاصطناعي'
  },
  {
    orderIndex: 8,
    id: 'ai-agents-n8n',
    name: 'الوكلاء الأذكياء والأتمتة بدون كود (AI Agents & n8n Automation)',
    shortName: 'الوكلاء والأتمتة (n8n)',
    description: 'بناء وكلاء تنفيذ المهام التلقائية وربط التطبيقات وقواعد البيانات عبر n8n.',
    icon: 'Bot',
    badge: 'المرتبة #8',
    ebookTitle: 'كتاب تصميم وبناء وكلاء الأتمتة الأذكياء (n8n AI Agents Blueprint)'
  },
  {
    orderIndex: 9,
    id: 'vibe-coding',
    name: 'البرمجة بالذكاء الاصطناعي وبناء التطبيقات (Vibe Coding & AI Dev)',
    shortName: 'البرمجة بالذكاء الاصطناعي',
    description: 'تحويل الأفكار إلى مواقع وتطبيقات كاملة بنظام Vibe Coding ونشرها على Vercel.',
    icon: 'Code2',
    badge: 'المرتبة #9',
    ebookTitle: 'دليل المطور لبناء ونشر تطبيقات الويب الكاملة عبر وكلاء البرمجة و Vercel'
  },
  {
    orderIndex: 10,
    id: 'local-ai-rag',
    name: 'النماذج المحلية وأنظمة المعرفة الذكية (Local AI & RAG Systems)',
    shortName: 'النماذج المحلية و RAG',
    description: 'تشغيل النماذج مفتوحة المصدر على جهازك وبناء قواعد معرفية ذكية وأنظمة استرجاع RAG.',
    icon: 'Database',
    badge: 'المرتبة #10',
    ebookTitle: 'المعمارية العملية لأنظمة الاسترجاع المعرفي (RAG) وتشغيل النماذج الخاصة'
  }
];

export const CATEGORY_NAMES = SEED_CATEGORIES.map((c) => c.name);
