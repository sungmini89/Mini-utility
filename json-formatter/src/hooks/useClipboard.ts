import { useState, useCallback, useRef } from "react";

/**
 * A simple hook that provides a copy function and a boolean
 * indicating whether a copy has recently occurred.  The copied state
 * resets after two seconds to allow the UI to update accordingly.
 */
function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const copy = useCallback(async (text: string) => {
    if (!text.trim()) {
      console.warn("useClipboard: attempting to copy empty text");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Clear existing timeout to prevent memory leaks
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("useClipboard: copy failed", error);
      throw error;
    }
  }, []);

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Cleanup effect
  useState(() => {
    return cleanup;
  });

  return [copied, copy];
}

export default useClipboard;
