import type { BgModeType } from "@core/components/BgMode/types";
import type { ColorString } from "@core/types";
import { isLightColor } from "@core/utils/colors/isLightColor";

import { toOklch } from "./toOklch";

export function getBgMode(color: ColorString): BgModeType {
  return isLightColor(toOklch(color)?.l ?? 0) ? "light" : "dark";
}
