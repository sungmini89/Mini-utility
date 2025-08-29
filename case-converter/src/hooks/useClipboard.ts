import { useState } from "react";

/**
 * 복사 함수와 최근에 복사가 발생했는지를 나타내는 불린을 제공하는 간단한 훅입니다.
 *
 * 복사된 상태는 2초 후에 리셋되어 UI가 그에 따라 업데이트될 수 있도록 합니다.
 *
 * @returns [boolean, (text: string) => Promise<void>] - [복사 상태, 복사 함수]
 *
 * @example
 * const [copied, copy] = useClipboard();
 * // copied: 최근에 복사가 발생했는지 여부
 * // copy: 텍스트를 클립보드에 복사하는 함수
 *
 * await copy("Hello World");
 * // "Hello World"가 클립보드에 복사되고 copied가 true가 됨
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
