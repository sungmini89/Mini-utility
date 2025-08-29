# 🚀 Text Diff Checker 개발기 - React + TypeScript로 만든 텍스트 비교 도구

## 📖 프로젝트 소개

**Text Diff Checker**는 두 텍스트 간의 차이점을 시각적으로 비교할 수 있는 웹 애플리케이션입니다. React 18, TypeScript 5, Vite 7을 기반으로 구축되었으며, LCS(Longest Common Subsequence) 알고리즘을 사용하여 효율적인 diff 계산을 구현했습니다.

### 🎯 개발 목표

- **사용자 친화적**: 직관적인 UI/UX로 누구나 쉽게 사용
- **성능 최적화**: 대용량 텍스트도 빠르게 처리
- **확장 가능**: 모듈화된 구조로 기능 추가 용이
- **PWA 지원**: 오프라인에서도 동작하는 웹 앱

---

## 🏗️ 프로젝트 구조 분석

### 1. 전체 아키텍처

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   └── DiffChecker/    # 핵심 diff 컴포넌트
├── hooks/              # 커스텀 React 훅
├── pages/              # 페이지 컴포넌트
├── utils/              # 유틸리티 함수
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx            # 앱 진입점
```

### 2. 컴포넌트 설계 원칙

- **단일 책임 원칙**: 각 컴포넌트는 하나의 명확한 역할만 담당
- **합성 패턴**: 작은 컴포넌트들을 조합하여 복잡한 UI 구성
- **Props 인터페이스**: TypeScript로 명확한 데이터 흐름 정의

### 3. 폴더 구조의 장점

- **명확한 분리**: 기능별로 폴더를 분리하여 코드 탐색 용이
- **재사용성**: hooks와 utils를 분리하여 다른 프로젝트에서도 활용 가능
- **테스트 용이성**: 각 모듈을 독립적으로 테스트 가능

---

## 🔄 상태 관리 흐름 추적

### 1. 상태 구조 분석

```typescript
// DiffChecker 컴포넌트의 상태 구조
const [leftText, setLeftText] = useLocalStorage<string>("diffChecker:left", "");
const [rightText, setRightText] = useLocalStorage<string>(
  "diffChecker:right",
  ""
);
const [diff, setDiff] = useState<DiffLine[]>([]);
const [stats, setStats] = useState({ add: 0, delete: 0, change: 0 });
const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
  "diffChecker:viewMode",
  "split"
);
const [history, setHistory] = useLocalStorage<HistoryItem[]>(
  "diffChecker:history",
  []
);
```

### 2. 상태 흐름 다이어그램

```
사용자 입력 → 텍스트 상태 변경 → useEffect 트리거 → diff 계산 → 결과 상태 업데이트 → UI 렌더링
     ↓
localStorage 동기화 → 브라우저 새로고침 시에도 상태 유지
```

### 3. 상태 관리 전략

#### 3.1 로컬 상태 vs 지속 상태

- **로컬 상태**: `diff`, `stats`, `loading` - 컴포넌트 생명주기와 연동
- **지속 상태**: `leftText`, `rightText`, `viewMode`, `history` - localStorage에 저장

#### 3.2 커스텀 훅 활용

```typescript
// useLocalStorage 훅으로 상태 지속성 구현
const [leftText, setLeftText] = useLocalStorage<string>("diffChecker:left", "");

// useClipboard 훅으로 복사 기능 구현
const [copied, copy] = useClipboard();

// useDarkMode 훅으로 테마 관리
const [darkMode, toggleDarkMode] = useDarkMode();
```

### 4. 상태 업데이트 최적화

- **useEffect 의존성 배열**: `[leftText, rightText]`로 필요한 경우에만 diff 재계산
- **배치 업데이트**: React 18의 자동 배치 처리로 성능 향상
- **불필요한 리렌더링 방지**: useCallback과 useMemo 적절히 활용

---

## 🔧 중요 유틸 함수 하나씩 이해

### 1. `diffLines` 함수 - LCS 알고리즘 구현

```typescript
export function diffLines(left: string, right: string): DiffLine[] {
  const a = left.split("\n");
  const b = right.split("\n");
  const m = a.length;
  const n = b.length;

  // LCS 테이블 구축 - 동적 프로그래밍
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1; // 일치하는 경우
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // 불일치하는 경우
      }
    }
  }

  // 역추적하여 diff 작업 생성
  const result: DiffLine[] = [];
  let i = m,
    j = n;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.push({ type: "equal", textA: a[i - 1], textB: b[j - 1] });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      result.push({ type: "delete", textA: a[i - 1] });
      i--;
    } else {
      result.push({ type: "add", textB: b[j - 1] });
      j--;
    }
  }

  // 남은 라인들 처리
  while (i > 0) {
    result.push({ type: "delete", textA: a[i - 1] });
    i--;
  }
  while (j > 0) {
    result.push({ type: "add", textB: b[j - 1] });
    j--;
  }

  result.reverse();

  // 삭제+추가 쌍을 변경 작업으로 병합
  const merged: DiffLine[] = [];
  for (let k = 0; k < result.length; k++) {
    const entry = result[k];
    if (
      entry.type === "delete" &&
      k + 1 < result.length &&
      result[k + 1].type === "add"
    ) {
      merged.push({
        type: "change",
        textA: entry.textA,
        textB: result[k + 1].textB,
      });
      k++; // 다음 항목을 건너뜀
    } else {
      merged.push(entry);
    }
  }

  return merged;
}
```

#### 알고리즘의 핵심 포인트

1. **LCS 테이블 구축**: O(m×n) 시간 복잡도로 최장 공통 부분수열 계산
2. **역추적**: 테이블을 거꾸로 따라가며 diff 작업 생성
3. **병합 최적화**: 연속된 삭제+추가를 변경 작업으로 통합하여 가독성 향상

### 2. `computeStats` 함수 - 통계 계산

```typescript
export function computeStats(diff: DiffLine[]): {
  add: number;
  delete: number;
  change: number;
} {
  let add = 0,
    del = 0,
    change = 0;

  diff.forEach((line) => {
    switch (line.type) {
      case "add":
        add++;
        break;
      case "delete":
        del++;
        break;
      case "change":
        change++;
        break;
    }
  });

  return { add, delete: del, change };
}
```

#### 최적화 포인트

- **단일 순회**: diff 배열을 한 번만 순회하여 O(n) 시간 복잡도
- **switch 문**: if-else 체인보다 빠른 분기 처리

### 3. `useLocalStorage` 훅 - 상태 지속성

```typescript
function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    // 초기값 계산을 lazy하게 수행
    if (typeof window === "undefined") return defaultValue;

    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn("useLocalStorage: unable to parse stored value", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("useLocalStorage: unable to set value", error);
    }
  }, [key, value]);

  return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}
```

#### 설계의 핵심

1. **Lazy 초기화**: useState의 함수형 초기화로 localStorage 접근 최소화
2. **에러 처리**: JSON 파싱 실패 시 기본값으로 fallback
3. **자동 동기화**: useEffect로 상태 변경 시 자동으로 localStorage 업데이트

---

## 🎯 메인 컴포넌트 흐름 추적

### 1. 컴포넌트 생명주기

```typescript
const DiffChecker: React.FC = () => {
  // 1. 상태 초기화
  const [leftText, setLeftText] = useLocalStorage<string>(
    "diffChecker:left",
    ""
  );
  const [rightText, setRightText] = useLocalStorage<string>(
    "diffChecker:right",
    ""
  );
  // ... 기타 상태들

  // 2. 사이드 이펙트 설정
  useEffect(() => {
    // 텍스트 변경 시 diff 계산
    setLoading(true);
    const result = diffLines(leftText, rightText);
    setDiff(result);
    setStats(computeStats(result));
    // ... diff 인덱스 계산
    setLoading(false);
  }, [leftText, rightText]);

  // 3. 이벤트 핸들러 정의
  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    side: "left" | "right"
  ) => {
    // 파일 업로드 처리 로직
  };

  const copyUnifiedDiff = async () => {
    // 클립보드 복사 로직
  };

  // 4. 키보드 단축키 설정
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 단축키 처리 로직
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 5. UI 렌더링
  return (
    <div>
      {/* 입력 영역 */}
      {/* 기능 설명 */}
      {/* 색상 의미 */}
      {/* 컨트롤 버튼 */}
      {/* Diff 표시 */}
      {/* 히스토리 */}
      {/* 토스트 알림 */}
    </div>
  );
};
```

### 2. 데이터 흐름 분석

#### 2.1 입력 → 처리 → 출력 흐름

```
사용자 입력 → 상태 업데이트 → useEffect 트리거 → diff 계산 → 결과 렌더링
```

#### 2.2 이벤트 처리 흐름

```
사용자 액션 → 이벤트 핸들러 → 상태 변경 → UI 업데이트 → 사용자 피드백
```

### 3. 컴포넌트 간 통신

- **Props**: 부모에서 자식으로 데이터 전달
- **State**: 컴포넌트 내부 상태 관리
- **Custom Hooks**: 로직 재사용 및 상태 공유
- **Context**: 전역 상태 관리 (현재 미사용, 향후 확장 가능)

---

## ⚡ 렌더링 최적화 포인트

### 1. React.memo 활용

```typescript
// 자주 변경되지 않는 컴포넌트를 메모이제이션
const DiffLine = React.memo<{ line: DiffLine; index: number }>(
  ({ line, index }) => {
    // 렌더링 로직
  }
);
```

### 2. useCallback으로 함수 메모이제이션

```typescript
const handleFileUpload = useCallback(
  (event: React.ChangeEvent<HTMLInputElement>, side: "left" | "right") => {
    // 파일 업로드 로직
  },
  []
); // 의존성 배열이 비어있어 컴포넌트 마운트 시에만 생성
```

### 3. useMemo로 계산 결과 메모이제이션

```typescript
const diffIndices = useMemo(() => {
  return diff
    .map((line, idx) => ({ line, idx }))
    .filter(({ line }) => line.type !== "equal")
    .map(({ idx }) => idx);
}, [diff]);
```

### 4. 가상화 (Virtualization) 고려사항

현재는 모든 diff 라인을 렌더링하지만, 대용량 텍스트의 경우 가상화를 적용할 수 있습니다:

```typescript
// react-window 또는 react-virtualized 사용 예시
import { FixedSizeList as List } from "react-window";

const DiffList = ({ diff }: { diff: DiffLine[] }) => (
  <List height={400} itemCount={diff.length} itemSize={24} itemData={diff}>
    {({ index, style, data }) => (
      <div style={style}>
        <DiffLine line={data[index]} index={index} />
      </div>
    )}
  </List>
);
```

### 5. 조건부 렌더링 최적화

```typescript
// 불필요한 렌더링 방지
{
  loading && <LoadingSpinner />;
}
{
  toast && <Toast message={toast.message} type={toast.type} />;
}
{
  history.length > 0 && <HistoryList history={history} />;
}
```

---

## 🚀 내가 개선한 부분

### 1. 한국어 현지화

#### 1.1 UI 텍스트 번역

- 모든 영어 텍스트를 한국어로 번역
- 사용자 친화적인 메시지로 변경
- 접근성 향상을 위한 aria-label 번역

#### 1.2 JSDoc 한글화

```typescript
/**
 * 이전 차이점으로 이동합니다. 이미 첫 번째 차이점에 있다면
 * 마지막 차이점으로 돌아갑니다.
 *
 * @returns {void}
 */
function prevDifference() {
  // 구현 로직
}
```

### 2. 사용자 경험 개선

#### 2.1 기능 설명 패널 추가

```tsx
{
  /* 기능 설명 */
}
<div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
  <div className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">
    📋 기능 설명
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700 dark:text-blue-300">
    {/* 각 기능에 대한 상세 설명 */}
  </div>
</div>;
```

#### 2.2 색상 의미 설명

```tsx
{
  /* 색상 설명 */
}
<div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
  <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
    색상 의미
  </div>
  <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
    {/* 녹색(추가), 빨간색(삭제), 노란색(수정) 설명 */}
  </div>
</div>;
```

### 3. 히스토리 관리 기능 추가

#### 3.1 히스토리 삭제 기능

```typescript
function clearHistory() {
  setHistory([]);
  setToast({ message: "히스토리가 삭제되었습니다", type: "success" });
}
```

#### 3.2 히스토리 삭제 버튼

```tsx
<button
  onClick={clearHistory}
  className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring"
>
  히스토리 삭제
</button>
```

### 4. Chrome 자동 번역 방지

```html
<!-- index.html에 메타 태그 추가 -->
<meta name="google" content="notranslate" />
```

---

## 🚨 트러블 슈팅

### 1. Jest 설정 문제

#### 문제: JSX 구문 지원 안됨

```bash
npm test
# SyntaxError: Support for the experimental syntax 'jsx' isn't currently enabled
```

**해결 과정:**

1. `jest.config.cjs` 파일 생성
2. ts-jest 프리셋 설정
3. jsdom 환경 설정
4. setupTests.ts 파일 생성하여 모킹 설정

**최종 설정:**

```javascript
// jest.config.cjs
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
```

### 2. ES 모듈 vs CommonJS 충돌

#### 문제: Jest 설정 파일이 ES 모듈로 인식됨

```bash
npm test
# ReferenceError: module is not defined in ES module scope
```

**해결 방법:**

- Jest 설정 파일을 `jest.config.cjs`로 명명
- CommonJS 모듈로 명시적 선언

### 3. 테스트 격리 문제

#### 문제: 이전 테스트의 상태가 다음 테스트에 영향

```bash
npm test
# 테스트 간 상태 공유로 인한 예상치 못한 결과
```

**해결 방법:**

```typescript
// src/setupTests.ts
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// 각 테스트 전에 모킹 초기화
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});
```

### 4. npm audit 보안 취약점

#### 문제: esbuild 관련 보안 취약점

```bash
npm audit
# 1 moderate severity vulnerability
```

**해결 방법:**

```bash
npm audit fix --force
```

- `vite`를 v4에서 v7.1.3으로 업데이트
- `vite-plugin-pwa`를 v0.16에서 v1.0.3으로 업데이트

---

## 📚 배운 점과 고생한 점

### 1. 배운 점

#### 1.1 LCS 알고리즘의 이해

- **동적 프로그래밍**: 최적 부분구조와 중복 계산을 활용한 효율적인 알고리즘
- **역추적**: 최적해를 찾은 후 실제 경로를 재구성하는 방법
- **시간 복잡도**: O(m×n)으로 대용량 텍스트도 효율적으로 처리

#### 1.2 React 최적화 기법

- **useCallback, useMemo**: 불필요한 리렌더링 방지
- **React.memo**: 컴포넌트 레벨 메모이제이션
- **의존성 배열**: useEffect의 정확한 사용법

#### 1.3 TypeScript 고급 기능

- **제네릭 훅**: `useLocalStorage<T>`로 타입 안전성 확보
- **유니온 타입**: `'success' | 'error'`로 명확한 상태 정의
- **인터페이스 확장**: 기존 타입을 확장하여 새로운 기능 추가

#### 1.4 테스트 환경 구축

- **Jest + React Testing Library**: 컴포넌트 테스트의 모범 사례
- **모킹 전략**: localStorage, matchMedia, navigator.clipboard 등 브라우저 API 모킹
- **테스트 격리**: 각 테스트가 독립적으로 실행되도록 보장

### 2. 고생한 점

#### 2.1 Jest 설정의 복잡성

- **프리셋 설정**: ts-jest와 jsdom 환경 설정의 세부사항
- **모듈 시스템**: ES 모듈과 CommonJS 간의 호환성 문제
- **모킹 설정**: 브라우저 API를 Node.js 환경에서 시뮬레이션

#### 2.2 상태 관리의 복잡성

- **동기화 문제**: localStorage와 React 상태 간의 동기화
- **성능 최적화**: 불필요한 리렌더링 방지와 사용자 경험의 균형
- **에러 처리**: 파일 업로드, JSON 파싱 등 다양한 실패 케이스 처리

#### 2.3 UI/UX 설계의 어려움

- **사용자 가이드**: 기능을 직관적으로 이해할 수 있는 설명 방법
- **반응형 디자인**: 다양한 화면 크기에서 일관된 사용자 경험 제공
- **접근성**: 키보드 네비게이션과 스크린 리더 지원

#### 2.4 국제화(i18n)의 복잡성

- **번역 일관성**: 모든 UI 요소의 일관된 한국어 표현
- **브라우저 호환성**: Chrome 자동 번역 등 브라우저별 동작 차이
- **문화적 맥락**: 한국 사용자에게 친숙한 표현과 설명

### 3. 성장 포인트

#### 3.1 기술적 성장

- **알고리즘 이해**: LCS 알고리즘의 이론적 배경과 실제 구현
- **React 패턴**: 커스텀 훅, 컴포넌트 설계, 상태 관리 패턴
- **TypeScript 활용**: 타입 시스템을 활용한 안전한 코드 작성

#### 3.2 문제 해결 능력

- **디버깅**: 복잡한 설정 문제의 체계적 해결
- **문서화**: README, 트러블슈팅 가이드 등 프로젝트 문서 작성
- **사용자 관점**: 개발자 관점에서 사용자 관점으로의 사고 전환

#### 3.3 프로젝트 관리

- **의존성 관리**: npm audit을 통한 보안 취약점 해결
- **버전 관리**: Git을 활용한 체계적인 개발 과정 관리
- **테스트 전략**: 자동화된 테스트를 통한 코드 품질 보장

---

## 🔮 향후 개선 계획

### 1. 성능 최적화

- **가상화**: 대용량 텍스트를 위한 가상 스크롤링
- **Web Workers**: diff 계산을 백그라운드 스레드로 이동
- **메모이제이션**: 계산 결과의 더 세밀한 캐싱

### 2. 기능 확장

- **파일 형식**: Markdown, JSON, XML 등 다양한 형식 지원
- **실시간 협업**: WebSocket을 통한 동시 편집
- **검색 및 필터링**: 특정 변경사항 검색 및 하이라이트

### 3. 사용자 경험

- **드래그 앤 드롭**: 파일 간의 직접 비교
- **키보드 단축키**: 더 많은 단축키와 사용자 정의
- **테마 시스템**: 다크 모드 외 다양한 테마 지원

---

## 📝 결론

Text Diff Checker 프로젝트를 통해 React와 TypeScript를 활용한 현대적인 웹 애플리케이션 개발의 전 과정을 경험했습니다.

**주요 성과:**

- LCS 알고리즘을 활용한 효율적인 diff 계산 구현
- React 최적화 기법을 적용한 성능 향상
- Jest를 활용한 견고한 테스트 환경 구축
- 사용자 친화적인 UI/UX 설계 및 구현

**배운 교훈:**

- 알고리즘의 이론적 이해가 실제 구현에 큰 도움이 됨
- 테스트 환경 구축의 중요성과 복잡성
- 사용자 관점에서의 기능 설계의 중요성
- 지속적인 개선과 문서화의 가치

이 프로젝트는 단순한 텍스트 비교 도구를 넘어서, 현대적인 웹 개발 기술과 사용자 중심 설계를 결합한 의미 있는 경험이었습니다. 앞으로도 더 많은 사용자에게 가치를 제공할 수 있도록 지속적으로 개선해 나갈 예정입니다.

---

_이 글은 Text Diff Checker 프로젝트 개발 과정에서의 경험과 학습 내용을 정리한 기술 블로그입니다. 프로젝트에 대한 질문이나 제안사항이 있으시면 언제든지 연락해 주세요!_ 🚀
