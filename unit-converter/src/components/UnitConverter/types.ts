/**
 * 단위 변환기 컴포넌트의 타입 정의
 *
 * 이 파일은 단위 변환기에서 사용되는 모든 타입과 인터페이스를 정의합니다.
 * 카테고리, 단위 정의, 즐겨찾기 항목 등의 구조를 명시합니다.
 */

/**
 * 지원하는 단위 변환 카테고리
 *
 * 각 카테고리는 서로 다른 변환 로직과 단위 세트를 가집니다.
 * 온도는 특별한 공식을 사용하고, 나머지는 곱셈 계수를 사용합니다.
 */
export type Category =
  | "length" // 길이: 미터, 킬로미터, 마일 등
  | "weight" // 무게: 그램, 킬로그램, 파운드 등
  | "temperature" // 온도: 섭씨, 화씨, 켈빈
  | "area" // 면적: 제곱미터, 평, 에이커 등
  | "volume" // 부피: 리터, 밀리리터, 갤런 등
  | "speed" // 속도: m/s, km/h, mph 등
  | "data"; // 데이터: 바이트, KB, MB, GB 등

/**
 * 단위 정의 인터페이스
 *
 * 각 단위는 기계가 읽을 수 있는 값과 사용자 친화적인 라벨을 포함합니다.
 * 값은 내부 변환 및 localStorage 저장에 사용되고,
 * 라벨은 UI 드롭다운에 표시됩니다.
 *
 * @example
 * ```typescript
 * const meter: UnitDefinition = {
 *   value: 'm',
 *   label: '미터 (m)'
 * };
 * ```
 */
export interface UnitDefinition {
  /** 기계가 읽을 수 있는 단위 값 (예: 'm', 'km', 'kg') */
  value: string;
  /** 사용자에게 표시되는 단위 라벨 (예: '미터 (m)', '킬로미터 (km)') */
  label: string;
}

/**
 * 즐겨찾기 항목 인터페이스
 *
 * 사용자가 자주 사용하는 변환을 저장하기 위한 구조입니다.
 * 각 즐겨찾기는 고유 ID와 함께 카테고리, 원본 단위, 목표 단위를 저장합니다.
 *
 * @example
 * ```typescript
 * const favourite: FavouriteItem = {
 *   id: 1234567890,
 *   category: 'length',
 *   from: 'm',
 *   to: 'km'
 * };
 * ```
 */
export interface FavouriteItem {
  /** 즐겨찾기의 고유 식별자 (타임스탬프 기반) */
  id: number;
  /** 변환 카테고리 */
  category: Category;
  /** 원본 단위 */
  from: string;
  /** 목표 단위 */
  to: string;
}
