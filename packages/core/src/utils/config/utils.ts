import { kebabCase } from "es-toolkit/string";

import type { HueName, LevelName } from "@core/types";

export function buildName(hueName: HueName, levelName: LevelName): string {
  return kebabCase(`${hueName}-${levelName}`);
}
