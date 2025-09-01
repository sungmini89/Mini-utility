import React, { useState, useEffect, useCallback } from "react";
import { evaluatePassword } from "./utils";
import type { EvaluationResult } from "./types";
import { useClipboard } from "../../hooks/useClipboard";
import { useLocalStorage } from "../../hooks/useLocalStorage";

/**
 * 비밀번호 강도 검사 컴포넌트
 *
 * 사용자가 비밀번호를 입력하면 실시간으로 강도를 평가하고 시각적 피드백을 제공합니다.
 * zxcvbn 라이브러리를 사용하여 정확한 강도 측정을 수행하며, 다음과 같은 기능을 제공합니다:
 *
 * - 실시간 비밀번호 강도 평가 (0-100% 점수)
 * - 예상 해킹 시간 표시
 * - 비밀번호 요구사항 체크리스트
 * - 개선 제안 및 피드백
 * - 비밀번호 히스토리 저장
 * - 클립보드 복사 기능
 * - 키보드 단축키 지원
 * - 다크모드 지원
 *
 * @example
 * ```tsx
 * <PasswordChecker />
 * ```
 *
 * @returns {JSX.Element} 비밀번호 강도 검사 UI
 */
const PasswordChecker: React.FC = () => {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { copyToClipboard, copied } = useClipboard();
  const [history, setHistory] = useLocalStorage<string[]>(
    "passwordHistory",
    []
  );

  /**
   * 비밀번호가 변경될 때마다 강도를 평가합니다.
   * 디바운싱을 적용하여 성능을 최적화합니다.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (password) {
        try {
          const evaluation = evaluatePassword(password);
          setResult(evaluation);
        } catch (error) {
          console.error("Password evaluation error:", error);
          setResult(null);
        }
      } else {
        setResult(null);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [password]);

  /**
   * 현재 비밀번호를 히스토리에 저장합니다.
   * 비밀번호는 마스킹 처리되어 저장됩니다.
   */
  const saveToHistory = useCallback(() => {
    if (!password || !result) return;

    const masked =
      password.length <= 2
        ? "*".repeat(password.length)
        : `${password[0]}${"*".repeat(password.length - 2)}${
            password[password.length - 1]
          }`;

    const newHistory = [
      `${masked} (${result.score}%)`,
      ...history.filter((item: string) => !item.startsWith(masked)).slice(0, 9),
    ];

    setHistory(newHistory);
  }, [password, result, history, setHistory]);

  /**
   * 비밀번호와 결과를 초기화합니다.
   */
  const clearPassword = useCallback(() => {
    setPassword("");
    setResult(null);
  }, []);

  /**
   * 키보드 단축키를 처리합니다.
   * - Ctrl+Shift+C: 비밀번호 복사
   * - Ctrl+Shift+S: 히스토리에 저장
   * - Ctrl+Shift+X: 비밀번호 지우기
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "s":
            e.preventDefault();
            saveToHistory();
            break;
          case "c":
            e.preventDefault();
            copyToClipboard(password);
            break;
          case "x":
            e.preventDefault();
            clearPassword();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [saveToHistory, copyToClipboard, password, clearPassword]);

  /**
   * 점수에 따른 강도 색상을 반환합니다.
   * @param score - 비밀번호 강도 점수 (0-100)
   * @returns Tailwind CSS 색상 클래스
   */
  const getStrengthColor = (score: number) => {
    if (score < 25) return "text-red-500";
    if (score < 50) return "text-orange-500";
    if (score < 75) return "text-yellow-500";
    return "text-green-500";
  };

  /**
   * 점수에 따른 프로그레스 바 색상을 반환합니다.
   * @param score - 비밀번호 강도 점수 (0-100)
   * @returns Tailwind CSS 배경색 클래스
   */
  const getProgressColor = (score: number) => {
    if (score < 25) return "bg-red-500";
    if (score < 50) return "bg-orange-500";
    if (score < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          비밀번호 강도 검사기
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          비밀번호 강도를 테스트하고 개선 방안을 확인하세요
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              비밀번호 입력
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="비밀번호를 입력하세요..."
                aria-describedby="password-strength password-suggestions"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {result && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    강도 점수
                  </span>
                  <span
                    className={`text-lg font-bold ${getStrengthColor(
                      result.score
                    )}`}
                  >
                    {result.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                      result.score
                    )}`}
                    style={{ width: `${result.score}%` }}
                    role="progressbar"
                    aria-valuenow={result.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`비밀번호 강도: ${result.score}%`}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  예상 해킹 시간
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {result.crackTime}
                </p>
              </div>

              {result.feedback &&
                result.feedback.suggestions &&
                result.feedback.suggestions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      개선 제안
                    </h3>
                    <ul className="space-y-1">
                      {result.feedback.suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                        >
                          <span className="text-blue-500 mr-2">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => copyToClipboard(password)}
              disabled={!password}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="비밀번호를 클립보드에 복사"
            >
              {copied ? "✅ 복사됨!" : "📋 복사"}
            </button>
            <button
              onClick={saveToHistory}
              disabled={!password || !result}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="비밀번호를 히스토리에 저장"
            >
              💾 저장
            </button>
            <button
              onClick={clearPassword}
              disabled={!password}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              aria-label="비밀번호 지우기"
            >
              🗑️ 지우기
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>
              키보드 단축키: Ctrl+Shift+C (복사), Ctrl+Shift+S (저장),
              Ctrl+Shift+X (지우기)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          비밀번호 요구사항 체크리스트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <span
              className={`text-lg ${
                result?.hasMinLength ? "text-green-500" : "text-gray-400"
              }`}
            >
              {result?.hasMinLength ? "✅" : "⭕"}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              최소 8자 이상
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`text-lg ${
                result?.hasUpperLower ? "text-green-500" : "text-gray-400"
              }`}
            >
              {result?.hasUpperLower ? "✅" : "⭕"}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              대문자와 소문자 포함
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`text-lg ${
                result?.hasNumber ? "text-green-500" : "text-gray-400"
              }`}
            >
              {result?.hasNumber ? "✅" : "⭕"}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              숫자 포함
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`text-lg ${
                result?.hasSpecial ? "text-green-500" : "text-gray-400"
              }`}
            >
              {result?.hasSpecial ? "✅" : "⭕"}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              특수문자 포함
            </span>
          </div>
          <div className="flex items-center space-x-3 md:col-span-2">
            <span
              className={`text-lg ${
                result && result.score > 50 ? "text-green-500" : "text-gray-400"
              }`}
            >
              {result && result.score > 50 ? "✅" : "⭕"}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              일반적인 패턴이 아님
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          히스토리
        </h2>
        {history.length > 0 ? (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-gray-700 dark:text-gray-300 font-mono">
                  {item}
                </span>
                <button
                  onClick={() => {
                    const newHistory = history.filter((_, i) => i !== index);
                    setHistory(newHistory);
                  }}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  aria-label={`${item}을 히스토리에서 제거`}
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              onClick={() => setHistory([])}
              className="w-full mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              모든 히스토리 지우기
            </button>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            아직 히스토리가 없습니다. 비밀번호를 저장하면 여기에 표시됩니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default PasswordChecker;