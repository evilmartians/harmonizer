import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ColorString, HueName, LevelChroma, LevelContrast, LevelName } from "@core/types";
import { downloadTextFile } from "@core/utils/file/downloadTextFile";

import { $exportConfigHash, $isExportConfigValid, downloadConfigTarget } from "./config";
import { bgColorLeftStore } from "./settings";
import {
  cleanupFakeTimersAndRAF,
  resetStores,
  setupFakeTimersAndRAF,
  setupTestGrid,
  type TestHueOverrides,
  type TestLevelOverrides,
} from "./test-utils";

vi.mock("@core/utils/file/downloadTextFile", () => ({ downloadTextFile: vi.fn() }));

const HASH_DEBOUNCE_MS = 300;

function setupGrid(
  levels: TestLevelOverrides[] = [{ name: "100" }, { name: "500" }],
  hues: TestHueOverrides[] = [{ name: "Blue" }],
) {
  return setupTestGrid(levels, hues);
}

describe("export config validity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStores();
  });

  test("is valid for a complete grid", () => {
    setupGrid();

    expect($isExportConfigValid.value).toBe(true);
  });

  test("is invalid when a level has no name", () => {
    const { levelStores } = setupGrid();

    levelStores[0]?.name.$raw.set(LevelName(""));

    expect($isExportConfigValid.value).toBe(false);
  });

  test("is invalid when a hue has no name", () => {
    const { hueStores } = setupGrid();

    hueStores[0]?.name.$raw.set(HueName(""));

    expect($isExportConfigValid.value).toBe(false);
  });

  test("is invalid when a level contrast is out of range", () => {
    const { levelStores } = setupGrid();

    levelStores[0]?.contrast.$raw.set(LevelContrast(1000));

    expect($isExportConfigValid.value).toBe(false);
  });

  test("is invalid when a level chroma cap is out of range", () => {
    const { levelStores } = setupGrid();

    levelStores[0]?.chromaCap.$raw.set(LevelChroma(10));

    expect($isExportConfigValid.value).toBe(false);
  });

  test("is invalid when a background color is not a color", () => {
    setupGrid();

    bgColorLeftStore.$raw.set(ColorString("definitely not a color"));

    expect($isExportConfigValid.value).toBe(false);
  });
});

describe("export blocking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStores();
  });

  test("downloads the file when everything is valid", () => {
    setupGrid();

    downloadConfigTarget("harmonizer");

    expect(downloadTextFile).toHaveBeenCalledOnce();
  });

  test("downloads nothing when a level has no name", () => {
    const { levelStores } = setupGrid();

    levelStores[0]?.name.$raw.set(LevelName(""));
    downloadConfigTarget("harmonizer");

    expect(downloadTextFile).not.toHaveBeenCalled();
  });

  test("keeps the url hash untouched while a value is invalid", async () => {
    setupFakeTimersAndRAF();
    const { levelStores } = setupGrid();
    const hashBeforeChange = $exportConfigHash.value;

    levelStores[0]?.name.$raw.set(LevelName(""));
    await vi.advanceTimersByTimeAsync(HASH_DEBOUNCE_MS);

    expect($exportConfigHash.value).toBe(hashBeforeChange);
  });

  afterEach(() => {
    cleanupFakeTimersAndRAF();
  });
});
