import React from "react";
import ReactDOM from "react-dom/client";
import router from "./router"; // 새로운 라우터 설정 사용
import { RouterProvider } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
