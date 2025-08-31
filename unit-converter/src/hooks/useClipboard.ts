import { useState } from "react";

/**
 * 클립보드 복사 기능을 제공하는 훅
 *
 * 이 훅은 텍스트를 클립보드에 복사하는 함수를 제공하며,
 * 복사 성공 여부를 나타내는 불린 값을 반환합니다.
 *
 * Navigator Clipboard API를 사용하여 최신 브라우저에서 안전하게 작동합니다.
 * 복사 성공 시 1.5초 후 자동으로 상태를 초기화합니다.
 *
 * @returns [복사 성공 여부, 복사 함수] 튜플
 *
 * @example
 * ```typescript
 * const [copied, copy] = useClipboard();
 *
 * const handleCopy = async () => {
 *   await copy('복사할 텍스트');
 *   if (copied) {
 *     console.log('복사 성공!');
 *   }
 * };
 * ```
 *
 * @example
 * ```typescript
 * const [copied, copy] = useClipboard();
 *
 * return (
 *   <div>
 *     <button onClick={() => copy('Hello World')}>
 *       텍스트 복사
 *     </button>
 *     {copied && <span>복사되었습니다!</span>}
 *   </div>
 * );
 * ```
 */
export default function useClipboard(): [
  boolean,
  (text: string) => Promise<void>
] {
  // 복사 성공 여부를 나타내는 상태
  const [copied, setCopied] = useState(false);

  /**
   * 텍스트를 클립보드에 복사
   *
   * @param text 클립보드에 복사할 텍스트
   * @throws 클립보드 접근이 거부되거나 실패한 경우
   */
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // 1.5초 후 자동으로 상태 초기화
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
      throw error;
    }
  };

  return [copied, copy];
}
