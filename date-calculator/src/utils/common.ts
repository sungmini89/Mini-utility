/**
 * Pick a random element from an array. Returns undefined if the array is empty.
 * Provided for completeness; not currently used.
 */
export function randomChoice<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Generate a list of values by cycling through a provided array. Used in
 * other projects; not used here but included for utility.
 */
export function cycleArray<T>(arr: T[], count: number): T[] {
  const result: T[] = [];
  let i = 0;
  while (result.length < count) {
    result.push(arr[i % arr.length]);
    i++;
  }
  return result;
}