import React from "react";

export interface ProgressBarProps {
  /** 이 진행률 바가 나타내는 것을 설명하는 라벨입니다 */
  label: string;
  /** 최대값에 대비한 현재 값입니다 */
  value: number;
  /** 진행률 바의 최대값입니다 */
  max: number;
}

/**
 * 숫자 값이 미리 정의된 최대값에 얼마나 가까운지를 시각화하는
 * 수평 진행률 바입니다. 현재 값이 최대값을 초과하면 바가
 * 주의를 끌기 위해 빨간색으로 변합니다. 그렇지 않으면 파란색으로 렌더링됩니다.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, max }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const isOverLimit = value > max;
  const isNearLimit = value > max * 0.8; // 80% 이상일 때 경고 색상

  const getBarColor = () => {
    if (isOverLimit) return "bg-red-500";
    if (isNearLimit) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="mb-3" aria-label={`${label} progress`}>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium">{label}</span>
        <span
          className={`font-mono ${
            isOverLimit ? "text-red-600 dark:text-red-400" : ""
          }`}
        >
          {value}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${value} out of ${max}`}
        />
      </div>
      {isOverLimit && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          제한 초과 {Math.abs(max - value)} 글자
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
