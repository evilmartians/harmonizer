import type { ExportConfigWithColors } from "@core/types";
import { toCss } from "@core/utils/colors/toCss";

import { buildColorItems } from "./buildColorItems";

export function getCssVariablesConfig(config: ExportConfigWithColors): string {
  const colors = buildColorItems(config, (level, hue, color) => {
    return `--${hue.name.toLowerCase()}-${level.name.toLowerCase()}: ${toCss(color, config.settings.colorSpace)};`;
  });

  return `:root {
  ${colors.join("\n  ")}
};`;
}
