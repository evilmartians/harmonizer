import { isSignal } from "@core/utils/spred/isSignal";

import { isValidationStore } from "./isValidationStore";
import {
  SIGNAL_KEY_PREFIX,
  type StoreReactivePaths,
  type StoreReactiveValue,
  type AnyStore,
} from "./types";

export function getStoreReactiveValue<
  T extends AnyStore,
  Key extends StoreReactivePaths<T> & string,
>(object: T, key: Key): StoreReactiveValue<T, Key> {
  const value: unknown = object[key] || object[`${SIGNAL_KEY_PREFIX}${key}`];

  if (isSignal(value)) {
    return value.value as StoreReactiveValue<T, Key>;
  } else if (isValidationStore(value)) {
    return value.$raw.value as StoreReactiveValue<T, Key>;
  }

  throw new Error(
    `getStoreReactiveValue: ${key} is not a signal or validation store. Received ${typeof value}`,
  );
}
