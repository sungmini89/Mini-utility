import { useState, useEffect } from "react";

/**
 * 브라우저의 localStorage에 상태를 지속적으로 저장하는 React 훅
 *
 * 컴포넌트가 초기화될 때 localStorage에서 값을 읽어오고, 상태가 변경될 때마다
 * 자동으로 localStorage에 동기화합니다. SSR 환경에서는 안전하게 기본값을 반환합니다.
 *
 * @description
 * - 자동 저장: 상태 변경 시 localStorage에 자동 동기화
 * - 안전한 파싱: 잘못된 데이터 자동 정리 및 복구
 * - SSR 호환: 서버 사이드 렌더링 환경에서 안전하게 작동
 * - 에러 처리: localStorage 접근 실패 시 기본값 반환
 *
 * @template T - 저장할 데이터의 타입
 * @param key - localStorage에 사용할 고유 키
 * @param defaultValue - 초기값이 없을 때 사용할 기본값
 *
 * @returns [value, setValue] - 현재 값과 값을 변경하는 함수
 *
 * @example
 * ```tsx
 * const [user, setUser] = useLocalStorage('user', { name: 'Anonymous' });
 *
 * // 값 변경 시 자동으로 localStorage에 저장됨
 * setUser({ name: 'John Doe' });
 * ```
 *
 * @author QR Code Generator Team
 * @since 1.0.0
 */
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      // undefined, null, 빈 문자열 체크
      if (
        stored === null ||
        stored === undefined ||
        stored === "undefined" ||
        stored === ""
      ) {
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch (error) {
      console.warn(
        "useLocalStorage: unable to parse stored value for key:",
        key,
        error
      );
      // 파싱 실패 시 해당 키 삭제
      try {
        window.localStorage.removeItem(key);
      } catch (removeError) {
        console.warn(
          "useLocalStorage: unable to remove invalid key:",
          key,
          removeError
        );
      }
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      // undefined 값은 저장하지 않음
      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn("useLocalStorage: unable to set value for key:", key, error);
    }
  }, [key, value]);

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

export default useLocalStorage;
