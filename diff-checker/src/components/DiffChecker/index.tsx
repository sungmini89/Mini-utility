import React, { useState, useEffect, useRef } from "react";
import type { DiffLine, ViewMode, HistoryItem } from "./types";
import { diffLines, computeStats } from "./utils";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";

/**
 * DiffChecker 컴포넌트는 두 텍스트를 비교하고 차이점을 시각화하는 도구입니다.
 * 분할/통합 뷰, 파일 업로드, 키보드 단축키, 복사 기능, 지속적인 히스토리를 지원합니다.
 *
 * @returns {JSX.Element} 텍스트 비교 인터페이스를 렌더링합니다.
 */
const DiffChecker: React.FC = () => {
  // 원본(왼쪽)과 수정된(오른쪽) 텍스트
  const [leftText, setLeftText] = useLocalStorage<string>(
    "diffChecker:left",
    ""
  );
  const [rightText, setRightText] = useLocalStorage<string>(
    "diffChecker:right",
    ""
  );
  // diff 결과와 통계
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState({ add: 0, delete: 0, change: 0 });
  // 변경사항(동일하지 않은)을 나타내는 diff 항목의 인덱스
  const [diffIndices, setDiffIndices] = useState<number[]>([]);
  // 네비게이션에 사용되는 현재 diff 인덱스
  const [currentDiff, setCurrentDiff] = useState(0);
  // 뷰 모드: 분할 또는 통합
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "diffChecker:viewMode",
    "split"
  );
  // 이전 비교의 히스토리
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "diffChecker:history",
    []
  );
  // diff 계산 중 로딩 표시기
  const [loading, setLoading] = useState(false);
  // 클립보드 훅
  const [copied, copy] = useClipboard();
  // 토스트 알림 상태
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // 네비게이션 시 scrollIntoView를 활성화하기 위한 diff 행 참조
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);

  // 텍스트가 변경될 때마다 diff 계산
  useEffect(() => {
    setLoading(true);
    const result = diffLines(leftText, rightText);
    setDiff(result);
    const stats = computeStats(result);
    setStats(stats);
    // 동일하지 않은 타입의 diff 인덱스 식별
    const indices: number[] = [];
    result.forEach((line, idx) => {
      if (line.type !== "equal") {
        indices.push(idx);
      }
    });
    setDiffIndices(indices);
    setCurrentDiff(0);
    setLoading(false);
  }, [leftText, rightText]);

  /**
   * 이전 차이점으로 이동합니다. 이미 첫 번째 차이점에 있다면
   * 마지막 차이점으로 돌아갑니다.
   *
   * @returns {void}
   */
  function prevDifference() {
    if (diffIndices.length === 0) return;
    setCurrentDiff((prev) => {
      const index = diffIndices.indexOf(prev);
      const newIndex =
        index > 0
          ? diffIndices[index - 1]
          : diffIndices[diffIndices.length - 1];
      return newIndex;
    });
  }

  /**
   * 다음 차이점으로 이동합니다. 끝에 도달하면 처음으로 돌아갑니다.
   *
   * @returns {void}
   */
  function nextDifference() {
    if (diffIndices.length === 0) return;
    setCurrentDiff((prev) => {
      const index = diffIndices.indexOf(prev);
      const newIndex =
        index < diffIndices.length - 1
          ? diffIndices[index + 1]
          : diffIndices[0];
      return newIndex;
    });
  }

  // 현재 diff가 변경될 때 해당 diff로 스크롤
  useEffect(() => {
    const ref = rowRefs.current[currentDiff];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentDiff]);

  /**
   * 분할 뷰와 통합 뷰 모드를 전환합니다.
   *
   * @returns {void}
   */
  function toggleView() {
    setViewMode((prev) => (prev === "split" ? "unified" : "split"));
  }

  /**
   * 현재 비교를 히스토리에 저장합니다. 최신 10개 항목만 유지합니다.
   *
   * @returns {void}
   */
  function saveToHistory() {
    const item: HistoryItem = {
      left: leftText,
      right: rightText,
      date: Date.now(),
      stats,
    };
    setHistory([item, ...history].slice(0, 10));
  }

  /**
   * 히스토리를 모두 삭제합니다.
   *
   * @returns {void}
   */
  function clearHistory() {
    setHistory([]);
    setToast({ message: "히스토리가 삭제되었습니다", type: "success" });
  }

  /**
   * 통합 diff를 클립보드에 복사합니다. 각 라인은 상태를 나타내는 접두사로 시작합니다:
   * '+'는 추가, '-'는 삭제, '~'는 변경을 나타냅니다. 동일한 라인은 공백으로 시작합니다.
   *
   * @returns {Promise<void>}
   */
  async function copyUnifiedDiff() {
    const lines = diff.map((entry) => {
      switch (entry.type) {
        case "add":
          return "+ " + (entry.textB ?? "");
        case "delete":
          return "- " + (entry.textA ?? "");
        case "change":
          return "~ " + (entry.textA ?? "") + " => " + (entry.textB ?? "");
        default:
          return "  " + (entry.textA ?? "");
      }
    });
    try {
      await copy(lines.join("\n"));
      setToast({
        message: "Diff가 클립보드에 복사되었습니다!",
        type: "success",
      });
    } catch (error) {
      setToast({ message: "복사에 실패했습니다", type: "error" });
    }
  }

  /**
   * 파일 업로드를 처리합니다. 선택된 파일을 텍스트로 읽고 해당 텍스트 상태를 업데이트합니다.
   * 읽기에 실패하면 토스트 메시지가 표시됩니다.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - 파일 입력 이벤트
   * @param {"left" | "right"} side - 파일을 업로드할 측면 (왼쪽 또는 오른쪽)
   * @returns {void}
   */
  function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (side === "left") {
        setLeftText(result);
      } else {
        setRightText(result);
      }
      setToast({ message: "파일이 로드되었습니다", type: "success" });
    };
    reader.onerror = () => {
      setToast({ message: "파일 읽기에 실패했습니다", type: "error" });
    };
    reader.readAsText(file);
  }

  // 키보드 단축키: Ctrl/Cmd+Shift+C로 통합 diff 복사, Alt+U로 뷰 전환,
  // Alt+N/Alt+P로 차이점 네비게이션
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copyUnifiedDiff();
      }
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === "u") {
          e.preventDefault();
          toggleView();
        } else if (key === "n") {
          e.preventDefault();
          nextDifference();
        } else if (key === "p") {
          e.preventDefault();
          prevDifference();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [diff, diffIndices, leftText, rightText]);

  // 토스트 메시지 자동 해제
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const toastBgClass =
    toast?.type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div>
      {/* 입력 컨트롤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <textarea
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring resize-y min-h-40"
            placeholder="왼쪽 텍스트를 입력하거나 업로드하세요…"
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
            aria-label="왼쪽 텍스트"
          />
          <label className="block">
            <span className="sr-only">왼쪽 파일 업로드</span>
            <input
              type="file"
              accept=".txt"
              onChange={(e) => handleFileUpload(e, "left")}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <textarea
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring resize-y min-h-40"
            placeholder="오른쪽 텍스트를 입력하거나 업로드하세요…"
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
            aria-label="오른쪽 텍스트"
          />
          <label className="block">
            <span className="sr-only">오른쪽 파일 업로드</span>
            <input
              type="file"
              accept=".txt"
              onChange={(e) => handleFileUpload(e, "right")}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
          </label>
        </div>
      </div>
      {/* 기능 설명 */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">
          📋 기능 설명
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700 dark:text-blue-300">
          <div className="space-y-2">
            <div>
              <span className="font-semibold">통합 뷰/분할 뷰:</span>
              <span className="ml-2">
                텍스트 비교를 분할 화면 또는 통합 화면으로 전환
              </span>
            </div>
            <div>
              <span className="font-semibold">이전/다음 차이:</span>
              <span className="ml-2">차이점 간 이동 (Alt+N, Alt+P 단축키)</span>
            </div>
            <div>
              <span className="font-semibold">복사:</span>
              <span className="ml-2">
                비교 결과를 클립보드에 복사 (Ctrl+Shift+C)
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">히스토리 저장:</span>
              <span className="ml-2">
                현재 비교를 히스토리에 저장 (최대 10개)
              </span>
            </div>
            <div>
              <span className="font-semibold">히스토리 삭제:</span>
              <span className="ml-2">모든 히스토리 항목을 삭제</span>
            </div>
            <div>
              <span className="font-semibold">파일 업로드:</span>
              <span className="ml-2">
                .txt 파일을 드래그하거나 선택하여 텍스트 로드
              </span>
            </div>
            <div>
              <span className="font-semibold">뷰 전환:</span>
              <span className="ml-2">Alt+U로 뷰 모드 빠른 전환</span>
            </div>
          </div>
        </div>
      </div>
      {/* 색상 설명 */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          색상 의미
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded border"></div>
            <span>추가된 부분</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded border"></div>
            <span>삭제된 부분</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded border"></div>
            <span>수정된 부분</span>
          </div>
        </div>
      </div>
      {/* 컨트롤 버튼과 통계 */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={toggleView}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
        >
          {viewMode === "split" ? "통합 뷰" : "분할 뷰"}
        </button>
        <button
          onClick={prevDifference}
          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring"
        >
          이전 차이
        </button>
        <button
          onClick={nextDifference}
          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring"
        >
          다음 차이
        </button>
        <button
          onClick={copyUnifiedDiff}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring"
        >
          복사
        </button>
        <button
          onClick={saveToHistory}
          className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring"
        >
          히스토리 저장
        </button>
        <button
          onClick={clearHistory}
          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring"
        >
          히스토리 삭제
        </button>
        {loading && <span className="ml-2 text-sm text-gray-500">로딩중…</span>}
        <span className="ml-auto text-sm">
          추가: {stats.add}, 삭제: {stats.delete}, 수정: {stats.change}
        </span>
      </div>
      {/* Diff 표시 */}
      {viewMode === "split" ? (
        <div className="w-full overflow-auto">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* 왼쪽 영역 */}
            <div className="space-y-0.5">
              {diff.map((entry, idx) => {
                const rowClass =
                  entry.type === "add"
                    ? "bg-green-100 dark:bg-green-900"
                    : entry.type === "delete"
                    ? "bg-red-100 dark:bg-red-900"
                    : entry.type === "change"
                    ? "bg-yellow-100 dark:bg-yellow-900"
                    : "";
                // 왼쪽 영역의 줄 번호 결정
                let lineNumber = 0;
                let count = 0;
                for (let i = 0; i <= idx; i++) {
                  const e = diff[i];
                  if (
                    e.type === "equal" ||
                    e.type === "delete" ||
                    e.type === "change"
                  )
                    count++;
                }
                return (
                  <div
                    key={idx}
                    ref={(el) => (rowRefs.current[idx] = el)}
                    className={`flex ${
                      idx === currentDiff ? "ring-2 ring-blue-400" : ""
                    }`}
                  >
                    <div
                      className={`w-12 px-1 text-right select-none ${rowClass}`}
                    >
                      {entry.type === "add" ? "" : count}
                    </div>
                    <pre
                      className={`flex-1 whitespace-pre-wrap break-words px-1 ${rowClass}`}
                    >
                      {entry.type === "add"
                        ? ""
                        : entry.type === "change"
                        ? entry.textA
                        : entry.textA}
                    </pre>
                  </div>
                );
              })}
            </div>
            {/* 오른쪽 영역 */}
            <div className="space-y-0.5">
              {diff.map((entry, idx) => {
                const rowClass =
                  entry.type === "add"
                    ? "bg-green-100 dark:bg-green-900"
                    : entry.type === "delete"
                    ? "bg-red-100 dark:bg-red-900"
                    : entry.type === "change"
                    ? "bg-yellow-100 dark:bg-yellow-900"
                    : "";
                // 오른쪽 영역의 줄 번호 결정
                let lineNumber = 0;
                let count = 0;
                for (let i = 0; i <= idx; i++) {
                  const e = diff[i];
                  if (
                    e.type === "equal" ||
                    e.type === "add" ||
                    e.type === "change"
                  )
                    count++;
                }
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      idx === currentDiff ? "ring-2 ring-blue-400" : ""
                    }`}
                  >
                    <div
                      className={`w-12 px-1 text-right select-none ${rowClass}`}
                    >
                      {entry.type === "delete" ? "" : count}
                    </div>
                    <pre
                      className={`flex-1 whitespace-pre-wrap break-words px-1 ${rowClass}`}
                    >
                      {entry.type === "delete"
                        ? ""
                        : entry.type === "change"
                        ? entry.textB
                        : entry.textB}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // 통합 뷰
        <div className="space-y-0.5 text-sm">
          {diff.map((entry, idx) => {
            const rowClass =
              entry.type === "add"
                ? "bg-green-100 dark:bg-green-900"
                : entry.type === "delete"
                ? "bg-red-100 dark:bg-red-900"
                : entry.type === "change"
                ? "bg-yellow-100 dark:bg-yellow-900"
                : "";
            return (
              <div
                key={idx}
                ref={(el) => (rowRefs.current[idx] = el)}
                className={`${
                  idx === currentDiff ? "ring-2 ring-blue-400" : ""
                }`}
              >
                {entry.type === "equal" && (
                  <div className={`flex ${rowClass}`}>
                    <span className="w-6 text-gray-500 select-none"> </span>
                    <pre className="flex-1 whitespace-pre-wrap break-words px-1">
                      {entry.textA}
                    </pre>
                  </div>
                )}
                {entry.type === "add" && (
                  <div className={`flex ${rowClass}`}>
                    <span className="w-6 text-green-600 select-none">+</span>
                    <pre className="flex-1 whitespace-pre-wrap break-words px-1">
                      {entry.textB}
                    </pre>
                  </div>
                )}
                {entry.type === "delete" && (
                  <div className={`flex ${rowClass}`}>
                    <span className="w-6 text-red-600 select-none">-</span>
                    <pre className="flex-1 whitespace-pre-wrap break-words px-1">
                      {entry.textA}
                    </pre>
                  </div>
                )}
                {entry.type === "change" && (
                  <div className={`flex flex-col ${rowClass}`}>
                    <div className="flex">
                      <span className="w-6 text-yellow-600 select-none">~</span>
                      <pre className="flex-1 whitespace-pre-wrap break-words px-1">
                        {entry.textA} ⇒ {entry.textB}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* 히스토리 패널 */}
      <div className="mt-6">
        <h2 className="text-md font-semibold mb-2">비교 히스토리</h2>
        <ul className="space-y-2 max-h-48 overflow-auto text-sm">
          {history.length === 0 && (
            <li className="text-gray-500">히스토리가 없습니다.</li>
          )}
          {history.map((item) => (
            <li
              key={item.date}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded"
            >
              <div className="flex justify-between">
                <div>
                  <span className="font-semibold">
                    추가 {item.stats.add}, 삭제 {item.stats.delete}, 수정{" "}
                    {item.stats.change}
                  </span>
                </div>
                <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {new Date(item.date).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
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
      {copied && <span className="sr-only">복사됨</span>}
    </div>
  );
};

export default DiffChecker;
