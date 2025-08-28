import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Persist and toggle a dark mode preference.  The hook maintains a boolean
 * state and applies or removes the `dark` class on the document root
 * element whenever the value changes.  The preference itself is stored in
 * localStorage so that it persists across sessions.
 */
function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useLocalStorage<boolean>('caseConverter:darkMode', false);
  useEffect(() => {
    const classList = document.documentElement.classList;
    if (isDark) {
      classList.add('dark');
    } else {
      classList.remove('dark');
    }
  }, [isDark]);
  const toggle = () => setIsDark((prev) => !prev);
  return [isDark, toggle];
}

export default useDarkMode;