export class MigrationError extends Error {
  constructor(message: string) {
    super(`[MigrationError]: ${message}`);
    this.name = "MigrationError";
  }
}
