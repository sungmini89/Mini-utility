import type { CaseOption } from './types';

/**
 * Convert a string into Title Case.  Each word's first character is
 * capitalised while the rest are lowercased.  Words are delimited by
 * whitespace and punctuation.
 */
function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Convert a string into Sentence case.  Only the first letter of each
 * sentence is capitalised while the remainder are lowercased.  Sentences
 * are delimited by '.', '!' or '?' followed by whitespace.
 */
function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*[a-zA-Z])|([.!?]\s*[a-zA-Z])/g, (char) => char.toUpperCase());
}

/**
 * Convert a string into camelCase.  Non‑alphanumeric characters are
 * removed and the first letter of each subsequent word is capitalised.
 */
function toCamelCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, group1: string) => group1.toUpperCase());
}

/**
 * Convert a string into PascalCase.  Similar to camelCase but the first
 * letter is also capitalised.
 */
function toPascalCase(text: string): string {
  const camel = toCamelCase(text);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Convert a string into snake_case.  Words are joined with underscores
 * and all letters are lowercased.  Consecutive non‑alphanumeric characters
 * are collapsed into a single underscore.
 */
function toSnakeCase(text: string): string {
  return text
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/**
 * Convert a string into kebab-case.  Words are joined with hyphens and
 * all letters are lowercased.  Consecutive non‑alphanumeric characters
 * are collapsed into a single hyphen.
 */
function toKebabCase(text: string): string {
  return text
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Convert a string into InVeRsE CaSe.  Each alphabetical character
 * toggles its case; uppercase becomes lowercase and vice versa.  Non
 * letters are left unchanged.
 */
function toInverseCase(text: string): string {
  return Array.from(text)
    .map((char) => {
      if (char >= 'a' && char <= 'z') return char.toUpperCase();
      if (char >= 'A' && char <= 'Z') return char.toLowerCase();
      return char;
    })
    .join('');
}

/**
 * Perform the selected case conversion on the provided text.  The
 * implementation delegates to helper functions defined above.
 */
export function convert(text: string, option: CaseOption): string {
  switch (option) {
    case 'UPPERCASE':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'Title Case':
      return toTitleCase(text);
    case 'Sentence case':
      return toSentenceCase(text);
    case 'camelCase':
      return toCamelCase(text);
    case 'PascalCase':
      return toPascalCase(text);
    case 'snake_case':
      return toSnakeCase(text);
    case 'kebab-case':
      return toKebabCase(text);
    case 'InVeRsE CaSe':
      return toInverseCase(text);
    default:
      return text;
  }
}