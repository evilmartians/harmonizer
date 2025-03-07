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
  type DirectionMode,
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
  type ContrastModel,
} from "@/types";

export type SearchDirection = "lighter" | "darker";

type ApcachOptions = {
  directionMode: DirectionMode;
  contrastModel: ContrastModel;
  searchDirection: SearchDirection;
  colorSpace: ColorSpace;
  toColor: ColorString;
  contrastLevel: ContrastLevel;
  chroma: ChromaLevel | ChromaFunction;
  hueAngle: HueAngle;
};

export function calculateApcach({
  directionMode,
  contrastModel,
  searchDirection,
  colorSpace,
  toColor,
  contrastLevel,
  chroma,
  hueAngle,
}: ApcachOptions): Apcach {
  const method = directionMode === "fgToBg" ? crToBg : crToFg;
  const bg = method(toColor, contrastLevel, contrastModel, searchDirection);

  return apcach(bg, chroma, hueAngle, colorSpace);
}

type MaxCommonChromaOptions = Omit<ApcachOptions, "hueAngle" | "chroma"> & {
  hueAngles: HueAngle[];
};

export function maxCommonChroma({
  hueAngles,
  ...restOptions
}: MaxCommonChromaOptions): ChromaLevel {
  let maxCommonChroma = 100;

  for (const hueAngle of hueAngles) {
    const apcachColor = calculateApcach({
      ...restOptions,
      chroma: maxChroma(),
      hueAngle: hueAngle,
    });

    if (apcachColor.chroma < maxCommonChroma) {
      maxCommonChroma = apcachColor.chroma;
    }
  }
  return chromaLevel(maxCommonChroma);
}

type ColorCellOptions = ApcachOptions;

export function calculateColorCell(options: ColorCellOptions): ColorCellData {
  const apcachColor = calculateApcach(options);

  return {
    cr: options.contrastLevel,
    l: lightnessLevel(apcachColor.lightness),
    c: chromaLevel(apcachColor.chroma),
    h: options.hueAngle,
    p3: !inColorSpace(apcachColor, "srgb"),
    css: colorString(apcachToCss(apcachColor)),
  };
}

export type GenerateColorsPayload = {
  levels: { id: LevelId; contrast: ContrastLevel }[];
  recalcOnlyLevels: LevelId[] | undefined;
  hues: { id: HueId; angle: HueAngle }[];
  bgColorLight: ColorString;
  bgColorDark: ColorString;
  bgLightStart: number;
  chromaMode: ChromaMode;
  colorSpace: ColorSpace;
  directionMode: DirectionMode;
  contrastModel: ContrastModel;
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
    recalcOnlyLevels,
    hues,
    bgColorLight,
    bgColorDark,
    bgLightStart,
    chromaMode,
    colorSpace,
    directionMode,
    contrastModel,
  }: GenerateColorsPayload,
  onGeneratedColor: (payload: GeneratedColorPayload) => void,
) {
  for (const [levelIndex, level] of levels.entries()) {
    const isBgDark = bgLightStart > levelIndex;
    const toColor = isBgDark ? bgColorDark : bgColorLight;
    const searchDirection = isBgDark ? "lighter" : "darker";

    const commonApcacheOptions = {
      colorSpace,
      toColor,
      searchDirection,
      directionMode,
      contrastModel,
    } as const;

    const chroma =
      chromaMode === "even"
        ? maxCommonChroma({
            ...commonApcacheOptions,
            contrastLevel: level.contrast,
            hueAngles: hues.map((hue) => hue.angle),
          })
        : maxChroma();

    // Calculate hue tint based only on the 0 index level
    if (levelIndex === 0) {
      for (const hue of hues.values()) {
        const hueTintColor = calculateColorCell({
          ...commonApcacheOptions,
          toColor: bgColorDark,
          searchDirection: "lighter",
          hueAngle: hue.angle,
          contrastLevel: HUE_TINT_CR,
          chroma: HUE_TINT_CHROMA,
        });
        onGeneratedColor({ type: "hue-tint", hueId: hue.id, color: hueTintColor });
      }
    }

    if (recalcOnlyLevels && !recalcOnlyLevels.includes(level.id)) {
      continue;
    }

    // Reset level tint color when there are no hue rows
    if (hues.length === 0) {
      onGeneratedColor({
        type: "level-tint",
        levelId: level.id,
        color: {
          ...calculateColorCell({
            ...commonApcacheOptions,
            hueAngle: hueAngle(0),
            contrastLevel: MIN_LEVEL_TINT_CR,
            chroma: chromaLevel(0),
          }),
          referencedC: chromaLevel(0),
        },
      });
    }

    for (const [hueIndex, hue] of hues.entries()) {
      const cellColor = calculateColorCell({
        ...commonApcacheOptions,
        hueAngle: hue.angle,
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
              ...commonApcacheOptions,
              hueAngle: hue.angle,
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

// These functions are approximation, since the APCA and WCAG algorithms are not directly comparable.
export function apcaToWcag(apcaLc: number) {
  if (apcaLc === 0) {
    return 1;
  }

  const wcagRatio = (Math.abs(apcaLc) / 110) ** 2.4 * 21;
  return Number.parseFloat(wcagRatio.toFixed(1));
}

export function wcagToApca(wcagRatio: number) {
  if (wcagRatio <= 1) {
    return 0;
  }

  const apcaLc = 110 * (wcagRatio / 21) ** (1 / 2.4);
  return Number.parseFloat(apcaLc.toFixed(0));
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
