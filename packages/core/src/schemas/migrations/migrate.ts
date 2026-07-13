import { datavolve, type EvolveError } from "datavolve";
import * as v from "valibot";

import { exportConfigSchema } from "@core/schemas/exportConfig";
import type { ExportConfig } from "@core/types";
import { MigrationError } from "@core/utils/errors/MigrationError";

import { migrateFromLegacyCompact } from "./migrateFromLegacyCompact";

// Version 0 is pre-versioned data: the legacy compact 3-tuple
const configMigrations = datavolve().add(1, (input) => migrateFromLegacyCompact(input));

function formatEvolveError(error: EvolveError): string {
  switch (error.code) {
    case "ahead":
      return `Config version ${error.fromVersion} is newer than the latest supported version ${error.latestVersion}`;
    case "malformed":
      return `Invalid config version: ${error.fromVersion}`;
    case "failed":
      return `Migration to version ${error.failedVersion} failed: ${
        error.cause instanceof Error ? error.cause.message : String(error.cause)
      }`;
    default:
      return error satisfies never;
  }
}

/**
 * Migrate a config to the latest version
 *
 * @param config - Config data at fromVersion
 * @param fromVersion - Version of the incoming data; 0 means legacy compact (pre-versioned)
 * @returns Config migrated to the latest version
 * @throws MigrationError if the config version is unsupported or a migration step fails
 */
export function migrate(config: unknown, fromVersion: number): ExportConfig {
  const result = configMigrations.run(config, fromVersion);

  if (!result.success) {
    throw new MigrationError(formatEvolveError(result.error));
  }

  return v.parse(exportConfigSchema, result.value);
}
