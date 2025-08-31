import { useState, useEffect } from "react";

/**
 * @fileoverview localStorage를 React 상태와 연동하는 커스텀 훅
 * @description 컴포넌트의 상태를 localStorage에 자동으로 저장하고 복원합니다.
 * @author Date Calculator Team
 * @version 1.0.0
 */

/**
 * localStorage와 연동되는 상태 관리 훅
 * @description 컴포넌트의 상태를 localStorage에 자동으로 저장하고,
 * 페이지 새로고침 시에도 상태를 유지합니다.
 *
 * @template T - 저장할 데이터의 타입
 * @param {string} key - localStorage에 저장할 키 이름
 * @param {T} initialValue - 초기값
 * @returns {[T, (value: T | ((val: T) => T)) => void]} [현재 값, 값을 설정하는 함수]
 *
 * @example
 * ```tsx
 * const [count, setCount] = useLocalStorage('counter', 0);
 *
 * return (
 *   <div>
 *     <p>카운트: {count}</p>
 *     <button onClick={() => setCount(count + 1)}>증가</button>
 *   </div>
 * );
 * ```
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  /**
   * localStorage에서 값을 가져오거나 초기값을 반환합니다.
   * @returns {T} 저장된 값 또는 초기값
   */
  const getStoredValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(
        `useLocalStorage: 키 "${key}"의 값을 파싱할 수 없습니다:`,
        error
      );
      return initialValue;
    }
  };

  /** 현재 상태값 */
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  /**
   * 값을 설정하고 localStorage에 저장합니다.
   * @param {T | ((val: T) => T)} value - 설정할 값 또는 값을 반환하는 함수
   */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수인 경우 현재 값을 인자로 전달하여 새로운 값을 계산
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // 상태 업데이트
      setStoredValue(valueToStore);

      // localStorage에 저장
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(
        `useLocalStorage: 키 "${key}"에 값을 저장할 수 없습니다:`,
        error
      );
    }
  };

  /**
   * 다른 탭에서 localStorage가 변경되었을 때 동기화합니다.
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`useLocalStorage: 동기화 중 값 파싱 오류:`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
