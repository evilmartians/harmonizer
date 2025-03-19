import { maxChroma } from "apcach";

import { calculateApcach } from "./calculateApcach";
import type { ColorCalculationOptions } from "./types";

import { type ChromaLevel, chromaLevel, type HueAngle } from "@/types";

export type MaxCommonChromaOptions = Omit<ColorCalculationOptions, "hueAngle" | "chroma"> & {
  hueAngles: HueAngle[];
};

export function maxCommonChroma({
  hueAngles,
  ...restOptions
}: MaxCommonChromaOptions): ChromaLevel {
  let maxCommonChroma = 100;

  for (const hueAngle of hueAngles) {
    const apcachColor = calculateApcach({
      ...restOptions,
      chroma: maxChroma(),
      hueAngle: hueAngle,
    });

    if (apcachColor.chroma < maxCommonChroma) {
      maxCommonChroma = apcachColor.chroma;
    }
  }
  return chromaLevel(maxCommonChroma);
}
