import type { Ref } from "react";

export const assignRefSafe = <E extends HTMLElement = HTMLElement>(
  ref: Ref<E> | undefined,
  element: E | null,
) => {
  if (typeof ref === "function") {
    ref(element as E);
  } else if (ref) {
    ref.current = element as E;
  }
};
