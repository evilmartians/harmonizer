import { useEffect, useRef } from "react";

import { signal } from "@spred/core";

/**
 * This is the util for creating signal from value in react components / hooks.
 * This allows using values in useSignal hook and track its change.
 *
 * @param value
 * @returns
 */
// oxlint-disable-next-line typescript/no-unsafe-function-type
export function useValueAsSignal<T>(value: Exclude<T, Function>) {
  const isFirstRender = useRef(true);
  const ref = useRef(signal(value));

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    ref.current.set(value);
  }, [value]);

  return ref.current;
}
