// Polyfill for Uint8Array.prototype.toBase64
import "core-js/actual/typed-array/to-base64";

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
