declare module "apcach-2" {
  export function apcach(
    op: ColorGeneratorOptions,
    gen: ColorGenerator
  ): unknown;

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
