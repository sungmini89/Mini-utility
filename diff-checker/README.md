# Text Diff Checker

두 텍스트를 비교하고 차이점을 시각화하는 웹 애플리케이션입니다. 분할/통합 뷰, 파일 업로드, 키보드 단축키, 복사 기능, 지속적인 히스토리를 지원합니다.

## ✨ 주요 기능

### 🔍 텍스트 비교

- **분할 뷰**: 원본과 수정된 텍스트를 나란히 비교
- **통합 뷰**: 모든 차이점을 단일 목록으로 통합하여 표시
- **색상 구분**:
  - 🟢 **녹색**: 추가된 부분
  - 🔴 **빨간색**: 삭제된 부분
  - 🟡 **노란색**: 수정된 부분

### 📁 파일 지원

- `.txt` 파일 업로드 지원
- 드래그 앤 드롭으로 파일 로드
- 양쪽 텍스트 영역에 개별 파일 업로드

### ⌨️ 키보드 단축키

- `Alt + U`: 분할/통합 뷰 전환
- `Alt + N`: 다음 차이점으로 이동
- `Alt + P`: 이전 차이점으로 이동
- `Ctrl/Cmd + Shift + C`: diff 결과를 클립보드에 복사

### 💾 히스토리 관리

- 최대 10개의 비교 기록 저장
- 통계 정보 (추가, 삭제, 수정 개수) 포함
- 히스토리 일괄 삭제 기능

### 🎨 사용자 경험

- 다크 모드 지원
- 반응형 디자인
- 로딩 상태 표시
- 토스트 알림 시스템

## 🚀 기술 스택

### Frontend

- **React 18** - 사용자 인터페이스 구축
- **TypeScript 5** - 타입 안전성 보장
- **Tailwind CSS 3** - 스타일링 및 반응형 디자인
- **React Router DOM 6** - 클라이언트 사이드 라우팅

### Build Tools

- **Vite 7.1.3** - 빠른 개발 서버 및 빌드 도구
- **PostCSS** - CSS 전처리
- **Autoprefixer** - CSS 벤더 프리픽스 자동 추가

### Testing

- **Jest 29** - 테스트 프레임워크
- **React Testing Library** - React 컴포넌트 테스트
- **ts-jest** - TypeScript 지원
- **jest-environment-jsdom** - DOM 환경 시뮬레이션

### PWA (Progressive Web App)

- **vite-plugin-pwa** - PWA 기능 지원
- 오프라인 동작 가능
- 설치 가능한 웹 앱

## 📁 프로젝트 구조

```
diff-checker/
├── src/
│   ├── components/
│   │   └── DiffChecker/
│   │       ├── index.tsx          # 메인 DiffChecker 컴포넌트
│   │       ├── types.ts           # 타입 정의
│   │       ├── utils.ts           # diff 알고리즘 및 유틸리티
│   │       └── index.test.tsx     # 컴포넌트 테스트
│   ├── hooks/
│   │   ├── useLocalStorage.ts     # localStorage 지속성 훅
│   │   ├── useClipboard.ts       # 클립보드 복사 훅
│   │   └── useDarkMode.ts        # 다크 모드 토글 훅
│   ├── pages/
│   │   └── DiffCheckerPage.tsx   # DiffChecker 페이지 래퍼
│   ├── utils/
│   │   └── common.ts             # 공통 유틸리티 함수
│   ├── App.tsx                   # 메인 앱 컴포넌트
│   ├── main.tsx                  # 앱 진입점
│   ├── index.css                 # 전역 스타일
│   └── setupTests.ts             # 테스트 설정
├── public/                        # 정적 파일
├── package.json                   # 의존성 및 스크립트
├── tsconfig.json                  # TypeScript 설정
├── vite.config.ts                 # Vite 설정
├── tailwind.config.cjs            # Tailwind CSS 설정
├── postcss.config.cjs             # PostCSS 설정
├── jest.config.cjs                # Jest 설정
└── README.md                      # 프로젝트 문서
```

## 🛠️ 설치 및 실행

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd diff-checker

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 테스트 실행

```bash
npm test
```

### 빌드 미리보기

```bash
npm run preview
```

## 🔧 개발 가이드

### 컴포넌트 구조

- **DiffChecker**: 핵심 비교 로직을 담당하는 메인 컴포넌트
- **상태 관리**: React hooks를 사용한 로컬 상태 관리
- **사용자 정의 훅**: 재사용 가능한 로직을 커스텀 훅으로 분리

### Diff 알고리즘

- **LCS (Longest Common Subsequence)**: 최장 공통 부분수열 알고리즘 사용
- **라인 기반 비교**: 텍스트를 라인 단위로 분할하여 비교
- **병합 최적화**: 연속된 삭제+추가 쌍을 변경 작업으로 병합

### 스타일링

- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링
- **다크 모드**: CSS 클래스 기반 테마 전환
- **반응형 디자인**: 모바일 및 데스크톱 환경 지원

## 🧪 테스트

### 테스트 환경 설정

- Jest + React Testing Library
- jsdom 환경에서 DOM 시뮬레이션
- localStorage, matchMedia, navigator.clipboard 모킹

### 테스트 커버리지

- 컴포넌트 렌더링 테스트
- 사용자 상호작용 테스트
- diff 알고리즘 로직 테스트
- 훅 동작 테스트

## 📱 PWA 기능

### 오프라인 지원

- Service Worker를 통한 캐싱
- 네트워크 없이도 기본 기능 동작

### 설치 가능

- 홈 화면에 앱 아이콘 추가
- 네이티브 앱과 유사한 사용자 경험

## 🌐 배포

### Vercel/Netlify 배포

- PWA 설정이 포함된 빌드 파일
- 자동 HTTPS 및 CDN 지원

### 정적 호스팅

- `npm run build`로 생성된 `dist/` 폴더 배포
- 모든 정적 파일 서버에서 호스팅 가능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**Text Diff Checker** - 텍스트 비교를 더욱 쉽고 직관적으로 만들어주는 도구입니다.
