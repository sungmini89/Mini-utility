/**
 * 정규식 매치 결과를 나타내는 인터페이스
 *
 * 정규식이 텍스트에서 찾은 각 매치에 대한 정보를 포함합니다.
 * 매치된 텍스트, 위치, 캡처 그룹 등을 저장합니다.
 */
export interface MatchResult {
  /** 매치된 텍스트 문자열 */
  match: string;
  /** 매치가 시작된 텍스트 내 위치 (인덱스) */
  index: number;
  /** 캡처 그룹 배열 (첫 번째 그룹은 인덱스 0) */
  groups: string[];
}

/**
 * 저장된 정규식 패턴을 나타내는 인터페이스
 *
 * 사용자가 나중에 사용하기 위해 저장한 정규식 패턴과 설정을 저장합니다.
 * 패턴, 플래그, 저장 날짜를 포함합니다.
 */
export interface SavedPattern {
  /** 저장된 정규식 패턴 */
  pattern: string;
  /** 정규식 플래그 (g, i, m, s, u) */
  flags: string;
  /** 저장된 날짜 (Unix 타임스탬프) */
  date: number;
}

/**
 * 정규식 토큰 설명을 나타내는 인터페이스
 *
 * 정규식 패턴을 구성하는 개별 토큰과 그에 대한 설명을 저장합니다.
 * 사용자가 정규식의 각 부분을 이해할 수 있도록 도와줍니다.
 */
export interface TokenDescription {
  /** 정규식 토큰 (예: \d, *, +, 등) */
  token: string;
  /** 토큰에 대한 사람이 읽을 수 있는 설명 */
  description: string;
}
