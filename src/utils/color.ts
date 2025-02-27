import {
  apcach,
  apcachToCss,
  crToBg,
  inColorSpace,
  maxChroma,
  type Apcach,
  type ChromaFunction,
  type ColorSpace,
} from "apcach";

import { getMiddleValue } from "./misc";

import {
  chromaLevel,
  colorString,
  contrastLevel,
  hueAngle,
  lightnessLevel,
  type ChromaLevel,
  type ChromaMode,
  type ColorCellData,
  type ColorHueTintData,
  type ColorLevelTintData,
  type ColorString,
  type ContrastLevel,
  type HueAngle,
  type HueId,
  type LevelId,
} from "@/types";

export function apcachToBg(
  bgColor: ColorString,
  cr: ContrastLevel,
  c: ChromaLevel | ChromaFunction,
  h: HueAngle,
  colorSpace: ColorSpace,
): Apcach {
  return apcach(crToBg(bgColor, cr), c, h, colorSpace);
}

type MaxCommonChromaOptions = {
  colorSpace: ColorSpace;
  bgColor: ColorString;
  contrastLevel: ContrastLevel;
  hueAngles: HueAngle[];
};

export function maxCommonChroma({
  colorSpace,
  bgColor,
  contrastLevel,
  hueAngles,
}: MaxCommonChromaOptions): ChromaLevel {
  let maxCommonChroma = 100;

  for (const hueAngle of hueAngles) {
    const apcachColor = apcachToBg(bgColor, contrastLevel, maxChroma(), hueAngle, colorSpace);
    if (apcachColor.chroma < maxCommonChroma) {
      maxCommonChroma = apcachColor.chroma;
    }
  }
  return chromaLevel(maxCommonChroma);
}

type ColorCellOptions = {
  colorSpace: ColorSpace;
  bgColor: ColorString;
  contrastLevel: ContrastLevel;
  chroma: ChromaFunction | ChromaLevel;
  hueAngle: HueAngle;
};

export function calculateColorCell({
  colorSpace,
  bgColor,
  contrastLevel,
  hueAngle,
  chroma,
}: ColorCellOptions): ColorCellData {
  const apcachColor = apcachToBg(bgColor, contrastLevel, chroma, hueAngle, colorSpace);

  return {
    cr: contrastLevel,
    l: lightnessLevel(apcachColor.lightness),
    c: chromaLevel(apcachColor.chroma),
    h: hueAngle,
    p3: !inColorSpace(apcachColor, "srgb"),
    css: colorString(apcachToCss(apcachColor)),
  };
}

export type GenerateColorsPayload = {
  levels: { id: LevelId; contrast: ContrastLevel }[];
  onlyLevelId: LevelId | undefined;
  hues: { id: HueId; angle: HueAngle }[];
  bgColorLight: ColorString;
  bgColorDark: ColorString;
  bgLightStart: number;
  chromaMode: ChromaMode;
  colorSpace: ColorSpace;
};

const HUE_TINT_CR = contrastLevel(80);
const HUE_TINT_CHROMA = chromaLevel(0.05);
const MIN_LEVEL_TINT_CR = contrastLevel(50);

export type GeneratedCellPayload = {
  type: "cell";
  levelId: LevelId;
  hueId: HueId;
  color: ColorCellData;
};
export type GeneratedLevelTintPayload = {
  type: "level-tint";
  levelId: LevelId;
  color: ColorLevelTintData;
};
export type GeneratedHueTintPayload = {
  type: "hue-tint";
  hueId: HueId;
  color: ColorHueTintData;
};

export type GeneratedColorPayload =
  | GeneratedCellPayload
  | GeneratedLevelTintPayload
  | GeneratedHueTintPayload;

export function calculateColors(
  {
    levels,
    onlyLevelId,
    hues,
    bgColorLight,
    bgColorDark,
    bgLightStart,
    chromaMode,
    colorSpace,
  }: GenerateColorsPayload,
  onGeneratedColor: (payload: GeneratedColorPayload) => void,
) {
  for (const [levelIndex, level] of levels.entries()) {
    const bgColor = bgLightStart <= levelIndex ? bgColorLight : bgColorDark;
    const chroma =
      chromaMode === "even"
        ? maxCommonChroma({
            contrastLevel: level.contrast,
            hueAngles: hues.map((hue) => hue.angle),
            colorSpace,
            bgColor,
          })
        : maxChroma();

    // Calculate hue tint based only on the 0 index level
    if (levelIndex === 0) {
      for (const hue of hues.values()) {
        const hueTintColor = calculateColorCell({
          hueAngle: hue.angle,
          colorSpace,
          bgColor: bgColorDark,
          contrastLevel: HUE_TINT_CR,
          chroma: HUE_TINT_CHROMA,
        });
        onGeneratedColor({ type: "hue-tint", hueId: hue.id, color: hueTintColor });
      }
    }

    if (onlyLevelId && level.id !== onlyLevelId) {
      continue;
    }

    // Reset level tint color when there are no hue rows
    if (hues.length === 0) {
      onGeneratedColor({
        type: "level-tint",
        levelId: level.id,
        color: {
          ...calculateColorCell({
            hueAngle: hueAngle(0),
            colorSpace,
            bgColor,
            contrastLevel: MIN_LEVEL_TINT_CR,
            chroma: chromaLevel(0),
          }),
          referencedC: chromaLevel(0),
        },
      });
    }

    for (const [hueIndex, hue] of hues.entries()) {
      const cellColor = calculateColorCell({
        hueAngle: hue.angle,
        colorSpace,
        bgColor,
        contrastLevel: level.contrast,
        chroma,
      });
      onGeneratedColor({ type: "cell", levelId: level.id, hueId: hue.id, color: cellColor });

      // Calculate level tint based only on the first hue row
      if (hueIndex === 0) {
        let levelTintColor: ColorLevelTintData = { ...cellColor, referencedC: cellColor.c };

        if (levelTintColor.cr < MIN_LEVEL_TINT_CR) {
          levelTintColor = {
            ...calculateColorCell({
              hueAngle: hue.angle,
              colorSpace,
              bgColor,
              contrastLevel: MIN_LEVEL_TINT_CR,
              chroma,
            }),
            referencedC: cellColor.c,
          };
        }

        onGeneratedColor({ type: "level-tint", levelId: level.id, color: levelTintColor });
      }
    }
  }
}

/**
 * Calculates the middle hue angle between two given hue angles. The order of the hue angles does not matter.
 *
 * @param hueAngle1 - The first hue angle.
 * @param hueAngle2 - The second hue angle.
 * @returns The middle hue angle.
 */
export const getMiddleHueAngle = getMiddleValue<HueAngle>;

/**
 * Calculates the middle contrast level between two given contrast levels. The order of the contrast levels does not matter.
 *
 * @param contrast1 - The first contrast level.
 * @param contrast2 - The second contrast level.
 * @returns The middle contrast level.
 */
export const getMiddleContrastLevel = getMiddleValue<ContrastLevel>;
