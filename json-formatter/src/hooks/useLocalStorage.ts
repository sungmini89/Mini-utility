import { useState, useEffect, useCallback } from "react";

/**
 * Persist a piece of state to the browser's localStorage.  When the
 * hook initialises it attempts to read a previously saved value.  Any
 * changes to the state are automatically synchronised back to
 * localStorage.
 *
 * @param key A unique key used to store and retrieve the value
 * @param defaultValue A default value returned if nothing is stored
 */
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return defaultValue;
      return JSON.parse(stored) as T;
    } catch (error) {
      console.warn(
        `useLocalStorage: unable to parse stored value for key "${key}"`,
        error
      );
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
      } catch (error) {
        console.error(
          `useLocalStorage: error setting value for key "${key}"`,
          error
        );
      }
    },
    [key, value]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(
        `useLocalStorage: unable to set value for key "${key}"`,
        error
      );
    }
  }, [key, value]);

  return [value, setStoredValue] as [
    T,
    React.Dispatch<React.SetStateAction<T>>
  ];
}

export default useLocalStorage;
