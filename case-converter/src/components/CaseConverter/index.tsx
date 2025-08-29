import React, { useState, useEffect } from "react";
import type { CaseOption, HistoryItem } from "./types";
import { convert } from "./utils";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";

// Define the list of conversion options.  The order here dictates
// keyboard shortcuts (Alt+1, Alt+2, …) and button order.
const OPTIONS: CaseOption[] = [
  "UPPERCASE",
  "lowercase",
  "Title Case",
  "Sentence case",
  "camelCase",
  "PascalCase",
  "snake_case",
  "kebab-case",
  "InVeRsE CaSe",
];

/**
 * 케이스 변환기 메인 컴포넌트
 *
 * 사용자가 텍스트를 다양한 명명 규칙으로 변환할 수 있는 도구를 렌더링합니다.
 * 현재 입력, 선택된 옵션, 변환 히스토리를 localStorage에 유지하고,
 * 복사/붙여넣기를 지원하며 빠른 접근을 위한 키보드 단축키를 제공합니다.
 *
 * @returns JSX.Element - 케이스 변환기 UI
 */
const CaseConverter: React.FC = () => {
  // Persist input text between sessions
  const [input, setInput] = useLocalStorage<string>("caseConverter:input", "");
  // Selected conversion option; default to UPPERCASE
  const [option, setOption] = useState<CaseOption>("UPPERCASE");
  // Output text derived from input and selected option
  const [output, setOutput] = useState<string>(() =>
    convert(input, "UPPERCASE")
  );
  // Conversion history persisted in localStorage
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "caseConverter:history",
    []
  );
  // Copy hook for clipboard interactions
  const [copied, copy] = useClipboard();
  // Toast message state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Update output whenever input or selected option changes
  useEffect(() => {
    setOutput(convert(input, option));
  }, [input, option]);

  /**
   * 새로운 옵션이 선택되었을 때 변환을 트리거합니다.
   * 변환을 히스토리 목록에 기록하고 localStorage를 업데이트합니다.
   *
   * @param newOption - 새로 선택된 케이스 변환 옵션
   */
  function handleConvert(newOption: CaseOption) {
    setOption(newOption);
    const newOutput = convert(input, newOption);
    setOutput(newOutput);
    const item: HistoryItem = {
      option: newOption,
      input,
      output: newOutput,
      date: Date.now(),
    };
    setHistory([item, ...history].slice(0, 10)); // keep latest 10 entries
  }

  /**
   * 현재 출력 텍스트를 클립보드에 복사하고 토스트를 표시합니다.
   *
   * @returns Promise<void>
   */
  async function handleCopy() {
    if (!output) return;
    try {
      await copy(output);
      setToast({ message: "복사되었습니다!", type: "success" });
    } catch (error) {
      setToast({ message: "복사에 실패했습니다", type: "error" });
    }
  }

  /**
   * 클립보드의 텍스트를 입력 영역에 붙여넣습니다.
   * 브라우저가 클립보드 읽기를 허용하지 않으면 토스트로 사용자에게 알립니다.
   *
   * @returns Promise<void>
   */
  async function handlePaste() {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip !== undefined) {
        setInput(clip);
        setToast({ message: "붙여넣기 완료!", type: "success" });
      }
    } catch (error) {
      console.warn("Clipboard paste failed", error);
      setToast({ message: "붙여넣기를 사용할 수 없습니다", type: "error" });
    }
  }

  /**
   * 키보드 단축키를 설정합니다.
   * 사용자가 빠르게 케이스 변환을 선택할 수 있습니다:
   * - Alt+1..Alt+9: 케이스 변환 옵션 선택
   * - Ctrl/Cmd+Shift+C: 결과 복사
   * - Ctrl/Cmd+Shift+R: 입력 초기화
   *
   * 리스너는 한 번만 연결되고 컴포넌트 언마운트 시 정리됩니다.
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
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      }
      // Clear shortcut: Ctrl/Cmd + Shift + R
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        setInput("");
        setToast({ message: "초기화되었습니다!", type: "success" });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, option, history]);

  /**
   * 토스트를 2초 후 자동으로 숨깁니다.
   */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const toastBgClass =
    toast?.type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div translate="no">
      {/* Input/Output text areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring resize-y min-h-40"
          placeholder="입력 텍스트를 입력하세요…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Input text"
          translate="no"
        />
        <textarea
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring resize-y min-h-40"
          placeholder="변환된 텍스트가 여기에 표시됩니다"
          value={output}
          readOnly
          aria-label="Output text"
          translate="no"
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
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
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
          복사
        </button>
        <button
          onClick={handlePaste}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring"
        >
          붙여넣기
        </button>
      </div>
      {/* History list */}
      <div className="mt-6">
        <h2 className="text-md font-semibold mb-2" translate="no">
          변환 히스토리
        </h2>
        <ul className="space-y-2 max-h-48 overflow-auto">
          {history.length === 0 && (
            <li className="text-sm text-gray-500" translate="no">
              히스토리가 없습니다.
            </li>
          )}
          {history.map((item) => (
            <li
              key={item.date}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm flex justify-between items-start"
              translate="no"
            >
              <div translate="no">
                <span className="font-semibold mr-2">{item.option}:</span>
                <span>
                  {item.output.slice(0, 50)}
                  {item.output.length > 50 ? "…" : ""}
                </span>
              </div>
              <span
                className="text-xs text-gray-400 ml-2 whitespace-nowrap"
                translate="no"
              >
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
          translate="no"
        >
          {toast.message}
        </div>
      )}
      {copied && (
        <span className="sr-only" translate="no">
          복사됨
        </span>
      )}
    </div>
  );
};

export default CaseConverter;
