/**
 * @fileoverview Favicon Generator의 타입 정의 파일
 *
 * 이 파일은 애플리케이션에서 사용되는 모든 TypeScript 타입과 인터페이스를 정의합니다.
 * 각 타입은 favicon 생성 과정에서 필요한 데이터 구조를 명확히 정의하여
 * 타입 안정성을 보장합니다.
 *
 * @author Favicon Generator Team
 * @version 1.0.0
 */

/**
 * @description favicon 생성 모드 타입
 *
 * favicon을 생성하는 세 가지 방법을 정의합니다:
 * - 'image': 이미지 파일을 업로드하여 favicon 생성
 * - 'text': 텍스트를 입력하여 favicon 생성
 * - 'emoji': 이모지를 입력하여 favicon 생성
 *
 * @typedef {('image' | 'text' | 'emoji')} Mode
 */
export type Mode = "image" | "text" | "emoji";

/**
 * @description favicon 생성 옵션 인터페이스
 *
 * favicon 생성에 필요한 모든 설정을 포함합니다:
 * - mode: 생성 모드 (이미지/텍스트/이모지)
 * - text: 텍스트 또는 이모지 입력값 (텍스트/이모지 모드에서 사용)
 * - imageSrc: 업로드된 이미지의 data URI (이미지 모드에서 사용)
 * - bgColor: 배경색 (16진수 색상 코드)
 * - bgAlpha: 배경 투명도 (0-1 사이 값)
 * - textColor: 텍스트 색상 (16진수 색상 코드)
 * - sizes: 생성할 favicon 크기 배열 (픽셀 단위)
 *
 * @interface GenerationOptions
 */
export interface GenerationOptions {
  mode: Mode;
  text: string;
  imageSrc: string | null;
  bgColor: string;
  bgAlpha: number;
  textColor: string;
  sizes: number[];
}

/**
 * @description 히스토리 항목 인터페이스
 *
 * 사용자가 생성한 favicon의 설정과 결과를 저장하는 구조입니다:
 * - date: 생성 시간 (타임스탬프)
 * - options: 사용된 생성 옵션
 * - icons: 생성된 아이콘들 (크기별 data URI 매핑)
 *
 * @interface HistoryItem
 */
export interface HistoryItem {
  date: number;
  options: GenerationOptions;
  icons: Record<number, string>;
}

/**
 * @description 토스트 알림 타입
 *
 * 사용자에게 표시되는 알림 메시지의 종류를 정의합니다:
 * - 'success': 성공 메시지 (녹색)
 * - 'error': 오류 메시지 (빨간색)
 *
 * @typedef {('success' | 'error')} ToastType
 */
export type ToastType = "success" | "error";
