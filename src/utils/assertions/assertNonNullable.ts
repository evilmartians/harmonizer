export function assertNonNullable<V>(
  value: V | null | undefined,
  message: string,
): asserts value is NonNullable<V> {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}
