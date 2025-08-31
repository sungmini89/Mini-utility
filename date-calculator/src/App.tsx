/**
 * @fileoverview 날짜 계산기 애플리케이션의 메인 컴포넌트
 * @description 전체 애플리케이션의 라우팅, 전역 상태, 키보드 단축키를 관리합니다.
 * @author Date Calculator Team
 * @version 1.0.0
 */

import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BetweenDatesPage from "./pages/BetweenDatesPage";
import AddSubtractPage from "./pages/AddSubtractPage";
import CountdownPage from "./pages/CountdownPage";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import useDarkMode from "./hooks/useDarkMode";

/**
 * 메인 App 컴포넌트
 * @description 애플리케이션의 전체 구조와 라우팅을 담당합니다.
 *
 * @component
 * @example
 * ```tsx
 * <App />
 * ```
 *
 * @returns {JSX.Element} 애플리케이션의 전체 구조
 */
const App: React.FC = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  /**
   * 키보드 단축키 설정
   * @description Ctrl/Cmd + D로 다크모드 토글, Ctrl/Cmd + K로 홈으로 이동
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + D: 다크모드 토글
      if ((event.ctrlKey || event.metaKey) && event.key === "d") {
        event.preventDefault();
        toggleDarkMode();
      }

      // Ctrl/Cmd + K: 홈으로 이동
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        window.location.href = "/";
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleDarkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <ErrorBoundary>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/between-dates" element={<BetweenDatesPage />} />
            <Route path="/add-subtract" element={<AddSubtractPage />} />
            <Route path="/countdown" element={<CountdownPage />} />
          </Routes>
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;
