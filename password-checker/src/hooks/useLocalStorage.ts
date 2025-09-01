import { useState, useEffect } from "react";

/**
 * localStorage를 사용하여 상태를 영구 저장하는 커스텀 훅
 *
 * 브라우저의 localStorage API를 활용하여 컴포넌트의 상태를
 * 페이지 새로고침 후에도 유지할 수 있도록 합니다.
 *
 * @template T - 저장할 데이터의 타입
 * @param key - localStorage에 저장될 키 이름
 * @param initialValue - 초기값
 * @returns [저장된 값, 값을 설정하는 함수] 튜플
 *
 * @example
 * ```typescript
 * const [user, setUser] = useLocalStorage('user', { name: 'John' });
 *
 * // 값 설정
 * setUser({ name: 'Jane' });
 *
 * // 값은 localStorage에 자동으로 저장되고 페이지 새로고침 후에도 유지됨
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // localStorage에서 값을 가져오는 함수
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // localStorage에 값을 저장하는 함수
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
