import type { ExportConfigWithColors } from "@core/types";
import { toCss } from "@core/utils/colors/toCss";

import { buildColorItems } from "./buildColorItems";
import { buildName } from "./utils";

export function getCssVariablesConfig(config: ExportConfigWithColors): string {
  const colors = buildColorItems(config, (level, hue, color) => {
    return `--${buildName(hue.name, level.name)}: ${toCss(color, config.settings.colorSpace)};`;
  });

  return `:root {
  ${colors.join("\n  ")}
};`;
}
