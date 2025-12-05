import { type Apcach, crToBg, crToFg, apcach } from "apcach";

import { calculateSubtleColor, SUBTLE_CONTRAST_THRESHOLD } from "./calculateSubtleColor";
import type { ColorCalculationOptions } from "./types";

export function calculateApcach({
  directionMode,
  contrastModel,
  searchDirection,
  colorSpace,
  toColor,
  contrastLevel,
  chroma,
  hueAngle,
}: ColorCalculationOptions): Apcach {
  // For very low contrast values (< 8), use custom subtle color calculation
  // because apcach library converts these to a single color (white)
  if (contrastLevel < SUBTLE_CONTRAST_THRESHOLD) {
    return calculateSubtleColor(
      toColor,
      contrastLevel,
      hueAngle,
      chroma,
      searchDirection as "lighter" | "darker",
      colorSpace,
      directionMode,
      contrastModel,
    );
  }

  // Use apcach library for normal contrast values
  const method = directionMode === "fgToBg" ? crToBg : crToFg;
  const bg = method(toColor, contrastLevel, contrastModel, searchDirection as "lighter" | "darker");

  return apcach(bg, chroma, hueAngle, 100, colorSpace);
}
