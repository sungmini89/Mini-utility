/**
 * @fileoverview Favicon Generator의 공통 유틸리티 함수들
 *
 * 이 파일은 애플리케이션 전반에서 사용되는 공통 유틸리티 함수들을 포함합니다:
 * - 색상 변환 (16진수 → RGBA)
 * - 파일 다운로드 기능
 * - Data URI를 Blob으로 변환
 *
 * @author Favicon Generator Team
 * @version 1.0.0
 */

/**
 * @description 16진수 색상 코드를 RGBA 문자열로 변환
 *
 * 16진수 색상 코드를 RGBA 형식으로 변환하는 함수입니다:
 * - # 접두사 자동 제거
 * - 6자리 16진수 검증
 * - 알파 채널 지원 (0-1)
 * - 잘못된 입력 시 기본 검은색 반환
 *
 * @param {string} hex - 16진수 색상 코드 (예: '#ff0000' 또는 'ff0000')
 * @param {number} alpha - 알파 값 (0-1 사이)
 * @returns {string} RGBA 형식의 색상 문자열
 *
 * @example
 * ```typescript
 * hexToRgba('#ff0000', 0.5); // 'rgba(255,0,0,0.5)'
 * hexToRgba('00ff00', 1);    // 'rgba(0,255,0,1)'
 * hexToRgba('invalid', 1);   // 'rgba(0,0,0,1)' (기본값)
 * ```
 */
export function hexToRgba(hex: string, alpha: number): string {
  // Remove leading # if present
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) {
    return `rgba(0,0,0,${alpha})`;
  }
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * @description Data URI를 파일로 다운로드
 *
 * Data URI를 파일로 다운로드하는 함수입니다:
 * - 임시 링크 요소 생성
 * - 자동 클릭으로 다운로드 트리거
 * - 브라우저가 파일 다운로드 처리
 * - 메모리 누수 방지를 위한 요소 자동 제거
 *
 * @param {string} uri - 다운로드할 Data URI
 * @param {string} filename - 저장할 파일명
 *
 * @example
 * ```typescript
 * downloadData('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'favicon.png');
 * ```
 */
export function downloadData(uri: string, filename: string) {
  const a = document.createElement("a");
  a.href = uri;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * @description Data URI를 Blob 객체로 변환
 *
 * Data URI를 Blob 객체로 변환하는 함수입니다:
 * - Base64 디코딩
 * - MIME 타입 추출
 * - ArrayBuffer를 통한 바이너리 데이터 변환
 * - ZIP 파일 생성 시 사용
 *
 * @param {string} dataURI - 변환할 Data URI
 * @returns {Blob} 변환된 Blob 객체
 *
 * @example
 * ```typescript
 * const blob = dataURItoBlob('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
 * // Blob { size: 1, type: "image/png" }
 * ```
 */
export function dataURItoBlob(dataURI: string): Blob {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
