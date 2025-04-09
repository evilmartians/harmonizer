import type { ColorSpace, LchColor } from "@core/types";
import { toHex } from "@core/utils/colors/toHex";
import { formatCss } from "culori";

export function toCss(color: LchColor, colorSpace: ColorSpace): string {
  if (colorSpace === "srgb") {
    return toHex({ mode: "oklch", ...color });
  }

  return formatCss({
    mode: "oklch",
    l: Number(color.l.toFixed(2)),
    c: Number(color.c.toFixed(2)),
    h: Number(color.h.toFixed(2)),
  });
}
