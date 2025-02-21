export function getMiddleValue<T extends number>(value1: T, value2: T): T {
  return <T>((value1 + value2) / 2);
}
