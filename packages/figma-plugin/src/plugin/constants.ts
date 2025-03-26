export const PALETTE_NAME = "Harmonized Palette";
export const PALETTE_CONFIG_KEY = "Harmonized Palette Config";

export const LABELS = {
  MODE_DARK: "Dark",
  MODE_LIGHT: "Light",
} as const;

export const PALETTE = {
  PADDING: 40,
  HUE_HEADER_WIDTH: 100,
  LEVEL_HEADER_HEIGHT: 120,
  CELL_WIDTH: 100,
  CELL_HEIGHT: 80,
  LABEL_FONT: { family: "Inter", style: "Regular" },
  LABEL_FILL: {
    type: "SOLID",
    color: { r: 0.5, g: 0.5, b: 0.5 },
  },
  LABEL_FONT_SIZE_L: 32,
  LABEL_FONT_SIZE_M: 16,
  LABEL_FONT_SIZE_S: 12,
  LABEL_LINE_HEIGHT: { value: 20, unit: "PIXELS" },
} as const;
