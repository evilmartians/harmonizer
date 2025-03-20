import type { ExportConfig } from "@core/schemas/exportConfigSchema";
import { batch } from "@spred/core";

import {
  $hueIds,
  $levelIds,
  getHue,
  getLevel,
  overwriteHues,
  overwriteLevels,
  requestColorsRecalculation,
  pregenerateFallbackColorsMap,
} from "./colors";
import {
  $bgColorDark,
  $bgColorLight,
  $bgLightStart,
  $chromaMode,
  $colorSpace,
  $contrastModel,
  $directionMode,
} from "./settings";
import { getHueStore, getLevelStore } from "./utils";

export function getConfig(): ExportConfig {
  return {
    levels: $levelIds.value.map((levelId) => ({
      name: getLevel(levelId).$name.value,
      contrast: getLevel(levelId).$contrast.value,
      chroma: getLevel(levelId).$chroma.value,
    })),
    hues: $hueIds.value.map((hueId) => ({
      name: getHue(hueId).$name.value,
      angle: getHue(hueId).$angle.value,
    })),
    settings: {
      contrastModel: $contrastModel.value,
      directionMode: $directionMode.value,
      chromaMode: $chromaMode.value,
      bgColorLight: $bgColorLight.value,
      bgColorDark: $bgColorDark.value,
      bgLightStart: $bgLightStart.value,
      colorSpace: $colorSpace.value,
    },
  };
}

export function updateConfig(config: ExportConfig) {
  batch(() => {
    const levels = config.levels.map(getLevelStore);
    const hues = config.hues.map(getHueStore);

    $contrastModel.set(config.settings.contrastModel);
    $directionMode.set(config.settings.directionMode);
    $chromaMode.set(config.settings.chromaMode);
    $bgColorLight.set(config.settings.bgColorLight);
    $bgColorDark.set(config.settings.bgColorDark);
    $bgLightStart.set(config.settings.bgLightStart);
    $colorSpace.set(config.settings.colorSpace);
    overwriteLevels(levels);
    overwriteHues(hues);
    pregenerateFallbackColorsMap(
      levels.map((level) => level.id),
      hues.map((hue) => hue.id),
    );
  });
  requestColorsRecalculation();
}
