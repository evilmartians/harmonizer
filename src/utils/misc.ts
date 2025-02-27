export function getMiddleValue<T extends number>(value1: T, value2: T): T {
  return ((value1 + value2) / 2) as T;
}
