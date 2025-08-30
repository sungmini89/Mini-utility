/**
 * 문자열이 유효한 이메일 주소인지 검증합니다
 *
 * 기본적인 이메일 형식을 검증합니다:
 * - @ 기호가 포함되어야 함
 * - @ 앞뒤로 문자가 있어야 함
 * - 도메인에 점(.)이 포함되어야 함
 *
 * @param {string} email - 검증할 이메일 주소
 * @returns {boolean} 유효한 이메일이면 true, 그렇지 않으면 false
 *
 * @example
 * ```ts
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid-email'); // false
 * isValidEmail('@example.com'); // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 문자열이 유효한 URL인지 검증합니다
 *
 * HTTP/HTTPS 프로토콜을 포함한 URL 형식을 검증합니다.
 *
 * @param {string} url - 검증할 URL
 * @returns {boolean} 유효한 URL이면 true, 그렇지 않으면 false
 *
 * @example
 * ```ts
 * isValidURL('https://example.com'); // true
 * isValidURL('http://localhost:3000'); // true
 * isValidURL('not-a-url'); // false
 * ```
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 문자열에서 HTML 태그를 제거합니다
 *
 * 정규식을 사용하여 모든 HTML 태그를 제거하고 순수 텍스트만 반환합니다.
 *
 * @param {string} html - HTML 태그가 포함된 문자열
 * @returns {string} HTML 태그가 제거된 순수 텍스트
 *
 * @example
 * ```ts
 * stripHTML('<p>Hello <strong>World</strong></p>'); // 'Hello World'
 * stripHTML('<div>Content</div>'); // 'Content'
 * ```
 */
export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * 문자열을 지정된 길이로 자르고 말줄임표를 추가합니다
 *
 * 문자열이 지정된 길이를 초과하면 자르고 말줄임표(...)를 추가합니다.
 *
 * @param {string} text - 자를 텍스트
 * @param {number} maxLength - 최대 길이
 * @returns {string} 잘린 텍스트 (필요시 말줄임표 포함)
 *
 * @example
 * ```ts
 * truncate('This is a very long text', 10); // 'This is a...'
 * truncate('Short text', 20); // 'Short text'
 * ```
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

/**
 * 문자열의 첫 글자를 대문자로 변환합니다
 *
 * 문자열의 첫 번째 문자만 대문자로 변환하고 나머지는 그대로 유지합니다.
 *
 * @param {string} text - 변환할 텍스트
 * @returns {string} 첫 글자가 대문자인 텍스트
 *
 * @example
 * ```ts
 * capitalize('hello world'); // 'Hello world'
 * capitalize('JAVASCRIPT'); // 'JAVASCRIPT'
 * ```
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * 숫자를 천 단위로 구분하여 포맷팅합니다
 *
 * 큰 숫자를 읽기 쉽게 천 단위로 쉼표를 추가하여 포맷팅합니다.
 *
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 천 단위로 구분된 문자열
 *
 * @example
 * ```ts
 * formatNumber(1234567); // '1,234,567'
 * formatNumber(1000); // '1,000'
 * formatNumber(123); // '123'
 * ```
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * 두 날짜 간의 차이를 일 단위로 계산합니다
 *
 * @param {Date} date1 - 첫 번째 날짜
 * @param {Date} date2 - 두 번째 날짜
 * @returns {number} 두 날짜 간의 차이 (일 단위, 절댓값)
 *
 * @example
 * ```ts
 * const today = new Date();
 * const tomorrow = new Date(today);
 * tomorrow.setDate(tomorrow.getDate() + 1);
 * getDaysDifference(today, tomorrow); // 1
 * ```
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return dayDiff;
}
