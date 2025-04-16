import { useSignal, useSubscribe } from "@spred/react";

import type { BgModeType } from "@core/components/BgMode/types";
import { $levelIdsToIndex } from "@core/stores/colors";
import type { LevelId } from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";

import { $bgColorDarkBgMode, $bgColorLightBgMode, $bgLightStart } from "./settings";

export function useLevelBgMode(levelId: LevelId): BgModeType {
  const $levelBgMode = useSignal((get) => {
    const levelIndex = get($levelIdsToIndex)[levelId];

    invariant(levelIndex !== undefined, "Level not found for the given ID");

    return levelIndex < get($bgLightStart) ? get($bgColorDarkBgMode) : get($bgColorLightBgMode);
  });

  return useSubscribe($levelBgMode);
}
