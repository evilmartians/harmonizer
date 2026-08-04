import type { IndexedColors, LchColor } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";
import { toP3 } from "@core/utils/colors/toP3";
import { toRgb } from "@core/utils/colors/toRgb";
import { clamp } from "@core/utils/number/clamp";
import type { FigmaRgb, PaletteGenerateData } from "@shared/types";

/**
 * Colors are converted here rather than in the sandbox so culori stays out of the published
 * plugin. The sandbox is frozen until the next Figma publish, so anything it converts can only be
 * fixed by republishing; converted here, a color fix ships with a deploy.
 */
type SupportedColor = string | LchColor;

export function toFigmaRgb(input: SupportedColor, inP3: boolean): FigmaRgb {
  const preparedInput = typeof input === "string" ? input : ({ mode: "oklch", ...input } as const);
  const convertedColor = inP3 ? toP3(preparedInput) : toRgb(preparedInput);

  invariant(convertedColor, `Color conversion failed for ${JSON.stringify(input)}`);

  // Figma rejects out-of-range channels, and gamut mapping can land just outside it.
  return {
    r: clamp(0, convertedColor.r, 1),
    g: clamp(0, convertedColor.g, 1),
    b: clamp(0, convertedColor.b, 1),
  };
}

export function toFigmaColors(colors: IndexedColors, inP3: boolean) {
  return Object.fromEntries(
    Object.entries(colors).map(([key, color]) => [key, toFigmaRgb(color, inP3)]),
  ) as PaletteGenerateData["colors"];
}
