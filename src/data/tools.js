// بيانات أدوات الذكاء الاصطناعي وقائمة الفلترة الشاملة للأقسام الـ 10
export const TOOL_FILTERS = [
  "كل الأدوات والتقنيات",
  "Kling & Runway",
  "ChatGPT & Claude",
  "ComfyUI & Flux",
  "ElevenLabs & HeyGen",
  "Suno AI",
  "n8n & AI Agents",
  "Cursor & Next.js",
  "Ollama & RAG"
];

export const CURATED_AI_TOOLS = [
  {
    id: "tool-kling",
    name: "Kling AI 4.0 & Runway",
    category: "صناعة الأفلام والفيديو السينمائي (AI Filmmaking)",
    pricing: "نقاط مجانية يومية / اشتراك",
    rating: 9.8,
    url: "https://klingai.com/",
    description: "أقوى محركات توليد الفيديو السينمائي ثلاثي الأبعاد مع تحكم فائق بحركة الكاميرا والفيزياء الواقعية.",
    command: 'kling --prompt "hyperrealistic 8k cinematic shot" --camera pan'
  },
  {
    id: "tool-claude",
    name: "Claude 3.7 Sonnet & ChatGPT",
    category: "هندسة الأوامر والتلقين المتقدم (Prompt Engineering)",
    pricing: "مجاني / Pro",
    rating: 9.9,
    url: "https://claude.ai/",
    description: "النماذج الرائدة عالمياً في التفكير المنطقي، هندسة السياق المعقد، والبرمجة بالذكاء الاصطناعي.",
    command: 'curl https://api.anthropic.com/v1/messages -H "x-api-key: $KEY"'
  },
  {
    id: "tool-flux",
    name: "Flux.1 & ComfyUI",
    category: "توليد الصور الاحترافية وسير عمل ComfyUI & Flux",
    pricing: "مفتوح المصدر / مجاني",
    rating: 9.9,
    url: "https://blackforestlabs.ai/",
    description: "ثورة توليد الصور الواقعية برسم فائق الدقة للأيدي والملامح والنصوص الإنجليزية داخل الصور.",
    command: 'git clone https://github.com/comfyanonymous/ComfyUI.git'
  },
  {
    id: "tool-elevenlabs",
    name: "ElevenLabs Studio & HeyGen",
    category: "الأفاتار المتحدث واستنساخ الصوت (AI Avatars & Voice Cloning)",
    pricing: "خطة مجانية / اشتراك",
    rating: 9.8,
    url: "https://elevenlabs.io/",
    description: "المعيار الذهبي لاستنساخ الصوت البشري ونقل المشاعر وبناء الأفاتار الرقمي المتحدث بمزامنة شفاة دقيقة.",
    command: 'pip install elevenlabs && python voice_clone.py'
  },
  {
    id: "tool-suno",
    name: "Suno AI v4",
    category: "صناعة الموسيقى والهندسة الصوتية بالذكاء الاصطناعي (AI Audio & Suno)",
    pricing: "حصة مجانية يومية",
    rating: 9.7,
    url: "https://suno.com/",
    description: "توليد مقطوعات موسيقية وأغانٍ كاملة بالكلمات والآلات الموسيقية بجودة استوديو احترافية.",
    command: 'suno generate --prompt "arabic lofi chill beats" --instrumental'
  },
  {
    id: "tool-n8n",
    name: "n8n AI Agents Automation",
    category: "الوكلاء الأذكياء والأتمتة بدون كود (AI Agents & n8n Automation)",
    pricing: "مفتوح المصدر مجاني ذاتي الاستضافة",
    rating: 9.9,
    url: "https://n8n.io/",
    description: "أقوى منصة مفتوحة المصدر لبناء وكلاء أذكياء مستقلين يربطون أكثر من 500 تطبيق وقاعدة بيانات بدون كود.",
    command: 'npx n8n start --tunnel'
  },
  {
    id: "tool-vercel",
    name: "Vercel & Next.js 14",
    category: "البرمجة بالذكاء الاصطناعي وبناء التطبيقات (Vibe Coding & AI Dev)",
    pricing: "مجاني للبدء (Hobby)",
    rating: 9.9,
    url: "https://vercel.com/",
    description: "البيئة الأسرع والأكثر استقراراً في العالم لنشر تطبيقات الويب الحديثة والمشاريع المبرمجة بالذكاء الاصطناعي.",
    command: 'npx create-next-app@latest aiprodzone-app --typescript'
  },
  {
    id: "tool-ollama",
    name: "Ollama & Local RAG",
    category: "النماذج المحلية وأنظمة المعرفة الذكية (Local AI & RAG Systems)",
    pricing: "مجاني بالكامل ومفتوح المصدر",
    rating: 9.8,
    url: "https://ollama.com/",
    description: "تشغيل النماذج اللغوية محلياً على جهازك بأمان وخصوصية 100% مع ربط قواعد المعرفة الذكية RAG.",
    command: 'ollama run llama3.2:latest'
  }
];
