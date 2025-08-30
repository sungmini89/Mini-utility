import { useState } from "react";

/**
 * 클립보드 복사 기능을 제공하는 React 훅
 *
 * 텍스트를 클립보드에 복사하고, 복사 성공 여부를 상태로 관리합니다.
 * 복사된 상태는 2초 후 자동으로 리셋되어 UI 업데이트에 활용할 수 있습니다.
 *
 * @description
 * - 클립보드 복사: navigator.clipboard API 사용
 * - 상태 관리: 복사 성공/실패 상태 자동 관리
 * - 자동 리셋: 2초 후 복사 상태 자동 초기화
 * - 에러 처리: 복사 실패 시 에러 로깅
 *
 * @returns [copied, copy] - 복사 상태와 복사 함수
 *
 * @example
 * ```tsx
 * const [copied, copy] = useClipboard();
 *
 * const handleCopy = async () => {
 *   try {
 *     await copy('복사할 텍스트');
 *     // 복사 성공 시 UI 업데이트
 *   } catch (error) {
 *     // 복사 실패 시 에러 처리
 *   }
 * };
 *
 * return (
 *   <button onClick={handleCopy}>
 *     {copied ? '복사됨!' : '복사하기'}
 *   </button>
 * );
 * ```
 *
 * @author QR Code Generator Team
 * @since 1.0.0
 */
function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("useClipboard: copy failed", error);
      throw error;
    }
  }

  return [copied, copy];
}

export default useClipboard;
