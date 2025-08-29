import { useState, useEffect } from "react";

/**
 * 상태 조각을 브라우저의 localStorage에 지속적으로 저장합니다. 훅이 초기화될 때
 * 이전에 저장된 값을 읽으려고 시도합니다. 상태의 모든 변경사항은 자동으로
 * localStorage에 동기화됩니다.
 *
 * @param {string} key - 값을 저장하고 검색하는 데 사용되는 고유 키
 * @param {T} defaultValue - 저장된 값이 없을 때 반환되는 기본값
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} [현재 값, 값을 설정하는 함수]
 */
function useLocalStorage<T>(key: string, defaultValue: T) {
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
