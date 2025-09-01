import { randomFromString } from "../../utils/common";
import type { GeneratorOptions } from "./types";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SPECIAL = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
const SIMILAR = /[0O1lL]/g;

/**
 * 선택된 옵션에 따라 문자 풀을 구성합니다.
 * excludeSimilar이 true인 경우 각 세트에서 유사한 문자를 제거합니다.
 *
 * @param {GeneratorOptions} opts - 비밀번호 생성 옵션
 * @returns {{ pool: string; categories: string[] }} 문자 풀과 카테고리 배열
 *
 * @example
 * ```typescript
 * const { pool, categories } = buildPool({
 *   includeUpper: true,
 *   includeLower: true,
 *   includeNumbers: false,
 *   includeSpecial: false,
 *   excludeSimilar: true,
 *   length: 12,
 *   count: 1
 * });
 * // pool: "ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
 * // categories: ["ABCDEFGHIJKMNOPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz"]
 * ```
 */
function buildPool(opts: GeneratorOptions): {
  pool: string;
  categories: string[];
} {
  let pool = "";
  const categories: string[] = [];
  const processSet = (set: string) =>
    opts.excludeSimilar ? set.replace(SIMILAR, "") : set;
  if (opts.includeUpper) {
    const set = processSet(UPPER);
    pool += set;
    categories.push(set);
  }
  if (opts.includeLower) {
    const set = processSet(LOWER);
    pool += set;
    categories.push(set);
  }
  if (opts.includeNumbers) {
    const set = processSet(NUMBERS);
    pool += set;
    categories.push(set);
  }
  if (opts.includeSpecial) {
    const set = processSet(SPECIAL);
    pool += set;
    categories.push(set);
  }
  return { pool, categories };
}

/**
 * 제공된 옵션에 따라 단일 비밀번호를 생성합니다.
 * 각 선택된 카테고리에서 최소 하나의 문자가 포함되도록 보장하고
 * 문자 순서를 랜덤화합니다. 문자 세트가 선택되지 않았거나
 * 원하는 길이가 카테고리 수보다 작으면 빈 문자열을 반환합니다.
 *
 * @param {GeneratorOptions} opts - 비밀번호 생성 옵션
 * @returns {string} 생성된 비밀번호 또는 빈 문자열
 *
 * @example
 * ```typescript
 * const password = generateOne({
 *   length: 12,
 *   includeUpper: true,
 *   includeLower: true,
 *   includeNumbers: true,
 *   includeSpecial: false,
 *   excludeSimilar: false,
 *   count: 1
 * });
 * // "Kj9mNp2xQr5v" (예시)
 * ```
 */
function generateOne(opts: GeneratorOptions): string {
  const { pool, categories } = buildPool(opts);
  if (!pool) return "";
  if (opts.length < categories.length) return "";
  // 각 카테고리에서 하나씩 보장된 문자로 시작
  let chars: string[] = [];
  categories.forEach((set) => {
    chars.push(randomFromString(set));
  });
  // 나머지 비밀번호를 풀에서 랜덤 문자로 채움
  while (chars.length < opts.length) {
    chars.push(randomFromString(pool));
  }
  // Fisher-Yates 알고리즘을 사용하여 배열 셔플
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

/**
 * 옵션에 따라 여러 개의 비밀번호를 생성합니다.
 * 생성된 비밀번호 배열을 반환합니다. 생성에 실패하면
 * (예: 잘못된 옵션) 빈 배열을 반환합니다.
 *
 * @param {GeneratorOptions} opts - 비밀번호 생성 옵션
 * @returns {string[]} 생성된 비밀번호 배열
 *
 * @example
 * ```typescript
 * const passwords = generatePasswords({
 *   length: 8,
 *   includeUpper: true,
 *   includeLower: true,
 *   includeNumbers: true,
 *   includeSpecial: false,
 *   excludeSimilar: false,
 *   count: 3
 * });
 * // ["Kj9mNp2x", "Qr5vXy8z", "Ab3cDf7g"]
 * ```
 *
 * @since 1.0.0
 * @author 비밀번호 도구 팀
 */
export function generatePasswords(opts: GeneratorOptions): string[] {
  const list: string[] = [];
  for (let i = 0; i < opts.count; i++) {
    const pw = generateOne(opts);
    if (!pw) return [];
    list.push(pw);
  }
  return list;
}
