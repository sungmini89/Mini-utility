# Case Converter

텍스트를 다양한 케이스 형식으로 변환할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- **9가지 케이스 변환 옵션**

  - `UPPERCASE` - 모든 문자를 대문자로
  - `lowercase` - 모든 문자를 소문자로
  - `Title Case` - 각 단어의 첫 글자만 대문자로
  - `Sentence case` - 각 문장의 첫 글자만 대문자로
  - `camelCase` - 카멜 케이스 형식
  - `PascalCase` - 파스칼 케이스 형식
  - `snake_case` - 스네이크 케이스 형식
  - `kebab-case` - 케밥 케이스 형식
  - `InVeRsE CaSe` - 대소문자 반전

- **사용자 편의 기능**
  - 입력/출력 텍스트 영역
  - 클립보드 복사/붙여넣기
  - 변환 히스토리 (최근 10개)
  - 다크모드 지원
  - 키보드 단축키

## 🚀 시작하기

### 필수 요구사항

- Node.js 16.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone <repository-url>
   cd case-converter
   ```

2. **의존성 설치**

   ```bash
   npm install
   # 또는
   yarn install
   ```

3. **개발 서버 실행**

   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

4. **브라우저에서 확인**
   - 자동으로 브라우저가 열립니다
   - 기본 주소: `http://localhost:5173`

## ⌨️ 키보드 단축키

| 단축키                 | 기능                              |
| ---------------------- | --------------------------------- |
| `Alt + 1` ~ `Alt + 9`  | 해당 번호의 케이스 변환 옵션 선택 |
| `Ctrl/Cmd + Shift + C` | 변환된 텍스트를 클립보드에 복사   |
| `Ctrl/Cmd + Shift + R` | 입력 텍스트 초기화                |

## 🛠️ 기술 스택

- **프론트엔드**: React 18 + TypeScript
- **빌드 도구**: Vite
- **스타일링**: Tailwind CSS
- **상태 관리**: React Hooks
- **PWA**: Vite PWA Plugin
- **테스팅**: Jest + React Testing Library

## 📁 프로젝트 구조

```
case-converter/
├── 📁 src/                          # 소스 코드
│   ├── 📁 components/               # React 컴포넌트
│   │   └── 📁 CaseConverter/        # 케이스 변환기 메인 컴포넌트
│   │       ├── index.tsx            # 메인 컴포넌트 (케이스 변환 로직)
│   │       ├── types.ts             # TypeScript 타입 정의
│   │       ├── utils.ts             # 케이스 변환 유틸리티 함수들
│   │       └── index.test.tsx       # 컴포넌트 테스트 파일
│   ├── 📁 hooks/                    # 커스텀 React 훅
│   │   ├── useDarkMode.ts           # 다크모드 관리 훅
│   │   ├── useLocalStorage.ts       # 로컬스토리지 관리 훅
│   │   └── useClipboard.ts          # 클립보드 관리 훅
│   ├── 📁 pages/                    # 페이지 컴포넌트
│   │   └── CaseConverterPage.tsx    # 케이스 변환기 페이지 래퍼
│   ├── 📁 utils/                    # 공통 유틸리티
│   │   └── common.ts                # 공통 헬퍼 함수 (텍스트 자르기 등)
│   ├── App.tsx                      # 애플리케이션 루트 컴포넌트
│   ├── main.tsx                     # 애플리케이션 진입점
│   └── index.css                    # 전역 CSS 스타일
├── 📁 public/                       # 정적 파일
│   ├── favicon.svg                  # 웹사이트 아이콘
│   └── robots.txt                   # 검색 엔진 크롤링 설정
├── 📄 package.json                  # 프로젝트 의존성 및 스크립트
├── 📄 vite.config.ts                # Vite 빌드 도구 설정
├── 📄 tailwind.config.cjs           # Tailwind CSS 설정
├── 📄 postcss.config.cjs            # PostCSS 설정
├── 📄 tsconfig.json                 # TypeScript 설정
└── 📄 README.md                     # 프로젝트 문서
```

### 🏗️ **아키텍처 특징**

- **컴포넌트 기반 구조**: 재사용 가능한 컴포넌트로 구성
- **훅 분리**: 비즈니스 로직을 커스텀 훅으로 분리
- **타입 안전성**: TypeScript로 타입 안전성 보장
- **유틸리티 분리**: 공통 함수들을 별도 모듈로 분리
- **테스트 지원**: Jest 기반 테스트 파일 포함

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage
```

## 📦 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 🌙 다크모드

- 헤더의 토글 버튼(☀️/🌙)을 클릭하여 다크모드를 전환할 수 있습니다
- 사용자 설정은 로컬스토리지에 저장되어 다음 방문 시에도 유지됩니다

## 📱 PWA 지원

- 웹 애플리케이션을 네이티브 앱처럼 설치할 수 있습니다
- 오프라인에서도 기본 기능을 사용할 수 있습니다
- 자동 업데이트를 지원합니다

## 🔧 개발 환경 설정

### 환경 변수

현재 별도의 환경 변수 설정이 필요하지 않습니다.

### 코드 스타일

- TypeScript strict 모드 사용
- ESLint 및 Prettier 설정 권장
- 컴포넌트별 타입 정의 필수

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🚨 트러블슈팅

### 일반적인 문제들과 해결 방법

#### 1. **React Router 경고 메시지**

```
⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7
```

**원인**: React Router v6에서 v7 호환성 경고
**해결방법**: `src/main.tsx`에서 future flag 설정

```typescript
const router = createBrowserRouter(
  [
    {
      path: "/*",
      element: <App />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);
```

#### 2. **Favicon 404 오류**

```
GET http://localhost:5173/favicon.svg 404 (Not Found)
```

**원인**: `public` 폴더나 favicon 파일이 없음
**해결방법**:

- `public` 폴더 생성
- `favicon.svg` 파일 추가
- `index.html`에서 올바른 경로 확인

#### 3. **크롬 자동 번역 문제**

**증상**: 페이지가 자동으로 번역되거나 번역 제안이 나타남
**해결방법**: HTML 요소에 `translate="no"` 속성 추가

```html
<html lang="ko" translate="no">
  <body translate="no">
    <div translate="no"></div>
  </body>
</html>
```

#### 4. **PWA 관련 오류**

**증상**: PWA 아이콘 로드 실패 또는 매니페스트 오류
**해결방법**:

- `vite.config.ts`에서 PWA 설정 확인
- `public` 폴더에 필요한 아이콘 파일들 추가
- 브라우저 개발자 도구에서 PWA 탭 확인

#### 5. **Tailwind CSS 스타일이 적용되지 않음**

**증상**: CSS 클래스가 적용되지 않거나 스타일이 깨짐
**해결방법**:

```bash
# Tailwind CSS 빌드
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch

# PostCSS 설정 확인
npx postcss --config postcss.config.cjs
```

#### 6. **로컬스토리지 관련 오류**

**증상**: 설정이나 히스토리가 저장되지 않음
**해결방법**:

- 브라우저의 로컬스토리지 권한 확인
- 개발자 도구 > Application > Local Storage 확인
- 시크릿 모드에서 테스트 (로컬스토리지 제한)

#### 7. **클립보드 API 오류**

**증상**: 복사/붙여넣기 기능이 작동하지 않음
**해결방법**:

- HTTPS 환경에서 테스트 (로컬호스트 제외)
- 브라우저 권한 확인
- `navigator.clipboard` 지원 여부 확인

````

### 🔍 **디버깅 팁**

1. **브라우저 개발자 도구 활용**

   - Console 탭에서 오류 메시지 확인
   - Network 탭에서 API 호출 상태 확인
   - Application 탭에서 로컬스토리지 상태 확인

2. **Vite HMR 로그 확인**

   - 터미널에서 HMR 업데이트 상태 모니터링
   - 파일 변경 시 자동 리로드 상태 확인

3. **TypeScript 타입 체크**
   ```bash
   npx tsc --noEmit
````

### 📚 **추가 리소스**

- [React Router v6 문서](https://reactrouter.com/docs/en/v6)
- [Vite 트러블슈팅 가이드](https://vitejs.dev/guide/troubleshooting.html)
- [Tailwind CSS 설정 가이드](https://tailwindcss.com/docs/configuration)

---

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**Case Converter** - 텍스트 케이스 변환을 위한 간단하고 강력한 도구
