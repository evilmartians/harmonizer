import * as v from "valibot";

import {
  BgRightStart,
  CHROMA_MODES,
  ChromaMode,
  COLOR_SPACES,
  ColorSpace,
  CONTRAST_MODELS,
  ContrastModel,
  DIRECTION_MODES,
  DirectionMode,
  LEVEL_STEPS_PRESETS,
  LevelStepsPreset,
} from "./brand";

export const chromaModeSchema = v.pipe(
  v.string(),
  v.picklist(CHROMA_MODES),
  v.transform(ChromaMode),
);
export const parseChromaMode = (value: string) => v.parse(chromaModeSchema, value);

export const colorSpaceSchema = v.pipe(
  v.string(),
  v.picklist(COLOR_SPACES),
  v.transform(ColorSpace),
);
export const parseColorSpace = (value: string) => v.parse(colorSpaceSchema, value);

export const bgRightStartSchema = v.pipe(v.number(), v.transform(BgRightStart));
export const contrastModelSchema = v.pipe(
  v.string(),
  v.picklist(CONTRAST_MODELS),
  v.transform(ContrastModel),
);
export const parseContrastModel = (value: string) => v.parse(contrastModelSchema, value);

export const directionModeSchema = v.pipe(
  v.string(),
  v.picklist(DIRECTION_MODES),
  v.transform(DirectionMode),
);
export const parseDirectionMode = (value: string) => v.parse(directionModeSchema, value);

export const levelStepsPresetSchema = v.pipe(
  v.string(),
  v.picklist(LEVEL_STEPS_PRESETS),
  v.transform(LevelStepsPreset),
);
export const parseLevelStepsPreset = (value: string) => v.parse(levelStepsPresetSchema, value);
