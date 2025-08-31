import { useCallback } from "react";

/**
 * @fileoverview 클립보드 복사 기능을 제공하는 커스텀 훅
 * @description 텍스트를 클립보드에 복사하고 성공/실패 상태를 관리합니다.
 * @author Date Calculator Team
 * @version 1.0.0
 */

/**
 * 클립보드 복사 기능을 제공하는 커스텀 훅
 * @description 텍스트를 클립보드에 복사하고, 복사 성공/실패 여부를 반환합니다.
 *
 * @returns {[boolean, (text: string) => Promise<void>]} [복사 성공 여부, 복사 함수]
 *
 * @example
 * ```tsx
 * const [copied, copy] = useClipboard();
 *
 * return (
 *   <button onClick={() => copy('복사할 텍스트')}>
 *     {copied ? '복사됨!' : '복사하기'}
 *   </button>
 * );
 * ```
 */
const useClipboard = (): [boolean, (text: string) => Promise<void>] => {
  /**
   * 텍스트를 클립보드에 복사합니다.
   * @param {string} text - 복사할 텍스트
   * @returns {Promise<void>} 복사 완료 시 resolve되는 Promise
   */
  const copy = useCallback(async (text: string): Promise<void> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // 최신 브라우저의 Clipboard API 사용
        await navigator.clipboard.writeText(text);
      } else {
        // 구형 브라우저를 위한 fallback 방법
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("클립보드 복사 실패:", err);
          throw err;
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error("클립보드 복사 중 오류 발생:", error);
      throw error;
    }
  }, []);

  return [false, copy] as const;
};

export default useClipboard;
