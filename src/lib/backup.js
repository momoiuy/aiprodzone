// محرك النسخ الاحتياطي واستعادة تقدم المتعلم (Backup & Restore JSON Engine)
// حماية تامة ضد البيانات التالفة وحقن النصوص وتجاوز السعة مع دعم كامل للغة العربية

import {
  LEARNER_STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  getRawStorageString,
  setRawStorageString
} from './storage';

export const BACKUP_VERSION = '1.0';

/**
 * توليد اسم ملف النسخ الاحتياطي بالصيغة القياسية:
 * aiprodzone-backup-YYYY-MM-DD.json
 */
export function getBackupFilename(dateInput = new Date()) {
  const d = dateInput instanceof Date && !isNaN(dateInput.getTime()) ? dateInput : new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `aiprodzone-backup-${yyyy}-${mm}-${dd}.json`;
}

/**
 * جمع محفظة بيانات المتعلم الكاملة من localStorage وتجهيزها للتصدير
 */
export function createBackupPayload() {
  const exportedAt = new Date().toISOString();

  const watchlist = getStorageItem(LEARNER_STORAGE_KEYS.WATCHLIST, [], Array.isArray);
  const completedCourses = getStorageItem(LEARNER_STORAGE_KEYS.COMPLETED, [], Array.isArray);
  const completedLessons = getStorageItem(LEARNER_STORAGE_KEYS.COMPLETED_LESSONS, {}, (v) => v && typeof v === 'object');
  const userRatings = getStorageItem(LEARNER_STORAGE_KEYS.USER_RATINGS, {}, (v) => v && typeof v === 'object');
  const customComments = getStorageItem(LEARNER_STORAGE_KEYS.CUSTOM_COMMENTS, {}, (v) => v && typeof v === 'object');
  const bookmarkedArticles = getStorageItem(LEARNER_STORAGE_KEYS.BOOKMARKED_ARTICLES, [], Array.isArray);
  const tickets = getStorageItem(LEARNER_STORAGE_KEYS.TICKETS, [], Array.isArray);
  const theme = getRawStorageString(LEARNER_STORAGE_KEYS.THEME, 'dark');

  const completedLessonsCount = Object.keys(completedLessons).filter((k) => completedLessons[k]).length;
  const customCommentsCount = Object.values(customComments).reduce(
    (acc, list) => acc + (Array.isArray(list) ? list.length : 0),
    0
  );

  return {
    version: BACKUP_VERSION,
    exportedAt,
    platform: 'AIProdZone',
    summary: {
      watchlistCount: watchlist.length,
      completedCoursesCount: completedCourses.length,
      completedLessonsCount,
      userRatingsCount: Object.keys(userRatings).length,
      customCommentsCount,
      bookmarkedArticlesCount: bookmarkedArticles.length,
      ticketsCount: tickets.length
    },
    data: {
      watchlist,
      completedCourses,
      completedLessons,
      userRatings,
      customComments,
      bookmarkedArticles,
      tickets,
      theme: theme === 'light' ? 'light' : 'dark'
    },
    // حفظ مباشر لمفاتيح التخزين لتوافق 100% مع الاستعادة
    storage: {
      [LEARNER_STORAGE_KEYS.WATCHLIST]: watchlist,
      [LEARNER_STORAGE_KEYS.COMPLETED]: completedCourses,
      [LEARNER_STORAGE_KEYS.COMPLETED_LESSONS]: completedLessons,
      [LEARNER_STORAGE_KEYS.USER_RATINGS]: userRatings,
      [LEARNER_STORAGE_KEYS.CUSTOM_COMMENTS]: customComments,
      [LEARNER_STORAGE_KEYS.BOOKMARKED_ARTICLES]: bookmarkedArticles,
      [LEARNER_STORAGE_KEYS.TICKETS]: tickets,
      [LEARNER_STORAGE_KEYS.THEME]: theme
    }
  };
}

/**
 * تنزيل فوري لملف النسخة الاحتياطية بصيغة JSON على جهاز المتعلم
 */
export function downloadBackupFile() {
  if (typeof window === 'undefined') return false;

  try {
    const payload = createBackupPayload();
    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = getBackupFilename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    return true;
  } catch (err) {
    console.error('[BackupEngine] خطأ أثناء إنشاء وتنزيل ملف النسخة الاحتياطية:', err);
    return false;
  }
}

/**
 * دالة تطهير النصوص لمنع هجمات XSS وحقن الوسوم الضارة مع الحفاظ على النص العربي
 */
function sanitizeText(value, maxLength = 2000) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // إزالة وسوم السكربت ومحتواها
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // إزالة وسوم التنسيق ومحتواها
    .replace(/<[^>]*>/g, '') // إزالة وسوم HTML
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '') // إزالة حروف التحكم غير المرئية
    .trim()
    .slice(0, maxLength);
}

/**
 * فحص وتطهير بنية ملف النسخة الاحتياطية والتأكد من أمانها بنسبة 100%
 */
export function validateAndSanitizeBackup(content) {
  if (!content) {
    return { valid: false, error: 'الملف فارغ أو لم يتم اختيار ملف صالح.' };
  }

  let parsed;
  if (typeof content === 'string') {
    try {
      parsed = JSON.parse(content);
    } catch {
      return { valid: false, error: 'الملف ليس بتنسيق JSON صالح أو يحتوي على رموز تالفة.' };
    }
  } else if (typeof content === 'object') {
    parsed = content;
  } else {
    return { valid: false, error: 'نوع بيانات النسخة الاحتياطية غير مدعوم.' };
  }

  // التحقق من أن الجذر كائن غير مصفوفة وغير فارغ
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { valid: false, error: 'بنية ملف النسخة الاحتياطية غير صالحة، يجب أن يكون كائناً برمجياً.' };
  }

  // التحقق من رقم الإصدار
  const version = typeof parsed.version === 'string' ? parsed.version : null;
  if (!version) {
    return { valid: false, error: 'رقم إصدار النسخة الاحتياطية (version) مفقود في الملف.' };
  }

  if (!version.startsWith('1.')) {
    return { valid: false, error: `إصدار النسخة الاحتياطية (${version}) غير مدعوم، المنصة تدعم الإصدار 1.x حالياً.` };
  }

  // استخراج البيانات سواء من حقل data أو storage أو من الجذر مباشرة
  const rawData = parsed.data || parsed.storage || parsed;

  // منع Prototype Pollution
  const cleanObject = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return Object.create(null);
    const safe = Object.create(null);
    for (const key of Object.keys(obj)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      safe[key] = obj[key];
    }
    return safe;
  };

  // 1. تطهير قائمة المحفوظات (Watchlist)
  const rawWatchlist = rawData.watchlist || rawData[LEARNER_STORAGE_KEYS.WATCHLIST] || [];
  const sanitizedWatchlist = Array.isArray(rawWatchlist)
    ? Array.from(new Set(rawWatchlist.filter((id) => typeof id === 'string' && id.trim().length > 0).map((id) => id.trim()))).slice(0, 2000)
    : [];

  // 2. تطهير المسارات المكتملة (Completed Courses)
  const rawCompleted = rawData.completedCourses || rawData.completed || rawData[LEARNER_STORAGE_KEYS.COMPLETED] || [];
  const sanitizedCompleted = Array.isArray(rawCompleted)
    ? Array.from(new Set(rawCompleted.filter((id) => typeof id === 'string' && id.trim().length > 0).map((id) => id.trim()))).slice(0, 2000)
    : [];

  // 3. تطهير الدروس المكتملة (Completed Lessons)
  const rawCompletedLessons = cleanObject(rawData.completedLessons || rawData[LEARNER_STORAGE_KEYS.COMPLETED_LESSONS]);
  const sanitizedCompletedLessons = Object.create(null);
  let validLessonsCount = 0;
  for (const [k, v] of Object.entries(rawCompletedLessons)) {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
    if (typeof k === 'string' && k.length > 0 && k.length <= 150 && Boolean(v)) {
      sanitizedCompletedLessons[k] = true;
      validLessonsCount++;
      if (validLessonsCount >= 10000) break; // حد أقصى للحماية من DoS
    }
  }

  // 4. تطهير تقييمات المستخدم (User Ratings)
  const rawRatings = cleanObject(rawData.userRatings || rawData[LEARNER_STORAGE_KEYS.USER_RATINGS]);
  const sanitizedRatings = {};
  for (const [courseId, ratingData] of Object.entries(rawRatings)) {
    if (typeof courseId === 'string' && ratingData && typeof ratingData === 'object') {
      const rawScores = ratingData.scores || {};
      const clampScore = (num) => {
        const n = Number(num);
        return isNaN(n) ? 0 : Math.max(0, Math.min(10, Math.round(n * 10) / 10));
      };
      sanitizedRatings[courseId] = {
        scores: {
          depth: clampScore(rawScores.depth),
          practical: clampScore(rawScores.practical),
          freshness: clampScore(rawScores.freshness),
          production: clampScore(rawScores.production)
        },
        overall: clampScore(ratingData.overall),
        editCount: Math.max(0, Math.min(100, Number(ratingData.editCount) || 0))
      };
    }
  }

  // 5. تطهير الملاحظات والتعليقات (Custom Comments)
  const rawComments = cleanObject(rawData.customComments || rawData[LEARNER_STORAGE_KEYS.CUSTOM_COMMENTS]);
  const sanitizedComments = {};
  for (const [courseId, commentsList] of Object.entries(rawComments)) {
    if (typeof courseId === 'string' && Array.isArray(commentsList)) {
      sanitizedComments[courseId] = commentsList
        .filter((c) => c && typeof c === 'object')
        .map((c) => ({
          id: c.id || Date.now(),
          user: sanitizeText(c.user || 'متعلم في AIProdZone', 100),
          role: sanitizeText(c.role || 'عضو المنصة', 100),
          time: sanitizeText(c.time || 'مستعاد', 50),
          likes: Math.max(0, Number(c.likes) || 1),
          text: sanitizeText(c.text || '', 2000)
        }))
        .filter((c) => c.text.length > 0)
        .slice(0, 100);
    }
  }

  // 6. المقالات المحفوظة (Bookmarked Articles)
  const rawBookmarks = rawData.bookmarkedArticles || rawData[LEARNER_STORAGE_KEYS.BOOKMARKED_ARTICLES] || [];
  const sanitizedBookmarks = Array.isArray(rawBookmarks)
    ? Array.from(new Set(rawBookmarks.filter((id) => typeof id === 'string' && id.trim().length > 0).map((id) => id.trim()))).slice(0, 2000)
    : [];

  // 7. تذاكر الدعم والتواصل (Tickets)
  const rawTickets = rawData.tickets || rawData[LEARNER_STORAGE_KEYS.TICKETS] || [];
  const sanitizedTickets = Array.isArray(rawTickets)
    ? rawTickets
        .filter((t) => t && typeof t === 'object')
        .map((t) => ({
          id: sanitizeText(t.id || `TICKET-${Date.now()}`, 50),
          createdAt: typeof t.createdAt === 'string' ? t.createdAt.slice(0, 50) : new Date().toISOString(),
          name: sanitizeText(t.name || '', 100),
          email: sanitizeText(t.email || '', 120),
          category: sanitizeText(t.category || 'general', 50),
          subject: sanitizeText(t.subject || 'بدون عنوان', 150),
          message: sanitizeText(t.message || '', 3000),
          status: sanitizeText(t.status || 'received', 50)
        }))
        .slice(0, 500)
    : [];

  // 8. الثيم
  const rawTheme = rawData.theme || rawData[LEARNER_STORAGE_KEYS.THEME];
  const sanitizedTheme = rawTheme === 'light' ? 'light' : 'dark';

  const summary = {
    watchlistCount: sanitizedWatchlist.length,
    completedCoursesCount: sanitizedCompleted.length,
    completedLessonsCount: Object.keys(sanitizedCompletedLessons).length,
    userRatingsCount: Object.keys(sanitizedRatings).length,
    customCommentsCount: Object.values(sanitizedComments).reduce((acc, l) => acc + l.length, 0),
    bookmarkedArticlesCount: sanitizedBookmarks.length,
    ticketsCount: sanitizedTickets.length
  };

  return {
    valid: true,
    version,
    exportedAt: parsed.exportedAt || null,
    summary,
    sanitizedData: {
      watchlist: sanitizedWatchlist,
      completedCourses: sanitizedCompleted,
      completedLessons: sanitizedCompletedLessons,
      userRatings: sanitizedRatings,
      customComments: sanitizedComments,
      bookmarkedArticles: sanitizedBookmarks,
      tickets: sanitizedTickets,
      theme: sanitizedTheme
    }
  };
}

/**
 * استعادة النسخة الاحتياطية وكتابتها في localStorage مع مزامنة الواجهة فوراً
 */
export function restoreBackup(content) {
  const validation = validateAndSanitizeBackup(content);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const { sanitizedData, summary } = validation;

  try {
    setStorageItem(LEARNER_STORAGE_KEYS.WATCHLIST, sanitizedData.watchlist);
    setStorageItem(LEARNER_STORAGE_KEYS.COMPLETED, sanitizedData.completedCourses);
    setStorageItem(LEARNER_STORAGE_KEYS.COMPLETED_LESSONS, sanitizedData.completedLessons);
    setStorageItem(LEARNER_STORAGE_KEYS.USER_RATINGS, sanitizedData.userRatings);
    setStorageItem(LEARNER_STORAGE_KEYS.CUSTOM_COMMENTS, sanitizedData.customComments);
    setStorageItem(LEARNER_STORAGE_KEYS.BOOKMARKED_ARTICLES, sanitizedData.bookmarkedArticles);
    setStorageItem(LEARNER_STORAGE_KEYS.TICKETS, sanitizedData.tickets);
    setRawStorageString(LEARNER_STORAGE_KEYS.THEME, sanitizedData.theme);

    // مزامنة فورية للواجهة عبر إرسال حدث مخصص لكافة المستمعين
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(
          new CustomEvent('aiprodzone_storage_sync', {
            detail: { source: 'backup_restore', sanitizedData, summary }
          })
        );
        window.dispatchEvent(new Event('storage'));
      } catch {
        // تجاهل
      }
    }

    return {
      success: true,
      message: 'تم استعادة النسخة الاحتياطية بنجاح وتحديث كافة بيانات التعلم.',
      summary,
      sanitizedData
    };
  } catch (err) {
    console.error('[BackupEngine] خطأ أثناء استعادة النسخة الاحتياطية:', err);
    return {
      success: false,
      error: `حدث خطأ أثناء كتابة البيانات المستعادة: ${err?.message || 'خطأ غير معروف'}`
    };
  }
}
