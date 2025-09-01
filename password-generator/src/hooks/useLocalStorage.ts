import { useState } from "react";

/**
 * localStorage에 상태를 지속적으로 저장하는 커스텀 훅
 *
 * JSON 직렬화 가능한 값과 함께 작동합니다. 값과 설정 함수를 반환합니다.
 * 생성기 설정과 히스토리를 페이지 새로고침 후에도 유지하는 데 사용됩니다.
 *
 * @template T - 저장할 데이터의 타입
 * @param {string} key - localStorage 키
 * @param {T} initialValue - 초기값
 * @returns {[T, (value: T) => void]} [저장된 값, 설정 함수]
 *
 * @example
 * ```tsx
 * const [options, setOptions] = useLocalStorage('passwordGenerator:options', {
 *   length: 12,
 *   includeUpper: true,
 *   includeLower: true,
 *   includeNumbers: true,
 *   includeSpecial: false,
 *   excludeSimilar: false,
 *   count: 1
 * });
 *
 * // 옵션 변경 시 자동으로 localStorage에 저장됨
 * setOptions({ ...options, length: 16 });
 * ```
 *
 * @since 1.0.0
 * @author 비밀번호 도구 팀
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
      console.warn(`useLocalStorage: 키 "${key}" 읽기 오류`, error);
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
      console.warn(`useLocalStorage: 키 "${key}" 설정 오류`, error);
    }
  };

  return [storedValue, setValue];
}
