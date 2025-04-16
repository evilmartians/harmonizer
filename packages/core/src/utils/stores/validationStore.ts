import { effect, signal, type Signal, type WritableSignal } from "@spred/core";
import type { BaseIssue, BaseSchema } from "valibot";
import * as v from "valibot";

import { toSignal } from "@core/utils/spred/toSignal";

export type ValidationStore<Output> = {
  $raw: WritableSignal<Output>;
  $lastValidValue: Signal<Output>;
  $validationError: Signal<string | null>;
};

export function isValidationStore(store: unknown): store is ValidationStore<unknown> {
  if (typeof store !== "object" || store === null) {
    return false;
  }

  return "$raw" in store && "$lastValidValue" in store && "$validationError" in store;
}

export function validationStore<Input, Output>(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  initialValue: Exclude<Output, Function>,
  validationSchema:
    | BaseSchema<Input, Output, BaseIssue<unknown>>
    | Signal<BaseSchema<Input, Output, BaseIssue<unknown>>>,
): ValidationStore<Output> {
  const $raw = signal(initialValue);
  const $lastValidValue = signal(initialValue);
  const $validationSchema = toSignal(validationSchema);
  const $validationError = signal<string | null>(null);

  effect((get) => {
    const validationResult = v.safeParse(get($validationSchema), get($raw), {
      abortEarly: true,
      abortPipeEarly: true,
    });

    if (validationResult.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      $lastValidValue.set(validationResult.output as Exclude<Output, Function>);
    }

    $validationError.set(validationResult.success ? null : validationResult.issues[0].message);
  });

  return {
    $raw,
    $lastValidValue,
    $validationError,
  };
}
