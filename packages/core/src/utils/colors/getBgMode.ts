import type { BgModeType } from "@core/components/BgMode/types";
import type { ColorString } from "@core/types";

import { toOklch } from "./toOklch";

export function getBgMode(color: ColorString): BgModeType {
  return (toOklch(color)?.l ?? 0) > 0.5 ? "light" : "dark";
}
