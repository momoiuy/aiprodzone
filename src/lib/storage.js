// دوال التعامل الآمن والمحصّن مع localStorage ضد استثناءات الحظر والتصفح الخفي وتلف الذاكرة

// مفاتيح التخزين الثابتة للبيانات التعليمية للمتعلم (Learner Data Storage Keys)
export const LEARNER_STORAGE_KEYS = {
  WATCHLIST: 'aiprodzone_watchlist',
  COMPLETED: 'aiprodzone_completed',
  COMPLETED_LESSONS: 'aiprodzone_completed_lessons_v1',
  USER_RATINGS: 'aiprodzone_user_ratings',
  CUSTOM_COMMENTS: 'aiprodzone_custom_comments',
  BOOKMARKED_ARTICLES: 'aiprodzone_bookmarked_articles',
  TICKETS: 'aiprodzone_contact_tickets_v1',
  THEME: 'aiprodzone_theme'
};

// مخزن احتياطي في الذاكرة الحية (In-Memory Fallback Store)
// لضمان استمرار عمل الواجهة بسلاسة ودون أخطاء حتى لو كان التخزين المحلي محظوراً بالكامل
const memoryStore = new Map();

/**
 * فحص آمن لإمكانية الوصول لـ localStorage دون إثارة SecurityError
 * في وضع التصفح الخفي (Safari Private Mode) أو في إطارات iframe المقيدة
 */
export function getLocalStorageSafely() {
  if (typeof window === 'undefined') return null;
  try {
    // مجرد الوصول لخاصية window.localStorage قد يثير SecurityError في بعض المتصفحات
    const storage = window.localStorage;
    return storage || null;
  } catch {
    return null;
  }
}

/**
 * فحص ما إذا كان التخزين المحلي متاحاً وقابلاً للقراءة والكتابة
 */
export function isStorageAvailable() {
  try {
    const storage = getLocalStorageSafely();
    if (!storage) return false;
    const testKey = '__aiprodzone_storage_probe__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * قراءة آمنة لعنصر مفكك من JSON مع صمام أمان ضد التلف والتحقق من النمط
 */
export function getStorageItem(key, fallback, validator) {
  if (typeof window === 'undefined') return fallback;

  try {
    const storage = getLocalStorageSafely();
    if (!storage) {
      // في حالة حظر localStorage، نعتمد على مخزن الذاكرة المؤقت
      return memoryStore.has(key) ? memoryStore.get(key) : fallback;
    }

    const raw = storage.getItem(key);
    if (raw === null) {
      return memoryStore.has(key) ? memoryStore.get(key) : fallback;
    }

    const parsed = JSON.parse(raw);
    if (typeof validator === 'function' && !validator(parsed)) {
      return fallback;
    }
    return parsed;
  } catch {
    // في حالة تلف محتوى JSON أو حدوث SecurityError، يتم إرجاع القيمة الافتراضية بأمان
    return memoryStore.has(key) ? memoryStore.get(key) : fallback;
  }
}

/**
 * حفظ آمن لعنصر كـ JSON مع حماية ضد QuotaExceededError و SecurityError
 */
export function setStorageItem(key, value) {
  if (typeof window === 'undefined') return false;

  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch {
    // كائنات تحتوي على مراجع دائرية أو قيم غير قابلة للتسلسل
    return false;
  }

  // نحفظ دائماً في مخزن الذاكرة لضمان اتساق الجلسة
  memoryStore.set(key, value);

  try {
    const storage = getLocalStorageSafely();
    if (!storage) return false;

    storage.setItem(key, serialized);

    // إشعار المكونات النشطة داخل الصفحة بتحديث البيانات
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(
          new CustomEvent('aiprodzone_storage_sync', {
            detail: { key, value, source: 'setStorageItem' }
          })
        );
      } catch {
        // تجاهل أي خطأ في بيئات الاختبار المعزولة
      }
    }

    return true;
  } catch (err) {
    // QuotaExceededError أو حظر الأذونات
    console.warn(`[SafeStorage] تعذر الحفظ في localStorage للمفتاح "${key}":`, err?.message || err);
    return false;
  }
}

/**
 * قراءة نص خام مباشرة بدون JSON.parse
 */
export function getRawStorageString(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;

  try {
    const storage = getLocalStorageSafely();
    if (!storage) {
      return memoryStore.has(key) ? String(memoryStore.get(key)) : fallback;
    }

    const val = storage.getItem(key);
    if (val === null) {
      return memoryStore.has(key) ? String(memoryStore.get(key)) : fallback;
    }
    return val;
  } catch {
    return memoryStore.has(key) ? String(memoryStore.get(key)) : fallback;
  }
}

/**
 * حفظ نص خام مباشرة
 */
export function setRawStorageString(key, value) {
  if (typeof window === 'undefined') return false;

  const strValue = String(value);
  memoryStore.set(key, strValue);

  try {
    const storage = getLocalStorageSafely();
    if (!storage) return false;

    storage.setItem(key, strValue);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(
          new CustomEvent('aiprodzone_storage_sync', {
            detail: { key, value: strValue, source: 'setRawStorageString' }
          })
        );
      } catch {
        // تجاهل
      }
    }

    return true;
  } catch (err) {
    console.warn(`[SafeStorage] تعذر حفظ النص الخام للمفتاح "${key}":`, err?.message || err);
    return false;
  }
}

/**
 * حذف عنصر بأمان من localStorage والذاكرة المؤقتة
 */
export function removeStorageItem(key) {
  memoryStore.delete(key);
  if (typeof window === 'undefined') return false;

  try {
    const storage = getLocalStorageSafely();
    if (!storage) return false;

    storage.removeItem(key);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      try {
        window.dispatchEvent(
          new CustomEvent('aiprodzone_storage_sync', {
            detail: { key, value: null, source: 'removeStorageItem' }
          })
        );
      } catch {
        // تجاهل
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * مسح المخزن الاحتياطي في الذاكرة (لأغراض الاختبار وإعادة التهيئة)
 */
export function clearMemoryFallback() {
  memoryStore.clear();
}
