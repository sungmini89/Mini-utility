import { useEffect, useState } from "react";

/**
 * 다크모드 상태를 관리하는 커스텀 훅
 *
 * HTML 루트 요소에 'dark' 클래스를 토글하고 localStorage에 설정을 저장합니다.
 * 현재 상태와 토글 함수를 반환합니다. localStorage 키는 다른 유틸리티와의
 * 충돌을 피하기 위해 네임스페이스가 지정됩니다.
 *
 * @returns {[boolean, () => void]} [다크모드 활성화 여부, 토글 함수]
 *
 * @example
 * ```tsx
 * const [darkMode, toggleDarkMode] = useDarkMode();
 *
 * return (
 *   <button onClick={toggleDarkMode}>
 *     {darkMode ? '라이트 모드' : '다크 모드'}
 *   </button>
 * );
 * ```
 *
 * @since 1.0.0
 * @author 비밀번호 도구 팀
 */
export default function useDarkMode(): [boolean, () => void] {
  const storageKey = "passwordGenerator:darkMode";
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem(storageKey);
    return stored ? stored === "true" : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      window.localStorage.setItem(storageKey, String(enabled));
    } catch (e) {
      console.warn("useDarkMode: 다크모드 설정을 저장할 수 없습니다", e);
    }
  }, [enabled]);

  const toggle = () => setEnabled((prev) => !prev);
  return [enabled, toggle];
}
