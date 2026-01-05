import * as v from "valibot";

import { migrate } from "@core/schemas/migrations/migrate";
import { decodeUrlSafeBase64 } from "@core/utils/compression/decodeUrlSafeBase64";
import { inflate } from "@core/utils/compression/inflate";
import { ValidationError } from "@core/utils/errors/ValidationError";
import { urlSafeAtob } from "@core/utils/url/urlSafeAtob";

import {
  baseContrastSchema,
  colorStringSchema,
  getLevelContrastModel,
  hueAngleSchema,
  hueNameSchema,
  levelChromaCapSchema,
  levelChromaSchema,
  levelNameSchema,
} from "./color";
import { migrateFromLegacyCompact } from "./migrations/migrateFromLegacyCompact";
import {
  bgRightStartSchema,
  chromaModeSchema,
  colorSpaceSchema,
  contrastModelSchema,
  directionModeSchema,
} from "./settings";

/**
 * Current version of the export config format
 * Increment this when making breaking changes to the config schema
 */
export const CURRENT_CONFIG_VERSION = 1;

export const versionedExportConfigSchema = v.looseObject({
  version: v.optional(v.pipe(v.number(), v.minValue(1)), 1),
});
export type ExportConfigVersioned = v.InferOutput<typeof versionedExportConfigSchema>;

export const exportConfigV1Schema = v.pipe(
  v.object({
    version: versionedExportConfigSchema.entries.version,
    levels: v.array(
      v.object({
        name: levelNameSchema,
        contrast: baseContrastSchema,
        chroma: levelChromaSchema,
        chromaCap: v.optional(levelChromaCapSchema),
      }),
    ),
    hues: v.array(v.object({ name: hueNameSchema, angle: hueAngleSchema })),
    settings: v.object({
      contrastModel: contrastModelSchema,
      directionMode: directionModeSchema,
      chromaMode: chromaModeSchema,
      bgLightStart: bgRightStartSchema,
      bgColorLight: colorStringSchema,
      bgColorDark: colorStringSchema,
      colorSpace: colorSpaceSchema,
    }),
  }),
  v.check(({ levels, settings }) => {
    return levels.every(
      ({ contrast }) =>
        v.safeParse(getLevelContrastModel(settings.contrastModel), contrast).success,
    );
  }, "Contrast levels are out of selected contrast model bounds"),
  v.check(({ levels, settings }) => {
    return settings.bgLightStart >= 0 && settings.bgLightStart <= levels.length;
  }, "bgLightStart must be within the range of defined levels"),
);
export type ExportConfigV1 = v.InferOutput<typeof exportConfigV1Schema>;

// Aliases for the latest export config version
export const exportConfigSchema = exportConfigV1Schema;
export type ExportConfig = ExportConfigV1;

/**
 * Parses and migrates an ExportConfig from a JSON string or object
 *
 * @param configString - JSON string or object representing the export config
 * @returns Fully migrated ExportConfig at the latest version
 */
export async function parseExportConfig(
  configString: string | Record<string, unknown>,
): Promise<ExportConfig> {
  let parsed: unknown;

  try {
    parsed =
      typeof configString === "string" ? (JSON.parse(configString) as unknown) : configString;
  } catch {
    throw new ValidationError("Invalid config — cannot parse JSON");
  }

  try {
    const versionedConfig = v.parse(versionedExportConfigSchema, parsed);

    return await migrate(versionedConfig);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(error instanceof Error ? error.message : "Failed to migrate config");
  }
}

/**
 * Attempts multiple decompression strategies:
 * 1. New format: inflate (deflate-raw) + decodeUrlSafeBase64 → JSON → migrate
 * 2. Legacy format: urlSafeAtob (base64) → JSON → migrate from legacy compact → migrate
 *
 * @param hash - URL hash (with or without # prefix)
 * @returns Fully migrated ExportConfig at latest version
 */
export async function decodeHashConfig(hash: string): Promise<ExportConfig | null> {
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

  return null;
}
