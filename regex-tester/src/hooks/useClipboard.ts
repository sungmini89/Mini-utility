import { useState, useEffect } from "react";

/**
 * A simple hook that provides a copy function and a boolean
 * indicating whether a copy has recently occurred.  The copied state
 * resets after two seconds to allow the UI to update accordingly.
 */
function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  // ✅ useEffect를 사용하여 setTimeout 정리
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // ✅ setTimeout 제거 - useEffect에서 처리
    } catch (error) {
      console.error("useClipboard: copy failed", error);
      throw error;
    }
  }
  return [copied, copy];
}

export default useClipboard;
