import { toOklch } from "./toOklch";

/**
 * Parses a hex color string and returns its hue angle in OKLch color space.
 * Accepts hex colors with or without # prefix.
 * Returns null if the input is not a valid hex color.
 */
export function hexToHueAngle(input: string): number | null {
  // Remove whitespace
  const trimmed = input.trim();

  // Check if it looks like a hex color (with or without #)
  const hexPattern = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (!hexPattern.test(trimmed)) {
    return null;
  }

  // Add # prefix if missing
  const hex = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  // Convert to OKLch
  const oklch = toOklch(hex);

  // Return null if conversion failed or hue is undefined (achromatic)
  if (oklch?.h === undefined) {
    return null;
  }

  return oklch.h;
}
