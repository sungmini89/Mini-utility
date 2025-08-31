import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

/**
 * 단위 변환기 애플리케이션의 진입점
 *
 * 이 파일은 React 애플리케이션을 초기화하고 DOM에 마운트합니다.
 * React Router를 설정하여 클라이언트 사이드 라우팅을 활성화합니다.
 *
 * 주요 설정:
 * - React 18의 createRoot API 사용
 * - Strict Mode 활성화 (개발 시 잠재적 문제 감지)
 * - BrowserRouter로 라우팅 설정
 * - 전역 CSS 스타일 적용
 *
 * @example
 * ```bash
 * # 개발 서버 실행
 * npm run dev
 *
 * # 프로덕션 빌드
 * npm run build
 * ```
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
