import React, { useState, useEffect } from "react";

/**
 * Persist a piece of state to the browser's localStorage.  When the hook
 * initialises it attempts to read a previously saved value.  Any changes
 * to the state are automatically synchronised back to localStorage.
 *
 * @param key A unique key used to store and retrieve the value
 * @param defaultValue A default value returned if nothing is stored
 */
function useLocalStorage<T>(key: string, defaultValue: T) {
  // Initialise state from localStorage synchronously to avoid an initial
  // undefined render.  If JSON.parse fails we swallow the error and
  // return the default value.
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch (error) {
      console.warn("useLocalStorage: unable to parse stored value", error);
      return defaultValue;
    }
  });

  // Update localStorage whenever the state changes.  Wrap in a try/catch
  // so that we do not throw if storage is unavailable (e.g. in private mode).
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("useLocalStorage: unable to set value", error);
    }
  }, [key, value]);

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

export default useLocalStorage;
