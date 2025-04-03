import type { NoDeepReadonly } from "@core/utils/ts/generics";

export const defaultConfig = {
  levels: [
    { name: "100", contrast: 100, chroma: 0 },
    { name: "200", contrast: 90, chroma: 0 },
    { name: "300", contrast: 77, chroma: 0 },
    { name: "400", contrast: 65, chroma: 0 },
    { name: "500", contrast: 54, chroma: 0 },
    { name: "600", contrast: 65, chroma: 0 },
    { name: "700", contrast: 77, chroma: 0 },
    { name: "800", contrast: 90, chroma: 0 },
    { name: "900", contrast: 100, chroma: 0 },
  ],
  hues: [
    { name: "Red", angle: 20 },
    { name: "Yellow", angle: 90 },
    { name: "Green", angle: 123 },
    { name: "Blue", angle: 210 },
    { name: "Violet", angle: 280 },
    { name: "Pink", angle: 340 },
  ],
  settings: {
    contrastModel: "apca",
    directionMode: "fgToBg",
    chromaMode: "even",
    colorSpace: "p3",
    bgColorLight: "#fff",
    bgColorDark: "#000",
    bgLightStart: 5,
  },
} as const;

export function getDefaultConfigCopy() {
  return structuredClone(defaultConfig) as unknown as NoDeepReadonly<typeof defaultConfig>;
}
