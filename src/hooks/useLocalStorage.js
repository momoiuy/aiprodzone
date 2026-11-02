import { useState, useCallback, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../lib/storage';

// خطاف قراءة وحفظ البيانات في localStorage بأمان وبدون أي خطأ في الـ Hydration
export function useLocalStorage(key, initialValue, validator) {
  // التهيئة دائماً بالقيمة الافتراضية لمنع عدم تطابق الـ SSR مع الـ Client
  const [storedValue, setStoredValue] = useState(initialValue);

  // قراءة ومزامنة القيمة المحفوظة في المتصفح بعد اكتمال التحميل الأول (Hydration)
  useEffect(() => {
    const val = getStorageItem(key, initialValue, validator);
    if (val !== undefined && val !== null) {
      setStoredValue(val);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (valueOrUpdater) => {
      setStoredValue((prev) => {
        const nextValue =
          typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater;
        setStorageItem(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
