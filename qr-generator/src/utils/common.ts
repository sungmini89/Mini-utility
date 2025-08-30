/**
 * Choose a random element from an array.  If the array is empty it
 * returns undefined.  Included for potential future use.
 */
export function randomChoice<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Generate a list of words by cycling through the provided vocabulary
 * array until the desired count is reached.  Provided for
 * completeness.
 */
export function generateWords(vocab: string[], count: number): string[] {
  const result: string[] = [];
  let i = 0;
  while (result.length < count) {
    result.push(vocab[i % vocab.length]);
    i++;
  }
  return result;
}

/**
 * Clear all QR generator related localStorage items
 */
export function clearQrGeneratorStorage(): void {
  if (typeof window === "undefined") return;

  const keysToRemove = [
    "qrGenerator:text",
    "qrGenerator:url",
    "qrGenerator:wifi",
    "qrGenerator:vcard",
    "qrGenerator:email",
    "qrGenerator:sms",
    "qrGenerator:size",
    "qrGenerator:fgColor",
    "qrGenerator:bgColor",
    "qrGenerator:logo",
    "qrGenerator:history",
    "qrGenerator:darkMode",
  ];

  keysToRemove.forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn("Failed to remove localStorage key:", key, error);
    }
  });
}

/**
 * Validate and clean localStorage data
 */
export function validateLocalStorage(): void {
  if (typeof window === "undefined") return;

  const keysToCheck = [
    "qrGenerator:text",
    "qrGenerator:url",
    "qrGenerator:wifi",
    "qrGenerator:vcard",
    "qrGenerator:email",
    "qrGenerator:sms",
    "qrGenerator:size",
    "qrGenerator:fgColor",
    "qrGenerator:bgColor",
    "qrGenerator:logo",
    "qrGenerator:history",
    "qrGenerator:darkMode",
  ];

  keysToCheck.forEach((key) => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === "undefined" || stored === "null") {
        window.localStorage.removeItem(key);
      } else if (stored) {
        JSON.parse(stored); // 파싱 테스트
      }
    } catch (error) {
      console.warn("Invalid localStorage data found, removing:", key, error);
      try {
        window.localStorage.removeItem(key);
      } catch (removeError) {
        console.warn("Failed to remove invalid key:", key, removeError);
      }
    }
  });
}
