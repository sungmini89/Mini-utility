import React from "react";
import { Outlet } from "react-router-dom";
import useDarkMode from "./hooks/useDarkMode";

/**
 * QR 코드 생성기 메인 레이아웃 컴포넌트
 *
 * 애플리케이션의 전체 레이아웃을 담당하며, 헤더와 다크모드 토글을 포함합니다.
 * 자식 라우트들은 Outlet을 통해 렌더링됩니다.
 *
 * @description
 * - 헤더: 애플리케이션 제목과 다크모드 토글 버튼
 * - 메인 영역: 자식 라우트 컴포넌트들이 렌더링되는 영역
 * - 다크모드: 전체 애플리케이션의 테마를 전환
 * - 반응형 디자인: 모바일과 데스크톱 모두 지원
 *
 * @example
 * ```tsx
 * <App>
 *   <QrGeneratorPage />
 * </App>
 * ```
 *
 * @author QR Code Generator Team
 * @since 1.0.0
 */
const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">QR Code Generator</h1>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
