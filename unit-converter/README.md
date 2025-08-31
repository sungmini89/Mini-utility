# 단위 변환기 (Unit Converter)

길이, 무게, 온도, 면적, 부피, 속도, 데이터 단위 간 변환을 지원하는 현대적인 웹 애플리케이션입니다.

## ✨ 주요 기능

- **7개 단위 카테고리** 지원

  - 📏 길이: 미터, 킬로미터, 마일, 야드, 피트 등
  - ⚖️ 무게: 그램, 킬로그램, 파운드, 온스 등
  - 🌡️ 온도: 섭씨, 화씨, 켈빈
  - 📐 면적: 제곱미터, 평, 에이커, 헥타르 등
  - 🥤 부피: 리터, 밀리리터, 갤런 등
  - 🚗 속도: m/s, km/h, mph 등
  - 💾 데이터: 바이트, KB, MB, GB, TB 등

- **사용자 경험**

  - 🔄 실시간 변환 계산
  - ⭐ 즐겨찾기 저장 및 관리
  - 📋 클립보드 복사 기능
  - ⌨️ 키보드 단축키 지원
  - 🌙 다크모드/라이트모드 토글
  - 💾 localStorage를 통한 설정 저장

- **기술적 특징**
  - 📱 반응형 디자인 (모바일 우선)
  - 🔌 PWA 지원 (오프라인 작동)
  - ⚡ Vite 기반 빠른 개발 환경
  - 🧪 Jest를 통한 테스트 커버리지
  - 🎨 Tailwind CSS 스타일링

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/unit-converter.git
cd unit-converter

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 테스트 실행
npm test
```

## 🏗️ 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   └── UnitConverter/  # 메인 단위 변환기 컴포넌트
│       ├── index.tsx   # 메인 컴포넌트
│       ├── types.ts    # 타입 정의
│       └── utils.ts    # 변환 로직
├── hooks/              # 커스텀 React 훅
│   ├── useLocalStorage.ts  # localStorage 관리
│   ├── useClipboard.ts     # 클립보드 기능
│   └── useDarkMode.ts      # 다크모드 관리
├── pages/              # 페이지 컴포넌트
│   └── UnitConverterPage.tsx
├── utils/              # 공통 유틸리티
│   └── common.ts
├── App.tsx             # 최상위 컴포넌트
├── main.tsx            # 애플리케이션 진입점
└── index.css           # 전역 스타일
```

## ⌨️ 키보드 단축키

| 단축키                 | 기능                   |
| ---------------------- | ---------------------- |
| `Alt + 1`              | 길이 카테고리로 전환   |
| `Alt + 2`              | 무게 카테고리로 전환   |
| `Alt + 3`              | 온도 카테고리로 전환   |
| `Alt + 4`              | 면적 카테고리로 전환   |
| `Alt + 5`              | 부피 카테고리로 전환   |
| `Alt + 6`              | 속도 카테고리로 전환   |
| `Alt + 7`              | 데이터 카테고리로 전환 |
| `Alt + 0`              | From/To 단위 교환      |
| `Ctrl/Cmd + Shift + C` | 결과 복사              |
| `Ctrl/Cmd + Shift + S` | 즐겨찾기 추가          |
| `Ctrl/Cmd + Shift + R` | 현재 카테고리 초기화   |

## 🧪 테스트

프로젝트는 Jest와 React Testing Library를 사용하여 테스트를 작성합니다.

```bash
# 모든 테스트 실행
npm test

# 특정 테스트 파일 실행
npm test -- --testPathPattern=utils.test.ts

# 테스트 커버리지 확인
npm test -- --coverage
```

## 🛠️ 기술 스택

- **프론트엔드**: React 18, TypeScript
- **빌드 도구**: Vite 5
- **스타일링**: Tailwind CSS 3
- **라우팅**: React Router DOM 6
- **테스트**: Jest, React Testing Library
- **PWA**: Vite Plugin PWA
- **상태 관리**: React Hooks + localStorage

## 📱 PWA 기능

- 오프라인 작동 지원
- 홈 화면에 앱 설치 가능
- 자동 업데이트
- 서비스 워커를 통한 캐싱

## 🌐 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Netlify 배포

```bash
# 빌드
npm run build

# dist 폴더를 Netlify에 업로드
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/your-username/unit-converter](https://github.com/your-username/unit-converter)

## 🙏 감사의 말

- [React](https://reactjs.org/) - 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- [Vite](https://vitejs.dev/) - 빠른 프론트엔드 빌드 도구
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [Jest](https://jestjs.io/) - JavaScript 테스트 프레임워크
