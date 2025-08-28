import { useState, useEffect } from 'react';

/**
 * Persist a piece of state to the browser's localStorage.  When the hook
 * initialises it attempts to read a previously saved value.  Any changes
 * to the state are automatically synchronised back to localStorage.
 *
 * @param key A unique key used to store and retrieve the value
 * @param defaultValue A default value returned if nothing is stored
 */
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch (error) {
      console.warn('useLocalStorage: unable to parse stored value', error);
      return defaultValue;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('useLocalStorage: unable to set value', error);
    }
  }, [key, value]);
  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

export default useLocalStorage;