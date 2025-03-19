import type { ChromaFunction, ColorSpace } from "apcach";

import type {
  ChromaLevel,
  ColorString,
  ContrastLevel,
  ContrastModel,
  DirectionMode,
  HueAngle,
} from "@/types";

export type SearchDirection = "lighter" | "darker";
export type ColorCalculationOptions = {
  directionMode: DirectionMode;
  contrastModel: ContrastModel;
  searchDirection: SearchDirection;
  colorSpace: ColorSpace;
  toColor: ColorString;
  contrastLevel: ContrastLevel;
  chroma: ChromaLevel | ChromaFunction;
  hueAngle: HueAngle;
};
