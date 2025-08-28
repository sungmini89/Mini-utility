export interface Statistics {
  /** 공백을 포함한 총 문자 수 */
  charCount: number;
  /** 공백을 제외한 총 문자 수 */
  charCountNoSpaces: number;
  /** 입력에서 감지된 단어 수 */
  wordCount: number;
  /** 문장 부호를 기반으로 감지된 문장 수 */
  sentenceCount: number;
  /** 줄바꿈으로 구분된 단락 수 */
  paragraphCount: number;
  /** 200 WPM을 기준으로 한 예상 읽기 시간(분) */
  readingTimeMinutes: number;
  /** 발견된 한글 문자 수 */
  koreanCount: number;
  /** 발견된 영어 문자 수 */
  englishCount: number;
  /** 플랫폼별 남은 문자 수. 음수 값은 제한을 초과했음을 의미합니다. */
  remaining: Record<string, number>;
}

/**
 * 여러 인기 있는 소셜 네트워크와 메시징 플랫폼의 문자 제한입니다.
 */
export const SNS_LIMITS: Record<string, number> = {
  Twitter: 280,
  Instagram: 2200,
  Facebook: 63206,
  KakaoTalk: 1000,
};

/**
 * 주어진 텍스트에 대한 다양한 통계를 계산합니다. 이 헬퍼 함수는
 * UI에 필요한 모든 로직을 중앙화하여 컴포넌트가 읽기 쉽고
 * 테스트하기 쉽게 유지합니다.
 *
 * @param text 통계를 도출할 입력 텍스트
 */
export function computeStatistics(text: string): Statistics {
  // 문자 수 계산
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;

  // 단어는 공백으로 구분됩니다. 연속된 구분자에 대해
  // 빈 문자열을 필터링합니다.
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 문장은 문장 부호로 감지됩니다. 후행 문장 부호를
  // 고려하여 빈 문자열을 필터링합니다.
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // 단락은 하나 이상의 줄바꿈 문자로 구분됩니다.
  const paragraphs = text.split(/\n+/).filter((s) => s.trim().length > 0);
  const paragraphCount = paragraphs.length;

  // 정규식을 사용하여 한글과 영어 문자를 계산합니다.
  // 현대 한글 문자: \uAC00-\uD7AF (한글 음절)
  // 한글 호환 문자: \u3131-\u318E (한글 자모)
  const koreanMatches = text.match(/[\u3131-\u318E\uAC00-\uD7AF]/g) || [];
  const englishMatches = text.match(/[A-Za-z]/g) || [];
  const koreanCount = koreanMatches.length;
  const englishCount = englishMatches.length;

  // 분당 평균 200단어를 가정한 읽기 시간(분)입니다.
  // 매우 짧은 텍스트의 경우 더 정확한 소수점 값을 표시합니다
  const readingTimeMinutes = wordCount > 0 ? Math.max(0.1, wordCount / 200) : 0;

  // 각 플랫폼에 대한 남은 문자 수를 계산합니다. 음수 값은
  // 현재 텍스트가 플랫폼 제한을 초과했음을 나타냅니다.
  const remaining: Record<string, number> = {};
  for (const platform of Object.keys(SNS_LIMITS)) {
    remaining[platform] = SNS_LIMITS[platform] - charCount;
  }

  return {
    charCount,
    charCountNoSpaces,
    wordCount,
    sentenceCount,
    paragraphCount,
    readingTimeMinutes,
    koreanCount,
    englishCount,
    remaining,
  };
}
