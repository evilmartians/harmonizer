export function isRtl() {
  return globalThis.getComputedStyle(document.documentElement).direction === "rtl";
}
