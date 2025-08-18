import { useSubscribe } from "@spred/react";

import type { BgColor, BgModeType } from "@core/components/BgMode/types";
import { $levelIdsToIndex } from "@core/stores/colors";
import type { LevelId } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";

import { $bgColorModeLeft, $bgColorModeRight, $bgRightStart } from "./settings";

export function useLevelBgColor(levelId: LevelId): BgColor {
  const levelIdsToIndex = useSubscribe($levelIdsToIndex);
  const bgRightStart = useSubscribe($bgRightStart);
  const levelIndex = levelIdsToIndex[levelId];

  invariant(levelIndex !== undefined, "Level not found for the given ID");

  return levelIndex < bgRightStart ? "left" : "right";
}

export function useLevelBgMode(levelId: LevelId): BgModeType {
  const levelIdsToIndex = useSubscribe($levelIdsToIndex);
  const bgRightStart = useSubscribe($bgRightStart);
  const bgColorBgModeLeft = useSubscribe($bgColorModeLeft);
  const bgColorBgModeRight = useSubscribe($bgColorModeRight);
  const levelIndex = levelIdsToIndex[levelId];

  invariant(levelIndex !== undefined, "Level not found for the given ID");

  return levelIndex < bgRightStart ? bgColorBgModeLeft : bgColorBgModeRight;
}
