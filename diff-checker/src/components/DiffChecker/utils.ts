import type { DiffLine, DiffType } from "./types";

/**
 * 두 문자열 간의 라인 기반 diff를 최장 공통 부분수열(LCS) 알고리즘을 사용하여 계산합니다.
 * 이 구현은 원본 텍스트를 수정된 텍스트로 변환하는 방법을 설명하는 작업 목록을 생성합니다.
 * 연속된 삭제와 추가 쌍은 단일 변경 작업으로 병합됩니다.
 *
 * @param {string} left - 원본 텍스트
 * @param {string} right - 수정된 텍스트
 * @returns {DiffLine[]} diff 작업 목록
 */
export function diffLines(left: string, right: string): DiffLine[] {
  const a = left.split("\n");
  const b = right.split("\n");
  const m = a.length;
  const n = b.length;
  // LCS 테이블 구축
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  // 역추적하여 diff 작업 생성
  const result: DiffLine[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.push({ type: "equal", textA: a[i - 1], textB: b[j - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      result.push({ type: "delete", textA: a[i - 1] });
      i--;
    } else {
      result.push({ type: "add", textB: b[j - 1] });
      j--;
    }
  }
  while (i > 0) {
    result.push({ type: "delete", textA: a[i - 1] });
    i--;
  }
  while (j > 0) {
    result.push({ type: "add", textB: b[j - 1] });
    j--;
  }
  result.reverse();
  // 삭제+추가 쌍을 변경 작업으로 병합
  const merged: DiffLine[] = [];
  for (let k = 0; k < result.length; k++) {
    const entry = result[k];
    if (
      entry.type === "delete" &&
      k + 1 < result.length &&
      result[k + 1].type === "add"
    ) {
      merged.push({
        type: "change" as DiffType,
        textA: entry.textA,
        textB: result[k + 1].textB,
      });
      k++; // 다음 항목을 건너뜀 (이미 처리했으므로)
    } else {
      merged.push(entry);
    }
  }
  return merged;
}

/**
 * diff에서 통계를 계산하여 추가, 삭제, 변경의 수를 셉니다.
 * 동일한 라인은 무시됩니다.
 *
 * @param {DiffLine[]} diff - diff 작업 목록
 * @returns {{ add: number; delete: number; change: number }} 추가, 삭제, 변경의 수
 */
export function computeStats(diff: DiffLine[]): {
  add: number;
  delete: number;
  change: number;
} {
  let add = 0;
  let del = 0;
  let change = 0;
  diff.forEach((line) => {
    if (line.type === "add") add++;
    else if (line.type === "delete") del++;
    else if (line.type === "change") change++;
  });
  return { add, delete: del, change };
}
