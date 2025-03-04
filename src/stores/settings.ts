import { signal } from "@spred/core";

import { $levelIds, recalculateColors } from "./colors";

import type { BgLightStart, ChromaMode, ColorString, ContrastModel, DirectionMode } from "@/types";
import { initialConfig } from "@/utils/config";
import { invariant } from "@/utils/invariant";

export const $contrastModel = signal(initialConfig.settings.contrastModel);
export const $directionMode = signal(initialConfig.settings.directionMode);
export const $chromaMode = signal(initialConfig.settings.chromaMode);
export const $bgColorLight = signal(initialConfig.settings.bgColorLight);
export const $bgColorDark = signal(initialConfig.settings.bgColorDark);
export const $bgLightStart = signal(initialConfig.settings.bgLightStart);
export const $colorSpace = signal(initialConfig.settings.colorSpace);

export function updateContrastModel(model: ContrastModel) {
  $contrastModel.set(model);
  recalculateColors();
}

export function updateDirectionMode(mode: DirectionMode) {
  $directionMode.set(mode);
  recalculateColors();
}

export function updateChromaMode(mode: ChromaMode) {
  $chromaMode.set(mode);
  recalculateColors();
}

export function updateBgColorLight(color: ColorString) {
  $bgColorLight.set(color);
  recalculateColors($levelIds.value.slice($bgLightStart.value));
}

export function updateBgColorDark(color: ColorString) {
  $bgColorDark.set(color);
  recalculateColors($levelIds.value.slice(0, $bgLightStart.value));
}

export function updateBgLightStart(start: BgLightStart) {
  const idToUpdate = $levelIds.value[start > $bgLightStart.value ? start - 1 : start];
  invariant(idToUpdate, "Invalid bg light start index");
  $bgLightStart.set(start);
  recalculateColors([idToUpdate]);
}
