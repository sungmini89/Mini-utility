import { useEffect, useState } from "react";

/**
 * 다크모드 토글 및 상태 관리 훅
 *
 * 이 훅은 루트 요소에 'dark' 클래스를 토글하고 사용자 선호도를
 * localStorage에 저장합니다. 현재 상태와 토글 함수를 반환합니다.
 *
 * Tailwind CSS의 다크모드와 함께 작동하도록 설계되었으며,
 * 페이지 새로고침 후에도 사용자 선호도를 유지합니다.
 *
 * @returns [다크모드 활성화 여부, 다크모드 토글 함수] 튜플
 *
 * @example
 * ```typescript
 * const [darkMode, toggleDarkMode] = useDarkMode();
 *
 * return (
 *   <div className={darkMode ? 'dark' : ''}>
 *     <button onClick={toggleDarkMode}>
 *       {darkMode ? '라이트 모드' : '다크 모드'}
 *     </button>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```typescript
 * const [isDark, toggle] = useDarkMode();
 *
 * useEffect(() => {
 *   // 다크모드 상태에 따른 추가 로직
 *   if (isDark) {
 *     document.body.classList.add('dark-theme');
 *   } else {
 *     document.body.classList.remove('dark-theme');
 *   }
 * }, [isDark]);
 * ```
 */
export default function useDarkMode(): [boolean, () => void] {
  // localStorage 키
  const storageKey = "unitConverter:darkMode";

  // 초기 상태를 localStorage에서 읽거나 기본값 사용
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem(storageKey);
    return stored ? stored === "true" : false;
  });

  /**
   * 다크모드 상태가 변경될 때마다 DOM과 localStorage 업데이트
   */
  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // localStorage에 사용자 선호도 저장
    try {
      window.localStorage.setItem(storageKey, String(enabled));
    } catch (e) {
      console.warn("useDarkMode: 다크모드 선호도 저장 실패", e);
    }
  }, [enabled]);

  /**
   * 다크모드 상태를 토글하는 함수
   */
  const toggle = () => setEnabled((prev) => !prev);

  return [enabled, toggle];
}
