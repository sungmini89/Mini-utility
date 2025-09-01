import React from "react";
import FaviconGenerator from "../components/FaviconGenerator";

/**
 * @fileoverview Favicon Generator 페이지 컴포넌트
 *
 * 이 컴포넌트는 FaviconGenerator 유틸리티를 렌더링하는 페이지 컴포넌트입니다.
 * 라우팅과 컴포넌트를 분리하여 향후 추가 페이지나 라우트를 쉽게 추가할 수
 * 있도록 설계되었습니다.
 *
 * @component FaviconGeneratorPage
 * @description Favicon Generator 페이지 컴포넌트
 * @author Favicon Generator Team
 * @version 1.0.0
 */
const FaviconGeneratorPage: React.FC = () => {
  return <FaviconGenerator />;
};

export default FaviconGeneratorPage;
