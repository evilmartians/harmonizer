import type { BgLightStart } from "@core/types";

export function isSingleDarkBg(bgLightStart: BgLightStart, levelsCount: number) {
  return bgLightStart === levelsCount && levelsCount > 0;
}

export function isSingleLightBg(bgLightStart: BgLightStart) {
  return bgLightStart === 0;
}

export function getBgDarkValue<V>(isSingleLight: boolean, darkValue: V, lightValue: V): V {
  return isSingleLight ? lightValue : darkValue;
}

export function getBgLightValue<V>(isSingleDark: boolean, darkValue: V, lightValue: V): V {
  return isSingleDark ? darkValue : lightValue;
}
