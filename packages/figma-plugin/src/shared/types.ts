import type { ExportConfigWithColors } from "@core/types";

export type WindowSize = { width: number; height: number };

type BgColor = ExportConfigWithColors["settings"]["bgColorLight"];

export type PaletteGenerateData = {
  config: ExportConfigWithColors;
  /**
   * Resolved in the UI rather than recomputed in the sandbox. The sandbox is frozen at publish
   * time, so if both sides derived these from the bg utils they could silently disagree: the
   * preview would show one background split and the drawn frame another, with identical types
   * on the wire and nothing to catch it.
   */
  bgColorLeft: BgColor;
  bgColorRight: BgColor;
};

export type PluginMessages = {
  ready: {
    sandboxVersion: number;
    sandboxBuild: string;
    storedConfig: string | null;
    inP3: boolean;
  };
};

export type UIMessages = {
  "ui:ready": never;
  "window:resize": WindowSize;
  "palette:generate": PaletteGenerateData;
};
