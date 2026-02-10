import { expect, vi } from "vitest";

import { defaultConfig } from "@core/defaultConfig";
import { contrastModelSchema } from "@core/schemas/settings";
import {
  BgRightStart,
  ChromaMode,
  ColorSpace,
  ColorString,
  ContrastModel,
  DirectionMode,
  HueAngle,
  HueName,
  LevelChroma,
  LevelContrast,
  LevelName,
  LightnessLevel,
} from "@core/types";
import { validationStore } from "@core/utils/stores/validationStore";
import { workerChannel } from "@core/worker/workerChannel";

import { huesStore, levelsStore, pregenerateFallbackColorsMap } from "./colors";
import { FALLBACK_CELL_COLOR } from "./constants";
import {
  $bgRightStart,
  $isColorSpaceLocked,
  bgColorLeftStore,
  bgColorRightStore,
  chromaModeStore,
  colorSpaceStore,
  contrastModelStore,
  directionModeStore,
} from "./settings";
import { $isChangingBgBoundary, $scrollableContainer } from "./ui";
import { getHueStore, getLevelStore, type HueStore, type LevelStore } from "./utils";

export type TestLevelOverrides = {
  name?: string;
  contrast?: number;
  chroma?: number;
  chromaCap?: number | null;
};

export type TestHueOverrides = {
  name?: string;
  angle?: number;
};

export function createContrastModelStore(model: ContrastModel) {
  return validationStore(model, contrastModelSchema);
}

export function createTestLevelStore(overrides: TestLevelOverrides = {}): LevelStore {
  return getLevelStore({
    name: LevelName(overrides.name ?? "500"),
    contrast: LevelContrast(overrides.contrast ?? 50),
    chroma: LevelChroma(overrides.chroma ?? 0),
    chromaCap:
      overrides.chromaCap === undefined || overrides.chromaCap === null
        ? null
        : LevelChroma(overrides.chromaCap),
  });
}

export function createTestHueStore(overrides: TestHueOverrides = {}): HueStore {
  return getHueStore({
    name: HueName(overrides.name ?? "Blue"),
    angle: HueAngle(overrides.angle ?? 250),
  });
}

export function expectColorsRecalculation(obj: Record<string, unknown>) {
  vi.runAllTimers();

  expect(workerChannel.emit).toHaveBeenCalledWith("generate:colors", expect.objectContaining(obj));
}

export function resetStores() {
  levelsStore.overwrite([]);
  huesStore.overwrite([]);

  contrastModelStore.$raw.set(ContrastModel(defaultConfig.settings.contrastModel));
  directionModeStore.$raw.set(DirectionMode(defaultConfig.settings.directionMode));
  chromaModeStore.$raw.set(ChromaMode(defaultConfig.settings.chromaMode));
  colorSpaceStore.$raw.set(ColorSpace(defaultConfig.settings.colorSpace));
  $isColorSpaceLocked.set(false);

  bgColorLeftStore.$raw.set(ColorString(defaultConfig.settings.bgColorDark));
  bgColorRightStore.$raw.set(ColorString(defaultConfig.settings.bgColorLight));
  $bgRightStart.set(BgRightStart(defaultConfig.settings.bgLightStart));
}

export function resetUiStores() {
  $scrollableContainer.set(null);
  $isChangingBgBoundary.set(false);
}

export function setupFakeTimersAndRAF() {
  vi.useFakeTimers();
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((cb: FrameRequestCallback) => {
      const time = performance.now();
      cb(time);
      return time;
    }),
  );
}

export function cleanupFakeTimersAndRAF() {
  vi.useRealTimers();
  vi.unstubAllGlobals();
}

export const TEST_CELL_COLOR = { ...FALLBACK_CELL_COLOR, l: LightnessLevel(12) };

export function addTestLevels(...names: string[]) {
  for (const name of names) {
    levelsStore.addItem(createTestLevelStore({ name }));
  }
}

export function setupTestGrid(
  levels: TestLevelOverrides[],
  hues: TestHueOverrides[],
): { levelStores: LevelStore[]; hueStores: HueStore[] } {
  const levelStores = levels.map((l) => {
    const store = createTestLevelStore(l);
    levelsStore.addItem(store);
    return store;
  });

  const hueStores = hues.map((h) => {
    const store = createTestHueStore(h);
    huesStore.addItem(store);
    return store;
  });

  pregenerateFallbackColorsMap(
    levelStores.map((l) => l.id),
    hueStores.map((h) => h.id),
  );

  return { levelStores, hueStores };
}
