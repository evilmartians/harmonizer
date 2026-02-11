import type { JSXElementConstructor, ReactElement, Ref } from "react";

import { isElementHasRef } from "./isElementHasRef";

export function getElementRefSafe<
  // oxlint-disable-next-line typescript/no-explicit-any
  P = any,
  // oxlint-disable-next-line typescript/no-explicit-any
  T extends string | JSXElementConstructor<any> =
    | string
    // oxlint-disable-next-line typescript/no-explicit-any
    | JSXElementConstructor<any>,
>(element: ReactElement<P, T>): Ref<HTMLElement> | undefined {
  if (isElementHasRef(element)) {
    return element.ref;
  }

  return undefined;
}
