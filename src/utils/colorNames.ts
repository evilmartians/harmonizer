import { invariant } from "./invariant";

import type { HueAngle } from "@/types";

const colorNames: Record<number, string> = {
  0: "Red",
  10: "Tomato",
  20: "OrangeRed",
  30: "Orange",
  40: "DarkOrange",
  50: "Gold",
  60: "Yellow",
  70: "Khaki",
  80: "YellowGreen",
  90: "GreenYellow",
  100: "Chartreuse",
  110: "LawnGreen",
  120: "Green",
  130: "ForestGreen",
  140: "LimeGreen",
  150: "Lime",
  160: "SpringGreen",
  170: "MediumSpringGreen",
  180: "Aqua",
  190: "Turquoise",
  200: "MediumTurquoise",
  210: "LightSeaGreen",
  220: "Teal",
  230: "SteelBlue",
  240: "Blue",
  250: "MediumBlue",
  260: "DarkBlue",
  270: "Indigo",
  280: "Purple",
  290: "DarkMagenta",
  300: "Magenta",
  310: "DeepPink",
  320: "HotPink",
  330: "Crimson",
  340: "PaleVioletRed",
  350: "LightCoral",
  360: "Red",
};

export function getClosestColorName(hueAngle: HueAngle) {
  const closestHue = Math.round(hueAngle / 10) * 10;
  const colorName = colorNames[closestHue];

  invariant(colorName, `Color name not found for hue angle ${hueAngle}`);

  return colorName;
}
