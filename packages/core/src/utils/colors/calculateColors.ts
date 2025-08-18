import { maxChroma } from "apcach";

import {
  LevelChroma,
  HueAngle,
  LevelContrast,
  type ChromaMode,
  type ColorCellData,
  type ColorHueTintData,
  type ColorLevelTintData,
  type ColorString,
  type ContrastModel,
  type DirectionMode,
  type HueId,
  type LevelId,
  type ColorSpace,
} from "@core/types";
import { ensureNonNullable } from "@core/utils/assertions/ensureNonNullable";

import { calculateColorCell } from "./calculateColorCell";
import { getBgMode } from "./getBgMode";
import { maxCommonChroma } from "./maxCommonChroma";

export type GenerateColorsPayload = {
  levels: { id: LevelId; contrast: LevelContrast }[];
  recalcOnlyLevels: LevelId[] | undefined;
  hues: { id: HueId; angle: HueAngle }[];
  bgColorLeft: ColorString;
  bgColorRight: ColorString;
  bgRightStart: number;
  chromaMode: ChromaMode;
  colorSpace: ColorSpace;
  directionMode: DirectionMode;
  contrastModel: ContrastModel;
};

export type GeneratedLevelPayload = {
  type: "level";
  levelId: LevelId;
  cells: Record<HueId, ColorCellData>;
  tint: ColorLevelTintData;
};
export type GeneratedHueTintPayload = {
  type: "hue-tint";
  hueId: HueId;
  color: ColorHueTintData;
};

export type GeneratedColorPayload = GeneratedLevelPayload | GeneratedHueTintPayload;

const HUE_TINT_CR = LevelContrast(80);
const HUE_TINT_CHROMA = LevelChroma(0.05);
const MIN_LEVEL_TINT_CR = LevelContrast(50);

export function calculateColors(
  {
    levels,
    recalcOnlyLevels,
    hues,
    bgColorRight,
    bgColorLeft,
    bgRightStart,
    chromaMode,
    colorSpace,
    directionMode,
    contrastModel,
  }: GenerateColorsPayload,
  onGeneratedColor: (payload: GeneratedColorPayload) => void,
) {
  for (const [levelIndex, level] of levels.entries()) {
    const isBgLeft = bgRightStart > levelIndex;
    const toColor = isBgLeft ? bgColorLeft : bgColorRight;
    const bgMode = isBgLeft ? getBgMode(bgColorLeft) : getBgMode(bgColorRight);
    const searchDirection = bgMode === "dark" ? "lighter" : "darker";

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
          toColor: bgColorLeft,
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
        type: "level",
        levelId: level.id,
        tint: {
          ...calculateColorCell({
            ...commonApcacheOptions,
            hueAngle: HueAngle(0),
            contrastLevel: MIN_LEVEL_TINT_CR,
            chroma: LevelChroma(0),
          }),
          referencedC: LevelChroma(0),
        },
        cells: {},
      });
    }

    const huesEntries = [...hues.entries()];

    if (huesEntries.length === 0) {
      continue;
    }

    const cells: GeneratedLevelPayload["cells"] = {};
    let tint: ColorLevelTintData | null = null;

    for (const [hueIndex, hue] of huesEntries) {
      const cellColor = calculateColorCell({
        ...commonApcacheOptions,
        hueAngle: hue.angle,
        contrastLevel: level.contrast,
        chroma,
      });

      cells[hue.id] = cellColor;

      // Calculate level tint based only on the first hue row
      if (hueIndex === 0) {
        tint = { ...cellColor, referencedC: cellColor.c };

        if (tint.cr < MIN_LEVEL_TINT_CR) {
          tint = {
            ...calculateColorCell({
              ...commonApcacheOptions,
              hueAngle: hue.angle,
              contrastLevel: MIN_LEVEL_TINT_CR,
              chroma,
            }),
            referencedC: cellColor.c,
          };
        }
      }
    }

    onGeneratedColor({
      type: "level",
      levelId: level.id,
      tint: ensureNonNullable(tint, "Level tint is not calculated"),
      cells,
    });
  }
}
