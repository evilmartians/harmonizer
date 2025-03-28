import {
  chromaLevelSchema,
  colorStringSchema,
  hueAngleSchema,
  type hueIdSchema,
  type levelIdSchema,
  lightnessLevelSchema,
  baseContrastSchema,
  levelNameSchema,
  hueNameSchema,
  levelIndexSchema,
  hueIndexSchema,
} from "@core/schemas/color";
import {
  bgLightStartSchema,
  chromaModeSchema,
  colorSpaceSchema,
  contrastModelSchema,
  directionSchema,
} from "@core/schemas/settings";
import { getBranded } from "@core/utils/ts/getBranded";
import type { InferOutput } from "valibot";
import * as v from "valibot";

import type { exportConfigSchema } from "./schemas/exportConfig";

export type LightnessLevel = InferOutput<typeof lightnessLevelSchema>;
export type ChromaLevel = InferOutput<typeof chromaLevelSchema>;
export type HueAngle = InferOutput<typeof hueAngleSchema>;
export type ColorString = InferOutput<typeof colorStringSchema>;
export type ContrastLevel = InferOutput<typeof baseContrastSchema>;

export type ChromaMode = InferOutput<typeof chromaModeSchema>;
export type ColorSpace = InferOutput<typeof colorSpaceSchema>;
export type BgLightStart = InferOutput<typeof bgLightStartSchema>;
export type ContrastModel = InferOutput<typeof contrastModelSchema>;
export type DirectionMode = InferOutput<typeof directionSchema>;

export const LevelIndex = getBranded(levelIndexSchema);
export const LevelName = getBranded(levelNameSchema);
export const LightnessLevel = getBranded(lightnessLevelSchema);
export const ChromaMode = getBranded(v.pipe(v.string(), chromaModeSchema));
export const ColorSpace = getBranded(v.pipe(v.string(), colorSpaceSchema));
export const ChromaLevel = getBranded(chromaLevelSchema);
export const HueIndex = getBranded(hueIndexSchema);
export const HueName = getBranded(hueNameSchema);
export const HueAngle = getBranded(hueAngleSchema);
export const ColorString = getBranded(colorStringSchema);
export const ContrastLevel = getBranded(baseContrastSchema);
export const BgLightStart = getBranded(bgLightStartSchema);
export const ContrastModel = getBranded(contrastModelSchema);
export const DirectionMode = getBranded(directionSchema);

export type LevelId = InferOutput<typeof levelIdSchema>;
export type LevelIndex = InferOutput<typeof levelIndexSchema>;
export type LevelName = InferOutput<typeof levelNameSchema>;
export type LevelData = {
  name: LevelName;
  contrast: ContrastLevel;
  chroma: ChromaLevel;
  tintColor: ColorLevelTintData;
};
export type Level = { id: LevelId } & LevelData;

export type HueId = InferOutput<typeof hueIdSchema>;
export type HueIndex = InferOutput<typeof hueIndexSchema>;
export type HueName = InferOutput<typeof hueNameSchema>;
export type HueData = {
  name: HueName;
  angle: HueAngle;
  tintColor: ColorHueTintData;
};
export type Hue = { id: HueId } & HueData;

export type ColorIdentifier = `${LevelId}-${HueId}`;
export type LchColor = {
  l: LightnessLevel;
  c: ChromaLevel;
  h: HueAngle;
};
export type ColorData = LchColor & {
  cr: ContrastLevel;
  css: ColorString;
};
export type ColorHueTintData = ColorData;
export type ColorLevelTintData = ColorData & { referencedC: ChromaLevel };
export type ColorCellData = ColorData & {
  p3: boolean;
};

export type ExportConfig = v.InferOutput<typeof exportConfigSchema>;
export type IndexedColors = Record<`${LevelIndex}-${HueIndex}`, LchColor>;
