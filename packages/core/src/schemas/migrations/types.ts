import type { ExportConfigVersioned } from "@core/schemas/exportConfig";

export type MigrationFn<In, Out> = (input: In) => Out | Promise<Out>;

export type MigrationDefinition = {
  version: number;
  migrate: MigrationFn<unknown, ExportConfigVersioned>;
};

export type MigrationChain<Out> = {
  /**
   * Run all applicable migrations on the input config
   * @param config - Versioned config with version field
   * @returns Promise resolving to the fully migrated config
   * @throws MigrationError if version gap detected or migration fails
   */
  migrate: (config: ExportConfigVersioned) => Promise<Out>;
};
