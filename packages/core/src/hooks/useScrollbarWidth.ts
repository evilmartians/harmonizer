import { getScrollbarWidth } from "@core/utils/dom/getScrollbarWidth";

let cachedScrollbarWidth: number | null = null;
export function getCachedScrollbarWidth() {
  if (cachedScrollbarWidth === null) {
    cachedScrollbarWidth = getScrollbarWidth();
  }
  return cachedScrollbarWidth;
}

export function useScrollbarWidth() {
  return getCachedScrollbarWidth();
}
