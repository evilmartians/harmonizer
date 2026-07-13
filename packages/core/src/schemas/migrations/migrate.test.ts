import { describe, expect, test } from "vitest";

import { loadFixture } from "@core/test-utils";
import { MigrationError } from "@core/utils/errors/MigrationError";

import { migrate } from "./migrate";

const legacyCompactConfig = [
  ["500", 51, null],
  ["blue", 250],
  ["apca", "fgToBg", "even", "#fff", "#000", 1, "p3"],
];

describe(migrate, () => {
  test("passes v1 config through unchanged (no-op fast path)", () => {
    const config = loadFixture("configs/v1/minimal.json");
    const result = migrate(config, 1);

    expect(result.version).toBe(1);
    expect(result.levels).toHaveLength(1);
    expect(result.hues).toHaveLength(1);
  });

  test("migrates legacy compact tuple from version 0 to v1", () => {
    const result = migrate(legacyCompactConfig, 0);

    expect(result.version).toBe(1);
    expect(result.levels).toEqual([{ name: "500", contrast: 51, chroma: 0, chromaCap: null }]);
    expect(result.hues).toEqual([{ name: "blue", angle: 250 }]);
    expect(result.settings).toMatchObject({
      contrastModel: "apca",
      directionMode: "fgToBg",
      chromaMode: "even",
      bgColorLight: "#fff",
      bgColorDark: "#000",
      bgLightStart: 1,
      colorSpace: "p3",
    });
  });

  test("throws MigrationError for version ahead of latest", () => {
    const config = loadFixture("configs/v1/minimal.json");

    expect(() => migrate(config, 2)).toThrow(MigrationError);
    expect(() => migrate(config, 2)).toThrow("newer than the latest supported version 1");
  });

  test.each([1.5, -1, Number.NaN])("throws MigrationError for malformed version %s", (version) => {
    const config = loadFixture("configs/v1/minimal.json");

    expect(() => migrate(config, version)).toThrow(MigrationError);
    expect(() => migrate(config, version)).toThrow("Invalid config version");
  });

  test("throws MigrationError with cause when legacy migration fails", () => {
    expect(() => migrate({ not: "a tuple" }, 0)).toThrow(MigrationError);
    expect(() => migrate({ not: "a tuple" }, 0)).toThrow("Migration to version 1 failed");
  });

  test("throws when migrated result fails final schema validation", () => {
    // Version is valid but the rest of the config is missing
    expect(() => migrate({ version: 1 }, 1)).toThrow();
  });
});
