import { convertValue, getUnitsForCategory } from "./utils";
import type { Category } from "./types";

describe("Unit Converter Utils", () => {
  describe("convertValue", () => {
    describe("length conversions", () => {
      test("converts meters to kilometers", () => {
        expect(convertValue("length", "m", "km", 1000)).toBe(1);
      });

      test("converts kilometers to meters", () => {
        expect(convertValue("length", "km", "m", 1)).toBe(1000);
      });

      test("converts meters to centimeters", () => {
        expect(convertValue("length", "m", "cm", 1)).toBe(100);
      });

      test("converts miles to meters", () => {
        expect(convertValue("length", "mi", "m", 1)).toBeCloseTo(1609.344);
      });
    });

    describe("weight conversions", () => {
      test("converts kilograms to grams", () => {
        expect(convertValue("weight", "kg", "g", 2)).toBe(2000);
      });

      test("converts grams to kilograms", () => {
        expect(convertValue("weight", "g", "kg", 2000)).toBe(2);
      });

      test("converts pounds to grams", () => {
        expect(convertValue("weight", "lb", "g", 1)).toBeCloseTo(453.59237);
      });
    });

    describe("temperature conversions", () => {
      test("converts Celsius to Fahrenheit", () => {
        expect(convertValue("temperature", "C", "F", 100)).toBe(212);
      });

      test("converts Fahrenheit to Celsius", () => {
        expect(convertValue("temperature", "F", "C", 212)).toBe(100);
      });

      test("converts Celsius to Kelvin", () => {
        expect(convertValue("temperature", "C", "K", 0)).toBe(273.15);
      });

      test("converts Kelvin to Celsius", () => {
        expect(convertValue("temperature", "K", "C", 273.15)).toBe(0);
      });
    });

    describe("area conversions", () => {
      test("converts square meters to square kilometers", () => {
        expect(convertValue("area", "m2", "km2", 1000000)).toBe(1);
      });

      test("converts square meters to pyeong", () => {
        expect(convertValue("area", "m2", "pyeong", 3.3058)).toBeCloseTo(1);
      });
    });

    describe("volume conversions", () => {
      test("converts liters to milliliters", () => {
        expect(convertValue("volume", "L", "mL", 1)).toBe(1000);
      });

      test("converts gallons to liters", () => {
        expect(convertValue("volume", "gal", "L", 1)).toBeCloseTo(3.78541);
      });
    });

    describe("speed conversions", () => {
      test("converts kilometers per hour to meters per second", () => {
        expect(convertValue("speed", "kmh", "mps", 36)).toBeCloseTo(10);
      });

      test("converts miles per hour to meters per second", () => {
        expect(convertValue("speed", "mph", "mps", 22.3694)).toBeCloseTo(10);
      });
    });

    describe("data conversions", () => {
      test("converts megabytes to bytes", () => {
        expect(convertValue("data", "MB", "B", 1)).toBe(1024 * 1024);
      });

      test("converts gigabytes to megabytes", () => {
        expect(convertValue("data", "GB", "MB", 1)).toBe(1024);
      });

      test("converts bits to bytes", () => {
        expect(convertValue("data", "bit", "B", 8)).toBe(1);
      });
    });

    describe("error handling", () => {
      test("returns NaN for invalid units", () => {
        expect(convertValue("length", "invalid", "m", 1)).toBeNaN();
      });

      test("returns NaN for non-finite values", () => {
        expect(convertValue("length", "m", "km", Infinity)).toBeNaN();
        expect(convertValue("length", "m", "km", NaN)).toBeNaN();
      });
    });
  });

  describe("getUnitsForCategory", () => {
    test("returns length units for length category", () => {
      const units = getUnitsForCategory("length");
      expect(units.length).toBeGreaterThan(0);
      expect(units.some((u) => u.value === "m")).toBe(true);
      expect(units.some((u) => u.value === "km")).toBe(true);
    });

    test("returns weight units for weight category", () => {
      const units = getUnitsForCategory("weight");
      expect(units.length).toBeGreaterThan(0);
      expect(units.some((u) => u.value === "kg")).toBe(true);
      expect(units.some((u) => u.value === "g")).toBe(true);
    });

    test("returns temperature units for temperature category", () => {
      const units = getUnitsForCategory("temperature");
      expect(units.length).toBeGreaterThan(0);
      expect(units.some((u) => u.value === "C")).toBe(true);
      expect(units.some((u) => u.value === "F")).toBe(true);
      expect(units.some((u) => u.value === "K")).toBe(true);
    });

    test("returns empty array for invalid category", () => {
      const units = getUnitsForCategory("invalid" as Category);
      expect(units).toEqual([]);
    });
  });
});
