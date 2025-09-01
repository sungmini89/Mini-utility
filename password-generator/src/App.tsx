import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import PasswordGeneratorPage from "./pages/PasswordGeneratorPage";
import PasswordStrengthPage from "./pages/PasswordStrengthPage";
import useDarkMode from "./hooks/useDarkMode";

/**
 * 비밀번호 도구 애플리케이션의 최상위 컴포넌트
 *
 * 이 컴포넌트는 다음과 같은 기능을 제공합니다:
 * - 헤더에 다크모드 토글 버튼
 * - 비밀번호 생성기와 강도 체커 간의 라우팅
 * - localStorage를 통한 다크모드 설정 지속성
 *
 * @returns {JSX.Element} 비밀번호 도구 애플리케이션의 메인 레이아웃
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
            <h1 className="text-xl font-bold">
              <Link to="/">비밀번호 도구</Link>
            </h1>
            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                생성기
              </Link>
              <Link
                to="/strength"
                className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                강도 체커
              </Link>
              <button
                onClick={toggleDarkMode}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring"
                aria-label="다크모드 토글"
              >
                {darkMode ? "라이트 모드" : "다크 모드"}
              </button>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<PasswordGeneratorPage />} />
            <Route path="/strength" element={<PasswordStrengthPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
