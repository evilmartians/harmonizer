import * as v from "valibot";

export const lightnessLevelSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(100),
  v.brand("LightnessLevel"),
);
export const chromaLevelSchema = v.pipe(v.number(), v.minValue(0), v.brand("ChromaLevel"));
export const hueAngleSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(360),
  v.brand("HueAngle"),
);
export const colorStringSchema = v.pipe(v.string(), v.brand("ColorString"));
export const contrastLevelSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(100),
  v.brand("ContrastLevel"),
);
