import {
  chromaLevelSchema,
  colorStringSchema,
  hueAngleSchema,
  type hueIdSchema,
  type levelIdSchema,
  lightnessLevelSchema,
  baseContrastSchema,
} from "@core/schemas/color";
import {
  bgLightStartSchema,
  chromaModeSchema,
  type colorSpaceSchema,
  type contrastModelSchema,
  type directionSchema,
} from "@core/schemas/settings";
import { getBranded } from "@core/utils/ts/getBranded";
import type { InferOutput } from "valibot";
import * as v from "valibot";

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

export const lightnessLevel = getBranded(lightnessLevelSchema);
export const chromaMode = getBranded(v.pipe(v.string(), chromaModeSchema));
export const chromaLevel = getBranded(chromaLevelSchema);
export const hueAngle = getBranded(hueAngleSchema);
export const colorString = getBranded(colorStringSchema);
export const contrastLevel = getBranded(baseContrastSchema);
export const bgLightStart = getBranded(bgLightStartSchema);

export type LevelId = InferOutput<typeof levelIdSchema>;
export type LevelData = {
  name: string;
  contrast: ContrastLevel;
  chroma: ChromaLevel;
  tintColor: ColorLevelTintData;
};
export type Level = { id: LevelId } & LevelData;

export type HueId = InferOutput<typeof hueIdSchema>;
export type HueData = {
  name: string;
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
