import { formatValidationError, safeParse } from "@core/schemas";
import type { ExportConfig } from "@core/types";
import { ValidationError } from "@core/utils/errors/ValidationError";
import * as v from "valibot";

import {
  chromaLevelSchema,
  colorStringSchema,
  apcaContrastLevelSchema,
  wcagContrastLevelSchema,
  hueAngleSchema,
  baseContrastSchema,
  levelNameSchema,
  hueNameSchema,
} from "./color";
import {
  bgLightStartSchema,
  chromaModeSchema,
  colorSpaceSchema,
  contrastModelSchema,
  directionSchema,
} from "./settings";

export const exportConfigSchema = v.pipe(
  v.object({
    levels: v.array(
      v.object({ name: levelNameSchema, contrast: baseContrastSchema, chroma: chromaLevelSchema }),
    ),
    hues: v.array(v.object({ name: hueNameSchema, angle: hueAngleSchema })),
    settings: v.object({
      contrastModel: contrastModelSchema,
      directionMode: directionSchema,
      chromaMode: chromaModeSchema,
      bgLightStart: bgLightStartSchema,
      bgColorLight: colorStringSchema,
      bgColorDark: colorStringSchema,
      colorSpace: colorSpaceSchema,
    }),
  }),
  v.check(({ levels, settings }) => {
    const contrastSchema =
      settings.contrastModel === "apca" ? apcaContrastLevelSchema : wcagContrastLevelSchema;

    return levels.every(({ contrast }) => v.safeParse(contrastSchema, contrast).success);
  }, "Contrast levels are out of selected contrast model bounds"),
);

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
