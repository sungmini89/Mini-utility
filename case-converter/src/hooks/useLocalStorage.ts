import { useState, useEffect } from "react";

/**
 * 상태를 브라우저의 localStorage에 유지하는 훅입니다.
 *
 * 훅이 초기화될 때 이전에 저장된 값을 읽으려고 시도합니다.
 * 상태에 대한 모든 변경사항은 자동으로 localStorage에 동기화됩니다.
 *
 * @param key - 값을 저장하고 검색하는 데 사용되는 고유 키
 * @param defaultValue - 저장된 것이 없을 때 반환되는 기본값
 * @returns [T, React.Dispatch<React.SetStateAction<T>>] - [저장된 값, 설정 함수]
 *
 * @example
 * const [value, setValue] = useLocalStorage('theme', 'light');
 * // value: localStorage에서 가져온 값 또는 기본값
 * // setValue: 값을 업데이트하고 localStorage에 저장하는 함수
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
