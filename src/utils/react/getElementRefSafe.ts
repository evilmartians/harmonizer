import type { JSXElementConstructor, ReactElement, Ref } from "react";

import { isElementHasRef } from "./isElementHasRef";

export function getElementRefSafe<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends string | JSXElementConstructor<any> =
    | string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | JSXElementConstructor<any>,
>(element: ReactElement<P, T>): Ref<HTMLElement> | undefined {
  if (isElementHasRef(element)) {
    return element.ref;
  }

  return undefined;
}
