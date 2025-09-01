import "@testing-library/jest-dom";

/**
 * Jest 테스트 환경 설정 파일
 * 
 * 테스트 실행 전에 필요한 전역 모킹과 설정을 구성합니다.
 * - matchMedia 모킹
 * - localStorage 모킹
 * - navigator.clipboard 모킹
 */

/**
 * matchMedia API를 모킹합니다.
 * 
 * 다크모드 감지 및 미디어 쿼리 테스트를 위해 사용됩니다.
 * 모든 미디어 쿼리에 대해 false를 반환하도록 설정합니다.
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

/**
 * localStorage API를 모킹합니다.
 * 
 * 브라우저의 localStorage 기능을 테스트 환경에서 사용할 수 있도록 합니다.
 * 실제 저장소 대신 메모리 기반 모의 객체를 사용합니다.
 */
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
global.localStorage = localStorageMock as Storage;

/**
 * navigator.clipboard API를 모킹합니다.
 * 
 * 클립보드 복사 기능 테스트를 위해 사용됩니다.
 * 실제 클립보드 접근 대신 모의 함수를 사용합니다.
 */
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});
