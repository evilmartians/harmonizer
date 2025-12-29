import { describe, expect, test } from "vitest";

import { loadFixture } from "@core/test-utils";
import { ValidationError } from "@core/utils/errors/ValidationError";

import {
  type CompactExportConfig,
  type ExportConfig,
  parseCompactExportConfig,
  parseExportConfig,
  toCompactExportConfig,
  toExportConfig,
} from "./exportConfig";

function loadConfigFixture(filePath: string): Record<string, unknown> {
  return loadFixture(filePath) as Record<string, unknown>;
}

describe(parseExportConfig, () => {
  test("parses JSON string input", () => {
    const config = loadConfigFixture("configs/v1/minimal.json");
    const jsonString = JSON.stringify(config);
    const result = parseExportConfig(jsonString);

    expect(result).toBeDefined();
    expect(result.levels).toHaveLength(1);
    expect(result.hues).toHaveLength(1);
  });

  test("parses object input directly", () => {
    const config = loadConfigFixture("configs/v1/minimal.json");
    const result = parseExportConfig(config);

    expect(result).toBeDefined();
    expect(result.levels).toHaveLength(1);
  });

  test("parses config without version field", () => {
    const config = loadConfigFixture("configs/v1/no-version.json");
    const result = parseExportConfig(config);

    expect(result).toBeDefined();
    expect(result.levels).toHaveLength(3);
    expect(result.hues).toHaveLength(2);
  });

  test("throws ValidationError for invalid JSON string", () => {
    const invalidJson = "{ invalid json }";

    expect(() => parseExportConfig(invalidJson)).toThrow(ValidationError);
    expect(() => parseExportConfig(invalidJson)).toThrow("cannot parse JSON");
  });

  test("throws ValidationError for missing required fields", () => {
    const invalidConfig = {
      levels: [{ name: "500", contrast: 51, chroma: 0 }],
      // Missing hues and settings
    };

    expect(() => parseExportConfig(invalidConfig)).toThrow(ValidationError);
  });

  test("throws ValidationError for out-of-bounds contrast", () => {
    const invalidConfig = {
      levels: [{ name: "500", contrast: 999, chroma: 0 }],
      hues: [{ name: "blue", angle: 250 }],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 5,
      },
    };

    expect(() => parseExportConfig(invalidConfig)).toThrow(ValidationError);
  });

  test("throws for cross-field validation errors (contrast bounds)", () => {
    const invalidConfig = {
      levels: [{ name: "500", contrast: 200, chroma: 0 }],
      hues: [{ name: "blue", angle: 250 }],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 5,
      },
    };

    expect(() => parseExportConfig(invalidConfig)).toThrow(ValidationError);
  });

  test("parses config with chromaCap null", () => {
    const config = {
      levels: [{ name: "500", contrast: 51, chroma: 0, chromaCap: null }],
      hues: [{ name: "blue", angle: 250 }],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 5,
      },
    };
    const result = parseExportConfig(config);

    expect(result.levels[0]?.chromaCap).toBeNull();
  });

  test("parses config with chromaCap number", () => {
    const config = {
      levels: [{ name: "500", contrast: 51, chroma: 0, chromaCap: 0.3 }],
      hues: [{ name: "blue", angle: 250 }],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 5,
      },
    };
    const result = parseExportConfig(config);

    expect(result.levels[0]?.chromaCap).toBe(0.3);
  });

  test("parses config with all fields", () => {
    const config = {
      levels: [
        { name: "100", contrast: 100, chroma: 0 },
        { name: "500", contrast: 51, chroma: 0 },
      ],
      hues: [
        { name: "red", angle: 0 },
        { name: "blue", angle: 250 },
      ],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 5,
      },
    };
    const result = parseExportConfig(config);

    expect(result.levels).toHaveLength(2);
    expect(result.hues).toHaveLength(2);
    expect(result.settings).toMatchObject({
      contrastModel: "apca",
      directionMode: "fgToBg",
      chromaMode: "even",
      colorSpace: "p3",
      bgColorLight: "#fff",
      bgColorDark: "#000",
      bgLightStart: 5,
    });
  });
});

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

describe(toCompactExportConfig, () => {
  test("converts to flat array format", () => {
    const config = {
      levels: [
        { name: "100", contrast: 100, chroma: 0 },
        { name: "500", contrast: 51, chroma: 0 },
      ],
      hues: [
        { name: "red", angle: 0 },
        { name: "blue", angle: 250 },
      ],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 5,
      },
    } as ExportConfig;
    const result = toCompactExportConfig(config);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(["100", 100, null, "500", 51, null]);
    expect(result[1]).toEqual(["red", 0, "blue", 250]);
    expect(result[2]).toEqual(["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"]);
  });

  test("handles chromaCap null correctly", () => {
    const config = {
      levels: [{ name: "500", contrast: 51, chroma: 0 }],
      hues: [{ name: "blue", angle: 250 }],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 5,
      },
    } as ExportConfig;
    const result = toCompactExportConfig(config);

    expect(result[0]).toContain(null);
  });

  test("handles chromaCap number correctly", () => {
    const config = {
      levels: [{ name: "500", contrast: 51, chroma: 0, chromaCap: 0.3 }],
      hues: [{ name: "blue", angle: 250 }],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 5,
      },
    } as ExportConfig;
    const result = toCompactExportConfig(config);

    expect(result[0]).toContain(0.3);
  });

  test("preserves all data", () => {
    const config = loadFixture("configs/v1/no-version.json") as ExportConfig;
    const result = toCompactExportConfig(config);

    expect(result[0]).toHaveLength(config.levels.length * 3);
    expect(result[1]).toHaveLength(config.hues.length * 2);
    expect(result[2]).toHaveLength(7);
  });
});

describe(toExportConfig, () => {
  test("converts from compact format", () => {
    const compactConfig = [
      ["500", 51, null],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ] as CompactExportConfig;
    const result = toExportConfig(compactConfig);

    expect(result.levels).toHaveLength(1);
    expect(result.levels[0]).toMatchObject({ name: "500", contrast: 51, chroma: 0 });
    expect(result.hues).toHaveLength(1);
    expect(result.hues[0]).toMatchObject({ name: "blue", angle: 250 });
  });

  test("sets chroma to 0 for all levels", () => {
    const compactConfig = [
      ["100", 100, null, "500", 51, null],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ] as CompactExportConfig;
    const result = toExportConfig(compactConfig);

    expect(result.levels.every((level) => level.chroma === 0)).toBe(true);
  });

  test("handles null chromaCap", () => {
    const compactConfig = [
      ["500", 51, null],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ] as CompactExportConfig;
    const result = toExportConfig(compactConfig);

    expect(result.levels[0]?.chromaCap).toBeNull();
  });

  test("handles number chromaCap", () => {
    const compactConfig = [
      ["500", 51, 0.3],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ] as CompactExportConfig;
    const result = toExportConfig(compactConfig);

    expect(result.levels[0]?.chromaCap).toBe(0.3);
  });

  test("preserves settings correctly", () => {
    const compactConfig = [
      ["500", 51, null],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ] as CompactExportConfig;
    const result = toExportConfig(compactConfig);

    expect(result.settings).toEqual({
      contrastModel: "apca",
      directionMode: "fgToBg",
      chromaMode: "even",
      bgColorLight: "#fff",
      bgColorDark: "#000",
      bgLightStart: 5,
      colorSpace: "p3",
    });
  });

  test("reconstructs multiple levels from flat array", () => {
    const compactConfig = [
      ["100", 100, null, "500", 51, null, "900", 100, 0.3],
      ["blue", 250],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ] as CompactExportConfig;
    const result = toExportConfig(compactConfig);

    expect(result.levels).toHaveLength(3);
    expect(result.levels[0]).toMatchObject({ name: "100", contrast: 100 });
    expect(result.levels[1]).toMatchObject({ name: "500", contrast: 51 });
    expect(result.levels[2]).toMatchObject({ name: "900", contrast: 100, chromaCap: 0.3 });
  });

  test("reconstructs multiple hues from flat array", () => {
    const compactConfig = [
      ["500", 51, null],
      ["red", 0, "blue", 240, "green", 120],
      ["apca", "fgToBg", "even", "#fff", "#000", 5, "p3"],
    ] as CompactExportConfig;
    const result = toExportConfig(compactConfig);

    expect(result.hues).toHaveLength(3);
    expect(result.hues[0]).toMatchObject({ name: "red", angle: 0 });
    expect(result.hues[1]).toMatchObject({ name: "blue", angle: 240 });
    expect(result.hues[2]).toMatchObject({ name: "green", angle: 120 });
  });
});

describe("roundtrip", () => {
  test("config → compact → config preserves data", () => {
    const originalConfig = {
      levels: [
        { name: "100", contrast: 100, chroma: 0 },
        { name: "500", contrast: 51, chroma: 0, chromaCap: 0.3 },
        { name: "900", contrast: 100, chroma: 0 },
      ],
      hues: [
        { name: "red", angle: 0 },
        { name: "blue", angle: 250 },
      ],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 5,
      },
    } as ExportConfig;
    const compact = toCompactExportConfig(originalConfig);
    const restored = toExportConfig(compact);

    expect(restored.levels).toHaveLength(originalConfig.levels.length);
    expect(restored.hues).toHaveLength(originalConfig.hues.length);
    expect(restored.settings).toEqual(originalConfig.settings);

    for (const [i, level] of restored.levels.entries()) {
      expect(level.name).toBe(originalConfig.levels[i]?.name);
      expect(level.contrast).toBe(originalConfig.levels[i]?.contrast);
      // chromaCap: undefined becomes null in compact, then null in restored
      const originalCap = originalConfig.levels[i]?.chromaCap;
      const restoredCap = level.chromaCap;
      if (originalCap === undefined) {
        expect(restoredCap).toBeNull();
      } else {
        expect(restoredCap).toBe(originalCap);
      }
    }
  });

  test("works with minimal fixture", () => {
    const config = parseExportConfig(loadConfigFixture("configs/v1/minimal.json"));
    const compact = toCompactExportConfig(config);
    const restored = toExportConfig(compact);

    expect(restored.levels).toHaveLength(config.levels.length);
    expect(restored.hues).toHaveLength(config.hues.length);
  });

  test("works with full fixture", () => {
    const config = parseExportConfig(loadConfigFixture("configs/v1/no-version.json"));
    const compact = toCompactExportConfig(config);
    const restored = toExportConfig(compact);

    expect(restored.levels).toHaveLength(3);
    expect(restored.hues).toHaveLength(2);
  });

  test("works with chromaCap fixture", () => {
    const config = parseExportConfig(loadConfigFixture("configs/v1/with-chromacap.json"));
    const compact = toCompactExportConfig(config);
    const restored = toExportConfig(compact);

    expect(restored.levels[0]?.chromaCap).toBe(0.3);
    // undefined chromaCap becomes null after roundtrip
    expect(restored.levels[1]?.chromaCap).toBeNull();
  });
});

describe("fixtures", () => {
  test("minimal.json parses correctly", () => {
    const config = loadConfigFixture("configs/v1/minimal.json");
    const result = parseExportConfig(config);

    expect(result.levels).toHaveLength(1);
    expect(result.hues).toHaveLength(1);
  });

  test("no-version.json parses correctly", () => {
    const config = loadConfigFixture("configs/v1/no-version.json");
    const result = parseExportConfig(config);

    expect(result.levels).toHaveLength(3);
    expect(result.hues).toHaveLength(2);
  });

  test("with-chromacap.json parses and preserves chromaCap", () => {
    const config = loadConfigFixture("configs/v1/with-chromacap.json");
    const result = parseExportConfig(config);

    expect(result.levels[0]?.chromaCap).toBe(0.3);
    // Valibot optional() keeps explicit null as null (only omitted fields become undefined)
    expect(result.levels[1]?.chromaCap).toBeNull();
    expect(result.levels[2]?.chromaCap).toBeUndefined();
  });

  test("future-version.json is not rejected (no version validation yet)", () => {
    const config = loadConfigFixture("configs/invalid/future-version.json");
    // Currently there's no version validation, so this should parse fine
    const result = parseExportConfig(config);

    expect(result).toBeDefined();
  });

  test("malformed.json throws ValidationError", () => {
    const config = loadConfigFixture("configs/invalid/malformed.json");

    expect(() => parseExportConfig(config)).toThrow(ValidationError);
  });
});
