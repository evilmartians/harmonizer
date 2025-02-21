import { signal } from "@spred/core";

import { recalculateColors } from "./colors";

import type { BgLightStart, ChromaMode, ColorString, ContrastModel, DirectionMode } from "@/types";
import { initialConfig } from "@/utils/config";

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
  recalculateColors();
}

export function updateBgColorDark(color: ColorString) {
  $bgColorDark.set(color);
  recalculateColors();
}

export function updateBgLightStart(start: BgLightStart) {
  $bgLightStart.set(start);
  recalculateColors();
}
