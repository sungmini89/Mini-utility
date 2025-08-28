import { useState } from 'react';

/**
 * A simple hook that provides a copy function and a boolean indicating
 * whether a copy has recently occurred.  The copied state resets after
 * two seconds to allow the UI to update accordingly.
 */
function useClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('useClipboard: copy failed', error);
      throw error;
    }
  }
  return [copied, copy];
}

export default useClipboard;