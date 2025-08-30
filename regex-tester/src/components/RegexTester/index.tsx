import React, { useState, useEffect } from "react";
import type { MatchResult, SavedPattern, TokenDescription } from "./types";
import {
  buildRegex,
  getMatches,
  applyReplace,
  describePattern,
  REGEX_TEMPLATES,
  CHEAT_SHEET,
} from "./utils";
import useLocalStorage from "../../hooks/useLocalStorage";
import useClipboard from "../../hooks/useClipboard";

/**
 * 정규표현식 테스터 메인 컴포넌트
 *
 * 이 컴포넌트는 사용자가 정규표현식을 작성하고 테스트할 수 있는 완전한 웹 애플리케이션을 제공합니다.
 *
 * 주요 기능:
 * - 정규식 패턴 입력 및 검증
 * - 플래그 옵션 (g, i, m, s, u) 설정
 * - 실시간 매치 결과 표시
 * - 텍스트 치환 기능
 * - 패턴 저장/불러오기
 * - 정규식 템플릿 제공
 * - 치트시트 및 패턴 설명
 *
 * @returns {JSX.Element} 정규표현식 테스터 UI
 */
const RegexTester: React.FC = () => {
  // localStorage에 사용자 입력을 저장하여 새로고침 시 복원
  const [pattern, setPattern] = useLocalStorage<string>(
    "regexTester:pattern",
    ""
  );
  const [flags, setFlags] = useLocalStorage<string>("regexTester:flags", "g");
  const [testText, setTestText] = useLocalStorage<string>(
    "regexTester:testText",
    ""
  );
  const [replacement, setReplacement] = useLocalStorage<string>(
    "regexTester:replacement",
    ""
  );
  const [savedPatterns, setSavedPatterns] = useLocalStorage<SavedPattern[]>(
    "regexTester:saved",
    []
  );

  // 매치 결과, 설명 토큰, 컴파일 에러 등을 위한 로컬 상태
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [segments, setSegments] = useState<
    { text: string; matchIndex: number | null }[]
  >([]);
  const [description, setDescription] = useState<TokenDescription[]>([]);
  const [regexError, setRegexError] = useState<string | null>(null);
  const [replaceOutput, setReplaceOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [copied, copy] = useClipboard();

  // 패턴, 플래그 또는 테스트 텍스트가 변경될 때마다 정규식을 빌드하고 매치를 계산
  useEffect(() => {
    if (!pattern.trim()) {
      setMatches([]);
      setSegments([{ text: testText, matchIndex: null }]);
      setDescription([]);
      setRegexError(null);
      setReplaceOutput("");
      return;
    }

    const regex = buildRegex(pattern, flags);
    if (!regex) {
      setRegexError("Invalid regular expression");
      setMatches([]);
      setSegments([{ text: testText, matchIndex: null }]);
      setDescription([]);
      setReplaceOutput("");
      return;
    }

    setRegexError(null);
    const results = getMatches(regex, testText);
    setMatches(results);
    setDescription(describePattern(pattern));

    // 치환 결과 계산
    if (replacement.trim()) {
      const output = applyReplace(regex, testText, replacement);
      setReplaceOutput(output);
    } else {
      setReplaceOutput("");
    }

    // 하이라이트를 위한 세그먼트 생성
    if (results.length === 0) {
      setSegments([{ text: testText, matchIndex: null }]);
    } else {
      const segs: { text: string; matchIndex: number | null }[] = [];
      let lastIndex = 0;

      results.forEach((res, idx) => {
        if (res.index > lastIndex) {
          segs.push({
            text: testText.slice(lastIndex, res.index),
            matchIndex: null,
          });
        }
        segs.push({ text: res.match, matchIndex: idx });
        lastIndex = res.index + res.match.length;
      });

      if (lastIndex < testText.length) {
        segs.push({
          text: testText.slice(lastIndex),
          matchIndex: null,
        });
      }

      setSegments(segs);
    }
  }, [pattern, flags, testText, replacement]);

  // 키보드 단축키 처리
  useEffect(() => {
    /**
     * 키보드 이벤트 핸들러
     * @param {KeyboardEvent} e - 키보드 이벤트 객체
     */
    function handleKeyDown(e: KeyboardEvent) {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      }
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === "r") {
          e.preventDefault();
          // 효과를 트리거하여 테스트 재실행 (수동 트리거 불필요)
          setToast({ message: "Regex re-evaluated", type: "success" });
        } else if (key === "s") {
          e.preventDefault();
          saveCurrentPattern();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /**
   * 정규식 플래그를 토글합니다
   * @param {string} flag - 토글할 플래그 (g, i, m, s, u)
   */
  function toggleFlag(flag: string) {
    setFlags((prev) => {
      return prev.includes(flag)
        ? prev
            .split("")
            .filter((c) => c !== flag)
            .join("")
        : (prev + flag)
            .split("")
            .filter((c, i, arr) => arr.indexOf(c) === i) // 중복 제거
            .join("");
    });
  }

  /**
   * 현재 정규식 패턴을 저장합니다
   */
  function saveCurrentPattern() {
    if (!pattern) {
      setToast({ message: "Pattern is empty", type: "error" });
      return;
    }
    const exists = savedPatterns.some(
      (p) => p.pattern === pattern && p.flags === flags
    );
    if (exists) {
      setToast({ message: "Pattern already saved", type: "error" });
      return;
    }
    const newItem: SavedPattern = { pattern, flags, date: Date.now() };
    setSavedPatterns([newItem, ...savedPatterns].slice(0, 20));
    setToast({ message: "Pattern saved", type: "success" });
  }

  /**
   * 저장된 패턴을 불러옵니다
   * @param {SavedPattern} item - 불러올 저장된 패턴
   */
  function loadPattern(item: SavedPattern) {
    setPattern(item.pattern);
    setFlags(item.flags);
    setToast({ message: "Pattern loaded", type: "success" });
  }

  /**
   * 저장된 패턴을 삭제합니다
   * @param {SavedPattern} item - 삭제할 저장된 패턴
   */
  function deletePattern(item: SavedPattern) {
    setSavedPatterns(savedPatterns.filter((p) => p !== item));
    setToast({ message: "Pattern deleted", type: "success" });
  }

  /**
   * 정규식 템플릿을 적용합니다
   * @param {Object} tpl - 적용할 템플릿 객체
   * @param {string} tpl.pattern - 템플릿 패턴
   * @param {string} tpl.flags - 템플릿 플래그
   */
  function applyTemplate(tpl: { pattern: string; flags: string }) {
    setPattern(tpl.pattern);
    setFlags(tpl.flags);
    setToast({ message: `${tpl.pattern} template applied`, type: "success" });
  }

  /**
   * 치환 결과를 클립보드에 복사합니다
   */
  async function handleCopy() {
    if (!replaceOutput) return;
    try {
      await copy(replaceOutput);
      setToast({ message: "Copied to clipboard!", type: "success" });
    } catch {
      setToast({ message: "Copy failed", type: "error" });
    }
  }

  // 토스트 배경색 결정
  const toastBg = toast?.type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div className="max-w-5xl mx-auto">
      {/* 정규식 입력 및 옵션 */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col">
          <label
            htmlFor="pattern"
            className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            정규식
          </label>
          <input
            id="pattern"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="정규식 패턴을 입력하세요"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          {regexError && (
            <span className="text-sm text-red-600 dark:text-red-400 mt-1">
              {regexError}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* 플래그 토글 */}
          {[
            {
              flag: "g",
              label: "전역 검색",
              description:
                "첫 번째 일치 항목뿐만 아니라 모든 일치 항목을 찾습니다",
            },
            {
              flag: "i",
              label: "대소문자 구분 안 함",
              description: "일치 시 대문자와 소문자 차이를 무시합니다",
            },
            {
              flag: "m",
              label: "다중 라인 모드",
              description:
                "^ 및 $ 앵커에 대해 각 줄을 별도의 문자열로 처리합니다",
            },
            {
              flag: "s",
              label: "점 모든 문자 모드",
              description: "점(.)을 줄바꿈 문자와 일치하도록 허용합니다",
            },
            {
              flag: "u",
              label: "유니코드 지원",
              description: "특수 문자에 대한 전체 유니코드 지원을 활성화합니다",
            },
          ].map(({ flag, label, description }) => (
            <div key={flag} className="relative group">
              <label className="inline-flex items-center cursor-help">
                <input
                  type="checkbox"
                  checked={flags.includes(flag)}
                  onChange={() => toggleFlag(flag)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-1 text-sm font-bold text-blue-600 dark:text-blue-400">
                  {label}
                </span>
                <span className="ml-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                  ({flag})
                </span>
              </label>
              {/* 툴팁 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          ))}
          {/* 템플릿 선택 */}
          <label
            htmlFor="template"
            className="text-sm font-medium ml-4 text-gray-700 dark:text-gray-300"
          >
            템플릿:
          </label>
          <select
            id="template"
            onChange={(e) => {
              const label = e.target.value;
              if (label)
                applyTemplate(REGEX_TEMPLATES.find((t) => t.label === label)!);
            }}
            value=""
            className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">선택...</option>
            {REGEX_TEMPLATES.map((tpl) => (
              <option
                key={tpl.label}
                value={tpl.label}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {tpl.label}
              </option>
            ))}
          </select>
          <button
            onClick={saveCurrentPattern}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring"
          >
            저장
          </button>
        </div>
      </div>
      {/* 테스트 텍스트 및 치환 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <label
            htmlFor="testText"
            className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            테스트 텍스트
          </label>
          <textarea
            id="testText"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="정규식을 테스트할 텍스트를 입력하세요"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring resize-y min-h-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="replacement"
            className="text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            치환 텍스트 (선택사항)
          </label>
          <input
            id="replacement"
            type="text"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder="치환할 텍스트"
            className="p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <label
            htmlFor="replaceOutput"
            className="text-sm font-medium mt-4 mb-1 text-gray-700 dark:text-gray-300"
          >
            치환 결과
          </label>
          <textarea
            id="replaceOutput"
            value={replaceOutput}
            readOnly
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 resize-y min-h-32 text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleCopy}
            className="mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring"
          >
            복사
          </button>
        </div>
      </div>
      {/* 하이라이트된 테스트 텍스트 및 매치 결과 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
            하이라이트된 매치
          </h2>
          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap break-words min-h-32 text-gray-900 dark:text-gray-100">
            {segments.map((seg, idx) => (
              <span
                key={idx}
                className={
                  seg.matchIndex !== null
                    ? "bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100"
                    : ""
                }
              >
                {seg.text}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
            일치 항목 ({matches.length})
          </h2>
          <ul className="border border-gray-200 dark:border-gray-700 rounded divide-y divide-gray-200 dark:divide-gray-700 max-h-48 overflow-auto text-sm text-gray-900 dark:text-gray-100">
            {matches.length === 0 && (
              <li className="p-2 text-gray-500 dark:text-gray-400">
                일치 항목이 없습니다
              </li>
            )}
            {matches.map((m, idx) => (
              <li key={idx} className="p-2 flex flex-col">
                <span>
                  <span className="font-semibold">{idx + 1}.</span> '{m.match}'
                  위치: {m.index}
                </span>
                {m.groups.length > 0 && (
                  <ul className="ml-4 list-disc">
                    {m.groups.map((g, gi) => (
                      <li key={gi}>
                        <span className="font-semibold">그룹 {gi + 1}:</span> '
                        {g}'
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* 설명 및 치트시트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
            패턴 설명
          </h2>
          <ul className="space-y-1 text-sm text-gray-900 dark:text-gray-100">
            {pattern.length === 0 && (
              <li className="text-gray-500 dark:text-gray-400">
                패턴을 입력하면 설명을 볼 수 있습니다
              </li>
            )}
            {description.map((item, idx) => (
              <li key={idx}>
                <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded mr-2 text-gray-800 dark:text-gray-200">
                  {item.token}
                </span>
                {item.description}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
            치트시트
          </h2>
          <ul className="space-y-1 text-sm text-gray-900 dark:text-gray-100">
            {CHEAT_SHEET.map((item) => (
              <li
                key={item.token}
                className="flex justify-between items-center"
              >
                <div>
                  <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded mr-2 text-gray-800 dark:text-gray-200">
                    {item.token}
                  </span>
                  {item.description}
                </div>
                <button
                  onClick={() => setPattern((prev) => prev + item.token)}
                  className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-xs rounded hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
                >
                  삽입
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* 저장된 패턴 */}
      <div className="mb-6">
        <h2 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
          저장된 표현식
        </h2>
        <ul className="space-y-2 text-sm max-h-40 overflow-auto">
          {savedPatterns.length === 0 && (
            <li className="text-gray-500 dark:text-gray-400">
              저장된 패턴이 없습니다
            </li>
          )}
          {savedPatterns.map((item) => (
            <li
              key={item.date}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded flex justify-between items-center"
            >
              <div className="overflow-hidden truncate text-gray-900 dark:text-gray-100">
                <span className="font-mono mr-2">/{item.pattern}/</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {item.flags}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => loadPattern(item)}
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring text-xs"
                >
                  불러오기
                </button>
                <button
                  onClick={() => deletePattern(item)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring text-xs"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* 토스트 알림 */}
      {toast && (
        <div
          role="alert"
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toastBg}`}
        >
          {toast.message}
        </div>
      )}
      {copied && <span className="sr-only">Copied</span>}
      {loading && <span className="sr-only">Loading</span>}
    </div>
  );
};

export default RegexTester;
