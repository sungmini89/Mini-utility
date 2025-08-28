import React, { useEffect, useState } from "react";
import StatisticsCard from "../StatisticsCard";
import ProgressBar from "../ProgressBar";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";
import { computeStatistics, SNS_LIMITS } from "../../utils/common";

/**
 * CharacterCounter는 애플리케이션의 핵심 컴포넌트입니다.
 * 사용자가 임의의 텍스트를 입력할 수 있는 textarea를 제공하고,
 * 해당 입력에 대한 다양한 통계를 표시합니다.
 * 추가 기능으로는 키보드 단축키, 복사/붙여넣기 작업,
 * 토스트 알림, localStorage를 통한 상태 지속성이 포함됩니다.
 */
const CharacterCounter: React.FC = () => {
  // 텍스트 입력을 localStorage에 저장하여 새로고침 후에도 유지됩니다.
  const [text, setText] = useLocalStorage<string>("letterCalc:text", "");
  // 계산된 모든 통계를 포함하는 객체를 유지합니다.
  const [stats, setStats] = useState(() => computeStatistics(text));
  // 복사 지원을 위한 클립보드 훅을 사용합니다. 복사 후 copied가 잠시 true가 됩니다.
  const [copied, copy] = useClipboard();
  // 사용자에게 알림을 표시하는 토스트 상태입니다. null이면 토스트가 표시되지 않습니다.
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // 클립보드 작업을 위한 로딩 상태입니다.
  const [isLoading, setIsLoading] = useState(false);

  // 기본 텍스트가 변경될 때마다 통계를 다시 계산합니다.
  useEffect(() => {
    setStats(computeStatistics(text));
  }, [text]);

  // 일반적인 작업을 위한 키보드 단축키를 연결합니다. 사용자는
  // 복사 (Ctrl/Cmd + C), 붙여넣기 (Ctrl/Cmd + V), 텍스트 지우기 (Ctrl/Cmd + Shift + R)를
  // 키보드에서 손을 떼지 않고도 할 수 있습니다. 컴포넌트가 언마운트될 때
  // 리스너를 정리하여 메모리 누수를 방지합니다.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      // 복사 단축키
      if (isCtrlOrCmd && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      }
      // 붙여넣기 단축키
      if (isCtrlOrCmd && e.key.toLowerCase() === "v") {
        e.preventDefault();
        handlePaste();
      }
      // 초기화 단축키
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleReset();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  /**
   * 현재 텍스트를 클립보드에 복사합니다.
   * 성공 시 토스트를 표시하고, 실패 시 오류를 표시합니다.
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
   * 클립보드에서 텍스트를 읽어와서 (권한이 허용되는 경우)
   * textarea에 삽입합니다. 오류는 조용히 로깅되고 토스트를 통해 표시됩니다.
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
   * 현재 텍스트를 지우고 사용자에게 알립니다.
   */
  function handleReset() {
    setText("");
    setToast({ message: "Text cleared", type: "success" });
  }

  // 토스트 메시지를 2초 후 자동으로 해제하여
  // 누적되지 않도록 합니다. 각 새로운 토스트가 타이머를 재설정합니다.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // 토스트 타입에 따라 배경색을 결정합니다. 이는
  // JSX className 내부의 인라인 조건부 로직을 피하는 데 도움이 되어
  // 패치 파싱을 혼동시키지 않습니다.
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
      {/* 통계 섹션 */}
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
      {/* 소셜 네트워크 제한에 대한 진행률 바 */}
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
      {/* 작업 버튼들 */}
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
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text || isLoading}
        >
          Clear
        </button>
      </div>

      {/* 키보드 단축키 도움말 */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="mb-2">Keyboard shortcuts:</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <span>
            Copy:{" "}
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              Ctrl+C
            </kbd>
          </span>
          <span>
            Paste:{" "}
            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              Ctrl+V
            </kbd>
          </span>
        </div>
      </div>
      {/* 토스트 알림 */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toastBgClass}`}
        >
          {toast.message}
        </div>
      )}
      {/* 접근성을 위한 숨겨진 텍스트; 스크린 리더를 통해 복사 상태를 읽어냅니다 */}
      {copied && <span className="sr-only">Copied</span>}
    </div>
  );
};

export default CharacterCounter;
