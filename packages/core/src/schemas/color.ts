import type { ContrastModel } from "@core/types";
import { parse } from "culori";
import * as v from "valibot";

import {
  ColorString,
  HueAngle,
  HueId,
  HueIndex,
  HueName,
  LevelChroma,
  LevelContrast,
  LevelId,
  LevelIndex,
  LevelName,
  LightnessLevel,
} from "./brand";

export const levelIdSchema = v.pipe(v.string(), v.transform(LevelId));
export const levelIndexSchema = v.pipe(v.number(), v.transform(LevelIndex));
export const levelNameSchema = v.pipe(
  v.string(),
  v.minLength(1, "Level name is mandatory"),
  v.transform(LevelName),
);
export const baseContrastSchema = v.pipe(v.number(), v.transform(LevelContrast));
export const levelApcaContrastSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(106),
  v.transform(LevelContrast),
);
export const levelWcagContrastSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(21),
  v.transform(LevelContrast),
);
export const getLevelContrastModel = (contrastModel: ContrastModel) => {
  switch (contrastModel) {
    case "apca": {
      return levelApcaContrastSchema;
    }
    case "wcag": {
      return levelWcagContrastSchema;
    }
    default: {
      return v.never();
    }
  }
};

export const levelChromaSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(0.38),
  v.transform(LevelChroma),
);
export const hueIdSchema = v.pipe(v.string(), v.transform(HueId));
export const hueIndexSchema = v.pipe(v.number(), v.transform(HueIndex));
export const hueNameSchema = v.pipe(
  v.string(),
  v.minLength(1, "Hue name is mandatory"),

  v.transform(HueName),
);

export const lightnessLevelSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(100),
  v.transform(LightnessLevel),
);
export const hueAngleSchema = v.pipe(
  v.number(),
  v.minValue(0),
  v.maxValue(360),
  v.transform(HueAngle),
);
export const colorStringSchema = v.pipe(
  v.string(),
  v.check(
    (value) => parse(value) !== undefined,
    "This is not a valid color. Try OKLCH, Hex, RGB, or HSL",
  ),
  v.transform(ColorString),
);
