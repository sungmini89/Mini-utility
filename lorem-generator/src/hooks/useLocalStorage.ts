import { useState, useEffect } from "react";

/**
 * 브라우저의 localStorage에 상태를 지속적으로 저장하는 React 훅
 *
 * 이 훅은 React 상태를 localStorage와 동기화하여 페이지 새로고침이나
 * 브라우저 재시작 후에도 사용자 설정을 유지할 수 있게 해줍니다.
 *
 * 주요 기능:
 * - 컴포넌트 초기화 시 localStorage에서 이전 값 읽기
 * - 상태 변경 시 자동으로 localStorage에 저장
 * - JSON 직렬화/역직렬화 자동 처리
 * - 에러 발생 시 기본값 반환 및 콘솔 경고
 * - SSR 환경에서 안전하게 동작 (window 객체 존재 여부 확인)
 *
 * 사용 예시:
 * - 사용자 설정 저장 (테마, 언어, UI 옵션 등)
 * - 폼 데이터 임시 저장
 * - 사용자 선호도 기억
 * - 애플리케이션 상태 복원
 *
 * @template T - 저장할 데이터의 타입 (객체, 배열, 문자열, 숫자 등)
 * @param {string} key - localStorage에 저장할 고유 키 (다른 저장소와 충돌 방지를 위해 접두사 사용 권장)
 * @param {T} defaultValue - 키가 존재하지 않거나 파싱 실패 시 반환할 기본값
 *
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} [현재 값, 값을 업데이트하는 함수]
 *
 * @example
 * // 기본 사용법
 * const [theme, setTheme] = useLocalStorage('app:theme', 'light');
 *
 * // 객체 저장
 * const [userPrefs, setUserPrefs] = useLocalStorage('app:userPrefs', {
 *   fontSize: 14,
 *   language: 'ko',
 *   notifications: true
 * });
 *
 * // 배열 저장
 * const [recentItems, setRecentItems] = useLocalStorage('app:recentItems', []);
 *
 * // 사용 시 주의사항
 * // 1. 키 이름에 접두사 사용 (예: 'loremGenerator:options')
 * // 2. 민감한 정보는 저장하지 않기
 * // 3. 저장 용량 제한 고려 (보통 5-10MB)
 */
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    // SSR 환경에서는 기본값 반환
    if (typeof window === "undefined") return defaultValue;

    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch (error) {
      // JSON 파싱 실패 시 기본값 반환
      console.warn("useLocalStorage: unable to parse stored value", error);
      return defaultValue;
    }
  });

  // 값이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // 저장 실패 시 콘솔에 경고 (용량 부족, 권한 문제 등)
      console.warn("useLocalStorage: unable to set value", error);
    }
  }, [key, value]);

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}

export default useLocalStorage;
