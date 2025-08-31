/**
 * 단위 변환기 프로젝트의 공통 유틸리티 함수
 *
 * 이 파일은 다양한 컴포넌트에서 사용되는 범용 헬퍼 함수들을 포함합니다.
 * 배열 조작, 랜덤 선택 등의 기능을 제공합니다.
 */

/**
 * 배열에서 랜덤하게 하나의 요소를 선택
 *
 * 빈 배열이 주어진 경우 undefined를 반환합니다.
 *
 * @template T 배열 요소의 타입
 * @param arr 선택할 요소가 포함된 배열
 * @returns 랜덤하게 선택된 요소 또는 undefined (배열이 비어있는 경우)
 *
 * @example
 * ```typescript
 * const fruits = ['사과', '바나나', '오렌지'];
 * const randomFruit = randomChoice(fruits);
 * console.log(randomFruit); // '사과', '바나나', '오렌지' 중 하나
 *
 * const emptyArray: string[] = [];
 * const result = randomChoice(emptyArray);
 * console.log(result); // undefined
 * ```
 */
export function randomChoice<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * 배열을 순환하면서 지정된 개수만큼 요소를 반환
 *
 * 배열의 길이보다 많은 요소가 요청되면 배열을 순환하여 반복합니다.
 *
 * @template T 배열 요소의 타입
 * @param arr 순환할 원본 배열
 * @param count 반환할 요소의 개수
 * @returns 순환된 요소들로 구성된 새 배열
 *
 * @example
 * ```typescript
 * const colors = ['빨강', '파랑', '노랑'];
 *
 * // 5개 요소 요청 (배열 길이: 3)
 * const result = cycleArray(colors, 5);
 * console.log(result); // ['빨강', '파랑', '노랑', '빨강', '파랑']
 *
 * // 2개 요소 요청 (배열 길이: 3)
 * const result2 = cycleArray(colors, 2);
 * console.log(result2); // ['빨강', '파랑']
 *
 * // 빈 배열 처리
 * const emptyResult = cycleArray([], 3);
 * console.log(emptyResult); // []
 * ```
 */
export function cycleArray<T>(arr: T[], count: number): T[] {
  const result: T[] = [];
  let i = 0;
  while (result.length < count) {
    result.push(arr[i % arr.length]);
    i++;
  }
  return result;
}
