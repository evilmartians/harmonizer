import type { ExportConfig, IndexedColors } from "@core/types";

export type WindowSize = { width: number; height: number };

export type PaletteConfig = ExportConfig & {
  colors: IndexedColors;
};

export type PluginMessages = {
  ready: { paletteConfig: string | null; inP3: boolean };
};

export type UIMessages = {
  "window:resize": WindowSize;
  "palette:generate": PaletteConfig;
};
