import { useState, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../lib/storage';

// خطاف قراءة وحفظ البيانات في localStorage بأمان وبدون وميض عند التحميل
export function useLocalStorage(key, initialValue, validator) {
  const [storedValue, setStoredValue] = useState(() =>
    getStorageItem(key, initialValue, validator)
  );

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
