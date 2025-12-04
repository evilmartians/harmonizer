import { batch, signal } from "@spred/core";

import { defaultConfig } from "@core/defaultConfig";
import { levelStepsPresets } from "@core/levelStepsPresets";
import { colorStringSchema } from "@core/schemas/color";
import {
  chromaModeSchema,
  colorSpaceSchema,
  contrastModelSchema,
  directionModeSchema,
  levelStepsPresetSchema,
} from "@core/schemas/settings";
import {
  BgRightStart,
  ChromaMode,
  ColorSpace,
  ColorString,
  ContrastModel,
  DirectionMode,
  LevelChroma,
  LevelContrast,
  LevelName,
  LevelStepsPreset,
} from "@core/types";
import { apcaToWcag } from "@core/utils/colors/apcaToWcag";
import { getBgMode } from "@core/utils/colors/getBgMode";
import { wcagToApca } from "@core/utils/colors/wcagToApca";
import { validationStore } from "@core/utils/stores/validationStore";

import {
  $hueIds,
  $levelIds,
  $levelsCount,
  copyChromaFromHue,
  getHue,
  levels,
  overwriteLevels,
  pregenerateFallbackColorsMap,
  requestColorsRecalculation,
  requestColorsRecalculationWithLevelsAccumulation,
  resetAllChroma,
} from "./colors";
import { getLevelStore } from "./utils";
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
  resetAllChroma();
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

export const levelStepsPresetStore = validationStore(
  LevelStepsPreset("default"),
  levelStepsPresetSchema,
);

export function applyLevelStepsPreset(preset: LevelStepsPreset) {
  const presetData = levelStepsPresets[preset as keyof typeof levelStepsPresets];
  const oldLevelIds = $levelIds.value;
  const oldLevelsCount = oldLevelIds.length;

  // Capture existing contrast values by position
  const existingContrasts = oldLevelIds.map((id) => {
    const level = levels.get(id);
    return level ? level.contrast.$lastValidValue.value : null;
  });

  const newLevels = presetData.steps.map(
    (step: { name: string; contrast: number; chroma: number }, index: number) => {
      // Try to preserve contrast value from the same relative position
      // Map old positions to new positions proportionally
      let preservedContrast: number | null = null;
      if (oldLevelsCount > 0) {
        const oldIndex =
          oldLevelsCount === 1
            ? 0
            : Math.round((index / (presetData.steps.length - 1)) * (oldLevelsCount - 1));
        preservedContrast = existingContrasts[oldIndex] ?? null;
      }

      return getLevelStore({
        name: LevelName(step.name),
        contrast: LevelContrast(preservedContrast ?? step.contrast),
        chroma: LevelChroma(step.chroma),
      });
    },
  );

  const newLevelsCount = newLevels.length;
  const oldBgRightStart = $bgRightStart.value;

  // Calculate proportional bgRightStart for new levels count
  const proportionalBgRightStart =
    oldLevelsCount > 0
      ? Math.round((oldBgRightStart / oldLevelsCount) * newLevelsCount)
      : Math.floor(newLevelsCount / 2);
  const newBgRightStart = BgRightStart(
    Math.max(0, Math.min(newLevelsCount, proportionalBgRightStart)),
  );

  batch(() => {
    levelStepsPresetStore.$raw.set(preset);
    overwriteLevels(newLevels);
    $bgRightStart.set(newBgRightStart);

    // Clear and regenerate colors map with new level IDs
    const newLevelIds = newLevels.map((level) => level.id);
    pregenerateFallbackColorsMap(newLevelIds, $hueIds.value);
  });

  requestColorsRecalculation();
}

export function distributeContrastEvenly() {
  const levelIds = $levelIds.value;
  const levelCount = levelIds.length;

  // Need at least 3 levels to distribute (keep first and last, distribute middle)
  if (levelCount < 3) return;

  const contrastModel = contrastModelStore.$lastValidValue.value;
  const firstLevelId = levelIds[0];
  const lastLevelId = levelIds[levelCount - 1];

  if (!firstLevelId || !lastLevelId) return;

  const firstLevel = levels.get(firstLevelId);
  const lastLevel = levels.get(lastLevelId);

  if (!firstLevel || !lastLevel) return;

  // Get current contrast values from first and last levels
  const minContrast = firstLevel.contrast.$lastValidValue.value;
  const maxContrast = lastLevel.contrast.$lastValidValue.value;

  // Distribute contrast linearly between first and last, keeping them unchanged
  batch(() => {
    for (const [index, levelId] of levelIds.entries()) {
      // Skip first and last levels
      if (index === 0 || index === levelCount - 1) continue;

      const level = levels.get(levelId);
      if (!level) continue;

      // Calculate position from 0 (first) to 1 (last)
      const normalizedPosition = index / (levelCount - 1);

      // Linear distribution from first to last contrast
      const contrastValue = minContrast + normalizedPosition * (maxContrast - minContrast);

      // Round APCA to whole numbers, WCAG to 1 decimal place
      const roundedValue =
        contrastModel === "apca" ? Math.round(contrastValue) : Math.round(contrastValue * 10) / 10;

      level.contrast.$raw.set(LevelContrast(roundedValue));
    }
  });

  requestColorsRecalculation();
}

// Re-export chroma utilities
export { copyChromaFromHue, $hueIds, getHue };
