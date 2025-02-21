import * as v from "valibot";

export const chromaModeSchema = v.picklist(["even", "max"]);
export const colorSpaceSchema = v.picklist(["srgb", "p3"]);
export const contrastModelSchema = v.picklist(["apca", "wcag"]);
export const directionSchema = v.picklist(["fgToBg", "bgToFg"]);
