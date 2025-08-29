/**
 * 지원되는 케이스 변환 옵션들을 열거합니다.
 * 각 케이스는 변환 버튼과 히스토리 목록에 표시되는
 * 사람이 읽기 쉬운 이름으로 표현됩니다.
 */
export type CaseOption =
  | "UPPERCASE"
  | "lowercase"
  | "Title Case"
  | "Sentence case"
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "kebab-case"
  | "InVeRsE CaSe";

/**
 * 사용자의 히스토리에 단일 변환을 기록합니다.
 * 각 항목은 입력과 출력 텍스트, 선택된 변환 옵션,
 * 그리고 항목들을 정렬할 수 있는 타임스탬프를 저장합니다.
 */
export interface HistoryItem {
  option: CaseOption;
  input: string;
  output: string;
  date: number;
}
