import React from "react";

export interface StatisticsCardProps {
  /**
   * 통계에 대한 설명 라벨입니다. 값 위에 더 작고 덜 두드러지는 폰트로 표시됩니다.
   */
  label: string;
  /**
   * 표시할 값입니다. 호출자가 숫자나 포맷된 문자열을 제공할 수 있도록
   * 렌더링 가능한 모든 콘텐츠를 받습니다.
   */
  value: React.ReactNode;
}

/**
 * 통계 라벨과 값을 표시하는 간단한 카드 컴포넌트입니다.
 * 적절한 패딩, 다크모드 스타일, 미묘한 그림자를 적용합니다.
 */
const StatisticsCard: React.FC<StatisticsCardProps> = ({ label, value }) => {
  return (
    <div
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col hover:shadow-md transition-shadow"
      aria-label={label}
    >
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </span>
      <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-mono">
        {value}
      </span>
    </div>
  );
};

export default StatisticsCard;
