/**
 * 비밀번호 생성을 제어하는 옵션들
 * 각 옵션은 특정 문자 세트를 토글합니다. `count`는 한 번에 생성할
 * 비밀번호의 개수를 지정합니다.
 *
 * @interface GeneratorOptions
 * @since 1.0.0
 */
export interface GeneratorOptions {
  /** 비밀번호 길이 (8-128자) */
  length: number;
  /** 대문자 포함 여부 (A-Z) */
  includeUpper: boolean;
  /** 소문자 포함 여부 (a-z) */
  includeLower: boolean;
  /** 숫자 포함 여부 (0-9) */
  includeNumbers: boolean;
  /** 특수문자 포함 여부 (!@#$%^&*() 등) */
  includeSpecial: boolean;
  /** 유사 문자 제외 여부 (0,O,l,1) */
  excludeSimilar: boolean;
  /** 생성할 비밀번호 개수 (1-10개) */
  count: number;
}

/**
 * 비밀번호 히스토리의 항목
 * 사용된 생성 옵션과 결과 비밀번호를 저장합니다. 비밀번호 자체는
 * 일반 문자열로 저장됩니다. 민감한 값을 저장할 때는 마스킹을 고려하세요.
 *
 * @interface HistoryItem
 * @since 1.0.0
 */
export interface HistoryItem {
  /** 생성 시간 (타임스탬프) */
  date: number;
  /** 사용된 생성 옵션 */
  options: GeneratorOptions;
  /** 생성된 비밀번호 배열 */
  passwords: string[];
}

/**
 * 토스트 알림의 타입
 *
 * @typedef {string} ToastType
 * @since 1.0.0
 */
export type ToastType = "success" | "error";
