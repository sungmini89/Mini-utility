import React, { useState, useEffect } from 'react';
import type { CaseOption, HistoryItem } from './types';
import { convert } from './utils';
import useLocalStorage from '../../hooks/useLocalStorage';
import useClipboard from '../../hooks/useClipboard';

// Define the list of conversion options.  The order here dictates
// keyboard shortcuts (Alt+1, Alt+2, …) and button order.
const OPTIONS: CaseOption[] = [
  'UPPERCASE',
  'lowercase',
  'Title Case',
  'Sentence case',
  'camelCase',
  'PascalCase',
  'snake_case',
  'kebab-case',
  'InVeRsE CaSe'
];

/**
 * CaseConverter renders a text transformation tool allowing users to
 * convert arbitrary text into various naming conventions.  It maintains
 * the current input, selected option and conversion history in
 * localStorage, supports copy/paste and exposes keyboard shortcuts for
 * quick access.
 */
const CaseConverter: React.FC = () => {
  // Persist input text between sessions
  const [input, setInput] = useLocalStorage<string>('caseConverter:input', '');
  // Selected conversion option; default to UPPERCASE
  const [option, setOption] = useState<CaseOption>('UPPERCASE');
  // Output text derived from input and selected option
  const [output, setOutput] = useState<string>(() => convert(input, 'UPPERCASE'));
  // Conversion history persisted in localStorage
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('caseConverter:history', []);
  // Copy hook for clipboard interactions
  const [copied, copy] = useClipboard();
  // Toast message state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Update output whenever input or selected option changes
  useEffect(() => {
    setOutput(convert(input, option));
  }, [input, option]);

  /**
   * Trigger a conversion when a new option is selected.  Also records
   * the conversion into the history list and updates localStorage.
   */
  function handleConvert(newOption: CaseOption) {
    setOption(newOption);
    const newOutput = convert(input, newOption);
    setOutput(newOutput);
    const item: HistoryItem = {
      option: newOption,
      input,
      output: newOutput,
      date: Date.now()
    };
    setHistory([item, ...history].slice(0, 10)); // keep latest 10 entries
  }

  /**
   * Copy the current output to the clipboard and display a toast.
   */
  async function handleCopy() {
    if (!output) return;
    try {
      await copy(output);
      setToast({ message: 'Copied!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Copy failed', type: 'error' });
    }
  }

  /**
   * Paste text from the clipboard into the input area.  If the browser
   * does not allow clipboard reading the user is notified via a toast.
   */
  async function handlePaste() {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip !== undefined) {
        setInput(clip);
        setToast({ message: 'Pasted!', type: 'success' });
      }
    } catch (error) {
      console.warn('Clipboard paste failed', error);
      setToast({ message: 'Paste not available', type: 'error' });
    }
  }

  /**
   * Keyboard shortcuts allow users to quickly select case conversions
   * (Alt+1..Alt+9), copy the result (Ctrl/Cmd+Shift+C) and clear the input
   * (Ctrl/Cmd+Shift+R).  The listener is attached once and cleaned up on
   * component unmount.
   */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Select conversion via Alt + number
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const num = Number(e.key);
        if (num >= 1 && num <= OPTIONS.length) {
          e.preventDefault();
          handleConvert(OPTIONS[num - 1]);
        }
      }
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      // Copy shortcut: Ctrl/Cmd + Shift + C
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      }
      // Clear shortcut: Ctrl/Cmd + Shift + R
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setInput('');
        setToast({ message: 'Cleared!', type: 'success' });
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, option, history]);

  // Automatically hide toast after two seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const toastBgClass = toast?.type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div>
      {/* Input/Output text areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring resize-y min-h-40"
          placeholder="입력 텍스트를 입력하세요…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Input text"
        />
        <textarea
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring resize-y min-h-40"
          placeholder="변환된 텍스트가 여기에 표시됩니다"
          value={output}
          readOnly
          aria-label="Output text"
        />
      </div>
      {/* Conversion option buttons */}
      <div className="flex flex-wrap mt-4 gap-2">
        {OPTIONS.map((opt, idx) => (
          <button
            key={opt}
            onClick={() => handleConvert(opt)}
            className={`px-3 py-2 rounded text-sm focus:outline-none focus:ring transition-colors ${
              option === opt
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title={`Alt+${idx + 1}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {/* Actions: copy, paste */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
        >
          Copy
        </button>
        <button
          onClick={handlePaste}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring"
        >
          Paste
        </button>
      </div>
      {/* History list */}
      <div className="mt-6">
        <h2 className="text-md font-semibold mb-2">변환 히스토리</h2>
        <ul className="space-y-2 max-h-48 overflow-auto">
          {history.length === 0 && <li className="text-sm text-gray-500">히스토리가 없습니다.</li>}
          {history.map((item) => (
            <li
              key={item.date}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm flex justify-between items-start"
            >
              <div>
                <span className="font-semibold mr-2">{item.option}:</span>
                <span>{item.output.slice(0, 50)}{item.output.length > 50 ? '…' : ''}</span>
              </div>
              <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                {new Date(item.date).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* Toast notification */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toastBgClass}`}
        >
          {toast.message}
        </div>
      )}
      {copied && <span className="sr-only">Copied</span>}
    </div>
  );
};

export default CaseConverter;