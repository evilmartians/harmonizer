import { formatValidationError, safeParse } from "@core/schemas";
import { ValidationError } from "@core/utils/errors/ValidationError";
import * as v from "valibot";

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
  bgLightStartSchema,
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
    settings: v.object({
      contrastModel: contrastModelSchema,
      directionMode: directionModeSchema,
      chromaMode: chromaModeSchema,
      bgLightStart: bgLightStartSchema,
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
