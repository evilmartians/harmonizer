export class ValidationError extends Error {
  constructor(message: string) {
    super(`[ValidationError]: ${message}`);
    this.name = "ValidationError";
  }
}
