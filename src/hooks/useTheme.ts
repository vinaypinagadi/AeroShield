import { useState, useEffect, useCallback } from 'react';

const THEME_STORAGE_KEY = 'aero_theme_dark';

/**
 * Custom hook to manage dark/light theme state and sync with document root element.
 */
export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
        if (stored !== null) {
          return stored === 'true';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        return true;
      }
    }
    return true;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode));
      } catch {
        // Ignore storage exceptions
      }
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return { isDarkMode, toggleTheme };
}
