import type { MatchResult, TokenDescription, SavedPattern } from "./types";

/**
 * 주어진 패턴과 플래그로 정규식을 컴파일하려고 시도합니다.
 * 성공 시 RegExp 인스턴스를 반환하고, 구문 오류 시 null을 반환합니다.
 * 호출자는 결과 null을 적절히 처리해야 합니다.
 *
 * @param {string} pattern - 컴파일할 정규식 패턴
 * @param {string} flags - 정규식 플래그 (g, i, m, s, u)
 * @returns {RegExp | null} 컴파일된 정규식 또는 null (오류 시)
 */
export function buildRegex(pattern: string, flags: string): RegExp | null {
  try {
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}

/**
 * 텍스트에 대해 정규식을 실행하고 모든 매치를 반환합니다.
 * 전역 플래그가 있으면 사용하고, 없으면 첫 번째 매치만 반환합니다.
 * 각 매치에 대해 캡처 그룹이 포함됩니다.
 *
 * @param {RegExp} regex - 실행할 정규식
 * @param {string} text - 매치할 텍스트
 * @returns {MatchResult[]} 매치 결과 배열
 */
export function getMatches(regex: RegExp, text: string): MatchResult[] {
  const results: MatchResult[] = [];
  // ✅ 원본 정규식을 복사하여 lastIndex 수정 방지
  const regexCopy = new RegExp(regex.source, regex.flags);
  // 전역 검색이 시작 부분에서 시작하도록 lastIndex를 리셋
  regexCopy.lastIndex = 0;
  let match: RegExpExecArray | null;
  // 전역 플래그가 설정되면 더 이상 매치가 없을 때까지 반복하고,
  // 그렇지 않으면 단일 exec만 수행
  if (regexCopy.global) {
    while ((match = regexCopy.exec(text)) !== null) {
      results.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1),
      });
      // 제로 길이 매치의 경우 무한 루프를 방지하기 위해
      // 수동으로 앞으로 이동
      if (match[0] === "") {
        regexCopy.lastIndex++;
      }
    }
  } else {
    match = regexCopy.exec(text);
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
 * 제공된 정규식을 사용하여 입력 텍스트에 치환 문자열을 적용합니다.
 * 정규식이 유효하지 않거나 치환이 지정되지 않은 경우
 * 원본 텍스트가 변경되지 않고 반환됩니다.
 *
 * @param {RegExp | null} regex - 사용할 정규식
 * @param {string} text - 치환할 텍스트
 * @param {string} replacement - 치환 문자열
 * @returns {string} 치환된 텍스트
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
 * 간단한 정규식 토큰 설명입니다.
 * 일반적인 이스케이프 시퀀스와 연산자를 사람이 읽을 수 있는 설명으로 매핑합니다.
 * 이 사전은 완전하지는 않지만 많은 일상적인 토큰을 다룹니다.
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
 * 정규식 패턴을 토큰과 설명이 포함된 목록으로 파싱합니다.
 * 알 수 없는 토큰은 리터럴 문자로 처리됩니다.
 * \x 형태의 이스케이프 시퀀스는 단일 토큰으로 인식됩니다.
 *
 * @param {string} pattern - 파싱할 정규식 패턴
 * @returns {TokenDescription[]} 토큰 설명 배열
 */
export function describePattern(pattern: string): TokenDescription[] {
  const tokens: TokenDescription[] = [];
  let i = 0;
  while (i < pattern.length) {
    // ✅ while 루프로 변경하여 인덱스 제어 개선
    let token = pattern[i];
    // 이스케이프 시퀀스를 2문자 토큰으로 처리
    if (token === "\\" && i < pattern.length - 1) {
      const seq = pattern.slice(i, i + 2);
      token = seq;
      i += 2; // ✅ 2씩 증가하여 이스케이프 시퀀스 처리
    } else {
      i++; // ✅ 일반 문자는 1씩 증가
    }
    const desc = TOKEN_DESCRIPTIONS[token] || `리터럴 '${token}'`;
    tokens.push({ token, description: desc });
  }
  return tokens;
}

/**
 * 사용자가 빠르게 삽입할 수 있는 미리 정의된 정규식 템플릿입니다.
 * 각 템플릿은 라벨, 패턴 및 선택적 기본 플래그를 포함합니다.
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
 * 설명이 포함된 치트시트 토큰입니다.
 * describePattern에서 사용하는 것과 동일한 설명 사전에서 파생됩니다.
 * 이 목록은 사용자가 정규식을 구성할 때 도움을 주기 위해 UI에 표시할 수 있습니다.
 */
export const CHEAT_SHEET: TokenDescription[] = Object.entries(
  TOKEN_DESCRIPTIONS
).map(([token, description]) => ({ token, description }));
