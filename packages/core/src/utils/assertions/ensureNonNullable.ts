import { assertNonNullable } from "./assertNonNullable";

export function ensureNonNullable<V>(value: V | null | undefined, message: string) {
  assertNonNullable(value, message);

  return value;
}
