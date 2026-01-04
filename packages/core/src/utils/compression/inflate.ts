/**
 * Decompresses deflate-raw compressed data back to string
 * Requires DecompressionStream API (modern browsers only)
 *
 * @param compressedBytes - The compressed bytes
 * @returns Decompressed string
 * @throws {Error} If decompression fails
 */
export async function inflate(compressedBytes: Uint8Array): Promise<string> {
  const stream = new Blob([compressedBytes as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  const buffer = await new Response(stream).arrayBuffer();

  return new TextDecoder().decode(buffer);
}
