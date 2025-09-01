import { useState, useCallback } from "react";

/**
 * 클립보드 복사 기능을 제공하는 커스텀 훅
 *
 * 브라우저의 Clipboard API를 사용하여 텍스트를 클립보드에 복사하고
 * 복사 성공 여부를 추적합니다.
 *
 * @returns {Object} 클립보드 관련 상태와 함수들
 * @returns {boolean} returns.copied - 복사 성공 여부
 * @returns {Function} returns.copyToClipboard - 텍스트를 클립보드에 복사하는 함수
 *
 * @example
 * ```typescript
 * const { copied, copyToClipboard } = useClipboard();
 *
 * const handleCopy = async () => {
 *   await copyToClipboard('복사할 텍스트');
 *   if (copied) {
 *     console.log('복사 성공!');
 *   }
 * };
 * ```
 */
export function useClipboard() {
  const [copied, setCopied] = useState(false);

  /**
   * 텍스트를 클립보드에 복사합니다.
   *
   * @param text - 복사할 텍스트
   * @returns Promise<void>
   */
  const copyToClipboard = useCallback(async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // 2초 후 복사 상태를 초기화
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      setCopied(false);
    }
  }, []);

  return { copyToClipboard, copied };
}
