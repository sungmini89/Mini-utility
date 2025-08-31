import { useEffect, useState } from "react";

/**
 * @fileoverview 다크모드 상태를 관리하는 커스텀 훅
 * @description 사용자의 다크모드 선호도를 localStorage에 저장하고 HTML 클래스를 동적으로 변경합니다.
 * @author Date Calculator Team
 * @version 1.0.0
 */

/**
 * 다크모드 상태를 관리하는 커스텀 훅
 * @description 사용자의 다크모드 선호도를 localStorage에 저장하고,
 * HTML 루트 요소에 'dark' 클래스를 추가/제거하여 다크모드를 구현합니다.
 *
 * @returns {[boolean, () => void]} [현재 다크모드 상태, 다크모드 토글 함수]
 *
 * @example
 * ```tsx
 * const [isDarkMode, toggleDarkMode] = useDarkMode();
 *
 * return (
 *   <button onClick={toggleDarkMode}>
 *     {isDarkMode ? '라이트모드' : '다크모드'}
 *   </button>
 * );
 * ```
 */
function useDarkMode(): [boolean, () => void] {
  /** localStorage에 저장할 키 이름 */
  const storageKey = "dateCalculator:darkMode";

  /** 다크모드 상태를 초기화합니다. localStorage에서 저장된 값을 우선 확인합니다. */
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem(storageKey);
    return stored ? stored === "true" : false;
  });

  /**
   * 다크모드 상태가 변경될 때마다 HTML 클래스를 업데이트하고 localStorage에 저장합니다.
   */
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

  /**
   * 다크모드 상태를 토글하는 함수
   */
  const toggle = () => setEnabled((prev) => !prev);

  return [enabled, toggle];
}

export default useDarkMode;
