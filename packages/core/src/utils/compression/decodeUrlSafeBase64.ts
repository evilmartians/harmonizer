// Polyfill for Uint8Array.fromBase64
import "core-js/actual/typed-array/from-base64";

/**
 * Decodes URL-safe base64 string to Uint8Array
 *
 * @param urlSafeBase64 - URL-safe base64 encoded string
 * @returns Decoded bytes
 * @throws {Error} If base64 is invalid
 */
export function decodeUrlSafeBase64(urlSafeBase64: string): Uint8Array {
  return Uint8Array.fromBase64(urlSafeBase64, { alphabet: "base64url" });
}
