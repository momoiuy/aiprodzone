// دوال التعامل الآمن مع localStorage بدون أخطاء في البيئات المعزولة أو SSR
export function getStorageItem(key, fallback, validator) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    if (typeof validator === 'function' && !validator(parsed)) {
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getRawStorageString(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = window.localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch {
    return fallback;
  }
}

export function setRawStorageString(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}
