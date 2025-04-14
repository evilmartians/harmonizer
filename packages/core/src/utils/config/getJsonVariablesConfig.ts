import { ColorSpace, type ExportConfigWithColors } from "@core/types";
import { toCss } from "@core/utils/colors/toCss";

import { buildColorItems } from "./buildColorItems";

export function getJsonVariablesConfig(config: ExportConfigWithColors) {
  return buildColorItems(config, (level, hue, color) => ({
    level: level.name,
    hue: hue.name,
    oklch: toCss(color, ColorSpace("p3")),
    hex: toCss(color, ColorSpace("srgb")),
  }));
}
