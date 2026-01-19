import * as v from "valibot";

import {
  exportConfigSchema,
  exportConfigV1Schema,
  type ExportConfigVersioned,
} from "@core/schemas/exportConfig";
import type { ExportConfig } from "@core/types";

import { MigrationBuilder } from "./migrationBuilder";

const configMigrations = MigrationBuilder.create<ExportConfigVersioned>()
  .addMigration(1, (input) => v.parse(exportConfigV1Schema, input))
  .addMigration(2, (input) => ({
    ...input,
    settings: { ...input.settings, showContrastLabels: false },
  }))
  .build((result): ExportConfig => v.parse(exportConfigSchema, result));

/**
 * Migrate a versioned config to the latest version
 *
 * @param config - Config with version field
 * @returns Promise resolving to the latest version config
 * @throws MigrationError if version gap detected or migration fails
 */
export function migrate(config: ExportConfigVersioned): Promise<ExportConfig> {
  return configMigrations.migrate(config);
}
