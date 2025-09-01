import { useState } from "react";

/**
 * @fileoverview 클립보드 복사 기능을 제공하는 커스텀 훅
 *
 * 이 훅은 텍스트를 클립보드에 복사하는 기능을 제공하며, 최신 브라우저와
 * 레거시 브라우저 모두를 지원합니다. 복사 성공 여부를 추적하고
 * 자동으로 상태를 리셋합니다.
 *
 * @author Favicon Generator Team
 * @version 1.0.0
 */

/**
 * @description 클립보드 복사 기능을 제공하는 훅
 *
 * 텍스트를 클립보드에 복사하는 기능을 제공하는 훅입니다:
 * - 최신 navigator.clipboard API 우선 사용
 * - 레거시 브라우저를 위한 document.execCommand 폴백
 * - 복사 성공 여부 자동 추적
 * - 1.5초 후 자동으로 복사 상태 리셋
 * - 보안 컨텍스트 검증
 *
 * @returns {[boolean, (text: string) => Promise<void>]} [복사 성공 여부, 복사 함수]
 *
 * @example
 * ```typescript
 * const [copied, copy] = useClipboard();
 *
 * const handleCopy = async () => {
 *   try {
 *     await copy('복사할 텍스트');
 *     console.log('복사 성공!');
 *   } catch (error) {
 *     console.error('복사 실패:', error);
 *   }
 * };
 * ```
 */
export default function useClipboard(): [
  boolean,
  (text: string) => Promise<void>
] {
  const [copied, setCopied] = useState(false);

  const fallbackCopyTextToClipboard = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
          resolve();
        } else {
          reject(new Error("Fallback copy failed"));
        }
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
  };

  const copy = async (text: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fall back to legacy method
        await fallbackCopyTextToClipboard(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
      throw error;
    }
  };
  return [copied, copy];
}
