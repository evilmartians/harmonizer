/// <reference types="vite/client" />

// Libraries that are not typed
declare module "apcach" {
  /* Functions */

  export function apcach(
    background: ColorGenerator | string,
    chroma: ChromaFunction | number,
    hue: number,
    alpha: number,
    colorSpace: ColorSpace,
  ): Apcach;

  export function apcachToCss(
    color: Apcach,
    format: "oklch" | "rgb" | "hex" | "p3" | "figma-p3" = "oklch",
  ): string;

  export function inColorSpace(color: Apcach, colorSpace: ColorSpace): boolean;

  export function crToBg(
    background: string,
    contrast: number | ContrastFunction,
    model?: "apca" | "wcag",
    searchDirection?: "lighter" | "darker",
  ): ColorGenerator;

  export function crToFg(
    background: string,
    contrast: number | ContrastFunction,
    model?: "apca" | "wcag",
    searchDirection?: "lighter" | "darker",
  ): ColorGenerator;

  export function maxChroma(chromaCap?: number): ChromaFunction;

  /* Types */

  export type ContrastFunction = typeof crToBg | typeof crToFg;

  export type ColorSpace = "srgb" | "p3";

  export interface Apcach {
    alpha: number;
    chroma: number;
    colorSpace: string;
    hue: number;
    lightness: number;
  }

  export interface ColorGeneratorOptions {
    hue?: number;
    chroma?: number;
    lightness?: number;
  }

  export type ColorGenerator = () => number;

  export type ContrastConfig =
    | number
    | { bgColor: string; fgColor: string; cr: number; contrastModel: "apca" | "wcag" };

  export type ChromaFunction = (
    contrastConfig: ContrastConfig,
    hue: number,
    alpha: number,
    colorSpace: ColorSpace,
  ) => number;
}

// core-js polyfill module declarations
declare module "core-js/actual/typed-array/to-base64" {}
declare module "core-js/actual/typed-array/from-base64" {}

// Type declarations for Uint8Array Base64 methods (ES2024)
// Polyfilled by core-js when not natively available
interface Uint8Array {
  toBase64(options?: { alphabet?: "base64" | "base64url"; omitPadding?: boolean }): string;
}

interface Uint8ArrayConstructor {
  fromBase64(
    base64: string,
    options?: {
      alphabet?: "base64" | "base64url";
      lastChunkHandling?: "loose" | "strict" | "stop-before-partial";
    },
  ): Uint8Array;
}
