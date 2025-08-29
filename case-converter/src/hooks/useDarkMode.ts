import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

/**
 * 다크모드 설정을 유지하고 토글하는 훅입니다.
 *
 * 이 훅은 불린 상태를 유지하고 값이 변경될 때마다
 * 문서 루트 요소에 `dark` 클래스를 적용하거나 제거합니다.
 * 설정 자체는 localStorage에 저장되어 세션 간에 유지됩니다.
 *
 * @returns [boolean, () => void] - [다크모드 상태, 토글 함수]
 *
 * @example
 * const [isDark, toggleDark] = useDarkMode();
 * // isDark: 현재 다크모드 상태
 * // toggleDark: 다크모드를 토글하는 함수
 */
function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useLocalStorage<boolean>(
    "caseConverter:darkMode",
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
