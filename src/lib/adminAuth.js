/**
 * وحدة التحقق والتأمين المشفر للوحة تحكم مالك المنصة
 * AIProdZone Admin Auth & Master PIN Security Module
 * مع حماية SHA-256 وجلسات منفصلة تماماً عن محفظة الطالب
 */

export const DEFAULT_ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || 'AIPROD-2026-OWNER';

export const ADMIN_STORAGE_KEYS = {
  SESSION_AUTH: 'aiprodzone_admin_session_auth',
  PIN_HASH: 'aiprodzone_admin_pin_hash'
};

/**
 * حساب تشفير SHA-256 للنصوص عبر Web Crypto API بدون أي مكتبات خارجية
 * @param {string} text
 * @returns {Promise<string>}
 */
export async function computeSha256(text) {
  const normalized = String(text || '');
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return '';
}

/**
 * التحقق من رمز مرور المشرف المدخل
 * يطابق الهاش المخصص في localStorage إن وجد، أو الرمز الافتراضي من البيئة
 * @param {string} enteredPin
 * @returns {Promise<boolean>}
 */
export async function verifyAdminPin(enteredPin) {
  const trimmed = String(enteredPin || '').trim();
  if (!trimmed) return false;

  try {
    if (typeof localStorage !== 'undefined') {
      const customHash = localStorage.getItem(ADMIN_STORAGE_KEYS.PIN_HASH);
      if (customHash) {
        const enteredHash = await computeSha256(trimmed);
        return enteredHash === customHash;
      }
    }
  } catch {
    // في حال تعذر الوصول إلى التخزين المحلي
  }

  return trimmed === DEFAULT_ADMIN_PIN;
}

/**
 * تغيير رمز مرور المشرف وحفظه بالهاش SHA-256
 * @param {string} newPin
 * @returns {Promise<string>} الهاش المشفر
 */
export async function setCustomAdminPin(newPin) {
  const trimmed = String(newPin || '').trim();
  if (!trimmed || trimmed.length < 4) {
    throw new Error('يجب ألا يقل الرمز الجديد عن 4 خانات');
  }
  const hash = await computeSha256(trimmed);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ADMIN_STORAGE_KEYS.PIN_HASH, hash);
  }
  return hash;
}

/**
 * استعادة رمز المرور الافتراضي
 */
export function resetAdminPinToDefault() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(ADMIN_STORAGE_KEYS.PIN_HASH);
  }
}

/**
 * هل قام المالك بتعيين رمز مرور مخصص؟
 * @returns {boolean}
 */
export function hasCustomAdminPin() {
  if (typeof localStorage !== 'undefined') {
    return Boolean(localStorage.getItem(ADMIN_STORAGE_KEYS.PIN_HASH));
  }
  return false;
}

/**
 * فحص جلسة المشرف النشطة
 * @returns {boolean}
 */
export function isAdminAuthenticated() {
  if (typeof sessionStorage !== 'undefined') {
    try {
      return sessionStorage.getItem(ADMIN_STORAGE_KEYS.SESSION_AUTH) === 'authenticated';
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * تسجيل دخول المشرف وتفعيل الجلسة
 */
export function loginAdminSession() {
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(ADMIN_STORAGE_KEYS.SESSION_AUTH, 'authenticated');
    } catch {}
  }
}

/**
 * تسجيل خروج المشرف وقفل اللوحة فوراً
 */
export function logoutAdminSession() {
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEYS.SESSION_AUTH);
    } catch {}
  }
}
