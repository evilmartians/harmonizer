import * as v from "valibot";

export const chromaLevelSchema = v.pipe(v.number(), v.minValue(0));
export const colorStringSchema = v.pipe(v.string());
export const contrastLevelSchema = v.pipe(v.number(), v.minValue(0), v.maxValue(100));
export const hueAngleSchema = v.pipe(v.number(), v.minValue(0), v.maxValue(360));
