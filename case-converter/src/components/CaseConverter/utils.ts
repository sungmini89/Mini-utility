import type { CaseOption } from "./types";

/**
 * 텍스트를 Title Case로 변환합니다.
 * 각 단어의 첫 번째 문자는 대문자로, 나머지는 소문자로 변환합니다.
 * 단어는 공백과 구두점으로 구분됩니다.
 *
 * @param text - 변환할 텍스트
 * @returns Title Case로 변환된 텍스트
 *
 * @example
 * toTitleCase("hello world") // "Hello World"
 * toTitleCase("HELLO WORLD") // "Hello World"
 */
function toTitleCase(text: string): string {
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * 텍스트를 Sentence case로 변환합니다.
 * 각 문장의 첫 번째 글자만 대문자로, 나머지는 소문자로 변환합니다.
 * 문장은 '.', '!' 또는 '?' 다음에 공백이 오는 것으로 구분됩니다.
 *
 * @param text - 변환할 텍스트
 * @returns Sentence case로 변환된 텍스트
 *
 * @example
 * toSentenceCase("hello. world! how are you?") // "Hello. World! How are you?"
 */
function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*[a-zA-Z])|([.!?]\s*[a-zA-Z])/g, (char) =>
      char.toUpperCase()
    );
}

/**
 * 텍스트를 camelCase로 변환합니다.
 * 영숫자가 아닌 문자는 제거되고, 각 후속 단어의 첫 번째 글자는 대문자로 변환됩니다.
 *
 * @param text - 변환할 텍스트
 * @returns camelCase로 변환된 텍스트
 *
 * @example
 * toCamelCase("hello world") // "helloWorld"
 * toCamelCase("hello-world") // "helloWorld"
 * toCamelCase("hello_world") // "helloWorld"
 */
function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, group1: string) => group1.toUpperCase());
}

/**
 * 텍스트를 PascalCase로 변환합니다.
 * camelCase와 유사하지만 첫 번째 글자도 대문자로 변환됩니다.
 *
 * @param text - 변환할 텍스트
 * @returns PascalCase로 변환된 텍스트
 *
 * @example
 * toPascalCase("hello world") // "HelloWorld"
 * toPascalCase("hello-world") // "HelloWorld"
 */
function toPascalCase(text: string): string {
  const camel = toCamelCase(text);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * 텍스트를 snake_case로 변환합니다.
 * 단어는 언더스코어로 연결되고 모든 글자는 소문자로 변환됩니다.
 * 연속된 영숫자가 아닌 문자는 단일 언더스코어로 축약됩니다.
 *
 * @param text - 변환할 텍스트
 * @returns snake_case로 변환된 텍스트
 *
 * @example
 * toSnakeCase("hello world") // "hello_world"
 * toSnakeCase("Hello World") // "hello_world"
 * toSnakeCase("hello-world") // "hello_world"
 */
function toSnakeCase(text: string): string {
  return text
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

/**
 * 텍스트를 kebab-case로 변환합니다.
 * 단어는 하이픈으로 연결되고 모든 글자는 소문자로 변환됩니다.
 * 연속된 영숫자가 아닌 문자는 단일 하이픈으로 축약됩니다.
 *
 * @param text - 변환할 텍스트
 * @returns kebab-case로 변환된 텍스트
 *
 * @example
 * toKebabCase("hello world") // "hello-world"
 * toKebabCase("Hello World") // "hello-world"
 * toKebabCase("hello_world") // "hello-world"
 */
function toKebabCase(text: string): string {
  return text
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

/**
 * 텍스트를 InVeRsE CaSe로 변환합니다.
 * 각 알파벳 문자의 대소문자를 토글합니다; 대문자는 소문자로, 소문자는 대문자로 변환됩니다.
 * 알파벳이 아닌 문자는 변경되지 않습니다.
 *
 * @param text - 변환할 텍스트
 * @returns InVeRsE CaSe로 변환된 텍스트
 *
 * @example
 * toInverseCase("Hello World") // "hELLO wORLD"
 * toInverseCase("123 abc") // "123 ABC"
 */
function toInverseCase(text: string): string {
  return Array.from(text)
    .map((char) => {
      if (char >= "a" && char <= "z") return char.toUpperCase();
      if (char >= "A" && char <= "Z") return char.toLowerCase();
      return char;
    })
    .join("");
}

/**
 * 제공된 텍스트에 선택된 케이스 변환을 수행합니다.
 * 구현은 위에 정의된 헬퍼 함수들에 위임합니다.
 *
 * @param text - 변환할 텍스트
 * @param option - 적용할 케이스 변환 옵션
 * @returns 변환된 텍스트
 *
 * @example
 * convert("hello world", "UPPERCASE") // "HELLO WORLD"
 * convert("hello world", "camelCase") // "helloWorld"
 * convert("hello world", "snake_case") // "hello_world"
 */
export function convert(text: string, option: CaseOption): string {
  switch (option) {
    case "UPPERCASE":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "Title Case":
      return toTitleCase(text);
    case "Sentence case":
      return toSentenceCase(text);
    case "camelCase":
      return toCamelCase(text);
    case "PascalCase":
      return toPascalCase(text);
    case "snake_case":
      return toSnakeCase(text);
    case "kebab-case":
      return toKebabCase(text);
    case "InVeRsE CaSe":
      return toInverseCase(text);
    default:
      return text;
  }
}
