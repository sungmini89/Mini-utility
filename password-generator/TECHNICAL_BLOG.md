# React + TypeScript + Tailwind CSS로 만든 비밀번호 도구 개발기

## 📝 개요

안전한 비밀번호 생성과 강도 분석을 위한 웹 애플리케이션을 개발했습니다. React 18, TypeScript, Tailwind CSS를 기반으로 하며, PWA 지원과 다크모드를 포함한 현대적인 웹 개발 기술을 적용했습니다.

## 🏗️ 1. 프로젝트 구조 분석

### 1.1 전체 아키텍처

```
password-generator/
├── src/
│   ├── components/
│   │   ├── PasswordGenerator/     # 비밀번호 생성기 컴포넌트
│   │   │   ├── index.tsx         # 메인 컴포넌트
│   │   │   ├── types.ts          # 타입 정의
│   │   │   └── utils.ts          # 생성 로직
│   │   └── PasswordStrength/     # 강도 체커 컴포넌트
│   │       ├── index.tsx         # 메인 컴포넌트
│   │       ├── types.ts          # 타입 정의
│   │       └── utils.ts          # 분석 로직
│   ├── hooks/                    # 커스텀 훅
│   │   ├── useDarkMode.ts        # 다크모드 관리
│   │   ├── useLocalStorage.ts    # 로컬 스토리지
│   │   └── useClipboard.ts       # 클립보드 관리
│   ├── utils/                    # 공통 유틸리티
│   │   └── common.ts             # 헬퍼 함수
│   ├── pages/                    # 페이지 컴포넌트
│   ├── App.tsx                   # 루트 컴포넌트
│   └── main.tsx                  # 진입점
├── public/                       # 정적 자산
├── vite.config.ts               # Vite 설정
└── package.json                 # 의존성 관리
```

### 1.2 설계 원칙

- **컴포넌트 분리**: 각 기능별로 독립적인 컴포넌트 구조
- **타입 안전성**: TypeScript로 런타임 오류 방지
- **재사용성**: 커스텀 훅을 통한 로직 분리
- **확장성**: 새로운 기능 추가를 고려한 모듈화

## 🔄 2. 상태 관리 흐름 추적

### 2.1 전역 상태 구조

```typescript
// 다크모드 상태
const [darkMode, toggleDarkMode] = useDarkMode();

// 비밀번호 생성기 상태
const [options, setOptions] = useLocalStorage<GeneratorOptions>();
const [passwords, setPasswords] = useLocalStorage<string[]>();
const [history, setHistory] = useLocalStorage<HistoryItem[]>();

// 강도 체커 상태
const [password, setPassword] = useState<string>("");
const [analysis, setAnalysis] = useState<StrengthAnalysis>();
```

### 2.2 상태 업데이트 흐름

```
사용자 입력 → 상태 업데이트 → useEffect → UI 리렌더링
     ↓
localStorage 저장 → 브라우저 새로고침 → 상태 복원
```

### 2.3 상태 지속성 전략

- **localStorage 훅**: 페이지 새로고침 후에도 설정 유지
- **세션 관리**: 히스토리와 설정을 자동으로 저장
- **상태 동기화**: 다크모드 설정을 HTML 클래스와 동기화

## ⚙️ 3. 중요 유틸 함수 하나씩 이해

### 3.1 비밀번호 생성 로직 (`generatePasswords`)

```typescript
export function generatePasswords(opts: GeneratorOptions): string[] {
  const list: string[] = [];
  for (let i = 0; i < opts.count; i++) {
    const pw = generateOne(opts);
    if (!pw) return [];
    list.push(pw);
  }
  return list;
}
```

**핵심 특징:**

- Fisher-Yates 셔플 알고리즘으로 완전한 랜덤화
- 각 문자 카테고리에서 최소 하나씩 보장
- 유사 문자 제외 옵션으로 가독성 향상

### 3.2 강도 분석 로직 (`calculatePasswordStrength`)

```typescript
export function calculatePasswordStrength(password: string): StrengthLevel {
  let score = 0;
  // 길이 점수 (0-4점)
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  // 문자 다양성 점수 (0-4점)
  if (factors.hasUppercase) score += 1;
  if (factors.hasLowercase) score += 1;
  // 약한 패턴 페널티
  if (factors.hasRepeatingChars) score -= 1;
  return normalizeScore(score);
}
```

**분석 요소:**

- 길이, 문자 다양성, 패턴 감지
- 일반적인 약한 비밀번호 목록 체크
- 순차 문자 및 반복 문자 패턴 감지

### 3.3 커스텀 훅들

#### `useLocalStorage` 훅

```typescript
export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // 초기화 시 localStorage에서 값 로드
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}
```

#### `useClipboard` 훅

```typescript
export default function useClipboard(): [
  boolean,
  (text: string) => Promise<void>
] {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return [copied, copy];
}
```

## 🎯 4. 메인 컴포넌트 흐름 추적

### 4.1 App 컴포넌트 흐름

```typescript
const App: React.FC = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className={darkMode ? "dark" : ""}>
      <header>
        <nav>
          <Link to="/">생성기</Link>
          <Link to="/strength">강도 체커</Link>
          <button onClick={toggleDarkMode}>다크모드</button>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<PasswordGeneratorPage />} />
          <Route path="/strength" element={<PasswordStrengthPage />} />
        </Routes>
      </main>
    </div>
  );
};
```

### 4.2 PasswordGenerator 컴포넌트 흐름

```
1. 컴포넌트 마운트
   ↓
2. localStorage에서 옵션/히스토리 로드
   ↓
3. 사용자 입력 처리
   ├─ 옵션 변경 → 상태 업데이트 → localStorage 저장
   ├─ 생성 버튼 → generatePasswords() → 결과 표시
   └─ 복사 버튼 → navigator.clipboard → 토스트 표시
   ↓
4. 키보드 단축키 이벤트 리스너 등록
   ↓
5. 컴포넌트 언마운트 시 이벤트 리스너 정리
```

### 4.3 PasswordStrength 컴포넌트 흐름

```
1. 사용자 입력 감지
   ↓
2. 디바운스 처리 (성능 최적화)
   ↓
3. calculatePasswordStrength() 호출
   ↓
4. 분석 결과 상태 업데이트
   ↓
5. UI 리렌더링 (강도 표시기, 분석 결과)
```

## ⚡ 5. 렌더링 최적화 포인트

### 5.1 메모이제이션 적용

```typescript
// 비밀번호 생성 결과 메모이제이션
const generatedPasswords = useMemo(() => {
  return generatePasswords(options);
}, [options]);

// 강도 분석 결과 메모이제이션
const strengthAnalysis = useMemo(() => {
  return analyzePassword(password);
}, [password]);
```

### 5.2 디바운싱 적용

```typescript
// 강도 체커에서 실시간 분석 시 디바운싱
useEffect(() => {
  const timer = setTimeout(() => {
    if (password) {
      setAnalysis(analyzePassword(password));
    }
  }, 300);

  return () => clearTimeout(timer);
}, [password]);
```

### 5.3 조건부 렌더링

```typescript
// 불필요한 렌더링 방지
{
  passwords.length > 0 && (
    <div className="password-list">
      {passwords.map((pw, idx) => (
        <PasswordItem key={idx} password={pw} onCopy={handleCopy} />
      ))}
    </div>
  );
}
```

### 5.4 이벤트 리스너 최적화

```typescript
// 키보드 단축키 이벤트 리스너
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // 이벤트 처리 로직
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [options, passwords, history]); // 의존성 배열 최적화
```

## 🔧 6. 내가 개선한 부분

### 6.1 접근성 개선

```typescript
// ARIA 속성 추가
<div role="main" aria-label="비밀번호 생성기">
  <section aria-labelledby="options-heading">
    <h2 id="options-heading">옵션</h2>
    <input aria-describedby="length-desc" aria-label="비밀번호 길이" />
  </section>
</div>
```

### 6.2 에러 핸들링 강화

```typescript
// try-catch로 안전한 localStorage 접근
try {
  window.localStorage.setItem(key, JSON.stringify(value));
} catch (error) {
  console.warn("localStorage 저장 실패:", error);
}
```

### 6.3 사용자 경험 개선

```typescript
// 로딩 상태 표시
const [loading, setLoading] = useState(false);

const handleGenerate = async () => {
  setLoading(true);
  try {
    const result = generatePasswords(options);
    setPasswords(result);
  } finally {
    setTimeout(() => setLoading(false), 150);
  }
};
```

### 6.4 PWA 최적화

```typescript
// vite.config.ts에서 PWA 설정
VitePWA({
  registerType: "autoUpdate",
  manifest: {
    name: "비밀번호 도구",
    short_name: "비밀번호",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  },
  devOptions: {
    enabled: false, // 개발 환경에서 PWA 비활성화
  },
});
```

## 🐛 7. 트러블 슈팅

### 7.1 PWA 서비스 워커 충돌

**문제**: 개발 환경에서 서비스 워커가 Vite 개발 서버와 충돌하여 리소스 로딩 실패

**해결책**:

```typescript
// vite.config.ts
VitePWA({
  devOptions: {
    enabled: false, // 개발 환경에서 PWA 비활성화
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
  },
});
```

### 7.2 localStorage 용량 제한

**문제**: 히스토리 데이터가 많아지면 localStorage 용량 초과 가능

**해결책**:

```typescript
// 최근 10개만 유지
setHistory([entry, ...history].slice(0, 10));
```

### 7.3 TypeScript 타입 안전성

**문제**: 복잡한 객체 구조에서 타입 추론 어려움

**해결책**:

```typescript
// 명시적 타입 정의
interface GeneratorOptions {
  length: number;
  includeUpper: boolean;
  includeLower: boolean;
  includeNumbers: boolean;
  includeSpecial: boolean;
  excludeSimilar: boolean;
  count: number;
}
```

### 7.4 반응형 디자인 이슈

**문제**: 모바일에서 슬라이더와 체크박스 터치 영역이 작음

**해결책**:

```css
/* Tailwind CSS로 터치 친화적 크기 설정 */
<input type="range" className="w-full h-8" />
<input type="checkbox" className="h-6 w-6" />
```

## 📚 8. 배운 점과 고생한 점

### 8.1 배운 점

#### React 18의 새로운 기능 활용

- **Concurrent Features**: Suspense와 함께 사용하여 로딩 상태 관리
- **Automatic Batching**: 상태 업데이트 최적화
- **Strict Mode**: 개발 환경에서 잠재적 문제 사전 감지

#### TypeScript 고급 기능

- **Generic Types**: `useLocalStorage<T>` 같은 재사용 가능한 타입
- **Utility Types**: `keyof`, `Partial`, `Pick` 등 활용
- **Type Guards**: 런타임 타입 검증

#### PWA 개발 경험

- **Service Worker**: 오프라인 기능과 캐싱 전략
- **Web App Manifest**: 앱 설치 및 홈 화면 추가
- **Workbox**: 서비스 워커 생명주기 관리

#### 성능 최적화 기법

- **메모이제이션**: `useMemo`, `useCallback` 활용
- **디바운싱**: 실시간 입력 처리 최적화
- **코드 스플리팅**: 라우트별 청크 분리

### 8.2 고생한 점

#### 상태 관리 복잡성

- **초기 문제**: 컴포넌트 간 상태 공유가 복잡
- **해결 과정**: 커스텀 훅으로 로직 분리, Context API 고려
- **결과**: 재사용 가능하고 테스트하기 쉬운 구조 완성

#### PWA 설정의 어려움

- **초기 문제**: 개발/프로덕션 환경에서 PWA 동작 차이
- **해결 과정**: Workbox 설정, 매니페스트 파일 최적화
- **결과**: 안정적인 PWA 기능 구현

#### 접근성 구현

- **초기 문제**: 스크린 리더 지원 부족
- **해결 과정**: ARIA 속성 학습, 키보드 네비게이션 구현
- **결과**: WCAG 2.1 AA 수준의 접근성 달성

#### 다국어 지원

- **초기 문제**: 하드코딩된 텍스트들
- **해결 과정**: 한국어 번역, i18n 구조 설계
- **결과**: 완전한 한국어 인터페이스 구현

### 8.3 기술적 성장

#### 아키텍처 설계 능력

- 모듈화된 컴포넌트 구조 설계
- 확장 가능한 상태 관리 패턴
- 재사용 가능한 유틸리티 함수 설계

#### 성능 최적화 경험

- 렌더링 최적화 기법 습득
- 메모리 누수 방지 방법
- 사용자 경험 개선 기법

#### 현대적 웹 개발 도구 활용

- Vite의 빠른 개발 환경
- Tailwind CSS의 효율적인 스타일링
- TypeScript의 타입 안전성

## 🚀 결론

이 프로젝트를 통해 현대적인 웹 개발의 다양한 기술을 실무에 적용해볼 수 있었습니다. React 18의 새로운 기능, TypeScript의 타입 안전성, PWA의 오프라인 기능 등 실제 사용자에게 가치를 제공하는 기능들을 구현하면서 많은 것을 배웠습니다.

특히 성능 최적화와 접근성 구현 과정에서 웹 개발의 깊이 있는 이해가 필요하다는 것을 느꼈고, 사용자 중심의 설계가 얼마나 중요한지 다시 한번 확인할 수 있었습니다.

앞으로도 지속적으로 새로운 기술을 학습하고, 사용자에게 더 나은 경험을 제공하는 애플리케이션을 개발하고 싶습니다.

---

**작성일**: 2024년 12월  
**기술 스택**: React 18, TypeScript, Tailwind CSS, Vite, PWA  
**프로젝트 기간**: 2주  
**GitHub**: [password-generator](https://github.com/username/password-generator)
