import React, { Component, ErrorInfo, ReactNode } from "react";

/**
 * 에러 경계 컴포넌트의 Props 인터페이스
 */
interface Props {
  /** 에러 경계 내부에 렌더링될 자식 컴포넌트들 */
  children: ReactNode;
}

/**
 * 에러 경계 컴포넌트의 상태 인터페이스
 */
interface State {
  /** 에러 발생 여부 */
  hasError: boolean;
  /** 발생한 에러 객체 */
  error?: Error;
}

/**
 * React 에러 경계 컴포넌트
 *
 * 자식 컴포넌트에서 발생하는 JavaScript 에러를 포착하고,
 * 에러 UI를 표시하여 애플리케이션이 완전히 중단되는 것을 방지합니다.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <SomeComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * 자식 컴포넌트에서 에러가 발생했을 때 호출되는 정적 메서드
   *
   * @param error - 발생한 에러 객체
   * @returns 새로운 상태 객체
   */
  static getDerivedStateFromError(error: Error): State {
    // 에러가 발생했음을 상태에 반영
    return { hasError: true, error };
  }

  /**
   * 에러가 발생했을 때 호출되는 생명주기 메서드
   *
   * @param error - 발생한 에러 객체
   * @param errorInfo - 에러 정보 (스택 트레이스 등)
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅 (실제 프로덕션에서는 에러 리포팅 서비스로 전송)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  /**
   * 에러 UI를 렌더링합니다.
   *
   * @returns 에러 발생 시 표시될 UI
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              문제가 발생했습니다
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              애플리케이션에서 예상치 못한 오류가 발생했습니다. 페이지를
              새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              페이지 새로고침
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                  개발자 정보 (클릭하여 확장)
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
