import type {
  ColorString,
  HueAngle,
  HueId,
  HueIndex,
  HueName,
  LevelChroma,
  LevelContrast,
  LevelId,
  LevelIndex,
  LevelName,
  LightnessLevel,
} from "@core/schemas/brand";

import type { ExportConfig } from "./schemas/exportConfig";
export type { ExportConfig } from "./schemas/exportConfig";

export {
  BgLightStart,
  ChromaMode,
  ColorSpace,
  ColorString,
  ContrastModel,
  DirectionMode,
  HueAngle,
  HueId,
  HueIndex,
  HueName,
  LevelChroma,
  LevelContrast,
  LevelId,
  LevelIndex,
  LevelName,
  LightnessLevel,
} from "@core/schemas/brand";

export type LevelData = {
  name: LevelName;
  contrast: LevelContrast;
  chroma: LevelChroma;
  tintColor: ColorLevelTintData;
};
export type Level = { id: LevelId } & LevelData;

export type HueData = {
  name: HueName;
  angle: HueAngle;
  tintColor: ColorHueTintData;
};
export type Hue = { id: HueId } & HueData;

export type ColorIdentifier = `${LevelId}-${HueId}`;
export type LchColor = {
  l: LightnessLevel;
  c: LevelChroma;
  h: HueAngle;
};
export type ColorData = LchColor & {
  cr: LevelContrast;
  css: ColorString;
};
export type ColorHueTintData = ColorData;
export type ColorLevelTintData = ColorData & { referencedC: LevelChroma };
export type ColorCellData = ColorData & {
  p3: boolean;
};

export type IndexedColors = Record<`${LevelIndex}-${HueIndex}`, LchColor>;
export type ExportConfigWithColors = ExportConfig & {
  colors: IndexedColors;
};
