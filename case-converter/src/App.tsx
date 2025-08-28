import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CaseConverterPage from './pages/CaseConverterPage';
import useDarkMode from './hooks/useDarkMode';

/**
 * App is the root component for the application.  It provides a header
 * containing the title and dark mode toggle and defines routes for
 * individual utilities (currently only the case converter).  Additional
 * utilities can be added as new routes under the same layout.
 */
const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
        <Link to="/" className="text-lg font-semibold">
          Case Converter
        </Link>
        <button
          aria-label="Toggle dark mode"
          onClick={toggleDarkMode}
          className="px-3 py-2 rounded focus:outline-none focus:ring"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<CaseConverterPage />} />
          {/* Future utility routes can be added here */}
        </Routes>
      </main>
    </div>
  );
};

export default App;