import type { HueAngle } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";

const colorNames: Record<number, string> = {
  0: "Flamingo",
  10: "Pink",
  20: "Red",
  30: "Coral",
  40: "Mahogany",
  50: "Apricot",
  60: "Bronze",
  70: "Orange",
  80: "Amber",
  90: "Mustard",
  100: "Yellow",
  110: "Turmeric",
  120: "Pear",
  130: "Avocado",
  140: "Lime",
  150: "Green",
  160: "Emerald",
  170: "Aquamarine",
  180: "Turquoise",
  190: "Cyan",
  200: "Electric blue",
  210: "Pelorus",
  220: "Sky",
  230: "Cerulean",
  240: "Steel",
  250: "Azure",
  260: "Blue",
  270: "Neon",
  280: "Iris",
  290: "Lavender",
  300: "Violet",
  310: "Purple",
  320: "Fuchsia",
  330: "Orchid",
  340: "Byzantium",
  350: "Mulberry",
  360: "Flamingo",
};

export function getClosestColorName(hueAngle: HueAngle) {
  const closestHue = Math.round(hueAngle / 10) * 10;
  const colorName = colorNames[closestHue];

  invariant(colorName, `Color name not found for hue angle ${hueAngle}`);

  return colorName;
}
