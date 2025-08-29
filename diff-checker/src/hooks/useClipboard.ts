import { useState } from "react";

/**
 * 복사 함수와 최근에 복사가 발생했는지를 나타내는 불린 값을 제공하는 간단한 훅입니다.
 * 복사된 상태는 2초 후에 자동으로 리셋되어 UI가 그에 따라 업데이트될 수 있습니다.
 *
 * @returns {[boolean, (text: string) => Promise<void>]} [복사 상태, 텍스트를 복사하는 함수]
 */
function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  /**
   * 텍스트를 클립보드에 복사합니다.
   *
   * @param {string} text - 클립보드에 복사할 텍스트
   * @returns {Promise<void>}
   */
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
