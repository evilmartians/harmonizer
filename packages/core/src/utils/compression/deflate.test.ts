import { describe, expect, test } from "vitest";

import { deflate } from "./deflate";

describe(deflate, () => {
  test("compresses string to Uint8Array", async () => {
    const data = "Hello, World!";
    const compressed = await deflate(data);

    expect(compressed).toBeInstanceOf(Uint8Array);
    expect(compressed.length).toBeGreaterThan(0);
  });

  test("compresses repetitive data efficiently", async () => {
    const data = "A".repeat(1000);
    const compressed = await deflate(data);

    expect(compressed.length).toBeLessThan(100);
  });

  test("handles empty string", async () => {
    const data = "";
    const compressed = await deflate(data);

    expect(compressed).toBeInstanceOf(Uint8Array);
    // Has deflate header/footer
    expect(compressed.length).toBeGreaterThan(0);
  });

  test("handles Unicode characters", async () => {
    const data = "Hello 世界! 🚀 Мир";
    const compressed = await deflate(data);

    expect(compressed).toBeInstanceOf(Uint8Array);
    expect(compressed.length).toBeGreaterThan(0);
  });

  test("throws AbortError when signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    try {
      await deflate("test data", controller.signal);
      expect.fail("Should have thrown AbortError");
    } catch (error) {
      expect(error).toBeInstanceOf(DOMException);
      expect((error as DOMException).name).toBe("AbortError");
    }
  });

  test("throws AbortError when aborted during compression", async () => {
    const controller = new AbortController();
    const data = "Test data";

    const deflatePromise = deflate(data, controller.signal);
    controller.abort();

    try {
      await deflatePromise;
      expect.fail("Should have thrown AbortError");
    } catch (error) {
      expect(error).toBeInstanceOf(DOMException);
      expect((error as DOMException).name).toBe("AbortError");
    }
  });

  test("works without AbortSignal parameter", async () => {
    const data = "Test without signal";
    const compressed = await deflate(data);

    expect(compressed).toBeInstanceOf(Uint8Array);
    expect(compressed.length).toBeGreaterThan(0);
  });
});
