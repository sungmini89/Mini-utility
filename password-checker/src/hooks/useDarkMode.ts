import { useState, useEffect } from "react";

/**
 * 다크모드 상태를 관리하는 커스텀 훅
 *
 * 사용자의 다크모드 설정을 localStorage에 저장하고,
 * 시스템 설정을 기본값으로 사용합니다.
 *
 * @returns [다크모드 상태, 다크모드 토글 함수] 튜플
 *
 * @example
 * ```typescript
 * const [isDark, toggleDark] = useDarkMode();
 *
 * return (
 *   <div className={isDark ? 'dark' : ''}>
 *     <button onClick={toggleDark}>
 *       {isDark ? '라이트모드' : '다크모드'}
 *     </button>
 *   </div>
 * );
 * ```
 */
export default function useDarkMode(): [boolean, () => void] {
  // 초기 다크모드 상태 결정
  const [isDark, setIsDark] = useState(() => {
    // localStorage에서 저장된 설정 확인
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }

    // 시스템 설정 확인
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 다크모드 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDark));

    // HTML 요소에 다크모드 클래스 적용/제거
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  /**
   * 다크모드 상태를 토글합니다.
   */
  const toggleDark = () => {
    setIsDark(!isDark);
  };

  return [isDark, toggleDark];
}
