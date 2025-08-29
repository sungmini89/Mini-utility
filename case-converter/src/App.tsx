import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CaseConverterPage from "./pages/CaseConverterPage";
import useDarkMode from "./hooks/useDarkMode";

/**
 * 애플리케이션의 루트 컴포넌트입니다.
 *
 * 제목과 다크모드 토글을 포함하는 헤더를 제공하고
 * 개별 유틸리티들에 대한 라우트를 정의합니다
 * (현재는 케이스 변환기만 있음).
 * 추가 유틸리티들은 동일한 레이아웃 아래에 새로운 라우트로 추가할 수 있습니다.
 *
 * @returns JSX.Element - 애플리케이션의 메인 레이아웃
 */
const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow"
        translate="no"
      >
        <Link to="/" className="text-lg font-semibold" translate="no">
          케이스 변환기
        </Link>
        <button
          aria-label="Toggle dark mode"
          onClick={toggleDarkMode}
          className="px-3 py-2 rounded focus:outline-none focus:ring"
          translate="no"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>
      <main className="flex-grow p-4" translate="no">
        <Routes>
          <Route path="/" element={<CaseConverterPage />} />
          {/* Future utility routes can be added here */}
        </Routes>
      </main>
    </div>
  );
};

export default App;
