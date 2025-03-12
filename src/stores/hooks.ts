import { useSignal, useSubscribe } from "@spred/react";

import { $bgLightStart } from "./settings";

import type { BgModeType } from "@/components/BgMode/types";
import { useValueAsSignal } from "@/utils/spred/useValueAsSignal";

export function useLevelBgMode(levelIndex: number): BgModeType {
  const $levelIndex = useValueAsSignal(levelIndex);
  const $levelBgMode = useSignal((get) => {
    return get($levelIndex) < get($bgLightStart) ? ("dark" as const) : ("light" as const);
  });

  return useSubscribe($levelBgMode);
}
