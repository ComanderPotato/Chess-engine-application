import { expect } from "vitest";
export function assertModel<T>(
  result: T,
  expected: Partial<T>,
  keys: (keyof T)[],
) {
  // keys = keys.length === 0 ? (Object.keys(expected) as (keyof T)[]) : keys;
  for (const key of keys) {
    expect(result[key]).toStrictEqual(expected[key]);
  }
}

export function assertExists<T>(
  value: T | undefined | null,
): asserts value is T {
  expect(value).not.toBeNull();
}
