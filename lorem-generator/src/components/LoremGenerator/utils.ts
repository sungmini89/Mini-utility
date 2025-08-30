import type { LoremOptions } from "./types";
import { generateWords } from "../../utils/common";

// 영어와 한국어 Lorem Ipsum 기본 어휘 배열
// 요청된 단어 수를 충족하기 위해 필요에 따라 반복됩니다
const ENGLISH_VOCAB = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
];
const KOREAN_VOCAB = [
  "로렘",
  "입숨",
  "가나다",
  "라마바사",
  "아자차",
  "카타",
  "파하",
  "더미",
  "텍스트",
  "샘플",
];

/**
 * 문자열의 첫 번째 문자를 대문자로 변환합니다
 *
 * 영어 문장 생성 시 사용되며, 문장의 첫 단어를 대문자로 만듭니다.
 * 빈 문자열이나 null 값에 대해서는 안전하게 처리합니다.
 *
 * @param {string} word - 변환할 단어
 * @returns {string} 첫 글자가 대문자인 단어
 *
 * @example
 * capitaliseFirst('hello') // 'Hello'
 * capitaliseFirst('') // ''
 */
function capitaliseFirst(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * 제공된 옵션에 따라 Lorem Ipsum 텍스트를 생성합니다
 *
 * 이 함수는 문단, 문장, 단어를 구성하고, 선택적으로 HTML 태그와
 * 리스트 마크업을 포함합니다. 영어와 한국어 두 언어를 모두 지원하며,
 * 사용자 정의 시작 텍스트를 출력 앞에 추가할 수 있습니다.
 *
 * 생성 과정:
 * 1. 언어별 어휘 선택 (영어 또는 한국어)
 * 2. 각 문단에 대해 지정된 수의 문장 생성
 * 3. 각 문장에 대해 지정된 수의 단어 생성
 * 4. 첫 번째 문장에 커스텀 시작 텍스트 추가 (있는 경우)
 * 5. 영어 문장의 경우 첫 글자 대문자화 및 마침표 추가
 * 6. 한국어 문장의 경우 마침표만 추가
 * 7. 선택된 형식에 따라 HTML 태그 또는 리스트 마크업 적용
 *
 * @param {LoremOptions} options - 텍스트 생성 옵션
 * @param {number} options.paragraphs - 생성할 문단 수 (1-100)
 * @param {number} options.sentences - 각 문단당 문장 수 (1-100)
 * @param {number} options.words - 각 문장당 단어 수 (1-100)
 * @param {'eng'|'kor'} options.language - 텍스트 언어 ('eng': 영어, 'kor': 한국어)
 * @param {boolean} options.includeHtml - HTML 태그 포함 여부
 * @param {string} options.htmlTag - 사용할 HTML 태그 (p, h1, h2, h3, li)
 * @param {boolean} options.list - 리스트 형식으로 출력할지 여부
 * @param {string} options.customStart - 문장 시작에 추가할 커스텀 텍스트
 *
 * @returns {string} 생성된 Lorem Ipsum 텍스트
 *
 * @example
 * const options = {
 *   paragraphs: 2,
 *   sentences: 3,
 *   words: 5,
 *   language: 'eng',
 *   includeHtml: true,
 *   htmlTag: 'p',
 *   list: false,
 *   customStart: 'Hello'
 * };
 * const text = generateLorem(options);
 * // 결과: "<p>Hello lorem ipsum dolor sit amet.</p>\n<p>Lorem ipsum dolor sit amet.</p>"
 */
export function generateLorem(options: LoremOptions): string {
  const {
    paragraphs,
    sentences,
    words,
    language,
    includeHtml,
    htmlTag,
    list,
    customStart,
  } = options;
  const vocab = language === "eng" ? ENGLISH_VOCAB : KOREAN_VOCAB;
  const sentencesArray: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    // build a paragraph as an array of sentences
    let paragraphSentences: string[] = [];
    for (let s = 0; s < sentences; s++) {
      // generate words for this sentence
      const wordsList = generateWords(vocab, words);
      let sentence = wordsList.join(" ");
      if (p === 0 && s === 0 && customStart.trim().length > 0) {
        // prepend custom start
        sentence = customStart.trim() + " " + sentence;
      }
      if (language === "eng") {
        sentence = capitaliseFirst(sentence);
        sentence += ".";
      } else {
        sentence += ".";
      }
      paragraphSentences.push(sentence);
    }
    const paragraph = paragraphSentences.join(" ");
    sentencesArray.push(paragraph);
  }
  // Convert to desired format
  let result: string;
  if (list) {
    // Each paragraph becomes a list item
    if (includeHtml) {
      const items = sentencesArray
        .map((para) => `<${htmlTag}>${para}</${htmlTag}>`)
        .join("\n");
      // wrap in ul for semantics
      result = `<ul>\n${items}\n</ul>`;
    } else {
      result = sentencesArray.map((para) => `• ${para}`).join("\n");
    }
  } else {
    if (includeHtml) {
      result = sentencesArray
        .map((para) => `<${htmlTag}>${para}</${htmlTag}>`)
        .join("\n");
    } else {
      result = sentencesArray.join("\n\n");
    }
  }
  return result;
}
