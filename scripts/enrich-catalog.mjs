import fs from 'fs';
import path from 'path';

const catalogPath = path.resolve('src/data/bimo-catalog.json');
const rawCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const psSlugs = [
  '100-premium-photoshop-text--style-effects',
  '700-gb-ultimate-graphic-bundle',
  'capcut-ultimate-video-editing-pack',
  'digital-fire-png-overlays-transparent-fire-clipart'
];

const themeMap = {
  'food-restaurants': { ar: 'مطاعم وأغذية وزراعة', en: 'Food & Restaurants', keywords: ['bigburger', 'chocof', 'black-ash', 'broccoli', 'naturio', 'honifarm', 'baketale', 'carne', 'agrikon', 'kaffen', 'greenmart', 'agrul', 'agricola'] },
  'sports-travel': { ar: 'رياضة وسياحة وسفر', en: 'Sports & Travel', keywords: ['ophelia', 'travelo', 'travele', 'adventure-tours', 'travel-trek', 'gps-vehicle', 'travenu', 'seagale', 'himara', 'royalpalace', 'ecab', 'runclub', 'quanca', 'zoomie'] },
  'fashion-beauty': { ar: 'أزياء وجمال وموضة', en: 'Fashion & Beauty', keywords: ['toybox', 'doris', 'royal-mega', 'fixar', 'fashionable', 'ecolife', 'menoa', 'seruni', 'apparelix', 'knirpse', 'sociomarketing', 'kate'] },
  'home-family': { ar: 'ديكور وعقارات ومنزل', en: 'Home & Family', keywords: ['windco', 'homestore', 'reland', 'wd--', 'toria', 'virtuary', 'kleaning', 'cheeky', 'luxas', 'joga', 'little-people', 'elder-care'] },
  'business-service': { ar: 'شركات وخدمات وأعمال', en: 'Business & Service', keywords: ['xstore', 'arka-host', 'divi', 'porto', 'astra', 'electro', 'rehub', 'woodmart', 'safzon', 'proguards', 'courtia', 'security-responsive', 'booms'] },
  'design-photography': { ar: 'تصميم وفوتوغرافيا', en: 'Design & Photography', keywords: ['lumise', 'fancy-product', 'inner--', 'madesign', 'deco-furniture', 'archi--', 'salient', 'kanawa', 'foturo', 'crope', 'dexfly', 'multitenancy', 'charitify', 'dride', 'imami'] }
};

const pluginMap = {
  'ecommerce-business': { ar: 'تجارة ومتاجر إلكترونية', en: 'eCommerce & Business', keywords: ['woocommerce-photo-reviews', 'dokan-pro-business', 'cartflows-pro', 'woocommerce-name-your-price', 'ultimate-membership-pro', 'service-finder'] },
  'seo-security': { ar: 'حماية وسيو وأداء', en: 'SEO & Security', keywords: ['wordfence-security', 'allinone-wp-migration', 'rank-math-seo', 'generatepress-premium'] },
  'design-media': { ar: 'تصميم وتفاعل وسائط', en: 'Design & Media', keywords: ['reald-flipbook'] }
};

const updatedCatalog = rawCatalog.map((item, index) => {
  const clean = { ...item };
  clean.orderIndex = index + 1;
  clean.sectionOrder = index + 11;
  clean.tag = clean.badge || clean.categoryNameEn || 'حزمة سحابية';
  clean.author = clean.provider || 'Bimocode Vault';
  clean.pages = clean.fileType || 'محتوى سحابي مباشر';
  clean.readTime = clean.hasDirectDownload ? 'تحميل سحابي فوري' : 'وصول مباشر';
  clean.date = 'إصدار 2025/2026';
  clean.content = (clean.excerpt || clean.title) + '\n\n• رابط التحميل السحابي المباشر متاح بصفر بايت وبصفر حمل على السيرفر.\n• ملف ومحتوى رقمي معتمد تم فحصه والتحقق من صلاحية وصوله المباشر.\n• متوافق مع كافة بيئات العمل والتطبيقات ذات الصلة.';

  if (clean.category === 'adobe') {
    if (psSlugs.includes(clean.slug)) {
      clean.subcategory = 'photo-shop';
      clean.subcategoryName = 'Photo Shop';
      clean.subcategoryNameAr = 'فوتوشوب وتصاميم';
    } else {
      clean.subcategory = 'after-effects';
      clean.subcategoryName = 'After Effects';
      clean.subcategoryNameAr = 'أفتر إفكتس ومونتاج';
    }
  } else if (clean.category === 'theme') {
    let foundKey = 'business-service';
    for (const [key, data] of Object.entries(themeMap)) {
      if (data.keywords.some(k => clean.slug.toLowerCase().includes(k))) {
        foundKey = key;
        break;
      }
    }
    clean.subcategory = foundKey;
    clean.subcategoryName = themeMap[foundKey].en;
    clean.subcategoryNameAr = themeMap[foundKey].ar;
  } else if (clean.category === 'plugin') {
    let foundKey = 'ecommerce-business';
    for (const [key, data] of Object.entries(pluginMap)) {
      if (data.keywords.some(k => clean.slug.toLowerCase().includes(k))) {
        foundKey = key;
        break;
      }
    }
    clean.subcategory = foundKey;
    clean.subcategoryName = pluginMap[foundKey].en;
    clean.subcategoryNameAr = pluginMap[foundKey].ar;
  } else {
    clean.subcategory = null;
    clean.subcategoryName = null;
    clean.subcategoryNameAr = null;
  }

  return clean;
});

fs.writeFileSync(catalogPath, JSON.stringify(updatedCatalog, null, 2), 'utf8');

const jsContent = `// الفهرس السحابي الشامل لمكتبة Bimocode المفحوصة والمحدثة 2026 (Zero Local Load)
export const BIMO_CATEGORIES = [
  {
    id: 'all',
    name: 'كافة المواد الرقمية',
    nameEn: 'All',
    icon: 'Layers',
    badge: '114 مادة',
    hasSub: false
  },
  {
    id: 'tracks',
    name: 'أدلة المسارات الـ 10 الحصرية',
    nameEn: 'Tracks',
    icon: 'GraduationCap',
    badge: '10 أدلة',
    hasSub: false
  },
  {
    id: 'ebook',
    name: 'الكتب والأدلة الرقمية',
    nameEn: 'Ebook',
    icon: 'BookOpen',
    badge: '40 كتاباً',
    hasSub: false
  },
  {
    id: 'software',
    name: 'البرمجيات وأنظمة SaaS',
    nameEn: 'Software',
    icon: 'Terminal',
    badge: '1 أنظمة',
    hasSub: false
  },
  {
    id: 'stickers',
    name: 'الملصقات والتصاميم الرقمية',
    nameEn: 'Stickers',
    icon: 'Sparkles',
    badge: '7 حزم',
    hasSub: false
  },
  {
    id: 'adobe',
    name: 'حزم ومؤثرات أدوبي',
    nameEn: 'Adobe',
    icon: 'Video',
    badge: '9 حزم',
    hasSub: true,
    subcategories: [
      { id: 'photo-shop', name: 'فوتوشوب وتصاميم', nameEn: 'Photo Shop' },
      { id: 'after-effects', name: 'أفتر إفكتس ومونتاج', nameEn: 'After Effects' }
    ]
  },
  {
    id: 'theme',
    name: 'قوالب وثيمات المواقع',
    nameEn: 'Theme',
    icon: 'Layout',
    badge: '36 قالباً',
    hasSub: true,
    subcategories: [
      { id: 'food-restaurants', name: 'مطاعم وأغذية وزراعة', nameEn: 'Food & Restaurants' },
      { id: 'sports-travel', name: 'رياضة وسياحة وسفر', nameEn: 'Sports & Travel' },
      { id: 'business-service', name: 'شركات وخدمات وأعمال', nameEn: 'Business & Service' },
      { id: 'design-photography', name: 'تصميم وفوتوغرافيا', nameEn: 'Design & Photography' },
      { id: 'home-family', name: 'ديكور وعقارات ومنزل', nameEn: 'Home & Family' },
      { id: 'fashion-beauty', name: 'أزياء وجمال وموضة', nameEn: 'Fashion & Beauty' }
    ]
  },
  {
    id: 'plugin',
    name: 'الإضافات والسكربتات',
    nameEn: 'Plugin',
    icon: 'Puzzle',
    badge: '11 إضافة',
    hasSub: true,
    subcategories: [
      { id: 'ecommerce-business', name: 'تجارة ومتاجر إلكترونية', nameEn: 'eCommerce & Business' },
      { id: 'seo-security', name: 'حماية وسيو وأداء', nameEn: 'SEO & Security' },
      { id: 'design-media', name: 'تصميم وتفاعل وسائط', nameEn: 'Design & Media' }
    ]
  }
];

export const BIMO_CATALOG = ` + JSON.stringify(updatedCatalog, null, 2) + `;\n`;

const jsPath = path.resolve('src/data/bimo-catalog.js');
fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Successfully written enriched bimo-catalog.js and bimo-catalog.json!');
