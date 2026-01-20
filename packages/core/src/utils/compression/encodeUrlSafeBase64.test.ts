import { describe, expect, test } from "vitest";

import { encodeUrlSafeBase64 } from "./encodeUrlSafeBase64";

describe(encodeUrlSafeBase64, () => {
  test("encodes Uint8Array to URL-safe base64", () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]);
    const encoded = encodeUrlSafeBase64(bytes);

    expect(typeof encoded).toBe("string");
    expect(encoded.length).toBeGreaterThan(0);
  });

  test("output contains only URL-safe characters", () => {
    const bytes = new Uint8Array([255, 254, 253, 252, 251, 250]);
    const encoded = encodeUrlSafeBase64(bytes);

    // Should only contain A-Za-z0-9_- (no +, /, =)
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  test("removes padding (=)", () => {
    const testCases = [
      new Uint8Array([1]),
      new Uint8Array([1, 2]),
      new Uint8Array([1, 2, 3]),
      new Uint8Array([1, 2, 3, 4]),
    ];

    for (const bytes of testCases) {
      const encoded = encodeUrlSafeBase64(bytes);
      expect(encoded).not.toContain("=");
    }
  });

  test("replaces + with -", () => {
    const bytes = new Uint8Array([251, 239]); // Produces "++8=" in standard base64
    const encoded = encodeUrlSafeBase64(bytes);

    expect(encoded).not.toContain("+");
    expect(encoded).toContain("-");
  });

  test("replaces / with _", () => {
    const bytes = new Uint8Array([255, 255]); // Produces "//8=" in standard base64
    const encoded = encodeUrlSafeBase64(bytes);

    expect(encoded).not.toContain("/");
    expect(encoded).toContain("_");
  });

  test("handles empty Uint8Array", () => {
    const bytes = new Uint8Array([]);
    const encoded = encodeUrlSafeBase64(bytes);

    expect(encoded).toBe("");
  });

  test("handles large data", () => {
    const bytes = new Uint8Array(10_000).fill(42);
    const encoded = encodeUrlSafeBase64(bytes);

    expect(encoded.length).toBeGreaterThan(0);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  test("produces consistent output", () => {
    const bytes = new Uint8Array([1, 2, 3, 4, 5]);
    const encoded1 = encodeUrlSafeBase64(bytes);
    const encoded2 = encodeUrlSafeBase64(bytes);

    expect(encoded1).toBe(encoded2);
  });
});
