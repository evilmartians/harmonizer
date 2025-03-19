import { effect, type Signal, signal } from "@spred/core";
import { shallowEqual } from "fast-equals";
import debounce from "lodash-es/debounce";

import { getScrollState, type ScrollState, type ScrollType } from "../dom/getScrollState";

import { createResizeObserverSignal } from "./createResizeObserverSignal";
import { toSignal } from "./toSignal";
import type { InitialSignalValue, SignalOrValue } from "./types";

const DEFAULT_SCROLL_STATE = {
  hasScroll: false,
  scrollAt: 0,
  isAtTheStart: true,
  isAtTheEnd: false,
};

export function createScrollStateSignal<E extends HTMLElement>(
  element: InitialSignalValue<SignalOrValue<E | null>>,
  type: ScrollType,
): Signal<ScrollState> {
  const $element = toSignal(element);
  const $scrollState = signal<ScrollState>(
    $element.value ? getScrollState($element.value, type) : DEFAULT_SCROLL_STATE,
    {
      equal: shallowEqual,
      onActivate,
    },
  );
  const $resizeObserver = createResizeObserverSignal({
    element,
    initialValue: $element.value?.[type === "x" ? "offsetWidth" : "offsetHeight"] ?? 0,
    mapper: (entry) => entry.contentRect[type === "x" ? "width" : "height"],
  });

  function onActivate() {
    return effect((get) => {
      const element = get($element);

      if (!element) {
        return;
      }

      const recalculateState = () => $scrollState.set(getScrollState(element, type));
      const debouncedRecalculateState = debounce(recalculateState, 33, {
        leading: true,
        maxWait: 100,
      });
      const scrollEventTarget = element === document.documentElement ? globalThis : element;

      scrollEventTarget.addEventListener("scroll", debouncedRecalculateState, {
        capture: true,
        passive: true,
      });

      get($resizeObserver); // Activate the resize observer
      recalculateState();

      return () =>
        scrollEventTarget.removeEventListener("scroll", debouncedRecalculateState, {
          capture: true,
        });
    });
  }

  return $scrollState;
}
