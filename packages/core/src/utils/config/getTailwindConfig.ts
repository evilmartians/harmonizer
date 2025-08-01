import type { ExportConfigWithColors } from "@core/types";
import { toCss } from "@core/utils/colors/toCss";
import { getShareUrl } from "@core/utils/url/getShareUrl";

import { buildColorItems } from "./buildColorItems";
import { buildName } from "./utils";

export function getTailwindConfig(config: ExportConfigWithColors, configHash: string): string {
  const colors = buildColorItems(config, (level, hue, color) => {
    return `"${buildName(hue.name, level.name)}": "${toCss(color, config.settings.colorSpace)}",`;
  });

  return `/**
 * Generated via Harmonizer: ${getShareUrl(configHash)}
 * @type {import('tailwindcss').Config}
 * */
module.exports = {
  theme: {
    colors: {
      ${colors.join("\n      ")}
    }
  },
};`;
}
