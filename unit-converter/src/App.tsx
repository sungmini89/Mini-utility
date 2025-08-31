import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import UnitConverterPage from "./pages/UnitConverterPage";
import useDarkMode from "./hooks/useDarkMode";

/**
 * 단위 변환기 최상위 App 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션의 전체 레이아웃을 제공하며,
 * 헤더, 다크모드 토글, 라우팅을 관리합니다.
 *
 * 주요 기능:
 * - 다크모드/라이트모드 토글
 * - 반응형 헤더 (로고 및 테마 전환 버튼)
 * - React Router를 통한 페이지 라우팅
 * - Tailwind CSS를 활용한 스타일링
 *
 * @example
 * ```tsx
 * <App />
 * ```
 *
 * @returns {JSX.Element} 애플리케이션의 루트 컴포넌트
 */
const App: React.FC = () => {
  // 다크모드 상태와 토글 함수
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {/* 헤더 섹션 */}
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* 로고 및 홈 링크 */}
            <h1 className="text-xl font-bold">
              <Link to="/">Unit Converter</Link>
            </h1>

            {/* 다크모드 토글 버튼 */}
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring"
              aria-label={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </header>

        {/* 메인 콘텐츠 영역 */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            {/* 홈페이지 - 단위 변환기 */}
            <Route path="/" element={<UnitConverterPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
