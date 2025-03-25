import * as v from "valibot";

export const chromaModeSchema = v.pipe(
  v.string(),
  v.picklist(["even", "max"]),
  v.brand("ChromaMode"),
);
export const colorSpaceSchema = v.pipe(
  v.string(),
  v.picklist(["srgb", "p3"]),
  v.brand("ColorSpace"),
);
export const bgLightStartSchema = v.pipe(v.number(), v.brand("BgLightStart"));
export const contrastModelSchema = v.pipe(
  v.string(),
  v.picklist(["apca", "wcag"]),
  v.brand("ContrastModel"),
);
export const directionSchema = v.pipe(
  v.string(),
  v.picklist(["fgToBg", "bgToFg"]),
  v.brand("DirectionMode"),
);
