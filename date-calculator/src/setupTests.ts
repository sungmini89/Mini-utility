/**
 * @fileoverview Jest 테스트 환경 설정 파일
 * @description 테스트 실행 전 필요한 전역 모킹과 설정을 정의합니다.
 * @author Date Calculator Team
 * @version 1.0.0
 */

import "@testing-library/jest-dom";

/**
 * 브라우저 API 모킹 설정
 * @description 테스트 환경에서 필요한 브라우저 API들을 모킹합니다.
 */

// matchMedia 모킹 (CSS 미디어 쿼리 지원)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // 구형 브라우저 지원
    removeListener: jest.fn(), // 구형 브라우저 지원
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// localStorage 모킹
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock as Storage,
});

// sessionStorage 모킹
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock as Storage,
});

// navigator.clipboard 모킹
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: jest.fn(),
    readText: jest.fn(),
  },
});

// ResizeObserver 모킹 (요소 크기 변화 감지)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// IntersectionObserver 모킹 (요소 가시성 감지)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

console.log("Jest 테스트 환경 설정 완료");
