import { effect, signal } from "@spred/core";

import { toSignal } from "./toSignal";
import type { InitialSignalValue, SignalOrValue } from "./types";

type ResizeObserverSignalOptions<E extends HTMLElement, Mapped> = {
  element: InitialSignalValue<SignalOrValue<E | null>>;
  initialValue: InitialSignalValue<Mapped>;
  mapper: (entry: ResizeObserverEntry) => Mapped;
  observerOptions?: InitialSignalValue<SignalOrValue<ResizeObserverOptions>>;
};

export function createResizeObserverSignal<E extends HTMLElement, Mapped>({
  element,
  initialValue,
  mapper,
  observerOptions = {},
}: ResizeObserverSignalOptions<E, Mapped>) {
  const $result = signal(initialValue, {
    onActivate,
  });
  const $element = toSignal(element);
  const $observerOptions = toSignal(observerOptions);

  function onActivate() {
    return effect((get) => {
      const element = get($element);
      const observerOptions = get($observerOptions);
      if (!element) {
        return;
      }

      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];

        if (entry) {
          $result.set(mapper(entry));
        }
      });
      resizeObserver.observe(element, observerOptions);

      return () => resizeObserver.disconnect();
    });
  }

  return $result;
}
