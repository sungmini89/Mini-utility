# 비밀번호 도구

React, TypeScript, Tailwind CSS로 구축된 현대적이고 안전한 비밀번호 생성기 및 강도 체커입니다.

## 기능

### 비밀번호 생성기

- **사용자 정의 길이** (8-128자)
- **문자 옵션**: 대문자, 소문자, 숫자, 특수문자
- **유사 문자 제외** (0, O, l, 1)
- **여러 개 동시 생성** (한 번에 1-10개)
- **복사 기능** (개별 및 일괄)
- **생성 히스토리** (localStorage 지속성)
- **키보드 단축키** 빠른 접근

### 비밀번호 강도 체커

- **실시간 분석** 비밀번호 강도
- **시각적 강도 표시기** 색상 코딩된 수준
- **상세한 분석** 비밀번호 특성
- **일반적인 패턴 감지**
- **보안 팁** 및 모범 사례

### 일반 기능

- **다크모드** 지원 (시스템 기본 설정 감지)
- **반응형 디자인** (모바일 우선 접근)
- **PWA 지원** 오프라인 사용
- **접근성** 기능 (ARIA 라벨, 키보드 네비게이션)
- **TypeScript** 타입 안전성
- **현대적 UI** Tailwind CSS

## 기술 스택

- **React 18** Hooks와 함께
- **TypeScript** 타입 안전성
- **Vite** 빠른 개발 및 빌드
- **Tailwind CSS** 스타일링
- **React Router** 네비게이션
- **Jest + Testing Library** 테스팅
- **PWA** Vite PWA 플러그인 지원

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치

1. 저장소 클론:

```bash
git clone https://github.com/yourusername/password-tools.git
cd password-tools
```

2. 의존성 설치:

```bash
npm install
```

3. 개발 서버 시작:

```bash
npm run dev
```

4. 브라우저에서 [http://localhost:3001](http://localhost:3001) 열기

### 사용 가능한 스크립트

- `npm run dev` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 프로덕션 빌드 미리보기
- `npm test` - 테스트 실행

## 키보드 단축키

### 비밀번호 생성기

- `Alt + G` - 비밀번호 생성
- `Ctrl/Cmd + Shift + C` - 모든 비밀번호 복사
- `Ctrl/Cmd + Shift + S` - 히스토리에 저장
- `Ctrl/Cmd + Shift + R` - 옵션 초기화

## 프로젝트 구조

```
src/
├── components/
│   ├── PasswordGenerator/
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── index.test.tsx
│   └── PasswordStrength/
│       ├── index.tsx
│       ├── types.ts
│       ├── utils.ts
│       └── index.test.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useClipboard.ts
│   └── useDarkMode.ts
├── pages/
│   ├── PasswordGeneratorPage.tsx
│   └── PasswordStrengthPage.tsx
├── utils/
│   └── common.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 배포

### Vercel

1. GitHub 저장소를 Vercel에 연결
2. Vercel이 Vite 구성을 자동으로 감지
3. 기본 설정으로 배포

### Netlify

1. GitHub 저장소를 Netlify에 연결
2. 빌드 명령: `npm run build`
3. 게시 디렉토리: `dist`

## 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 보안

- 모든 비밀번호 생성 및 분석은 브라우저에서 로컬로 수행
- 비밀번호가 서버로 전송되지 않음
- 암호학적으로 안전한 난수 생성 사용
- 비밀번호 생성 보안 모범 사례 준수

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 감사의 말

- 현대적인 웹 기술로 구축
- 더 나은 비밀번호 보안 도구의 필요성에서 영감
- 놀라운 도구와 라이브러리를 제공한 오픈소스 커뮤니티에 감사
