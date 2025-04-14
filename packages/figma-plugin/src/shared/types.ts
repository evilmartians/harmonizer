import type { ExportConfigWithColors } from "@core/types";

export type WindowSize = { width: number; height: number };

export type PluginMessages = {
  ready: { storedConfig: string | null; inP3: boolean };
};

export type UIMessages = {
  "window:resize": WindowSize;
  "palette:generate": ExportConfigWithColors;
};
