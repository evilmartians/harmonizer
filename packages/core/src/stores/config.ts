import type { ExportConfig } from "@core/types";
import { batch, signal } from "@spred/core";

import {
  $areHuesValid,
  $areLevelsValid,
  $hueIds,
  $levelIds,
  getHue,
  getLevel,
  overwriteHues,
  overwriteLevels,
  pregenerateFallbackColorsMap,
  requestColorsRecalculation,
} from "./colors";
import {
  $bgLightStart,
  chromaModeStore,
  colorSpaceStore,
  contrastModelStore,
  directionModeStore,
  bgColorDarkStore,
  bgColorLightStore,
} from "./settings";
import { getHueStore, getLevelStore } from "./utils";

export const $isExportConfigValid = signal((get) => get($areLevelsValid) && get($areHuesValid));

export function getConfig(): ExportConfig {
  return {
    levels: $levelIds.value.map((levelId) => ({
      name: getLevel(levelId).name.$lastValidValue.value,
      contrast: getLevel(levelId).contrast.$lastValidValue.value,
      chroma: getLevel(levelId).chroma.$lastValidValue.value,
    })),
    hues: $hueIds.value.map((hueId) => ({
      name: getHue(hueId).name.$lastValidValue.value,
      angle: getHue(hueId).angle.$lastValidValue.value,
    })),
    settings: {
      contrastModel: contrastModelStore.$lastValidValue.value,
      directionMode: directionModeStore.$lastValidValue.value,
      chromaMode: chromaModeStore.$lastValidValue.value,
      bgColorLight: bgColorLightStore.$lastValidValue.value,
      bgColorDark: bgColorDarkStore.$lastValidValue.value,
      bgLightStart: $bgLightStart.value,
      colorSpace: colorSpaceStore.$lastValidValue.value,
    },
  };
}

export function updateConfig(config: ExportConfig) {
  batch(() => {
    const levels = config.levels.map(getLevelStore);
    const hues = config.hues.map(getHueStore);

    contrastModelStore.$raw.set(config.settings.contrastModel);
    directionModeStore.$raw.set(config.settings.directionMode);
    chromaModeStore.$raw.set(config.settings.chromaMode);
    bgColorLightStore.$raw.set(config.settings.bgColorLight);
    bgColorDarkStore.$raw.set(config.settings.bgColorDark);
    $bgLightStart.set(config.settings.bgLightStart);
    colorSpaceStore.$raw.set(config.settings.colorSpace);
    overwriteLevels(levels);
    overwriteHues(hues);
    pregenerateFallbackColorsMap(
      levels.map((level) => level.id),
      hues.map((hue) => hue.id),
    );
  });
  requestColorsRecalculation();
}
