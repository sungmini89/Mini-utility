/**
 * 텍스트를 자르는 유틸리티입니다. UI를 압도하지 않으면서 히스토리 목록에서
 * 긴 문자열을 미리보기하는 데 유용합니다.
 *
 * @param {string} text - 자를 텍스트
 * @param {number} length - 최대 길이 (기본값: 80)
 * @returns {string} 잘린 텍스트 (필요한 경우 '…' 추가)
 */
export function truncate(text: string, length: number = 80): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}…`;
}
