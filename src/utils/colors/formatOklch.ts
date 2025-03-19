import { formatCss } from "culori";

import { type LchColor, colorString } from "@/types";

export function formatOklch(color: LchColor, alpha = 1) {
  return colorString(formatCss({ mode: "oklch", ...color, alpha }));
}
