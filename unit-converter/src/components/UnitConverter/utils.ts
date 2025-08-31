import type { Category, UnitDefinition } from "./types";

/**
 * 각 카테고리별 단위 정의 및 기본 단위 대비 변환 계수
 *
 * 곱셈 계수를 사용하는 단위(길이, 무게, 면적, 부피, 속도, 데이터)의 경우
 * 계수는 해당 단위 값을 기본 단위로 매핑합니다.
 * 온도는 특별한 변환 함수를 사용하는데, 이는 선형 스케일이 아니고
 * 단일 승수로 표현할 수 없기 때문입니다.
 */

// 길이: 기본 단위는 미터(m)
const lengthFactors: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
};

/**
 * 길이 단위 정의 배열
 * 각 단위는 사용자 친화적인 라벨과 기계가 읽을 수 있는 값을 포함합니다.
 */
export const lengthUnits: UnitDefinition[] = [
  { value: "m", label: "미터 (m)" },
  { value: "km", label: "킬로미터 (km)" },
  { value: "cm", label: "센티미터 (cm)" },
  { value: "mi", label: "마일 (mile)" },
  { value: "yd", label: "야드 (yd)" },
  { value: "ft", label: "피트 (ft)" },
];

// 무게: 기본 단위는 그램(g)
const weightFactors: Record<string, number> = {
  g: 1,
  kg: 1000,
  lb: 453.59237,
  oz: 28.349523125,
};

/**
 * 무게 단위 정의 배열
 * 국제 표준에 따른 정확한 변환 계수를 사용합니다.
 */
export const weightUnits: UnitDefinition[] = [
  { value: "g", label: "그램 (g)" },
  { value: "kg", label: "킬로그램 (kg)" },
  { value: "lb", label: "파운드 (lb)" },
  { value: "oz", label: "온스 (oz)" },
];

// 면적: 기본 단위는 제곱미터(m2)
const areaFactors: Record<string, number> = {
  m2: 1,
  km2: 1_000_000,
  ft2: 0.09290304,
  yd2: 0.83612736,
  acre: 4046.8564224,
  ha: 10000,
  pyeong: 3.3058,
};

/**
 * 면적 단위 정의 배열
 * 한국에서 자주 사용하는 '평' 단위를 포함합니다.
 */
export const areaUnits: UnitDefinition[] = [
  { value: "m2", label: "제곱미터 (㎡)" },
  { value: "km2", label: "제곱킬로미터 (㎢)" },
  { value: "ft2", label: "제곱피트 (ft²)" },
  { value: "yd2", label: "제곱야드 (yd²)" },
  { value: "acre", label: "에이커 (acre)" },
  { value: "ha", label: "헥타르 (ha)" },
  { value: "pyeong", label: "평 (평)" },
];

// 부피: 기본 단위는 리터(L)
const volumeFactors: Record<string, number> = {
  L: 1,
  mL: 0.001,
  gal: 3.78541,
};

/**
 * 부피 단위 정의 배열
 * 미국식 갤런과 미터법 단위를 지원합니다.
 */
export const volumeUnits: UnitDefinition[] = [
  { value: "L", label: "리터 (L)" },
  { value: "mL", label: "밀리리터 (mL)" },
  { value: "gal", label: "갤런 (gal)" },
];

// 속도: 기본 단위는 초당 미터(mps)
const speedFactors: Record<string, number> = {
  mps: 1,
  kmh: 0.277777778,
  mph: 0.44704,
};

/**
 * 속도 단위 정의 배열
 * 일반적으로 사용되는 속도 단위들을 지원합니다.
 */
export const speedUnits: UnitDefinition[] = [
  { value: "mps", label: "미터/초 (m/s)" },
  { value: "kmh", label: "킬로미터/시 (km/h)" },
  { value: "mph", label: "마일/시 (mph)" },
];

// 데이터: 기본 단위는 바이트(B)
const dataFactors: Record<string, number> = {
  bit: 0.125,
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
};

/**
 * 데이터 단위 정의 배열
 * 1024 기반의 이진 접두사를 사용합니다 (1 KB = 1024 B).
 */
export const dataUnits: UnitDefinition[] = [
  { value: "bit", label: "비트 (bit)" },
  { value: "B", label: "바이트 (B)" },
  { value: "KB", label: "킬로바이트 (KB)" },
  { value: "MB", label: "메가바이트 (MB)" },
  { value: "GB", label: "기가바이트 (GB)" },
  { value: "TB", label: "테라바이트 (TB)" },
];

// 온도 단위: 계수 없음; 공식으로 처리
export const temperatureUnits: UnitDefinition[] = [
  { value: "C", label: "섭씨 (°C)" },
  { value: "F", label: "화씨 (°F)" },
  { value: "K", label: "켈빈 (K)" },
];

/**
 * 섭씨, 화씨, 켈빈 간 온도 변환
 *
 * 모든 온도 변환은 섭씨를 중간 단계로 사용합니다:
 * 1. 입력 온도를 섭씨로 변환
 * 2. 섭씨를 목표 온도로 변환
 *
 * @param value 변환할 온도 값
 * @param from 원본 온도 단위 ('C', 'F', 'K')
 * @param to 목표 온도 단위 ('C', 'F', 'K')
 * @returns 변환된 온도 값
 *
 * @example
 * ```typescript
 * convertTemperature(100, 'C', 'F') // 212
 * convertTemperature(32, 'F', 'C') // 0
 * convertTemperature(0, 'C', 'K')  // 273.15
 * ```
 */
function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;
  let celsius: number;

  // 먼저 섭씨로 변환
  switch (from) {
    case "C":
      celsius = value;
      break;
    case "F":
      celsius = (value - 32) * (5 / 9);
      break;
    case "K":
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }

  // 섭씨에서 목표 단위로 변환
  switch (to) {
    case "C":
      return celsius;
    case "F":
      return celsius * (9 / 5) + 32;
    case "K":
      return celsius + 273.15;
    default:
      return value;
  }
}

/**
 * 주어진 카테고리에 대한 단위 변환 수행
 *
 * 입력 값이 유한한 숫자가 아니거나 단위를 인식할 수 없는 경우 NaN을 반환합니다.
 * 온도 이외의 카테고리는 단순한 계수 비율로 변환하고,
 * 온도는 전용 공식을 사용합니다.
 *
 * @param category 변환할 단위 카테고리
 * @param from 원본 단위
 * @param to 목표 단위
 * @param value 변환할 값
 * @returns 변환된 값 또는 NaN (변환 불가능한 경우)
 *
 * @example
 * ```typescript
 * // 길이 변환
 * convertValue('length', 'm', 'km', 1000) // 1
 *
 * // 온도 변환
 * convertValue('temperature', 'C', 'F', 100) // 212
 *
 * // 무게 변환
 * convertValue('weight', 'kg', 'g', 2) // 2000
 * ```
 */
export function convertValue(
  category: Category,
  from: string,
  to: string,
  value: number
): number {
  if (!isFinite(value)) return NaN;

  switch (category) {
    case "length":
      if (!(from in lengthFactors) || !(to in lengthFactors)) return NaN;
      return (value * lengthFactors[from]) / lengthFactors[to];
    case "weight":
      if (!(from in weightFactors) || !(to in weightFactors)) return NaN;
      return (value * weightFactors[from]) / weightFactors[to];
    case "area":
      if (!(from in areaFactors) || !(to in areaFactors)) return NaN;
      return (value * areaFactors[from]) / lengthFactors[to];
    case "volume":
      if (!(from in volumeFactors) || !(to in volumeFactors)) return NaN;
      return (value * volumeFactors[from]) / volumeFactors[to];
    case "speed":
      if (!(from in speedFactors) || !(to in speedFactors)) return NaN;
      return (value * speedFactors[from]) / speedFactors[to];
    case "data":
      if (!(from in dataFactors) || !(to in dataFactors)) return NaN;
      return (value * dataFactors[from]) / dataFactors[to];
    case "temperature":
      return convertTemperature(value, from, to);
    default:
      return NaN;
  }
}

/**
 * 주어진 카테고리에 대한 단위 정의를 반환
 *
 * UI의 드롭다운을 채우는 데 사용됩니다.
 *
 * @param category 단위를 가져올 카테고리
 * @returns 해당 카테고리의 단위 정의 배열
 *
 * @example
 * ```typescript
 * const lengthUnits = getUnitsForCategory('length');
 * // [{ value: 'm', label: '미터 (m)' }, { value: 'km', label: '킬로미터 (km)' }, ...]
 * ```
 */
export function getUnitsForCategory(category: Category): UnitDefinition[] {
  switch (category) {
    case "length":
      return lengthUnits;
    case "weight":
      return weightUnits;
    case "temperature":
      return temperatureUnits;
    case "area":
      return areaUnits;
    case "volume":
      return volumeUnits;
    case "speed":
      return speedUnits;
    case "data":
      return dataUnits;
    default:
      return [];
  }
}
