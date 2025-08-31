import { useState } from "react";

/**
 * localStorage 기반 상태 관리 훅
 *
 * 이 훅은 React 상태를 localStorage에 자동으로 저장하고 복원합니다.
 * JSON 직렬화 가능한 값과 함께 작동하며, 값과 설정자 함수를 반환합니다.
 *
 * 브라우저 환경이 아닌 경우(SSR)에는 초기값을 반환하고 localStorage 작업을 건너뜁니다.
 *
 * @template T 저장할 값의 타입
 * @param key localStorage에 저장할 키
 * @param initialValue 키가 존재하지 않을 때 사용할 초기값
 * @returns [저장된 값, 값을 설정하는 함수] 튜플
 *
 * @example
 * ```typescript
 * const [user, setUser] = useLocalStorage('user', { name: '홍길동', age: 30 });
 *
 * // 값 사용
 * console.log(user.name); // '홍길동'
 *
 * // 값 업데이트 (자동으로 localStorage에 저장됨)
 * setUser({ ...user, age: 31 });
 * ```
 *
 * @example
 * ```typescript
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 *
 * // 테마 변경 시 자동 저장
 * setTheme('dark');
 * // localStorage에 'theme': 'dark'로 저장됨
 * ```
 */
export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // 초기 상태를 localStorage에서 읽거나 초기값 사용
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: 키 "${key}" 읽기 오류`, error);
      return initialValue;
    }
  });

  // 값을 설정하고 localStorage에 저장하는 함수
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`useLocalStorage: 키 "${key}" 설정 오류`, error);
    }
  };

  return [storedValue, setValue];
}
