import { useState, useCallback, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../lib/storage';

// خطاف قراءة وحفظ البيانات في localStorage بأمان تام ومزامنة فورية ودون أي Hydration Mismatch
export function useLocalStorage(key, initialValue, validator) {
  // التهيئة دائماً بالقيمة الافتراضية لمنع عدم تطابق الـ SSR مع الـ Client
  const [storedValue, setStoredValue] = useState(initialValue);

  // قراءة ومزامنة القيمة المحفوظة في المتصفح والاستماع لأحداث المزامنة والاستعادة
  useEffect(() => {
    const syncValue = () => {
      const val = getStorageItem(key, initialValue, validator);
      if (val !== undefined && val !== null) {
        setStoredValue(val);
      }
    };

    // القراءة الأولية فور اكتمال الـ Hydration
    syncValue();

    if (typeof window === 'undefined') return;

    // الاستماع لحدث المزامنة الداخلي (الاستعادة الفورية أو الحفظ من مكون آخر)
    const handleCustomSync = (e) => {
      const detail = e?.detail;
      if (!detail || !detail.key || detail.key === key || detail.source === 'backup_restore') {
        syncValue();
      }
    };

    // الاستماع لحدث التخزين القياسي عبر النوافذ وعلامات التبويب المتعددة
    const handleStorageEvent = (e) => {
      if (!e.key || e.key === key) {
        syncValue();
      }
    };

    window.addEventListener('aiprodzone_storage_sync', handleCustomSync);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('aiprodzone_storage_sync', handleCustomSync);
      window.removeEventListener('storage', handleStorageEvent);
    };
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
