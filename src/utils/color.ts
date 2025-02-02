import {
  type Apcach,
  type ColorSpace,
  apcach,
  apcachToCss,
  crToBg,
  inColorSpace,
  maxChroma,
} from "apcach";
import type { Hue, Level, Settings } from "../types/config";
import { ensureNonNullable } from "./ensureNonNullable";

export { inColorSpace, apcachToCss } from "apcach";

export class ColorMatrix {
  public hues: ColorRow[];
  constructor(c: number, r: number) {
    this.hues = Array.from({ length: r }, () => new ColorRow(c));
  }
  updateLevel(i: number, colors: Color[]) {
    this.hues.forEach((hue, index) => {
      if (index >= colors.length) {
        return;
      }
      hue.updateColor(i, ensureNonNullable(colors[index], "Color not found"));
    });
  }
}

export class ColorRow {
  public levels: Color[];
  constructor(c: number) {
    this.levels = Array.from({ length: c }, () => ({}) as Color);
  }
  updateColor(i: number, color: Color) {
    if (i >= this.levels.length) {
      return;
    }
    this.levels[i] = color;
  }
}

export interface Color {
  cr: number;
  l: number;
  c: number;
  h: number;
  p3: boolean;
  css: string;
}

/*
 * Calculates whole color matrix
 */
export function calculateMatrix(
  levels: Level[],
  hues: Hue[],
  settings: Settings,
): ColorMatrix {
  const colorMatrix = new ColorMatrix(levels.length, hues.length);
  levels.forEach((level, index) => {
    const bgColor =
      index < settings.bgLightLevel
        ? settings.bgColorDark
        : settings.bgColorLight;
    const colorSpace = settings.colorSpace as ColorSpace;
    const levelColors = calculateLevel(
      level,
      hues,
      bgColor,
      settings.chroma,
      colorSpace,
    );
    colorMatrix.updateLevel(index, levelColors);
  });
  return colorMatrix;
}

/*
 * Calculates colors of given level
 */
function calculateLevel(
  level: Level,
  hues: Hue[],
  bgColor: string,
  chromaSetting: string,
  colorSpace: ColorSpace,
): Color[] {
  let chroma = maxChroma();
  if (chromaSetting === "even") {
    chroma = findMaxCommonChroma(level, hues, bgColor, colorSpace);
  }
  // Calculate real colors with this chroma
  const colors: Color[] = [];
  hues.forEach((hue) => {
    const apcachColor = calculateApcach(
      bgColor,
      level.contrast,
      chroma,
      hue.angle,
      colorSpace,
    );
    const color = {
      cr: level.contrast,
      l: apcachColor.lightness,
      c: apcachColor.chroma,
      h: hue.angle,
      p3: !inColorSpace(apcachColor, "srgb"),
      css: apcachToCss(apcachColor),
    };
    colors.push(color);
  });
  return colors;
}

/**
 * Calculates colors with maximum chroma and finds chroma of the less saturated color
 */
export function findMaxCommonChroma(
  level: Level,
  hues: Hue[],
  bgColor: string,
  colorSpace: ColorSpace,
): number {
  let maxCommonChroma = 100;
  hues.forEach((hue) => {
    const apcachColor = calculateApcach(
      bgColor,
      level.contrast,
      maxChroma(),
      hue.angle,
      colorSpace,
    );
    if (apcachColor.chroma < maxCommonChroma) {
      maxCommonChroma = apcachColor.chroma;
    }
  });
  return maxCommonChroma;
}

export function calculateApcach(
  bgColor: string,
  cr: number,
  c: number,
  h: number,
  colorSpace: ColorSpace,
): Apcach {
  return apcach(crToBg(bgColor, cr), c, h, colorSpace);
}
