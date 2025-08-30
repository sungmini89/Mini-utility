import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import JsonFormatterPage from './pages/JsonFormatterPage';
import useDarkMode from './hooks/useDarkMode';

const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
        <Link to="/" className="text-lg font-semibold">
          JSON Formatter
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
          <Route path="/" element={<JsonFormatterPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;