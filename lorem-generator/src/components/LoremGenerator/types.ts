/**
 * Lorem Ipsum 텍스트 생성을 위한 사용자 설정 옵션
 *
 * 이 인터페이스는 사용자가 텍스트 생성 시 지정할 수 있는 모든 옵션을 정의합니다.
 * 각 옵션은 텍스트의 구조, 언어, 형식을 결정하는 데 사용됩니다.
 *
 * 옵션 설명:
 * - paragraphs: 생성할 문단의 개수 (1-100 범위)
 * - sentences: 각 문단당 포함할 문장의 개수 (1-100 범위)
 * - words: 각 문장당 포함할 단어의 개수 (1-100 범위)
 * - language: 텍스트 언어 선택 ('eng': 영어, 'kor': 한국어)
 * - includeHtml: HTML 태그 포함 여부
 * - htmlTag: HTML 태그 종류 (p, h1, h2, h3, li)
 * - list: 리스트 형식으로 출력할지 여부
 * - customStart: 문장 시작에 추가할 커스텀 텍스트
 *
 * 사용 예시:
 * ```typescript
 * const options: LoremOptions = {
 *   paragraphs: 3,
 *   sentences: 2,
 *   words: 8,
 *   language: 'eng',
 *   includeHtml: true,
 *   htmlTag: 'p',
 *   list: false,
 *   customStart: 'Hello'
 * };
 * ```
 */
export interface LoremOptions {
  /** 생성할 문단의 개수 (1-100) */
  paragraphs: number;
  /** 각 문단당 포함할 문장의 개수 (1-100) */
  sentences: number;
  /** 각 문장당 포함할 단어의 개수 (1-100) */
  words: number;
  /** 텍스트 언어 선택 */
  language: "eng" | "kor";
  /** HTML 태그 포함 여부 */
  includeHtml: boolean;
  /** 사용할 HTML 태그 (p, h1, h2, h3, li) */
  htmlTag: string;
  /** 리스트 형식으로 출력할지 여부 */
  list: boolean;
  /** 문장 시작에 추가할 커스텀 텍스트 */
  customStart: string;
}

/**
 * 생성된 Lorem Ipsum 텍스트와 설정 정보를 저장하는 히스토리 항목
 *
 * 이 인터페이스는 사용자가 생성한 텍스트와 해당 텍스트를 생성할 때
 * 사용한 설정을 함께 저장하여 나중에 참조할 수 있게 합니다.
 *
 * 히스토리 항목 구성:
 * - text: 실제 생성된 텍스트 내용
 * - options: 텍스트 생성에 사용된 설정 옵션
 * - date: 생성된 시간 (Unix timestamp)
 *
 * 사용 예시:
 * ```typescript
 * const historyItem: HistoryItem = {
 *   text: 'Lorem ipsum dolor sit amet. Consectetur adipiscing elit.',
 *   options: {
 *     paragraphs: 1,
 *     sentences: 2,
 *     words: 5,
 *     language: 'eng',
 *     includeHtml: false,
 *     htmlTag: 'p',
 *     list: false,
 *     customStart: ''
 *   },
 *   date: Date.now()
 * };
 * ```
 *
 * 히스토리 활용:
 * - 사용자가 자주 사용하는 설정 조합 확인
 * - 이전에 생성한 텍스트 재사용
 * - 설정 패턴 분석 및 최적화
 * - 사용자 경험 개선을 위한 데이터 수집
 */
export interface HistoryItem {
  /** 생성된 텍스트 내용 */
  text: string;
  /** 텍스트 생성에 사용된 설정 옵션 */
  options: LoremOptions;
  /** 생성된 시간 (Unix timestamp) */
  date: number;
}
