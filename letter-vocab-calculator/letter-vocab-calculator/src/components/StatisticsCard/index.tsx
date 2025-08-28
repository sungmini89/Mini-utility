import React from "react";

export interface StatisticsCardProps {
  /**
   * A descriptive label for the statistic.  This will appear above the value
   * in a smaller, less prominent font.
   */
  label: string;
  /**
   * The value to display.  Accepts any renderable content so that callers
   * can supply numbers or formatted strings.
   */
  value: React.ReactNode;
}

/**
 * A simple card component used to display a statistic label and value.  It
 * applies appropriate padding, dark mode styles and a subtle shadow.
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
