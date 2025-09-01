/**
 * Jest 테스트 프레임워크 설정 파일
 * 
 * TypeScript와 React 컴포넌트 테스트를 위한 Jest 설정을 정의합니다.
 * - TypeScript 지원 (ts-jest)
 * - DOM 환경 시뮬레이션 (jsdom)
 * - CSS 모듈 모킹
 * - 테스트 파일 패턴 정의
 * - 코드 커버리지 설정
 */
module.exports = {
  /** TypeScript 지원을 위한 프리셋 */
  preset: "ts-jest",
  /** 브라우저 DOM 환경을 시뮬레이션 */
  testEnvironment: "jsdom",
  /** 테스트 실행 전 설정 파일 */
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  /** 모듈 이름 매핑 (CSS 파일 등을 모킹) */
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  /** 파일 변환 설정 */
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  /** 테스트 파일 패턴 */
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
  ],
  /** 코드 커버리지 수집 대상 */
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/index.css",
  ],
  /** 모듈 해석 디렉토리 */
  moduleDirectories: ["node_modules", "src"],
};
