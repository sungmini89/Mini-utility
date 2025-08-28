import React from 'react';
import CharacterCounter from './components/CharacterCounter';
import useDarkMode from './hooks/useDarkMode';

/**
 * Top‑level application component.  It provides a header with a title and
 * dark mode toggle, and renders the main character counter beneath it.
 */
const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
        <h1 className="text-lg font-semibold">Letter &amp; Vocabulary Calculator</h1>
        <button
          aria-label="Toggle dark mode"
          onClick={toggleDarkMode}
          className="px-3 py-2 rounded focus:outline-none focus:ring"
        >
          {/* Provide a simple icon switch for light/dark mode */}
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="flex-grow p-4">
        <CharacterCounter />
      </main>
    </div>
  );
};

export default App;