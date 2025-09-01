import type { StrengthLevel, StrengthAnalysis } from "./types";

/**
 * 체크할 일반적인 약한 비밀번호 및 패턴
 */
const COMMON_PASSWORDS = [
  "password",
  "123456",
  "123456789",
  "qwerty",
  "abc123",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
];

const COMMON_PATTERNS = [
  /123/g,
  /abc/g,
  /qwe/g,
  /asd/g,
  /zxc/g,
  /111/g,
  /222/g,
  /333/g,
  /aaa/g,
  /bbb/g,
];

/**
 * 다양한 요소를 기반으로 비밀번호의 강도를 계산합니다.
 * 'very-weak'에서 'very-strong'까지의 강도 수준을 반환합니다.
 *
 * @param {string} password - 분석할 비밀번호
 * @returns {StrengthLevel} 비밀번호 강도 수준
 *
 * @example
 * ```typescript
 * const strength = calculatePasswordStrength("MyPassword123!");
 * // "strong"
 *
 * const weakStrength = calculatePasswordStrength("123456");
 * // "very-weak"
 * ```
 *
 * @since 1.0.0
 * @author 비밀번호 도구 팀
 */
export function calculatePasswordStrength(password: string): StrengthLevel {
  if (!password || password.length === 0) {
    return "very-weak";
  }

  let score = 0;
  const factors = {
    length: password.length,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasRepeatingChars: /(.)\1{2,}/.test(password),
    hasSequentialChars:
      /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|012)/i.test(
        password
      ),
    hasCommonPatterns: COMMON_PATTERNS.some((pattern) =>
      pattern.test(password)
    ),
  };

  // 길이 점수 계산
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;

  // 문자 다양성 점수 계산
  if (factors.hasUppercase) score += 1;
  if (factors.hasLowercase) score += 1;
  if (factors.hasNumbers) score += 1;
  if (factors.hasSpecial) score += 1;

  // 약한 패턴에 대한 페널티
  if (factors.hasRepeatingChars) score -= 1;
  if (factors.hasSequentialChars) score -= 1;
  if (factors.hasCommonPatterns) score -= 1;
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) score -= 3;

  // 점수를 0-4 범위로 정규화
  score = Math.max(0, Math.min(4, score));

  // 점수를 강도 수준으로 변환
  switch (score) {
    case 0:
    case 1:
      return "very-weak";
    case 2:
      return "weak";
    case 3:
      return "medium";
    case 4:
      return password.length >= 12 ? "very-strong" : "strong";
    default:
      return "very-weak";
  }
}

/**
 * 비밀번호 강도에 대한 상세한 분석을 포함한 모든 요소를 가져옵니다.
 *
 * @param {string} password - 분석할 비밀번호
 * @returns {StrengthAnalysis} 비밀번호 강도 분석 결과
 *
 * @example
 * ```typescript
 * const analysis = analyzePassword("MyPassword123!");
 * // {
 * //   level: "strong",
 * //   score: 3,
 * //   factors: {
 * //     length: 15,
 * //     hasUppercase: true,
 * //     hasLowercase: true,
 * //     hasNumbers: true,
 * //     hasSpecial: true,
 * //     hasRepeatingChars: false,
 * //     hasSequentialChars: false,
 * //     hasCommonPatterns: false
 * //   }
 * // }
 * ```
 *
 * @since 1.0.0
 * @author 비밀번호 도구 팀
 */
export function analyzePassword(password: string): StrengthAnalysis {
  const level = calculatePasswordStrength(password);
  const factors = {
    length: password.length,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasRepeatingChars: /(.)\1{2,}/.test(password),
    hasSequentialChars:
      /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|012)/i.test(
        password
      ),
    hasCommonPatterns: COMMON_PATTERNS.some((pattern) =>
      pattern.test(password)
    ),
  };

  return {
    level,
    score: ["very-weak", "weak", "medium", "strong", "very-strong"].indexOf(
      level
    ),
    factors,
  };
}
