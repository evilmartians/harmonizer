import { defaultConfig } from "@core/defaultConfig";
import { colorStringSchema } from "@core/schemas/color";
import {
  chromaModeSchema,
  colorSpaceSchema,
  contrastModelSchema,
  directionModeSchema,
} from "@core/schemas/settings";
import {
  BgLightStart,
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
import { batch, signal } from "@spred/core";

import {
  $levelIds,
  levels,
  requestColorsRecalculation,
  requestColorsRecalculationWithLevelsAccumulation,
} from "./colors";
import { validationStore } from "./utils";

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
export const bgColorDarkStore = validationStore(
  ColorString(defaultConfig.settings.bgColorDark),
  colorStringSchema,
);
export const $bgColorDarkBgMode = signal((get) => getBgMode(get(bgColorDarkStore.$lastValidValue)));
export const bgColorLightStore = validationStore(
  ColorString(defaultConfig.settings.bgColorLight),
  colorStringSchema,
);
export const $bgColorLightBgMode = signal((get) =>
  getBgMode(get(bgColorLightStore.$lastValidValue)),
);
export const $bgLightStart = signal(BgLightStart(defaultConfig.settings.bgLightStart));
export const colorSpaceStore = validationStore(
  ColorSpace(defaultConfig.settings.colorSpace),
  colorSpaceSchema,
);
export const $isColorSpaceLocked = signal<boolean>(false);

export function updateContrastModel(model: ContrastModel) {
  batch(() => {
    contrastModelStore.$raw.set(model);
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

export function updateBgColorLight(color: ColorString) {
  bgColorLightStore.$raw.set(color);
  requestColorsRecalculation($levelIds.value.slice($bgLightStart.value));
}

export function updateBgColorDark(color: ColorString) {
  bgColorDarkStore.$raw.set(color);
  requestColorsRecalculation($levelIds.value.slice(0, $bgLightStart.value));
}

/**
 * Update the bg light start
 * @returns whether the value was updated
 */
export function updateBgLightStart(start: BgLightStart): boolean {
  const oldStart = $bgLightStart.value;
  const newStart = Math.max(0, Math.min($levelIds.value.length, start));

  if (newStart === oldStart) {
    return false;
  }
  const idsToUpdate = $levelIds.value.slice(
    Math.min(oldStart, newStart),
    Math.max(oldStart, newStart),
  );
  $bgLightStart.set(BgLightStart(newStart));
  requestColorsRecalculationWithLevelsAccumulation(idsToUpdate);
  return true;
}

/**
 * Shift the bg light start by the given offset
 * @returns whether the value was updated
 */
export function updateBgLightStartByOffset(offset: number): boolean {
  return updateBgLightStart(BgLightStart($bgLightStart.value + offset));
}
