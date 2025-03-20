import { type LchColor, colorString } from "@core/types";
import { formatCss } from "culori";

export function formatOklch(color: LchColor, alpha = 1) {
  return colorString(formatCss({ mode: "oklch", ...color, alpha }));
}
