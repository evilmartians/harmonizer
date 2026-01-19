import { describe, expect, test } from "vitest";

import { loadFixture } from "@core/test-utils";
import { deflate } from "@core/utils/compression/deflate";
import { encodeUrlSafeBase64 } from "@core/utils/compression/encodeUrlSafeBase64";
import { ValidationError } from "@core/utils/errors/ValidationError";

import { decodeHashConfig, parseExportConfig } from "./exportConfig";

function loadConfigFixture(filePath: string): Record<string, unknown> {
  return loadFixture(filePath) as Record<string, unknown>;
}

function loadHashFixture(filePath: string): string {
  const fixture = loadFixture(filePath) as { hash: string };
  return fixture.hash;
}

describe(parseExportConfig, () => {
  test("parses JSON string input", async () => {
    const config = loadConfigFixture("configs/v1/minimal.json");
    const jsonString = JSON.stringify(config);
    const result = await parseExportConfig(jsonString);

    expect(result).toBeDefined();
    expect(result.levels).toHaveLength(1);
    expect(result.hues).toHaveLength(1);
  });

  test("parses object input directly", async () => {
    const config = loadConfigFixture("configs/v1/minimal.json");
    const result = await parseExportConfig(config);

    expect(result).toBeDefined();
    expect(result.levels).toHaveLength(1);
  });

  test("parses config without version field", async () => {
    const config = loadConfigFixture("configs/v1/no-version.json");
    const result = await parseExportConfig(config);

    expect(result).toBeDefined();
    expect(result.levels).toHaveLength(3);
    expect(result.hues).toHaveLength(2);
    expect(result.version).toBe(1); // Defaults to 1
  });

  test("parses config with version: 1", async () => {
    const config = {
      version: 1,
      levels: [{ name: "500", contrast: 51, chroma: 0 }],
      hues: [{ name: "blue", angle: 250 }],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        colorSpace: "p3",
        bgColorLight: "#fff",
        bgColorDark: "#000",
        bgLightStart: 1,
      },
    };
    const result = await parseExportConfig(config);

    expect(result.version).toBe(1);
  });

  test("throws for invalid versions", async () => {
    const invalidVersions = [0, -1, "1", 10_000, null];

    for (const version of invalidVersions) {
      const config = {
        version,
        levels: [{ name: "500", contrast: 51, chroma: 0 }],
        hues: [{ name: "blue", angle: 250 }],
        settings: {
          contrastModel: "apca",
          directionMode: "fgToBg",
          chromaMode: "even",
          colorSpace: "p3",
          bgColorLight: "#fff",
          bgColorDark: "#000",
          bgLightStart: 1,
        },
      };

      await expect(parseExportConfig(config)).rejects.toThrow(ValidationError);
    }
  });

  test("throws ValidationError for invalid JSON string", async () => {
    const invalidJson = "{ invalid json }";

    await expect(parseExportConfig(invalidJson)).rejects.toThrow(ValidationError);
    await expect(parseExportConfig(invalidJson)).rejects.toThrow("cannot parse JSON");
  });

  test("throws ValidationError for missing required fields", async () => {
    const invalidConfig = {
      levels: [{ name: "500", contrast: 51, chroma: 0 }],
      // Missing hues and settings
    };

    await expect(parseExportConfig(invalidConfig)).rejects.toThrow(ValidationError);
  });

  test("throws ValidationError for out-of-bounds contrast", async () => {
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

    await expect(parseExportConfig(invalidConfig)).rejects.toThrow(ValidationError);
  });

  test("throws for cross-field validation errors (contrast bounds)", async () => {
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

    await expect(parseExportConfig(invalidConfig)).rejects.toThrow(ValidationError);
  });

  test("parses config with chromaCap null", async () => {
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
        bgLightStart: 1,
      },
    };
    const result = await parseExportConfig(config);

    expect(result.levels[0]?.chromaCap).toBeNull();
  });

  test("parses config with chromaCap number", async () => {
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
        bgLightStart: 1,
      },
    };
    const result = await parseExportConfig(config);

    expect(result.levels[0]?.chromaCap).toBe(0.3);
  });

  test("parses config with all fields", async () => {
    const config = {
      levels: [
        { name: "100", contrast: 100, chroma: 0 },
        { name: "200", contrast: 90, chroma: 0 },
        { name: "300", contrast: 77, chroma: 0 },
        { name: "400", contrast: 65, chroma: 0 },
        { name: "500", contrast: 51, chroma: 0 },
        { name: "600", contrast: 65, chroma: 0 },
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
    const result = await parseExportConfig(config);

    expect(result.levels).toHaveLength(6);
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

describe(decodeHashConfig, () => {
  describe("new format (deflate + url-safe base64)", () => {
    test("should decode a full v1 config", async () => {
      const fullConfigV1 = loadConfigFixture("configs/v1/full.json");
      const compressed = await deflate(JSON.stringify(fullConfigV1));
      const hash = encodeUrlSafeBase64(compressed);
      const result = await decodeHashConfig(hash);

      expect(result?.version).toBe(1);
      expect(result?.levels).toHaveLength(9);
      expect(result?.hues).toHaveLength(5);
      expect(result?.settings.contrastModel).toBe("apca");
    });

    test("should decode a minimal v1 config", async () => {
      const minimalConfigV1 = loadConfigFixture("configs/v1/minimal.json");
      const compressed = await deflate(JSON.stringify(minimalConfigV1));
      const hash = encodeUrlSafeBase64(compressed);
      const result = await decodeHashConfig(hash);

      expect(result?.version).toBe(1);
      expect(result?.levels).toHaveLength(1);
      expect(result?.hues).toHaveLength(1);
    });

    test("should handle hash with # prefix", async () => {
      const fullConfigV1 = loadConfigFixture("configs/v1/full.json");
      const compressed = await deflate(JSON.stringify(fullConfigV1));
      const hash = `#${encodeUrlSafeBase64(compressed)}`;
      const result = await decodeHashConfig(hash);

      expect(result?.version).toBe(1);
      expect(result?.levels).toHaveLength(9);
    });
  });

  describe("legacy format (real hashes from v1)", () => {
    test("should decode legacy APCA config hash", async () => {
      const legacyHashApca = loadHashFixture("legacy/hashes/apca.json");
      const result = await decodeHashConfig(legacyHashApca);

      expect(result?.version).toBe(1);
      expect(result?.settings.contrastModel).toBe("apca");
      expect(result?.levels.length).toEqual(2);
      expect(result?.hues.length).toEqual(2);
    });

    test("should decode legacy WCAG config hash", async () => {
      const legacyHashWcag = loadHashFixture("legacy/hashes/wcag.json");
      const result = await decodeHashConfig(legacyHashWcag);

      expect(result?.version).toBe(1);
      expect(result?.settings.contrastModel).toBe("wcag");
      expect(result?.levels.length).toEqual(1);
      expect(result?.hues.length).toEqual(1);
    });

    test("should decode legacy full config hash", async () => {
      const legacyHashFull = loadHashFixture("legacy/hashes/full.json");
      const result = await decodeHashConfig(legacyHashFull);

      expect(result?.version).toBe(1);
      expect(result?.levels.length).equal(9);
      expect(result?.hues.length).equal(5);
    });

    test("should handle legacy hash with # prefix", async () => {
      const legacyHashApca = loadHashFixture("legacy/hashes/apca.json");
      const result = await decodeHashConfig(`#${legacyHashApca}`);

      expect(result?.version).toBe(1);
      expect(result?.settings.contrastModel).toBe("apca");
    });
  });

  describe("fallback behavior", () => {
    const legacyHashInvalid = loadHashFixture("legacy/hashes/invalid.json");

    test.each([legacyHashInvalid, "", "#", "not-valid-base64-!@#$%"])(
      "should return null for invalid hash: '%s'",
      async (hash) => {
        const result = await decodeHashConfig(hash);

        expect(result).toBeNull();
      },
    );
  });

  describe("compression roundtrip", () => {
    test("should correctly roundtrip compress/decompress JSON", async () => {
      const original = loadConfigFixture("configs/v1/full.json");
      const compressed = await deflate(JSON.stringify(original));
      const encoded = encodeUrlSafeBase64(compressed);

      const result = await decodeHashConfig(encoded);

      expect(result?.version).toBe(original.version);
      expect(result?.levels).toHaveLength(9);
      expect(result?.hues).toHaveLength(5);
      expect(result?.settings.contrastModel).toBe("apca");
    });
  });
});

describe("fixtures", () => {
  test("minimal.json parses correctly", async () => {
    const config = loadConfigFixture("configs/v1/minimal.json");
    const result = await parseExportConfig(config);

    expect(result.levels).toHaveLength(1);
    expect(result.hues).toHaveLength(1);
  });

  test("no-version.json parses correctly", async () => {
    const config = loadConfigFixture("configs/v1/no-version.json");
    const result = await parseExportConfig(config);

    expect(result.levels).toHaveLength(3);
    expect(result.hues).toHaveLength(2);
  });

  test("with-chromacap.json parses and preserves chromaCap", async () => {
    const config = loadConfigFixture("configs/v1/with-chromacap.json");
    const result = await parseExportConfig(config);

    expect(result.levels[0]?.chromaCap).toBe(0.3);
    // Valibot optional() keeps explicit null as null (only omitted fields become undefined)
    expect(result.levels[1]?.chromaCap).toBeNull();
    expect(result.levels[2]?.chromaCap).toBeUndefined();
  });

  test("future-version.json is not rejected (no version validation yet)", async () => {
    const config = loadConfigFixture("configs/invalid/future-version.json");

    await expect(parseExportConfig(config)).rejects.toThrow(ValidationError);
  });

  test("malformed.json throws ValidationError", async () => {
    const config = loadConfigFixture("configs/invalid/malformed.json");

    await expect(parseExportConfig(config)).rejects.toThrow(ValidationError);
  });
});
