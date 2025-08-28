import React from "react";
import CharacterCounter from "./components/CharacterCounter";
import useDarkMode from "./hooks/useDarkMode";

/**
 * 애플리케이션의 최상위 컴포넌트입니다.
 * 제목과 다크모드 토글 버튼이 있는 헤더를 제공하고,
 * 그 아래에 메인 문자 카운터를 렌더링합니다.
 */
const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
        <h1 className="text-lg font-semibold">
          Letter &amp; Vocabulary Calculator
        </h1>
        <button
          aria-label="Toggle dark mode"
          onClick={toggleDarkMode}
          className="px-3 py-2 rounded focus:outline-none focus:ring"
        >
          {/* Provide a simple icon switch for light/dark mode */}
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>
      <main className="flex-grow p-4">
        <CharacterCounter />
      </main>
    </div>
  );
};

export default App;
