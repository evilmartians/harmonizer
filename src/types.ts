import type { InferOutput } from "valibot";

import { getBranded } from "./utils/branded";

import {
  chromaLevelSchema,
  colorStringSchema,
  contrastLevelSchema,
  hueAngleSchema,
  type hueIdSchema,
  type levelIdSchema,
  lightnessLevelSchema,
} from "@/schemas/color";
import {
  bgLightStartSchema,
  type chromaModeSchema,
  type colorSpaceSchema,
  type contrastModelSchema,
  type directionSchema,
} from "@/schemas/settings";

export type LightnessLevel = InferOutput<typeof lightnessLevelSchema>;
export type ChromaLevel = InferOutput<typeof chromaLevelSchema>;
export type HueAngle = InferOutput<typeof hueAngleSchema>;
export type ColorString = InferOutput<typeof colorStringSchema>;
export type ContrastLevel = InferOutput<typeof contrastLevelSchema>;

export type ChromaMode = InferOutput<typeof chromaModeSchema>;
export type ColorSpace = InferOutput<typeof colorSpaceSchema>;
export type BgLightStart = InferOutput<typeof bgLightStartSchema>;
export type ContrastModel = InferOutput<typeof contrastModelSchema>;
export type DirectionMode = InferOutput<typeof directionSchema>;

export const lightnessLevel = getBranded(lightnessLevelSchema);
export const chromaLevel = getBranded(chromaLevelSchema);
export const hueAngle = getBranded(hueAngleSchema);
export const colorString = getBranded(colorStringSchema);
export const contrastLevel = getBranded(contrastLevelSchema);
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
export type ColorData = {
  cr: ContrastLevel;
  l: LightnessLevel;
  c: ChromaLevel;
  h: HueAngle;
  css: ColorString;
};
export type ColorHueTintData = ColorData;
export type ColorLevelTintData = ColorData & { referencedC: ChromaLevel };
export type ColorCellData = ColorData & {
  p3: boolean;
};
