export interface Statistics {
  /** Total number of characters including whitespace */
  charCount: number;
  /** Total number of characters excluding whitespace */
  charCountNoSpaces: number;
  /** Number of words detected in the input */
  wordCount: number;
  /** Number of sentences detected based on punctuation */
  sentenceCount: number;
  /** Number of paragraphs detected by line breaks */
  paragraphCount: number;
  /** Estimated reading time in minutes based on 200 WPM */
  readingTimeMinutes: number;
  /** Number of Korean characters found */
  koreanCount: number;
  /** Number of English letters found */
  englishCount: number;
  /** Remaining characters per platform.  Negative values mean over the limit. */
  remaining: Record<string, number>;
}

/**
 * Character limits for several popular social networks and messaging platforms.
 */
export const SNS_LIMITS: Record<string, number> = {
  Twitter: 280,
  Instagram: 2200,
  Facebook: 63206,
  KakaoTalk: 1000,
};

/**
 * Compute a variety of statistics about a given piece of text.  This helper
 * function centralises all of the logic required by the UI so that the
 * component remains easy to read and test.
 *
 * @param text The input text from which to derive statistics
 */
export function computeStatistics(text: string): Statistics {
  // Character counts
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;

  // Words are delimited by whitespace.  Filter out empty strings for
  // consecutive delimiters.
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Sentences are detected by punctuation.  Filter out empty strings to
  // account for trailing punctuation.
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Paragraphs are separated by one or more newline characters.
  const paragraphs = text.split(/\n+/).filter((s) => s.trim().length > 0);
  const paragraphCount = paragraphs.length;

  // Count Korean and English characters using regular expressions.
  // Modern Korean characters: \uAC00-\uD7AF (한글 음절)
  // Korean compatibility characters: \u3131-\u318E (한글 자모)
  const koreanMatches = text.match(/[\u3131-\u318E\uAC00-\uD7AF]/g) || [];
  const englishMatches = text.match(/[A-Za-z]/g) || [];
  const koreanCount = koreanMatches.length;
  const englishCount = englishMatches.length;

  // Reading time in minutes assuming an average of 200 words per minute.
  // For very short texts, show decimal values for more accuracy
  const readingTimeMinutes = wordCount > 0 ? Math.max(0.1, wordCount / 200) : 0;

  // Compute remaining characters for each platform.  Negative values
  // indicate that the current text exceeds the platform limit.
  const remaining: Record<string, number> = {};
  for (const platform of Object.keys(SNS_LIMITS)) {
    remaining[platform] = SNS_LIMITS[platform] - charCount;
  }

  return {
    charCount,
    charCountNoSpaces,
    wordCount,
    sentenceCount,
    paragraphCount,
    readingTimeMinutes,
    koreanCount,
    englishCount,
    remaining,
  };
}
