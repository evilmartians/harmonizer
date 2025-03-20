import type { BgModeType } from "@core/components/BgMode/types";
import { useValueAsSignal } from "@core/utils/spred/useValueAsSignal";
import { useSignal, useSubscribe } from "@spred/react";

import { $bgLightStart } from "./settings";

export function useLevelBgMode(levelIndex: number): BgModeType {
  const $levelIndex = useValueAsSignal(levelIndex);
  const $levelBgMode = useSignal((get) => {
    return get($levelIndex) < get($bgLightStart) ? ("dark" as const) : ("light" as const);
  });

  return useSubscribe($levelBgMode);
}
