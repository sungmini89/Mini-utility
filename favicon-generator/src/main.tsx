import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

/**
 * @fileoverview Favicon Generator 애플리케이션의 메인 진입점
 *
 * 이 파일은 React 애플리케이션을 초기화하고 DOM에 마운트하는 역할을 합니다.
 * BrowserRouter로 라우팅을 설정하고, React.StrictMode로 개발 중 잠재적 문제를
 * 강조 표시합니다.
 *
 * @author Favicon Generator Team
 * @version 1.0.0
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
