import * as v from "valibot";

export const chromaModeSchema = v.picklist(["even", "max"]);
export const colorSpaceSchema = v.picklist(["srgb", "p3"]);
export const bgLightStartSchema = v.pipe(v.number(), v.brand("BgLightStart"));
export const contrastModelSchema = v.picklist(["apca", "wcag"]);
export const directionSchema = v.picklist(["fgToBg", "bgToFg"]);
