import { TableConfig } from "../types/config";

export function validateConfig(text: string): TableConfig | null {
  const config = JSON.parse(text);
  try {
    // Check basic structure
    if (!config || typeof config !== "object") return null;
    if (!Array.isArray(config.levels) || !Array.isArray(config.hues))
      return null;
    if (!config.settings || typeof config.settings !== "object") return null;

    // Validate levels
    const validLevel = config.levels.every(
      (level: any) =>
        typeof level.name === "string" &&
        typeof level.contrast === "number" &&
        typeof level.chroma === "number"
    );
    if (!validLevel) return null;

    // Validate hues
    const validHue = config.hues.every(
      (hue: any) =>
        typeof hue.name === "string" && typeof hue.degree === "number"
    );
    if (!validHue) return null;

    // Validate settings
    const settings = config.settings;
    if (
      typeof settings.model !== "string" ||
      typeof settings.direction !== "string" ||
      typeof settings.chroma !== "string" ||
      typeof settings.lightLevel !== "number" ||
      typeof settings.bgColorLight !== "string" ||
      typeof settings.bgColorDark !== "string"
    ) {
      return null;
    }

    return config;
  } catch {
    return null;
  }
}
