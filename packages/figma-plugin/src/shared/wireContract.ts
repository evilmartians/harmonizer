import type { ExportConfig } from "@core/types";

import type {
  FigmaRgb,
  PaletteGenerateData,
  PluginMessages,
  UIMessages,
  WindowSize,
} from "./types";

/**
 * Compile-time guard on the data crossing between the UI and the sandbox.
 *
 * The UI redeploys on every push while the sandbox only changes when the plugin is republished
 * to Figma, so the two run on different clocks. Nothing else catches a mismatch between them:
 * both sides are built from one source tree, so type checking always sees them agree. The
 * disagreement only appears at runtime, between a freshly deployed UI and an older published
 * sandbox, and it fails silently -- a palette drawn from fields the sandbox no longer
 * understands, with no error anywhere.
 *
 * When one of these stops compiling you have changed that boundary. Decide deliberately:
 * republish the plugin (and bump SANDBOX_VERSION), or keep the sandbox happy by adapting the
 * payload in the UI, which is the only side that can still be fixed after publish.
 *
 * Key sets are pinned, so added, removed and renamed fields are caught. A field that keeps its
 * name but changes type is not; those have always arrived alongside a rename here.
 */

type Exact<Actual, Expected> = [Actual] extends [Expected]
  ? [Expected] extends [Actual]
    ? true
    : false
  : false;

type Extends<Actual, Expected> = [Actual] extends [Expected] ? true : false;

type Assert<T extends true> = T;

export type WireConfigKeys = Assert<
  Exact<keyof ExportConfig, "version" | "levels" | "hues" | "settings">
>;

export type WireSettingsKeys = Assert<
  Exact<
    keyof ExportConfig["settings"],
    | "contrastModel"
    | "directionMode"
    | "chromaMode"
    | "bgLightStart"
    | "bgColorLight"
    | "bgColorDark"
    | "colorSpace"
  >
>;

export type WireLevelKeys = Assert<
  Exact<keyof ExportConfig["levels"][number], "name" | "contrast" | "chroma" | "chromaCap">
>;

export type WireHueKeys = Assert<Exact<keyof ExportConfig["hues"][number], "name" | "angle">>;

// `${levelIndex}-${hueIndex}`, read directly by the sandbox when drawing each cell.
export type WireColorKeys = Assert<
  Extends<keyof PaletteGenerateData["colors"], `${number}-${number}`>
>;

// Applied to Figma nodes as-is, so the sandbox cannot adapt a change here.
export type WireFigmaRgbKeys = Assert<Exact<keyof FigmaRgb, "r" | "g" | "b">>;

export type WirePluginMessages = Assert<Exact<keyof PluginMessages, "ready">>;

export type WireReadyPayload = Assert<
  Exact<keyof PluginMessages["ready"], "sandboxVersion" | "sandboxBuild" | "storedConfig" | "inP3">
>;

export type WireUIMessages = Assert<
  Exact<keyof UIMessages, "ui:ready" | "window:resize" | "palette:generate">
>;

export type WirePaletteGeneratePayload = Assert<
  Exact<keyof PaletteGenerateData, "config" | "colors" | "bgColorLeft" | "bgColorRight">
>;

export type WireWindowSizePayload = Assert<Exact<keyof WindowSize, "width" | "height">>;
