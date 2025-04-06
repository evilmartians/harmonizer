type DirectionState = {
  size: number;
  scrollSize: number;
  scrollAt: number;
};
type DirectionGetter = (el: HTMLElement) => DirectionState;

type Target = "window" | "element";

function getWindowScrollYInfo() {
  return {
    size: window.innerHeight,
    scrollSize: window.scrollY,
    scrollAt: window.scrollY,
  };
}

function getWindowScrollXInfo() {
  return {
    size: window.innerWidth,
    scrollSize: window.scrollX,
    scrollAt: window.scrollX,
  };
}

function getElementScrollYInfo(el: HTMLElement) {
  return {
    size: el.clientHeight,
    scrollSize: el.scrollHeight,
    scrollAt: el.scrollTop,
  };
}

function getElementScrollXInfo(el: HTMLElement) {
  return {
    size: el.clientWidth,
    scrollSize: el.scrollWidth,
    scrollAt: el.scrollLeft,
  };
}

const DIMENSION_GETTERS: Record<ScrollType, Record<Target, DirectionGetter>> = {
  x: {
    window: getWindowScrollXInfo,
    element: getElementScrollXInfo,
  },
  y: {
    window: getWindowScrollYInfo,
    element: getElementScrollYInfo,
  },
};

// There is possibility that items in the scroll container have fractional width (like 84.5px)
// It leads to wrong results in scroll calculations. That's why we need this 1px threshold
export type ScrollType = "x" | "y";
export type ScrollState = {
  hasScroll: boolean;
  scrollAt: number;
  isAtTheStart: boolean;
  isAtTheEnd: boolean;
};

export const SCROLL_COMPARISON_THRESHOLD = 1;

export function getScrollState(node: HTMLElement, type: ScrollType): ScrollState {
  const target: Target = node === document.documentElement ? "window" : "element";
  const getters = DIMENSION_GETTERS[type][target];
  const { size, scrollSize, scrollAt } = getters(node);
  const hasScroll = scrollSize > size;

  return {
    hasScroll,
    scrollAt,
    isAtTheStart: hasScroll && scrollAt <= SCROLL_COMPARISON_THRESHOLD,
    isAtTheEnd: hasScroll && scrollAt + size + SCROLL_COMPARISON_THRESHOLD >= scrollSize,
  };
}
