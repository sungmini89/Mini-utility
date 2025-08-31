import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import BetweenDatesPage from "./BetweenDatesPage";

// Test wrapper with router context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("BetweenDatesPage", () => {
  test("calculates difference between two dates", async () => {
    render(
      <TestWrapper>
        <BetweenDatesPage />
      </TestWrapper>
    );

    const startInput = screen.getByLabelText("시작 날짜") as HTMLInputElement;
    const endInput = screen.getByLabelText("종료 날짜") as HTMLInputElement;

    fireEvent.change(startInput, { target: { value: "2023-01-01" } });
    fireEvent.change(endInput, { target: { value: "2023-01-11" } });

    // Wait for the calculation to complete and result to be displayed
    await waitFor(() => {
      expect(screen.getByText(/계산 결과/)).toBeInTheDocument();
    });

    // Check that the result contains the expected number
    const resultElement = screen.getByText(/전체 일수:/);
    expect(resultElement).toBeInTheDocument();

    // Check that the calculation result is displayed (use getAllByText and check first one)
    const daysElements = screen.getAllByText("10일");
    expect(daysElements.length).toBeGreaterThan(0);
    expect(daysElements[0]).toBeInTheDocument();
  });

  test("handles weekend exclusion", () => {
    render(
      <TestWrapper>
        <BetweenDatesPage />
      </TestWrapper>
    );

    const startInput = screen.getByLabelText("시작 날짜") as HTMLInputElement;
    const endInput = screen.getByLabelText("종료 날짜") as HTMLInputElement;
    const weekendCheckbox = screen.getByLabelText(
      "주말 제외"
    ) as HTMLInputElement;

    fireEvent.change(startInput, { target: { value: "2023-01-01" } });
    fireEvent.change(endInput, { target: { value: "2023-01-11" } });
    fireEvent.click(weekendCheckbox);

    expect(weekendCheckbox).toBeChecked();
  });

  test("handles holiday exclusion", () => {
    render(
      <TestWrapper>
        <BetweenDatesPage />
      </TestWrapper>
    );

    const startInput = screen.getByLabelText("시작 날짜") as HTMLInputElement;
    const endInput = screen.getByLabelText("종료 날짜") as HTMLInputElement;
    const holidayCheckbox = screen.getByLabelText(
      "공휴일 제외"
    ) as HTMLInputElement;

    fireEvent.change(startInput, { target: { value: "2023-01-01" } });
    fireEvent.change(endInput, { target: { value: "2023-01-11" } });
    fireEvent.click(holidayCheckbox);

    expect(holidayCheckbox).toBeChecked();
  });
});
