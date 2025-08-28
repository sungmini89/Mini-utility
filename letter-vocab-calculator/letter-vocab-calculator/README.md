# Letter & Vocabulary Calculator

실시간으로 글자수, 단어수, 문장수, 단락수를 계산하고 SNS 글자수 제한을 확인할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능

- **실시간 통계 계산**

  - 공백 포함/제외 글자수
  - 단어수, 문장수, 단락수
  - 예상 읽기 시간 (분)
  - 한글/영문 문자 구분 카운트

- **SNS 플랫폼별 제한 표시**

  - Twitter (280자)
  - Instagram (2,200자)
  - Facebook (63,206자)
  - KakaoTalk (1,000자)
  - 프로그레스 바로 시각적 표시

- **사용자 편의 기능**
  - 복사/붙여넣기 버튼
  - 텍스트 초기화
  - 키보드 단축키 지원
  - 다크모드 지원
  - localStorage를 통한 설정 저장

## 🚀 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **PWA**: Service Worker + Web Manifest
- **Testing**: Jest + React Testing Library

## 📦 설치 및 실행

### 개발 환경 설정

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

### 환경 요구사항

- Node.js 16.0.0 이상
- npm 8.0.0 이상

## ⌨️ 키보드 단축키

- **Ctrl/Cmd + Shift + C**: 텍스트 복사
- **Ctrl/Cmd + Shift + R**: 텍스트 초기화

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일 우선 설계
- **다크모드**: 시스템 설정 자동 감지
- **접근성**: ARIA 라벨, 키보드 네비게이션 지원
- **애니메이션**: 부드러운 전환 효과

## 📱 PWA 지원

- 오프라인 작동
- 홈 화면에 추가 가능
- 네이티브 앱과 유사한 경험

## 🔧 커스터마이징

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

### 스타일 수정

Tailwind CSS 클래스를 사용하여 컴포넌트 스타일을 수정할 수 있습니다.

## 🧪 테스트

```bash
# 전체 테스트 실행
npm test

# 테스트 커버리지 확인
npm test -- --coverage

# 특정 테스트 파일 실행
npm test -- CharacterCounter
```

## 📁 프로젝트 구조

```
src/
├── components/           # React 컴포넌트
│   ├── CharacterCounter/ # 메인 문자 카운터
│   ├── ProgressBar/      # 프로그레스 바
│   └── StatisticsCard/   # 통계 카드
├── hooks/               # 커스텀 훅
│   ├── useClipboard.ts  # 클립보드 관리
│   ├── useDarkMode.ts   # 다크모드 관리
│   └── useLocalStorage.ts # 로컬 스토리지 관리
├── utils/               # 유틸리티 함수
│   └── common.ts        # 통계 계산 로직
├── App.tsx              # 메인 앱 컴포넌트
└── main.tsx             # 앱 진입점
```

## 🌐 배포

### Vercel 배포

1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 자동 배포 설정

### Netlify 배포

1. Netlify 계정 생성
2. 저장소 연결
3. 빌드 명령어: `npm run build`
4. 배포 디렉토리: `dist`

## 🐛 알려진 이슈

- 클립보드 API는 HTTPS 환경에서만 작동
- 일부 브라우저에서 PWA 기능 제한적

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
