import type { InferOutput } from "valibot";

import type {
  chromaLevelSchema,
  colorStringSchema,
  contrastLevelSchema,
  hueAngleSchema,
  lightnessLevelSchema,
} from "@/schemas/color";
import type {
  bgLightStartSchema,
  chromaModeSchema,
  colorSpaceSchema,
  contrastModelSchema,
  directionSchema,
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

export type LevelId = string & { readonly __levelId: unique symbol };
export type LevelData = {
  name: string;
  contrast: ContrastLevel;
  chroma: ChromaLevel;
  tintColor: ColorLevelTintData;
};
export type Level = { id: LevelId } & LevelData;

export type HueId = string & { readonly __hueId: unique symbol };
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
