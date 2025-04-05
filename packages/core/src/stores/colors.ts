import {
  BgLightStart,
  type ColorCellData,
  type ColorIdentifier,
  type HueAngle,
  type HueId,
  HueIndex,
  HueName,
  type LchColor,
  type LevelChroma,
  type LevelContrast,
  type LevelId,
  LevelIndex,
  type LevelName,
} from "@core/types";
import { assertUnreachable } from "@core/utils/assertions/assertUnreachable";
import { invariant } from "@core/utils/assertions/invariant";
import {
  calculateColors,
  type GenerateColorsPayload,
  type GeneratedColorPayload,
} from "@core/utils/colors/calculateColors";
import { getClosestColorName } from "@core/utils/colors/getClosestColorName";
import { getMiddleContrastLevel } from "@core/utils/colors/getMiddleContrastLevel";
import { getMiddleHueAngle } from "@core/utils/colors/getMiddleHueAngle";
import { objectEntries } from "@core/utils/object/objectEntries";
import { workerChannel } from "@core/worker/workerChannel";
import { batch, signal, type WritableSignal } from "@spred/core";
import { pick } from "es-toolkit";
import { debounce } from "es-toolkit/compat";

import { appEvents } from "./appEvents";
import { FALLBACK_CELL_COLOR, FALLBACK_HUE_DATA, FALLBACK_LEVEL_DATA } from "./constants";
import {
  $bgLightStart,
  bgColorDarkStore,
  bgColorLightStore,
  chromaModeStore,
  colorSpaceStore,
  contrastModelStore,
  directionModeStore,
} from "./settings";
import {
  cleanupColors,
  createIndexedArrayStore,
  getColorIdentifier,
  getColorSignal,
  getHueStore,
  getInsertMethod,
  getLevelStore,
  getMiddleLevelName,
  type HueStore,
  type LevelStore,
  matchesHueColorKey,
  matchesLevelColorKey,
} from "./utils";

export const levelsStore = createIndexedArrayStore<LevelStore>([]);
export const {
  $ids: $levelIds,
  items: levels,
  getItem: getLevel,
  addItem: addLevel,
  overwrite: overwriteLevels,
} = levelsStore;
export const $levelsCount = signal((get) => get($levelIds).length);
export const huesStore = createIndexedArrayStore<HueStore>([]);
export const {
  $ids: $hueIds,
  items: hues,
  getItem: getHue,
  addItem: addHue,
  overwrite: overwriteHues,
} = huesStore;
export const $huesCount = signal((get) => get($hueIds).length);

export const $areLevelsValid = signal((get) => {
  const levelIds = get($levelIds);

  const allLevelsValid = levelIds.every((levelId) => {
    const level = getLevel(levelId);

    return (
      !get(level.name.$validationError) &&
      !get(level.contrast.$validationError) &&
      !get(level.chroma.$validationError)
    );
  });

  return allLevelsValid;
});

export const $areHuesValid = signal((get) => {
  const hueIds = get($hueIds);
  return hueIds.every((hueId) => {
    const hue = getHue(hueId);

    return !get(hue.name.$validationError) && !get(hue.angle.$validationError);
  });
});

const colorsMap = new Map<ColorIdentifier, WritableSignal<ColorCellData>>();

workerChannel.on("generated:color", handleGeneratedColor);

export function pregenerateFallbackColorsMap(levelIds: LevelId[], hueIds: HueId[]) {
  colorsMap.clear();
  for (const levelId of levelIds) {
    for (const hueId of hueIds) {
      colorsMap.set(getColorIdentifier(levelId, hueId), getColorSignal(FALLBACK_CELL_COLOR));
    }
  }
}

export function calculateColorsSynchronously() {
  calculateColors(collectColorCalculationData(), handleGeneratedColor);
}

// Color methods
function handleGeneratedColor(payload: GeneratedColorPayload) {
  const type = payload.type;

  switch (type) {
    case "level": {
      batch(() => {
        const levelStore = getLevel(payload.levelId);

        levelStore.$tintColor.set(payload.tint);
        for (const [hueId, color] of objectEntries(payload.cells)) {
          upsertColor(payload.levelId, hueId, color);
        }
      });

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
    directionMode: directionModeStore.$lastValidValue.value,
    contrastModel: contrastModelStore.$lastValidValue.value,
    levels: $levelIds.value.map((id) => ({
      id,
      contrast: getLevel(id).contrast.$lastValidValue.value,
    })),
    recalcOnlyLevels,
    hues: $hueIds.value.map((id) => ({ id, angle: getHue(id).angle.$lastValidValue.value })),
    bgColorLight: bgColorLightStore.$lastValidValue.value,
    bgColorDark: bgColorDarkStore.$lastValidValue.value,
    bgLightStart: $bgLightStart.value,
    colorSpace: colorSpaceStore.$lastValidValue.value,
    chromaMode: chromaModeStore.$lastValidValue.value,
  };
}

export const requestColorsRecalculation = debounce(
  (recalcOnlyLevels?: LevelId[]) => {
    workerChannel.emit("generate:colors", collectColorCalculationData(recalcOnlyLevels));
  },
  100,
  { maxWait: 333 },
);

const levelsAccumulation = { levels: new Set<LevelId>(), all: false };
const requestColorsRecalculationAndResetLevelsAccumulation = debounce(
  (recalcOnlyLevels?: LevelId[]) => {
    workerChannel.emit("generate:colors", collectColorCalculationData(recalcOnlyLevels));
    levelsAccumulation.all = false;
    levelsAccumulation.levels.clear();
  },
  300,
);
export const requestColorsRecalculationWithLevelsAccumulation = (recalcOnlyLevels?: LevelId[]) => {
  if (!levelsAccumulation.all && recalcOnlyLevels) {
    for (const level of recalcOnlyLevels) {
      levelsAccumulation.levels.add(level);
    }
  } else {
    levelsAccumulation.all = true;
  }
  requestColorsRecalculationAndResetLevelsAccumulation(
    levelsAccumulation.all ? undefined : [...levelsAccumulation.levels],
  );
};

export const recalculateColorsWithBigDebounce = debounce((recalcOnlyLevels?: LevelId[]) => {
  workerChannel.emit("generate:colors", collectColorCalculationData(recalcOnlyLevels));
}, 300);

export function getColor$(levelId: LevelId, hueId: HueId) {
  const color$ = colorsMap.get(getColorIdentifier(levelId, hueId));

  invariant(color$, `Color not found for level ${levelId} and hue ${hueId}`);

  return color$;
}

// Level methods
export const insertLevel = getInsertMethod({
  main: levelsStore,
  cross: huesStore,
  getNewItem(prevLevel, nextLevel) {
    if (prevLevel) {
      return getLevelStore({
        name: nextLevel
          ? getMiddleLevelName(prevLevel.name.$raw.value, nextLevel.name.$raw.value)
          : prevLevel.name.$raw.value,
        contrast: nextLevel
          ? getMiddleContrastLevel(prevLevel.contrast.$raw.value, nextLevel.contrast.$raw.value)
          : prevLevel.contrast.$raw.value,
        chroma: prevLevel.chroma.$raw.value,
        tintColor: prevLevel.$tintColor.value,
      });
    }

    return getLevelStore(FALLBACK_LEVEL_DATA);
  },
  onAddColor: (levelId, hueId, previousLevelId) => {
    upsertColor(
      levelId,
      hueId,
      previousLevelId ? getColor$(previousLevelId, hueId).value : FALLBACK_CELL_COLOR,
    );
  },
  onFinish: (levelId) => {
    // Compensate for the new level being inserted before the bgLightStart or in single light mode
    if ($levelIds.value.indexOf(levelId) <= $bgLightStart.value) {
      $bgLightStart.set(BgLightStart($bgLightStart.value + 1));
    }

    requestAnimationFrame(() => appEvents.emit("levelAdded", levelId));
    requestColorsRecalculation([levelId]);
  },
});

export function removeLevel(levelId: LevelId) {
  batch(() => {
    const levelIndex = $levelIds.value.indexOf(levelId);

    levelsStore.removeItem(levelId);
    cleanupColors(colorsMap, matchesLevelColorKey, levelId);

    if (levelIndex < $bgLightStart.value) {
      $bgLightStart.set(BgLightStart($bgLightStart.value - 1));
    }
  });
}

export function updateLevelName(id: LevelId, name: LevelName) {
  getLevel(id).name.$raw.set(name);
}

export function updateLevelContrast(id: LevelId, contrast: LevelContrast) {
  getLevel(id).contrast.$raw.set(contrast);
  requestColorsRecalculation([id]);
}

export function updateLevelChroma(id: LevelId, chroma: LevelChroma) {
  getLevel(id).chroma.$raw.set(chroma);
  requestColorsRecalculation([id]);
}

// Hue methods
export const insertHue = getInsertMethod({
  main: huesStore,
  cross: levelsStore,
  getNewItem(prevHue, nextHue) {
    if (prevHue) {
      const angle = nextHue
        ? getMiddleHueAngle(prevHue.angle.$raw.value, nextHue.angle.$raw.value)
        : prevHue.angle.$raw.value;

      return getHueStore({
        name: HueName(getClosestColorName(angle)),
        angle,
      });
    }

    return getHueStore(FALLBACK_HUE_DATA);
  },
  onAddColor: (hueId, levelId, previousHueId) =>
    upsertColor(
      levelId,
      hueId,
      previousHueId ? getColor$(levelId, previousHueId).value : FALLBACK_CELL_COLOR,
    ),
  onFinish: (hueId) => {
    requestAnimationFrame(() => appEvents.emit("hueAdded", hueId));
    requestColorsRecalculation();
  },
});

export function removeHue(hueId: HueId) {
  batch(() => {
    huesStore.removeItem(hueId);
    cleanupColors(colorsMap, matchesHueColorKey, hueId);
  });
  // Removing hue might affect the chroma of levels, so we need to recalculate colors
  requestColorsRecalculation();
}

export function updateHueName(id: HueId, name: HueName) {
  getHue(id).name.$raw.set(name);
}

export function updateHueAngle(id: HueId, angle: HueAngle) {
  getHue(id).angle.$raw.set(angle);
  requestColorsRecalculation();
}

export function getIndexedColors() {
  const colors: Record<`${LevelIndex}-${HueIndex}`, LchColor> = {};

  for (const [li, levelId] of $levelIds.value.entries()) {
    for (const [hi, hueId] of $hueIds.value.entries()) {
      colors[`${LevelIndex(li)}-${HueIndex(hi)}`] = pick(getColor$(levelId, hueId).value, [
        "l",
        "c",
        "h",
      ]);
    }
  }

  return colors;
}
