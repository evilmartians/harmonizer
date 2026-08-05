export const FIXTURE_MIN_SANDBOX_VERSION = 1;

/**
 * A payload built the way the UI builds one, as plain data. Kept unbranded and untyped on
 * purpose: the checks it feeds are about what arrives at runtime, not about what compiles.
 */
export function paletteGenerateFixture() {
  return {
    minSandboxVersion: FIXTURE_MIN_SANDBOX_VERSION,
    config: {
      version: 1,
      levels: [{ name: "50", contrast: 60, chroma: 0.1 }],
      hues: [{ name: "red", angle: 20 }],
      settings: {
        contrastModel: "apca",
        directionMode: "fgToBg",
        chromaMode: "even",
        bgLightStart: 1,
        bgColorLight: "#ffffff",
        bgColorDark: "#000000",
        colorSpace: "srgb",
      },
    },
    colors: { "0-0": { r: 0, g: 0.5, b: 1 } },
    bgColorLeft: { r: 0, g: 0, b: 0 },
    bgColorRight: { r: 1, g: 1, b: 1 },
  };
}
