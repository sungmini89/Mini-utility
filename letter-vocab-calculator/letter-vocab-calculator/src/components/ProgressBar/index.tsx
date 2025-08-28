import React from "react";

export interface ProgressBarProps {
  /** The label describing what this progress bar represents */
  label: string;
  /** The current value measured against the maximum */
  value: number;
  /** The maximum value of the progress bar */
  max: number;
}

/**
 * A horizontal progress bar that visualises how close a numeric value is to a
 * predefined maximum.  When the current value exceeds the maximum the bar
 * turns red to draw attention.  Otherwise it is rendered in blue.
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
          {Math.abs(max - value)} characters over limit
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
