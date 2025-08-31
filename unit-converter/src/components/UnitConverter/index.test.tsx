import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import UnitConverter from ".";

describe("UnitConverter", () => {
  test("renders all category tabs", () => {
    render(<UnitConverter />);

    expect(screen.getByText("길이")).toBeInTheDocument();
    expect(screen.getByText("무게")).toBeInTheDocument();
    expect(screen.getByText("온도")).toBeInTheDocument();
    expect(screen.getByText("면적")).toBeInTheDocument();
    expect(screen.getByText("부피")).toBeInTheDocument();
    expect(screen.getByText("속도")).toBeInTheDocument();
    expect(screen.getByText("데이터")).toBeInTheDocument();
  });

  test("renders input and output fields", () => {
    render(<UnitConverter />);

    expect(
      screen.getByPlaceholderText("숫자를 입력하세요")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("변환 결과가 여기에 표시됩니다")
    ).toBeInTheDocument();
  });

  test("renders unit selection dropdowns", () => {
    render(<UnitConverter />);

    // Check if select elements exist
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThan(0);
  });

  test("renders action buttons", () => {
    render(<UnitConverter />);

    expect(screen.getByText("복사")).toBeInTheDocument();
    expect(screen.getByText("즐겨찾기 추가")).toBeInTheDocument();
    expect(screen.getByText("초기화")).toBeInTheDocument();
  });

  test("renders swap button", () => {
    render(<UnitConverter />);

    expect(screen.getByText("↔")).toBeInTheDocument();
  });

  test("has proper labels", () => {
    render(<UnitConverter />);

    expect(screen.getByText("값")).toBeInTheDocument();
    expect(screen.getByText("From")).toBeInTheDocument();
    expect(screen.getByText("To")).toBeInTheDocument();
    expect(screen.getByText("결과")).toBeInTheDocument();
  });

  test("displays length units in dropdowns", () => {
    render(<UnitConverter />);

    // Check if length units are present in the dropdowns
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThan(0);

    // Verify that the first select has length units
    const firstSelect = selects[0];
    expect(firstSelect).toHaveValue("m");
  });
});
