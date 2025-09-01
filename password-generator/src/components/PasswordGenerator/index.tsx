import React, { useEffect, useState } from "react";
import type { GeneratorOptions, HistoryItem, ToastType } from "./types";
import { generatePasswords } from "./utils";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";

/**
 * 기본 생성 옵션 - 초기 로드 시 사용
 * 12자리 비밀번호를 생성하며 대문자, 소문자, 숫자를 포함
 */
const DEFAULT_OPTIONS: GeneratorOptions = {
  length: 12,
  includeUpper: true,
  includeLower: true,
  includeNumbers: true,
  includeSpecial: false,
  excludeSimilar: false,
  count: 1,
};

/**
 * 비밀번호 생성기 컴포넌트
 *
 * 다양한 옵션을 통해 안전한 비밀번호를 생성하는 인터페이스를 제공합니다.
 * 사용자는 길이와 문자 카테고리를 조정하고, 한 번에 여러 개의 비밀번호를 생성할 수 있으며,
 * 클립보드로 복사하고 생성 세션을 히스토리에 저장할 수 있습니다.
 * 설정과 히스토리는 localStorage에 지속적으로 저장됩니다.
 *
 * @returns {JSX.Element} 비밀번호 생성기 UI
 *
 * @example
 * ```tsx
 * <PasswordGenerator />
 * ```
 *
 * @since 1.0.0
 * @author 비밀번호 도구 팀
 */
const PasswordGenerator: React.FC = () => {
  // 옵션과 생성된 비밀번호를 localStorage에 지속 저장
  const [options, setOptions] = useLocalStorage<GeneratorOptions>(
    "passwordGenerator:options",
    DEFAULT_OPTIONS
  );
  const [passwords, setPasswords] = useLocalStorage<string[]>(
    "passwordGenerator:passwords",
    []
  );
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "passwordGenerator:history",
    []
  );
  // 생성 중 로딩 상태 표시
  const [loading, setLoading] = useState(false);
  // 클립보드 훅
  const [copied, copy] = useClipboard();
  // 토스트 알림 상태
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  /**
   * 키보드 단축키 처리
   * - Alt+G: 비밀번호 생성
   * - Ctrl/Cmd+Shift+C: 모든 비밀번호 복사
   * - Ctrl/Cmd+Shift+S: 히스토리에 저장
   * - Ctrl/Cmd+Shift+R: 옵션 초기화
   */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
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
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "c":
            e.preventDefault();
            handleCopyAll();
            break;
          case "s":
            e.preventDefault();
            handleSaveHistory();
            break;
          case "r":
            e.preventDefault();
            handleReset();
            break;
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, passwords, history]);

  /**
   * 현재 옵션을 기반으로 비밀번호를 생성합니다.
   * 최소 하나의 문자 카테고리가 선택되었는지와 길이가 충분한지 검증합니다.
   * 비밀번호 상태를 업데이트하고 오류는 토스트로 표시합니다.
   *
   * @throws {Error} 비밀번호 생성 중 오류 발생 시
   */
  function handleGenerate() {
    // 최소 하나의 유형이 선택되었는지 검증
    if (
      !options.includeUpper &&
      !options.includeLower &&
      !options.includeNumbers &&
      !options.includeSpecial
    ) {
      setToast({
        message: "최소 하나의 문자 유형을 선택해주세요.",
        type: "error",
      });
      return;
    }
    // 길이가 선택된 카테고리 수보다 큰지 검증
    const selectedCount = [
      options.includeUpper,
      options.includeLower,
      options.includeNumbers,
      options.includeSpecial,
    ].filter(Boolean).length;
    if (options.length < selectedCount) {
      setToast({
        message: `길이는 선택된 모든 카테고리를 포함하기 위해 최소 ${selectedCount}자여야 합니다.`,
        type: "error",
      });
      return;
    }
    setLoading(true);
    try {
      const generated = generatePasswords(options);
      if (generated.length === 0) {
        setToast({
          message: "비밀번호 생성에 실패했습니다. 옵션을 확인해주세요.",
          type: "error",
        });
      } else {
        setPasswords(generated);
      }
    } catch (error) {
      console.warn("Password generation error", error);
      setToast({
        message: "생성 중 예상치 못한 오류가 발생했습니다.",
        type: "error",
      });
    } finally {
      // 로딩 상태 표시를 위한 약간의 지연
      setTimeout(() => setLoading(false), 150);
    }
  }

  /**
   * 단일 비밀번호를 클립보드에 복사하고 토스트를 표시합니다.
   * 목록의 개별 복사 버튼에서 사용됩니다.
   *
   * @param {string} pw - 복사할 비밀번호
   */
  async function handleCopyPassword(pw: string) {
    if (!pw) return;
    try {
      await copy(pw);
      setToast({ message: "비밀번호가 복사되었습니다!", type: "success" });
    } catch (error) {
      setToast({ message: "복사에 실패했습니다", type: "error" });
    }
  }

  /**
   * 모든 생성된 비밀번호를 줄바꿈으로 구분된 텍스트로 복사합니다.
   */
  async function handleCopyAll() {
    if (passwords.length === 0) return;
    try {
      await copy(passwords.join("\n"));
      setToast({ message: "모든 비밀번호가 복사되었습니다!", type: "success" });
    } catch (error) {
      setToast({ message: "복사에 실패했습니다", type: "error" });
    }
  }

  /**
   * 현재 생성된 비밀번호를 사용된 옵션과 함께 히스토리에 저장합니다.
   * 최근 10개 항목만 유지합니다.
   */
  function handleSaveHistory() {
    if (passwords.length === 0) return;
    const entry: HistoryItem = {
      date: Date.now(),
      options,
      passwords,
    };
    setHistory([entry, ...history].slice(0, 10));
    setToast({ message: "히스토리에 저장되었습니다", type: "success" });
  }

  /**
   * 생성기 옵션을 기본값으로 초기화하고 생성된 비밀번호를 지웁니다.
   */
  function handleReset() {
    setOptions(DEFAULT_OPTIONS);
    setPasswords([]);
    setToast({ message: "옵션이 초기화되었습니다", type: "success" });
  }

  // 2초 후 토스트 자동 해제
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  /**
   * 불린 옵션 값을 토글하는 헬퍼 함수
   *
   * @param {keyof GeneratorOptions} key - 토글할 옵션 키
   */
  const toggleOption = (key: keyof GeneratorOptions) => {
    setOptions({ ...options, [key]: !options[key] });
  };

  return (
    <div className="space-y-6" role="main" aria-label="비밀번호 생성기">
      {/* 옵션 패널 */}
      <section
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow"
        aria-labelledby="options-heading"
      >
        <h2 id="options-heading" className="text-md font-semibold mb-3">
          옵션
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4"
              checked={options.includeUpper}
              onChange={() => toggleOption("includeUpper")}
              aria-describedby="uppercase-desc"
            />
            <span>대문자 포함 (A‑Z)</span>
            <span id="uppercase-desc" className="sr-only">
              A부터 Z까지의 대문자 포함
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4"
              checked={options.includeLower}
              onChange={() => toggleOption("includeLower")}
              aria-describedby="lowercase-desc"
            />
            <span>소문자 포함 (a‑z)</span>
            <span id="lowercase-desc" className="sr-only">
              a부터 z까지의 소문자 포함
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4"
              checked={options.includeNumbers}
              onChange={() => toggleOption("includeNumbers")}
              aria-describedby="numbers-desc"
            />
            <span>숫자 포함 (0‑9)</span>
            <span id="numbers-desc" className="sr-only">
              0부터 9까지의 숫자 포함
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4"
              checked={options.includeSpecial}
              onChange={() => toggleOption("includeSpecial")}
              aria-describedby="special-desc"
            />
            <span>특수문자 포함 (!@#…)</span>
            <span id="special-desc" className="sr-only">
              느낌표, 골뱅이, 샵 등의 특수문자 포함
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4"
              checked={options.excludeSimilar}
              onChange={() => toggleOption("excludeSimilar")}
              aria-describedby="similar-desc"
            />
            <span>유사 문자 제외 (0,O,l,1)</span>
            <span id="similar-desc" className="sr-only">
              숫자 0, 대문자 O, 소문자 l, 숫자 1과 같은 유사한 문자 제외
            </span>
          </label>
        </div>
        {/* 길이 슬라이더 */}
        <div className="mt-4">
          <label htmlFor="length" className="block text-sm font-medium mb-1">
            길이: {options.length}
          </label>
          <input
            id="length"
            type="range"
            min={8}
            max={128}
            step={1}
            value={options.length}
            onChange={(e) =>
              setOptions({ ...options, length: Number(e.target.value) })
            }
            className="w-full"
            aria-describedby="length-desc"
          />
          <div id="length-desc" className="sr-only">
            8자에서 128자까지의 비밀번호 길이
          </div>
        </div>
        {/* 개수 입력 */}
        <div className="mt-4">
          <label htmlFor="count" className="block text-sm font-medium mb-1">
            생성할 비밀번호 개수: {options.count}
          </label>
          <input
            id="count"
            type="number"
            min={1}
            max={10}
            value={options.count}
            onChange={(e) =>
              setOptions({
                ...options,
                count: Math.max(1, Math.min(10, Number(e.target.value))),
              })
            }
            className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring bg-white dark:bg-gray-700"
            aria-describedby="count-desc"
          />
          <div id="count-desc" className="sr-only">
            1개에서 10개까지의 비밀번호 생성 개수
          </div>
        </div>
        {/* 생성 버튼 */}
        <div className="mt-4">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
            disabled={loading}
            aria-describedby="generate-desc"
          >
            {loading ? "생성 중…" : "생성하기"}
          </button>
          <div id="generate-desc" className="sr-only">
            현재 설정으로 비밀번호를 생성합니다. 키보드 단축키: Alt+G
          </div>
        </div>
      </section>

      {/* 생성된 비밀번호 목록 */}
      <section
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow"
        aria-labelledby="passwords-heading"
      >
        <h2 id="passwords-heading" className="text-md font-semibold mb-3">
          생성된 비밀번호
        </h2>
        {passwords.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            아직 생성된 비밀번호가 없습니다.
          </p>
        )}
        <ul className="space-y-2" role="list" aria-label="생성된 비밀번호 목록">
          {passwords.map((pw, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-white dark:bg-gray-700 px-3 py-2 rounded"
            >
              <code
                className="break-all text-sm"
                aria-label={`비밀번호 ${idx + 1}`}
              >
                {pw}
              </code>
              <button
                onClick={() => handleCopyPassword(pw)}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                aria-label={`비밀번호 ${idx + 1} 복사`}
              >
                복사
              </button>
            </li>
          ))}
        </ul>
        {passwords.length > 0 && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring text-sm"
              aria-describedby="copy-all-desc"
            >
              모두 복사
            </button>
            <div id="copy-all-desc" className="sr-only">
              모든 생성된 비밀번호를 복사합니다. 키보드 단축키: Ctrl+Shift+C
            </div>
            <button
              onClick={handleSaveHistory}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring text-sm"
              aria-describedby="save-desc"
            >
              저장
            </button>
            <div id="save-desc" className="sr-only">
              현재 비밀번호를 히스토리에 저장합니다. 키보드 단축키: Ctrl+Shift+S
            </div>
          </div>
        )}
      </section>

      {/* 히스토리 목록 */}
      <section
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow"
        aria-labelledby="history-heading"
      >
        <h2 id="history-heading" className="text-md font-semibold mb-3">
          히스토리
        </h2>
        <ul
          className="space-y-2 max-h-48 overflow-auto text-sm"
          role="list"
          aria-label="비밀번호 생성 히스토리"
        >
          {history.length === 0 && (
            <li className="text-gray-500 dark:text-gray-400">
              아직 히스토리가 없습니다.
            </li>
          )}
          {history.map((item) => (
            <li
              key={item.date}
              className="p-2 bg-white dark:bg-gray-700 rounded"
            >
              <div className="flex justify-between">
                <span>
                  {item.passwords.length}개 — 길이 {item.options.length}자
                </span>
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {new Date(item.date).toLocaleString()}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                {item.passwords.slice(0, 2).join(", ")}
                {item.passwords.length > 2 ? "…" : ""}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 토스트 알림 */}
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
      {copied && <span className="sr-only">복사됨</span>}
    </div>
  );
};

export default PasswordGenerator;
