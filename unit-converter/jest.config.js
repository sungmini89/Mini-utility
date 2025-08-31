/**
 * Jest 테스트 프레임워크 설정 파일
 *
 * 이 파일은 단위 변환기 프로젝트의 테스트 환경을 설정합니다.
 * TypeScript, JSX, DOM 환경 등을 지원하도록 구성되어 있습니다.
 *
 * 주요 설정:
 * - TypeScript 지원 (ts-jest)
 * - DOM 환경 시뮬레이션 (jsdom)
 * - CSS 모듈 모킹
 * - 테스트 파일 패턴 정의
 * - 코드 커버리지 설정
 *
 * @see https://jestjs.io/docs/configuration
 * @see https://github.com/kulshekhar/ts-jest
 */
module.exports = {
  // TypeScript 지원을 위한 프리셋
  preset: "ts-jest",

  // 테스트 환경 - DOM API 시뮬레이션
  testEnvironment: "jsdom",

  // 테스트 실행 전 설정 파일
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // 모듈 이름 매핑 - CSS 파일 등을 모킹
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  // 파일 변환 설정
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // 테스트 파일 패턴
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
  ],

  // 코드 커버리지 수집 범위
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/main.tsx"],
};
