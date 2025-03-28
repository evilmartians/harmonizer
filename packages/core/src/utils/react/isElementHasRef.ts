import type { JSXElementConstructor, ReactElement, Ref } from "react";

export function isElementHasRef<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends string | JSXElementConstructor<any> =
    | string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | JSXElementConstructor<any>,
>(element: ReactElement<P, T>): element is ReactElement<P, T> & { ref: Ref<HTMLElement> } {
  return Boolean("ref" in element && element.ref);
}
