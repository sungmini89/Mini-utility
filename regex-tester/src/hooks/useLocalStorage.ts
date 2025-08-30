import { useState, useEffect } from "react";

/**
 * localStorage를 사용하여 상태를 영구적으로 저장하는 커스텀 훅
 *
 * 이 훅은 컴포넌트의 상태를 브라우저의 localStorage에 자동으로 저장하고,
 * 페이지 새로고침 시에도 상태를 복원합니다.
 *
 * @template T - 저장할 상태의 타입
 * @param {string} key - localStorage에 사용할 키
 * @param {T} initialValue - 초기값
 * @returns {[T, (value: T | ((prev: T) => T)) => void]} 상태와 상태 설정 함수
 *
 * @example
 * ```tsx
 * const [user, setUser] = useLocalStorage('user', { name: '', email: '' });
 *
 * // 상태 설정
 * setUser({ name: 'John', email: 'john@example.com' });
 *
 * // 함수형 업데이트
 * setUser(prev => ({ ...prev, name: 'Jane' }));
 * ```
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // localStorage에서 값을 가져오거나 초기값을 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // 기본 타입 체크를 통한 타입 안전성 향상
        if (typeof parsed === typeof initialValue) {
          return parsed;
        }
      }
      return initialValue;
    } catch (error) {
      console.error(`localStorage에서 키 "${key}" 읽기 실패:`, error);
      return initialValue;
    }
  });

  // localStorage에 값을 저장하는 함수
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // 함수형 업데이트 지원
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // undefined 값은 localStorage에서 제거
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`localStorage에 키 "${key}" 저장 실패:`, error);
    }
  };

  // 다른 탭에서 localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`localStorage 변경사항 파싱 실패:`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
