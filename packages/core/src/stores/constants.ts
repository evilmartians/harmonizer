import type { ColorData, ColorCellData, ColorLevelTintData, LevelData, HueData } from "@core/types";

export const FALLBACK_COLOR_DATA = {
  l: 43.13,
  c: 0,
  h: 0,
  css: "rgba(80, 80, 80, 0.2)",
  cr: 0,
} as ColorData;

export const FALLBACK_HUE_TINT_COLOR = FALLBACK_COLOR_DATA;

export const FALLBACK_LEVEL_TINT_COLOR = {
  ...FALLBACK_COLOR_DATA,
  referencedC: 0,
} as ColorLevelTintData;

export const FALLBACK_CELL_COLOR = {
  ...FALLBACK_COLOR_DATA,
  p3: false,
} as ColorCellData;

export const FALLBACK_LEVEL_DATA = {
  name: "",
  contrast: 50,
  chroma: 0.2,
  tintColor: FALLBACK_LEVEL_TINT_COLOR,
} as LevelData;

export const FALLBACK_HUE_DATA = {
  name: "",
  angle: 0,
  tintColor: FALLBACK_HUE_TINT_COLOR,
} as HueData;
