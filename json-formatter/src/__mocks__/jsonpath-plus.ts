export const JSONPath = jest.fn(
  ({ path, json }: { path: string; json: any }) => {
    // Simple mock implementation for testing
    if (path === "$.store.book[*].title") {
      return ["Book 1", "Book 2"];
    }
    if (path === "$.name") {
      return json.name;
    }
    return json;
  }
);
