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

export const exportConfigSchema = v.pipe(
  v.object({
    levels: v.array(
      v.object({
        name: levelNameSchema,
        contrast: baseContrastSchema,
        chroma: levelChromaSchema,
        chromaCap: v.optional(levelChromaCapSchema),
        locked: v.optional(v.boolean()),
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
      v.array(v.union([v.string(), v.number(), v.null(), v.boolean()])),
      v.description("Level name, contrast, chroma cap and locked as a plain array"),
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
    config.levels.flatMap<string | number | null | boolean>((level) => [
      level.name,
      level.contrast,
      level.chromaCap ?? null,
      level.locked ?? false,
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

  // Determine step size for backward compatibility
  // Old format: [name, contrast, chromaCap] = 3 items per level
  // New format: [name, contrast, chromaCap, locked] = 4 items per level
  const levelsData = compactConfig[0];
  const stepSize = levelsData.length % 4 === 0 ? 4 : 3;

  for (let i = 0; i < levelsData.length; i += stepSize) {
    const name = v.parse(levelNameSchema, levelsData[i]);
    const contrast = v.parse(getLevelContrastModel(contrastModel), levelsData[i + 1]);
    const chromaCap = v.parse(levelChromaCapSchema, levelsData[i + 2]);
    const locked = stepSize === 4 ? (levelsData[i + 3] as boolean) : undefined;

    levels.push({ name, contrast, chroma: LevelChroma(0), chromaCap, locked });
  }

  for (let i = 0; i < compactConfig[1].length; i += 2) {
    const hueName = v.parse(hueNameSchema, compactConfig[1][i]);
    const angle = v.parse(hueAngleSchema, compactConfig[1][i + 1]);

    hues.push({ name: hueName, angle });
  }

  return {
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
