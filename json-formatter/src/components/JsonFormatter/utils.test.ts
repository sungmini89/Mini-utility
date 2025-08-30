import {
  validateJSON,
  formatJSON,
  minifyJSON,
  jsonToYAML,
  jsonToCSV,
  applyJSONPath,
  positionToLineColumn,
} from "./utils";

describe("JsonFormatter Utils", () => {
  describe("validateJSON", () => {
    test("returns valid for correct JSON", () => {
      const result = validateJSON('{"name": "test", "value": 123}');
      expect(result.valid).toBe(true);
      expect(result.value).toEqual({ name: "test", value: 123 });
    });

    test("returns invalid for malformed JSON", () => {
      const result = validateJSON('{"name": "test", "value": 123,}');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test("returns invalid for empty input", () => {
      const result = validateJSON("");
      expect(result.valid).toBe(false);
      expect(result.error?.message).toBe("Input is empty");
    });

    test("returns invalid for whitespace only", () => {
      const result = validateJSON("   ");
      expect(result.valid).toBe(false);
      expect(result.error?.message).toBe("Input is empty");
    });
  });

  describe("formatJSON", () => {
    test("formats JSON with proper indentation", () => {
      const input = { name: "test", value: 123 };
      const result = formatJSON(input);
      expect(result).toBe('{\n  "name": "test",\n  "value": 123\n}');
    });

    test("throws error for circular references", () => {
      const obj: any = { name: "test" };
      obj.self = obj;
      expect(() => formatJSON(obj)).toThrow("Failed to format JSON");
    });
  });

  describe("minifyJSON", () => {
    test("removes all whitespace", () => {
      const input = { name: "test", value: 123 };
      const result = minifyJSON(input);
      expect(result).toBe('{"name":"test","value":123}');
    });
  });

  describe("jsonToYAML", () => {
    test("converts JSON to YAML", () => {
      const input = { name: "test", value: 123 };
      const result = jsonToYAML(input);
      expect(result).toContain("name: test");
      expect(result).toContain("value: 123");
    });
  });

  describe("jsonToCSV", () => {
    test("converts array of objects to CSV", () => {
      const input = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];
      const result = jsonToCSV(input);
      expect(result).toBe("name,age\nJohn,30\nJane,25");
    });

    test("returns error for non-array input", () => {
      const input = { name: "test" };
      const result = jsonToCSV(input);
      expect(typeof result).toBe("object");
      expect((result as any).message).toBe(
        "CSV conversion requires an array of objects"
      );
    });

    test("returns empty string for empty array", () => {
      const input: any[] = [];
      const result = jsonToCSV(input);
      expect(result).toBe("");
    });

    test("handles null and undefined values", () => {
      const input = [{ name: "John", age: 30, city: null, country: undefined }];
      const result = jsonToCSV(input);
      expect(result).toBe("name,age,city,country\nJohn,30,,");
    });
  });

  describe("applyJSONPath", () => {
    test("applies JSONPath query to object", () => {
      const input = {
        store: { book: [{ title: "Book 1" }, { title: "Book 2" }] },
      };
      const result = applyJSONPath(input, "$.store.book[*].title");
      expect(result).toEqual(["Book 1", "Book 2"]);
    });
  });

  describe("positionToLineColumn", () => {
    test("converts position to line and column", () => {
      const input = "line1\nline2\nline3";
      const result = positionToLineColumn(input, 8);
      expect(result).toEqual({ line: 2, column: 3 });
    });

    test("handles first line", () => {
      const input = "line1\nline2";
      const result = positionToLineColumn(input, 3);
      expect(result).toEqual({ line: 1, column: 4 });
    });

    test("handles out of bounds index", () => {
      const input = "line1";
      const result = positionToLineColumn(input, 10);
      expect(result).toEqual({ line: 1, column: 1 });
    });

    test("handles negative index", () => {
      const input = "line1";
      const result = positionToLineColumn(input, -1);
      expect(result).toEqual({ line: 1, column: 1 });
    });
  });
});
