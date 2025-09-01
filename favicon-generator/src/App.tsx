import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FaviconGeneratorPage from "./pages/FaviconGeneratorPage";
import useDarkMode from "./hooks/useDarkMode";

/**
 * @fileoverview Favicon Generator 애플리케이션의 최상위 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션의 전체 레이아웃을 담당하며, 다음과 같은 기능을 제공합니다:
 * - 헤더와 네비게이션 메뉴
 * - 다크모드 토글 기능 (localStorage에 설정 저장)
 * - React Router를 통한 페이지 라우팅
 * - 반응형 디자인과 테마 전환 애니메이션
 *
 * @component App
 * @description 메인 애플리케이션 컴포넌트
 * @author Favicon Generator Team
 * @version 1.0.0
 */
const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">
              <Link to="/">Web Dev Utilities</Link>
            </h1>
            <nav className="flex items-center space-x-4">
              <Link
                to="/favicon-generator"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Favicon Generator
              </Link>
              <button
                onClick={toggleDarkMode}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/favicon-generator"
              element={<FaviconGeneratorPage />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
