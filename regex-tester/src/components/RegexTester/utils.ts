import type { MatchResult, TokenDescription, SavedPattern } from "./types";

/**
 * Attempt to compile a regular expression from the given pattern and flags.
 * Returns the RegExp instance on success or null on syntax error.  The
 * caller should handle any resulting null appropriately.
 */
export function buildRegex(pattern: string, flags: string): RegExp | null {
  try {
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}

/**
 * Execute a regular expression against a piece of text and return all
 * matches.  Uses the global flag if present; otherwise only the first
 * match is returned.  Capturing groups are included for each match.
 */
export function getMatches(regex: RegExp, text: string): MatchResult[] {
  const results: MatchResult[] = [];
  // Reset lastIndex to ensure global searches start at the beginning
  regex.lastIndex = 0;
  let match: RegExpExecArray | null;
  // If global flag is set iterate until no further matches; otherwise
  // just perform a single exec.
  if (regex.global) {
    while ((match = regex.exec(text)) !== null) {
      results.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1),
      });
      // In case of zero‑length match avoid infinite loop by moving
      // forward manually.
      if (match[0] === "") {
        regex.lastIndex++;
      }
    }
  } else {
    match = regex.exec(text);
    if (match) {
      results.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1),
      });
    }
  }
  return results;
}

/**
 * Apply a replacement string to the input text using the provided
 * regular expression.  If the regex is invalid or no replacement is
 * specified the original text is returned unchanged.
 */
export function applyReplace(
  regex: RegExp | null,
  text: string,
  replacement: string
): string {
  if (!regex) return text;
  try {
    return text.replace(regex, replacement);
  } catch {
    return text;
  }
}

/**
 * Simple regex token descriptions.  Maps common escape sequences and
 * operators to human readable explanations.  This dictionary is not
 * exhaustive but covers many everyday tokens.
 */
const TOKEN_DESCRIPTIONS: Record<string, string> = {
  "\\d": "숫자 (0–9)",
  "\\D": "숫자가 아닌 문자",
  "\\w": "단어 문자 (알파벳, 숫자, 언더스코어)",
  "\\W": "단어가 아닌 문자",
  "\\s": "공백 문자",
  "\\S": "공백이 아닌 문자",
  ".": "줄바꿈을 제외한 모든 문자",
  "*": "앞의 요소가 0개 이상",
  "+": "앞의 요소가 1개 이상",
  "?": "앞의 요소가 0개 또는 1개",
  "\\b": "단어 경계",
  "^": "입력의 시작",
  $: "입력의 끝",
  "|": "선택 (OR)",
  "(": "캡처 그룹 시작",
  ")": "캡처 그룹 끝",
  "[": "문자 클래스 시작",
  "]": "문자 클래스 끝",
  "{": "수량자 시작",
  "}": "수량자 끝",
};

/**
 * Parse a regular expression pattern into a list of tokens along with
 * descriptions.  Unknown tokens are treated as literal characters.
 * Escaped sequences of the form \x are recognised as a single token.
 */
export function describePattern(pattern: string): TokenDescription[] {
  const tokens: TokenDescription[] = [];
  for (let i = 0; i < pattern.length; i++) {
    let token = pattern[i];
    // Handle escape sequences as two‑character tokens
    if (token === "\\" && i < pattern.length - 1) {
      const seq = pattern.slice(i, i + 2);
      token = seq;
      i++; // advance extra character
    }
    const desc = TOKEN_DESCRIPTIONS[token] || `literal '${token}'`;
    tokens.push({ token, description: desc });
  }
  return tokens;
}

/**
 * Predefined regex templates that users can quickly insert.  Each
 * template contains a label, a pattern and optional default flags.
 */
export const REGEX_TEMPLATES: {
  label: string;
  pattern: string;
  flags: string;
}[] = [
  {
    label: "이메일",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "i",
  },
  {
    label: "URL",
    pattern: "https?:\\/\\/[\\w.-]+",
    flags: "i",
  },
  {
    label: "IPv4 주소",
    pattern:
      "(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)(?:\\.(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)){3}",
    flags: "",
  },
  {
    label: "우편번호 (미국)",
    pattern: "\\b\\d{5}(?:-\\d{4})?\\b",
    flags: "",
  },
];

/**
 * Cheat sheet tokens with descriptions.  Derived from the same
 * description dictionary used by describePattern.  This list can be
 * displayed in the UI to aid users when constructing regular
 * expressions.
 */
export const CHEAT_SHEET: TokenDescription[] = Object.entries(
  TOKEN_DESCRIPTIONS
).map(([token, description]) => ({ token, description }));
