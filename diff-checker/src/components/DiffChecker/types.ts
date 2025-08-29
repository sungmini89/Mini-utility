/**
 * diff 결과의 표시 모드를 나타냅니다. 분할 뷰에서는 원본과 수정된 텍스트가
 * 두 열로 표시됩니다. 통합 뷰에서는 차이점이 색상으로 구분된 접두사와 함께
 * 단일 목록으로 통합됩니다.
 */
export type ViewMode = "split" | "unified";

/** diff에서 가능한 작업을 정의합니다. */
export type DiffType = "equal" | "add" | "delete" | "change";

/**
 * diff의 단일 라인입니다. 작업에 따라 원본 텍스트(textA)와/또는 수정된
 * 텍스트(textB)의 라인이 있을 수 있습니다.
 */
export interface DiffLine {
  /** diff 작업의 유형 */
  type: DiffType;
  /** 원본 텍스트의 라인 (삭제 또는 변경 시에만 존재) */
  textA?: string;
  /** 수정된 텍스트의 라인 (추가 또는 변경 시에만 존재) */
  textB?: string;
}

/**
 * 히스토리에 비교 기록을 저장합니다. 원본과 수정된 텍스트를 타임스탬프와
 * diff 통계와 함께 저장합니다.
 */
export interface HistoryItem {
  /** 왼쪽(원본) 텍스트 */
  left: string;
  /** 오른쪽(수정된) 텍스트 */
  right: string;
  /** 비교가 수행된 시간 (타임스탬프) */
  date: number;
  /** diff 통계 정보 */
  stats: {
    /** 추가된 라인 수 */
    add: number;
    /** 삭제된 라인 수 */
    delete: number;
    /** 변경된 라인 수 */
    change: number;
  };
}
