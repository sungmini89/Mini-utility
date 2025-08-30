import { useState, useEffect } from "react";

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
      if (!stored) return defaultValue;

      // ✅ 타입 검증 추가
      const parsed = JSON.parse(stored);
      // 기본 타입 검증 (원시 타입의 경우)
      if (typeof defaultValue === "string" && typeof parsed !== "string") {
        console.warn(
          `useLocalStorage: stored value for key "${key}" is not a string, using default`
        );
        return defaultValue;
      }
      if (typeof defaultValue === "number" && typeof parsed !== "number") {
        console.warn(
          `useLocalStorage: stored value for key "${key}" is not a number, using default`
        );
        return defaultValue;
      }
      if (typeof defaultValue === "boolean" && typeof parsed !== "boolean") {
        console.warn(
          `useLocalStorage: stored value for key "${key}" is not a boolean, using default`
        );
        return defaultValue;
      }

      return parsed as T;
    } catch (error) {
      console.warn("useLocalStorage: unable to parse stored value", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      // ✅ undefined 값 저장 방지
      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn("useLocalStorage: unable to set value", error);
    }
  }, [key, value]);

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

export default useLocalStorage;
