import { signal } from "@spred/core";

import { createScrollStateSignal } from "@/utils/spred/createScrollStateSignal";

export const $hoveredColumn = signal<null | number>(null);

export function setHoveredColumn(index: number | null) {
  $hoveredColumn.set(index);
}

export function resetHoveredColumn() {
  $hoveredColumn.set(null);
}

export const $scrollableContainer = signal<HTMLElement | null>(null);
export const $gridHorizontalScrollState = createScrollStateSignal($scrollableContainer, "x");
export const $gridVerticalScrollState = createScrollStateSignal($scrollableContainer, "y");
export const $gridHorizontallyScrolled = signal(
  (get) => get($gridHorizontalScrollState).scrollAt > 0,
);

export const $gridVerticallyScrolled = signal((get) => get($gridVerticalScrollState).scrollAt > 0);

export function setScrollableContainer(container: HTMLElement | null) {
  $scrollableContainer.set(container);
}
