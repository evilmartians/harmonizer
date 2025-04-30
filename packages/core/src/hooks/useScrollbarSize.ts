import { getScrollbarSize } from "@core/utils/dom/getScrollbarWidth";

let cachedScrollbarSize: number | null = null;
export function getCachedScrollbarSize() {
  if (cachedScrollbarSize === null) {
    cachedScrollbarSize = getScrollbarSize();
  }
  return cachedScrollbarSize;
}

export function useScrollbarSize() {
  return getCachedScrollbarSize();
}
