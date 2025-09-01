/**
 * 문자열을 마스킹 처리하는 유틸리티 함수
 *
 * 보안상 민감한 정보를 표시할 때 사용됩니다.
 * 첫 번째와 마지막 문자만 보이고 나머지는 '*'로 마스킹됩니다.
 *
 * @param str - 마스킹할 문자열
 * @returns 마스킹된 문자열
 *
 * @example
 * ```typescript
 * maskString("password"); // "p******d"
 * maskString("abc"); // "a*c"
 * maskString("ab"); // "**"
 * maskString("a"); // "*"
 * maskString(""); // ""
 * ```
 */
export function maskString(str: string): string {
  if (!str) return "";

  if (str.length <= 2) {
    return "*".repeat(str.length);
  }

  return `${str[0]}${"*".repeat(str.length - 2)}${str[str.length - 1]}`;
}
