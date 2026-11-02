import { useState, useCallback, useEffect } from 'react';
import { getRawStorageString, setRawStorageString } from '../lib/storage';

// خطاف إدارة الثيم ومزامنة سمة [data-theme] بأمان وبدون أي Hydration mismatch
export function useTheme() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getRawStorageString('aiprodzone_theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', saved);
      }
    } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      setRawStorageString('aiprodzone_theme', next);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', next);
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme, mounted };
}
