import type { BgRightStart } from "@core/types";

export function isSingleBgLeft(bgRightStart: BgRightStart, levelsCount: number) {
  return bgRightStart === levelsCount && levelsCount > 0;
}

export function isSingleBgRight(bgRightStart: BgRightStart) {
  return bgRightStart === 0;
}

export function getBgValueLeft<V>(isSingleRight: boolean, leftValue: V, rightValue: V): V {
  return isSingleRight ? rightValue : leftValue;
}

export function getBgValueRight<V>(isSingleLeft: boolean, leftValue: V, rightValue: V): V {
  return isSingleLeft ? leftValue : rightValue;
}
