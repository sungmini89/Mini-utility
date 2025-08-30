import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import QrGeneratorPage from "./pages/QrGeneratorPage";

// React Router v6.30+에서 지원하는 Future Flags 설정
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <QrGeneratorPage />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    } as any, // 타입 단언으로 TypeScript 오류 해결
  }
);

export default router;
