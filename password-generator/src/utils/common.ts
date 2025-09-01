/**
 * 비밀번호 생성기에서 사용하는 유틸리티 헬퍼 함수들
 *
 * 이 함수들은 다른 유틸리티를 지원하도록 확장할 수 있습니다.
 * 현재는 문자열이나 배열에서 랜덤 요소를 선택하는 헬퍼를 포함합니다.
 */

/**
 * 문자열에서 랜덤 요소를 선택합니다.
 * 문자열이 비어있으면 빈 문자열을 반환합니다.
 *
 * @param {string} str - 선택할 요소가 포함된 문자열
 * @returns {string} 랜덤하게 선택된 문자 또는 빈 문자열
 *
 * @example
 * ```typescript
 * const char = randomFromString("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
 * // "K" (예시)
 *
 * const empty = randomFromString("");
 * // ""
 * ```
 *
 * @since 1.0.0
 * @author 비밀번호 도구 팀
 */
export function randomFromString(str: string): string {
  if (!str) return "";
  const index = Math.floor(Math.random() * str.length);
  return str.charAt(index);
}
