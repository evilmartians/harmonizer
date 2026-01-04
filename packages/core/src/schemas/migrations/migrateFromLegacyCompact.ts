import * as v from "valibot";

import {
  type CompactExportConfig,
  type ExportConfigV1,
  parseCompactExportConfig,
} from "@core/schemas/exportConfig";

import { LevelChroma } from "../brand";
import {
  getLevelContrastModel,
  hueAngleSchema,
  hueNameSchema,
  levelChromaCapSchema,
  levelNameSchema,
} from "../color";

function toExportConfigV1(compactConfig: CompactExportConfig): ExportConfigV1 {
  const contrastModel = compactConfig[2][0];
  const levels: ExportConfigV1["levels"] = [];
  const hues: ExportConfigV1["hues"] = [];

  for (let i = 0; i < compactConfig[0].length; i += 3) {
    const name = v.parse(levelNameSchema, compactConfig[0][i]);
    const contrast = v.parse(getLevelContrastModel(contrastModel), compactConfig[0][i + 1]);
    const chromaCap = v.parse(levelChromaCapSchema, compactConfig[0][i + 2]);

    levels.push({ name, contrast, chroma: LevelChroma(0), chromaCap });
  }

  for (let i = 0; i < compactConfig[1].length; i += 2) {
    const hueName = v.parse(hueNameSchema, compactConfig[1][i]);
    const angle = v.parse(hueAngleSchema, compactConfig[1][i + 1]);

    hues.push({ name: hueName, angle });
  }

  return {
    version: 1,
    levels,
    hues,
    settings: {
      contrastModel,
      directionMode: compactConfig[2][1],
      chromaMode: compactConfig[2][2],
      bgColorLight: compactConfig[2][3],
      bgColorDark: compactConfig[2][4],
      bgLightStart: compactConfig[2][5],
      colorSpace: compactConfig[2][6],
    },
  };
}

/**
 * Migrates from legacy compact format to v1 ExportConfig
 *
 * @param compactData - The parsed compact array (3-tuple)
 * @returns ExportConfig with version: 1
 */
export function migrateFromLegacyCompact(compactData: unknown): ExportConfigV1 {
  const compactConfig = parseCompactExportConfig(compactData);

  return toExportConfigV1(compactConfig);
}
