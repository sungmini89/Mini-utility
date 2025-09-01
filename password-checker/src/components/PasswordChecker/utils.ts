import zxcvbn from "zxcvbn";
import type { EvaluationResult } from "./types";

/**
 * 해킹 시간을 한국어로 번역하는 함수
 * 
 * @param timeString - 영어 해킹 시간 문자열
 * @returns 한국어로 번역된 해킹 시간
 */
function translateCrackTime(timeString: string): string {
  const timeMap: Record<string, string> = {
    "instant": "즉시",
    "seconds": "초",
    "minutes": "분",
    "hours": "시간",
    "days": "일",
    "months": "개월",
    "years": "년",
    "centuries": "세기",
    "unknown": "알 수 없음"
  };

  // 숫자와 단위를 분리하여 번역
  const match = timeString.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
  if (match) {
    const [, number, unit] = match;
    const translatedUnit = timeMap[unit] || unit;
    return `${number} ${translatedUnit}`;
  }

  // 단순 단위만 있는 경우
  return timeMap[timeString] || timeString;
}

/**
 * zxcvbn 피드백 메시지를 한국어로 번역하는 함수
 * 
 * @param suggestions - 영어 제안 메시지 배열
 * @returns 한국어로 번역된 제안 메시지 배열
 */
function translateSuggestions(suggestions: string[]): string[] {
  const suggestionMap: Record<string, string> = {
    "Add another word or two. Uncommon words are better.": "다른 단어를 하나 또는 두 개 추가하세요. 흔하지 않은 단어가 더 좋습니다.",
    "Use a few words, separated by spaces.": "공백으로 구분된 몇 개의 단어를 사용하세요.",
    "Avoid repeated words and characters.": "반복되는 단어와 문자를 피하세요.",
    "Avoid sequences.": "연속된 문자를 피하세요.",
    "Avoid personal information.": "개인 정보를 피하세요.",
    "Capitalization doesn't help very much.": "대문자 사용은 큰 도움이 되지 않습니다.",
    "All-uppercase is almost as easy to guess as all-lowercase.": "모두 대문자로 하는 것은 모두 소문자로 하는 것만큼 추측하기 쉽습니다.",
    "Reversed words aren't much harder to guess.": "거꾸로 된 단어는 추측하기가 그리 어렵지 않습니다.",
    "Predictable substitutions like '@' instead of 'a' don't help very much.": "'a' 대신 '@'와 같은 예측 가능한 치환은 큰 도움이 되지 않습니다.",
    "Recent years are easy to guess.": "최근 연도는 추측하기 쉽습니다.",
    "Dates are often easy to guess.": "날짜는 종종 추측하기 쉽습니다.",
    "This is a top-10 common password.": "이것은 상위 10개 일반적인 비밀번호입니다.",
    "This is a top-100 common password.": "이것은 상위 100개 일반적인 비밀번호입니다.",
    "This is a very common password.": "이것은 매우 일반적인 비밀번호입니다.",
    "This is similar to a commonly used password.": "이것은 일반적으로 사용되는 비밀번호와 유사합니다.",
    "A word by itself is easy to guess.": "단독 단어는 추측하기 쉽습니다.",
    "Names and surnames by themselves are easy to guess.": "이름과 성은 단독으로 사용하면 추측하기 쉽습니다.",
    "Common names and surnames are easy to guess.": "일반적인 이름과 성은 추측하기 쉽습니다."
  };

  return suggestions.map(suggestion => suggestionMap[suggestion] || suggestion);
}

/**
 * 비밀번호 강도를 평가하는 함수
 *
 * zxcvbn 라이브러리를 사용하여 비밀번호의 보안 강도를 종합적으로 분석합니다.
 * 기본적인 패턴 검사 외에도 추가적인 보안 요구사항을 확인합니다.
 *
 * @param password - 평가할 비밀번호 문자열
 * @returns {EvaluationResult} 비밀번호 평가 결과 객체
 *
 * @example
 * ```typescript
 * const result = evaluatePassword("MySecurePass123!");
 * console.log(result.score); // 85
 * console.log(result.crackTime); // "세기"
 * ```
 */
export function evaluatePassword(password: string): EvaluationResult {
  // 빈 비밀번호 처리
  if (!password || password.length === 0) {
    return {
      score: 0,
      zxcvbnScore: 0,
      crackTime: "즉시",
      feedback: {
        warning: "",
        suggestions: [],
      },
      hasMinLength: false,
      hasUpperLower: false,
      hasNumber: false,
      hasSpecial: false,
      length: 0,
    };
  }

  // zxcvbn을 사용한 기본 강도 분석
  const analysis = zxcvbn(password);
  const zScore = analysis.score; // 0–4
  const normalised = Math.min(100, Math.max(0, Math.round((zScore / 4) * 100)));

  // 해킹 시간 추출 및 한국어 번역
  let crackTime = "알 수 없음";
  if (analysis.crack_times_display) {
    const timeValue =
      analysis.crack_times_display.offline_slow_hashing_1e4_per_second ||
      analysis.crack_times_display.offline_fast_hashing_1e10_per_second ||
      analysis.crack_times_display.online_throttling_100_per_hour ||
      analysis.crack_times_display.online_no_throttling_10_per_second ||
      "unknown";
    crackTime = translateCrackTime(String(timeValue));
  }

  // 추가 보안 요구사항 검사
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasUpperLower = hasLower && hasUpper;
  const hasMinLength = password.length >= 8;

  return {
    score: normalised,
    zxcvbnScore: zScore,
    crackTime,
    feedback: {
      warning: analysis.feedback.warning || "",
      suggestions: translateSuggestions(analysis.feedback.suggestions || []),
    },
    hasMinLength,
    hasUpperLower,
    hasNumber,
    hasSpecial,
    length: password.length,
  };
}