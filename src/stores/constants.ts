import type { ColorData, ColorCellData, ColorLevelTintData, LevelData, HueData } from "./types";

export const FALLBACK_COLOR_DATA = <ColorData>{
  l: 38.67,
  c: 0,
  h: 0,
  css: "#444",
  cr: 0,
};

export const FALLBACK_HUE_TINT_COLOR = FALLBACK_COLOR_DATA;

export const FALLBACK_LEVEL_TINT_COLOR = <ColorLevelTintData>{
  ...FALLBACK_COLOR_DATA,
  referencedC: 0,
};

export const FALLBACK_CELL_COLOR = <ColorCellData>{
  ...FALLBACK_COLOR_DATA,
  p3: false,
};

export const FALLBACK_LEVEL_DATA = <LevelData>{
  name: "100",
  contrast: 50,
  chroma: 0.2,
  tintColor: FALLBACK_LEVEL_TINT_COLOR,
};

export const FALLBACK_HUE_DATA = <HueData>{
  name: "Red",
  angle: 0,
  tintColor: FALLBACK_HUE_TINT_COLOR,
};
