/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "apcach" {
  export function apcach(
    chroma: ColorGenerator | number,
    contrast: number,
    hue: number,
  ): ApcachResult

  export function apcachToCss(color: any): string;

  export function inColorSpace(color: any, space: string): boolean;

  export type ApcachResult = {
    alpha: number,
    chroma: any,
    colorSpace: string
    contrastConfig: any
    hue: any
    lightness: any
  }

  export type ColorGeneratorOptions = {
    hue?: number;
    chroma?: number;
    lightness?: number;
  };

  export type ColorGenerator = (
    chroma: number,
    options?: ColorGeneratorOptions
  ) => string;

  /**
   * Creates a color generator function that produces colors with specified contrast ratio
   * @param background - Background color in hex format
   * @param contrast - Target contrast ratio
   * @param model - Contrast model ('APCA' | 'WCAG2')
   */
  export function crToBg(
    background: string,
    contrast: number,
    model?: "APCA" | "WCAG2"
  ): ColorGenerator;

  /**
   * Returns maximum possible chroma value
   */
  export function maxChroma(): number;
}
