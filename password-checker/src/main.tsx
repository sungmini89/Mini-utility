import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

/**
 * 애플리케이션의 진입점
 *
 * React 애플리케이션을 DOM에 마운트하고 필요한 프로바이더들을 설정합니다.
 * - React.StrictMode: 개발 모드에서 추가적인 검사 수행
 * - BrowserRouter: 클라이언트 사이드 라우팅 제공
 *
 * @example
 * ```typescript
 * // 이 파일은 일반적으로 직접 호출하지 않고, 빌드 도구가 자동으로 실행합니다.
 * ```
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </StrictMode>
);
