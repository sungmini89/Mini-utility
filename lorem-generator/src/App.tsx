import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoremGeneratorPage from "./pages/LoremGeneratorPage";
import useDarkMode from "./hooks/useDarkMode";

/**
 * Lorem Ipsum 생성기의 메인 앱 컴포넌트
 *
 * 이 컴포넌트는 전체 애플리케이션의 레이아웃을 담당하며,
 * 헤더(네비게이션 + 다크모드 토글)와 메인 콘텐츠 영역을 구성합니다.
 *
 * 주요 기능:
 * - 헤더에 로고/제목과 다크모드 토글 버튼 배치
 * - React Router를 사용한 페이지 라우팅
 * - 다크모드 상태 관리 및 테마 적용
 *
 * @returns {JSX.Element} 전체 애플리케이션 레이아웃
 */
const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
        <Link to="/" className="text-lg font-semibold">
          Lorem Ipsum Generator
        </Link>
        <button
          aria-label="Toggle dark mode"
          onClick={toggleDarkMode}
          className="px-3 py-2 rounded focus:outline-none focus:ring"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<LoremGeneratorPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
