import type { JSXElementConstructor, ReactElement, Ref } from "react";

export function isElementHasRef<
  // oxlint-disable-next-line typescript/no-explicit-any
  P = any,
  // oxlint-disable-next-line typescript/no-explicit-any
  T extends string | JSXElementConstructor<any> =
    | string
    // oxlint-disable-next-line typescript/no-explicit-any
    | JSXElementConstructor<any>,
>(element: ReactElement<P, T>): element is ReactElement<P, T> & { ref: Ref<HTMLElement> } {
  return Boolean("ref" in element && element.ref);
}
