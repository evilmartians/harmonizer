export function urlSafeBtoa(data: string): string {
  return btoa(data).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}
