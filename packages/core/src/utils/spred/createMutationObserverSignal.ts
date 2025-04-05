import { effect, signal } from "@spred/core";

import { toSignal } from "./toSignal";
import type { InitialSignalValue, SignalOrValue } from "./types";

type MutationObserverSignalOptions<E extends Node, Mapped> = {
  element: InitialSignalValue<SignalOrValue<E | null>>;
  initialValue: InitialSignalValue<Mapped>;
  mapper: (mutations: MutationRecord[], prevState: Mapped) => Mapped;
  observerOptions?: InitialSignalValue<SignalOrValue<MutationObserverInit>>;
};

export function createMutationObserverSignal<E extends Node, Mapped>({
  element,
  initialValue,
  mapper,
  observerOptions = {},
}: MutationObserverSignalOptions<E, Mapped>) {
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

      const mutationObserver = new MutationObserver((mutations) => {
        $result.set(mapper(mutations, $result.value));
      });
      mutationObserver.observe(element, observerOptions);

      return () => mutationObserver.disconnect();
    });
  }

  return $result;
}
