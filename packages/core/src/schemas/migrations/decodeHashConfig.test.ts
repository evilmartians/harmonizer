import { describe, expect, it } from "vitest";

import { defaultConfig } from "@core/defaultConfig";
import { deflate } from "@core/utils/compression/deflate";
import { encodeUrlSafeBase64 } from "@core/utils/compression/encodeUrlSafeBase64";

// Fixtures
import fullConfigV1 from "../fixtures/configs/v1/full.json";
import minimalConfigV1 from "../fixtures/configs/v1/minimal.json";
import legacyHashApca from "../fixtures/legacy/hashes/apca.json";
import legacyHashFull from "../fixtures/legacy/hashes/full.json";
import legacyHashInvalid from "../fixtures/legacy/hashes/invalid.json";
import legacyHashWcag from "../fixtures/legacy/hashes/wcag.json";

import { decodeHashConfig } from "./decodeHashConfig";

describe("decodeHashConfig", () => {
  describe("new format (deflate + url-safe base64)", () => {
    it("should decode a full v1 config", async () => {
      const compressed = await deflate(JSON.stringify(fullConfigV1));
      const hash = encodeUrlSafeBase64(compressed);
      const result = await decodeHashConfig(hash);

      expect(result.version).toBe(1);
      expect(result.levels).toHaveLength(fullConfigV1.levels.length);
      expect(result.hues).toHaveLength(fullConfigV1.hues.length);
      expect(result.settings.contrastModel).toBe(fullConfigV1.settings.contrastModel);
    });

    it("should decode a minimal v1 config", async () => {
      const compressed = await deflate(JSON.stringify(minimalConfigV1));
      const hash = encodeUrlSafeBase64(compressed);

      const result = await decodeHashConfig(hash);

      expect(result.version).toBe(1);
      expect(result.levels).toHaveLength(minimalConfigV1.levels.length);
      expect(result.hues).toHaveLength(minimalConfigV1.hues.length);
    });

    it("should handle hash with # prefix", async () => {
      const compressed = await deflate(JSON.stringify(fullConfigV1));
      const hash = `#${encodeUrlSafeBase64(compressed)}`;
      const result = await decodeHashConfig(hash);

      expect(result.version).toBe(1);
      expect(result.levels).toHaveLength(fullConfigV1.levels.length);
    });
  });

  describe("legacy format (real hashes from v1)", () => {
    it("should decode legacy APCA config hash", async () => {
      const result = await decodeHashConfig(legacyHashApca.hash);

      expect(result.version).toBe(1);
      expect(result.settings.contrastModel).toBe("apca");
      expect(result.levels.length).toEqual(2);
      expect(result.hues.length).toEqual(2);
    });

    it("should decode legacy WCAG config hash", async () => {
      const result = await decodeHashConfig(legacyHashWcag.hash);

      expect(result.version).toBe(1);
      expect(result.settings.contrastModel).toBe("wcag");
      expect(result.levels.length).toEqual(1);
      expect(result.hues.length).toEqual(1);
    });

    it("should decode legacy full config hash", async () => {
      const result = await decodeHashConfig(legacyHashFull.hash);

      expect(result.version).toBe(1);
      expect(result.levels.length).equal(9);
      expect(result.hues.length).equal(5);
    });

    it("should handle legacy hash with # prefix", async () => {
      const result = await decodeHashConfig(`#${legacyHashApca.hash}`);

      expect(result.version).toBe(1);
      expect(result.settings.contrastModel).toBe("apca");
    });
  });

  describe("fallback behavior", () => {
    it.each([legacyHashInvalid.hash, "", "#", "not-valid-base64-!@#$%"])(
      "should return default config for invalid hash: '%s'",
      async (hash) => {
        const result = await decodeHashConfig(hash);

        expect(result).toEqual(defaultConfig);
      },
    );
  });

  describe("compression roundtrip", () => {
    it("should correctly roundtrip compress/decompress JSON", async () => {
      const original = fullConfigV1;
      const compressed = await deflate(JSON.stringify(original));
      const encoded = encodeUrlSafeBase64(compressed);

      const result = await decodeHashConfig(encoded);

      expect(result.version).toBe(original.version);
      expect(result.levels).toHaveLength(original.levels.length);
      expect(result.hues).toHaveLength(original.hues.length);
      expect(result.settings.contrastModel).toBe(original.settings.contrastModel);
    });
  });
});
