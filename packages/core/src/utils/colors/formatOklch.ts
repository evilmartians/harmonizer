import { formatCss } from "culori";

import { type LchColor, ColorString } from "@core/types";

export function formatOklch(color: LchColor, alpha = 1) {
  return ColorString(formatCss({ mode: "oklch", ...color, alpha }));
}
