import { object, array, string, number, parse } from "valibot";

import type { TableConfig } from "../types/config";

const configSchema = object({
  levels: array(object({ name: string(), contrast: number(), chroma: number() })),
  hues: array(object({ name: string(), angle: number() })),
  settings: object({
    model: string(),
    direction: string(),
    chroma: string(),
    bgLightLevel: number(),
    bgColorLight: string(),
    bgColorDark: string(),
    colorSpace: string(),
  }),
});

export function validateConfig(text: string): TableConfig | null {
  try {
    return parse(configSchema, JSON.parse(text));
  } catch {
    return null;
  }
}
