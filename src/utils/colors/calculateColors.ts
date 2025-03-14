import { maxChroma, type ColorSpace } from "apcach";

import { calculateColorCell } from "./calculateColorCell";
import { maxCommonChroma } from "./maxCommonChroma";

import {
  chromaLevel,
  contrastLevel,
  hueAngle,
  type ChromaMode,
  type ColorCellData,
  type ColorHueTintData,
  type ColorLevelTintData,
  type ColorString,
  type ContrastLevel,
  type ContrastModel,
  type DirectionMode,
  type HueAngle,
  type HueId,
  type LevelId,
} from "@/types";

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

const HUE_TINT_CR = contrastLevel(80);
const HUE_TINT_CHROMA = chromaLevel(0.05);
const MIN_LEVEL_TINT_CR = contrastLevel(50);

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
