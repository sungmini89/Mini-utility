import React from "react";
import PasswordChecker from "../components/PasswordChecker";

/**
 * 비밀번호 강도 검사 페이지 컴포넌트
 *
 * 비밀번호 강도 검사 기능을 제공하는 메인 페이지입니다.
 * PasswordChecker 컴포넌트를 렌더링하여 사용자가 비밀번호를
 * 입력하고 강도를 평가할 수 있도록 합니다.
 *
 * @returns {JSX.Element} 비밀번호 강도 검사 페이지 UI
 *
 * @example
 * ```tsx
 * <PasswordCheckerPage />
 * ```
 */
const PasswordCheckerPage: React.FC = () => {
  return <PasswordChecker />;
};

export default PasswordCheckerPage;
