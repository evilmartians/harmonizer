import type { ExportConfigVersioned } from "@core/schemas/exportConfig";
import { MigrationError } from "@core/utils/errors/MigrationError";

import type { MigrationChain, MigrationFn, MigrationDefinition } from "./types";

/**
 * Type-safe migration chain builder
 *
 * Builds a chain of migrations where each migration's input type
 * is inferred from the previous migration's output type.
 *
 * @example
 * ```ts
 * const migrations = MigrationBuilder
 *   .create<ExportConfigVersioned>()
 *   .addMigration(1, (input) => ({ ...input, version: 1 }))
 *   .addMigration(2, (input) => ({ ...input, version: 2, newField: "default" }))
 *   .build((result) => v.parse(exportConfigV2Schema, result));
 *
 * const config = await migrations.migrate({ version: 1, ...data });
 * ```
 */
export class MigrationBuilder<In extends ExportConfigVersioned, Out> {
  private readonly migrations: MigrationDefinition[];
  private readonly lastVersion: number;

  private constructor(migrations: MigrationDefinition[], lastVersion: number) {
    this.migrations = migrations;
    this.lastVersion = lastVersion;
  }

  /**
   * Create a new migration builder starting with versioned config input
   */
  static create<T extends ExportConfigVersioned>(): MigrationBuilder<T, T> {
    return new MigrationBuilder<T, T>([], 0);
  }

  /**
   * Add a migration to the chain
   *
   * @param version - Version number (must be sequential: 1, 2, 3, ...)
   * @param migrate - Migration function transforming current output to new output
   * @returns New builder with updated output type
   * @throws MigrationError if version is invalid or not sequential
   */
  addMigration<NewOut>(
    version: number,
    migrate: MigrationFn<Out, NewOut>,
  ): MigrationBuilder<In, NewOut> {
    if (!Number.isInteger(version) || version < 1) {
      throw new MigrationError(`Version must be a positive integer, got: ${version}`);
    }

    const expectedVersion = this.lastVersion === 0 ? 1 : this.lastVersion + 1;
    if (version !== expectedVersion) {
      throw new MigrationError(
        `Version must be sequential: expected ${expectedVersion}, got ${version}`,
      );
    }

    const newMigrations: MigrationDefinition[] = [
      ...this.migrations,
      { version, migrate: migrate as MigrationFn<unknown, unknown> },
    ];

    return new MigrationBuilder<In, NewOut>(newMigrations, version);
  }

  /**
   * Build the migration chain
   *
   * @param parser - Function to validate and parse the final result.
   *                 Called after migrations complete OR when config is already at latest version.
   *                 This ensures type safety without unsafe casts.
   * @returns Executable migration chain
   * @throws MigrationError if no migrations have been added
   */
  build<ParsedOut>(
    parser: (input: Out) => ParsedOut | Promise<ParsedOut>,
  ): MigrationChain<ParsedOut> {
    if (this.migrations.length === 0) {
      throw new MigrationError("Cannot build migration chain with no migrations");
    }

    const migrations = [...this.migrations];
    const latestVersion = this.lastVersion;
    // Cast parser to accept unknown - type safety is ensured by the migration chain structure
    const parse = parser as (input: unknown) => ParsedOut | Promise<ParsedOut>;

    return {
      async migrate(config: ExportConfigVersioned): Promise<ParsedOut> {
        const configVersion = config.version;

        // Validate version is within supported range (0 means unversioned - run all migrations)
        if (configVersion < 0 || configVersion > latestVersion) {
          throw new MigrationError(
            `Unsupported config version ${configVersion}. Supported versions: 0 to ${latestVersion}`,
          );
        }

        if (configVersion === latestVersion) {
          return parse(config);
        }

        // For version 0 (unversioned), we start at index 0 to run all migrations
        let result: unknown = config;
        const migrationsToApply = migrations.slice(configVersion);
        for (const migration of migrationsToApply) {
          result = await migration.migrate(result);
        }

        return parse(result);
      },
    };
  }
}
