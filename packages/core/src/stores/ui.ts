import { createScrollStateSignal } from "@core/utils/spred/createScrollStateSignal";
import { signal } from "@spred/core";

export const $scrollableContainer = signal<HTMLElement | null>(null);
export const $gridHorizontalScrollState = createScrollStateSignal($scrollableContainer, "x");
export const $gridVerticalScrollState = createScrollStateSignal($scrollableContainer, "y");

export const $gridHasHorizontalScrollbar = signal(
  (get) => get($gridHorizontalScrollState).hasScroll,
);
export const $gridHorizontallyScrolled = signal(
  (get) => get($gridHorizontalScrollState).scrollAt > 0,
);

export const $gridHasVerticalScrollbar = signal((get) => get($gridVerticalScrollState).hasScroll);
export const $gridVerticallyScrolled = signal((get) => get($gridVerticalScrollState).scrollAt > 0);

export const $isChangingBgBoundary = signal(false);

export function setScrollableContainer(container: HTMLElement | null) {
  $scrollableContainer.set(container);
}

export function startChangingBgBoundary() {
  $isChangingBgBoundary.set(true);
}

export function stopChangingBgBoundary() {
  $isChangingBgBoundary.set(false);
}
