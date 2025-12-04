import { type Apcach, crToBg, crToFg, apcach } from "apcach";

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
  const method = directionMode === "fgToBg" ? crToBg : crToFg;
  const bg = method(toColor, contrastLevel, contrastModel, searchDirection as "lighter" | "darker");

  return apcach(bg, chroma, hueAngle, 100, colorSpace);
}
