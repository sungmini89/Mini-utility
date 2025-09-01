import React from "react";
import { Link } from "react-router-dom";

/**
 * @fileoverview 웹 개발 유틸리티 컬렉션의 홈페이지 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션의 랜딩 페이지 역할을 하며, 사용 가능한
 * 도구들을 소개하고 네비게이션을 제공합니다. 현재는 Favicon Generator만
 * 포함되어 있지만, 향후 더 많은 도구들이 추가될 수 있습니다.
 *
 * @component HomePage
 * @description 메인 홈페이지 컴포넌트
 * @author Favicon Generator Team
 * @version 1.0.0
 */
const HomePage: React.FC = () => {
  const utilities = [
    {
      name: "Favicon Generator",
      description:
        "Create multi-size favicons from images, text, or emojis with custom colors and transparency.",
      path: "/favicon-generator",
      features: [
        "Image upload",
        "Text/Emoji input",
        "Multiple sizes",
        "ZIP download",
        "HTML code generation",
      ],
      icon: "🎨",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Web Development Utilities
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          A collection of useful tools for web developers
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        {utilities.map((utility) => (
          <div
            key={utility.path}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{utility.icon}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {utility.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {utility.description}
                </p>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {utility.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  to={utility.path}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Open Tool
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Keyboard Shortcuts
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <kbd className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
              Alt + G
            </kbd>
            <span className="ml-2">Generate icons</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <kbd className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
              Ctrl + Shift + C
            </kbd>
            <span className="ml-2">Copy HTML</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <kbd className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
              Ctrl + Shift + Z
            </kbd>
            <span className="ml-2">Download ZIP</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <kbd className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
              Ctrl + Shift + S
            </kbd>
            <span className="ml-2">Save to history</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
