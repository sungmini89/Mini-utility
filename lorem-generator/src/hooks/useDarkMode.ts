import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

/**
 * 다크모드 상태를 관리하고 문서에 테마를 적용하는 React 훅
 *
 * 이 훅은 사용자의 다크모드 선호도를 localStorage에 저장하고,
 * 상태 변경 시 document.documentElement에 'dark' 클래스를 추가/제거하여
 * Tailwind CSS의 다크모드 시스템과 연동됩니다.
 *
 * 주요 기능:
 * - 다크모드 상태를 localStorage에 영구 저장
 * - 상태 변경 시 자동으로 CSS 클래스 적용
 * - 페이지 새로고침 후에도 설정 유지
 * - Tailwind CSS 다크모드 시스템과 완벽 연동
 * - 사용자 선호도 기억 및 복원
 *
 * 동작 방식:
 * 1. 컴포넌트 마운트 시 localStorage에서 다크모드 설정 읽기
 * 2. 다크모드가 활성화되면 document.documentElement.classList에 'dark' 추가
 * 3. 다크모드가 비활성화되면 'dark' 클래스 제거
 * 4. 상태 변경 시 자동으로 localStorage에 저장
 *
 * Tailwind CSS 연동:
 * - 'dark:' 접두사를 사용한 조건부 스타일링 지원
 * - 예: className="bg-white dark:bg-gray-800"
 * - 다크모드 전환 시 자동으로 스타일 적용
 *
 * @returns {[boolean, () => void]} [다크모드 상태, 다크모드 토글 함수]
 *
 * @example
 * // 기본 사용법
 * const [isDark, toggleDarkMode] = useDarkMode();
 *
 * // 다크모드 상태에 따른 UI 렌더링
 * return (
 *   <div className={`${isDark ? 'dark' : ''}`}>
 *     <button onClick={toggleDarkMode}>
 *       {isDark ? '☀️ 라이트모드' : '🌙 다크모드'}
 *     </button>
 *   </div>
 * );
 *
 * // Tailwind CSS와 함께 사용
 * return (
 *   <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
 *     <h1 className="text-gray-800 dark:text-gray-200">제목</h1>
 *     <p className="text-gray-600 dark:text-gray-400">내용</p>
 *   </div>
 * );
 *
 * // 주의사항
 * // 1. Tailwind CSS 설정에서 darkMode: 'class' 설정 필요
 * // 2. CSS 변수나 커스텀 스타일과 함께 사용 시 추가 설정 필요
 * // 3. 시스템 다크모드 감지가 아닌 사용자 선택 기반
 */
function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useLocalStorage<boolean>(
    "loremGenerator:darkMode",
    false
  );

  useEffect(() => {
    const classList = document.documentElement.classList;

    if (isDark) {
      // 다크모드 활성화 시 'dark' 클래스 추가
      classList.add("dark");
    } else {
      // 다크모드 비활성화 시 'dark' 클래스 제거
      classList.remove("dark");
    }
  }, [isDark]);

  // 다크모드 상태를 토글하는 함수
  const toggle = () => setIsDark((prev) => !prev);

  return [isDark, toggle];
}

export default useDarkMode;
