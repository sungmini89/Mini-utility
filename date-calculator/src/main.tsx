/**
 * @fileoverview 날짜 계산기 애플리케이션의 메인 진입점
 * @description React 애플리케이션을 DOM에 마운트하고 라우터를 설정합니다.
 * @author Date Calculator Team
 * @version 1.0.0
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

/**
 * React 애플리케이션을 DOM에 마운트
 * @description React 18의 createRoot API를 사용하여 애플리케이션을 렌더링합니다.
 * React Router v7 호환성을 위한 future flag를 설정합니다.
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
