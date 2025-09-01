import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import PasswordCheckerPage from "./pages/PasswordCheckerPage";
import useDarkMode from "./hooks/useDarkMode";

/**
 * 비밀번호 강도 검사기 애플리케이션의 메인 컴포넌트
 *
 * 애플리케이션의 전체 레이아웃을 구성하며, 다음과 같은 기능을 제공합니다:
 * - 다크모드 토글 기능
 * - 라우팅 설정
 * - 헤더 및 네비게이션
 *
 * @returns {JSX.Element} 애플리케이션의 메인 UI
 *
 * @example
 * ```tsx
 * <App />
 * ```
 */
const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">비밀번호 강도 검사기</h1>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<PasswordCheckerPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
