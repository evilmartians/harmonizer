export const levelStepsPresets = {
  default: {
    label: "Default (9 steps: 100-900)",
    steps: [
      { name: "100", contrast: 100, chroma: 0 },
      { name: "200", contrast: 90, chroma: 0 },
      { name: "300", contrast: 77, chroma: 0 },
      { name: "400", contrast: 65, chroma: 0 },
      { name: "500", contrast: 51, chroma: 0 },
      { name: "600", contrast: 65, chroma: 0 },
      { name: "700", contrast: 77, chroma: 0 },
      { name: "800", contrast: 90, chroma: 0 },
      { name: "900", contrast: 100, chroma: 0 },
    ],
  },
  extended: {
    label: "Extended (11 steps: 50-950)",
    steps: [
      { name: "50", contrast: 106, chroma: 0 },
      { name: "100", contrast: 100, chroma: 0 },
      { name: "200", contrast: 90, chroma: 0 },
      { name: "300", contrast: 77, chroma: 0 },
      { name: "400", contrast: 65, chroma: 0 },
      { name: "500", contrast: 51, chroma: 0 },
      { name: "600", contrast: 65, chroma: 0 },
      { name: "700", contrast: 77, chroma: 0 },
      { name: "800", contrast: 90, chroma: 0 },
      { name: "900", contrast: 100, chroma: 0 },
      { name: "950", contrast: 106, chroma: 0 },
    ],
  },
  minimal: {
    label: "Minimal (5 steps: 100-900)",
    steps: [
      { name: "100", contrast: 100, chroma: 0 },
      { name: "300", contrast: 77, chroma: 0 },
      { name: "500", contrast: 51, chroma: 0 },
      { name: "700", contrast: 77, chroma: 0 },
      { name: "900", contrast: 100, chroma: 0 },
    ],
  },
  compact: {
    label: "Compact (7 steps: 200-800)",
    steps: [
      { name: "200", contrast: 90, chroma: 0 },
      { name: "300", contrast: 77, chroma: 0 },
      { name: "400", contrast: 65, chroma: 0 },
      { name: "500", contrast: 51, chroma: 0 },
      { name: "600", contrast: 65, chroma: 0 },
      { name: "700", contrast: 77, chroma: 0 },
      { name: "800", contrast: 90, chroma: 0 },
    ],
  },
} as const;

export type LevelStepsPreset = keyof typeof levelStepsPresets;
