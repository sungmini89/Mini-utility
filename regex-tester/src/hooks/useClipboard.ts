import { useState, useEffect } from "react";

/**
 * 클립보드 복사 기능을 제공하는 커스텀 훅
 *
 * 이 훅은 텍스트를 클립보드에 복사하고 복사 상태를 관리합니다.
 * 복사 성공 시 일정 시간 동안 "복사됨" 상태를 표시합니다.
 *
 * @returns {[boolean, (text: string) => Promise<void>]} 복사 상태와 복사 함수
 *
 * @example
 * ```tsx
 * const [copied, copy] = useClipboard();
 *
 * const handleCopy = async () => {
 *   await copy('복사할 텍스트');
 *   // copied가 true가 되어 UI에서 복사 완료 표시 가능
 * };
 *
 * return (
 *   <button onClick={handleCopy}>
 *     {copied ? '복사됨!' : '복사'}
 *   </button>
 * );
 * ```
 */
function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  // 복사 상태를 자동으로 리셋하는 효과
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  /**
   * 텍스트를 클립보드에 복사합니다
   *
   * @param {string} text - 클립보드에 복사할 텍스트
   * @returns {Promise<void>} 복사 작업 완료 시 resolve되는 Promise
   *
   * @throws {Error} 클립보드 API가 지원되지 않거나 복사 실패 시
   */
  const copy = async (text: string): Promise<void> => {
    try {
      // 클립보드 API가 지원되는지 확인
      if (!navigator.clipboard) {
        throw new Error("클립보드 API가 지원되지 않습니다");
      }

      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      throw error;
    }
  };

  return [copied, copy];
}

export default useClipboard;
