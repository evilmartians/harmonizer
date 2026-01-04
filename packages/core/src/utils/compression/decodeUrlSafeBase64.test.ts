import { describe, expect, test } from "vitest";

import { decodeUrlSafeBase64 } from "./decodeUrlSafeBase64";
import { encodeUrlSafeBase64 } from "./encodeUrlSafeBase64";

describe(decodeUrlSafeBase64, () => {
  test("decodes URL-safe base64 to Uint8Array", () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const encoded = encodeUrlSafeBase64(bytes);
    const decoded = decodeUrlSafeBase64(encoded);

    expect(decoded).toBeInstanceOf(Uint8Array);
    expect(decoded).toEqual(bytes);
  });

  test("handles data without padding", () => {
    const bytes = new Uint8Array([1, 2, 3]);
    const encoded = encodeUrlSafeBase64(bytes);

    // Encoded should have no padding
    expect(encoded).not.toContain("=");

    const decoded = decodeUrlSafeBase64(encoded);
    expect(decoded).toEqual(bytes);
  });

  test("handles URL-safe characters (- and _)", () => {
    const bytes = new Uint8Array([251, 239, 255, 239]); // Produces "++//7w==" in standard base64
    const encoded = encodeUrlSafeBase64(bytes);

    // Should have - and _ instead
    expect(encoded).toMatch(/[-_]/);

    const decoded = decodeUrlSafeBase64(encoded);
    expect(decoded).toEqual(bytes);
  });

  test("handles empty string", () => {
    const decoded = decodeUrlSafeBase64("");

    expect(decoded).toBeInstanceOf(Uint8Array);
    expect(decoded.length).toBe(0);
  });

  test("handles large data", () => {
    const bytes = new Uint8Array(10_000).fill(123);
    const encoded = encodeUrlSafeBase64(bytes);
    const decoded = decodeUrlSafeBase64(encoded);

    expect(decoded).toEqual(bytes);
  });

  test("roundtrip with various byte patterns", () => {
    const testCases = [
      new Uint8Array([0]),
      new Uint8Array([255]),
      new Uint8Array([0, 255]),
      new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      new Uint8Array(Array.from({ length: 256 }, (_, i) => i)),
    ];

    for (const original of testCases) {
      const encoded = encodeUrlSafeBase64(original);
      const decoded = decodeUrlSafeBase64(encoded);

      expect(decoded).toEqual(original);
    }
  });

  test("throws on invalid base64", () => {
    expect(() => decodeUrlSafeBase64("!!!invalid!!!")).toThrow();
  });

  // Note: The native Uint8Array.fromBase64 API with base64url alphabet
  // ignores spaces and some invalid characters rather than throwing

  test("roundtrip preserves all byte values", () => {
    // Test all possible byte values
    const allBytes = new Uint8Array(Array.from({ length: 256 }, (_, i) => i));
    const encoded = encodeUrlSafeBase64(allBytes);
    const decoded = decodeUrlSafeBase64(encoded);

    expect(decoded).toEqual(allBytes);
  });

  test("roundtrip with random data", () => {
    const randomBytes = new Uint8Array(1000);
    for (let i = 0; i < randomBytes.length; i++) {
      randomBytes[i] = Math.floor(Math.random() * 256);
    }

    const encoded = encodeUrlSafeBase64(randomBytes);
    const decoded = decodeUrlSafeBase64(encoded);

    expect(decoded).toEqual(randomBytes);
  });
});
