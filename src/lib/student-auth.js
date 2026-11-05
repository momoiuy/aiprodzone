// @ts-nocheck
// ============================================================================
// AIProdZone Platform — Lightweight Student Registration & Portable Sync Code
// هندسة نظام حسابات المتعلمين الأكاديمية والترميز المحمول فائق الخفة (Zero-Overhead)
// ============================================================================

import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

export const STUDENT_STORAGE_KEY = 'aiprodzone_student_profile';

/**
 * التحقق من سلامة كائن الملف الشخصي للمتعلم
 * @param {any} val
 * @returns {boolean}
 */
export const isStudentProfile = (val) => {
  return (
    Boolean(val) &&
    typeof val === 'object' &&
    !Array.isArray(val) &&
    typeof val.name === 'string' &&
    val.name.trim().length > 0
  );
};

/**
 * توليد مفتاح مزامنة محمول عشوائي بشري القراءة
 * @returns {string}
 */
export function generateSyncKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const seg2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `APZ-${seg1}-${seg2}`;
}

/**
 * قراءة الملف الشخصي للمتعلم من التخزين المحلي الآمن
 * @returns {any | null}
 */
export function getSavedStudentProfile() {
  return getStorageItem(STUDENT_STORAGE_KEY, null, isStudentProfile);
}

/**
 * حفظ الملف الشخصي للمتعلم
 * @param {any} profile
 * @returns {boolean}
 */
export function saveStudentProfileToStorage(profile) {
  if (!isStudentProfile(profile)) return false;
  return setStorageItem(STUDENT_STORAGE_KEY, profile);
}

/**
 * حذف الحساب الأكاديمي المحلي للمتعلم
 */
export function clearStudentProfileFromStorage() {
  removeStorageItem(STUDENT_STORAGE_KEY);
}

/**
 * توليد كود المزامنة المحمول المشفر بـ Base64 عبر Web APIs القياسية (UTF-8 Safe)
 * @param {any} profile
 * @param {any} progressData
 * @returns {string} Base64 portable string
 */
export function encodePortableSyncCode(profile, progressData = {}) {
  try {
    const payload = {
      v: 1,
      app: 'AIProdZone',
      type: 'aiprodzone_portable_sync',
      createdAt: new Date().toISOString(),
      profile: {
        id: profile?.id || `student-${Date.now()}`,
        name: profile?.name || '',
        email: profile?.email || '',
        preferredSectorId: profile?.preferredSectorId || 'web-programming',
        preferredSectorTitle: profile?.preferredSectorTitle || 'الويب والبرمجة',
        registeredAt: profile?.registeredAt || new Date().toISOString(),
        syncKey: profile?.syncKey || generateSyncKey()
      },
      progress: {
        watchlistIds: Array.isArray(progressData?.watchlistIds) ? progressData.watchlistIds : [],
        completedIds: Array.isArray(progressData?.completedIds) ? progressData.completedIds : [],
        completedLessons: progressData?.completedLessons && typeof progressData.completedLessons === 'object' ? progressData.completedLessons : {},
        userRatings: progressData?.userRatings && typeof progressData.userRatings === 'object' ? progressData.userRatings : {},
        customComments: progressData?.customComments && typeof progressData.customComments === 'object' ? progressData.customComments : {}
      }
    };

    const jsonStr = JSON.stringify(payload);

    // ترميز UTF-8 آمن بدون أي فقدان للأحرف العربية
    if (typeof window !== 'undefined' && typeof window.btoa === 'function' && typeof TextEncoder !== 'undefined') {
      const bytes = new TextEncoder().encode(jsonStr);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    } else if (typeof Buffer !== 'undefined') {
      return Buffer.from(jsonStr, 'utf-8').toString('base64');
    } else {
      return encodeURIComponent(jsonStr);
    }
  } catch (err) {
    console.error('[StudentAuth] Failed to encode portable sync code:', err);
    return '';
  }
}

/**
 * فك تشفير وقراءة كود المزامنة المحمول واستعادة البيانات
 * @param {string} codeStr
 * @returns {{ valid: boolean, payload?: any, error?: string }}
 */
export function decodePortableSyncCode(codeStr) {
  if (!codeStr || typeof codeStr !== 'string') {
    return { valid: false, error: 'كود المزامنة فارغ أو غير صالح' };
  }

  const trimmed = codeStr.trim();
  if (trimmed.length < 10) {
    return { valid: false, error: 'كود المزامنة قصير جداً' };
  }

  try {
    let jsonStr = '';

    if (typeof window !== 'undefined' && typeof window.atob === 'function' && typeof TextDecoder !== 'undefined') {
      const binary = window.atob(trimmed);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      jsonStr = new TextDecoder('utf-8').decode(bytes);
    } else if (typeof Buffer !== 'undefined') {
      jsonStr = Buffer.from(trimmed, 'base64').toString('utf-8');
    } else {
      jsonStr = decodeURIComponent(trimmed);
    }

    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'محتوى الكود غير متوافق' };
    }

    // التحقق من نوع الكود أو وجود ملف شخصي
    if (parsed.type !== 'aiprodzone_portable_sync' && !parsed.profile) {
      // قد يكون نسخة احتياطية JSON قديمة عادية
      if (parsed.watchlist || parsed.courses || parsed.completedIds) {
        return {
          valid: true,
          payload: {
            profile: null,
            progress: {
              watchlistIds: parsed.watchlist || parsed.watchlistIds || [],
              completedIds: parsed.completedIds || parsed.completed || [],
              completedLessons: parsed.completedLessons || {},
              userRatings: parsed.userRatings || {},
              customComments: parsed.customComments || {}
            }
          }
        };
      }
      return { valid: false, error: 'صيغة كود المزامنة غير معترف بها' };
    }

    return {
      valid: true,
      payload: parsed
    };
  } catch (err) {
    return { valid: false, error: 'فشل فك تشفير الكود، يرجى التأكد من نسخه بالكامل دون نقص' };
  }
}
