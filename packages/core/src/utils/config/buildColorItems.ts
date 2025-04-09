import { HueIndex, LevelIndex, type ExportConfigWithColors } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";

export function buildColorItems<ItemResult>(
  config: ExportConfigWithColors,
  getItem: (
    level: ExportConfigWithColors["levels"][number],
    hue: ExportConfigWithColors["hues"][number],
    color: ExportConfigWithColors["colors"][keyof ExportConfigWithColors["colors"]],
  ) => ItemResult,
): ItemResult[] {
  return [...config.hues.entries()].flatMap(([hueIndex, hue]) => {
    return [...config.levels.entries()].flatMap(([levelIndex, level]) => {
      const color = config.colors[`${LevelIndex(levelIndex)}-${HueIndex(hueIndex)}`];
      invariant(color, `Color not found for level ${levelIndex} and hue ${hueIndex}`);
      return getItem(level, hue, color);
    });
  });
}
