import { useEffect, useState } from "react";

/**
 * @fileoverview 다크모드 토글 기능을 제공하는 커스텀 훅
 *
 * 이 훅은 애플리케이션의 다크모드를 관리하며, 사용자의 선호도를
 * localStorage에 저장합니다. Tailwind CSS의 dark 클래스를 사용하여
 * 테마를 전환합니다.
 *
 * @author Favicon Generator Team
 * @version 1.0.0
 */

/**
 * @description 다크모드 토글 기능을 제공하는 훅
 *
 * 애플리케이션의 다크모드를 관리하는 훅입니다:
 * - localStorage에 다크모드 선호도 저장
 * - Tailwind CSS dark 클래스로 테마 전환
 * - SSR 환경에서 안전하게 동작
 * - 네임스페이스된 localStorage 키로 충돌 방지
 * - 자동으로 DOM에 dark 클래스 적용/제거
 *
 * @returns {[boolean, () => void]} [다크모드 활성화 여부, 토글 함수]
 *
 * @example
 * ```typescript
 * const [darkMode, toggleDarkMode] = useDarkMode();
 *
 * return (
 *   <button onClick={toggleDarkMode}>
 *     {darkMode ? '라이트모드' : '다크모드'}
 *   </button>
 * );
 * ```
 */
export default function useDarkMode(): [boolean, () => void] {
  const storageKey = "faviconGenerator:darkMode";
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
      console.warn("useDarkMode: Unable to persist dark mode", e);
    }
  }, [enabled]);
  const toggle = () => setEnabled((prev) => !prev);
  return [enabled, toggle];
}
