import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

/**
 * 다크모드 설정을 지속하고 토글합니다. 이 훅은 불린 상태를 유지하고
 * 값이 변경될 때마다 문서 루트 요소에 `dark` 클래스를 적용하거나 제거합니다.
 * 설정 자체는 localStorage에 저장되어 세션 간에 지속됩니다.
 */
function useDarkMode(): [boolean, () => void] {
  // 깜빡임을 방지하기 위해 초기 로드 시 시스템 설정을 확인합니다
  const getInitialDarkMode = (): boolean => {
    if (typeof window === "undefined") return false;

    // 먼저 localStorage를 확인합니다
    const stored = localStorage.getItem("letterCalc:darkMode");
    if (stored !== null) {
      return JSON.parse(stored);
    }

    // 시스템 설정으로 폴백합니다
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDark, setIsDark] = useLocalStorage<boolean>(
    "letterCalc:darkMode",
    getInitialDarkMode()
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
