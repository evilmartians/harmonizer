/**
 * Compresses data using deflate-raw algorithm
 * Requires CompressionStream API (modern browsers only)
 *
 * @param data - The string to compress
 * @param signal - Optional AbortSignal to cancel the compression
 * @returns Compressed bytes
 * @throws {DOMException} If compression is aborted
 */
export async function deflate(data: string, signal?: AbortSignal): Promise<Uint8Array> {
  signal?.throwIfAborted();

  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new CompressionStream("deflate-raw"), { signal });
  const buffer = await new Response(stream).arrayBuffer();

  return new Uint8Array(buffer);
}
