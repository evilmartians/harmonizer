import type { Apcach, ChromaFunction } from "apcach";
import { apcach, crToBg, crToFg } from "apcach";
import { converter, parse } from "culori";

import type {
  ColorString,
  ContrastModel,
  DirectionMode,
  HueAngle,
  LevelContrast,
} from "@core/types";

export const SUBTLE_CONTRAST_THRESHOLD = 8;

/**
 * Calculate subtle color variations for very low contrast values (< 8).
 * The apcach library converts colors below contrast 8 to a single color (white),
 * making it impossible to create subtle variations. This function provides
 * a custom implementation by blending between the base color and what
 * apcach would produce at the threshold (contrast 8).
 */
export function calculateSubtleColor(
  baseColor: ColorString,
  targetContrast: LevelContrast,
  hueAngle: HueAngle,
  chroma: number | ChromaFunction,
  searchDirection: "lighter" | "darker",
  colorSpace: "srgb" | "p3",
  directionMode: DirectionMode,
  contrastModel: ContrastModel,
): Apcach {
  const parsed = parse(baseColor);
  if (!parsed) {
    throw new Error(`Invalid base color: ${baseColor}`);
  }

  const toOklch = converter("oklch");
  const baseOklch = toOklch(parsed);

  // Calculate what apcach would return at the threshold (contrast 8)
  const method = directionMode === "fgToBg" ? crToBg : crToFg;
  const bgAtThreshold = method(
    baseColor,
    SUBTLE_CONTRAST_THRESHOLD,
    contrastModel,
    searchDirection,
  );
  const apcachAtThreshold = apcach(bgAtThreshold, chroma, hueAngle, 100, colorSpace);

  // Blend factor: 0 at contrast 0, approaching 1 at contrast 8
  const blendFactor = targetContrast / SUBTLE_CONTRAST_THRESHOLD;

  // Interpolate between base color and threshold color
  const newLightness = baseOklch.l + (apcachAtThreshold.lightness - baseOklch.l) * blendFactor;
  const baseChroma = baseOklch.c || 0;
  const newChroma = baseChroma + (apcachAtThreshold.chroma - baseChroma) * blendFactor;

  return {
    lightness: newLightness,
    chroma: newChroma,
    hue: hueAngle,
    alpha: 1,
    colorSpace,
  };
}
