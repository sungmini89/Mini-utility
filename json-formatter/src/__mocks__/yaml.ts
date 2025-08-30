export const stringify = jest.fn((obj: any) => {
  return JSON.stringify(obj, null, 2).replace(/"/g, "").replace(/,/g, "");
});

export const parse = jest.fn((str: string) => {
  return JSON.parse(str);
});
