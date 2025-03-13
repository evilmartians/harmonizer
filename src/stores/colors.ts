import { batch, type WritableSignal } from "@spred/core";
import debounce from "lodash-es/debounce";

import { FALLBACK_CELL_COLOR, FALLBACK_HUE_DATA, FALLBACK_LEVEL_DATA } from "./constants";
import {
  $bgColorDark,
  $bgColorLight,
  $bgLightStart,
  $chromaMode,
  $colorSpace,
  $contrastModel,
  $directionMode,
} from "./settings";
import {
  cleanupColors,
  createIndexedArrayStore,
  getColorIdentifier,
  getColorSignal,
  getHueStore,
  getInsertItem,
  getLevelStore,
  getMiddleHue,
  getMiddleLevel,
  matchesHueColorKey,
  matchesLevelColorKey,
} from "./utils";

import {
  bgLightStart,
  type ChromaLevel,
  type ColorCellData,
  type ColorIdentifier,
  type ContrastLevel,
  type HueAngle,
  type HueId,
  type LevelId,
} from "@/types";
import { assertUnreachable } from "@/utils/assertUnreachable";
import {
  calculateColors,
  type GenerateColorsPayload,
  type GeneratedColorPayload,
} from "@/utils/color";
import { initialConfig } from "@/utils/config";
import { invariant } from "@/utils/invariant";
import { generationWorker } from "@/worker/client";

const levelsStore = createIndexedArrayStore(initialConfig.levels.map(getLevelStore));
export const {
  $ids: $levelIds,
  items: levels,
  getItem: getLevel,
  addItem: addLevel,
  overwrite: overwriteLevels,
} = levelsStore;
export const huesStore = createIndexedArrayStore(initialConfig.hues.map(getHueStore));
export const {
  $ids: $hueIds,
  items: hues,
  getItem: getHue,
  addItem: addHue,
  overwrite: overwriteHues,
} = huesStore;

const colorsMap = new Map<ColorIdentifier, WritableSignal<ColorCellData>>();
// Synchronously precalculate colors
precalculateColors();
generationWorker.on("generated:color", handleGeneratedColor);

export function pregenerateFallbackColorsMap(levelIds: LevelId[], hueIds: HueId[]) {
  colorsMap.clear();
  for (const levelId of levelIds) {
    for (const hueId of hueIds) {
      colorsMap.set(getColorIdentifier(levelId, hueId), getColorSignal(FALLBACK_CELL_COLOR));
    }
  }
}

// Color methods
function handleGeneratedColor(payload: GeneratedColorPayload) {
  const type = payload.type;

  switch (type) {
    case "cell": {
      upsertColor(payload.levelId, payload.hueId, payload.color);
      break;
    }
    case "level-tint": {
      getLevel(payload.levelId).$tintColor.set(payload.color);
      break;
    }
    case "hue-tint": {
      getHue(payload.hueId).$tintColor.set(payload.color);
      break;
    }
    default: {
      assertUnreachable(type);
    }
  }
}

function upsertColor(levelId: LevelId, hueId: HueId, color: ColorCellData) {
  const identifier = getColorIdentifier(levelId, hueId);
  const $existingSignal = colorsMap.get(identifier);

  if ($existingSignal) {
    $existingSignal.set(color);
  } else {
    colorsMap.set(identifier, getColorSignal(color));
  }
}

function collectColorCalculationData(recalcOnlyLevels?: LevelId[]): GenerateColorsPayload {
  return {
    directionMode: $directionMode.value,
    contrastModel: $contrastModel.value,
    levels: $levelIds.value.map((id) => ({ id, contrast: getLevel(id).$contrast.value })),
    recalcOnlyLevels,
    hues: $hueIds.value.map((id) => ({ id, angle: getHue(id).$angle.value })),
    bgColorLight: $bgColorLight.value,
    bgColorDark: $bgColorDark.value,
    bgLightStart: $bgLightStart.value,
    colorSpace: $colorSpace.value,
    chromaMode: $chromaMode.value,
  };
}

function precalculateColors() {
  calculateColors(collectColorCalculationData(), handleGeneratedColor);
}

export const recalculateColors = debounce(
  (recalcOnlyLevels?: LevelId[]) => {
    generationWorker.emit("generate:colors", collectColorCalculationData(recalcOnlyLevels));
  },
  100,
  { maxWait: 333 },
);

export function getColor$(levelId: LevelId, hueId: HueId) {
  const color$ = colorsMap.get(getColorIdentifier(levelId, hueId));

  invariant(color$, `Color not found for level ${levelId} and hue ${hueId}`);

  return color$;
}

// Level methods
export const insertLevel = getInsertItem({
  main: levelsStore,
  cross: huesStore,
  getNewItem: () => getLevelStore(FALLBACK_LEVEL_DATA),
  getMiddleItem: getMiddleLevel,
  onAddColor: (levelId, hueId, previousLevelId) =>
    upsertColor(
      levelId,
      hueId,
      previousLevelId ? getColor$(previousLevelId, hueId).value : FALLBACK_CELL_COLOR,
    ),
  onFinish: (levelId) => recalculateColors([levelId]),
});

export function removeLevel(levelId: LevelId) {
  batch(() => {
    const levelIndex = $levelIds.value.indexOf(levelId);

    levelsStore.removeItem(levelId);
    cleanupColors(colorsMap, matchesLevelColorKey, levelId);

    if (levelIndex < $bgLightStart.value) {
      $bgLightStart.set(bgLightStart($bgLightStart.value - 1));
    }
  });
}

export function updateLevelName(id: LevelId, name: string) {
  getLevel(id).$name.set(name);
}

export function updateLevelContrast(id: LevelId, contrast: ContrastLevel) {
  getLevel(id).$contrast.set(contrast);
  recalculateColors([id]);
}

export function updateLevelChroma(id: LevelId, chroma: ChromaLevel) {
  getLevel(id).$chroma.set(chroma);
  recalculateColors([id]);
}

// Hue methods
export const insertHue = getInsertItem({
  main: huesStore,
  cross: levelsStore,
  getNewItem: () => getHueStore(FALLBACK_HUE_DATA),
  getMiddleItem: getMiddleHue,
  onAddColor: (hueId, levelId, previousHueId) =>
    upsertColor(
      levelId,
      hueId,
      previousHueId ? getColor$(levelId, previousHueId).value : FALLBACK_CELL_COLOR,
    ),
  onFinish: () => recalculateColors(),
});

export function removeHue(hueId: HueId) {
  batch(() => {
    huesStore.removeItem(hueId);
    cleanupColors(colorsMap, matchesHueColorKey, hueId);
  });
  // Removing hue might affect the chroma of levels, so we need to recalculate colors
  recalculateColors();
}

export function updateHueName(id: HueId, name: string) {
  getHue(id).$name.set(name);
}

export function updateHueAngle(id: HueId, angle: HueAngle) {
  getHue(id).$angle.set(angle);
  recalculateColors();
}
