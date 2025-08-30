import { useState, useEffect } from "react";

/**
 * 다크모드 상태를 관리하는 커스텀 훅
 *
 * 이 훅은 사용자의 다크모드 설정을 감지하고 관리합니다.
 * 시스템 설정을 자동으로 감지하며, 사용자가 수동으로 토글할 수도 있습니다.
 * 설정은 localStorage에 저장되어 페이지 새로고침 시에도 유지됩니다.
 *
 * @returns {[boolean, () => void]} 다크모드 상태와 토글 함수
 *
 * @example
 * ```tsx
 * const [isDark, toggleDark] = useDarkMode();
 *
 * return (
 *   <button onClick={toggleDark}>
 *     {isDark ? '라이트모드' : '다크모드'}
 *   </button>
 * );
 * ```
 */
function useDarkMode(): [boolean, () => void] {
  // localStorage에서 저장된 다크모드 설정을 가져오거나 시스템 설정을 감지
  const [isDark, setIsDark] = useState(() => {
    try {
      // localStorage에서 저장된 설정 확인
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        return JSON.parse(saved);
      }

      // 시스템 설정 감지
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      // 오류 발생 시 기본값 (라이트모드)
      return false;
    }
  });

  // 다크모드 상태가 변경될 때마다 실행
  useEffect(() => {
    const root = window.document.documentElement;

    if (isDark) {
      // 다크모드 활성화
      root.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      // 라이트모드 활성화
      root.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDark]);

  // 시스템 다크모드 설정 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    /**
     * 시스템 다크모드 설정 변경 핸들러
     * @param {MediaQueryListEvent} e - 미디어 쿼리 변경 이벤트
     */
    const handleChange = (e: MediaQueryListEvent) => {
      // localStorage에 저장된 설정이 없을 때만 시스템 설정을 따름
      if (localStorage.getItem("darkMode") === null) {
        setIsDark(e.matches);
      }
    };

    // 이벤트 리스너 등록
    mediaQuery.addEventListener("change", handleChange);

    // 클린업 함수
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  /**
   * 다크모드 상태를 토글합니다
   *
   * 현재 다크모드 상태를 반대로 변경합니다.
   * 라이트모드 → 다크모드, 다크모드 → 라이트모드
   */
  const toggleDark = () => {
    setIsDark(!isDark);
  };

  return [isDark, toggleDark];
}

export default useDarkMode;
