import { useState } from 'react';

/**
 * A small hook that exposes a copy function and a boolean indicating
 * whether a copy has recently occurred.  After copying the flag will
 * automatically reset to false after a short delay.  If the clipboard
 * API is unavailable the promise will reject.
 */
function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Reset the copied state after a delay so the UI can hide any
      // indicators.
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('useClipboard: copy failed', error);
      throw error;
    }
  }

  return [copied, copy];
}

export default useClipboard;