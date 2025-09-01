import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

/**
 * zxcvbn 라이브러리를 모킹합니다.
 * 
 * 테스트 환경에서 실제 zxcvbn 라이브러리 대신 사용되는 모의 객체입니다.
 * 일관된 테스트 결과를 위해 고정된 값을 반환합니다.
 */
jest.mock("zxcvbn", () => {
  return jest.fn().mockReturnValue({
    score: 2,
    feedback: {
      warning: null,
      suggestions: ["Good password"],
    },
    crack_times_display: {
      offline_slow_hashing_1e4_per_second: "centuries",
      offline_fast_hashing_1e10_per_second: "centuries",
    },
  });
});

import PasswordChecker from ".";

/**
 * PasswordChecker 컴포넌트 테스트 스위트
 * 
 * 비밀번호 강도 검사 컴포넌트의 주요 기능들을 테스트합니다.
 * - 렌더링 테스트
 * - 사용자 인터페이스 요소 확인
 * - 상호작용 기능 검증
 */
describe("PasswordChecker", () => {
  /**
   * 각 테스트 전에 실행되는 설정 함수
   * 
   * 테스트 간 격리를 위해 localStorage를 초기화합니다.
   */
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  /**
   * 비밀번호 입력 필드가 올바르게 렌더링되는지 테스트합니다.
   */
  test("renders password input field", () => {
    render(<PasswordChecker />);
    const input = screen.getByLabelText(/비밀번호 입력/i);
    expect(input).toBeInTheDocument();
  });

  /**
   * 모든 버튼들이 올바르게 렌더링되는지 테스트합니다.
   */
  test("renders all buttons", () => {
    render(<PasswordChecker />);
    expect(screen.getByRole("button", { name: /복사/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /저장/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /지우기/i })).toBeInTheDocument();
  });

  /**
   * 체크리스트 항목들이 올바르게 렌더링되는지 테스트합니다.
   */
  test("renders checklist items", () => {
    render(<PasswordChecker />);
    expect(screen.getByText("최소 8자 이상")).toBeInTheDocument();
    expect(screen.getByText("대문자와 소문자 포함")).toBeInTheDocument();
    expect(screen.getByText("숫자 포함")).toBeInTheDocument();
    expect(screen.getByText("특수문자 포함")).toBeInTheDocument();
    expect(screen.getByText("일반적인 패턴이 아님")).toBeInTheDocument();
  });

  /**
   * 히스토리 섹션이 올바르게 렌더링되는지 테스트합니다.
   */
  test("renders history section", () => {
    render(<PasswordChecker />);
    expect(screen.getByText("히스토리")).toBeInTheDocument();
    expect(
      screen.getByText("아직 히스토리가 없습니다. 비밀번호를 저장하면 여기에 표시됩니다.")
    ).toBeInTheDocument();
  });
});