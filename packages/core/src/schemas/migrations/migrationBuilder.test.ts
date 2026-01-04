import { describe, expect, it } from "vitest";

import { MigrationError } from "@core/utils/errors/MigrationError";

import { MigrationBuilder } from "./migrationBuilder";

type ConfigV1 = {
  version: number;
  name: string;
};

type ConfigV2 = {
  version: number;
  name: string;
  description: string;
};

type ConfigV3 = {
  version: number;
  title: string; // renamed from name
  description: string;
  tags: string[];
};

describe("MigrationBuilder", () => {
  describe("addMigration", () => {
    it.each([0, -1, 1.5])("should throw if version is not a positive integer", (invalidVersion) => {
      expect(() => {
        MigrationBuilder.create().addMigration(invalidVersion, (input) => input);
      }).toThrow(MigrationError);
    });

    it("should require migrations to be sequential starting from 1", () => {
      // First migration must be version 1
      expect(() => {
        MigrationBuilder.create().addMigration(2, (input) => input);
      }).toThrow(/expected 1, got 2/i);

      // Must be sequential
      const builder = MigrationBuilder.create().addMigration(1, (input) => input);

      expect(() => {
        builder.addMigration(3, (input) => input);
      }).toThrow(/expected 2, got 3/i);

      // Cannot repeat version
      expect(() => {
        builder.addMigration(1, (input) => input);
      }).toThrow(/expected 2, got 1/i);
    });

    it("should allow adding migrations in sequential order", () => {
      expect(() => {
        MigrationBuilder.create()
          .addMigration(1, (input) => input)
          .addMigration(2, (input) => input)
          .addMigration(3, (input) => input);
      }).not.toThrow();
    });
  });

  describe("build", () => {
    it("should throw if no migrations have been added", () => {
      expect(() => {
        MigrationBuilder.create<ConfigV1>().build((x): ConfigV1 => x);
      }).toThrow(MigrationError);
    });

    it("should return a migration chain", () => {
      const chain = MigrationBuilder.create<ConfigV1>()
        .addMigration(1, (input): ConfigV1 => input)
        .build((x): ConfigV1 => x);

      expect(chain).toHaveProperty("migrate");
    });
  });

  describe("MigrationChain", () => {
    describe("migrate", () => {
      it("should parse and return config if already at latest version", async () => {
        const chain = MigrationBuilder.create<ConfigV1>()
          .addMigration(1, (input): ConfigV1 => ({ ...input, version: 1 }))
          .build((result): ConfigV1 => ({ ...result, name: result.name.toUpperCase() }));

        const config: ConfigV1 = { version: 1, name: "test" };
        const result = await chain.migrate(config);

        expect(result).toEqual({ version: 1, name: "TEST" });
      });

      it("should apply single migration and parser", async () => {
        const chain = MigrationBuilder.create<ConfigV1>()
          .addMigration(
            1,
            (input): ConfigV2 => ({
              version: 1,
              name: input.name || "default",
              description: "",
            }),
          )
          .build((result): ConfigV2 => ({ ...result, description: "parsed" }));

        const result = await chain.migrate({ version: 0 } as ConfigV1);

        expect(result).toEqual({
          version: 1,
          name: "default",
          description: "parsed",
        });
      });

      it("should apply multiple migrations in sequence", async () => {
        const chain = MigrationBuilder.create<ConfigV1>()
          .addMigration(
            1,
            (input): ConfigV1 => ({
              version: 1,
              name: input.name || "default",
            }),
          )
          .addMigration(
            2,
            (input): ConfigV2 => ({
              version: 2,
              name: input.name,
              description: "added in v2",
            }),
          )
          .addMigration(
            3,
            (input): ConfigV3 => ({
              version: 3,
              title: input.name,
              description: input.description,
              tags: [],
            }),
          )
          .build((result): ConfigV3 => result);

        const result = await chain.migrate({ version: 0 } as ConfigV1);

        expect(result).toEqual({
          version: 3,
          title: "default",
          description: "added in v2",
          tags: [],
        });
      });

      it("should start from correct migration based on config version", async () => {
        const migrationCalls: number[] = [];

        const chain = MigrationBuilder.create<ConfigV1>()
          .addMigration(1, (input): ConfigV1 => {
            migrationCalls.push(1);
            return { version: 1, name: input.name || "default" };
          })
          .addMigration(2, (input): ConfigV2 => {
            migrationCalls.push(2);
            return { version: 2, name: input.name, description: "v2" };
          })
          .addMigration(3, (input): ConfigV3 => {
            migrationCalls.push(3);
            return { version: 3, title: input.name, description: input.description, tags: [] };
          })
          .build((result): ConfigV3 => result);

        await chain.migrate({ version: 2, name: "test", description: "existing" } as ConfigV2);

        expect(migrationCalls).toEqual([3]);
      });

      it("should support async migrations", async () => {
        const chain = MigrationBuilder.create<ConfigV1>()
          .addMigration(1, async (input): Promise<ConfigV2> => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return {
              version: 1,
              name: input.name || "async",
              description: "async migration",
            };
          })
          .build((result): ConfigV2 => result);

        const result = await chain.migrate({ version: 0 } as ConfigV1);

        expect(result).toEqual({
          version: 1,
          name: "async",
          description: "async migration",
        });
      });

      it("should throw if config version is higher than latest migration", async () => {
        const chain = MigrationBuilder.create<ConfigV1>()
          .addMigration(1, (input): ConfigV1 => ({ ...input, version: 1 }))
          .build((result): ConfigV1 => result);

        await expect(chain.migrate({ version: 5 } as ConfigV1)).rejects.toThrow(MigrationError);
      });

      it("should throw if config version is negative", async () => {
        const chain = MigrationBuilder.create<ConfigV1>()
          .addMigration(1, (input): ConfigV1 => ({ ...input, version: 1 }))
          .build((result): ConfigV1 => result);

        await expect(chain.migrate({ version: -1 } as ConfigV1)).rejects.toThrow(
          /Unsupported config version -1/,
        );
      });

      it("should support async parser", async () => {
        const chain = MigrationBuilder.create<ConfigV1>()
          .addMigration(1, (input): ConfigV1 => ({ ...input, version: 1 }))
          .build(async (result): Promise<ConfigV1> => {
            await new Promise((resolve) => setTimeout(resolve, 5));
            return { ...result, name: "async-parsed" };
          });

        const result = await chain.migrate({ version: 1, name: "test" } as ConfigV1);

        expect(result.name).toBe("async-parsed");
      });
    });
  });

  describe("type inference", () => {
    it("should correctly infer output type through chain and parser", async () => {
      const chain = MigrationBuilder.create<ConfigV1>()
        .addMigration(
          1,
          (input): ConfigV1 => ({
            version: 1,
            name: input.name || "default",
          }),
        )
        .addMigration(
          2,
          (input): ConfigV2 => ({
            version: 2,
            name: input.name,
            description: "",
          }),
        )
        .addMigration(
          3,
          (input): ConfigV3 => ({
            version: 3,
            title: input.name,
            description: input.description,
            tags: [],
          }),
        )
        .build((result): ConfigV3 => result);

      const result = await chain.migrate({ version: 0 } as ConfigV1);

      // TypeScript should know result is ConfigV3
      // This is a compile-time check - if types are wrong, this won't compile
      const title: string = result.title;
      const tags: string[] = result.tags;

      expect(title).toBe("default");
      expect(tags).toEqual([]);
    });
  });
});
