import * as v from "valibot";

import { chromaLevelSchema, colorStringSchema, contrastLevelSchema, hueAngleSchema } from "./color";
import {
  bgLightStartSchema,
  chromaModeSchema,
  colorSpaceSchema,
  contrastModelSchema,
  directionSchema,
} from "./settings";

export const exportConfigSchema = v.object({
  levels: v.array(
    v.object({ name: v.string(), contrast: contrastLevelSchema, chroma: chromaLevelSchema }),
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
});

export type ExportConfig = v.InferOutput<typeof exportConfigSchema>;
