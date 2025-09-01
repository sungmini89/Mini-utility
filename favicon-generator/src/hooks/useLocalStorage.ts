import { useState } from "react";

/**
 * @fileoverview localStorage를 사용한 상태 지속화 커스텀 훅
 *
 * 이 훅은 React 상태를 브라우저의 localStorage에 자동으로 저장하고 복원합니다.
 * JSON으로 직렬화 가능한 모든 값을 지원하며, 페이지 새로고침 후에도
 * 상태가 유지됩니다.
 *
 * @author Favicon Generator Team
 * @version 1.0.0
 */

/**
 * @description localStorage를 사용한 상태 지속화 훅
 *
 * React 상태를 localStorage에 자동으로 저장하고 복원하는 훅입니다:
 * - JSON 직렬화 가능한 모든 타입 지원
 * - 페이지 새로고침 후 상태 자동 복원
 * - SSR 환경에서 안전하게 동작
 * - 에러 발생 시 초기값으로 폴백
 *
 * @template T - 저장할 데이터의 타입
 * @param {string} key - localStorage에 저장할 키
 * @param {T} initialValue - 초기값 (localStorage에 값이 없을 때 사용)
 * @returns {[T, (value: T) => void]} [저장된 값, 값을 설정하는 함수]
 *
 * @example
 * ```typescript
 * const [settings, setSettings] = useLocalStorage('favicon-settings', {
 *   mode: 'text',
 *   bgColor: '#ffffff'
 * });
 * ```
 */
export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}"`, error);
      return initialValue;
    }
  });
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`useLocalStorage: error setting key "${key}"`, error);
    }
  };
  return [storedValue, setValue];
}
