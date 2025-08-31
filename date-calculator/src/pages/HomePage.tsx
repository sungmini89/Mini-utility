/**
 * @fileoverview 날짜 계산기 애플리케이션의 홈페이지
 * @description 사용자가 다양한 날짜 계산 기능에 접근할 수 있는 메인 페이지입니다.
 * @author Date Calculator Team
 * @version 1.0.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus, Minus, Clock } from "lucide-react";

/**
 * 홈페이지 컴포넌트
 * @description 날짜 계산기의 메인 페이지로, 각 기능별 페이지로의 네비게이션을 제공합니다.
 *
 * @component
 * @example
 * ```tsx
 * <HomePage />
 * ```
 *
 * @returns {JSX.Element} 홈페이지 UI
 */
const HomePage: React.FC = () => {
  /**
   * 기능 카드 데이터
   * @description 각 계산 기능의 정보를 담고 있는 배열
   */
  const features = [
    {
      title: "두 날짜 사이 일수 계산",
      description:
        "시작일과 종료일 사이의 일수를 계산합니다. 주말과 공휴일 제외 옵션을 지원합니다.",
      icon: <Calendar className="w-8 h-8" />,
      path: "/between-dates",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "날짜 더하기/빼기",
      description: "특정 날짜에 일수를 더하거나 빼서 결과 날짜를 계산합니다.",
      icon: <Plus className="w-8 h-8" />,
      path: "/add-subtract",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "D-Day 카운트다운",
      description: "목표 날짜까지 남은 시간을 실시간으로 카운트다운합니다.",
      icon: <Clock className="w-8 h-8" />,
      path: "/countdown",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            📅 날짜 계산기
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            한국 공휴일을 고려한 정확한 날짜 계산 도구
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
            주말 제외, 공휴일 제외 옵션으로 업무에 최적화된 날짜 계산을
            제공합니다
          </p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Link key={index} to={feature.path} className="group block">
              <div
                className={`${feature.color} rounded-2xl p-8 text-white transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* 추가 정보 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            주요 특징
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  한국 공휴일 자동 인식 및 제외 옵션
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  주말 제외 계산 옵션
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  실시간 D-Day 카운트다운
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  반응형 디자인으로 모바일 최적화
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  다크모드 지원
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">
                  PWA 지원으로 오프라인 사용 가능
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 키보드 단축키 안내 */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            💡 <strong>키보드 단축키:</strong> Ctrl/Cmd + D (다크모드), Ctrl/Cmd
            + K (홈)
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
