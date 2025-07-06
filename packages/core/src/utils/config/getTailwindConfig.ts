import type { ExportConfigWithColors } from "@core/types";
import { toCss } from "@core/utils/colors/toCss";

import { buildColorItems } from "./buildColorItems";
import { buildName } from "./utils";

export function getTailwindConfig(config: ExportConfigWithColors): string {
  const colors = buildColorItems(config, (level, hue, color) => {
    return `"${buildName(hue.name, level.name)}": "${toCss(color, config.settings.colorSpace)}",`;
  });

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    colors: {
      ${colors.join("\n      ")}
    }
  },
};`;
}
