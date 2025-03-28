import type { ExportConfig, IndexedColors } from "@core/types";

export type PaletteConfig = ExportConfig & {
  colors: IndexedColors;
};

export type PluginMessages = {
  ready: { paletteConfig: string | null; inP3: boolean };
};

export type UIMessages = {
  "palette:generate": PaletteConfig;
};
