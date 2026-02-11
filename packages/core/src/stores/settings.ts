import { batch, signal } from "@spred/core";

import { defaultConfig } from "@core/defaultConfig";
import { colorStringSchema } from "@core/schemas/color";
import {
  chromaModeSchema,
  colorSpaceSchema,
  contrastModelSchema,
  directionModeSchema,
} from "@core/schemas/settings";
import {
  BgRightStart,
  ChromaMode,
  ColorSpace,
  ColorString,
  ContrastModel,
  DirectionMode,
  LevelContrast,
} from "@core/types";
import { apcaToWcag } from "@core/utils/colors/apcaToWcag";
import { getBgMode } from "@core/utils/colors/getBgMode";
import { wcagToApca } from "@core/utils/colors/wcagToApca";
import { validationStore } from "@core/utils/stores/validationStore";

import {
  $levelIds,
  $levelsCount,
  levels,
  requestColorsRecalculation,
  requestColorsRecalculationWithLevelsAccumulation,
} from "./colors";
import { getBgValueLeft, getBgValueRight, isSingleBgLeft, isSingleBgRight } from "./utils/bg";

export const contrastModelStore = validationStore(
  ContrastModel(defaultConfig.settings.contrastModel),
  contrastModelSchema,
);

export const directionModeStore = validationStore(
  DirectionMode(defaultConfig.settings.directionMode),
  directionModeSchema,
);
export const chromaModeStore = validationStore(
  ChromaMode(defaultConfig.settings.chromaMode),
  chromaModeSchema,
);
export const colorSpaceStore = validationStore(
  ColorSpace(defaultConfig.settings.colorSpace),
  colorSpaceSchema,
);
export const $isColorSpaceLocked = signal<boolean>(false);

export const bgColorLeftStore = validationStore(
  ColorString(defaultConfig.settings.bgColorDark),
  colorStringSchema,
);
export const bgColorRightStore = validationStore(
  ColorString(defaultConfig.settings.bgColorLight),
  colorStringSchema,
);

export const $bgRightStart = signal(BgRightStart(defaultConfig.settings.bgLightStart));
export const $isSingleBgLeft = signal((get) =>
  isSingleBgLeft(get($bgRightStart), get($levelsCount)),
);
export const $isSingleBgRight = signal((get) => isSingleBgRight(get($bgRightStart)));

export const $bgColorLeft = signal((get) => {
  const bgColorStore = getBgValueLeft(get($isSingleBgRight), bgColorLeftStore, bgColorRightStore);
  return get(bgColorStore.$lastValidValue);
});
export const $bgColorRight = signal((get) => {
  const bgColorStore = getBgValueRight(get($isSingleBgLeft), bgColorLeftStore, bgColorRightStore);
  return get(bgColorStore.$lastValidValue);
});

export const $bgColorModeLeft = signal((get) => {
  return getBgMode(get($bgColorLeft));
});

export const $bgColorModeRight = signal((get) => {
  return getBgMode(get($bgColorRight));
});

export const $bgColorSingleStore = signal((get) =>
  getBgValueLeft(get($isSingleBgRight), bgColorLeftStore, bgColorRightStore),
);

export const $bgColorSingleBgMode = signal((get) =>
  getBgMode(get(get($bgColorSingleStore).$lastValidValue)),
);

export const $bgColorSingleBgColorType = signal((get) => {
  if (get($isSingleBgRight)) {
    return "right";
  }

  return "left";
});

export function updateContrastModel(model: ContrastModel) {
  contrastModelStore.$raw.set(model);

  batch(() => {
    for (const level of levels.values()) {
      level.contrast.$raw.set(
        LevelContrast(
          model === "wcag"
            ? apcaToWcag(level.contrast.$lastValidValue.value)
            : wcagToApca(level.contrast.$lastValidValue.value),
        ),
      );
    }
  });
  requestColorsRecalculation();
}

export function toggleContrastModel() {
  const toWcag = contrastModelStore.$lastValidValue.value === "apca";

  if (toWcag) {
    directionModeStore.$raw.set(DirectionMode("fgToBg"));
  }

  updateContrastModel(ContrastModel(toWcag ? "wcag" : "apca"));
}

export function updateDirectionMode(mode: DirectionMode) {
  directionModeStore.$raw.set(mode);
  requestColorsRecalculation();
}

export function toggleDirectionMode() {
  updateDirectionMode(
    DirectionMode(directionModeStore.$lastValidValue.value === "bgToFg" ? "fgToBg" : "bgToFg"),
  );
}

export function toggleColorSpace() {
  colorSpaceStore.$raw.set(
    ColorSpace(colorSpaceStore.$lastValidValue.value === "p3" ? "srgb" : "p3"),
  );
  requestColorsRecalculation();
}

export function updateChromaMode(mode: ChromaMode) {
  chromaModeStore.$raw.set(mode);
  requestColorsRecalculation();
}

export function updateBgColorLeft(color: ColorString) {
  bgColorLeftStore.$raw.set(color);
  requestColorsRecalculation($levelIds.value.slice(0, $bgRightStart.value));
}

export function updateBgColorRight(color: ColorString) {
  bgColorRightStore.$raw.set(color);
  requestColorsRecalculation($levelIds.value.slice($bgRightStart.value));
}

export function updateBgColorSingle(color: ColorString) {
  $bgColorSingleStore.value.$raw.set(color);
  requestColorsRecalculation();
}

/**
 * Update the bg dark start
 * @returns whether the value was updated
 */
export function updateBgRightStart(start: BgRightStart): boolean {
  const oldStart = $bgRightStart.value;
  const newStart = Math.max(0, Math.min($levelIds.value.length, start));

  if (newStart === oldStart) {
    return false;
  }
  const idsToUpdate = $levelIds.value.slice(
    Math.min(oldStart, newStart),
    Math.max(oldStart, newStart),
  );
  $bgRightStart.set(BgRightStart(newStart));
  requestColorsRecalculationWithLevelsAccumulation(idsToUpdate);
  return true;
}

/**
 * Shift the bg right start by the given offset
 * @returns whether the value was updated
 */
export function updateBgRightStartByOffset(offset: number): boolean {
  return updateBgRightStart(BgRightStart($bgRightStart.value + offset));
}

export function enableDualBg() {
  const levelsCount = $levelIds.value.length;

  updateBgRightStart(BgRightStart(Math.floor(levelsCount / 2)));
}
