import { useState } from "react";

/**
 * 클립보드에 텍스트를 복사하는 기능을 제공하는 커스텀 훅
 *
 * 마지막 복사 작업의 성공 여부를 나타내는 불린 값을 반환합니다.
 * 생성된 비밀번호를 피드백과 함께 복사하는 데 유용합니다.
 *
 * @returns {[boolean, (text: string) => Promise<void>]} [복사 성공 여부, 복사 함수]
 *
 * @example
 * ```tsx
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
 *
 * return (
 *   <button onClick={handleCopy}>
 *     {copied ? '복사됨!' : '복사하기'}
 *   </button>
 * );
 * ```
 *
 * @since 1.0.0
 * @author 비밀번호 도구 팀
 */
export default function useClipboard(): [
  boolean,
  (text: string) => Promise<void>
] {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
      throw error;
    }
  };

  return [copied, copy];
}
