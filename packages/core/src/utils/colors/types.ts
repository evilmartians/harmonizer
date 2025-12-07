import type { ChromaFunction } from "apcach";

import type {
  LevelChroma,
  ColorString,
  LevelContrast,
  ContrastModel,
  DirectionMode,
  HueAngle,
  ColorSpace,
} from "@core/types";

export type SearchDirection = "lighter" | "darker" | "auto";
export type ColorCalculationOptions = {
  directionMode: DirectionMode;
  contrastModel: ContrastModel;
  searchDirection: SearchDirection;
  colorSpace: ColorSpace;
  toColor: ColorString;
  contrastLevel: LevelContrast;
  chroma: LevelChroma | ChromaFunction;
  hueAngle: HueAngle;
};
