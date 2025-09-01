import React, { useState } from "react";
import type { StrengthLevel } from "./types";
import { calculatePasswordStrength } from "./utils";

/**
 * PasswordStrength component provides a tool to check the strength
 * of passwords. It analyzes various factors like length, character
 * variety, and common patterns to provide a strength rating.
 */
const PasswordStrength: React.FC = () => {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<StrengthLevel | null>(null);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.trim()) {
      setStrength(calculatePasswordStrength(value));
    } else {
      setStrength(null);
    }
  };

  const getStrengthColor = (level: StrengthLevel) => {
    switch (level) {
      case "very-weak":
        return "bg-red-500";
      case "weak":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-blue-500";
      case "very-strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStrengthText = (level: StrengthLevel) => {
    switch (level) {
      case "very-weak":
        return "매우 약함";
      case "weak":
        return "약함";
      case "medium":
        return "보통";
      case "strong":
        return "강함";
      case "very-strong":
        return "매우 강함";
      default:
        return "알 수 없음";
    }
  };

  return (
    <div className="space-y-6" role="main" aria-label="비밀번호 강도 체커">
      <section
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow"
        aria-labelledby="strength-heading"
      >
        <h2 id="strength-heading" className="text-md font-semibold mb-3">
          비밀번호 강도 체커
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="password-input"
              className="block text-sm font-medium mb-2"
            >
              비밀번호 입력
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring bg-white dark:bg-gray-700"
              placeholder="비밀번호를 입력하거나 붙여넣어 강도를 확인하세요"
              aria-describedby="password-desc"
            />
            <div id="password-desc" className="sr-only">
              비밀번호를 입력하여 강도를 분석합니다. 비밀번호는 로컬에서만
              분석되며 어디로도 전송되지 않습니다.
            </div>
          </div>

          {strength && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  강도 수준
                </label>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full ${getStrengthColor(
                      strength
                    )}`}
                  ></div>
                  <span className="font-medium">
                    {getStrengthText(strength)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  강도 표시
                </label>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                      strength
                    )}`}
                    style={{
                      width: `${
                        ([
                          "very-weak",
                          "weak",
                          "medium",
                          "strong",
                          "very-strong",
                        ].indexOf(strength) +
                          1) *
                        20
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                <h3 className="text-sm font-medium mb-2">분석 결과</h3>
                <ul className="text-sm space-y-1">
                  <li
                    className={
                      password.length >= 8 ? "text-green-600" : "text-red-600"
                    }
                  >
                    ✓ 길이: {password.length}자{" "}
                    {password.length >= 8 ? "(좋음)" : "(너무 짧음)"}
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(password) ? "text-green-600" : "text-red-600"
                    }
                  >
                    ✓ 대문자: {/[A-Z]/.test(password) ? "포함" : "없음"}
                  </li>
                  <li
                    className={
                      /[a-z]/.test(password) ? "text-green-600" : "text-red-600"
                    }
                  >
                    ✓ 소문자: {/[a-z]/.test(password) ? "포함" : "없음"}
                  </li>
                  <li
                    className={
                      /\d/.test(password) ? "text-green-600" : "text-red-600"
                    }
                  >
                    ✓ 숫자: {/\d/.test(password) ? "포함" : "없음"}
                  </li>
                  <li
                    className={
                      /[!@#$%^&*(),.?":{}|<>]/.test(password)
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    ✓ 특수문자:{" "}
                    {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "포함" : "없음"}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {!password && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              위에 비밀번호를 입력하여 강도를 확인하세요.
            </div>
          )}
        </div>
      </section>

      <section
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow"
        aria-labelledby="tips-heading"
      >
        <h2 id="tips-heading" className="text-md font-semibold mb-3">
          비밀번호 팁
        </h2>
        <ul className="text-sm space-y-2">
          <li>• 최소 8자 이상 사용 (12자 이상 권장)</li>
          <li>• 대문자와 소문자를 모두 포함</li>
          <li>• 숫자와 특수문자 추가</li>
          <li>• 일반적인 단어나 패턴 피하기</li>
          <li>• 계정별로 다른 비밀번호 사용</li>
          <li>• 비밀번호 관리자 사용 고려</li>
        </ul>
      </section>
    </div>
  );
};

export default PasswordStrength;
