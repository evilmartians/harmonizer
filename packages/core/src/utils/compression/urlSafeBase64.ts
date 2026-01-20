// Polyfills for Uint8Array.prototype.toBase64 and Uint8Array.fromBase64
import "core-js/actual/typed-array/to-base64";
import "core-js/actual/typed-array/from-base64";

/**
 * Encodes Uint8Array to URL-safe base64 string
 * URL-safe base64 replaces + with -, / with _, and removes padding (=)
 *
 * @param bytes - The bytes to encode
 * @returns URL-safe base64 encoded string
 */
export function encodeUrlSafeBase64(bytes: Uint8Array): string {
  return bytes.toBase64({ alphabet: "base64url", omitPadding: true });
}

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
