import * as v from "valibot";

import type { ExportConfig } from "@core/types";

import type {
  FigmaRgb,
  PaletteGenerateData,
  PluginMessages,
  UIMessages,
  WindowSize,
} from "./types";

/**
 * The data crossing between the UI and the sandbox, guarded at build time and again at runtime.
 *
 * The UI redeploys on every push while the sandbox only changes when the plugin is republished
 * to Figma, so the two run on different clocks. Nothing else catches a mismatch between them:
 * both sides are built from one source tree, so type checking always sees them agree. The
 * disagreement only appears at runtime, between a freshly deployed UI and an older published
 * sandbox.
 *
 * When one of the assertions below stops compiling you have changed that boundary. Decide
 * deliberately: republish the plugin (and bump SANDBOX_VERSION), or keep the sandbox happy by
 * adapting the payload in the UI, which is the only side that can still be fixed after publish.
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
  Exact<keyof UIMessages, "ui:ready" | "ui:mounted" | "window:resize" | "palette:generate">
>;

export type WirePaletteGeneratePayload = Assert<
  Exact<
    keyof PaletteGenerateData,
    "minSandboxVersion" | "config" | "colors" | "bgColorLeft" | "bgColorRight"
  >
>;

export type WireWindowSizePayload = Assert<Exact<keyof WindowSize, "width" | "height">>;

/**
 * Read before the shape is checked, so a payload built for a newer sandbox says so instead of
 * failing as malformed.
 */
const wireEnvelopeSchema = v.looseObject({ minSandboxVersion: v.number() });

// Figma rejects anything outside this, and the sandbox applies these to nodes unchanged.
const colorChannelSchema = v.pipe(v.number(), v.minValue(0), v.maxValue(1));

const figmaRgbSchema = v.object({
  r: colorChannelSchema,
  g: colorChannelSchema,
  b: colorChannelSchema,
});

/**
 * Types are pinned throughout. Values are pinned only where the limit is Figma's own and cannot
 * loosen: a channel outside 0..1 is refused, and a background split reaching past the levels it
 * indexes resizes a frame to a negative width. Harmonizer's own rules stay out. A contrast model
 * the sandbox has never heard of still draws, so narrowing to the unions the UI happens to use
 * today would freeze a policy that has to keep moving.
 */
const paletteGenerateSchema = v.pipe(
  v.object({
    minSandboxVersion: v.number(),
    config: v.object({
      version: v.number(),
      levels: v.array(
        v.object({
          name: v.string(),
          contrast: v.number(),
          chroma: v.number(),
          chromaCap: v.optional(v.nullable(v.number())),
        }),
      ),
      hues: v.array(v.object({ name: v.string(), angle: v.number() })),
      settings: v.object({
        contrastModel: v.string(),
        directionMode: v.string(),
        chromaMode: v.string(),
        bgLightStart: v.number(),
        bgColorLight: v.string(),
        bgColorDark: v.string(),
        colorSpace: v.string(),
      }),
    }),
    colors: v.record(v.string(), figmaRgbSchema),
    bgColorLeft: figmaRgbSchema,
    bgColorRight: figmaRgbSchema,
  }),
  v.check(
    ({ config }) =>
      config.settings.bgLightStart >= 0 && config.settings.bgLightStart <= config.levels.length,
    "The background split must stay within the levels",
  ),
  // The grid is drawn cell by cell, so a colour discovered missing halfway through leaves the
  // document holding the variables and nodes already written for the cells before it.
  v.check(
    ({ config, colors }) =>
      config.levels.every((_level, levelIndex) =>
        config.hues.every((_hue, hueIndex) => `${levelIndex}-${hueIndex}` in colors),
      ),
    "Every level and hue pair needs a colour",
  ),
);

/**
 * Pins the field types the key sets above cannot see. A field that keeps its name but changes
 * type stops satisfying the schema it is checked against, and the build fails here rather than
 * inside a published sandbox that already trusted the payload.
 */
export type WirePaletteGenerateTypes = Assert<
  Extends<PaletteGenerateData, v.InferOutput<typeof paletteGenerateSchema>>
>;

export type PaletteGenerateCheck =
  | { status: "supported"; data: PaletteGenerateData }
  | { status: "unsupported-sandbox"; minSandboxVersion: number }
  | { status: "invalid" };

/**
 * The UI runs this same comparison against the version it was handed in the handshake, and
 * stops before it ever builds a payload. Running it again here puts the decision on the side
 * that cannot be redeployed, which is the side that would do the drawing.
 */
export function checkPaletteGenerateData(
  payload: unknown,
  sandboxVersion: number,
): PaletteGenerateCheck {
  const envelope = v.safeParse(wireEnvelopeSchema, payload);

  if (!envelope.success) {
    return { status: "invalid" };
  }

  if (sandboxVersion < envelope.output.minSandboxVersion) {
    return {
      status: "unsupported-sandbox",
      minSandboxVersion: envelope.output.minSandboxVersion,
    };
  }

  if (!v.is(paletteGenerateSchema, payload)) {
    return { status: "invalid" };
  }

  // The payload as received, not the parsed copy: valibot strips what the schema does not
  // declare, and the config is stored verbatim in plugin data.
  return { status: "supported", data: payload as PaletteGenerateData };
}
