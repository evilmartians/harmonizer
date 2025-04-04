import type { BgModeType } from "@core/components/BgMode/types";
import type { LevelIndex } from "@core/types";
import { useValueAsSignal } from "@core/utils/spred/useValueAsSignal";
import { useSignal, useSubscribe } from "@spred/react";

import { $bgColorDarkBgMode, $bgColorLightBgMode, $bgLightStart } from "./settings";

export function useLevelBgMode(levelIndex: LevelIndex): BgModeType {
  const $levelIndex = useValueAsSignal(levelIndex);
  const $levelBgMode = useSignal((get) => {
    return get($levelIndex) < get($bgLightStart)
      ? get($bgColorDarkBgMode)
      : get($bgColorLightBgMode);
  });

  return useSubscribe($levelBgMode);
}
