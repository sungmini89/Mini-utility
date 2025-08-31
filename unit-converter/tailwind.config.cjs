/** @type {import('tailwindcss').Config} */
/**
 * Tailwind CSS 설정 파일
 *
 * 이 파일은 Tailwind CSS 프레임워크의 설정을 정의합니다.
 * 다크모드, 콘텐츠 경로, 테마 확장 등을 포함합니다.
 *
 * 주요 설정:
 * - 다크모드: 클래스 기반 토글
 * - 콘텐츠 경로: HTML 및 소스 파일 스캔
 * - 테마 확장: 커스텀 색상, 폰트 등
 *
 * @see https://tailwindcss.com/docs/configuration
 */
module.exports = {
  // 다크모드 설정 - 'dark' 클래스로 토글
  darkMode: "class",

  // Tailwind가 스캔할 파일 경로
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],

  // 테마 확장 설정
  theme: {
    extend: {
      // 여기에 커스텀 색상, 폰트, 스페이싱 등을 추가할 수 있습니다
    },
  },

  // 플러그인 설정
  plugins: [],
};
