import * as v from "valibot";

import { formatValidationError, safeParse } from "@core/schemas";
import { ValidationError } from "@core/utils/errors/ValidationError";

import { LevelChroma } from "./brand";
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

export const exportConfigSchema = v.pipe(
  v.object({
    version: v.optional(v.pipe(v.number(), v.minValue(1)), CURRENT_CONFIG_VERSION),
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
);
export type ExportConfig = v.InferOutput<typeof exportConfigSchema>;

export function parseExportConfig(configString: string | Record<string, unknown>): ExportConfig {
  try {
    const parsed =
      typeof configString === "string" ? (JSON.parse(configString) as unknown) : configString;
    const result = safeParse(exportConfigSchema, parsed);

    if (!result.success) {
      throw new ValidationError(formatValidationError(result.issues));
    }

    return result.output;
  } catch {
    throw new ValidationError("Invalid config — cannot parse JSON");
  }
}

export const compactExportConfigSchema = v.pipe(
  v.tuple([
    v.pipe(
      v.array(v.union([v.string(), v.number(), v.null()])),
      v.description("Level name, contrast and chroma cap as a plain array"),
    ),
    v.pipe(
      v.array(v.union([v.string(), v.number()])),
      v.description("Hue name and angle as a plain array"),
    ),
    v.pipe(
      v.tuple([
        contrastModelSchema,
        directionModeSchema,
        chromaModeSchema,
        colorStringSchema,
        colorStringSchema,
        bgRightStartSchema,
        colorSpaceSchema,
      ]),
      v.description("Settings as a plain array"),
    ),
  ]),
);

export type CompactExportConfig = v.InferOutput<typeof compactExportConfigSchema>;

export function parseCompactExportConfig(value: unknown): CompactExportConfig {
  return v.parse(compactExportConfigSchema, value);
}

export function toCompactExportConfig(config: ExportConfig): CompactExportConfig {
  return [
    config.levels.flatMap<string | number | null>((level) => [
      level.name,
      level.contrast,
      level.chromaCap ?? null,
    ]),
    config.hues.flatMap((hue) => [hue.name, hue.angle]),
    [
      config.settings.contrastModel,
      config.settings.directionMode,
      config.settings.chromaMode,
      config.settings.bgColorLight,
      config.settings.bgColorDark,
      config.settings.bgLightStart,
      config.settings.colorSpace,
    ],
  ];
}

export function toExportConfig(compactConfig: CompactExportConfig): ExportConfig {
  const contrastModel = compactConfig[2][0];
  const levels: ExportConfig["levels"] = [];
  const hues: ExportConfig["hues"] = [];

  for (let i = 0; i < compactConfig[0].length; i += 3) {
    const name = v.parse(levelNameSchema, compactConfig[0][i]);
    const contrast = v.parse(getLevelContrastModel(contrastModel), compactConfig[0][i + 1]);
    const chromaCap = v.parse(levelChromaCapSchema, compactConfig[0][i + 2]);

    levels.push({ name, contrast, chroma: LevelChroma(0), chromaCap });
  }

  for (let i = 0; i < compactConfig[1].length; i += 2) {
    const hueName = v.parse(hueNameSchema, compactConfig[1][i]);
    const angle = v.parse(hueAngleSchema, compactConfig[1][i + 1]);

    hues.push({ name: hueName, angle });
  }

  return {
    version: CURRENT_CONFIG_VERSION,
    levels,
    hues,
    settings: {
      contrastModel,
      directionMode: compactConfig[2][1],
      chromaMode: compactConfig[2][2],
      bgColorLight: compactConfig[2][3],
      bgColorDark: compactConfig[2][4],
      bgLightStart: compactConfig[2][5],
      colorSpace: compactConfig[2][6],
    },
  };
}
