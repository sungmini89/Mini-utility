import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import DiffChecker from ".";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("DiffChecker", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset localStorage mock to return undefined (no stored values)
    localStorageMock.getItem.mockReturnValue(null);
  });

  test("computes diff and displays statistics", () => {
    render(<DiffChecker />);
    const leftArea = screen.getByLabelText("Left text") as HTMLTextAreaElement;
    const rightArea = screen.getByLabelText(
      "Right text"
    ) as HTMLTextAreaElement;
    fireEvent.change(leftArea, { target: { value: "line1\nline2" } });
    fireEvent.change(rightArea, { target: { value: "line1\nline3" } });
    // Statistics should show one deletion and one addition
    expect(screen.getByText(/추가: 1, 삭제: 1, 수정: 0/)).toBeInTheDocument();
  });

  test("handles empty text comparison", () => {
    render(<DiffChecker />);
    expect(screen.getByText(/추가: 0, 삭제: 0, 수정: 0/)).toBeInTheDocument();
  });

  test("handles identical text", () => {
    render(<DiffChecker />);
    const leftArea = screen.getByLabelText("Left text") as HTMLTextAreaElement;
    const rightArea = screen.getByLabelText(
      "Right text"
    ) as HTMLTextAreaElement;
    const sameText = "identical\ntext\nhere";
    fireEvent.change(leftArea, { target: { value: sameText } });
    fireEvent.change(rightArea, { target: { value: sameText } });
    expect(screen.getByText(/추가: 0, 삭제: 0, 수정: 0/)).toBeInTheDocument();
  });
});
