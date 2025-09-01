/**
 * 비밀번호 평가 결과를 나타내는 인터페이스
 *
 * zxcvbn 라이브러리의 분석 결과와 추가적인 보안 요구사항 검사 결과를 포함합니다.
 */
export interface EvaluationResult {
  /** 정규화된 강도 점수 (0-100) */
  score: number;
  /** zxcvbn 원본 점수 (0-4) */
  zxcvbnScore: number;
  /** 예상 해킹 시간 문자열 */
  crackTime: string;
  /** zxcvbn 피드백 정보 */
  feedback: {
    /** 경고 메시지 */
    warning: string;
    /** 개선 제안 목록 */
    suggestions: string[];
  };
  /** 최소 길이 요구사항 충족 여부 (8자 이상) */
  hasMinLength: boolean;
  /** 대문자와 소문자 포함 여부 */
  hasUpperLower: boolean;
  /** 숫자 포함 여부 */
  hasNumber: boolean;
  /** 특수문자 포함 여부 */
  hasSpecial: boolean;
  /** 비밀번호 길이 */
  length: number;
}

/**
 * 히스토리에 저장되는 항목을 나타내는 인터페이스
 *
 * 비밀번호는 보안을 위해 마스킹 처리되어 저장됩니다.
 */
export interface HistoryItem {
  /** 저장 시간 (타임스탬프) */
  date: number;
  /** 마스킹된 비밀번호 */
  masked: string;
  /** 비밀번호 길이 */
  length: number;
  /** 강도 점수 */
  score: number;
  /** 대문자와 소문자 포함 여부 */
  hasUpperLower: boolean;
  /** 숫자 포함 여부 */
  hasNumber: boolean;
  /** 특수문자 포함 여부 */
  hasSpecial: boolean;
  /** 예상 해킹 시간 */
  crackTime: string;
}

/**
 * 토스트 알림 타입을 나타내는 유니온 타입
 */
export type ToastType = "success" | "error" | "warning" | "info";
