import React from "react";
import UnitConverter from "../components/UnitConverter";

/**
 * 단위 변환기 페이지 컴포넌트
 *
 * 이 컴포넌트는 단위 변환기를 직접 렌더링하는 페이지 래퍼입니다.
 * 현재는 단일 컴포넌트만 렌더링하지만, 향후 확장을 위해 별도 파일로 분리되어 있습니다.
 *
 * 주요 목적:
 * - 단위 변환기 컴포넌트의 페이지 레벨 래핑
 * - 향후 추가 레이아웃이나 기능 확장을 위한 구조 제공
 * - SEO 및 메타데이터 관리 (필요시)
 *
 * @example
 * ```tsx
 * <UnitConverterPage />
 * ```
 *
 * @returns {JSX.Element} 단위 변환기 페이지 컴포넌트
 */
const UnitConverterPage: React.FC = () => {
  return <UnitConverter />;
};

export default UnitConverterPage;
