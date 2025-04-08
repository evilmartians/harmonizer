import type { ValidationStore } from "./validationStore";

export function isValidationStore(store: unknown): store is ValidationStore<unknown> {
  if (typeof store !== "object" || store === null) {
    return false;
  }

  return "$raw" in store && "$lastValidValue" in store && "$validationError" in store;
}
