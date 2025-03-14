import * as v from "valibot";

import {
  chromaLevelSchema,
  colorStringSchema,
  apcaContrastLevelSchema,
  wcagContrastLevelSchema,
  hueAngleSchema,
  baseContrastSchema,
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
      v.object({ name: v.string(), contrast: baseContrastSchema, chroma: chromaLevelSchema }),
    ),
    hues: v.array(v.object({ name: v.string(), angle: hueAngleSchema })),
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

export type ExportConfig = v.InferOutput<typeof exportConfigSchema>;
