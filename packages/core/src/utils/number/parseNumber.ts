export function parseNumber(
  value: unknown,
  parser: (value: string) => number = Number.parseInt,
): number | null {
  const number = typeof value === "number" ? value : parser(String(value));

  if (Number.isNaN(number)) {
    return null;
  }

  return number;
}
