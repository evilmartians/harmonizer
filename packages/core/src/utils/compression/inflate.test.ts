import { describe, expect, test } from "vitest";

import { deflate } from "./deflate";
import { inflate } from "./inflate";

describe(inflate, () => {
  test("decompresses Uint8Array back to original string", async () => {
    const original = "Hello, World!";
    const compressed = await deflate(original);
    const decompressed = await inflate(compressed);

    expect(decompressed).toBe(original);
  });

  test("handles Unicode characters", async () => {
    const original = "Hello 世界! 🌍 Привет";
    const compressed = await deflate(original);
    const decompressed = await inflate(compressed);

    expect(decompressed).toBe(original);
  });

  test("handles empty string", async () => {
    const original = "";
    const compressed = await deflate(original);
    const decompressed = await inflate(compressed);

    expect(decompressed).toBe(original);
  });

  test("handles large data", async () => {
    const original = "x".repeat(10_000);
    const compressed = await deflate(original);
    const decompressed = await inflate(compressed);

    expect(decompressed).toBe(original);
  });

  test("handles JSON data", async () => {
    const original = JSON.stringify({
      version: 1,
      data: "test",
      numbers: [1, 2, 3],
    });

    const compressed = await deflate(original);
    const decompressed = await inflate(compressed);

    expect(decompressed).toBe(original);
    expect(JSON.parse(decompressed)).toEqual(JSON.parse(original));
  });

  test("throws on corrupted compressed data", async () => {
    // Create invalid compressed data
    const corrupted = new Uint8Array([1, 2, 3, 4, 5]);

    await expect(inflate(corrupted)).rejects.toThrow();
  });

  test("throws on truncated compressed data", async () => {
    const original = "Test data that will be truncated";
    const compressed = await deflate(original);
    const truncated = compressed.slice(0, Math.floor(compressed.length / 2));

    await expect(inflate(truncated)).rejects.toThrow();
  });

  test("roundtrip with various data lengths", async () => {
    const lengths = [0, 1, 10, 100, 1000, 10_000];

    for (const length of lengths) {
      const original = "x".repeat(length);
      const compressed = await deflate(original);
      const decompressed = await inflate(compressed);

      expect(decompressed).toBe(original);
    }
  });
});
