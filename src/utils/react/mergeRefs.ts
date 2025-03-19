import type { Ref } from "react";

import { assignRefSafe } from "./assignRefSafe";

export const mergeRefs =
  <E extends HTMLElement = HTMLElement>(...refs: (Ref<E> | undefined)[]) =>
  (element: E) => {
    for (const ref of refs) assignRefSafe(ref, element);
  };
