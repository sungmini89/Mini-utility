import React, { useState, useEffect } from "react";

/**
 * 상태 조각을 브라우저의 localStorage에 지속시킵니다. 훅이 초기화될 때
 * 이전에 저장된 값을 읽으려고 시도합니다. 상태에 대한 모든 변경사항은
 * 자동으로 localStorage에 다시 동기화됩니다.
 *
 * @param key 값을 저장하고 검색하는 데 사용되는 고유 키
 * @param defaultValue 아무것도 저장되지 않은 경우 반환되는 기본값
 */
function useLocalStorage<T>(key: string, defaultValue: T) {
  // 초기 undefined 렌더링을 방지하기 위해 localStorage에서 상태를 동기적으로 초기화합니다.
  // JSON.parse가 실패하면 오류를 삼키고 기본값을 반환합니다.
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

  // 상태가 변경될 때마다 localStorage를 업데이트합니다. try/catch로 감싸서
  // 저장소를 사용할 수 없는 경우(예: 시크릿 모드)에도 오류를 던지지 않습니다.
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
