import { type LchColor, ColorString } from "@core/types";
import { formatCss } from "culori";

export function formatOklch(color: LchColor, alpha = 1) {
  return ColorString(formatCss({ mode: "oklch", ...color, alpha }));
}
