import { useState } from "react";

/**
 * 텍스트를 클립보드에 복사하는 기능을 제공하는 React 훅
 *
 * 이 훅은 모던 브라우저의 Clipboard API를 사용하여 텍스트를 클립보드에
 * 복사하고, 복사 성공 여부를 추적할 수 있게 해줍니다.
 *
 * 주요 기능:
 * - 텍스트를 클립보드에 안전하게 복사
 * - 복사 성공/실패 상태 추적
 * - 자동 상태 리셋 (2초 후)
 * - 에러 처리 및 콘솔 로깅
 * - Promise 기반 비동기 처리
 *
 * 사용 예시:
 * - 생성된 텍스트를 클립보드에 복사
 * - 사용자 입력 내용 복사
 * - 링크나 코드 스니펫 복사
 * - 복사 성공 시 UI 피드백 제공
 *
 * 브라우저 지원:
 * - Chrome 66+, Firefox 63+, Safari 13.1+, Edge 79+
 * - HTTPS 환경에서만 작동 (보안 정책)
 * - 사용자 상호작용(클릭 등) 후에만 동작
 *
 * @returns {[boolean, (text: string) => Promise<void>]} [복사 상태, 복사 함수]
 *
 * @example
 * // 기본 사용법
 * const [copied, copy] = useClipboard();
 *
 * const handleCopy = async () => {
 *   try {
 *     await copy('복사할 텍스트');
 *     // 복사 성공 시 UI 업데이트
 *   } catch (error) {
 *     // 복사 실패 시 에러 처리
 *     console.error('복사 실패:', error);
 *   }
 * };
 *
 * // 복사 상태를 UI에 반영
 * return (
 *   <button onClick={handleCopy}>
 *     {copied ? '복사됨!' : '복사하기'}
 *   </button>
 * );
 *
 * // 주의사항
 * // 1. HTTPS 환경에서만 작동
 * // 2. 사용자 상호작용 후에만 동작
 * // 3. 복사할 텍스트가 너무 길면 성능 저하 가능
 */
function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      // Clipboard API를 사용하여 텍스트 복사
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // 2초 후 자동으로 상태 리셋
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // 복사 실패 시 에러 로깅 및 재발생
      console.error("useClipboard: copy failed", error);
      throw error;
    }
  }

  return [copied, copy];
}

export default useClipboard;
