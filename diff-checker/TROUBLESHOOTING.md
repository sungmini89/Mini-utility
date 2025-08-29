# 🚨 트러블슈팅 가이드

Text Diff Checker 프로젝트 개발 과정에서 발생한 문제들과 해결 방법을 정리한 가이드입니다.

## 📋 목차

1. [설치 및 의존성 문제](#설치-및-의존성-문제)
2. [Jest 테스트 설정 문제](#jest-테스트-설정-문제)
3. [TypeScript 설정 문제](#typescript-설정-문제)
4. [빌드 및 개발 서버 문제](#빌드-및-개발-서버-문제)
5. [브라우저 호환성 문제](#브라우저-호환성-문제)
6. [PWA 관련 문제](#pwa-관련-문제)

---

## 🔧 설치 및 의존성 문제

### 문제 1: PowerShell에서 `&&` 연산자 지원 안됨

**증상:**

```bash
cd /c/Users/kissp/project/diff-checker && npm install
# PowerShell에서 '&&' 토큰을 지원하지 않음 오류
```

**해결 방법:**
PowerShell에서는 `&&` 대신 `;`를 사용하거나 명령을 분리하여 실행합니다.

```bash
# 방법 1: 세미콜론 사용
cd /c/Users/kissp/project/diff-checker; npm install

# 방법 2: 명령 분리
cd /c/Users/kissp/project/diff-checker
npm install
```

### 문제 2: npm audit 보안 취약점

**증상:**

```bash
npm audit
# esbuild 관련 보안 취약점 발견
```

**해결 방법:**

```bash
npm audit fix --force
```

이 명령으로 `vite`와 `vite-plugin-pwa`가 최신 버전으로 업데이트되어 취약점이 해결됩니다.

---

## 🧪 Jest 테스트 설정 문제

### 문제 3: JSX 구문 지원 안됨

**증상:**

```bash
npm test
# SyntaxError: Support for the experimental syntax 'jsx' isn't currently enabled
```

**원인:**
Jest가 JSX와 TypeScript를 제대로 파싱하지 못함

**해결 방법:**
`jest.config.cjs` 파일을 생성하고 ts-jest 프리셋을 설정합니다.

```javascript
// jest.config.cjs
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["**/__tests__/**/*.(ts|tsx)", "**/*.(test|spec).(ts|tsx)"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
```

### 문제 4: ES 모듈 vs CommonJS 충돌

**증상:**

```bash
npm test
# ReferenceError: module is not defined in ES module scope
```

**원인:**
`package.json`에 `"type": "module"`이 설정되어 있어서 Jest 설정 파일이 ES 모듈로 인식됨

**해결 방법:**
Jest 설정 파일을 `jest.config.cjs`로 명명하여 CommonJS 모듈로 명시

### 문제 5: jest-environment-jsdom 누락

**증상:**

```bash
npm test
# Test environment jest-environment-jsdom cannot be found
```

**해결 방법:**

```bash
npm install --save-dev jest-environment-jsdom
```

### 문제 6: 테스트 격리 문제

**증상:**

```bash
npm test
# 이전 테스트의 상태가 다음 테스트에 영향을 미침
```

**원인:**
`useLocalStorage` 훅이 테스트 간에 상태를 유지

**해결 방법:**
`src/setupTests.ts`에서 localStorage를 모킹하고 각 테스트 전에 초기화

```typescript
// src/setupTests.ts
import "@testing-library/jest-dom";

// Mock matchMedia for tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});
```

### 문제 7: Jest 설정 경고

**증상:**

```bash
npm test
# Warning: Define ts-jest config under globals is deprecated
```

**해결 방법:**
`jest.config.cjs`에서 `globals` 설정을 `transform`으로 이동

```javascript
// 이전 (deprecated)
globals: {
  "ts-jest": {
    tsconfig: "tsconfig.json",
  },
},

// 수정 후
transform: {
  "^.+\\.(ts|tsx)$": [
    "ts-jest",
    {
      tsconfig: "tsconfig.json",
    },
  ],
},
```

---

## 📝 TypeScript 설정 문제

### 문제 8: JSX 변환 설정

**증상:**
JSX 요소가 제대로 렌더링되지 않음

**해결 방법:**
`tsconfig.json`에서 JSX 설정 확인

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "target": "ESNext",
    "moduleResolution": "Node"
  }
}
```

---

## 🚀 빌드 및 개발 서버 문제

### 문제 9: Vite 개발 서버 포트 충돌

**증상:**

```bash
npm run dev
# Port 5173 is already in use
```

**해결 방법:**

```bash
# 다른 포트 사용
npm run dev -- --port 3000

# 또는 기존 프로세스 종료
npx kill-port 5173
```

### 문제 10: 빌드 시 메모리 부족

**증상:**

```bash
npm run build
# JavaScript heap out of memory
```

**해결 방법:**
Node.js 메모리 제한 증가

```bash
# Windows
set NODE_OPTIONS=--max-old-space-size=4096
npm run build

# macOS/Linux
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

---

## 🌐 브라우저 호환성 문제

### 문제 11: Chrome 자동 번역 방지

**증상:**
Chrome이 페이지를 자동으로 영어로 번역하여 한글 텍스트가 깨짐

**해결 방법:**
`index.html`에 메타 태그 추가

```html
<meta name="google" content="notranslate" />
```

### 문제 12: 다크 모드 깜빡임 (FOUC)

**증상:**
페이지 로드 시 다크 모드가 잠깐 적용되었다가 사라짐

**해결 방법:**
`index.html`의 `<html>` 태그에 다크 모드 클래스 미리 적용

```html
<html class="dark"></html>
```

---

## 📱 PWA 관련 문제

### 문제 13: Service Worker 등록 실패

**증상:**
PWA 기능이 작동하지 않음

**해결 방법:**
`vite.config.ts`에서 PWA 설정 확인

```typescript
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Text Diff Checker",
        short_name: "DiffChecker",
        description: "Compare two texts and highlight their differences.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
```

### 문제 14: PWA 매니페스트 파일 누락

**증상:**
PWA 설치 옵션이 나타나지 않음

**해결 방법:**
`public/` 폴더에 필요한 아이콘 파일들이 있는지 확인

---

## 🔍 일반적인 디버깅 팁

### 로그 확인

```bash
# 개발 서버 로그
npm run dev

# 빌드 로그
npm run build

# 테스트 로그
npm test
```

### 의존성 재설치

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 캐시 클리어

```bash
# Vite 캐시 클리어
npm run build -- --force

# 브라우저 캐시 클리어
# 개발자 도구 > Application > Storage > Clear storage
```

### TypeScript 타입 체크

```bash
# 타입 오류 확인
npx tsc --noEmit
```

---

## 📚 추가 리소스

- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Vite 가이드](https://vitejs.dev/guide/)
- [Jest 문서](https://jestjs.io/docs/getting-started)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

## 🆘 문제가 해결되지 않는 경우

1. **GitHub Issues**에서 유사한 문제 검색
2. **Stack Overflow**에서 관련 태그로 검색
3. **프로젝트 이슈** 생성하여 문제 보고
4. **개발자 커뮤니티**에서 도움 요청

문제를 보고할 때는 다음 정보를 포함해 주세요:

- 운영체제 및 버전
- Node.js 버전
- npm/yarn 버전
- 오류 메시지 전체
- 재현 단계
- 예상 동작과 실제 동작
