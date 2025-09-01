/** @type {import('tailwindcss').Config} */

/**
 * Tailwind CSS 설정 파일
 * 
 * CSS 프레임워크 Tailwind CSS의 설정을 정의합니다.
 * - 다크모드 지원 (클래스 기반)
 * - 콘텐츠 경로 설정
 * - 테마 확장 설정
 * - 플러그인 설정
 */
module.exports = {
  /** 다크모드 설정 (클래스 기반 토글) */
  darkMode: 'class',
  /** CSS 클래스 검색 대상 파일 경로 */
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}'
  ],
  /** 테마 설정 */
  theme: {
    /** 기본 테마 확장 */
    extend: {},
  },
  /** Tailwind 플러그인 목록 */
  plugins: [],
};