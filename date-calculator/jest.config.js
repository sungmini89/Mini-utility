/**
 * @fileoverview Jest 테스트 프레임워크 설정 파일
 * @description React + TypeScript 컴포넌트 테스트를 위한 Jest 설정을 정의합니다.
 * @author Date Calculator Team
 * @version 1.0.0
 */

/**
 * Jest 설정 객체
 * @description TypeScript, React, jsdom 환경을 지원하는 테스트 설정
 */
module.exports = {
  /**
   * 테스트 환경 설정
   * @description 브라우저 환경을 시뮬레이션하는 jsdom을 사용
   */
  testEnvironment: "jsdom",

  /**
   * 파일 확장자 처리 설정
   * @description TypeScript와 TSX 파일을 JavaScript로 변환
   */
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  /**
   * 모듈 이름 매핑 설정
   * @description CSS 파일과 정적 자산을 모킹
   */
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "identity-obj-proxy",
  },

  /**
   * 테스트 파일 패턴 설정
   * @description 테스트할 파일들의 위치와 이름 패턴을 정의
   */
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx}",
  ],

  /**
   * 테스트 환경 설정 파일
   * @description 테스트 실행 전 필요한 전역 설정을 로드
   */
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  /**
   * 테스트 커버리지 설정
   * @description 코드 커버리지 수집 범위와 출력 형식을 설정
   */
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/setupTests.ts",
  ],

  /**
   * 커버리지 리포트 설정
   * @description HTML, 텍스트, JSON 형태로 커버리지 리포트 생성
   */
  coverageReporters: ["text", "html", "json"],

  /**
   * 커버리지 임계값 설정
   * @description 테스트 커버리지 최소 기준을 설정
   */
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
