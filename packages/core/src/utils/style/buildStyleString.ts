import type { CSSProperties } from "react";

import { stringifyCssProperties } from "./stringifyCssProperties";

export function buildStyleString(selectors: string[], styles: string | CSSProperties) {
  return `${selectors.join(",")} {${typeof styles === "string" ? styles : stringifyCssProperties(styles)}}`;
}
