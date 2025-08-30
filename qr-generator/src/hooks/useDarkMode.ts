import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

/**
 * 다크모드 상태를 관리하는 React 훅
 *
 * 사용자의 다크모드 선호도를 localStorage에 저장하고, 문서의 루트 요소에
 * 'dark' 클래스를 추가/제거하여 테마를 전환합니다.
 *
 * @description
 * - 상태 지속: localStorage에 다크모드 설정 자동 저장
 * - 자동 적용: 상태 변경 시 즉시 DOM에 반영
 * - 토글 기능: 다크모드와 라이트모드 간 전환
 * - 세션 유지: 브라우저 재시작 후에도 설정 유지
 *
 * @returns [isDark, toggleDarkMode] - 다크모드 상태와 토글 함수
 *
 * @example
 * ```tsx
 * const [isDark, toggleDarkMode] = useDarkMode();
 *
 * return (
 *   <button onClick={toggleDarkMode}>
 *     {isDark ? '라이트 모드' : '다크 모드'}
 *   </button>
 * );
 * ```
 *
 * @author QR Code Generator Team
 * @since 1.0.0
 */
function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useLocalStorage<boolean>(
    "qrGenerator:darkMode",
    false
  );

  useEffect(() => {
    const classList = document.documentElement.classList;
    if (isDark) {
      classList.add("dark");
    } else {
      classList.remove("dark");
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);
  return [isDark, toggle];
}

export default useDarkMode;
