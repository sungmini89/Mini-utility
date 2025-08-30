/**
 * 배열에서 무작위로 하나의 요소를 선택합니다
 *
 * 이 함수는 주어진 배열에서 임의의 인덱스를 선택하여
 * 해당 위치의 요소를 반환합니다. 빈 배열의 경우 undefined를 반환합니다.
 *
 * 사용 예시:
 * - Lorem Ipsum 텍스트 생성 시 어휘 배열에서 단어 선택
 * - 다양한 더미 텍스트 패턴 생성
 *
 * @template T - 배열 요소의 타입
 * @param {T[]} arr - 선택할 요소가 포함된 배열
 * @returns {T|undefined} 무작위로 선택된 요소 또는 빈 배열인 경우 undefined
 *
 * @example
 * const words = ['lorem', 'ipsum', 'dolor'];
 * const randomWord = randomChoice(words); // 'lorem', 'ipsum', 'dolor' 중 하나
 *
 * const emptyArray = [];
 * const result = randomChoice(emptyArray); // undefined
 */
export function randomChoice<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * 주어진 어휘에서 지정된 개수만큼의 단어를 생성합니다
 *
 * 이 함수는 어휘 배열을 순환하면서 요청된 단어 수만큼 단어를 생성합니다.
 * 어휘 배열의 길이보다 많은 단어가 요청되면 배열을 반복하여 사용합니다.
 *
 * Lorem Ipsum 생성기의 핵심 함수로, 사용자가 요청한 단어 수에 맞춰
 * 자연스러운 더미 텍스트를 만들기 위해 사용됩니다.
 *
 * 동작 방식:
 * 1. 요청된 단어 수만큼 반복
 * 2. 어휘 배열의 인덱스를 순환 (0, 1, 2, 0, 1, 2...)
 * 3. 각 인덱스에 해당하는 단어를 결과 배열에 추가
 *
 * @param {string[]} vocab - 사용할 어휘 배열 (예: ['lorem', 'ipsum', 'dolor'])
 * @param {number} count - 생성할 단어의 개수
 * @returns {string[]} 생성된 단어들의 배열
 *
 * @example
 * const englishVocab = ['lorem', 'ipsum', 'dolor'];
 * const words = generateWords(englishVocab, 5);
 * // 결과: ['lorem', 'ipsum', 'dolor', 'lorem', 'ipsum']
 *
 * const koreanVocab = ['로렘', '입숨', '가나다'];
 * const koreanWords = generateWords(koreanVocab, 4);
 * // 결과: ['로렘', '입숨', '가나다', '로렘']
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
