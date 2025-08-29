import React from "react";
import CaseConverter from "../components/CaseConverter";

/**
 * CaseConverter 컴포넌트를 위한 간단한 래퍼 페이지입니다.
 *
 * 페이지를 컴포넌트와 분리하여 유지하는 것은
 * 라우트 기반 코드 분할과 여러 유틸리티가 있을 때의
 * 조직화에 도움이 됩니다.
 *
 * @returns JSX.Element - CaseConverter 컴포넌트를 감싸는 페이지
 */
const CaseConverterPage: React.FC = () => {
  return (
    <div translate="no">
      <CaseConverter />
    </div>
  );
};

export default CaseConverterPage;
