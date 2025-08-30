import React, { useState, useEffect } from "react";
import type { LoremOptions, HistoryItem } from "./types";
import { generateLorem } from "./utils";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";

/**
 * Lorem Ipsum 텍스트 생성기의 메인 컴포넌트
 *
 * 이 컴포넌트는 사용자가 설정한 옵션에 따라 영어 또는 한국어 더미 텍스트를 생성하고,
 * 생성된 텍스트를 관리하는 모든 기능을 제공합니다.
 *
 * 주요 기능:
 * - 문단, 문장, 단어 개수 설정
 * - 영어/한국어 언어 선택
 * - HTML 태그 포함 옵션 (p, h1, h2, h3, li)
 * - 리스트 형식 생성
 * - 커스텀 시작 텍스트 설정
 * - 클립보드 복사 기능
 * - 생성 히스토리 관리 (최근 10개)
 * - 키보드 단축키 지원 (Alt+G: 생성, Ctrl+Shift+C: 복사)
 * - 다크모드 지원
 * - localStorage를 통한 설정 및 히스토리 저장
 *
 * 상태 관리:
 * - options: 사용자 설정 옵션 (localStorage에 저장)
 * - output: 생성된 텍스트 내용
 * - history: 생성 히스토리 배열 (localStorage에 저장)
 * - loading: 텍스트 생성 중 로딩 상태
 * - toast: 사용자 피드백을 위한 토스트 알림
 *
 * 사용자 경험:
 * - 실시간 미리보기 (옵션 변경 시 자동 업데이트)
 * - 로딩 상태 표시
 * - 성공/실패 토스트 알림
 * - 접근성을 위한 스크린 리더 지원
 *
 * @returns {JSX.Element} Lorem Ipsum 생성기 UI
 */
const LoremGenerator: React.FC = () => {
  // Default options used when none are stored.  Provides a sensible
  // starting point for the generator.
  const defaultOptions: LoremOptions = {
    paragraphs: 2,
    sentences: 3,
    words: 8,
    language: "eng",
    includeHtml: false,
    htmlTag: "p",
    list: false,
    customStart: "",
  };

  // Persist options and history in localStorage so that they remain
  // available between sessions.  Keys are scoped to this utility to
  // avoid conflicts with other tools in the project.
  const [options, setOptions] = useLocalStorage<LoremOptions>(
    "loremGenerator:options",
    defaultOptions
  );
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "loremGenerator:history",
    []
  );

  // The generated lorem ipsum content.  Updated whenever the user
  // changes options or explicitly generates new text.  Stored
  // separately from the options so that history entries can keep
  // their own snapshot of the text.
  const [output, setOutput] = useState<string>("");
  // Tracks whether the component is currently generating content.
  const [loading, setLoading] = useState<boolean>(false);
  // Clipboard helper and flag indicating a recent copy.  The flag is
  // used to conditionally render a screen reader friendly message.
  const [copied, copy] = useClipboard();
  // Toast notifications for user feedback.  Automatically removed
  // after a short delay via a side effect.
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Recompute the output whenever the options change.  This keeps
  // the preview in sync with the current selections but does not
  // update the history.  A loading indicator is shown briefly.
  useEffect(() => {
    let isMounted = true;
    // Show loading state only if there is existing output to avoid
    // flashing the indicator on initial render.
    if (output) {
      setLoading(true);
    }
    // Generate new lorem text synchronously.  If heavy
    // computation becomes necessary the generation could be moved
    // off the main thread.
    const newText = generateLorem(options);
    if (isMounted) {
      setOutput(newText);
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  // Automatically clear toast messages after 2 seconds.  This is
  // isolated in its own effect so that new messages reset the
  // timeout.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Handle generating new lorem text on demand.  Adds a new entry
  // into history with the current options and generated content.
  function handleGenerate() {
    setLoading(true);
    try {
      const newText = generateLorem(options);
      setOutput(newText);
      const newEntry: HistoryItem = {
        text: newText,
        options,
        date: Date.now(),
      };
      setHistory([newEntry, ...history].slice(0, 10));
      setToast({ message: "Lorem generated", type: "success" });
    } catch (error) {
      console.error("Error generating lorem", error);
      setToast({ message: "Failed to generate lorem", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Copy the output text to the clipboard.  Shows a toast on
  // success or failure.  If there is no output nothing happens.
  async function handleCopy() {
    if (!output) return;
    try {
      await copy(output);
      setToast({ message: "Copied to clipboard!", type: "success" });
    } catch {
      setToast({ message: "Copy failed", type: "error" });
    }
  }

  // Update a numeric option with boundary checks.  Ensures that
  // values remain positive and within reasonable limits.
  function updateNumberOption(key: keyof LoremOptions, value: number) {
    if (value < 1) value = 1;
    // Put an arbitrary upper bound to prevent extreme inputs.
    if (value > 100) value = 100;
    setOptions((prev) => ({ ...prev, [key]: value }));
  }

  // Generic handler for toggling boolean options.
  function toggleOption(key: keyof LoremOptions) {
    setOptions((prev) => ({ ...prev, [key]: !(prev as any)[key] }));
  }

  // Keyboard shortcuts: Alt+G to generate, Ctrl/Cmd+Shift+C to copy.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      }
      if (
        e.altKey &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        e.key.toLowerCase() === "g"
      ) {
        e.preventDefault();
        handleGenerate();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Determine background color for toast based on its type.
  const toastBg = toast?.type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Option controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="paragraphs" className="text-sm font-medium mb-1">
            Paragraphs
          </label>
          <input
            id="paragraphs"
            type="number"
            min="1"
            max="10"
            value={options.paragraphs}
            onChange={(e) =>
              updateNumberOption("paragraphs", Number(e.target.value))
            }
            className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="sentences" className="text-sm font-medium mb-1">
            Sentences per paragraph
          </label>
          <input
            id="sentences"
            type="number"
            min="1"
            max="10"
            value={options.sentences}
            onChange={(e) =>
              updateNumberOption("sentences", Number(e.target.value))
            }
            className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="words" className="text-sm font-medium mb-1">
            Words per sentence
          </label>
          <input
            id="words"
            type="number"
            min="1"
            max="20"
            value={options.words}
            onChange={(e) =>
              updateNumberOption("words", Number(e.target.value))
            }
            className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Language</label>
          <div className="flex items-center space-x-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="language"
                value="eng"
                checked={options.language === "eng"}
                onChange={() =>
                  setOptions((prev) => ({ ...prev, language: "eng" }))
                }
              />
              <span className="ml-1">English</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="language"
                value="kor"
                checked={options.language === "kor"}
                onChange={() =>
                  setOptions((prev) => ({ ...prev, language: "kor" }))
                }
              />
              <span className="ml-1">Korean</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col sm:col-span-2">
          <label htmlFor="customStart" className="text-sm font-medium mb-1">
            Custom start text
          </label>
          <input
            id="customStart"
            type="text"
            value={options.customStart}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, customStart: e.target.value }))
            }
            placeholder="Start with custom words..."
            className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="flex items-center space-x-4 sm:col-span-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.includeHtml}
              onChange={() => toggleOption("includeHtml")}
            />
            <span className="ml-1">Include HTML tags</span>
          </label>
          {options.includeHtml && (
            <>
              <label htmlFor="tag" className="text-sm font-medium ml-2">
                Tag
              </label>
              <select
                id="tag"
                value={options.htmlTag}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, htmlTag: e.target.value }))
                }
                className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring"
              >
                <option value="p">p</option>
                <option value="h1">h1</option>
                <option value="h2">h2</option>
                <option value="h3">h3</option>
                <option value="li">li</option>
              </select>
            </>
          )}
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={options.list}
              onChange={() => toggleOption("list")}
            />
            <span className="ml-1">List format</span>
          </label>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
        >
          Generate
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring"
        >
          Copy
        </button>
        {loading && (
          <span className="ml-2 text-sm text-gray-500">Generating…</span>
        )}
      </div>
      {/* Preview */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 whitespace-pre-wrap break-words min-h-[10rem]">
        {output || (
          <span className="text-gray-500">
            Your generated text will appear here.
          </span>
        )}
      </div>
      {/* History */}
      <div className="mt-6">
        <h2 className="text-md font-semibold mb-2">Generation History</h2>
        <ul className="space-y-2 max-h-40 overflow-auto text-sm">
          {history.length === 0 && (
            <li className="text-gray-500">No history yet.</li>
          )}
          {history.map((item) => (
            <li
              key={item.date}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded"
            >
              <div className="flex justify-between">
                <span className="mr-2 truncate max-w-[70%]">
                  {item.text.slice(0, 60)}
                  {item.text.length > 60 ? "…" : ""}
                </span>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(item.date).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Toast notifications */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toastBg}`}
        >
          {toast.message}
        </div>
      )}
      {copied && <span className="sr-only">Copied</span>}
    </div>
  );
};

export default LoremGenerator;
