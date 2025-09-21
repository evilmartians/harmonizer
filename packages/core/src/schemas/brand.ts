import { createBrand, type Brand } from "@core/utils/ts/brand";

/* Level brand types */
export const LevelId = createBrand<string, "LevelId">;
export type LevelId = Brand<typeof LevelId>;

export const LevelIndex = createBrand<number, "LevelIndex">;
export type LevelIndex = Brand<typeof LevelIndex>;

export const LevelName = createBrand<string, "LevelName">;
export type LevelName = Brand<typeof LevelName>;

export const LevelContrast = createBrand<number, "LevelContrast">;
export type LevelContrast = Brand<typeof LevelContrast>;

export const LevelChroma = createBrand<number, "LevelChroma">;
export type LevelChroma = Brand<typeof LevelChroma>;

/* Hue brand types */
export const HueId = createBrand<string, "HueId">;
export type HueId = Brand<typeof HueId>;

export const HueIndex = createBrand<number, "HueIndex">;
export type HueIndex = Brand<typeof HueIndex>;

export const HueName = createBrand<string, "HueName">;
export type HueName = Brand<typeof HueName>;

export const HueAngle = createBrand<number, "HueAngle">;
export type HueAngle = Brand<typeof HueAngle>;

/* Color brand types */
export const LightnessLevel = createBrand<number, "LightnessLevel">;
export type LightnessLevel = Brand<typeof LightnessLevel>;

export const ColorString = createBrand<string, "ColorString">;
export type ColorString = Brand<typeof ColorString>;

export const ColorVariable = createBrand<`var(--${string})`, "ColorCssVariable">;
export type ColorVariable = Brand<typeof ColorVariable>;

/* Settings brand types */
export const CHROMA_MODES = ["even", "max"] as const;
export const ChromaMode = createBrand<(typeof CHROMA_MODES)[number], "ChromaMode">;
export type ChromaMode = Brand<typeof ChromaMode>;

export const DIRECTION_MODES = ["fgToBg", "bgToFg"] as const;
export const DirectionMode = createBrand<(typeof DIRECTION_MODES)[number], "DirectionMode">;
export type DirectionMode = Brand<typeof DirectionMode>;

export const COLOR_SPACES = ["srgb", "p3"] as const;
export const ColorSpace = createBrand<(typeof COLOR_SPACES)[number], "ColorSpace">;
export type ColorSpace = Brand<typeof ColorSpace>;

export const BgRightStart = createBrand<number, "BgRightStart">;
export type BgRightStart = Brand<typeof BgRightStart>;

export const CONTRAST_MODELS = ["apca", "wcag"] as const;
export const ContrastModel = createBrand<(typeof CONTRAST_MODELS)[number], "ContrastModel">;
export type ContrastModel = Brand<typeof ContrastModel>;
