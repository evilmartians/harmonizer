import { apcach, crToBg, maxChroma, apcachToCss } from "apcach";
import { Hue, Level, Settings } from "../types/config";

export function calculateColor(
  hue: Hue,
  level: Level,
  settings: Settings
): string {
  const color = apcach(
    crToBg(settings.bgColorDark, level.contrast),
    maxChroma(),
    hue.degree
  );
  return apcachToCss(color, "oklch");
}
