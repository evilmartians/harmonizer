import { apcach, crToBg, maxChroma, apcachToCss, inColorSpace } from "apcach";
import { Hue, Level, Settings } from "../types/config";

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
      hue.updateColor(i, colors[index]);
    });
  }
}

export class ColorRow {
  public levels: Color[];
  constructor(c: number) {
    this.levels = Array.from({ length: c }, () => ({} as Color));
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
  settings: Settings
): ColorMatrix {
  const colorMatrix = new ColorMatrix(levels.length, hues.length);
  levels.forEach((level, index) => {
    const bgColor =
      index < settings.lightLevel
        ? settings.bgColorDark
        : settings.bgColorLight;
    const levelColors = calculateLevel(level, hues, bgColor);
    colorMatrix.updateLevel(index, levelColors);
  });
  return colorMatrix;
}

/*
 * Calculates colors of given level
 */
function calculateLevel(level: Level, hues: Hue[], bgColor: string): Color[] {
  const maxCommonChroma = findMaxCommonChroma(level, hues, bgColor);
  // Calculate real colors with this chroma
  const colors: Color[] = [];
  hues.forEach((hue) => {
    const apcachColor = calculateApcach(
      bgColor,
      level.contrast,
      maxCommonChroma,
      hue.degree
    );
    const color = {
      cr: parseFloat(level.contrast.toFixed(2)),
      l: parseFloat((apcachColor.lightness * 100).toFixed(2)),
      c: parseFloat(maxCommonChroma.toFixed(2)),
      h: hue.degree,
      p3: !inColorSpace(apcachColor, "srgb"),
      css: apcachToCss(apcachColor),
    };
    console.log("color > ", apcachColor);
    colors.push(color);
  });
  return colors;
}

/**
 * Calculates colors with maximum chroma and finds chroma of the less saturated color
 */
function findMaxCommonChroma(
  level: Level,
  hues: Hue[],
  bgColor: string
): number {
  let maxCommonChroma = 100;
  hues.forEach((hue) => {
    const apcachColor = calculateApcach(
      bgColor,
      level.contrast,
      maxChroma(),
      hue.degree
    );
    if (apcachColor.chroma < maxCommonChroma) {
      maxCommonChroma = apcachColor.chroma;
    }
  });
  return maxCommonChroma;
}

function calculateApcach(
  bgColor: string,
  cr: number,
  c: number,
  h: number
): any {
  return apcach(crToBg(bgColor, cr), c, h);
  //return apcachToCss(color, "oklch");
}
