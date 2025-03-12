import { parse } from "culori";
import * as v from "valibot";

export const levelIdSchema = v.pipe(v.string(), v.brand("LevelId"));
export const hueIdSchema = v.pipe(v.string(), v.brand("HueId"));

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
export const contrastLevelSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(106),
  v.brand("ContrastLevel"),
);
