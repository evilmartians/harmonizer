import { maxChroma } from "apcach";

import { LevelChroma, type HueAngle } from "@core/types";

import { calculateApcach } from "./calculateApcach";
import type { ColorCalculationOptions } from "./types";

export type MaxCommonChromaOptions = Omit<ColorCalculationOptions, "hueAngle" | "chroma"> & {
  hueAngles: HueAngle[];
};

export function maxCommonChroma(
  { hueAngles, ...restOptions }: MaxCommonChromaOptions,
  chromaCap?: number,
): LevelChroma {
  let maxCommonChroma = 100;

  for (const hueAngle of hueAngles) {
    const apcachColor = calculateApcach({
      ...restOptions,
      chroma: maxChroma(chromaCap),
      hueAngle: hueAngle,
    });

    if (apcachColor.chroma < maxCommonChroma) {
      maxCommonChroma = apcachColor.chroma;
    }
  }
  return LevelChroma(maxCommonChroma);
}
