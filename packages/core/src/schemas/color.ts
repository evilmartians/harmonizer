import { parse } from "culori";
import * as v from "valibot";

export const levelIdSchema = v.pipe(v.string(), v.brand("LevelId"));
export const levelIndexSchema = v.pipe(v.number(), v.brand("LevelIndex"));
export const levelNameSchema = v.pipe(v.string(), v.brand("LevelName"));
export const hueIdSchema = v.pipe(v.string(), v.brand("HueId"));
export const hueIndexSchema = v.pipe(v.number(), v.brand("HueIndex"));
export const hueNameSchema = v.pipe(v.string(), v.brand("HueName"));

export const lightnessLevelSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(100),
  v.brand("LightnessLevel"),
);
export const chromaLevelSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(0.38),
  v.brand("ChromaLevel"),
);
export const hueAngleSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(360),
  v.brand("HueAngle"),
);
export const colorStringSchema = v.pipe(
  v.string(),
  v.check(
    (value) => parse(value) !== undefined,
    "This is not a valid color. Try OKLCH, Hex, RGB, or HSL",
  ),
  v.brand("ColorString"),
);

const contrastBrand = v.brand<number, "ContrastLevel">("ContrastLevel");
export const baseContrastSchema = v.pipe(v.number(), contrastBrand);
export const apcaContrastLevelSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(106),
  contrastBrand,
);
export const wcagContrastLevelSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(21),
  contrastBrand,
);
