// سكربت تهيئة وتغذية البيانات (Database Seeding) للأقسام الأكاديمية الـ 8 والدروس والكتب المرافقة
import { SEED_CATEGORIES } from '../src/data/categories.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { EBOOK_GUIDES } from '../src/data/ebooks.js';
import { INITIAL_ARTICLES } from '../src/data/articles.js';
import fs from 'node:fs';
import path from 'node:path';

console.log('🚀 بدء تغذية وتأكيد بيانات AIProdZone (Database Seeding)...');

// التحقق من الأقسام الأكاديمية الـ 8
console.log(`\n📂 [1/4] فحص الأقسام الأكاديمية الـ 8: ${SEED_CATEGORIES.length} أقسام مسجلة`);
SEED_CATEGORIES.forEach((cat) => {
  console.log(`   #${cat.orderIndex} - ${cat.name} (${cat.id})`);
});

// التحقق من الدورات والمسارات التعليمية
console.log(`\n🎬 [2/4] فحص المسارات التعليمية: ${INITIAL_COURSES.length} مسارات مسجلة`);
if (INITIAL_COURSES.length === 0) {
  console.log('   ✓ تم تفريغ الدورات التجريبية بنجاح. البنية نظيفة وجاهزة لاستقبال الدليل الأكاديمي الشامل.');
} else {
  const categoryCourseCounts = {};
  INITIAL_COURSES.forEach((course) => {
    categoryCourseCounts[course.category] = (categoryCourseCounts[course.category] || 0) + 1;
    if (!course.youtubeId || course.youtubeId.length !== 11) {
      console.error(`❌ خطأ في معرّف يوتيوب للدورة: ${course.id}`);
    }
  });

  for (const [catName, count] of Object.entries(categoryCourseCounts)) {
    console.log(`   ✓ ${catName}: ${count} مسارات مسجلة`);
  }
}

// التحقق من الكتب المرافقة
console.log(`\n📚 [3/4] فحص الكتب والأدلة الإلكترونية المرافقة: ${EBOOK_GUIDES.length} كتب مسجلة`);
EBOOK_GUIDES.forEach((eb) => {
  console.log(`   ✓ [القسم #${eb.sectionOrder}]: ${eb.title}`);
});

// التحقق من المقالات التقنية الشاملة
console.log(`\n📰 [4/4] فحص المقالات التقنية والأكاديمية: ${INITIAL_ARTICLES.length} مقالات مسجلة`);
INITIAL_ARTICLES.forEach((art, idx) => {
  console.log(`   ✓ [مقالة #${idx + 1}]: ${art.title} (${art.relatedCourseIds.length} مسارات مرتبطة)`);
});

// حفظ ملف إحصائيات التغذية السريعة
const seedStatus = {
  seededAt: new Date().toISOString(),
  storageKey: 'aiprodzone_courses_v8',
  categoriesStorageKey: 'aiprodzone_categories_v3',
  ebooksStorageKey: 'aiprodzone_ebooks_v6',
  articlesStorageKey: 'aiprodzone_articles_v1',
  categoriesCount: SEED_CATEGORIES.length,
  coursesCount: INITIAL_COURSES.length,
  ebooksCount: EBOOK_GUIDES.length,
  articlesCount: INITIAL_ARTICLES.length,
  categories: SEED_CATEGORIES.map((c) => ({
    orderIndex: c.orderIndex,
    id: c.id,
    name: c.name,
    lessonsCount: INITIAL_COURSES.filter((course) => course.category === c.name || course.domainId === c.id).length
  }))
};

const statusPath = path.resolve(process.cwd(), 'src/data/seed-status.json');
fs.writeFileSync(statusPath, JSON.stringify(seedStatus, null, 2), 'utf-8');

console.log(`\n✨ تم الانتهاء من Seeding بنجاح تام! تم حفظ حالة البيانات في: ${statusPath}\n`);
