import type { ExportConfig, IndexedColors } from "@core/types";

export type WindowSize = { width: number; height: number };

/**
 * Channels in 0..1, the shape Figma's plugin API takes for colors. Declared here rather than
 * reusing the API's own `RGB` because the UI build does not load the Figma typings.
 */
export type FigmaRgb = { r: number; g: number; b: number };

/**
 * Every color arrives ready to draw. The sandbox is frozen at publish time, so resolving colors
 * there would freeze the conversion too: a color fix would need a republish, and the preview and
 * the drawn frame could silently disagree while types on the wire stayed identical. Converting in
 * the UI keeps that logic on the side we can redeploy.
 */
export type PaletteGenerateData = {
  config: ExportConfig;
  colors: Record<keyof IndexedColors, FigmaRgb>;
  bgColorLeft: FigmaRgb;
  bgColorRight: FigmaRgb;
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
