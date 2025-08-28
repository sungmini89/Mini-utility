# Letter & Vocabulary Calculator

실시간으로 글자수, 단어수, 문장수, 단락수를 계산하고 SNS 글자수 제한을 확인할 수 있는 웹 애플리케이션입니다.

## 📋 PRD (Product Requirements Document)

### 1. 기능 요구사항

#### 핵심 기능

- **텍스트 입력 및 실시간 분석**

  - 텍스트 영역에 자유롭게 입력
  - 입력 즉시 통계 업데이트
  - 한글/영문 혼합 텍스트 지원

- **통계 계산**

  - 공백 포함/제외 글자수
  - 단어수 (공백 기준 분리)
  - 문장수 (문장부호 기준 분리)
  - 단락수 (줄바꿈 기준 분리)
  - 예상 읽기 시간 (200 WPM 기준)
  - 한글/영문 문자 개별 카운트

- **SNS 플랫폼 제한 표시**
  - Twitter (280자), Instagram (2,200자)
  - Facebook (63,206자), KakaoTalk (1,000자)
  - 프로그레스 바로 시각적 표시
  - 제한 초과 시 경고 색상 표시

#### 사용자 편의 기능

- **클립보드 연동**

  - 텍스트 복사 (Ctrl+C)
  - 클립보드에서 붙여넣기 (Ctrl+V)
  - 텍스트 초기화 (Ctrl+Shift+R)

- **UI/UX**
  - 다크모드/라이트모드 전환
  - 반응형 디자인 (모바일 우선)
  - 토스트 알림 시스템
  - 키보드 단축키 지원

### 2. 비기능 요구사항

#### 성능

- **응답성**: 텍스트 입력 시 100ms 이내 통계 업데이트
- **메모리**: 최대 10MB 텍스트 처리 지원
- **브라우저 호환성**: Chrome, Firefox, Safari, Edge 최신 버전

#### 사용성

- **접근성**: ARIA 라벨, 키보드 네비게이션, 스크린 리더 지원
- **반응형**: 320px ~ 1920px 화면 크기 지원
- **오프라인**: PWA 기능으로 네트워크 없이도 작동

#### 보안

- **클립보드 권한**: 사용자 명시적 허용 필요
- **데이터 저장**: 로컬 스토리지만 사용, 서버 전송 없음

### 3. 페이지/화면 구성

#### 메인 화면

```
┌─────────────────────────────────────┐
│ Header: 제목 + 다크모드 토글        │
├─────────────────────────────────────┤
│ 텍스트 입력 영역 (textarea)         │
│ - 플레이스홀더 텍스트               │
│ - 자동 리사이즈                     │
├─────────────────────────────────────┤
│ 통계 카드 그리드 (3열)              │
│ - 글자수, 단어수, 문장수 등        │
├─────────────────────────────────────┤
│ SNS 제한 프로그레스 바              │
│ - 플랫폼별 제한 표시               │
├─────────────────────────────────────┤
│ 작업 버튼들                         │
│ - 복사, 붙여넣기, 지우기           │
├─────────────────────────────────────┤
│ 키보드 단축키 도움말                │
└─────────────────────────────────────┘
```

#### 반응형 레이아웃

- **모바일 (320px~)**: 1열 그리드, 세로 스택
- **태블릿 (768px~)**: 2열 그리드
- **데스크톱 (1024px~)**: 3열 그리드

### 4. 사용자 시나리오

#### 시나리오 1: SNS 글 작성

1. 사용자가 텍스트 입력
2. 실시간으로 글자수 확인
3. SNS 제한에 맞춰 텍스트 조정
4. 완성된 텍스트 복사하여 SNS에 붙여넣기

#### 시나리오 2: 문서 분석

1. 긴 문서를 붙여넣기
2. 통계 정보 확인 (단어수, 읽기시간 등)
3. 다크모드로 편안한 작업 환경
4. 작업 결과 저장 (localStorage)

## 🚀 기술블로그

### 1. 프로젝트 구조 분석

**아키텍처 특징:**

- **컴포넌트 분리**: 단일 책임 원칙에 따른 명확한 역할 분담
- **훅 기반 로직**: 비즈니스 로직을 커스텀 훅으로 분리
- **유틸리티 분리**: 순수 함수를 별도 모듈로 분리하여 테스트 용이성 확보

**주요 파일별 역할:**

- **CharacterCounter** (229줄): 메인 로직 컴포넌트
- **ProgressBar** (61줄): 진행률 표시 컴포넌트
- **StatisticsCard** (37줄): 통계 정보 카드
- **useClipboard** (28줄): 클립보드 API 래퍼
- **useDarkMode** (45줄): 테마 상태 관리
- **useLocalStorage** (40줄): 로컬스토리지 동기화
- **common.ts** (89줄): 통계 계산 로직

### 2. 상태 관리 흐름 추적

```
텍스트 입력 → CharacterCounter state → useLocalStorage → localStorage
    ↓
useEffect → computeStatistics → 통계 객체 생성
    ↓
StatisticsCard, ProgressBar props → UI 업데이트
```

**상태 흐름 상세:**

1. **텍스트 상태**: `useLocalStorage` 훅으로 지속성 보장
2. **통계 상태**: `useEffect`로 텍스트 변경 시 자동 재계산
3. **UI 상태**: 복사/붙여넣기 로딩, 토스트 알림 등

**상태 관리 패턴:**

- **로컬 상태**: `useState`로 컴포넌트 내부 상태 관리
- **지속 상태**: `useLocalStorage`로 브라우저 재시작 후에도 유지
- **파생 상태**: `useEffect`로 의존성 기반 자동 업데이트

### 3. 중요 유틸 함수 하나씩 이해

#### `computeStatistics(text: string): Statistics`

```typescript
// 핵심 통계 계산 함수
export function computeStatistics(text: string): Statistics {
  // 1. 기본 문자 수 계산
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;

  // 2. 정규식 기반 텍스트 분석
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const paragraphs = text.split(/\n+/).filter((s) => s.trim().length > 0);

  // 3. 한글/영문 문자 구분 카운트
  const koreanMatches = text.match(/[\u3131-\u318E\uAC00-\uD7AF]/g) || [];
  const englishMatches = text.match(/[A-Za-z]/g) || [];

  // 4. 읽기 시간 계산 (200 WPM 기준)
  const readingTimeMinutes = wordCount > 0 ? Math.max(0.1, wordCount / 200) : 0;

  // 5. SNS 플랫폼별 남은 글자 수 계산
  const remaining = Object.fromEntries(
    Object.entries(SNS_LIMITS).map(([platform, limit]) => [
      platform,
      limit - charCount,
    ])
  );

  return {
    /* 통계 객체 반환 */
  };
}
```

**함수 설계 원칙:**

- **순수 함수**: 외부 상태에 의존하지 않음
- **단일 책임**: 통계 계산만 담당
- **타입 안전성**: TypeScript 인터페이스로 반환값 명시

#### `useLocalStorage<T>(key: string, defaultValue: T)`

```typescript
// 로컬스토리지 동기화 훅
function useLocalStorage<T>(key: string, defaultValue: T) {
  // 1. 초기값 설정 (동기적)
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn("useLocalStorage: parse failed", error);
      return defaultValue;
    }
  });

  // 2. 값 변경 시 자동 동기화
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("useLocalStorage: set failed", error);
    }
  }, [key, value]);

  return [value, setValue];
}
```

**훅 설계 특징:**

- **SSR 안전성**: `window` 객체 존재 여부 확인
- **에러 처리**: JSON 파싱/저장 실패 시 기본값 사용
- **자동 동기화**: 상태 변경 시 localStorage 자동 업데이트

### 4. 메인 컴포넌트 흐름 추적

#### CharacterCounter 컴포넌트 생명주기

```typescript
// 1. 컴포넌트 마운트
const CharacterCounter: React.FC = () => {
  // 상태 초기화
  const [text, setText] = useLocalStorage("letterCalc:text", "");
  const [stats, setStats] = useState(() => computeStatistics(text));

  // 2. 텍스트 변경 감지
  useEffect(() => {
    setStats(computeStatistics(text));
  }, [text]);

  // 3. 키보드 이벤트 리스너 등록
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+C, Ctrl+V, Ctrl+Shift+R 처리
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // 4. 토스트 자동 해제
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // 5. 렌더링
  return (
    <textarea onChange={(e) => setText(e.target.value)} />
    <StatisticsCard data={stats} />
    <ProgressBar data={stats} />
    <ActionButtons />
  );
};
```

**컴포넌트 설계 패턴:**

- **컨테이너 패턴**: 로직과 상태를 포함한 스마트 컴포넌트
- **이벤트 위임**: 전역 키보드 이벤트를 컴포넌트 레벨에서 처리
- **자동 정리**: useEffect cleanup으로 메모리 누수 방지

### 5. 렌더링 최적화 포인트

#### 최적화 전략

1. **메모이제이션 없음**: 텍스트 입력이 빈번하여 불필요
2. **상태 정규화**: 단일 `stats` 객체로 모든 통계 관리
3. **조건부 렌더링**: 토스트, 로딩 상태 등 필요시에만 렌더링

#### 성능 개선 포인트

```typescript
// 1. 불필요한 리렌더링 방지
const [stats, setStats] = useState(() => computeStatistics(text));

// 2. 이벤트 리스너 최적화
useEffect(() => {
  const handler = handleKeyDown;
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, []); // 의존성 배열 비움

// 3. 타이머 정리
useEffect(() => {
  if (!toast) return;
  const timer = setTimeout(() => setToast(null), 2000);
  return () => clearTimeout(timer);
}, [toast]);
```

### 6. 내가 개선한 부분

#### 1) 키보드 단축키 개선

**기존**: `Ctrl+Shift+C`, `Ctrl+Shift+R` (비표준)
**개선**: `Ctrl+C`, `Ctrl+V` (표준 단축키)

```typescript
// 개선된 단축키 처리
if (isCtrlOrCmd && e.key.toLowerCase() === "c") {
  e.preventDefault();
  handleCopy();
}
if (isCtrlOrCmd && e.key.toLowerCase() === "v") {
  e.preventDefault();
  handlePaste();
}
```

#### 2) 크롬 자동 번역 문제 해결

**문제**: 크롬에서 "Paste" → "반죽", "Clear" → "분명한"으로 잘못 번역
**해결**: `translate="no"` 속성 추가 후 제거하여 한/영 전환 지원

### 7. 트러블 슈팅

#### 문제 1: npm ENOENT 오류

**증상**: `npm run dev` 실행 시 `package.json`을 찾을 수 없음
**원인**: 잘못된 디렉토리에서 명령 실행
**해결**: 중첩된 디렉토리 구조 확인 후 올바른 경로로 이동

#### 문제 2: 크롬 자동 번역 품질 문제

**증상**: "Paste" → "반죽", "Clear" → "분명한"으로 부정확한 번역
**원인**: Google 번역 엔진의 한계
**해결**:

1. `translate="no"` 속성으로 번역 차단 (한/영 전환 불가)
2. 명시적 한글 텍스트 사용 (번역 불필요)
3. 영어 텍스트 유지 + 크롬 번역 감수

#### 문제 3: 클립보드 권한 오류

**증상**: HTTPS가 아닌 환경에서 클립보드 API 실패
**원인**: 브라우저 보안 정책
**해결**: try-catch로 오류 처리하고 사용자에게 명확한 메시지 제공

### 8. 배운 점과 고생한 점

#### 배운 점

1. **React 훅 설계**: 커스텀 훅으로 로직 분리 시 재사용성과 테스트 용이성 향상
2. **TypeScript 활용**: 인터페이스와 제네릭으로 타입 안전성 확보
3. **성능 최적화**: useEffect cleanup과 이벤트 리스너 관리의 중요성
4. **접근성**: ARIA 라벨과 키보드 네비게이션의 필요성

#### 고생한 점

1. **크롬 번역 문제**: 자동 번역의 한계를 직접 체험하고 해결책 모색
2. **디렉토리 구조**: 중첩된 폴더 구조로 인한 npm 명령어 실행 오류
3. **한글 JSDoc**: 영어 주석을 한글로 번역하며 코드 이해도 향상
4. **브라우저 호환성**: 다양한 브라우저에서의 클립보드 API 동작 차이

## 🚀 기술 스택 & 설치

### 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **PWA**: Service Worker + Web Manifest
- **Testing**: Jest + React Testing Library

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 테스트 실행
npm test
```

**환경 요구사항**: Node.js 16.0.0 이상, npm 8.0.0 이상

### 키보드 단축키

- **Ctrl/Cmd + C**: 텍스트 복사
- **Ctrl/Cmd + V**: 클립보드에서 붙여넣기
- **Ctrl/Cmd + Shift + R**: 텍스트 초기화

### UI/UX 특징

- **반응형 디자인**: 모바일 우선 설계
- **다크모드**: 시스템 설정 자동 감지
- **접근성**: ARIA 라벨, 키보드 네비게이션 지원
- **PWA**: 오프라인 작동, 홈 화면 추가 가능

## 🔧 커스터마이징 & 테스트

### SNS 제한 추가/수정

`src/utils/common.ts`에서 `SNS_LIMITS` 객체를 수정:

```typescript
export const SNS_LIMITS: Record<string, number> = {
  Twitter: 280,
  Instagram: 2200,
  Facebook: 63206,
  KakaoTalk: 1000,
  // 새로운 플랫폼 추가
  LinkedIn: 3000,
};
```

### 테스트

```bash
npm test                    # 전체 테스트 실행
npm test -- --coverage     # 커버리지 확인
npm test -- CharacterCounter # 특정 테스트 실행
```

## 🌐 배포

**Vercel**: GitHub 저장소 연결 후 자동 배포
**Netlify**: 저장소 연결 후 `npm run build` → `dist` 디렉토리 배포

## 🐛 알려진 이슈

- 클립보드 API는 HTTPS 환경에서만 작동
- 일부 브라우저에서 PWA 기능 제한적
- 크롬 자동 번역 시 일부 텍스트가 부정확하게 번역될 수 있음

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

**Made with ❤️ by Letter Vocabulary Calculator Team**
