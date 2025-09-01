/**
 * 비밀번호 강도 체커에서 사용하는 강도 수준
 * 매우 약함에서 매우 강함까지 다양한 요소에 기반합니다.
 *
 * @typedef {string} StrengthLevel
 * @since 1.0.0
 */
export type StrengthLevel =
  | "very-weak"
  | "weak"
  | "medium"
  | "strong"
  | "very-strong";

/**
 * 비밀번호 강도 계산의 분석 결과
 * 비밀번호의 특성에 대한 상세한 정보를 포함합니다.
 *
 * @interface StrengthAnalysis
 * @since 1.0.0
 */
export interface StrengthAnalysis {
  /** 계산된 강도 수준 */
  level: StrengthLevel;
  /** 강도 점수 (0-4) */
  score: number;
  /** 비밀번호 특성 분석 결과 */
  factors: {
    /** 비밀번호 길이 */
    length: number;
    /** 대문자 포함 여부 */
    hasUppercase: boolean;
    /** 소문자 포함 여부 */
    hasLowercase: boolean;
    /** 숫자 포함 여부 */
    hasNumbers: boolean;
    /** 특수문자 포함 여부 */
    hasSpecial: boolean;
    /** 반복 문자 포함 여부 */
    hasRepeatingChars: boolean;
    /** 순차 문자 포함 여부 (abc, 123 등) */
    hasSequentialChars: boolean;
    /** 일반적인 패턴 포함 여부 */
    hasCommonPatterns: boolean;
  };
}
