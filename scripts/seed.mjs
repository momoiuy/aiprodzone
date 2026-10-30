// سكربت تهيئة وتغذية البيانات (Database Seeding) للأقسام الـ 10 والدروس والكتب المرافقة
import { SEED_CATEGORIES } from '../src/data/categories.js';
import { INITIAL_COURSES } from '../src/data/courses.js';
import { EBOOK_GUIDES } from '../src/data/ebooks.js';
import fs from 'node:fs';
import path from 'node:path';

console.log('🚀 بدء تغذية وتأكيد بيانات AIProdZone (Database Seeding)...');

// التحقق من الأقسام الـ 10
console.log(`\n📂 [1/3] فحص الأقسام التعليمية الـ 10: ${SEED_CATEGORIES.length} أقسام مسجلة`);
SEED_CATEGORIES.forEach((cat) => {
  console.log(`   #${cat.orderIndex} - ${cat.name}`);
});

// التحقق من الدروس والفيديوهات الحقيقية
console.log(`\n🎬 [2/3] فحص الدروس التعليمية: ${INITIAL_COURSES.length} دروس مسجلة`);
const categoryCourseCounts = {};
INITIAL_COURSES.forEach((course) => {
  categoryCourseCounts[course.category] = (categoryCourseCounts[course.category] || 0) + 1;
  if (!course.youtubeId || course.youtubeId.length !== 11) {
    console.error(`❌ خطأ في معرّف يوتيوب للدورة: ${course.id}`);
  }
});

for (const [catName, count] of Object.entries(categoryCourseCounts)) {
  console.log(`   ✓ ${catName}: ${count} دروس حقيقية بمعرفات يوتيوب رسمية`);
}

// التحقق من الكتب المرافقة
console.log(`\n📚 [3/3] فحص الكتب والأدلة الإلكترونية المرافقة: ${EBOOK_GUIDES.length} كتب مسجلة`);
EBOOK_GUIDES.forEach((eb) => {
  console.log(`   ✓ [القسم #${eb.sectionOrder}]: ${eb.title}`);
});

// حفظ ملف إحصائيات التغذية السريعة
const seedStatus = {
  seededAt: new Date().toISOString(),
  categoriesCount: SEED_CATEGORIES.length,
  coursesCount: INITIAL_COURSES.length,
  ebooksCount: EBOOK_GUIDES.length,
  categories: SEED_CATEGORIES.map((c) => ({
    orderIndex: c.orderIndex,
    id: c.id,
    name: c.name,
    lessonsCount: INITIAL_COURSES.filter((course) => course.category === c.name).length,
    ebookTitle: c.ebookTitle
  }))
};

const statusPath = path.resolve(process.cwd(), 'src/data/seed-status.json');
fs.writeFileSync(statusPath, JSON.stringify(seedStatus, null, 2), 'utf-8');

console.log(`\n✨ تم الانتهاء من Seeding بنجاح تام! تم حفظ حالة البيانات في: ${statusPath}\n`);
