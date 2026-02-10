import { signal } from "@spred/core";
import * as v from "valibot";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { hueNameSchema, levelNameSchema } from "@core/schemas/color";
import {
  ContrastModel,
  HueAngle,
  HueId,
  HueName,
  LevelChroma,
  LevelContrast,
  LevelId,
  LevelName,
} from "@core/types";
import { getClosestColorName } from "@core/utils/colors/getClosestColorName";

import { huesStore, levelsStore } from "./colors";
import { FALLBACK_CELL_COLOR, FALLBACK_HUE_DATA, FALLBACK_LEVEL_DATA } from "./constants";
import { contrastModelStore } from "./settings";
import { createTestHueStore, createTestLevelStore, resetStores } from "./test-utils";
import {
  cleanupColors,
  createIndexedArrayStore,
  getColorIdentifier,
  getColorSignal,
  getHueStore,
  getLevelStore,
  getNameValidationSchemaSignal,
  getNewInsertingHue,
  getNewInsertingLevel,
  matchesHueColorKey,
  matchesLevelColorKey,
} from "./utils";

describe(createIndexedArrayStore, () => {
  type TestItem = { id: string; value: number };

  test("initializes with empty array", () => {
    const store = createIndexedArrayStore<TestItem>([]);

    expect(store.$ids.value).toEqual([]);
    expect(store.items.size).toBe(0);
  });

  test("initializes with items", () => {
    const items: TestItem[] = [
      { id: "a", value: 1 },
      { id: "b", value: 2 },
    ];
    const store = createIndexedArrayStore(items);

    expect(store.$ids.value).toEqual(["a", "b"]);
    expect(store.items.size).toBe(2);
    expect(store.getItem("a")).toEqual({ id: "a", value: 1 });
    expect(store.getItem("b")).toEqual({ id: "b", value: 2 });
  });

  test("$idsToIndex maps ids to indices", () => {
    const items: TestItem[] = [
      { id: "x", value: 10 },
      { id: "y", value: 20 },
      { id: "z", value: 30 },
    ];
    const store = createIndexedArrayStore(items);

    expect(store.$idsToIndex.value).toEqual({ x: 0, y: 1, z: 2 });
  });

  test("addItem adds item at end by default", () => {
    const store = createIndexedArrayStore<TestItem>([{ id: "a", value: 1 }]);

    store.addItem({ id: "b", value: 2 });

    expect(store.$ids.value).toEqual(["a", "b"]);
    expect(store.getItem("b")).toEqual({ id: "b", value: 2 });
  });

  test("addItem adds item at specific index", () => {
    const store = createIndexedArrayStore<TestItem>([
      { id: "a", value: 1 },
      { id: "c", value: 3 },
    ]);

    store.addItem({ id: "b", value: 2 }, 1);

    expect(store.$ids.value).toEqual(["a", "b", "c"]);
  });

  test("getItem throws for non-existent id", () => {
    const store = createIndexedArrayStore<TestItem>([]);

    expect(() => store.getItem("nonexistent")).toThrow("Item with id nonexistent not found");
  });

  test("removeItem removes item and updates ids", () => {
    const store = createIndexedArrayStore<TestItem>([
      { id: "a", value: 1 },
      { id: "b", value: 2 },
      { id: "c", value: 3 },
    ]);

    store.removeItem("b");

    expect(store.$ids.value).toEqual(["a", "c"]);
    expect(store.items.has("b")).toBe(false);
  });

  test("overwrite replaces all items", () => {
    const store = createIndexedArrayStore<TestItem>([
      { id: "old1", value: 1 },
      { id: "old2", value: 2 },
    ]);

    store.overwrite([
      { id: "new1", value: 10 },
      { id: "new2", value: 20 },
      { id: "new3", value: 30 },
    ]);

    expect(store.$ids.value).toEqual(["new1", "new2", "new3"]);
    expect(store.items.size).toBe(3);
    expect(store.items.has("old1")).toBe(false);
    expect(store.getItem("new1")).toEqual({ id: "new1", value: 10 });
  });
});

describe(getColorSignal, () => {
  test("creates signal with initial value", () => {
    const $color = getColorSignal({ l: 50, c: 0.1, h: 180 });

    expect($color.value).toEqual({ l: 50, c: 0.1, h: 180 });
  });

  test("uses shallow equality for updates", () => {
    const $color = getColorSignal({ a: 1, b: 2 });
    const listener = vi.fn();

    // Listen to changes
    $color.subscribe(listener);
    listener.mockClear();

    // Setting equal value should not trigger
    $color.set({ a: 1, b: 2 });
    expect(listener).not.toHaveBeenCalled();

    // Setting different value should trigger
    $color.set({ a: 1, b: 3 });
    expect(listener).toHaveBeenCalled();
  });
});

describe(getColorIdentifier, () => {
  test("combines levelId and hueId with hyphen", () => {
    const levelId = LevelId("level-1");
    const hueId = HueId("hue-1");

    expect(getColorIdentifier(levelId, hueId)).toBe("level-1-hue-1");
  });
});

describe(matchesLevelColorKey, () => {
  test("returns true when key starts with levelId", () => {
    const colorKey = getColorIdentifier(LevelId("level-123"), HueId("hue-456"));

    expect(matchesLevelColorKey(colorKey, LevelId("level-123"))).toBe(true);
  });

  test("returns false when key does not start with levelId", () => {
    const colorKey = getColorIdentifier(LevelId("level-123"), HueId("hue-456"));

    expect(matchesLevelColorKey(colorKey, LevelId("level-999"))).toBe(false);
    expect(matchesLevelColorKey(colorKey, LevelId("hue-456"))).toBe(false);
  });

  test("prefix collision: does not match when levelId is a prefix of another segment", () => {
    const colorKey = getColorIdentifier(LevelId("level-10"), HueId("hue-5"));

    expect(matchesLevelColorKey(colorKey, LevelId("level-1"))).toBe(false);
  });
});

describe(matchesHueColorKey, () => {
  test("returns true when key ends with hueId", () => {
    const colorKey = getColorIdentifier(LevelId("level-123"), HueId("hue-456"));

    expect(matchesHueColorKey(colorKey, HueId("hue-456"))).toBe(true);
  });

  test("returns false when key does not end with hueId", () => {
    const colorKey = getColorIdentifier(LevelId("level-123"), HueId("hue-456"));

    expect(matchesHueColorKey(colorKey, HueId("hue-999"))).toBe(false);
    expect(matchesHueColorKey(colorKey, HueId("level-123"))).toBe(false);
  });

  test("suffix collision: does not match when hueId is a non-separator-bounded suffix of the hue segment", () => {
    // "c-xyz" is a suffix of the actual hue "bc-xyz", but not preceded by "-" in the key
    const colorKey = getColorIdentifier(LevelId("a"), HueId("bc-xyz"));

    expect(matchesHueColorKey(colorKey, HueId("c-xyz"))).toBe(false);
  });
});

describe(cleanupColors, () => {
  function getColorsMap() {
    return new Map([
      [getColorIdentifier(LevelId("level-1"), HueId("hue-1")), signal(FALLBACK_CELL_COLOR)],
      [getColorIdentifier(LevelId("level-1"), HueId("hue-2")), signal(FALLBACK_CELL_COLOR)],
      [getColorIdentifier(LevelId("level-2"), HueId("hue-1")), signal(FALLBACK_CELL_COLOR)],
      [getColorIdentifier(LevelId("level-2"), HueId("hue-2")), signal(FALLBACK_CELL_COLOR)],
    ]);
  }

  test("removes entries matching predicate", () => {
    const colorsMap = getColorsMap();

    cleanupColors(colorsMap, matchesLevelColorKey, LevelId("level-1"));

    expect(colorsMap.size).toBe(2);
    expect(colorsMap.has(getColorIdentifier(LevelId("level-1"), HueId("hue-1")))).toBe(false);
    expect(colorsMap.has(getColorIdentifier(LevelId("level-1"), HueId("hue-2")))).toBe(false);
    expect(colorsMap.has(getColorIdentifier(LevelId("level-2"), HueId("hue-1")))).toBe(true);
    expect(colorsMap.has(getColorIdentifier(LevelId("level-2"), HueId("hue-2")))).toBe(true);
  });

  test("works with hue predicate", () => {
    const colorsMap = getColorsMap();

    cleanupColors(colorsMap, matchesHueColorKey, HueId("hue-1"));

    expect(colorsMap.size).toBe(2);
    expect(colorsMap.has(getColorIdentifier(LevelId("level-1"), HueId("hue-2")))).toBe(true);
    expect(colorsMap.has(getColorIdentifier(LevelId("level-2"), HueId("hue-2")))).toBe(true);
    expect(colorsMap.has(getColorIdentifier(LevelId("level-1"), HueId("hue-1")))).toBe(false);
    expect(colorsMap.has(getColorIdentifier(LevelId("level-2"), HueId("hue-1")))).toBe(false);
  });
});

describe(getNameValidationSchemaSignal, () => {
  beforeEach(() => {
    resetStores();
  });

  test("validates unique names case-insensitively", () => {
    const level1 = createTestLevelStore({ name: "Primary" });
    levelsStore.addItem(level1);

    const $schema = getNameValidationSchemaSignal(level1.id, levelNameSchema, levelsStore);

    // Own name should be valid
    const ownResult = v.safeParse($schema.value, "Primary");
    expect(ownResult.success).toBe(true);

    // Different name should be valid
    const differentResult = v.safeParse($schema.value, "Secondary");
    expect(differentResult.success).toBe(true);
  });

  test("rejects duplicate names from other items", () => {
    const level1 = createTestLevelStore({ name: "Primary" });
    const level2 = createTestLevelStore({ name: "Secondary" });
    levelsStore.addItem(level1);
    levelsStore.addItem(level2);

    const $schema = getNameValidationSchemaSignal(level2.id, levelNameSchema, levelsStore);

    // Trying to use level1's name should fail
    const duplicateResult = v.safeParse($schema.value, "Primary");
    expect(duplicateResult.success).toBe(false);
    if (!duplicateResult.success) {
      expect(duplicateResult.issues[0].message).toBe("Name must be unique");
    }

    // Case-insensitive check
    const caseInsensitiveResult = v.safeParse($schema.value, "primary");
    expect(caseInsensitiveResult.success).toBe(false);
  });

  test("validates unique hue names", () => {
    const hue1 = createTestHueStore({ name: "Red" });
    const hue2 = createTestHueStore({ name: "Blue" });
    huesStore.addItem(hue1);
    huesStore.addItem(hue2);

    const $schema = getNameValidationSchemaSignal(hue2.id, hueNameSchema, huesStore);

    const duplicateResult = v.safeParse($schema.value, "Red");
    expect(duplicateResult.success).toBe(false);

    const ownResult = v.safeParse($schema.value, "Blue");
    expect(ownResult.success).toBe(true);

    const uniqueResult = v.safeParse($schema.value, "Green");
    expect(uniqueResult.success).toBe(true);
  });
});

describe(getLevelStore, () => {
  beforeEach(() => {
    resetStores();
  });

  test("creates level with validation stores", () => {
    const level = getLevelStore({
      name: LevelName("500"),
      contrast: LevelContrast(50),
      chroma: LevelChroma(0.1),
      chromaCap: LevelChroma(0.2),
    });

    expect(level.id).toBeDefined();
    expect(level.name.$raw.value).toBe("500");
    expect(level.contrast.$lastValidValue.value).toBe(50);
    expect(level.chroma.$lastValidValue.value).toBe(0.1);
    expect(level.chromaCap.$lastValidValue.value).toBe(0.2);
  });

  test("uses fallback tintColor when not provided", () => {
    const level = getLevelStore({
      name: LevelName("500"),
      contrast: LevelContrast(50),
      chroma: LevelChroma(0),
    });

    expect(level.$tintColor.value).toEqual(FALLBACK_LEVEL_DATA.tintColor);
  });

  test("uses null chromaCap when not provided", () => {
    const level = getLevelStore({
      name: LevelName("500"),
      contrast: LevelContrast(50),
      chroma: LevelChroma(0),
    });

    expect(level.chromaCap.$raw.value).toBeNull();
  });
});

describe(getHueStore, () => {
  beforeEach(() => {
    resetStores();
  });

  test("creates hue with validation stores", () => {
    const hue = getHueStore({
      name: HueName("Blue"),
      angle: HueAngle(250),
    });

    expect(hue.id).toBeDefined();
    expect(hue.name.$raw.value).toBe("Blue");
    expect(hue.angle.$lastValidValue.value).toBe(250);
  });

  test("uses fallback tintColor when not provided", () => {
    const hue = getHueStore({
      name: HueName("Blue"),
      angle: HueAngle(250),
    });

    expect(hue.$tintColor.value).toEqual(FALLBACK_HUE_DATA.tintColor);
  });

  test("$closestColorName derives from angle", () => {
    const hue = getHueStore({
      name: HueName("Custom"),
      angle: HueAngle(250),
    });

    expect(hue.$closestColorName.value).toBe("Azure");
  });
});

describe(getNewInsertingLevel, () => {
  beforeEach(() => {
    resetStores();
  });

  test("creates level with default values when no existing levels", () => {
    const level = getNewInsertingLevel(0, []);

    expect(level.id).toBeDefined();
    expect(level.name.$raw.value).toBe(FALLBACK_LEVEL_DATA.name);
    expect(level.contrast.$raw.value).toBe(FALLBACK_LEVEL_DATA.contrast);
  });

  test("creates level with interpolated values between existing levels", () => {
    const level1 = createTestLevelStore({ name: "100", contrast: 100 });
    const level2 = createTestLevelStore({ name: "300", contrast: 60 });

    const newLevel = getNewInsertingLevel(1, [level1, level2]);

    expect(newLevel.id).toBeDefined();
    expect(newLevel.name.$raw.value).toBe("200");
    expect(newLevel.contrast.$raw.value).toBe(80);
  });

  test("uses contrast model for schema validation", () => {
    contrastModelStore.$raw.set(ContrastModel("wcag"));

    const level = getNewInsertingLevel(0, []);

    level.contrast.$raw.set(100);
    expect(level.contrast.$validationError.value).not.toBeNull();

    level.contrast.$raw.set(7);
    expect(level.contrast.$validationError.value).toBeNull();
  });
});

describe(getNewInsertingHue, () => {
  beforeEach(() => {
    resetStores();
  });

  test("creates hue with fallback values when no existing hues", () => {
    const hue = getNewInsertingHue(0, []);

    expect(hue.id).toBeDefined();
    expect(hue.name.$raw.value).toBe(FALLBACK_HUE_DATA.name);
    expect(hue.angle.$raw.value).toBe(FALLBACK_HUE_DATA.angle);
  });

  test("creates hue with interpolated angle between existing hues", () => {
    const hue1 = createTestHueStore({ name: "Red", angle: 0 });
    const hue2 = createTestHueStore({ name: "Green", angle: 120 });

    const newHue = getNewInsertingHue(1, [hue1, hue2]);

    expect(newHue.id).toBeDefined();
    expect(newHue.angle.$lastValidValue.value).toBe(60);
  });

  test("derives name from closest color for new angle", () => {
    const hue1 = createTestHueStore({ angle: 0 });
    const hue2 = createTestHueStore({ angle: 200 });

    const newHue = getNewInsertingHue(1, [hue1, hue2]);

    expect(newHue.angle.$lastValidValue.value).toBe(100);
    expect(newHue.name.$raw.value).toBe(getClosestColorName(HueAngle(100)));
  });
});
