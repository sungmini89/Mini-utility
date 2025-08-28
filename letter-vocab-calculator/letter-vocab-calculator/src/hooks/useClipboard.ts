import { useState } from "react";

/**
 * 복사 함수와 최근에 복사가 발생했는지를 나타내는 불린 값을 노출하는
 * 작은 훅입니다. 복사 후 플래그는 짧은 지연 후 자동으로 false로
 * 재설정됩니다. 클립보드 API를 사용할 수 없는 경우 프로미스가 거부됩니다.
 */
function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // UI가 모든 표시기를 숨길 수 있도록 지연 후 복사된 상태를 재설정합니다.
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("useClipboard: copy failed", error);
      throw error;
    }
  }

  return [copied, copy];
}

export default useClipboard;
