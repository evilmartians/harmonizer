export function urlSafeAtob(urlSafeB64: string): string {
  const b64 = urlSafeB64
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(urlSafeB64.length / 4) * 4, "=");

  return atob(b64);
}
