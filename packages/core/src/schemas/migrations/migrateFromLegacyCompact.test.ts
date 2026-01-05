import { describe, expect, test } from "vitest";

import { parseCompactExportConfig } from "./migrateFromLegacyCompact";

describe(parseCompactExportConfig, () => {
  test("parses valid compact array format", () => {
    // [levelsFlat, huesFlat, settings]
    const compactConfig = [
      ["500", 51, null],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ];
    const result = parseCompactExportConfig(compactConfig);

    expect(result).toBeDefined();
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(["500", 51, null]);
    expect(result[1]).toEqual(["blue", 250]);
    expect(result[2]).toHaveLength(7);
  });

  test("parses levels flat array with multiple levels", () => {
    // levelsFlat has 9 elements (3 levels × 3 values)
    const compactConfig = [
      ["100", 100, null, "500", 51, null, "900", 100, null],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ];
    const result = parseCompactExportConfig(compactConfig);

    expect(result[0]).toHaveLength(9);
    expect(result[0][0]).toBe("100");
    expect(result[0][3]).toBe("500");
    expect(result[0][6]).toBe("900");
  });

  test("parses hues flat array with multiple hues", () => {
    // huesFlat has 6 elements (3 hues × 2 values)
    const compactConfig = [
      ["500", 51, null],
      ["red", 0, "blue", 240, "green", 120],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ];
    const result = parseCompactExportConfig(compactConfig);

    expect(result[1]).toHaveLength(6);
    expect(result[1][0]).toBe("red");
    expect(result[1][2]).toBe("blue");
    expect(result[1][4]).toBe("green");
  });

  test("parses settings tuple with all 7 elements", () => {
    const compactConfig = [
      ["500", 51, null],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ];
    const result = parseCompactExportConfig(compactConfig);

    expect(result[2]).toHaveLength(7);
    expect(result[2]).toEqual(["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"]);
  });

  test("parses config with null chromaCap", () => {
    const compactConfig = [
      ["500", 51, null],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ];
    const result = parseCompactExportConfig(compactConfig);

    expect(result[0][2]).toBeNull();
  });

  test("parses config with number chromaCap", () => {
    const compactConfig = [
      ["500", 51, 0.3],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ];
    const result = parseCompactExportConfig(compactConfig);

    expect(result[0][2]).toBe(0.3);
  });

  test("throws for invalid structure (object instead of array)", () => {
    const invalidCompact = { not: "a tuple" };

    expect(() => parseCompactExportConfig(invalidCompact)).toThrow();
  });

  test("throws for missing elements in tuple", () => {
    const invalidCompact = [["500", 51, null]];

    expect(() => parseCompactExportConfig(invalidCompact)).toThrow();
  });

  test("throws for incomplete tuple (missing hues)", () => {
    const invalidCompact = [
      ["500", 51, null],
      // Missing second element (hues)
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ];

    expect(() => parseCompactExportConfig(invalidCompact)).toThrow();
  });
});
