import { useState, useCallback, useEffect } from 'react';
import { getRawStorageString, setRawStorageString } from '../lib/storage';

// خطاف إدارة الثيم ومزامنة سمة [data-theme] على جذر المستند بدون تفرعات لونية في JSX
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = getRawStorageString('aiprodzone_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

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

  return { theme, toggleTheme };
}
