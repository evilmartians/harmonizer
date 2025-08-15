import * as v from "valibot";

import { formatValidationError, safeParse } from "@core/schemas";
import { ensureNonNullable } from "@core/utils/assertions/ensureNonNullable";
import { ValidationError } from "@core/utils/errors/ValidationError";

import {
  baseContrastSchema,
  colorStringSchema,
  getLevelContrastModel,
  hueAngleSchema,
  hueNameSchema,
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
      v.object({ name: levelNameSchema, contrast: baseContrastSchema, chroma: levelChromaSchema }),
    ),
    hues: v.array(v.object({ name: hueNameSchema, angle: hueAngleSchema })),
    settings: v.pipe(
      v.object({
        contrastModel: contrastModelSchema,
        directionMode: directionModeSchema,
        chromaMode: chromaModeSchema,
        bgRightStart: v.optional(bgRightStartSchema),
        bgColorRight: v.optional(colorStringSchema),
        bgColorLeft: v.optional(colorStringSchema),
        colorSpace: colorSpaceSchema,
        // Migration for old properties
        bgLightStart: v.optional(bgRightStartSchema),
        bgColorDark: v.optional(colorStringSchema),
        bgColorLight: v.optional(colorStringSchema),
      }),
      v.transform((parsed) => {
        return {
          contrastModel: parsed.contrastModel,
          directionMode: parsed.directionMode,
          chromaMode: parsed.chromaMode,
          bgRightStart: ensureNonNullable(
            parsed.bgRightStart ?? parsed.bgLightStart,
            "At least one of properties must present in the config: 'bgRightStart' or 'bgLightStart'",
          ),
          bgColorRight: ensureNonNullable(
            parsed.bgColorRight ?? parsed.bgColorLight,
            "At least one of properties must present in the config: 'bgColorRight' or 'bgColorLight'",
          ),
          bgColorLeft: ensureNonNullable(
            parsed.bgColorLeft ?? parsed.bgColorDark,
            "At least one of properties must present in the config: 'bgColorLeft' or 'bgColorDark'",
          ),
          colorSpace: parsed.colorSpace,
        };
      }),
    ),
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
      v.array(v.union([v.string(), v.number()])),
      v.description("Level name, contrast and chroma as a plain array"),
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
    config.levels.flatMap((level) => [level.name, level.contrast, level.chroma]),
    config.hues.flatMap((hue) => [hue.name, hue.angle]),
    [
      config.settings.contrastModel,
      config.settings.directionMode,
      config.settings.chromaMode,
      config.settings.bgColorRight,
      config.settings.bgColorLeft,
      config.settings.bgRightStart,
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
    const chroma = v.parse(levelChromaSchema, compactConfig[0][i + 2]);

    levels.push({ name: name, contrast, chroma });
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
      bgColorRight: compactConfig[2][3],
      bgColorLeft: compactConfig[2][4],
      bgRightStart: compactConfig[2][5],
      colorSpace: compactConfig[2][6],
    },
  };
}
