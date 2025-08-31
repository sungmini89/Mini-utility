# 📅 날짜 계산기 (Date Calculator)

한국 공휴일을 고려한 정확한 날짜 계산 웹 애플리케이션입니다.

## ✨ 주요 기능

### 🗓️ **두 날짜 사이 일수 계산**

- 시작일과 종료일 사이의 일수 계산
- 주말 제외 옵션
- 한국 공휴일 자동 제외 (2024-2026년)
- 시간 단위 차이 표시 (일/시간/분/초)

### ➕➖ **날짜 계산 (더하기/빼기)**

- 기준 날짜에 일수 더하기/빼기
- 주말 및 공휴일 제외 옵션
- 결과 날짜와 요일 표시

### ⏰ **D-Day 카운트다운**

- 실시간 카운트다운 (1초마다 업데이트)
- 주말/공휴일 제외 남은 일수 계산
- D-Day 저장 및 관리 (최대 20개)
- 라벨 설정으로 구분

## 🚀 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 6
- **PWA**: Vite PWA Plugin
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React

## 🎯 주요 특징

- 🌙 **다크모드 지원**
- 📱 **반응형 디자인** (모바일 우선)
- ⌨️ **키보드 단축키** 지원
- 💾 **localStorage** 자동 저장
- 📋 **클립보드 복사** 기능
- 🔔 **토스트 알림** 시스템
- 🚀 **PWA 지원** (오프라인 작동)
- 🇰🇷 **한국 공휴일** 자동 인식

## ⌨️ 키보드 단축키

| 단축키                 | 기능                         |
| ---------------------- | ---------------------------- |
| `Alt + 1`              | 날짜 차이 계산 페이지        |
| `Alt + 2`              | 날짜 계산 페이지             |
| `Alt + 3`              | D-Day 카운트다운 페이지      |
| `Alt + H`              | 홈페이지                     |
| `Ctrl/Cmd + Shift + C` | 결과 복사                    |
| `Ctrl/Cmd + Shift + S` | D-Day 저장 (카운트다운 모드) |
| `Ctrl/Cmd + Shift + R` | 모든 입력 초기화             |

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/date-calculator.git
cd date-calculator

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview

# 테스트 실행
npm test
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── DateCalculator/     # 기존 통합 컴포넌트
│   ├── ErrorBoundary.tsx   # 에러 핸들링
│   └── LoadingSpinner.tsx  # 로딩 상태
├── hooks/
│   ├── useDarkMode.ts      # 다크모드 관리
│   ├── useLocalStorage.ts  # localStorage 연동
│   └── useClipboard.ts     # 클립보드 기능
├── pages/
│   ├── HomePage.tsx        # 홈페이지
│   ├── BetweenDatesPage.tsx # 날짜 차이 계산
│   ├── AddSubtractPage.tsx # 날짜 계산
│   └── CountdownPage.tsx   # D-Day 카운트다운
├── utils/
│   ├── common.ts           # 범용 유틸리티
│   └── DateCalculator/     # 날짜 계산 유틸리티
├── App.tsx                 # 메인 앱 컴포넌트
└── main.tsx               # 앱 진입점
```

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
# Netlify CLI 설치
npm i -g netlify-cli

# 배포
netlify deploy --prod
```

### GitHub Actions

프로젝트에 포함된 `.github/workflows/deploy.yml`을 사용하여 자동 배포를 설정할 수 있습니다.

## 📱 PWA 기능

- **오프라인 작동**: 서비스 워커를 통한 캐싱
- **홈 화면 추가**: 모바일 기기에 앱처럼 설치
- **푸시 알림**: 향후 구현 예정
- **백그라운드 동기화**: 향후 구현 예정

## 🧪 테스트

```bash
# 단위 테스트 실행
npm test

# 테스트 커버리지 확인
npm test -- --coverage

# 테스트 감시 모드
npm test -- --watch
```

## 🔧 환경 변수

```bash
# .env.local 파일 생성
VITE_APP_TITLE=날짜 계산기
VITE_APP_DESCRIPTION=한국 공휴일을 고려한 정확한 날짜 계산 도구
```

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

- **이슈**: [GitHub Issues](https://github.com/your-username/date-calculator/issues)
- **이메일**: your-email@example.com

## 🙏 감사의 말

- [React](https://reactjs.org/) - 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- [Vite](https://vitejs.dev/) - 빠른 프론트엔드 빌드 도구
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 우선 CSS 프레임워크
- [Lucide](https://lucide.dev/) - 아름다운 오픈소스 아이콘

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
