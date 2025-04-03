import { type ColorCellData, LightnessLevel, LevelChroma } from "@core/types";
import { inColorSpace } from "apcach";

import { calculateApcach } from "./calculateApcach";
import { formatOklch } from "./formatOklch";
import type { ColorCalculationOptions } from "./types";

export function calculateColorCell(options: ColorCalculationOptions): ColorCellData {
  const apcachColor = calculateApcach(options);
  const l = LightnessLevel(apcachColor.lightness);
  const c = LevelChroma(apcachColor.chroma);

  return {
    cr: options.contrastLevel,
    l,
    c,
    h: options.hueAngle,
    p3: !inColorSpace(apcachColor, "srgb"),
    css: formatOklch({ l, c, h: options.hueAngle }),
  };
}
