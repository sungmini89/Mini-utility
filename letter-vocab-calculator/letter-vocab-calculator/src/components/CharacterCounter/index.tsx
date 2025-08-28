import React, { useEffect, useState } from "react";
import StatisticsCard from "../StatisticsCard";
import ProgressBar from "../ProgressBar";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";
import { computeStatistics, SNS_LIMITS } from "../../utils/common";

/**
 * CharacterCounter is the core component for the application.  It exposes a
 * textarea where users can enter arbitrary text and then surfaces a series
 * of statistics describing that input.  Additional features include
 * keyboard shortcuts, copy/paste operations, toast notifications and
 * persistent state via localStorage.
 */
const CharacterCounter: React.FC = () => {
  // Persist the text input to localStorage so it survives reloads.
  const [text, setText] = useLocalStorage<string>("letterCalc:text", "");
  // Maintain an object containing all computed statistics.
  const [stats, setStats] = useState(() => computeStatistics(text));
  // Use the clipboard hook for copy support; copied becomes true briefly after copying.
  const [copied, copy] = useClipboard();
  // Toast state used to display notifications to the user.  When null no toast is shown.
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // Loading state for clipboard operations
  const [isLoading, setIsLoading] = useState(false);

  // Recompute statistics whenever the underlying text changes.
  useEffect(() => {
    setStats(computeStatistics(text));
  }, [text]);

  // Attach keyboard shortcuts for common actions.  Users can copy
  // (Ctrl/Cmd + Shift + C) and clear the text (Ctrl/Cmd + Shift + R)
  // without taking their hands off the keyboard.  We clean up the
  // listener when the component unmounts to avoid leaks.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      // Copy shortcut
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      }
      // Reset shortcut
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleReset();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  /**
   * Copy the current text to the clipboard.  Show a toast on success
   * or display an error if copying fails.
   */
  async function handleCopy() {
    if (!text) return;
    setIsLoading(true);
    try {
      await copy(text);
      setToast({ message: "Copied to clipboard!", type: "success" });
    } catch (error) {
      console.error("Copy failed:", error);
      setToast({ message: "Failed to copy to clipboard", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Read text from the clipboard (if permissions allow) and insert it
   * into the textarea.  Errors are silently logged and surfaced via a toast.
   */
  async function handlePaste() {
    setIsLoading(true);
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) {
        setText(clip);
        setToast({ message: "Pasted from clipboard", type: "success" });
      } else {
        setToast({ message: "Clipboard is empty", type: "error" });
      }
    } catch (error) {
      console.warn("Clipboard paste failed", error);
      if (error instanceof Error && error.name === "NotAllowedError") {
        setToast({ message: "Clipboard permission denied", type: "error" });
      } else {
        setToast({ message: "Paste not available", type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Clear the current text and notify the user.
   */
  function handleReset() {
    setText("");
    setToast({ message: "Text cleared", type: "success" });
  }

  // Automatically dismiss toast messages after two seconds so they
  // do not accumulate.  Each new toast resets the timer.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Determine the background colour for the toast based on its type.  This
  // helps avoid inline conditional logic inside the JSX className which can
  // confuse patch parsing.
  const toastBgClass =
    toast?.type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div>
      <textarea
        className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none h-40 md:h-60 transition-colors"
        placeholder="Enter your text here to see real-time statistics..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Text input area for character counting"
        aria-describedby="text-stats"
        spellCheck="true"
        autoComplete="off"
        autoFocus={false}
      />
      {/* Statistics section */}
      <div
        id="text-stats"
        className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <StatisticsCard
          label="Characters (with spaces)"
          value={stats.charCount}
        />
        <StatisticsCard
          label="Characters (no spaces)"
          value={stats.charCountNoSpaces}
        />
        <StatisticsCard label="Words" value={stats.wordCount} />
        <StatisticsCard label="Sentences" value={stats.sentenceCount} />
        <StatisticsCard label="Paragraphs" value={stats.paragraphCount} />
        <StatisticsCard
          label="Reading Time (min)"
          value={stats.readingTimeMinutes.toFixed(1)}
        />
        <StatisticsCard label="Korean Characters" value={stats.koreanCount} />
        <StatisticsCard label="English Letters" value={stats.englishCount} />
      </div>
      {/* Progress bars for social network limits */}
      <div className="mt-4">
        {Object.entries(SNS_LIMITS).map(([platform, limit]) => (
          <ProgressBar
            key={platform}
            label={`${platform} characters`}
            value={stats.charCount}
            max={limit}
          />
        ))}
      </div>
      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text || isLoading}
        >
          {isLoading ? "Copying..." : "Copy"}
        </button>
        <button
          onClick={handlePaste}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Pasting..." : "Paste"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text || isLoading}
        >
          Clear
        </button>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">Keyboard shortcuts:</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <span>
            Copy:{" "}
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              Ctrl+Shift+C
            </kbd>
          </span>
          <span>
            Clear:{" "}
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              Ctrl+Shift+R
            </kbd>
          </span>
        </div>
      </div>
      {/* Toast notifications */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toastBgClass}`}
        >
          {toast.message}
        </div>
      )}
      {/* Hidden text for accessibility; reading out copy status via screen readers */}
      {copied && <span className="sr-only">Copied</span>}
    </div>
  );
};

export default CharacterCounter;
