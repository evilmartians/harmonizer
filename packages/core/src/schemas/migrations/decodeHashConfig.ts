import * as v from "valibot";

import { getDefaultConfigCopy } from "@core/defaultConfig";
import type { ExportConfig } from "@core/types";
import { decodeUrlSafeBase64 } from "@core/utils/compression/decodeUrlSafeBase64";
import { inflate } from "@core/utils/compression/inflate";
import { urlSafeAtob } from "@core/utils/url/urlSafeAtob";

import { versionedExportConfigSchema } from "../exportConfig";

import { migrate } from "./migrate";
import { migrateFromLegacyCompact } from "./migrateFromLegacyCompact";

/**
 * Attempts multiple decompression strategies:
 * 1. New format: inflate (deflate-raw) + decodeUrlSafeBase64 → JSON → migrate
 * 2. Legacy format: urlSafeAtob (base64) → JSON → migrate from legacy compact → migrate
 *
 * @param hash - URL hash (with or without # prefix)
 * @returns Fully migrated ExportConfig at latest version
 */
export async function decodeHashConfig(hash: string): Promise<ExportConfig> {
  const hashData = hash.replaceAll(/^#/g, "");

  // Try new compression format first (deflate-raw + url-safe base64)
  try {
    const bytes = decodeUrlSafeBase64(hashData);
    const decompressed = await inflate(bytes);
    const parsed = v.parse(versionedExportConfigSchema, JSON.parse(decompressed));

    return await migrate(parsed);
  } catch {
    // Not new format, continue to legacy
  }

  // Try legacy base64 format (url-safe base64 only, no compression)
  try {
    const decoded = urlSafeAtob(hashData);
    const parsed = JSON.parse(decoded) as unknown;

    if (Array.isArray(parsed) && parsed.length === 3) {
      const migrated = migrateFromLegacyCompact(parsed);
      return await migrate(migrated);
    }
  } catch (error) {
    console.error("Failed to decode hash config", error);
  }

  // Fallback to default config, validated with versioned schema
  const defaultConfig = getDefaultConfigCopy();
  const parsed = v.parse(versionedExportConfigSchema, defaultConfig);
  return await migrate(parsed);
}
