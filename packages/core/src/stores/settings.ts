import {
  BgLightStart,
  ContrastLevel,
  type ChromaMode,
  type ColorString,
  type ContrastModel,
  type DirectionMode,
} from "@core/types";
import { apcaToWcag } from "@core/utils/colors/apcaToWcag";
import { wcagToApca } from "@core/utils/colors/wcagToApca";
import { initialConfig } from "@core/utils/initialConfig";
import { batch, signal } from "@spred/core";

import {
  $levelIds,
  levels,
  requestColorsRecalculation,
  requestColorsRecalculationWithLevelsAccumulation,
} from "./colors";

export const $contrastModel = signal(initialConfig.settings.contrastModel);
export const $directionMode = signal(initialConfig.settings.directionMode);
export const $chromaMode = signal(initialConfig.settings.chromaMode);
export const $bgColorLight = signal(initialConfig.settings.bgColorLight);
export const $bgColorDark = signal(initialConfig.settings.bgColorDark);
export const $bgLightStart = signal(initialConfig.settings.bgLightStart);
export const $colorSpace = signal(initialConfig.settings.colorSpace);

export function updateContrastModel(model: ContrastModel) {
  batch(() => {
    $contrastModel.set(model);
    for (const level of levels.values()) {
      level.$contrast.set(
        ContrastLevel(
          model === "wcag" ? apcaToWcag(level.$contrast.value) : wcagToApca(level.$contrast.value),
        ),
      );
    }
  });
  requestColorsRecalculation();
}

export function toggleContrastModel() {
  const toWcag = $contrastModel.value === "apca";

  if (toWcag) {
    $directionMode.set("fgToBg");
  }

  updateContrastModel(toWcag ? "wcag" : "apca");
}

export function updateDirectionMode(mode: DirectionMode) {
  $directionMode.set(mode);
  requestColorsRecalculation();
}

export function toggleDirectionMode() {
  updateDirectionMode($directionMode.value === "bgToFg" ? "fgToBg" : "bgToFg");
}

export function toggleColorSpace() {
  $colorSpace.set($colorSpace.value === "p3" ? "srgb" : "p3");
  requestColorsRecalculation();
}

export function updateChromaMode(mode: ChromaMode) {
  $chromaMode.set(mode);
  requestColorsRecalculation();
}

export function updateBgColorLight(color: ColorString) {
  $bgColorLight.set(color);
  requestColorsRecalculation($levelIds.value.slice($bgLightStart.value));
}

export function updateBgColorDark(color: ColorString) {
  $bgColorDark.set(color);
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
