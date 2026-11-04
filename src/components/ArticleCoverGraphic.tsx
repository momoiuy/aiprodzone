import React from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  Code2,
  CloudCog,
  Database,
  Binary,
  LineChart,
  Sparkles,
  Layers,
  LucideIcon
} from 'lucide-react';

export interface ArticleCoverProps {
  article?: {
    id?: string;
    title?: string;
    category?: string;
    tags?: string[];
    readTime?: string;
    [key: string]: any;
  };
  category?: string;
  tags?: string[];
  articleId?: string;
  variant?: 'hero' | 'card' | 'banner';
  className?: string;
}

interface DomainConfig {
  key: string;
  codePrefix: string;
  labelAr: string;
  labelEn: string;
  icon: LucideIcon;
  primaryColor: string;
  secondaryColor: string;
  accentBg: string;
  badgeBorder: string;
}

// خريطة المعرفات الأكاديمية الثابتة للمقالات التأسيسية
const ACADEMIC_CODES: Record<string, string> = {
  'article-python-guide': 'DEV-PY01',
  'article-cisco-ccna-guide': 'NET-CC01',
  'article-cybersecurity-roadmap': 'SEC-RD01',
  'article-cs-foundations': 'CS-FND01',
  'article-frontend-frameworks-comparison': 'WEB-UI02',
  'article-devops-cloud-guide': 'OPS-CL01',
  'article-ai-ml-roadmap-hesham-asem': 'AI-ML01',
  'article-powerbi-excel-analytics': 'BIZ-DA01',
  'article-backend-databases-architecture': 'DAT-BK01',
  'article-self-learning-methodology': 'CS-SL02',
  'article-leading-llms-map-2026': 'AI-LLM01',
  'article-cli-coding-agents-mcp-revolution': 'DEV-MCP01',
  'article-context-engineering-hybrid-rag': 'AI-RAG01',
  'article-ai-agents-security-zero-day': 'SEC-AGT01',
  'article-ai-video-generation-post-sora': 'AI-VID01',
  'article-modern-seo-geo-answer-engine-optimization': 'BIZ-GEO01',
  'article-tech-job-market-skills-roadmap-2026': 'AI-ROLES01',
  'article-physical-ai-custom-asics-slms-future': 'CS-PHY01'
};

// تحديد إعدادات النطاق الأكاديمي بناءً على التصنيف
function resolveDomain(categoryName?: string, tags?: string[]): DomainConfig {
  const cat = (categoryName || '').trim();
  const allTags = (tags || []).join(' ').toLowerCase();

  // 1. الذكاء الاصطناعي وعلم البيانات
  if (cat.includes('الذكاء الاصطناعي') || cat.includes('علم البيانات') || allTags.includes('ai') || allTags.includes('تعلم الآلة')) {
    return {
      key: 'ai',
      codePrefix: 'AI-DS',
      labelAr: 'الذكاء الاصطناعي وعلم البيانات',
      labelEn: 'NEURAL NETWORKS & APPLIED AI',
      icon: BrainCircuit,
      primaryColor: '#14B8A6',
      secondaryColor: '#06B6D4',
      accentBg: 'from-teal-950/90 via-slate-900/90 to-cyan-950/90',
      badgeBorder: 'border-teal-500/40'
    };
  }

  // 2. الشبكات والأمن السيبراني
  if (cat.includes('الشبكات') || cat.includes('الأمن السيبراني') || allTags.includes('security') || allTags.includes('cisco')) {
    return {
      key: 'cyber',
      codePrefix: 'SEC-NET',
      labelAr: 'الشبكات والأمن السيبراني',
      labelEn: 'CYBER SECURITY & DEFENSE TOPOLOGY',
      icon: ShieldCheck,
      primaryColor: '#10B981',
      secondaryColor: '#3B82F6',
      accentBg: 'from-slate-950/95 via-blue-950/90 to-slate-900/90',
      badgeBorder: 'border-blue-500/40'
    };
  }

  // 3. DevOps والسحابة والهندسة
  if (cat.includes('DevOps') || cat.includes('السحابة') || allTags.includes('docker') || allTags.includes('kubernetes')) {
    return {
      key: 'devops',
      codePrefix: 'OPS-CLD',
      labelAr: 'DevOps والسحابة والهندسة',
      labelEn: 'CLOUD ARCHITECTURE & CI/CD PIPELINES',
      icon: CloudCog,
      primaryColor: '#14B8A6',
      secondaryColor: '#0284C7',
      accentBg: 'from-sky-950/95 via-slate-900/90 to-teal-950/90',
      badgeBorder: 'border-sky-500/40'
    };
  }

  // 4. قواعد البيانات والخلفية
  if (cat.includes('قواعد البيانات') || cat.includes('الخلفية') || allTags.includes('backend') || allTags.includes('sql') || allTags.includes('mongodb')) {
    return {
      key: 'database',
      codePrefix: 'DAT-ENG',
      labelAr: 'قواعد البيانات والأنظمة الموزعة',
      labelEn: 'DATA ENGINE & DISTRIBUTED STORAGE',
      icon: Database,
      primaryColor: '#14B8A6',
      secondaryColor: '#F59E0B',
      accentBg: 'from-amber-950/80 via-slate-900/90 to-teal-950/90',
      badgeBorder: 'border-amber-500/40'
    };
  }

  // 5. علوم الحاسوب
  if (cat.includes('علوم الحاسوب') || allTags.includes('خوارزميات') || allTags.includes('cs50')) {
    return {
      key: 'cs',
      codePrefix: 'CS-ALGO',
      labelAr: 'علوم الحاسوب والخوارزميات',
      labelEn: 'COMPUTATIONAL ALGORITHMS & TREES',
      icon: Binary,
      primaryColor: '#14B8A6',
      secondaryColor: '#A855F7',
      accentBg: 'from-purple-950/80 via-slate-900/90 to-teal-950/90',
      badgeBorder: 'border-purple-500/40'
    };
  }

  // 6. الأعمال واللغات
  if (cat.includes('الأعمال') || cat.includes('اللغات') || allTags.includes('power bi') || allTags.includes('excel')) {
    return {
      key: 'business',
      codePrefix: 'BIZ-LNG',
      labelAr: 'ذكاء الأعمال والتحليلات',
      labelEn: 'BUSINESS ANALYTICS & STRATEGY',
      icon: LineChart,
      primaryColor: '#14B8A6',
      secondaryColor: '#84CC16',
      accentBg: 'from-emerald-950/90 via-slate-900/90 to-lime-950/80',
      badgeBorder: 'border-emerald-500/40'
    };
  }

  // 7. الويب والبرمجة (Default / Web)
  return {
    key: 'web',
    codePrefix: 'DEV-WEB',
    labelAr: 'الويب وهندسة البرمجيات',
    labelEn: 'SOFTWARE ARCHITECTURE & WEB SYSTEMS',
    icon: Code2,
    primaryColor: '#14B8A6',
    secondaryColor: '#6366F1',
    accentBg: 'from-indigo-950/90 via-slate-900/90 to-teal-950/90',
    badgeBorder: 'border-teal-500/40'
  };
}

export default function ArticleCoverGraphic({
  article,
  category,
  tags,
  articleId,
  variant = 'card',
  className = ''
}: ArticleCoverProps) {
  const currentCategory = category || article?.category || '';
  const currentTags = tags || article?.tags || [];
  const currentId = articleId || article?.id || 'article-default';

  const domain = resolveDomain(currentCategory, currentTags);
  const IconComponent = domain.icon;

  // معرف المقال الأكاديمي
  const academicCode =
    ACADEMIC_CODES[currentId] ||
    `${domain.codePrefix}-${currentId.replace(/^article-/, '').slice(0, 4).toUpperCase() || '01'}`;

  // الكلمات المفتاحية المصغرة (Tech Pills)
  const displayTags = currentTags.slice(0, variant === 'banner' ? 4 : variant === 'hero' ? 3 : 2);

  // مفاتيح فريدة لـ SVG تمنع التضارب بين البطاقات
  const uid = currentId.replace(/[^a-zA-Z0-9_-]/g, '');
  const gradId = `grad-${domain.key}-${uid}`;
  const gridPatId = `pat-${domain.key}-${uid}`;
  const glowId = `glow-${domain.key}-${uid}`;

  // أنماط الأبعاد حسب النوع
  const containerHeightClass =
    variant === 'banner'
      ? 'h-48 sm:h-56 lg:h-64'
      : variant === 'hero'
      ? 'h-44 sm:h-48'
      : 'h-36 sm:h-40';

  return (
    <div
      className={`relative w-full overflow-hidden select-none bg-slate-950 text-white ${containerHeightClass} ${className}`}
      dir="ltr"
    >
      {/* 1. طبقة الخلفية التدرجية الفاخرة */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${domain.accentBg} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
      />

      {/* 2. رسم المتجهات الهندسية التخصصية الصافية بدقة 4K وعادم شبكي صفر */}
      <svg
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        viewBox="0 0 600 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        role="img"
      >
        <defs>
          {/* التدرج اللوني الأساسي */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={domain.primaryColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={domain.secondaryColor} stopOpacity="0.4" />
          </linearGradient>

          {/* تدرج هادئ للخطوط */}
          <linearGradient id={`${gradId}-line`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={domain.primaryColor} stopOpacity="0.6" />
            <stop offset="50%" stopColor={domain.secondaryColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={domain.primaryColor} stopOpacity="0.05" />
          </linearGradient>

          {/* نمط الشبكة الهندسية الخلفية */}
          <pattern id={gridPatId} width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.75"
            />
            <circle cx="0" cy="0" r="1" fill={domain.primaryColor} fillOpacity="0.3" />
          </pattern>

          {/* فلتر التوهج النيوني للرموز والمحاور */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* شبكة البناء المعمارية */}
        <rect width="600" height="300" fill={`url(#${gridPatId})`} />

        {/* دوائر تركيز فلكية في الخلفية */}
        <circle cx="300" cy="150" r="180" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
        <circle cx="300" cy="150" r="120" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="300" cy="150" r="60" stroke={domain.primaryColor} strokeOpacity="0.15" strokeWidth="1" />

        {/* ======================================================== */}
        {/* المتجهات الهندسية الخاصة بكل نطاق أكاديمي (Domain Specific) */}
        {/* ======================================================== */}

        {/* أ. الذكاء الاصطناعي: شبكة عصبية متوهجة وتوصيلات سينابس */}
        {domain.key === 'ai' && (
          <g opacity="0.65">
            {/* روابط العصبونات (Synapses) */}
            <path d="M 60 70 C 130 70, 130 50, 200 50" stroke={`url(#${gradId})`} strokeWidth="1.2" />
            <path d="M 60 150 C 130 150, 130 110, 200 110" stroke={`url(#${gradId})`} strokeWidth="1.4" />
            <path d="M 60 150 C 130 150, 130 190, 200 190" stroke={`url(#${gradId})`} strokeWidth="1.4" />
            <path d="M 60 230 C 130 230, 130 250, 200 250" stroke={`url(#${gradId})`} strokeWidth="1.2" />

            <path d="M 200 50 C 270 50, 270 120, 300 150" stroke={domain.primaryColor} strokeOpacity="0.5" strokeWidth="1.5" />
            <path d="M 200 110 C 260 110, 270 140, 300 150" stroke={domain.primaryColor} strokeOpacity="0.7" strokeWidth="1.8" />
            <path d="M 200 190 C 260 190, 270 160, 300 150" stroke={domain.primaryColor} strokeOpacity="0.7" strokeWidth="1.8" />
            <path d="M 200 250 C 270 250, 270 180, 300 150" stroke={domain.primaryColor} strokeOpacity="0.5" strokeWidth="1.5" />

            <path d="M 300 150 C 340 150, 340 90, 400 90" stroke={`url(#${gradId})`} strokeWidth="1.5" />
            <path d="M 300 150 C 340 150, 340 210, 400 210" stroke={`url(#${gradId})`} strokeWidth="1.5" />
            <path d="M 400 90 C 470 90, 470 120, 540 120" stroke={`url(#${gradId})`} strokeWidth="1.2" />
            <path d="M 400 210 C 470 210, 470 180, 540 180" stroke={`url(#${gradId})`} strokeWidth="1.2" />

            {/* عصبونات الإدخال (Inputs) */}
            <circle cx="60" cy="70" r="4" fill={domain.primaryColor} />
            <circle cx="60" cy="150" r="5" fill={domain.primaryColor} />
            <circle cx="60" cy="230" r="4" fill={domain.primaryColor} />

            {/* عصبونات الطبقة الخفية (Hidden Layer) */}
            <circle cx="200" cy="50" r="4.5" fill={domain.secondaryColor} />
            <circle cx="200" cy="110" r="5" fill={domain.secondaryColor} />
            <circle cx="200" cy="190" r="5" fill={domain.secondaryColor} />
            <circle cx="200" cy="250" r="4.5" fill={domain.secondaryColor} />

            {/* نواة الانتباه المركزية المتوهجة (Attention Core) */}
            <circle cx="300" cy="150" r="14" fill="none" stroke={domain.primaryColor} strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="300" cy="150" r="7" fill={domain.primaryColor} filter={`url(#${glowId})`} />

            {/* عصبونات الإخراج (Outputs) */}
            <circle cx="400" cy="90" r="5" fill={domain.secondaryColor} />
            <circle cx="400" cy="210" r="5" fill={domain.secondaryColor} />
            <circle cx="540" cy="120" r="4.5" fill={domain.primaryColor} />
            <circle cx="540" cy="180" r="4.5" fill={domain.primaryColor} />

            {/* معادلة رياضية مصغرة */}
            <text x="70" y="275" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="monospace">
              softmax(Q·K^T / √d_k) · V
            </text>
          </g>
        )}

        {/* ب. الشبكات والأمن: مصفوفة تشفير سداسية ودرع سيبراني */}
        {domain.key === 'cyber' && (
          <g opacity="0.65">
            {/* خلايا سداسية سيبرانية (Hexagonal Cyber Mesh) */}
            <polygon points="120,60 145,75 145,105 120,120 95,105 95,75" stroke={domain.secondaryColor} strokeWidth="1" fill="none" opacity="0.4" />
            <polygon points="170,90 195,105 195,135 170,150 145,135 145,105" stroke={domain.primaryColor} strokeWidth="1.2" fill="none" opacity="0.6" />
            <polygon points="120,120 145,135 145,165 120,180 95,165 95,135" stroke={domain.secondaryColor} strokeWidth="1" fill="none" opacity="0.4" />
            <polygon points="70,90 95,105 95,135 70,150 45,135 45,105" stroke={domain.secondaryColor} strokeWidth="1" fill="none" opacity="0.3" />

            <polygon points="480,60 505,75 505,105 480,120 455,105 455,75" stroke={domain.secondaryColor} strokeWidth="1" fill="none" opacity="0.4" />
            <polygon points="430,90 455,105 455,135 430,150 405,135 405,105" stroke={domain.primaryColor} strokeWidth="1.2" fill="none" opacity="0.6" />
            <polygon points="480,120 505,135 505,165 480,180 455,165 455,135" stroke={domain.secondaryColor} strokeWidth="1" fill="none" opacity="0.4" />

            {/* درع دفاعي رقمي في المركز */}
            <path
              d="M 300 85 L 365 105 L 365 165 C 365 210, 300 235, 300 235 C 300 235, 235 210, 235 165 L 235 105 Z"
              stroke={`url(#${gradId})`}
              strokeWidth="1.8"
              fill="rgba(16, 185, 129, 0.04)"
            />
            <path
              d="M 300 100 L 350 115 L 350 162 C 350 198, 300 218, 300 218 C 300 218, 250 198, 250 162 L 250 115 Z"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
              strokeDasharray="4 4"
              fill="none"
            />

            {/* دوائر رادار ومؤشرات تشفير */}
            <line x1="300" y1="50" x2="300" y2="250" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="180" y1="150" x2="420" y2="150" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="2 4" />

            <text x="470" y="275" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="monospace">
              AES-256-GCM / TLS 1.3
            </text>
          </g>
        )}

        {/* ج. الويب والبرمجة: نافذة كود هندسية وأقواس برمجية */}
        {domain.key === 'web' && (
          <g opacity="0.65">
            {/* نافذة محرر الأكواد (Code Architecture Blueprint) */}
            <rect x="70" y="45" width="460" height="210" rx="10" stroke={`url(#${gradId})`} strokeWidth="1.5" fill="rgba(15, 23, 42, 0.3)" />
            {/* شريط العنوان وأزرار النافذة الثلاثة */}
            <line x1="70" y1="78" x2="530" y2="78" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
            <circle cx="92" cy="62" r="3.5" fill="#EF4444" opacity="0.7" />
            <circle cx="106" cy="62" r="3.5" fill="#F59E0B" opacity="0.7" />
            <circle cx="120" cy="62" r="3.5" fill="#10B981" opacity="0.7" />
            <text x="140" y="66" fill="rgba(255, 255, 255, 0.35)" fontSize="9" fontFamily="monospace">
              app/architecture.tsx — Next.js 14 SSG
            </text>

            {/* أسطر الكود الهندسية */}
            <line x1="95" y1="102" x2="210" y2="102" stroke={domain.primaryColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <line x1="120" y1="122" x2="280" y2="122" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="2" strokeLinecap="round" />
            <line x1="140" y1="142" x2="330" y2="142" stroke={domain.secondaryColor} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <line x1="140" y1="162" x2="250" y2="162" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" strokeLinecap="round" />
            <line x1="120" y1="182" x2="380" y2="182" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="2" strokeLinecap="round" />
            <line x1="95" y1="202" x2="160" y2="202" stroke={domain.primaryColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

            {/* أقواس برمجية هندسية كبيرة في الخلفية */}
            <text x="410" y="185" fill={domain.secondaryColor} fillOpacity="0.12" fontSize="90" fontFamily="monospace" fontWeight="bold">
              {'{ }'}
            </text>
            <text x="440" y="240" fill={domain.primaryColor} fillOpacity="0.10" fontSize="70" fontFamily="monospace" fontWeight="bold">
              {'</>'}
            </text>
          </g>
        )}

        {/* د. DevOps والسحابة: مسار أنابيب CI/CD وحاويات متصلة */}
        {domain.key === 'devops' && (
          <g opacity="0.65">
            {/* خط أنابيب رئيسي أفقي (Pipeline Track) */}
            <line x1="70" y1="150" x2="530" y2="150" stroke={`url(#${gradId}-line)`} strokeWidth="2" strokeDasharray="6 4" />

            {/* محطات ومراحل الأنابيب (Pipeline Stages) */}
            {/* 1. Build */}
            <rect x="90" y="130" width="70" height="40" rx="8" stroke={domain.primaryColor} strokeWidth="1.4" fill="rgba(2, 132, 199, 0.15)" />
            <text x="125" y="154" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BUILD</text>

            <line x1="160" y1="150" x2="210" y2="150" stroke={domain.primaryColor} strokeWidth="1.8" />
            <polygon points="208,147 215,150 208,153" fill={domain.primaryColor} />

            {/* 2. Test */}
            <rect x="215" y="130" width="70" height="40" rx="8" stroke={domain.secondaryColor} strokeWidth="1.4" fill="rgba(2, 132, 199, 0.15)" />
            <text x="250" y="154" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TEST</text>

            <line x1="285" y1="150" x2="335" y2="150" stroke={domain.secondaryColor} strokeWidth="1.8" />
            <polygon points="333,147 340,150 333,153" fill={domain.secondaryColor} />

            {/* 3. Docker */}
            <rect x="340" y="130" width="70" height="40" rx="8" stroke={domain.primaryColor} strokeWidth="1.4" fill="rgba(2, 132, 199, 0.15)" />
            <text x="375" y="154" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DOCKER</text>

            <line x1="410" y1="150" x2="460" y2="150" stroke={domain.primaryColor} strokeWidth="1.8" />
            <polygon points="458,147 465,150 458,153" fill={domain.primaryColor} />

            {/* 4. Deploy */}
            <rect x="465" y="130" width="70" height="40" rx="8" stroke={domain.secondaryColor} strokeWidth="1.4" fill="rgba(2, 132, 199, 0.15)" />
            <text x="500" y="154" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DEPLOY</text>

            {/* سحابة علوية هندسية */}
            <path
              d="M 270 95 C 270 80, 290 70, 310 75 C 325 65, 345 70, 355 85 C 370 85, 380 95, 375 110 L 265 110 C 255 105, 260 95, 270 95 Z"
              stroke={domain.primaryColor}
              strokeWidth="1.2"
              fill="none"
              opacity="0.4"
            />
            {/* موجات المراقبة السفلية */}
            <path
              d="M 100 230 Q 150 200, 200 230 T 300 230 T 400 230 T 500 230"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              fill="none"
            />
          </g>
        )}

        {/* هـ. قواعد البيانات والخلفية: طبقات بيانات وتدفقات استعلام */}
        {domain.key === 'database' && (
          <g opacity="0.65">
            {/* أسطوانات قواعد البيانات المتراصة (Stacked Cylinders) */}
            {/* طبقة 1: Cache (Redis) */}
            <ellipse cx="170" cy="85" rx="55" ry="16" stroke={domain.secondaryColor} strokeWidth="1.5" fill="rgba(245, 158, 11, 0.1)" />
            <path d="M 115 85 L 115 115 A 55 16 0 0 0 225 115 L 225 85" stroke={domain.secondaryColor} strokeWidth="1.5" fill="none" />
            <text x="170" y="105" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">IN-MEMORY CACHE</text>

            {/* طبقة 2: Relational (PostgreSQL) */}
            <ellipse cx="170" cy="140" rx="55" ry="16" stroke={domain.primaryColor} strokeWidth="1.5" fill="rgba(20, 184, 166, 0.15)" />
            <path d="M 115 140 L 115 170 A 55 16 0 0 0 225 170 L 225 140" stroke={domain.primaryColor} strokeWidth="1.5" fill="none" />
            <text x="170" y="160" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">SQL ACID STORE</text>

            {/* طبقة 3: Cluster (Distributed Shards) */}
            <ellipse cx="170" cy="195" rx="55" ry="16" stroke={domain.secondaryColor} strokeWidth="1.5" fill="rgba(245, 158, 11, 0.1)" />
            <path d="M 115 195 L 115 225 A 55 16 0 0 0 225 225 L 225 195" stroke={domain.secondaryColor} strokeWidth="1.5" fill="none" />
            <text x="170" y="215" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle">SHARDED REPLICA</text>

            {/* تدفقات الاستعلام والتوزيع (Query Streams) */}
            <path d="M 235 100 C 300 100, 320 145, 390 145" stroke={`url(#${gradId})`} strokeWidth="1.8" fill="none" strokeDasharray="5 3" />
            <path d="M 235 155 C 300 155, 320 155, 390 155" stroke={`url(#${gradId})`} strokeWidth="1.8" fill="none" />
            <path d="M 235 210 C 300 210, 320 165, 390 165" stroke={`url(#${gradId})`} strokeWidth="1.8" fill="none" strokeDasharray="5 3" />

            {/* مخطط جدول العلاقات على اليمين */}
            <rect x="400" y="90" width="130" height="120" rx="6" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" fill="rgba(15, 23, 42, 0.4)" />
            <line x1="400" y1="115" x2="530" y2="115" stroke={domain.primaryColor} strokeWidth="1.2" />
            <text x="410" y="108" fill={domain.primaryColor} fontSize="9" fontFamily="monospace" fontWeight="bold">schema_models</text>
            <text x="410" y="132" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="monospace">id: UUID [PK]</text>
            <text x="410" y="150" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">tenant_id: UUID [FK]</text>
            <text x="410" y="168" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">metadata: JSONB</text>
            <text x="410" y="186" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">created_at: TIMESTAMP</text>
          </g>
        )}

        {/* و. علوم الحاسوب: شجرة خوارزميات ومسارات منطقية */}
        {domain.key === 'cs' && (
          <g opacity="0.65">
            {/* مسارات شجرة البيانات الثنائية (Binary Tree) */}
            {/* الجذر (Root) */}
            <line x1="300" y1="70" x2="200" y2="125" stroke={`url(#${gradId})`} strokeWidth="1.5" />
            <line x1="300" y1="70" x2="400" y2="125" stroke={`url(#${gradId})`} strokeWidth="1.5" />

            {/* المستوى الثاني */}
            <line x1="200" y1="125" x2="140" y2="185" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" />
            <line x1="200" y1="125" x2="245" y2="185" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" />
            <line x1="400" y1="125" x2="355" y2="185" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" />
            <line x1="400" y1="125" x2="460" y2="185" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" />

            {/* عقد الشجرة (Tree Nodes) */}
            <circle cx="300" cy="70" r="14" fill="rgba(15, 23, 42, 0.8)" stroke={domain.primaryColor} strokeWidth="1.8" />
            <text x="300" y="74" fill="#FFFFFF" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ROOT</text>

            <circle cx="200" cy="125" r="11" fill="rgba(15, 23, 42, 0.8)" stroke={domain.secondaryColor} strokeWidth="1.4" />
            <text x="200" y="128" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle">L1</text>

            <circle cx="400" cy="125" r="11" fill="rgba(15, 23, 42, 0.8)" stroke={domain.secondaryColor} strokeWidth="1.4" />
            <text x="400" y="128" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle">R1</text>

            <circle cx="140" cy="185" r="8" fill={domain.primaryColor} opacity="0.8" />
            <circle cx="245" cy="185" r="8" fill={domain.secondaryColor} opacity="0.8" />
            <circle cx="355" cy="185" r="8" fill={domain.secondaryColor} opacity="0.8" />
            <circle cx="460" cy="185" r="8" fill={domain.primaryColor} opacity="0.8" />

            {/* مصفوفة البتات الثنائية (Binary Streams) */}
            <text x="70" y="260" fill="rgba(255, 255, 255, 0.15)" fontSize="11" fontFamily="monospace">
              01000001 01011001 01010000 01110010 01101111 01100100
            </text>
            {/* مؤشر التعقيد الخوارزمي Big-O */}
            <text x="460" y="85" fill={domain.primaryColor} fontSize="12" fontFamily="monospace" fontWeight="bold">
              O(n log n)
            </text>
          </g>
        )}

        {/* ز. الأعمال واللغات: مؤشرات نمو وأعمدة بيانية */}
        {domain.key === 'business' && (
          <g opacity="0.65">
            {/* شبكة إحداثيات ومحاور (Analytics Axes) */}
            <line x1="90" y1="70" x2="90" y2="230" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
            <line x1="90" y1="230" x2="520" y2="230" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />

            {/* خطوط شبكة أفقية خفيفة */}
            <line x1="90" y1="180" x2="520" y2="180" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="90" y1="130" x2="520" y2="130" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="90" y1="80" x2="520" y2="80" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="3 3" />

            {/* أعمدة الهيستوجرام التصاعدية (Bar Charts) */}
            <rect x="130" y="170" width="28" height="60" rx="3" fill="rgba(20, 184, 166, 0.3)" />
            <rect x="180" y="145" width="28" height="85" rx="3" fill="rgba(20, 184, 166, 0.45)" />
            <rect x="230" y="115" width="28" height="115" rx="3" fill="rgba(132, 204, 22, 0.4)" />
            <rect x="280" y="90" width="28" height="140" rx="3" fill="rgba(132, 204, 22, 0.55)" />

            {/* منحنى النمو الاستراتيجي (Upward Growth Curve) */}
            <path
              d="M 90 220 C 180 210, 240 140, 330 110 S 440 60, 510 50"
              stroke={`url(#${gradId})`}
              strokeWidth="2.5"
              fill="none"
            />
            {/* تظليل التدرج تحت المنحنى */}
            <path
              d="M 90 220 C 180 210, 240 140, 330 110 S 440 60, 510 50 L 510 230 L 90 230 Z"
              fill={`url(#${gradId})`}
              opacity="0.1"
            />

            {/* عقدة الإنجاز النهائية المتوهجة */}
            <circle cx="510" cy="50" r="6" fill={domain.primaryColor} filter={`url(#${glowId})`} />
            <circle cx="510" cy="50" r="14" stroke={domain.primaryColor} strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

            <text x="440" y="38" fill={domain.primaryColor} fontSize="11" fontFamily="monospace" fontWeight="bold">
              +142% KPI
            </text>
          </g>
        )}
      </svg>

      {/* 3. الإطار الضوئي والميدالية المركزية الرمزية (Focal Medallion) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center">
          {/* حلقة التوهج المحيطية */}
          <div
            className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-teal-500/10 dark:bg-teal-500/15 blur-md"
            style={{ backgroundColor: `${domain.primaryColor}20` }}
          />

          {/* وسام الأيقونة المركزية الزجاجي */}
          <div
            className={`relative flex items-center justify-center rounded-2xl p-2.5 sm:p-3 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border ${domain.badgeBorder} shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <IconComponent
              className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300"
              style={{ color: domain.primaryColor }}
              strokeWidth={2.2}
            />
          </div>
        </div>
      </div>

      {/* 4. الطبقة العلوية: الشارة الأكاديمية والرمز التقني للمقال */}
      <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between gap-2 pointer-events-none z-10">
        {/* الشارة الأكاديمية ورمز المقال الفريد */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: domain.primaryColor }} />
          <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-teal-400">
            {academicCode}
          </span>
        </div>

        {/* تسمية النطاق المصغرة في الزاوية المقابلة */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/80">
          <Sparkles className="w-2.5 h-2.5 text-teal-400" />
          <span className="hidden sm:inline">{domain.labelAr}</span>
          <span className="sm:hidden font-mono">{domain.codePrefix}</span>
        </div>
      </div>

      {/* 5. الطبقة السفلية: شريط الكلمات المفتاحية (Tech Pills) */}
      {displayTags.length > 0 && (
        <div className="absolute bottom-2.5 inset-x-2.5 sm:bottom-3 sm:inset-x-3 flex items-center justify-between gap-1.5 pointer-events-none z-10">
          <div className="flex items-center gap-1 flex-wrap overflow-hidden max-w-[85%]">
            {displayTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono font-bold bg-black/55 text-white/90 border border-white/10 backdrop-blur-md whitespace-nowrap shadow-xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* مؤشر دقة المتجهات */}
          <span className="text-[8px] font-mono text-white/40 tracking-widest hidden sm:inline-block">
            VECTOR 4K
          </span>
        </div>
      )}

      {/* 6. حدود دقيقة فاخرة داخلية */}
      <div className="absolute inset-0 rounded-[inherit] border border-white/10 pointer-events-none" />
    </div>
  );
}
